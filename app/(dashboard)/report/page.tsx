"use client";
import React, { useState } from "react";
import { FloatingIndicator, Tabs, Container, Accordion } from "@mantine/core";
import classes from "./report.module.scss";

export default function ReportPage() {
  return (
    <div>
      <Demo />
    </div>
  );
}

function Demo() {
  const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
  const [value, setValue] = useState<string | null>("1");
  const [controlsRefs, setControlsRefs] = useState<
    Record<string, HTMLButtonElement | null>
  >({});
  const setControlRef = (val: string) => (node: HTMLButtonElement) => {
    controlsRefs[val] = node;
    setControlsRefs(controlsRefs);
  };

  return (
    <Container fluid>
      <Tabs variant="none" value={value} onChange={setValue} className="m-5">
        <Tabs.List ref={setRootRef} className={classes.list}>
          <Tabs.Tab value="1" ref={setControlRef("1")} className={classes.tab}>
            Technical Report
          </Tabs.Tab>
          <Tabs.Tab value="2" ref={setControlRef("2")} className={classes.tab}>
            Management Report
          </Tabs.Tab>
          <FloatingIndicator
            target={value ? controlsRefs[value] : null}
            parent={rootRef}
            className={classes.indicator}
          />
        </Tabs.List>

        {/* Scrollable First Tab */}
        <Tabs.Panel
          value="1"
          className={classes.scrollableTab} // Add scrollable styles to this panel
        >
          <AccordionDemo />
        </Tabs.Panel>

        <Tabs.Panel value="2">Second tab content</Tabs.Panel>
      </Tabs>
    </Container>
  );
}

import { Group, Avatar, Text } from "@mantine/core";

