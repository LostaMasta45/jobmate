/**
 * Test All Email Templates - Direct Send
 * Using same method as test-email-simple that works!
 */

import { Resend } from 'resend';
import { readFileSync } from 'fs';
import { join } from 'path';
import React from 'react';
import { render } from '@react-email/render';
import { AccountPendingEmail, AccountPendingEmailText } from '../emails/AccountPendingEmail';
import { AccountApprovedEmail, AccountApprovedEmailText } from '../emails/AccountApprovedEmail';
import { UpgradeVIPEmail, UpgradeVIPEmailText } from '../emails/UpgradeVIPEmail';
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
const fromEmail = 'Jobmate x Infolokerjombang <admin@jobmate.web.id>';

async function testAllEmails(toEmail: string) {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📧 Testing ALL Email Templates - Direct Send');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.log('📨 Target Email:', toEmail);
  console.log('📤 From:', fromEmail);
  console.log('🔑 API Key:', process.env.RESEND_API_KEY?.substring(0, 15) + '...\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const testUser = {
    name: 'Test User',
    email: toEmail,
  };

  let successCount = 0;
  let failCount = 0;

  // 1. Account Pending
  console.log('1️⃣ Sending Account Pending Email...');
  try {
    const emailHtml = await render(
      React.createElement(AccountPendingEmail, {
        userName: testUser.name,
        email: testUser.email,
        submittedAt: new Date().toISOString(),
      })
    );
    
    const emailText = AccountPendingEmailText({
      userName: testUser.name,
      email: testUser.email,
      submittedAt: new Date().toISOString(),
    });

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: 'Status Pengajuan Akun Anda - Jobmate X infolokerjombang',
      html: String(emailHtml),
      text: emailText,
    });

    if (error) {
      console.log('   ❌ Failed:', error);
      failCount++;
    } else {
      console.log('   ✅ Sent! ID:', data?.id, '\n');
      successCount++;
    }
  } catch (error) {
    console.log('   ❌ Error:', error);
    failCount++;
  }

  await new Promise(resolve => setTimeout(resolve, 2000));

  // 2. Account Approved
  console.log('2️⃣ Sending Account Approved Email...');
  try {
    const emailHtml = await render(
      React.createElement(AccountApprovedEmail, {
        userName: testUser.name,
        email: testUser.email,
        approvedAt: new Date().toISOString(),
        loginUrl: 'https://jobmate.web.id/sign-in',
      })
    );
    
    const emailText = AccountApprovedEmailText({
      userName: testUser.name,
      email: testUser.email,
      approvedAt: new Date().toISOString(),
      loginUrl: 'https://jobmate.web.id/sign-in',
    });

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: 'Akun Anda Telah Disetujui - Jobmate X infolokerjombang',
      html: String(emailHtml),
      text: emailText,
    });

    if (error) {
      console.log('   ❌ Failed:', error);
      failCount++;
    } else {
      console.log('   ✅ Sent! ID:', data?.id, '\n');
      successCount++;
    }
  } catch (error) {
    console.log('   ❌ Error:', error);
    failCount++;
  }

  await new Promise(resolve => setTimeout(resolve, 2000));

  // 3. VIP Basic
  console.log('3️⃣ Sending VIP Basic Upgrade Email...');
  try {
    const emailHtml = await render(
      React.createElement(UpgradeVIPEmail, {
        userName: testUser.name,
        email: testUser.email,
        membershipType: 'vip_basic',
        upgradedAt: new Date().toISOString(),
        dashboardUrl: 'https://jobmate.web.id/vip',
      })
    );
    
    const emailText = UpgradeVIPEmailText({
      userName: testUser.name,
      email: testUser.email,
      membershipType: 'vip_basic',
      upgradedAt: new Date().toISOString(),
      dashboardUrl: 'https://jobmate.web.id/vip',
    });

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: 'Akun VIP Basic Anda Aktif - Jobmate X infolokerjombang',
      html: String(emailHtml),
      text: emailText,
    });

    if (error) {
      console.log('   ❌ Failed:', error);
      failCount++;
    } else {
      console.log('   ✅ Sent! ID:', data?.id, '\n');
      successCount++;
    }
  } catch (error) {
    console.log('   ❌ Error:', error);
    failCount++;
  }

  await new Promise(resolve => setTimeout(resolve, 2000));

  // 4. VIP Premium
  console.log('4️⃣ Sending VIP Premium Upgrade Email...');
  try {
    const emailHtml = await render(
      React.createElement(UpgradeVIPEmail, {
        userName: testUser.name,
        email: testUser.email,
        membershipType: 'vip_premium',
        upgradedAt: new Date().toISOString(),
        dashboardUrl: 'https://jobmate.web.id/vip',
      })
    );
    
    const emailText = UpgradeVIPEmailText({
      userName: testUser.name,
      email: testUser.email,
      membershipType: 'vip_premium',
      upgradedAt: new Date().toISOString(),
      dashboardUrl: 'https://jobmate.web.id/vip',
    });

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: 'Akun VIP Premium Anda Aktif - Jobmate X infolokerjombang',
      html: String(emailHtml),
      text: emailText,
    });

    if (error) {
      console.log('   ❌ Failed:', error);
      failCount++;
    } else {
      console.log('   ✅ Sent! ID:', data?.id, '\n');
      successCount++;
    }
  } catch (error) {
    console.log('   ❌ Error:', error);
    failCount++;
  }

  await new Promise(resolve => setTimeout(resolve, 2000));

  // 5. Invoice
  console.log('5️⃣ Sending Invoice Email...');
  try {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1);
    
    const emailHtml = await render(
      React.createElement(InvoiceEmail, {
        userName: testUser.name,
        toEmail: testUser.email,
        invoiceUrl: 'https://invoice.xendit.co/test-invoice-123',
        amount: 50000,
        currency: 'IDR',
        expiryDate: expiryDate.toISOString(),
        description: 'VIP Basic - 1 Bulan',
      })
    );
    
    const emailText = InvoiceEmailText({
      userName: testUser.name,
      toEmail: testUser.email,
      invoiceUrl: 'https://invoice.xendit.co/test-invoice-123',
      amount: 50000,
      currency: 'IDR',
      expiryDate: expiryDate.toISOString(),
      description: 'VIP Basic - 1 Bulan',
    });

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: 'Invoice Pembayaran VIP Basic - 1 Bulan - Jobmate X infolokerjombang',
      html: String(emailHtml),
      text: emailText,
    });

    if (error) {
      console.log('   ❌ Failed:', error);
      failCount++;
    } else {
      console.log('   ✅ Sent! ID:', data?.id, '\n');
      successCount++;
    }
  } catch (error) {
    console.log('   ❌ Error:', error);
    failCount++;
  }

  // Summary
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Summary\n');
  console.log(`✅ Success: ${successCount}/5 emails`);
  console.log(`❌ Failed: ${failCount}/5 emails\n`);
  
  if (successCount === 5) {
    console.log('🎉 All emails sent successfully!');
    console.log(`📬 Check inbox: ${toEmail}\n`);
    console.log('💡 Check spam folder if not in inbox!');
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

const targetEmail = process.argv[2];
if (!targetEmail) {
  console.log('\n❌ Error: Email address required!\n');
  console.log('Usage: npm run test-all-direct your-email@example.com\n');
  process.exit(1);
}

testAllEmails(targetEmail);
