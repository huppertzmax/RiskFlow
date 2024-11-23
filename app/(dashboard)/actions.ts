'use server';
import { read } from '@/lib/neo4j'
import {versionToNumericVersion} from '@/lib/utils'
import { EXAMPLE_CVE } from './investigation/example-cve';


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
export async function runRiskAnalysis(cves: typeof EXAMPLE_CVE[], infectedSystems: typeof selectedSystems) {
  let affectedSystems = new Map<number, object>();

  await findAffectedSystems(cves, affectedSystems);
  affectedSystems.clear();
  affectedSystems.set(253566941, {id: 253566941, name: "test2", cves: ['cve1','cve2']})
  await findInternetAccessibleSystems(affectedSystems, infectedSystems);
  
  return affectedSystems;
}

async function findAffectedSystems(cves: any [], affectedSystems: Map<number, object>) {
  for (let i = 0; i < cves.length; i++) {
    const systemList = await findAffectedSystemsByCVE(cves[i]);
    
    systemList.forEach(sys => {
      if (affectedSystems.has(sys.id) && !affectedSystems.get(sys.id).cves.includes(cves[i].id)) {
        affectedSystems.get(sys.id).cves.push(cves[i].id);
      }
      else {
        affectedSystems.set(sys.id, sys);
      }
    })
  }
}

async function findAffectedSystemsByCVE(cve) {
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
    res = res.filter(sys => {
      if (idSet.has(sys.id)) {return false;}
      else {
        idSet.add(sys.id);
        return true;
      }
    })
    res = res.map(sys => {return {id: sys.id.low, name: sys.name, cves: [cve.id]}});
    selectedSystems.push(...res);
  }
  return selectedSystems;
}

export async function findInternetAccessibleSystems(affectedSystems: Map<number, object>, infectedSystems: typeof selectedSystems) {
  const inf = infectedSystems.map(sys => {return sys.id});
  const af = Array.from(affectedSystems.keys());
  
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
    infected_systems: infectedSystems.map(sys => {return sys.id}),
    affected_systems: Array.from(affectedSystems.keys()),
  });
  console.log(res);
  res.forEach(sys => {
    if (affectedSystems.has(sys.id.low)) {
      affectedSystems.get(sys.id.low)['accessible_from_internet'] = true;
    }
  })
}