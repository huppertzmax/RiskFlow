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
export async function runRiskAnalysis(cves: typeof EXAMPLE_CVE[], systems: typeof selectedSystems[]) {
  const affectedSystems = [];
  let newSystems = [];
  for (let i = 0; i < cves.length; i++) {
    const systemList = await selectAffectedSystems(cves[i]);
    for (let j = 0; j < systemList.length; j++) {
      let exists = false;
      let k = 0;
      for (; k < affectedSystems.length; k++) {
        if (affectedSystems[k].id == systemList[j].id) {
          exists = true;
          break;
        }
      }
      if (exists && !affectedSystems[k].cve.includes(cves[i].id)) {
        affectedSystems[k].cve.push(cves[i].id);
      }
      else {
        newSystems.push(systemList[j]);
      }
    }
    affectedSystems.push(...newSystems);
    newSystems = [];
  }
  return affectedSystems;
}

export async function selectAffectedSystems(cve: typeof EXAMPLE_CVE) {
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
    res = res.map(sys => {return {id: sys.id.low, name: sys.name, cve: [cve.id]}});
    selectedSystems.push(...res);
  }
  return selectedSystems;
}