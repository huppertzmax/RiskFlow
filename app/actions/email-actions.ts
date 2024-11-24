'use server'

import formData from 'form-data';
import Mailgun from 'mailgun.js';
import axios from 'axios';

export async function sendEmail(to: string, subject: string, htmlContent: string) {
    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({
        username: 'api',
        key: process.env.MAILGUN_API_KEY || ''
    });

    try {
        const result = await mg.messages.create('sandbox4f8095618240493998a3a17bf4cffd28.mailgun.org', {
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

// export async function sendWhatsAppMessage(to: string, message: string) {
//     try {
//         const response = await axios.post(
//             'https://graph.facebook.com/v21.0/267760859764381/messages',
//             {
//                 messaging_product: 'whatsapp',
//                 to: to,
//                 type: 'template',
//                 template: {
//                     name: 'hello_world',
//                     language: {
//                         code: 'en_US'
//                     }
//                 }
//             },
//             {
//                 headers: {
//                     Authorization: 'Bearer ' + process.env.WHATSAPP_API_KEY,
//                     'Content-Type': 'application/json'
//                 }
//             }
//         );
//         console.log('Message sent:', response.data);
//     } catch (error) {
//         console.error('Error sending message:', error);
//     }
// }