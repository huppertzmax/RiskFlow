'use server'

import formData from 'form-data';
import Mailgun from 'mailgun.js';

export async function sendEmail(to: string, subject: string, htmlContent: string) {
  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY || ''
  });

  try {
    const result = await mg.messages.create('sandbox-123.mailgun.org', {
      from: "RiskFlow Security Report <no-reply@riskflow.online>",
      to: [to],
      subject,
      html: htmlContent
    });
    return { success: true, data: result };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error };
  }
} 