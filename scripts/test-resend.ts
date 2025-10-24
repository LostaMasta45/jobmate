// scripts/test-resend.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  console.log('🧪 Testing Resend connection...');
  console.log('API Key:', process.env.RESEND_API_KEY?.substring(0, 10) + '...');
  console.log('From Email:', process.env.RESEND_FROM_EMAIL);
  
  // Email yang terdaftar di Resend team (dari error message)
  const testEmail = 'reza.nur.h45@gmail.com'; // Email yang sudah terdaftar di Resend
  
  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
    to: testEmail,
    subject: '🧪 Test Email JOBMATE - Resend Integration',
    html: `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto;">
            <div style="background: #10B981; color: white; padding: 20px; text-align: center; border-radius: 8px;">
              <h1>✅ Resend Integration Works!</h1>
            </div>
            <div style="padding: 30px; background: #f9fafb; margin: 20px 0; border-radius: 8px;">
              <p>Hello from JOBMATE!</p>
              <p>This is a test email to verify that Resend integration is working correctly.</p>
              <div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0;">
                <h2>✨ Integration Details</h2>
                <p><strong>Project:</strong> JOBMATE (jobmate.web.id)</p>
                <p><strong>Service:</strong> Resend Email API</p>
                <p><strong>Status:</strong> <span style="color: #10B981; font-weight: bold;">Active ✓</span></p>
              </div>
              <p style="color: #666; font-size: 14px;">
                If you received this email, it means the Resend integration is working perfectly! 🎉
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  });

  if (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } else {
    console.log('✅ Email sent successfully!');
    console.log('📧 Email ID:', data?.id);
    console.log('🎯 Sent to:', testEmail);
    console.log('');
    console.log('Check your inbox for the test email!');
    process.exit(0);
  }
}

testEmail();
