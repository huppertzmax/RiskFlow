import { Accordion, Badge, Button, Group, Text } from '@mantine/core';
import { Task } from '@/lib/types';

interface TaskAccordionProps {
  tasks: Task[]; // Array of tasks to display in the accordion
}

export function TaskAccordion({ tasks }: TaskAccordionProps) {
  return (
    <Accordion chevronPosition="right" variant="default">
      {tasks.map((task) => (
        <TaskAccordionItem key={task.id} task={task} />
      ))}
    </Accordion>
  );
}

// Reusable component for an individual accordion item
interface TaskAccordionItemProps {
  task: Task;
}

function TaskAccordionItem({ task }: TaskAccordionItemProps) {
  return (
    <Accordion.Item value={task.id.toString()}>
      <Accordion.Control>
        <Group>
          <Text>{task.title}</Text>
          <Badge
            color={
              task.urgency === "High"
                ? "red"
                : task.urgency === "Medium"
                  ? "yellow"
                  : "green"
            }
          >
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
  );
}
