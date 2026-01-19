// lib/send-invoice-email.ts
import React from 'react';
import { resend, FROM_EMAIL } from './resend';
import { InvoiceEmail, InvoiceEmailText } from '@/emails/InvoiceEmail';
import { render } from '@react-email/render';

interface SendInvoiceEmailParams {
  toEmail: string;
  userName: string;
  invoiceUrl: string;
  amount: number;
  currency: string;
  expiryDate: string;
  description: string;
}

export async function sendInvoiceEmail(params: SendInvoiceEmailParams) {
  try {
    // Use InvoiceEmail (standard visual design)
    const emailHtml: string = await render(<InvoiceEmail {...params} />);
    const emailText: string = InvoiceEmailText(params);

    // No attachments needed - logos loaded from production URL (jobmate.web.id)
    const { data, error } = await resend.emails.send({
      from: 'Jobmate x Infolokerjombang <admin@jobmate.web.id>',
      to: params.toEmail,
      subject: `💳 Invoice Pembayaran ${params.description} - Jobmate`,
      html: emailHtml,
      text: emailText,
      // Optional: tags untuk tracking
      tags: [
        { name: 'category', value: 'invoice' },
        { name: 'amount', value: params.amount.toString() },
      ],
    });

    if (error) {
      console.error('Failed to send invoice email:', error);
      return { success: false, error };
    }

    console.log('Invoice email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending invoice email:', error);
    return { success: false, error };
  }
}
