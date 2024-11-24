import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import { Center, Space } from '@mantine/core';

const content =
  '<h2 style="text-align: center;">Security Vulnerability Report</h2><p>Dear Management Team,</p><p>I am writing to inform you about a recently discovered security vulnerability in our systems that requires immediate attention.</p><h3>Vulnerability Overview</h3><p>We have identified a <strong>critical security issue</strong> that needs to be addressed. Here are the key details:</p><ul><li><strong>Severity Level:</strong> Critical</li><li><strong>Affected Systems:</strong> [System Names]</li><li><strong>Potential Impact:</strong> Data breach, system compromise</li><li><strong>Current Status:</strong> Under investigation</li></ul><h3>Recommended Actions</h3><ul><li>Immediate patching of affected systems</li><li>Security audit of related components</li><li>User access review and updates</li><li>Implementation of additional monitoring</li></ul><p>Our security team is actively working on resolving this issue. We will provide regular updates as more information becomes available.</p><p>Please let me know if you need any additional information.</p><p>Best regards,<br>[Security Team]</p>';

export default function TextEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content,
  });

  return (
    <Center className="mt-10">
    <RichTextEditor editor={editor} style={{maxWidth: 1000, minHeight: 600}}>
      <RichTextEditor.Toolbar sticky stickyOffset={60}>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
          <RichTextEditor.Highlight />
          <RichTextEditor.Code />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H1 />
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
          <RichTextEditor.H4 />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Blockquote />
          <RichTextEditor.Hr />
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
          <RichTextEditor.Subscript />
          <RichTextEditor.Superscript />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.AlignLeft />
          <RichTextEditor.AlignCenter />
          <RichTextEditor.AlignJustify />
          <RichTextEditor.AlignRight />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Undo />
          <RichTextEditor.Redo />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>
    </Center>
  );
}
