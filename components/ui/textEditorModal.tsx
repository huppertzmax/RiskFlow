import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Grid } from '@mantine/core';
import TextEditor from '@/components/ui/textEditior';
import '@mantine/tiptap/styles.css';
import React from 'react';
import TextEditorInfoTable from '@/components/ui/textEditorInfoTable';
export default function TextEditorModal() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Generate Management Report"  centered fullScreen={true}>
        <Grid className="mx-10">
          <Grid.Col span={5} className="ml-5 mt-10">
          <TextEditorInfoTable/>
          </Grid.Col>
          <Grid.Col span={7} className=""> <TextEditor/></Grid.Col>
        </Grid>

      </Modal>
      <Button onClick={open} color={'#000028'}>Generate Management Report</Button>
    </>
  );
}
