// lib/send-invoice-email.ts
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
    const emailHtml = await render(<InvoiceEmail {...params} />);
    const emailText = InvoiceEmailText(params);

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.toEmail,
      subject: `Invoice Pembayaran - ${params.description}`,
      html: emailHtml,
      text: emailText,
      // Optional: tags untuk tracking
      tags: [
        { name: 'category', value: 'invoice' },
        { name: 'amount', value: params.amount.toString() },
      ],
    });

    if (error) {
      console.error('Failed to send email:', error);
      return { success: false, error };
    }

    console.log('Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}
