import { Employee, Task, Vulnerability } from "@/lib/types";

// Get the list of vulnerabilities
export async function getVulnerabilityList(): Promise<Vulnerability[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "system-vulnerability-247012576",
          color: "red",
          label: "Critical Vulnerability in System 247012576",
          description: "A critical vulnerability impacting a high-value client system.",
          content: {
            system_id: "247012576",
            severity: "High",
            human_readable:
              "The system is exposed to a high probability of exploitation due to recurring vulnerabilities, requiring immediate action such as network isolation and patching within 30 days.",
            risk_scores: {
              probability_score: 5.5,
              impact_score: 3.3,
              overall_danger: "Medium",
            },
            reasons: {
              probability: [
                {
                  cve: "CVE-1900-8033",
                  epss: 3.5,
                  description: "Exploitable condition increasing likelihood of attack.",
                },
                {
                  cve: "CVE-1900-8033",
                  epss: 0.1,
                  description: "Low likelihood due to specific conditions.",
                },
                {
                  cve: "CVE-1900-8033",
                  epss: 3.3,
                  description: "Moderate probability from misconfigurations.",
                },
              ],
              impact: [
                "The system is critical to operations.",
                "Classified as a client device.",
                "CVSS Score of 5.5 indicates significant impact.",
              ],
            },
            recommended_actions: {
              isolate_network: "Recommended to prevent lateral movement.",
              patchable: true,
              patch_timeline: "30 days recommended for remediation.",
            },
            responsible_personnel: {
              technical_contacts: ["Bob Ross", "John Cena"],
              manager: "John Wayne",
            },
            cve_summary: {
              cve_id: "CVE-1900-8033",
              occurrences: 3,
              notes: "Recurring issue across multiple components.",
            },
          },
        },
        {
          id: "system-vulnerability-347895321",
          color: "yellow",
          label: "Moderate Vulnerability in System 347895321",
          description: "A moderate vulnerability affecting a web server.",
          content: {
            system_id: "347895321",
            severity: "Medium",
            human_readable:
              "The web server is exposed to medium-risk vulnerabilities due to outdated software. Update to the latest version is strongly recommended.",
            risk_scores: {
              probability_score: 3.8,
              impact_score: 2.7,
              overall_danger: "Low",
            },
            reasons: {
              probability: [
                {
                  cve: "CVE-2021-33894",
                  epss: 2.8,
                  description: "Outdated software allows partial access.",
                },
              ],
              impact: [
                "Server hosts non-critical data.",
                "Publicly accessible service.",
                "Low CVSS score of 4.1.",
              ],
            },
            recommended_actions: {
              isolate_network: "Not required.",
              patchable: true,
              patch_timeline: "15 days recommended for patching.",
            },
            responsible_personnel: {
              technical_contacts: ["Alice Smith"],
              manager: "Michael Scott",
            },
            cve_summary: {
              cve_id: "CVE-2021-33894",
              occurrences: 1,
              notes: "Outdated service dependency.",
            },
          },
        },
      ]);
    }, 3000); // 3-second delay
  });
}

// Get the list of tasks
export async function getTasks(): Promise<Task[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          title: "Patch Vulnerability CVE-2023-12345",
          description: "Apply the latest security patch to servers A and B.",
          urgency: "High",
        },
        {
          id: 2,
          title: "Isolate Affected Network",
          description: "Segment the network to prevent further exploitation.",
          urgency: "Medium",
        },
        {
          id: 3,
          title: "Run Security Scan",
          description: "Perform a complete vulnerability scan after patching.",
          urgency: "Low",
        },
      ]);
    }, 500); // 3-second delay
  });
}

// Get the list of employees
export async function getEmployees(): Promise<Employee[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: "Alice Johnson", role: "Network Engineer", status: "Available" },
        { id: 2, name: "Bob Smith", role: "Security Specialist", status: "Busy" },
        { id: 3, name: "Charlie Brown", role: "System Admin", status: "Available" },
      ]);
    }, 500); // 3-second delay
  });
}