const vulnerabilitiesList = [
  {
    id: "system-vulnerability-247012576",
    image: "/Images/circle-red.png",
    label: "Critical Vulnerability in System 247012576",
    description: "A critical vulnerability impacting a high-value client system.",
    content: {
      system_id: "247012576",
      severity: "High",
      human_readable: "The system is exposed to a high probability of exploitation due to recurring vulnerabilities, requiring immediate action such as network isolation and patching within 30 days.",
      risk_scores: {
        probability_score: 5.5,
        impact_score: 3.3,
        overall_danger: "Medium"
      },
      reasons: {
        probability: [
          {
            cve: "CVE-1900-8033",
            epss: 3.5,
            description: "Exploitable condition increasing likelihood of attack."
          },
          {
            cve: "CVE-1900-8033",
            epss: 0.1,
            description: "Low likelihood due to specific conditions."
          },
          {
            cve: "CVE-1900-8033",
            epss: 3.3,
            description: "Moderate probability from misconfigurations."
          }
        ],
        impact: [
          "The system is critical to operations.",
          "Classified as a client device.",
          "CVSS Score of 5.5 indicates significant impact."
        ]
      },
      recommended_actions: {
        isolate_network: "Recommended to prevent lateral movement.",
        patchable: true,
        patch_timeline: "30 days recommended for remediation."
      },
      responsible_personnel: {
        technical_contacts: ["Bob Ross", "John Cena"],
        manager: "John Wayne"
      },
      cve_summary: {
        cve_id: "CVE-1900-8033",
        occurrences: 3,
        notes: "Recurring issue across multiple components."
      }
    }
  },
  {
    id: "system-vulnerability-347895321",
    image: "/Images/circle-yellow.png",
    label: "Moderate Vulnerability in System 347895321",
    description: "A moderate vulnerability affecting a web server.",
    content: {
      system_id: "347895321",
      severity: "Medium",
      human_readable: "The web server is exposed to medium-risk vulnerabilities due to outdated software. Update to the latest version is strongly recommended.",
      risk_scores: {
        probability_score: 3.8,
        impact_score: 2.7,
        overall_danger: "Low"
      },
      reasons: {
        probability: [
          {
            cve: "CVE-2021-33894",
            epss: 2.8,
            description: "Outdated software allows partial access."
          }
        ],
        impact: [
          "Server hosts non-critical data.",
          "Publicly accessible service.",
          "Low CVSS score of 4.1."
        ]
      },
      recommended_actions: {
        isolate_network: "Not required.",
        patchable: true,
        patch_timeline: "15 days recommended for patching."
      },
      responsible_personnel: {
        technical_contacts: ["Alice Smith"],
        manager: "Michael Scott"
      },
      cve_summary: {
        cve_id: "CVE-2021-33894",
        occurrences: 1,
        notes: "Outdated service dependency."
      }
    }
  },
  {
    id: "system-vulnerability-158963741",
    image: "/Images/circle-green.png",
    label: "High Vulnerability in Database 158963741",
    description: "A database vulnerability caused by weak access controls.",
    content: {
      system_id: "158963741",
      severity: "High",
      human_readable: "Weak access controls on a critical database allow unauthorized modifications, requiring immediate restriction of permissions.",
      risk_scores: {
        probability_score: 4.9,
        impact_score: 4.5,
        overall_danger: "High"
      },
      reasons: {
        probability: [
          {
            cve: "CVE-2020-44832",
            epss: 4.7,
            description: "Improper access control mechanism."
          }
        ],
        impact: [
          "Contains sensitive client information.",
          "Accessible by unauthorized personnel.",
          "CVSS score of 7.2."
        ]
      },
      recommended_actions: {
        isolate_network: "Strongly recommended.",
        patchable: true,
        patch_timeline: "Immediate action required."
      },
      responsible_personnel: {
        technical_contacts: ["Tim Cook", "Elon Musk"],
        manager: "Jeff Bezos"
      },
      cve_summary: {
        cve_id: "CVE-2020-44832",
        occurrences: 1,
        notes: "Weak access policy on database schema."
      }
    }
  },
  {
    id: "system-vulnerability-487561234",
    image: "/Images/circle-red.png",
    label: "Critical Remote Code Execution (RCE) Vulnerability",
    description: "A critical RCE vulnerability allowing attackers full access to the system.",
    content: {
      system_id: "487561234",
      severity: "Critical",
      human_readable: "RCE vulnerability allows attackers to execute arbitrary code on the server. Immediate patching and isolation are required.",
      risk_scores: {
        probability_score: 6.0,
        impact_score: 5.5,
        overall_danger: "Critical"
      },
      reasons: {
        probability: [
          {
            cve: "CVE-2022-34567",
            epss: 6.0,
            description: "Public exploit available."
          }
        ],
        impact: [
          "Direct access to internal systems.",
          "Leads to full compromise.",
          "CVSS score of 9.8."
        ]
      },
      recommended_actions: {
        isolate_network: "Critical recommendation.",
        patchable: true,
        patch_timeline: "Immediate patching required."
      },
      responsible_personnel: {
        technical_contacts: ["Larry Page"],
        manager: "Sergey Brin"
      },
      cve_summary: {
        cve_id: "CVE-2022-34567",
        occurrences: 1,
        notes: "Exploit already in use in the wild."
      }
    }
  },
  {
    id: "system-vulnerability-635849213",
    image: "/Images/circle-green.png",
    label: "Configuration Mismanagement in System 635849213",
    description: "Configuration issues exposing sensitive ports.",
    content: {
      system_id: "635849213",
      severity: "High",
      human_readable: "Sensitive ports are exposed due to mismanagement of firewall rules. Restrict access immediately.",
      risk_scores: {
        probability_score: 4.5,
        impact_score: 4.0,
        overall_danger: "High"
      },
      reasons: {
        probability: [
          {
            cve: "CVE-2023-10234",
            epss: 4.3,
            description: "Ports accessible from public networks."
          }
        ],
        impact: [
          "Critical systems at risk.",
          "Potential for lateral movement.",
          "CVSS score of 7.5."
        ]
      },
      recommended_actions: {
        isolate_network: "Recommended.",
        patchable: false,
        patch_timeline: "Configuration update required within 7 days."
      },
      responsible_personnel: {
        technical_contacts: ["Sundar Pichai"],
        manager: "Satya Nadella"
      },
      cve_summary: {
        cve_id: "CVE-2023-10234",
        occurrences: 1,
        notes: "Firewall misconfigurations exposing sensitive ports."
      }
    }
  }
  // Add 3 more similar objects based on this structure as needed
];



