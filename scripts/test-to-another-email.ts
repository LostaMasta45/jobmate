// Test kirim ke email alternatif untuk verifikasi
import { sendUpgradeVIPEmail } from '../lib/email-notifications';

async function testToAnotherEmail() {
  console.log('🧪 Testing to alternative email...\n');
  
  // Kirim ke email verified owner untuk konfirmasi
  const testEmail = 'reza.nur.h45@gmail.com';
  
  console.log('📧 Sending VIP Basic test to:', testEmail);
  
  const result = await sendUpgradeVIPEmail({
    userName: 'Test User - VIP Basic',
    email: testEmail,
    membershipType: 'vip_basic',
    upgradedAt: new Date().toISOString(),
    dashboardUrl: 'https://infolokerjombang.id/dashboard',
  });
  
  if (result.success) {
    console.log('✅ Email sent successfully!');
    console.log('📬 Email ID:', result.data?.id);
    console.log('\n📮 Check inbox:', testEmail);
    console.log('Subject: ⭐ Selamat! Upgrade VIP Basic Berhasil - JOBMATE');
  } else {
    console.error('❌ Failed:', result.error);
  }
}

testToAnotherEmail()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('💥 Error:', error);
    process.exit(1);
  });
