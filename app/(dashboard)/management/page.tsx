"use client";

import { useEffect, useState } from 'react';
import { Table, Accordion, Grid, Space, Button, Badge, Text, Group, Avatar } from "@mantine/core";
import KanbanBoard from "@/components/ui/kanbanboard";
import { getEmployees, getTasks } from '../state';
import { Employee, Task } from '@/lib/types';
import { TaskAccordion } from '@/components/ui/taskAccordion.txs';
import { EmployeeTable } from '@/components/ui/employeeTable';
import { spinner } from '@/components/ui/spinner-svg';

export default function ManagementPage() {
  const [tasks, setTasks] = useState<Task[]>([]); // Initialize as an empty array
  const [employees, setEmployees] = useState<Employee[]>([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    async function fetchData() {
      try {
        const [tasksData, employeesData] = await Promise.all([
          getTasks(), // Fetch tasks
          getEmployees(), // Fetch employees
        ]);

        setTasks(tasksData); // Update tasks state
        setEmployees(employeesData); // Update employees state
      } catch (error) {
        console.error("Failed to fetch data:", error); // Handle errors
      } finally {
        setLoading(false); // Stop loading regardless of success or failure
      }
    }

    fetchData();
  }, []); // Empty dependency array ensures this runs only once

  if (loading) {
    return <><div className="p-8">Loading tasks and employees.</div>{spinner}</>; // Render loading message or spinner
  }

  return (
    <div>
      {/* Kanban Board */}
      <KanbanBoard />
      <Space h={100} />

      {/* Grid Layout */}

      <Grid justify='space-around'>
        {/* Proposed Tasks Column */}
        <Grid.Col span={5}>
          <Text size='lg' mb='sm'>
            <strong>Proposed Tasks</strong>
          </Text>
          <TaskAccordion tasks={tasks} />
        </Grid.Col>

        {/* Available Employees Column */}
        <Grid.Col span={5}>
          <Text size='lg' mb='sm'>
            <strong>Available Employees</strong>
          </Text>
          <EmployeeTable employees={employees} />

        </Grid.Col>
      </Grid>
    </div>
  );
}
