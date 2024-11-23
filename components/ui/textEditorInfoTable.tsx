import React, { useState } from 'react';
import { Table, Checkbox, TextInput, NumberInput, Button, Grid, List, Text, Title, Space, Flex } from '@mantine/core';
import { getVulnerabilityList } from '../../app/(dashboard)/state';

export default function TextEditorInfoTable() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState( undefined);
  const [notified, setNotified] = useState(false);
  const [vulnerabilitiesList, setVulnerabilitiesList] = useState(getVulnerabilityList())


  const handleNotify = () => {
    if (recipientEmail && phoneNumber) {
      alert(`Notification sent to ${recipientName || 'Recipient'} via email: ${recipientEmail} and phone: ${phoneNumber}`);
      setNotified(true);
    } else {
      alert('Please fill out both email and phone number fields before notifying.');
    }
  };

  const rows = vulnerabilitiesList.map((vulnerability) => (
    <Table.Tr
      key={vulnerability.id}
      bg={selectedRows.includes(vulnerability.id) ? 'var(--mantine-color-blue-light)' : undefined}
    >
      <Table.Td>
        <Checkbox
          aria-label="Select row"
          checked={selectedRows.includes(vulnerability.id)}
          onChange={(event) =>
            setSelectedRows(
              event.currentTarget.checked
                ? [...selectedRows, vulnerability.id]
                : selectedRows.filter((id) => id !== vulnerability.id)
            )
          }
          styles={{
            input: {
              backgroundColor: selectedRows.includes(vulnerability.id) ? '#000028' : 'transparent',
              borderColor: '#000028',
            },
          }}
        />
      </Table.Td>
      <Table.Td>{vulnerability.label}</Table.Td>
      <Table.Td>{vulnerability.content.system_id}</Table.Td>
      <Table.Td>{vulnerability.content.severity}</Table.Td>
      <Table.Td>
        {`${vulnerability.content.risk_scores.probability_score} / ${vulnerability.content.risk_scores.impact_score}`}
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Space h={40}/>
      <Title>Max Mustermann</Title>
      <Space h={20}/>
      <Flex align="end" gap={20}>
        <TextInput
          style={{width: 200}}
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
          Notify vie Mail
        </Button>
      </Flex>
      <Space h={20}/>
      <Flex align="end" gap={20}>
        <TextInput
          style={{width: 200}}
          label="Phone Number"
          placeholder="Enter recipient's phone number"
          value={phoneNumber}
          onChange={(value:any) => setPhoneNumber(value)}
        />
        <Button
          style={{ marginTop: '10px', backgroundColor: '#000028', color: '#fff' }}
          onClick={handleNotify}
        >
          Notify via SMS
        </Button>
      </Flex>

      <Space h={50}/>

      <Text weight={500} size="lg" style={{ marginBottom: '10px' }}>
        Vulnerabilities:
      </Text>
      <List>
        {vulnerabilitiesList.map((vulnerability) => (
          <List.Item key={vulnerability.id}>{vulnerability.label}</List.Item>
        ))}
      </List>
    </>
  );
}
