import React, { useState } from 'react';
import { Table, Checkbox, TextInput, Button, List, Text, Title, Space, Flex } from '@mantine/core';
import { Vulnerability } from '@/lib/types';

interface TextEditorInfoTableProps {
  vulnerabilities: Vulnerability[];
  onSendEmail: (email: string) => void;
  sending: boolean;
}

export default function TextEditorInfoTable({ vulnerabilities, onSendEmail, sending }: TextEditorInfoTableProps) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [notified, setNotified] = useState(false);

  const handleNotify = () => {
    // if (recipientEmail && phoneNumber) {
    //   alert(`Notification sent to ${recipientName || 'Recipient'} via email: ${recipientEmail} and phone: ${phoneNumber}`);
    //   setNotified(true);
    // } else {
    //   alert('Please fill out both email and phone number fields before notifying.');
    // }
    if (recipientEmail) {
      onSendEmail(recipientEmail);
      setNotified(true);
    }
  };

  return (
    <>
      <Space h={40} />
      <Title>Max Mustermann</Title>
      <Space h={20} />
      <Flex align="end" gap={20}>
        <TextInput
          style={{ width: 200 }}
          label="Recipient Email"
          placeholder="Enter recipient's email"
          type="email"
          value={recipientEmail}
          onChange={(event) => setRecipientEmail(event.currentTarget.value)}
        />
        <Button
          style={{ marginTop: '10px', backgroundColor: '#000028', color: '#fff' }}
          onClick={handleNotify}
        >
          Notify via Mail
        </Button>
      </Flex>
      {/* <Space h={20} />
      <Flex align="end" gap={20}>
        <TextInput
          style={{ width: 200 }}
          label="Phone Number"
          placeholder="Enter recipient's phone number"
          value={phoneNumber}
          onChange={(event) => setPhoneNumber(event.currentTarget.value)}
        />
        <Button
          style={{ marginTop: '10px', backgroundColor: '#000028', color: '#fff' }}
          onClick={handleNotify}
        >
          Notify via SMS
        </Button>
      </Flex> */}

      <Space h={50} />

      <Text weight={500} size="lg" style={{ marginBottom: '10px' }}>
        Vulnerabilities:
      </Text>
      <List>
        {vulnerabilities.map((vulnerability) => (
          <List.Item key={vulnerability.id}>{vulnerability.label}</List.Item>
        ))}
      </List>
      <Space h={20} />

    </>
  );
}
