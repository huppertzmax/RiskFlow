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
import ReportSummaryCharts from "./report-summary";
import { Spinner } from "@/components/icons";

export default function ReportPage() {
  const [vulnerabilitiesList, setVulnerabilitiesList] = useState<Vulnerability[]>([]);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<EnrichedReport | null>(null);

  useEffect(() => {
    async function fetchVulnerabilities() {
      try {
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

  return (
    <>
      {report && <ReportSummaryCharts report={report} />}
      <TabsElement
        loading={loading}
        vulnerabilitiesList={vulnerabilitiesList}
        report={report}
      />
    </>
  );
}

function TabsElement({
  loading,
  vulnerabilitiesList
}: {
  loading: boolean;
  vulnerabilitiesList: Vulnerability[];
  report: EnrichedReport | null;
}) {
  const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>("1");
  const controlRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const setControlRef = (tabId: string) => (node: HTMLButtonElement | null) => {
    if (node) {
      controlRefs.current[tabId] = node;
    }
  };

  return (
    <div>
      {loading && (
        <div className="flex flex-col items-center justify-center p-8">
          <div className="text-lg mb-4">The newest report is being generated. Please wait...</div>
          <div className="flex items-center">
            {spinner}
            <span className="ml-2 animate-pulse">Loading...</span>
          </div>
        </div>
      )}
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
