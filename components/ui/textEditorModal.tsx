import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Grid } from '@mantine/core';
import TextEditor from '@/components/ui/textEditior';
import '@mantine/tiptap/styles.css';
import React from 'react';
import TextEditorInfoTable from '@/components/ui/textEditorInfoTable';
import { Vulnerability } from '@/lib/types';

interface TextEditorModalProps {
  vulnerabilities: Vulnerability[]; // Add vulnerabilities as a prop
}

export default function TextEditorModal({ vulnerabilities }: TextEditorModalProps) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Generate Management Report"
        centered
        fullScreen
      >
        <Grid className="mx-10">
          {/* Pass vulnerabilities to TextEditorInfoTable */}
          <Grid.Col span={5} className="ml-5 mt-10">
            <TextEditorInfoTable vulnerabilities={vulnerabilities} />
          </Grid.Col>
          <Grid.Col span={7}>
            <TextEditor />
          </Grid.Col>
        </Grid>
      </Modal>
      <Button onClick={open} color={'#000028'}>
        Generate Management Report
      </Button>
    </>
  );
}
