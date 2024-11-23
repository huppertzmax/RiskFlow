import {
  Accordion,
  Avatar,
  Button,
  Flex,
  Group,
  Space,
  Text,
} from "@mantine/core";
import React from "react";
import { Vulnerability } from '@/lib/types';



interface AccordionComponentProps {
  vulnerabilities: Vulnerability[];
}


export default function AccordionComponent({
                                             vulnerabilities,
                                           }: AccordionComponentProps) {
  const renderList = (
    items: any[],
    renderItem: (item: any, index: number) => React.ReactNode
  ) => items.map((item, index) => <React.Fragment key={index}>{renderItem(item, index)}</React.Fragment>);

  const renderAccordionItems = vulnerabilities.map(
    ({
       id,
       label,
       image,
       description,
       content: {
         human_readable,
         system_id,
         severity,
         risk_scores,
         reasons,
         responsible_personnel,
         cve_summary,
         recommended_actions,
       },
     }) => (
      <Accordion.Item value={id} key={id}>
        <Accordion.Control>
          <AccordionLabel label={label} image={image} description={description} />
        </Accordion.Control>
        <Accordion.Panel>
          <Text size="sm" mb="xs">
            <strong>Summary:</strong> {human_readable}
          </Text>
          <Text size="sm" mb="xs">
            <strong>System ID:</strong> {system_id}
          </Text>
          <Text size="sm" mb="xs">
            <strong>Severity:</strong> {severity}
          </Text>

          <Text size="sm" mb="xs">
            <strong>Risk Scores:</strong>
          </Text>
          <ul style={{ marginLeft: "20px", marginBottom: "10px" }}>
            {renderList(
              [
                `Probability Score: ${risk_scores.probability_score}`,
                `Impact Score: ${risk_scores.impact_score}`,
                `Overall Danger: ${risk_scores.overall_danger}`,
              ],
              (score) => <li>{score}</li>
            )}
          </ul>

          <Text size="sm" mb="xs">
            <strong>Reasons for Probability:</strong>
          </Text>
          <ul style={{ marginLeft: "20px", marginBottom: "10px" }}>
            {renderList(reasons.probability, ({ cve, epss, description }) => (
              <li>
                CVE: {cve}, EPSS: {epss}, Description: {description}
              </li>
            ))}
          </ul>

          <Text size="sm" mb="xs">
            <strong>Impact Reasons:</strong>
          </Text>
          <ul style={{ marginLeft: "20px", marginBottom: "10px" }}>
            {renderList(reasons.impact, (impactReason) => <li>{impactReason}</li>)}
          </ul>

          <Text size="sm" mb="xs">
            <strong>Responsible Personnel:</strong>
          </Text>
          <ul style={{ marginLeft: "20px", marginBottom: "10px" }}>
            {renderList(
              [
                `Technical Contacts: ${responsible_personnel.technical_contacts.join(", ")}`,
                `Manager: ${responsible_personnel.manager}`,
              ],
              (personnel) => <li>{personnel}</li>
            )}
          </ul>

          <Text size="sm" mb="xs">
            <strong>CVE Summary:</strong>
          </Text>
          <ul style={{ marginLeft: "20px", marginBottom: "10px" }}>
            {renderList(
              [
                `CVE ID: ${cve_summary.cve_id}`,
                `Occurrences: ${cve_summary.occurrences}`,
                `Notes: ${cve_summary.notes}`,
              ],
              (summary) => <li>{summary}</li>
            )}
          </ul>

          <Text size="sm" mb="xs">
            <strong>Recommended Actions:</strong>
          </Text>
          <ul style={{ marginLeft: "20px", marginBottom: "10px" }}>
            {renderList(
              [
                `Isolate Network: ${recommended_actions.isolate_network}`,
                `Patchable: ${recommended_actions.patchable ? "Yes" : "No"}`,
                `Patch Timeline: ${recommended_actions.patch_timeline}`,
              ],
              (action) => <li>{action}</li>
            )}
          </ul>
          <Space h={20} />
          <Flex gap={20}>
            <Button color="#000028">Create Tasks</Button>
            <Button color="#000028">Select for Management Report</Button>
          </Flex>
        </Accordion.Panel>
      </Accordion.Item>
    )
  );

  return <Accordion chevronPosition="right" variant="contained">{renderAccordionItems}</Accordion>;
}

function AccordionLabel({ label, image, description }: AccordionLabelProps) {
  return (
    <Group wrap="nowrap">
      <Avatar src={image} radius="xl" size="lg" />
      <div>
        <Text>{label}</Text>
        <Text size="sm" color="dimmed" weight={400}>
          {description}
        </Text>
      </div>
    </Group>
  );
}

interface AccordionLabelProps {
  label: string;
  image: string;
  description: string;
}
