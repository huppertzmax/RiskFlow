"use client";

import React, { useState } from "react";
import { Table, Checkbox, Badge } from "@mantine/core";
import { Vulnerability } from "@/lib/types";

interface TableComponentReportProps {
  vulnerabilities: Vulnerability[];
}

export function TableComponentReport({ vulnerabilities }: TableComponentReportProps) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Handle row selection logic
  const handleRowSelection = (id: string, isSelected: boolean) => {
    setSelectedRows((prevSelected) =>
      isSelected
        ? [...prevSelected, id] // Add the selected row
        : prevSelected.filter((rowId) => rowId !== id) // Remove the unselected row
    );
  };

  // Function to determine the badge color based on severity
  const getBadgeColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "red";
      case "medium":
        return "yellow";
      case "low":
        return "green";
      default:
        return "gray";
    }
  };

  // Generate table rows
  const rows = vulnerabilities.map((vulnerability) => {
    const isSelected = selectedRows.includes(vulnerability.id);

    return (
      <Table.Tr
        key={vulnerability.id}
        bg={isSelected ? "var(--mantine-color-blue-light)" : undefined}
      >
        <Table.Td>
          <Checkbox
            aria-label="Select row"
            checked={isSelected}
            onChange={(e) => handleRowSelection(vulnerability.id, e.currentTarget.checked)}
            styles={{
              input: {
                backgroundColor: isSelected ? "#000028" : "transparent",
                borderColor: "#000028",
              },
            }}
          />
        </Table.Td>
        <Table.Td>{vulnerability.label}</Table.Td>
        <Table.Td>{vulnerability.content.system_id}</Table.Td>
        <Table.Td>
          <Badge color={getBadgeColor(vulnerability.content.severity)}>
            {vulnerability.content.severity.toUpperCase()}
          </Badge>
        </Table.Td>
        <Table.Td>
          {`${vulnerability.content.risk_scores.probability_score} / ${vulnerability.content.risk_scores.impact_score}`}
        </Table.Td>
        <Table.Td>
          <Badge color={getBadgeColor(vulnerability.content.risk_scores.overall_danger)}>
            {vulnerability.content.risk_scores.overall_danger.toUpperCase()}
          </Badge>
        </Table.Td>
        <Table.Td>{vulnerability.content.recommended_actions.patch_timeline}</Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th />
          <Table.Th>Label</Table.Th>
          <Table.Th>System ID</Table.Th>
          <Table.Th>Severity</Table.Th>
          <Table.Th>Risk Score (Probability / Impact)</Table.Th>
          <Table.Th>Overall Danger</Table.Th>
          <Table.Th>Patch Timeline</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}
