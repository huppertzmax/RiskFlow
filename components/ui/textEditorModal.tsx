import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Grid } from '@mantine/core';
import TextEditor from '@/components/ui/textEditior';
import '@mantine/tiptap/styles.css';
import React, { useState } from 'react';
import TextEditorInfoTable from '@/components/ui/textEditorInfoTable';
import { Vulnerability } from '@/lib/types';
import { sendEmail } from 'app/actions/email-actions';
import { toast } from './use-toast';

interface TextEditorModalProps {
  vulnerabilities: Vulnerability[]; // Add vulnerabilities as a prop
}

export default function TextEditorModal({ vulnerabilities }: TextEditorModalProps) {
  console.log('Vulnerabilities received:', vulnerabilities);
  const [opened, { open, close }] = useDisclosure(false);
  const [editorContent, setEditorContent] = useState(() => {
    const content = generateInitialContent(vulnerabilities);
    console.log('Generated content:', content);
    return content;
  });
  const [sending, setSending] = useState(false);

  const handleSendEmail = async (email: string) => {
    if (!email || !editorContent) return;
    
    setSending(true);
    try {
      const result = await sendEmail(
        email,
        'Security Vulnerability Report',
        editorContent
      );
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Report sent successfully",
          variant: "default",
        });
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to send report",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

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
          <Grid.Col span={5} className="ml-5 mt-10">
            <TextEditorInfoTable 
              vulnerabilities={vulnerabilities}
              onSendEmail={handleSendEmail}
              sending={sending}
            />
          </Grid.Col>
          <Grid.Col span={7}>
            <TextEditor 
              vulnerabilities={vulnerabilities}
              onChange={setEditorContent}
            />
          </Grid.Col>
        </Grid>
      </Modal>
      <Button onClick={open} color={'#000028'}>
        Generate Management Report
      </Button>
    </>
  );
}

function generateInitialContent(vulnerabilities: Vulnerability[]) {
  if (!vulnerabilities?.length) {
    console.log('No vulnerabilities provided or empty array');
    return `
      <h1>RiskFlow Security Vulnerability Report</h1>
      <h2>List of Findings</h2>
      <p>No vulnerabilities found.</p>
    `;
  }

  return `
    <h1>RiskFlow Security Vulnerability Report</h1>
    <h2>List of Findings</h2>
    <ul>
      ${vulnerabilities.map(v => {
        console.log('Processing vulnerability:', v);
        return `
          <li>
            <strong>${v?.label || 'Unnamed Vulnerability'}</strong><br/>
            Probability Score: ${v?.content?.risk_scores?.probability_score || 'N/A'}<br/>
            Overall Danger Score: ${v?.content?.risk_scores?.overall_danger || 'N/A'}
          </li>
        `;
      }).join('')}
    </ul>
  `;
}