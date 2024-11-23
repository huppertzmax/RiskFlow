"use client";

import { useState } from "react";
import { Table, Accordion, Grid, Space, Button, Badge, Text, Group, Avatar } from "@mantine/core";
import KanbanBoard from "@/components/ui/kanbanboard";

export default function ManagementPage() {
  const [tasks] = useState([
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

  const [employees] = useState([
    { id: 1, name: "Alice Johnson", role: "Network Engineer", status: "Available" },
    { id: 2, name: "Bob Smith", role: "Security Specialist", status: "Busy" },
    { id: 3, name: "Charlie Brown", role: "System Admin", status: "Available" },
  ]);

  return (
    <div>
      {/* Kanban Board */}
      <KanbanBoard />
      <Space h={100} />

      {/* Grid Layout */}

      <Grid justify="space-around">
        {/* Proposed Tasks Column */}
        <Grid.Col span={5}>
          <Text size="lg" mb="sm">
            <strong>Proposed Tasks</strong>
          </Text>


          <Accordion>
            {tasks.map((task) => (
              <Accordion.Item value={task.id.toString()} key={task.id}>
                <Accordion.Control>
                  <Group >
                    <Text>{task.title}</Text>
                    <Badge color={task.urgency === "High" ? "red" : task.urgency === "Medium" ? "yellow" : "green"}>
                      {task.urgency}
                    </Badge>
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <Text size="sm">{task.description}</Text>
                  <Button
                    variant="filled"
                    mt="md"
                    radius="md"
                    size="xs"
                    style={{
                      backgroundColor: "#000028",
                      color: "white",
                    }}
                    onClick={() => alert(`Task "${task.title}" added`)}
                  >
                    Assign Task
                  </Button>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </Grid.Col>

        {/* Available Employees Column */}
        <Grid.Col span={5}>
          <Text weight={600} size="lg" mb="sm">
            <strong>Available Employees</strong>
          </Text>
          <Table  withColumnBorders highlightOnHover>
            <thead>
            <tr>
              <th>Employee</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
            </thead>
            <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>
                  <Group>
                    <Avatar radius="xl">{employee.name[0]}</Avatar>
                    <Text>{employee.name}</Text>
                  </Group>
                </td>
                <td>{employee.role}</td>
                <td>
                  <Badge color={employee.status === "Available" ? "green" : "red"}>
                    {employee.status}
                  </Badge>
                </td>
              </tr>
            ))}
            </tbody>
          </Table>
        </Grid.Col>
      </Grid>
    </div>
  );
}
