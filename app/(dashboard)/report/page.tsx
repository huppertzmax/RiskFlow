"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  FloatingIndicator,
  Tabs,
  Container,
  Grid,
  Space,
  Center,
} from "@mantine/core";
import classes from "./report.module.scss";
import AccordionComponent from "@/components/ui/AccordionComponent";
import InputForm from "@/components/ui/inputForm";
import TextEditorModal from "@/components/ui/textEditorModal";
import { TableComponentReport } from "@/components/ui/tableComponentReport";
import { getVulnerabilityList } from "../state";
import { Vulnerability } from "@/lib/types";

export default function ReportPage() {
  return (
    <div>
      <TabsElement />
    </div>
  );
}

function TabsElement() {
  const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>("1");
  const [vulnerabilitiesList, setVulnerabilitiesList] = useState<Vulnerability[]>([]); // Initialize as empty array
  const [loading, setLoading] = useState(true); // Loading state

  // Initialize ref outside of conditional logic
  const controlRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const setControlRef = (tabId: string) => (node: HTMLButtonElement | null) => {
    if (node) {
      controlRefs.current[tabId] = node;
    }
  };

  useEffect(() => {
    async function fetchVulnerabilities() {
      try {
        const data = await getVulnerabilityList(); // Await the async function
        setVulnerabilitiesList(data); // Update the state
      } catch (error) {
        console.error("Error fetching vulnerabilities:", error);
      } finally {
        setLoading(false); // Set loading to false
      }
    }

    fetchVulnerabilities();
  }, []); // Empty dependency array ensures this runs once

  // Conditional render loading state outside of hooks
  if (loading) {
    return <div>Loading vulnerabilities...</div>;
  }

  return (
    <Container fluid>
      <Tabs variant="none" value={activeTab} onChange={setActiveTab} className="m-5">
        {/* Tabs Navigation */}
        <Tabs.List ref={setRootRef} className={classes.list}>
          {["Technical Report", "Management Report", "Report History"].map((tab, index) => {
            const tabId = (index + 1).toString();
            return (
              <Tabs.Tab
                key={tabId}
                value={tabId}
                ref={setControlRef(tabId)}
                className={classes.tab}
              >
                {tab}
              </Tabs.Tab>
            );
          })}
          <FloatingIndicator
            target={activeTab ? controlRefs.current[activeTab] : null}
            parent={rootRef}
            className={classes.indicator}
          />
        </Tabs.List>

        {/* Tabs Content */}
        <Space h="xl" />
        <Tabs.Panel value="1" className={classes.scrollableTab}>
          <AccordionComponent vulnerabilities={vulnerabilitiesList} />
        </Tabs.Panel>

        <Tabs.Panel value="2">
          <Grid justify="space-between">
            <Grid.Col span={7}>
              <TableComponentReport vulnerabilities={vulnerabilitiesList} />
            </Grid.Col>
            <Grid.Col span={4}>
              <InputForm />
            </Grid.Col>
          </Grid>

          <Center mt="xl">
            <TextEditorModal vulnerabilities={vulnerabilitiesList}/>
          </Center>
        </Tabs.Panel>

        <Tabs.Panel value="3">
          <Center mt="xl">
            <p>Report history content goes here...</p>
          </Center>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}
