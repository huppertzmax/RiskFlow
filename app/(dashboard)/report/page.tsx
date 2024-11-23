"use client";
import React from "react";
import { FloatingIndicator, Tabs, Container, SimpleGrid, Button, Center, Space, Grid } from '@mantine/core';
import classes from "./report.module.scss";
import AccordionComponent from '@/components/ui/AccordionComponent';
import '@mantine/tiptap/styles.css';

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
export default function ReportPage() {
  return (
    <div>
      <TabsElement />
    </div>
  );
}

function TabsElement() {
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
          <Tabs.Tab value="3" ref={setControlRef("3")} className={classes.tab}>
            Report History
          </Tabs.Tab>
          <FloatingIndicator
            target={value ? controlsRefs[value] : null}
            parent={rootRef}
            className={classes.indicator}
          />
        </Tabs.List>
        <Space h={30} />
        <Tabs.Panel
          value="1"
          className={classes.scrollableTab} // Add scrollable styles to this panel
        >
          <AccordionComponent />
        </Tabs.Panel>

        <Tabs.Panel value='2'>
          <Grid justify="space-between">
            <Grid.Col span={7} className="m-5">
              <TableComponent />
            </Grid.Col>
            <Grid.Col span={4} className="m-5">
              <Space h={50}/>
              <InputForm />
            </Grid.Col>
          </Grid>

          <Center>
            <Space h={150} />
            < TextEditorModal/>
          </Center>

        </Tabs.Panel>
        <Tabs.Panel value='3'>
          test
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}







import { useState } from 'react';
import { Table, Checkbox } from '@mantine/core';
import InputForm from '@/components/ui/inputForm';
import TextEditor from '@/components/ui/textEditior';
import TextEditorModal from '@/components/ui/textEditorModal';
import TextEditorInfoTable from '@/components/ui/textEditorInfoTable';



function TableComponent() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]); // Track selected rows by their IDs

  const rows = vulnerabilitiesList.map((vulnerability) => (
    <Table.Tr
      key={vulnerability.id}
      bg={selectedRows.includes(vulnerability.id) ? 'var(--mantine-color-blue-light)' : undefined}
    >
      <Table.Td>
        <Checkbox
          aria-label="Select row"
          checked={selectedRows.includes(vulnerability.id)}
          onChange={(event) =>
            setSelectedRows(
              event.currentTarget.checked
                ? [...selectedRows, vulnerability.id]
                : selectedRows.filter((id) => id !== vulnerability.id)
            )
          }
          styles={{
            input: {
              backgroundColor: selectedRows.includes(vulnerability.id) ? '#000028' : 'transparent',
              borderColor: '#000028',
            },
          }}
        />
      </Table.Td>
      <Table.Td>{vulnerability.label}</Table.Td>
      <Table.Td>{vulnerability.content.system_id}</Table.Td>
      <Table.Td>{vulnerability.content.severity}</Table.Td>
      <Table.Td>
        {`${vulnerability.content.risk_scores.probability_score} / ${vulnerability.content.risk_scores.impact_score}`}
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th />
          <Table.Th>Label</Table.Th>
          <Table.Th>System ID</Table.Th>
          <Table.Th>Severity</Table.Th>
          <Table.Th>Risk Score (Probability / Impact)</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}
