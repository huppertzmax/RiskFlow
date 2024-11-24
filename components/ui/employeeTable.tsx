import React from "react";
import { Table, Group, Avatar, Text, Badge, Space } from '@mantine/core';
import { Employee } from "@/lib/types"; // Adjust the import path based on your project structure

interface EmployeeTableProps {
  employees: Employee[];
}

export function EmployeeTable({ employees }: EmployeeTableProps) {
  return (
    <Table withColumnBorders highlightOnHover verticalSpacing="sm" horizontalSpacing="md">
      <thead>
      <tr>
        <th style={{ textAlign: "left" }}><Text><strong>Employee</strong></Text></th>
        <th style={{ textAlign: "left" }}><Text><strong>Role</strong></Text></th>
          <th style={{ textAlign: "left" }}><Text><strong>Status</strong></Text></th>
      </tr>
      </thead>
      <Space h={10}/>
      <tbody>
      {employees.map((employee) => (
        <tr key={employee.id}>
          <td>
            <Group >
              <Avatar radius="xl" size="md" color="gray">
                {employee.name[0]}
              </Avatar>
              <Text size="md">
                {employee.name}
              </Text>
            </Group>
          </td>
          <td>
            <Text size="md">{employee.role}</Text>
          </td>
          <td>
            <Badge
              color={employee.status === "Available" ? "green" : "red"}
              size="md"
              radius="lg"
              variant="filled"
            >
              {employee.status.toUpperCase()}
            </Badge>
          </td>
        </tr>
      ))}
      </tbody>
    </Table>
  );
}
