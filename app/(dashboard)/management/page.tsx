"use client";

import React, { useState } from "react";
import { Center, Container, Grid, Space, Button, TextInput, Modal, Select } from "@mantine/core";

// Define Types for Task and Tasks State
interface Task {
  id: number;
  user: string;
  title: string;
  description: string;
}

type Tasks = {
  [key: string]: Task[];
};

export default function ManagementPage() {
  return (
    <div>
      <KanbanBoard />
    </div>
  );
}

const KanbanBoard: React.FC = () => {
  // Initial Kanban Data
  const [tasks, setTasks] = useState<Tasks>({
    Open: [
      { id: 1, user: "Alice", title: "Analyze the requirements", description: "Ensure all edge cases are covered" },
      { id: 2, user: "Bob", title: "Write user stories", description: "Focus on core features" },
    ],
    InProgress: [
      { id: 3, user: "Charlie", title: "Design the architecture", description: "Use microservices approach" },
    ],
    Testing: [],
    Closed: [],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    user: "",
    title: "",
    description: "",
  });
  const [selectedColumn, setSelectedColumn] = useState<string>("Open");

  // Add New Task Handler
  const addTask = () => {
    if (!newTask.title.trim() || !newTask.user.trim() || !newTask.description.trim()) return;

    const newTaskObject: Task = {
      id: Date.now(),
      user: newTask.user,
      title: newTask.title,
      description: newTask.description,
    };

    setTasks({
      ...tasks,
      [selectedColumn]: [...tasks[selectedColumn], newTaskObject],
    });

    setNewTask({ user: "", title: "", description: "" });
    setIsModalOpen(false);
  };

  // Drag and Drop Handlers
  const onDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    taskId: number,
    status: string
  ) => {
    e.dataTransfer.setData("taskId", taskId.toString());
    e.dataTransfer.setData("status", status);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: string) => {
    const taskId = parseInt(e.dataTransfer.getData("taskId"));
    const currentStatus = e.dataTransfer.getData("status");

    const taskToMove = tasks[currentStatus].find((task) => task.id === taskId);
    if (!taskToMove) return;

    const updatedSource = tasks[currentStatus].filter(
      (task) => task.id !== taskId
    );

    const updatedTarget = [...tasks[newStatus], taskToMove];

    setTasks({
      ...tasks,
      [currentStatus]: updatedSource,
      [newStatus]: updatedTarget,
    });
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Column Layout
  const columns: string[] = ["Open", "InProgress", "Testing", "Closed"];

  return (
    <Container className="p-10">
      {/* Add Task Button */}
        <Button onClick={() => setIsModalOpen(true)} variant="filled" color="#000028">
          Add Task
        </Button>
      <Space h={20}/>

      {/* Modal for Adding Task */}
      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Task"
      >
        <div className="space-y-4">
          <Select
            label="Assign User"
            placeholder="Pick a user"
            data={["Alice", "Bob", "Charlie"]}
            value={newTask.user}
            onChange={(value) => setNewTask({ ...newTask, user: value || "" })}
          />
          <TextInput
            label="Task Title"
            placeholder="Enter task title"
            value={newTask.title}
            onChange={(e) =>
              setNewTask({ ...newTask, title: e.currentTarget.value })
            }
          />
          <TextInput
            label="Task Description"
            placeholder="Enter task description"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.currentTarget.value })
            }
          />
          <Select
            label="Select Column"
            placeholder="Pick a column"
            data={columns}
            value={selectedColumn}
            onChange={(value) => setSelectedColumn(value || "Open")}
          />
          <Button onClick={addTask} variant="filled" color="#000028">
            Add Task
          </Button>
        </div>
      </Modal>

      {/* Kanban Board */}
      <div>
        <Grid
          gutter="xl"
          columns={13}
        >
          {columns.map((column) => (
            <Grid.Col
              key={column}
              span={3}
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, column)}
              className="p-3 border rounded-lg bg-gray-200 border-gray-300 m-4"
              style={{ minHeight: 300, width: "250px" }} // Fixed width for static columns
            >
              <h3 className="font-bold text-base text-center mb-2 text-gray-800">
                {column}
              </h3>
              <div className="space-y-2">
                {tasks[column].map((task) => (
                  <div
                    key={task.id}
                    className="p-2 bg-white shadow-sm rounded-md text-sm text-gray-700 hover:shadow-md cursor-pointer transition-transform transform hover:-translate-y-1"
                    draggable
                    onDragStart={(e) => onDragStart(e, task.id, column)}
                  >
                    <p className="font-medium">{task.title}</p>
                    <p className="text-xs">{task.description}</p>
                    <p className="text-xs italic text-gray-500">Assigned to: {task.user}</p>
                  </div>
                ))}
              </div>
            </Grid.Col>
          ))}
        </Grid>
      </div>
    </Container>
  );
};
