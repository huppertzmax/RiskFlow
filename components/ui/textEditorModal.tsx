import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Grid } from '@mantine/core';
import TextEditor from '@/components/ui/textEditior';
import '@mantine/tiptap/styles.css';
import React, { useState } from 'react';
import TextEditorInfoTable from '@/components/ui/textEditorInfoTable';
import { Vulnerability } from '@/lib/types';

interface TextEditorModalProps {
  vulnerabilities: Vulnerability[]; // Add vulnerabilities as a prop
}

export default function TextEditorModal({ vulnerabilities }: TextEditorModalProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [editorContent, setEditorContent] = useState(() => 
    generateInitialContent(vulnerabilities)
  );
  const [sending, setSending] = useState(false);

  const handleSendEmail = (email: string) => {
    if (!email || !editorContent) return;
    
    setSending(true);
    
    // Convert HTML to plain text (remove HTML tags)
    const plainText = editorContent.replace(/<[^>]+>/g, '');
    
    // Create mailto URL with encoded subject and body
    const mailtoUrl = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent('Security Vulnerability Report')}&body=${encodeURIComponent(plainText)}`;
    
    // Open the mailto link
    window.location.href = mailtoUrl;
    
    // Close the modal after opening mailto
    close();

    setSending(false);
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
  return `
    <h1>RiskFlow Security Vulnerability Report</h1>
    <h2>List of Findings</h2>
    <ul>
      ${vulnerabilities.map(v => `
        <li>
          <strong>${v.label}</strong><br/>
          Probability Score: ${v.content.risk_scores.probability_score}<br/>
          Overall Danger Score: ${v.content.risk_scores.overall_danger}
        </li>
      `).join('')}
    </ul>
  `;
}