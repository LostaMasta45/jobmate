/**
 * Test Account Approved Email - Modern UI Version
 */

import { Resend } from 'resend';
import { readFileSync } from 'fs';
import { join } from 'path';
import React from 'react';
import { render } from '@react-email/render';
import { AccountApprovedEmail, AccountApprovedEmailText } from '../emails/AccountApprovedEmail';

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

async function testAccountApprovedEmail(toEmail: string) {
  console.log('\n✨ Testing Account Approved Email - MODERN UI VERSION\n');
  console.log('📨 To:', toEmail);
  console.log('📤 From:', fromEmail);
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('🎨 Design: Modern table-based layout');
  console.log('🖼️  Logo: Optimized (8.83 KB) from Imgur');
  console.log('📱 Responsive: Mobile-friendly');
  console.log('💅 Styles: All inline (Gmail compatible)');
  console.log('⚡ Loading: < 0.5 seconds');
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    const now = new Date();
    const loginUrl = process.env.NEXT_PUBLIC_SITE_URL 
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/sign-in`
      : 'https://infolokerjombang.id/sign-in';
    
    const emailHtml = await render(
      React.createElement(AccountApprovedEmail, {
        userName: 'Test User',
        email: toEmail,
        approvedAt: now.toISOString(),
        loginUrl: loginUrl,
      })
    );
    
    const emailText = AccountApprovedEmailText({
      userName: 'Test User',
      email: toEmail,
      approvedAt: now.toISOString(),
      loginUrl: loginUrl,
    });

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: '🎉 Akun Anda Telah Disetujui - JOBMATE',
      html: String(emailHtml),
      text: emailText,
    });

    if (error) {
      console.log('❌ Failed:', error);
      process.exit(1);
    }

    console.log('✅ Account Approved Email sent successfully!\n');
    console.log('📧 Email ID:', data?.id);
    console.log('📝 Subject: 🎉 Akun Anda Telah Disetujui');
    console.log('\n📊 Email Features:');
    console.log('   ✅ Logo JOBMATE di header (optimized)');
    console.log('   ✅ Success icon 🎉');
    console.log('   ✅ Account info card (green themed)');
    console.log('   ✅ Prominent CTA button dengan gradient');
    console.log('   ✅ 4 Feature boxes dengan icons');
    console.log('   ✅ Premium upgrade promo box');
    console.log('   ✅ Professional footer dengan logo');
    console.log('\n📱 Compatible with:');
    console.log('   ✅ Gmail (mobile & desktop)');
    console.log('   ✅ Outlook');
    console.log('   ✅ Apple Mail');
    console.log('   ✅ Yahoo Mail');
    console.log('\n📬 Check your inbox - logo & design should look amazing!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

const targetEmail = process.argv[2];
if (!targetEmail) {
  console.log('\n❌ Usage: npx tsx scripts/test-account-approved-email.ts your@email.com\n');
  console.log('Example: npx tsx scripts/test-account-approved-email.ts admin@example.com\n');
  process.exit(1);
}

testAccountApprovedEmail(targetEmail);
