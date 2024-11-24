"use client";

import React, { useState } from "react";
import {
  AppShell,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Modal,
  Select,
  Space,
  Text,
  TextInput,
  Title,
  Textarea,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import "@mantine/dates/styles.css";

// Define Types for Task and Tasks State
interface Task {
  id: number;
  user: string;
  title: string;
  description: string;
  urgency: "Low" | "Medium" | "High";
  dueDate: Date | null;
}

type Tasks = {
  [key: string]: Task[];
};

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Tasks>({
    Open: [
      {
        id: 1,
        user: "Alice",
        title: "Analyze the requirements",
        description: "Ensure all edge cases are covered",
        urgency: "Medium",
        dueDate: new Date(),
      },
      {
        id: 2,
        user: "Bob",
        title: "Write user stories",
        description: "Focus on core features",
        urgency: "Low",
        dueDate: null,
      },
    ],
    InProgress: [
      {
        id: 3,
        user: "Charlie",
        title: "Design the architecture",
        description: "Use microservices approach",
        urgency: "High",
        dueDate: new Date(),
      },
    ],
    Testing: [],
    Closed: [],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newTask, setNewTask] = useState<Task>({
    id: 0,
    user: "",
    title: "",
    description: "",
    urgency: "Low",
    dueDate: null,
  });
  const [selectedColumn, setSelectedColumn] = useState<string>("Open");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const columns: string[] = ["Open", "InProgress", "Testing", "Closed"];

  const addTask = () => {
    if (!newTask.title || !newTask.user || !newTask.description) return;

    const newTaskObject: Task = {
      ...newTask,
      id: Date.now(),
    };

    setTasks({
      ...tasks,
      [selectedColumn]: [...tasks[selectedColumn], newTaskObject],
    });

    setNewTask({
      id: 0,
      user: "",
      title: "",
      description: "",
      urgency: "Low",
      dueDate: null,
    });
    setIsModalOpen(false);
  };

  const onDragStart = (e: React.DragEvent, taskId: number, column: string) => {
    e.dataTransfer.setData("taskId", taskId.toString());
    e.dataTransfer.setData("column", column);
  };

  const onDrop = (e: React.DragEvent, newColumn: string) => {
    const taskId = parseInt(e.dataTransfer.getData("taskId"));
    const currentColumn = e.dataTransfer.getData("column");

    const taskToMove = tasks[currentColumn].find((task) => task.id === taskId);
    if (!taskToMove) return;

    setTasks({
      ...tasks,
      [currentColumn]: tasks[currentColumn].filter((task) => task.id !== taskId),
      [newColumn]: [...tasks[newColumn], taskToMove],
    });
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const openTaskModal = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setSelectedTask(null);
    setIsTaskModalOpen(false);
  };

  const updateTaskDetails = () => {
    if (!selectedTask) return;

    const updatedTasks = { ...tasks };
    const column = Object.keys(updatedTasks).find((key) =>
      updatedTasks[key].some((task) => task.id === selectedTask.id)
    );

    if (column) {
      updatedTasks[column] = updatedTasks[column].map((task) =>
        task.id === selectedTask.id ? selectedTask : task
      );

      setTasks(updatedTasks);
    }

    closeTaskModal();
  };

  return (
    <AppShell padding="md">
      <Container>
        <Space h={30} />

        <Flex>
          <Button
            onClick={() => setIsModalOpen(true)}
            radius="md"
            size="lg"
            style={{
              backgroundColor: "#000028",
              color: "white",
            }}
          >
            Add Task
          </Button>
        </Flex>
        <Space h="lg" />

        {/* Modal for Adding Task */}
        <Modal
          opened={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add New Task"
        >
          <Select
            label="Assign User"
            placeholder="Pick a user"
            data={["Alice", "Bob", "Charlie"]}
            value={newTask.user}
            onChange={(value) =>
              setNewTask({ ...newTask, user: value || "" })
            }
          />
          <TextInput
            label="Task Title"
            placeholder="Enter task title"
            value={newTask.title}
            onChange={(e) =>
              setNewTask({ ...newTask, title: e.currentTarget.value })
            }
            mt="md"
          />
          <Textarea
            label="Task Description"
            placeholder="Enter task description"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.currentTarget.value })
            }
            mt="md"
          />
          <Select
            label="Urgency"
            placeholder="Select urgency"
            data={["Low", "Medium", "High"]}
            value={newTask.urgency}
            onChange={(value) =>
              setNewTask({ ...newTask, urgency: value as "Low" | "Medium" | "High" })
            }
            mt="md"
          />
          <TextInput
            label="Due Date"
            value={
              newTask.dueDate
                ? newTask.dueDate.toLocaleDateString()
                : "Select a date"
            }
            onClick={() => setIsDatePickerOpen(true)}
            readOnly
            mt="md"
          />
          {isDatePickerOpen && (
            <DatePicker
              value={newTask.dueDate}
              onChange={(value) => {
                setNewTask({ ...newTask, dueDate: value });
                setIsDatePickerOpen(false); // Close the picker
              }}
              mt="xs"
            />
          )}
          <Select
            label="Select Column"
            placeholder="Pick a column"
            data={columns}
            value={selectedColumn}
            onChange={(value) => setSelectedColumn(value || "Open")}
            mt="md"
          />
          <Button
            fullWidth
            mt="lg"
            onClick={addTask}
            radius="md"
            style={{
              backgroundColor: "#000028",
              color: "white",
            }}
          >
            Add Task
          </Button>
        </Modal>

        {/* Modal for Viewing Task */}
        <Modal
          opened={isTaskModalOpen}
          onClose={closeTaskModal}
          title={`Edit Task: ${selectedTask?.title || ""}`}
        >
          {selectedTask && (
            <>
              <Select
                label="Assign User"
                data={["Alice", "Bob", "Charlie"]}
                value={selectedTask.user}
                onChange={(value) =>
                  setSelectedTask({
                    ...selectedTask,
                    user: value || "",
                  } as Task)
                }
                mt="md"
              />
              <TextInput
                label="Description"
                value={selectedTask.description}
                onChange={(e) =>
                  setSelectedTask({
                    ...selectedTask,
                    description: e.currentTarget.value,
                  } as Task)
                }
                mt="md"
              />
              <Select
                label="Urgency"
                data={["Low", "Medium", "High"]}
                value={selectedTask.urgency}
                onChange={(value) =>
                  setSelectedTask({
                    ...selectedTask,
                    urgency: value as "Low" | "Medium" | "High",
                  } as Task)
                }
                mt="md"
              />
              <TextInput
                label="Due Date"
                value={
                  selectedTask.dueDate
                    ? selectedTask.dueDate.toLocaleDateString()
                    : "Select a date"
                }
                onClick={() => setIsDatePickerOpen(true)}
                readOnly
                mt="md"
              />
              {isDatePickerOpen && (
                <DatePicker
                  value={selectedTask.dueDate}
                  onChange={(value) => {
                    setSelectedTask({
                      ...selectedTask,
                      dueDate: value,
                    } as Task);
                    setIsDatePickerOpen(false); // Close the picker
                  }}
                  mt="xs"
                />
              )}
              <Button
                fullWidth
                mt="lg"
                onClick={updateTaskDetails}
                radius="md"
                style={{
                  backgroundColor: "#000028",
                  color: "white",
                }}
              >
                Save Changes
              </Button>
            </>
          )}
        </Modal>

        {/* Kanban Board */}
        <Grid>
          {columns.map((column) => (
            <Grid.Col
              key={column}
              span={3}
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, column)}
            >
              <Card
                shadow="xs"
                p="md"
                radius="md"
                withBorder
                style={{
                  backgroundColor: "#efefef", // Light gray
                  minHeight: 350,
                }}
              >
                <Title order={4} mb="sm">
                  {column}
                </Title>
                {tasks[column].map((task) => (
                  <Card
                    key={task.id}
                    shadow="xs"
                    p="sm"
                    radius="md"
                    mb="sm"
                    draggable
                    onDragStart={(e: any) => onDragStart(e, task.id, column)}
                    onClick={() => openTaskModal(task)} // Open task modal on click
                    style={{
                      cursor: "pointer",
                      backgroundColor: "white",
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <Text weight={600}>{task.title}</Text>
                    <Text size="sm" color="dimmed">
                      Urgency: {task.urgency}
                    </Text>
                  </Card>
                ))}
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </AppShell>
  );
}
