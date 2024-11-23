import { useDisclosure } from '@mantine/hooks';
import { Modal, Button } from '@mantine/core';
import TextEditor from '@/components/ui/textEditior';
import '@mantine/tiptap/styles.css';
export default function TextEditorModal() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Generate Management Report"  centered fullScreen={true}>
        <TextEditor/>
      </Modal>
      <Button onClick={open} color={'#000028'}>Generate Management Report</Button>
    </>
  );
}
