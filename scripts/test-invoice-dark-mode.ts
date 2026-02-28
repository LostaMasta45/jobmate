/**
 * Test Invoice Email - Dark Mode Version dengan Logo
 */

import { Resend } from 'resend';
import { readFileSync } from 'fs';
import { join } from 'path';
import React from 'react';
import { render } from '@react-email/render';
import { InvoiceEmail, InvoiceEmailText } from '../emails/InvoiceEmail';

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
const fromEmail = 'InfoLokerJombang <admin@infolokerjombang.id>';

async function testInvoiceEmail(toEmail: string) {
  console.log('\n✨ Testing Invoice Email - Dark Mode Supported + Logo\n');
  console.log('📨 To:', toEmail);
  console.log('📤 From:', fromEmail);
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('🌙 Dark Mode: Supported (auto-detect device)');
  console.log('🎨 Logo: Included');
  console.log('✨ Animations: Full CSS animations');
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1); // 24 hours from now
    
    const emailHtml = await render(
      React.createElement(InvoiceEmail, {
        userName: 'Test User',
        toEmail: toEmail,
        invoiceUrl: 'https://invoice.xendit.co/test-invoice-123456',
        amount: 50000,
        currency: 'Rp',
        expiryDate: expiryDate.toISOString(),
        description: 'VIP Basic - 1 Bulan',
      })
    );
    
    const emailText = InvoiceEmailText({
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
      subject: '💳 Invoice Pembayaran VIP Basic - InfoLokerJombang',
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
    console.log('\n📱 Testing Tips:');
    console.log('1. Open email on device with dark mode enabled');
    console.log('2. Email will automatically adapt to dark/light mode');
    console.log('3. Check logo visibility in header');
    console.log('4. Verify animations work smoothly');
    console.log('\n📬 Check your inbox!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

const targetEmail = process.argv[2];
if (!targetEmail) {
  console.log('\n❌ Usage: npx ts-node scripts/test-invoice-dark-mode.ts your@email.com\n');
  console.log('Example: npx ts-node scripts/test-invoice-dark-mode.ts admin@example.com\n');
  process.exit(1);
}

testInvoiceEmail(targetEmail);
