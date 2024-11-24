'use server';
import { read } from '@/lib/neo4j'
import {versionToNumericVersion} from '@/lib/utils'
import { EXAMPLE_CVE } from './investigation/example-cve';
import {calculateRiskScores} from 'app/(dashboard)/scoring'
import {Report} from '@/lib/types'


const selectedSystems = [
  {
    "id": 247012576,
    "name": "Virtual Server"
  }
]

const systems = [
  {
    "system_id": "247012576",
    "risk": {
      "accessible_from_internet": true,
      "network_segment_risk": "low",
      "critical_system": true,
      "system_type": "server"
    }
  },
]
const relevantPersons = [
  {
    "system_id": "247012576",
    "persons": {
      "technical": ["Bob Ross", "John Cena"],
      "manager": ["John Wayne"],
    }
  },
]
const recommendedActions = [
  {
    "system_id": "247012576",
    "actions": {
      "technical": ["Bob Ross", "John Cena"],
      "manager": ["John Wayne"],
    }
  }
]

const exampleResults = {
  systems,
  relevantPersons,
  recommendedActions
}

// input: 
export async function runRiskAnalysis(cves: typeof EXAMPLE_CVE[], infectedSystems: typeof selectedSystems): Promise<Report> {
  let affectedSystems = new Map<number, any>();
  const start = performance.now();
  console.log("Started analysis run")
  await findAffectedSystems(cves, affectedSystems);

  let chunks = splitSystemIdsInChunks(affectedSystems, affectedSystems.size/32);

  const internetAccessPromises = chunks.map(chunk => findInternetAccessibleSystems(chunk, infectedSystems));
  const criticalSystemPromises = chunks.map(chunk => findNumberCriticalSystemsInNetworkSeg(chunk));
  const exposedSystemPromises = chunks.map(chunk => findExposedSystemsInSegment(chunk));


  await Promise.all([
  ...internetAccessPromises,
  ...criticalSystemPromises,
  ...exposedSystemPromises,
  findSystemInfos(affectedSystems),
  findPersons(affectedSystems),
  ]);

  console.log("Ended analysis run")
  const end = performance.now();
  console.log(`Execution Time: ${(end - start)/1000} sec`);
  
  const result: Report = calculateRiskScores(affectedSystems, cves)
  return result;
}

function splitSystemIdsInChunks(affectedSystems: Map<number, any>, chunkSize: number) {
  const chunks: Map<any, any>[] = [];
  const entries = Array.from(affectedSystems.entries());

  for (let i = 0; i < entries.length; i += chunkSize) {
    const chunkEntries = entries.slice(i, i + chunkSize); 
    chunks.push(new Map(chunkEntries)); 
  }

  return chunks;
} 

async function findAffectedSystems(cves: any[], affectedSystems: Map<number, any>) {
  for (let i = 0; i < cves.length; i++) {
    const systemList = await findAffectedSystemsByCVE(cves[i]);
    
    systemList.forEach((sys: any) => {
      if (affectedSystems.has(sys.id) && !affectedSystems.get(sys.id).cves.includes(cves[i].id)) {
        affectedSystems.get(sys.id).cves.push(cves[i].id);
      } else {
        affectedSystems.set(sys.id, sys);
      }
    });
  }
}

async function findAffectedSystemsByCVE(cve: any) {
  const selectedSystems = [];
  const idSet = new Set<number>();
  for (let i = 0; i < cve.affected_cpe.length; i++) {
    const cpe = cve.affected_cpe[i];

    let res = await read(`
      Match (sy:System)-[related_software]->(s:SoftwareInstallation) 
      WHERE toLower(s.publisher) CONTAINS $vendor AND toLower(s.product) CONTAINS $product AND s.numeric_Version >= $min_version AND s.numeric_Version <= $max_version 
      RETURN distinct sy.id as id, sy.sub_type as name;
      `,
      {
        vendor: cpe.vendor,
        product: cpe.product,
        min_version: versionToNumericVersion(cpe.min_version),
        max_version: versionToNumericVersion(cpe.max_version),
      });
    res = res.filter((sys: any) => {
      if (idSet.has(sys.id)) {return false;}
      else {
        idSet.add(sys.id);
        return true;
      }
    })
    res = res.map((sys: any) => {return {
      id: sys.id.low,
      risk : {
        accessible_from_internet: false,
        network_segment_risk: 0,
        network_segment_exposed: 0,
        critical_system: false,
        system_type: "",
      },
      persons : {
        technical: [],
        manager: [],
      },
      name: sys.name,
      cves: [cve.id],
    }});
    selectedSystems.push(...res);
  }
  return selectedSystems;
}

