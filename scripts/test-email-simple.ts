/**
 * Simple Email Test - Direct Configuration
 * Manual .env loading for Windows
 */

import { Resend } from 'resend';
import { readFileSync } from 'fs';
import { join } from 'path';

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

async function testEmail(toEmail: string) {
  console.log('\n🧪 Testing Email Configuration...\n');
  console.log('API Key:', process.env.RESEND_API_KEY?.substring(0, 15) + '...');
  console.log('From Email:', process.env.RESEND_FROM_EMAIL);
  console.log('To Email:', toEmail);
  console.log('\n---\n');

  try {
    // Display name: "InfoLokerJombang"
    const fromEmail = 'InfoLokerJombang <admin@infolokerjombang.id>';
    
    console.log('Attempting to send from:', fromEmail);
    console.log('\n');

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: '🎉 Test Email - JOBMATE',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px; color: white;">
            <h1 style="margin: 0;">✨ JOBMATE</h1>
            <p style="margin: 10px 0 0 0;">Email System Test</p>
          </div>
          <div style="padding: 30px; background: #f9fafb; margin: 20px 0; border-radius: 10px;">
            <h2>✅ Email Berhasil Terkirim!</h2>
            <p>Ini adalah test email dari <strong>admin@infolokerjombang.id</strong></p>
            <p>Domain <strong>infolokerjombang.id</strong> sudah verified dan siap digunakan!</p>
          </div>
          <div style="text-align: center; color: #666; font-size: 14px;">
            <p>JOBMATE - Platform Karir Terpercaya</p>
            <p>© ${new Date().getFullYear()} JOBMATE</p>
          </div>
        </div>
      `,
      text: `
JOBMATE - Email System Test

Email berhasil terkirim dari: admin@infolokerjombang.id
Domain: infolokerjombang.id (Verified)

JOBMATE - Platform Karir Terpercaya
© ${new Date().getFullYear()} JOBMATE
      `.trim(),
    });

    if (error) {
      console.error('❌ Error:', error);
      console.log('\nPossible issues:');
      console.log('1. Domain "infolokerjombang.id" belum verified di Resend');
      console.log('2. API key tidak valid');
      console.log('3. Email format tidak sesuai');
      console.log('\nCheck: https://resend.com/domains\n');
      process.exit(1);
    }

    console.log('✅ Email sent successfully!');
    console.log('\nEmail Details:');
    console.log('  ID:', data?.id);
    console.log('  To:', toEmail);
    console.log('  From:', fromEmail);
    console.log('\n📬 Check your inbox!\n');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

const targetEmail = process.argv[2];
if (!targetEmail) {
  console.log('\n❌ Usage: npm run test-email-simple your@email.com\n');
  process.exit(1);
}

testEmail(targetEmail);