interface AccordionLabelProps {
  label: string;
  image: string;
  description: string;
}

function AccordionLabel({ label, image, description }: AccordionLabelProps) {
  return (
    <Group wrap="nowrap">
      <Avatar src={image} radius="xl" size="lg" />
      <div>
        <Text>{label}</Text>
        <Text size="sm" c="dimmed" fw={400}>
          {description}
        </Text>
      </div>
    </Group>
  );
}

function AccordionDemo() {
  const items = vulnerabilitiesList.map((item) => (
    <Accordion.Item value={item.id} key={item.label}>
      <Accordion.Control>
        <AccordionLabel {...item} />
      </Accordion.Control>
      <Accordion.Panel>

        <Text size="sm" mb="xs"><strong>Summary:</strong> {item.content.human_readable}</Text>

        <Text size="sm" mb="xs"><strong>System ID:</strong> {item.content.system_id}</Text>
        <Text size="sm" mb="xs"><strong>Severity:</strong> {item.content.severity}</Text>

        <Text size="sm" mb="xs"><strong>Risk Scores:</strong></Text>
        <ul style={{ marginLeft: '20px', marginBottom: '10px' }}>
          <li>Probability Score: {item.content.risk_scores.probability_score}</li>
          <li>Impact Score: {item.content.risk_scores.impact_score}</li>
          <li>Overall Danger: {item.content.risk_scores.overall_danger}</li>
        </ul>

        <Text size="sm" mb="xs"><strong>Reasons for Probability:</strong></Text>
        <ul style={{ marginLeft: '20px', marginBottom: '10px' }}>
          {item.content.reasons.probability.map((reason, index) => (
            <li key={index}>
              CVE: {reason.cve}, EPSS: {reason.epss}, Description: {reason.description}
            </li>
          ))}
        </ul>

        <Text size="sm" mb="xs"><strong>Impact Reasons:</strong></Text>
        <ul style={{ marginLeft: '20px', marginBottom: '10px' }}>
          {item.content.reasons.impact.map((impactReason, index) => (
            <li key={index}>{impactReason}</li>
          ))}
        </ul>


        <Text size="sm" mb="xs"><strong>Responsible Personnel:</strong></Text>
        <ul style={{ marginLeft: '20px', marginBottom: '10px' }}>
          <li>Technical Contacts: {item.content.responsible_personnel.technical_contacts.join(', ')}</li>
          <li>Manager: {item.content.responsible_personnel.manager}</li>
        </ul>

        <Text size="sm" mb="xs"><strong>CVE Summary:</strong></Text>
        <ul style={{ marginLeft: '20px', marginBottom: '10px' }}>
          <li>CVE ID: {item.content.cve_summary.cve_id}</li>
          <li>Occurrences: {item.content.cve_summary.occurrences}</li>
          <li>Notes: {item.content.cve_summary.notes}</li>
        </ul>

        <Text size="sm" mb="xs"><strong>Recommended Actions:</strong></Text>
        <ul style={{ marginLeft: '20px', marginBottom: '10px' }}>
          <li>Isolate Network: {item.content.recommended_actions.isolate_network}</li>
          <li>Patchable: {item.content.recommended_actions.patchable ? 'Yes' : 'No'}</li>
          <li>Patch Timeline: {item.content.recommended_actions.patch_timeline}</li>
        </ul>

      </Accordion.Panel>

    </Accordion.Item>
  ));

  return (
    <Accordion chevronPosition="right" variant="contained">
      {items}
    </Accordion>
  );
}