async function findInternetAccessibleSystems(affectedSystems: Map<number, any>, infectedSystems: typeof selectedSystems) {
  if (!infectedSystems) {
    let res = await read(`
      MATCH (s:System WHERE s.id IN $affected_systems)
      WHERE 
      NOT (s)-[:related_hostname]->() 
      OR
      EXISTS {
        MATCH (s)-[:related_ipaddress]->(:IPAddress)-[:in_segment]->(:VirtualNetworkSegment)<-[:in_segment]-(:IPAddress)<-[:related_ipaddress]-(s2:System WHERE s2.id IN $infected_systems)
      }
      RETURN s.id as id;
      `,
    {
      infected_systems: (infectedSystems as any[]).map((sys: any) => {return sys.id}),
      affected_systems: Array.from(affectedSystems.keys()),
    });
    res.forEach((sys: any) => {
      if (affectedSystems.has(sys.id.low)) {
        affectedSystems.get(sys.id.low)!['risk']['accessible_from_internet'] = true;
      }
    });
  }
}

async function findNumberCriticalSystemsInNetworkSeg(affectedSystems: Map<number, any>) {
  let res = await read(`
    MATCH (s:System)-[:related_ipaddress]->(:IPAddress)-[:in_segment]->(:VirtualNetworkSegment)<-[:in_segment]-(:IPAddress)<-[:related_ipaddress]-(s2:System)
    WHERE s.id IN $affected_systems AND s2.critical = 1
    RETURN s.id AS id, COUNT(s2) AS count_critical;
    `,
  {
    affected_systems: Array.from(affectedSystems.keys()),
  });
  res.forEach((sys: any) => {
    if (affectedSystems.has(sys.id)) {
      affectedSystems.get(sys.id)!['risk']['network_segment_risk'] = sys.count_critical.low;
    }
  });
}

async function findSystemInfos(affectedSystems: Map<number, any>) {
  let res = await read(`
    MATCH (s:System where s.id IN $affected_systems) return s.id as id, s.critical as critical, s.type as type
    `,
  {
    affected_systems: Array.from(affectedSystems.keys()),
  });
  res.forEach((sys: any) => {
    if (affectedSystems.has(sys.id)) {
      affectedSystems.get(sys.id)!['risk']['critical_system'] = sys.critical.low == 1;
      affectedSystems.get(sys.id)!['risk']['system_type'] = sys.type;
    }
  });
}

async function findExposedSystemsInSegment(affectedSystems: Map<number, any>) {
  let res = await read(`
    MATCH (s2:System WHERE s2.id IN $affected_systems)-[:related_ipaddress]->(:IPAddress)-[:in_segment]->(:VirtualNetworkSegment)<-[:in_segment]-(:IPAddress)<-[:related_ipaddress]-(s:System)
    WHERE NOT (s)-[:related_hostname]->() 
    RETURN s2.id as id, COUNT(s) as count_exposed;    
  `,
  {
    affected_systems: Array.from(affectedSystems.keys()),
  });
  res.forEach((sys: any) => {
    if (affectedSystems.has(sys.id)) {
      affectedSystems.get(sys.id)!['risk']['network_segment_exposed'] = sys.count_exposed.low;
    }
  });
}

async function findPersons(affectedSystems: Map<number, any>) {
  let res = await read(`
    MATCH (s:System WHERE s.id IN $affected_systems)<-[:runs_on]-(:Application)-[:owned_by]->(:OrgUnit)<-[:head_of]-(m:Person)
    CALL {
    WITH s
    MATCH (s)<-[:assigned_for]-(:AssignedSystemRole)<-[:role_assigned]-(p:Person) 
    RETURN p.fullname as technican LIMIT 3
    }
    RETURN s.id as id, COLLECT(technican) as technicans, m.fullname as manager
    `,
    {
      affected_systems: Array.from(affectedSystems.keys()),
    });
    res.forEach((sys: any) => {
      if (affectedSystems.has(sys.id)) {
        affectedSystems.get(sys.id)!['persons']['technical'] = [...sys.technicans];
        affectedSystems.get(sys.id)!['persons']['manager'] = [sys.manager];
      }
    });
}