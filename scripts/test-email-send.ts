/**
 * Test Email Send Script
 * 
 * Script untuk test kirim email ke alamat email manapun
 * Menggunakan domain verified: jobmate.web.id
 * 
 * Usage:
 *   npm run test-email your-email@example.com
 *   or
 *   npx tsx scripts/test-email-send.ts your-email@example.com
 */

import { resend, FROM_EMAIL, FROM_NAME } from '../lib/resend';

async function sendTestEmail(toEmail: string) {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🚀 JOBMATE Email Test - Professional Setup');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.log('📧 From:', FROM_EMAIL);
  console.log('📨 To:', toEmail);
  console.log('🌐 Domain: jobmate.web.id (Verified ✅)\n');
  
  try {
    console.log('📤 Sending test email...\n');

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: toEmail,
      subject: '🎉 Test Email - JOBMATE Professional Setup',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>JOBMATE Email Test</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                
                <!-- Main Container -->
                <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                  
                  <!-- Header with Gradient -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                        ✨ JOBMATE
                      </h1>
                      <p style="margin: 10px 0 0 0; color: rgba(255, 255, 255, 0.95); font-size: 16px;">
                        Platform Karir Terpercaya
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      
                      <!-- Success Badge -->
                      <div style="background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px; margin-bottom: 30px;">
                        <h2 style="margin: 0; font-size: 24px; font-weight: bold;">
                          ✅ Email System Active!
                        </h2>
                      </div>
                      
                      <!-- Welcome Message -->
                      <h3 style="color: #1f2937; font-size: 20px; margin: 0 0 20px 0;">
                        Halo! 👋
                      </h3>
                      
                      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                        Ini adalah email test untuk memverifikasi bahwa sistem email JOBMATE sudah berjalan dengan sempurna menggunakan <strong>domain verified jobmate.web.id</strong>.
                      </p>
                      
                      <!-- Info Box -->
                      <div style="background: #f9fafb; border-left: 4px solid #667eea; padding: 20px; margin: 30px 0; border-radius: 6px;">
                        <h4 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">
                          📋 Detail Setup
                        </h4>
                        <table style="width: 100%;">
                          <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;"><strong>Sender:</strong></td>
                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; text-align: right;">JOBMATE</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;"><strong>Email:</strong></td>
                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; text-align: right;">admin@jobmate.web.id</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;"><strong>Domain:</strong></td>
                            <td style="padding: 8px 0; color: #10b981; font-size: 14px; text-align: right; font-weight: bold;">Verified ✓</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;"><strong>Service:</strong></td>
                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; text-align: right;">Resend</td>
                          </tr>
                        </table>
                      </div>
                      
                      <!-- Features List -->
                      <div style="margin: 30px 0;">
                        <h4 style="color: #1f2937; font-size: 18px; margin: 0 0 15px 0;">
                          🎯 Fitur Email System:
                        </h4>
                        <ul style="color: #4b5563; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                          <li>✉️ Kirim ke email manapun (tidak terbatas)</li>
                          <li>🎨 Template email profesional & responsive</li>
                          <li>📨 Notifikasi akun approval otomatis</li>
                          <li>💰 Invoice pembayaran otomatis</li>
                          <li>🔔 Upgrade VIP notification</li>
                          <li>📊 Email tracking & analytics</li>
                        </ul>
                      </div>
                      
                      <!-- CTA Button -->
                      <div style="text-align: center; margin: 40px 0 20px 0;">
                        <a href="https://jobmate.web.id" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 14px 36px; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                          Kunjungi JOBMATE
                        </a>
                      </div>
                      
                      <p style="color: #9ca3af; font-size: 14px; text-align: center; margin: 20px 0 0 0;">
                        Jika kamu menerima email ini, berarti sistem email sudah berfungsi sempurna! 🎉
                      </p>
                      
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                        <strong>JOBMATE</strong> - Platform Karir Terpercaya Indonesia
                      </p>
                      <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                        Email dikirim dari: admin@jobmate.web.id
                      </p>
                      <p style="margin: 10px 0 0 0; color: #9ca3af; font-size: 12px;">
                        © ${new Date().getFullYear()} JOBMATE. All rights reserved.
                      </p>
                    </td>
                  </tr>
                  
                </table>
                
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      text: `
JOBMATE - Test Email

Halo!

Ini adalah email test untuk memverifikasi bahwa sistem email JOBMATE sudah berjalan dengan sempurna.

Detail Setup:
- Sender: JOBMATE
- Email: admin@jobmate.web.id
- Domain: jobmate.web.id (Verified)
- Service: Resend

Fitur Email System:
✉️ Kirim ke email manapun (tidak terbatas)
🎨 Template email profesional & responsive
📨 Notifikasi akun approval otomatis
💰 Invoice pembayaran otomatis
🔔 Upgrade VIP notification
📊 Email tracking & analytics

Jika kamu menerima email ini, berarti sistem email sudah berfungsi sempurna! 🎉

---
JOBMATE - Platform Karir Terpercaya Indonesia
Email dikirim dari: admin@jobmate.web.id
© ${new Date().getFullYear()} JOBMATE. All rights reserved.
      `.trim(),
      tags: [
        { name: 'category', value: 'test' },
        { name: 'environment', value: process.env.NODE_ENV || 'development' },
      ],
    });

    if (error) {
      console.error('❌ Error sending email:');
      console.error(error);
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      process.exit(1);
    }

    console.log('✅ Email sent successfully!\n');
    console.log('📝 Email Details:');
    console.log('   Email ID:', data?.id);
    console.log('   Recipient:', toEmail);
    console.log('   Timestamp:', new Date().toLocaleString('id-ID'));
    console.log('\n✨ Check your inbox for the test email!');
    console.log('   (Jangan lupa cek folder spam jika tidak muncul)\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
  } catch (error) {
    console.error('❌ Unexpected error:');
    console.error(error);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    process.exit(1);
  }
}

// Get email from command line argument
const targetEmail = process.argv[2];

if (!targetEmail) {
  console.log('\n❌ Error: Email address required!\n');
  console.log('Usage:');
  console.log('  npm run test-email your-email@example.com');
  console.log('  or');
  console.log('  npx tsx scripts/test-email-send.ts your-email@example.com\n');
  process.exit(1);
}

// Validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(targetEmail)) {
  console.log('\n❌ Error: Invalid email format!\n');
  console.log('Please provide a valid email address.\n');
  process.exit(1);
}

// Run test
sendTestEmail(targetEmail);
