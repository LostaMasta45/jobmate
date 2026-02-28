// scripts/test-upgrade-vip-email.ts - Test email untuk UpgradeVIPEmail
import { sendUpgradeVIPEmail } from '../lib/email-notifications';

async function testUpgradeVIPEmail() {
  console.log('🧪 Testing Upgrade VIP Email...\n');
  
  // Domain infolokerjombang.id sudah verified, bisa kirim ke email mana saja!
  const testEmail = 'updatesumobito@gmail.com';
  const userName = 'Update Sumobito';
  
  console.log('📧 Sending test emails to:', testEmail);
  console.log('');
  
  // Test VIP Basic
  console.log('1️⃣ Testing VIP Basic email...');
  const resultBasic = await sendUpgradeVIPEmail({
    userName,
    email: testEmail,
    membershipType: 'vip_basic',
    upgradedAt: new Date().toISOString(),
    dashboardUrl: 'https://infolokerjombang.id/dashboard',
  });
  
  if (resultBasic.success) {
    console.log('✅ VIP Basic email sent successfully!');
    console.log('📬 Email ID:', resultBasic.data?.id);
  } else {
    console.error('❌ Failed to send VIP Basic email:', resultBasic.error);
  }
  
  console.log('');
  
  // Wait 2 seconds before sending next email
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test VIP Premium
  console.log('2️⃣ Testing VIP Premium email...');
  const resultPremium = await sendUpgradeVIPEmail({
    userName,
    email: testEmail,
    membershipType: 'vip_premium',
    upgradedAt: new Date().toISOString(),
    dashboardUrl: 'https://infolokerjombang.id/dashboard',
  });
  
  if (resultPremium.success) {
    console.log('✅ VIP Premium email sent successfully!');
    console.log('📬 Email ID:', resultPremium.data?.id);
  } else {
    console.error('❌ Failed to send VIP Premium email:', resultPremium.error);
  }
  
  console.log('');
  console.log('🎉 Test completed!');
  console.log('');
  console.log('📮 Please check your inbox at:', testEmail);
  console.log('💡 Check spam/junk folder if not in inbox');
  console.log('');
  console.log('🔍 Expected results:');
  console.log('   - 2 emails total (VIP Basic + VIP Premium)');
  console.log('   - Table-based layout (compatible with all email clients)');
  console.log('   - JOBMATE logo at header and footer');
  console.log('   - Brand color gradient (purple-blue for Basic, gold for Premium)');
  console.log('   - Professional design matching AccountPending/Approved emails');
  console.log('   - Responsive on mobile devices');
}

testUpgradeVIPEmail()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('💥 Test failed with error:', error);
    process.exit(1);
  });
