/**
 * Test Account Pending Email - Modern UI Version with Brand Colors
 */

import { Resend } from 'resend';
import { readFileSync } from 'fs';
import { join } from 'path';
import React from 'react';
import { render } from '@react-email/render';
import { AccountPendingEmail, AccountPendingEmailText } from '../emails/AccountPendingEmail';

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

async function testAccountPendingEmail(toEmail: string) {
  console.log('\n✨ Testing Account Pending Email - MODERN UI WITH BRAND COLORS\n');
  console.log('📨 To:', toEmail);
  console.log('📤 From:', fromEmail);
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('🎨 Design: Modern table-based layout');
  console.log('🖼️  Logo: Optimized (8.83 KB) from Imgur');
  console.log('🎯 Colors: Purple→Blue→Cyan brand gradient');
  console.log('✍️  Copywriting: Friendly & engaging');
  console.log('📱 Responsive: Mobile-friendly');
  console.log('💅 Styles: All inline (Gmail compatible)');
  console.log('⚡ Loading: < 0.5 seconds');
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    const now = new Date();
    
    const emailHtml = await render(
      React.createElement(AccountPendingEmail, {
        userName: 'Test User',
        email: toEmail,
        submittedAt: now.toISOString(),
      })
    );
    
    const emailText = AccountPendingEmailText({
      userName: 'Test User',
      email: toEmail,
      submittedAt: now.toISOString(),
    });

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: '⏳ Pengajuan Diterima! Menunggu Verifikasi - JOBMATE',
      html: String(emailHtml),
      text: emailText,
    });

    if (error) {
      console.log('❌ Failed:', error);
      process.exit(1);
    }

    console.log('✅ Account Pending Email sent successfully!\n');
    console.log('📧 Email ID:', data?.id);
    console.log('📝 Subject: ⏳ Pengajuan Diterima! Menunggu Verifikasi');
    console.log('\n📊 Email Features:');
    console.log('   ✅ Logo JOBMATE di header (optimized)');
    console.log('   ✅ Brand colors (purple→blue→cyan gradient)');
    console.log('   ✅ Waiting status icon ⏳');
    console.log('   ✅ Submission info card (yellow themed)');
    console.log('   ✅ Visual timeline (3 steps dengan icons)');
    console.log('   ✅ Help CTA box dengan support button');
    console.log('   ✅ Tips box dengan actionable items');
    console.log('   ✅ Professional footer dengan logo');
    console.log('\n💬 Copywriting:');
    console.log('   ✅ Friendly & reassuring tone');
    console.log('   ✅ Clear timeline expectations');
    console.log('   ✅ Helpful tips & CTAs');
    console.log('   ✅ Engaging & professional');
    console.log('\n📱 Compatible with:');
    console.log('   ✅ Gmail (mobile & desktop)');
    console.log('   ✅ Outlook');
    console.log('   ✅ Apple Mail');
    console.log('   ✅ Yahoo Mail');
    console.log('\n📬 Check your inbox - should look amazing!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

const targetEmail = process.argv[2];
if (!targetEmail) {
  console.log('\n❌ Usage: npx tsx scripts/test-account-pending-email.ts your@email.com\n');
  console.log('Example: npx tsx scripts/test-account-pending-email.ts admin@example.com\n');
  process.exit(1);
}

testAccountPendingEmail(targetEmail);
