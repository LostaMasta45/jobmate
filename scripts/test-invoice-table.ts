/**
 * Test Invoice Email - Table Layout (Email-Compatible)
 */

import { Resend } from 'resend';
import { readFileSync } from 'fs';
import { join } from 'path';
import React from 'react';
import { render } from '@react-email/render';
import { InvoiceEmailTable, InvoiceEmailTableText } from '../emails/InvoiceEmailTable';

// Manual .env loading
const envPath = join(__dirname, '../.env');
const envContent = readFileSync(envPath, 'utf-8');
envContent.split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  if (key && values.length > 0) {
    const value = values.join('=').trim();
    if (!process.env[key.trim()]) {
      process.env[key.trim()] = value;
    }
  }
});

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = 'Jobmate x Infolokerjombang <admin@jobmate.web.id>';

async function testInvoiceEmail(toEmail: string) {
  console.log('\n✨ Testing Invoice Email - TABLE LAYOUT (Gmail Compatible)\n');
  console.log('📨 To:', toEmail);
  console.log('📤 From:', fromEmail);
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('📊 Layout: Table-based (email client compatible)');
  console.log('💅 Styles: All inline (no CSS classes)');
  console.log('📱 Responsive: Built-in for mobile');
  console.log('🎨 Design: Gradient colors + proper structure');
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1); // 24 hours from now
    
    const emailHtml = await render(
      React.createElement(InvoiceEmailTable, {
        userName: 'Test User',
        toEmail: toEmail,
        invoiceUrl: 'https://invoice.xendit.co/test-invoice-123456',
        amount: 50000,
        currency: 'Rp',
        expiryDate: expiryDate.toISOString(),
        description: 'VIP Basic - 1 Bulan',
      })
    );
    
    const emailText = InvoiceEmailTableText({
      userName: 'Test User',
      toEmail: toEmail,
      invoiceUrl: 'https://invoice.xendit.co/test-invoice-123456',
      amount: 50000,
      currency: 'Rp',
      expiryDate: expiryDate.toISOString(),
      description: 'VIP Basic - 1 Bulan',
    });

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: '💳 Invoice Pembayaran VIP Basic - Jobmate',
      html: String(emailHtml),
      text: emailText,
    });

    if (error) {
      console.log('❌ Failed:', error);
      process.exit(1);
    }

    console.log('✅ Invoice Email sent successfully!\n');
    console.log('📧 Email ID:', data?.id);
    console.log('📝 Subject: 💳 Invoice Pembayaran VIP Basic');
    console.log('\n📱 Should work properly in:');
    console.log('   ✅ Gmail (mobile & desktop)');
    console.log('   ✅ Outlook');
    console.log('   ✅ Apple Mail');
    console.log('   ✅ Yahoo Mail');
    console.log('\n📬 Check your inbox - seharusnya sudah bagus!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

const targetEmail = process.argv[2];
if (!targetEmail) {
  console.log('\n❌ Usage: npx tsx scripts/test-invoice-table.ts your@email.com\n');
  console.log('Example: npx tsx scripts/test-invoice-table.ts admin@example.com\n');
  process.exit(1);
}

testInvoiceEmail(targetEmail);
