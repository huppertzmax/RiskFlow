'use server';

export const EXAMPLE_CVE = {
  "id": "CVE-1900-8033",
  "name": "Critical Remote Code Execution Vulnerability in Docker",
  "date": "2024-11-20",
  "description": "A critical vulnerability has been discovered in Docker’s container runtime, identified as CVE-1900-8033. This vulnerability allows an attacker to execute arbitrary code on the host system by exploiting a flaw in the handling of API requests. The issue arises from improper validation of input data, leading to a buffer overflow condition. Impact: Successful exploitation of this vulnerability can lead to remote code execution, allowing attackers to gain control over the host system. This can result in data breaches, service disruptions, and unauthorized access to sensitive information.",
  "epss": 96.89,
  "cvss": {
    "base_score": 5.5,
    "exploitability_score": 1.3,
    "impact_score": 5.8,
    "access_vector": "network",
    "access_complexity": "medium",
    "authentication": "none",
    "confidentiality_impact": "complete",
    "integrity_impact": "complete",
    "availability_impact": "complete"
  },
  "affected_cpe": [
    {
      "vendor": "docker",
      "product": "docker",
      "min_version": "23.0",
      "max_version": "26.1.3"
    },
    {
      "vendor": "docker",
      "product": "cli",
      "min_version": "23.0",
      "max_version": "26.1.3"
    },
    {
      "vendor": "docker",
      "product": "desktop",
      "min_version": "23.0",
      "max_version": "26.1.3"
    }
  ],
  "solution": "Currently, there is no official solution available. Implement network segmentation to limit exposure. Monitor systems for unusual activity and apply security best practices."
}

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
  return exampleResults
}
