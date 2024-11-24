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
import { getVulnerabilityList as generateVulnerabilityList } from "../state";
import { EnrichedReport, Vulnerability } from "@/lib/types";
import { getAnalysisStatus, getFirstFinishedReportId, getReportById } from "../actions/analysis-db-actions";

function TabsElement() {
  const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>("1");
  const [vulnerabilitiesList, setVulnerabilitiesList] = useState<Vulnerability[]>([]); // Initialize as empty array
  const [loading, setLoading] = useState(true); // Loading state
  const [report, setReport] = useState<EnrichedReport | null>(null);

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
        // check the last report id
        const { isProcessing } = await getAnalysisStatus();
        setLoading(isProcessing);
        const finishedReport = await getFirstFinishedReportId() as EnrichedReport;
        setVulnerabilitiesList(finishedReport.gpt_vulnerabilities);
        setReport(finishedReport);
      } catch (error) {
        console.error("Error fetching vulnerabilities:", error);
      }
    }
    fetchVulnerabilities();
  }, []);

  return (<div>
    {loading && <div>Loading newest vulnerabilities...</div>}
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
            <TextEditorModal vulnerabilities={vulnerabilitiesList} />
          </Center>
        </Tabs.Panel>
        <Tabs.Panel value="3">
          <Center mt="xl">
            <p>Report history content goes here...</p>
          </Center>
        </Tabs.Panel>
      </Tabs>
    </Container>
  </div>
  );
}
