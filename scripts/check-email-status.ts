// scripts/check-email-status.ts - Check email delivery status
import { resend } from '../lib/resend';

async function checkEmailStatus() {
  console.log('🔍 Checking Email Status...\n');
  
  // Email IDs yang baru dikirim
  const emailIds = [
    '71c373ae-08ad-4120-8673-f59a00dcf524', // VIP Basic
    'b90aa949-ad9d-4aab-968f-1074c954732f', // VIP Premium
  ];
  
  for (const emailId of emailIds) {
    console.log(`📧 Checking email: ${emailId}`);
    
    try {
      const email = await resend.emails.get(emailId);
      console.log('Status:', email);
      console.log('---\n');
    } catch (error) {
      console.error('Error:', error);
      console.log('---\n');
    }
  }
}

checkEmailStatus()
  .then(() => {
    console.log('\n✅ Status check completed!');
    console.log('\n📝 Possible issues:');
    console.log('   1. Email in spam/junk folder');
    console.log('   2. Resend delivery delay (wait 1-2 minutes)');
    console.log('   3. Gmail filter blocking');
    console.log('   4. Check Resend dashboard: https://resend.com/emails');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Check failed:', error);
    process.exit(1);
  });
