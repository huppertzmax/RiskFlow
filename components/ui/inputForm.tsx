import { useForm } from '@mantine/form';
import { TextInput, Button, Group, Textarea, Space } from '@mantine/core';
import { randomId } from '@mantine/hooks';

export default function InputForm() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      content: '',
    },
  });

  return (
    <div>
      <TextInput
        label="Name"
        placeholder="Name"
        key={form.key('name')}
        {...form.getInputProps('name')}
      />
      <Space h={20}/>
      <Textarea
        placeholder="Additional Information"
        label="Additional Information"
        autosize
        minRows={6}
        key={form.key('content')}
        {...form.getInputProps('content')}
      />


      <Group justify="center" mt="xl">

      </Group>
    </div>
  );
}
