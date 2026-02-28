/**
 * Test All Email Templates
 * 
 * Script untuk test kirim SEMUA jenis email ke satu alamat
 * Buat demo UI dan copywriting semua email templates
 * 
 * Usage:
 *   npm run test-all-emails your-email@example.com
 */

import { sendAccountPendingEmail, sendAccountApprovedEmail, sendUpgradeVIPEmail } from '../lib/email-notifications';
import { sendInvoiceEmail } from '../lib/send-invoice-email';

async function testAllEmails(toEmail: string) {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📧 Testing ALL Email Templates');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.log('📨 Target Email:', toEmail);
  console.log('📤 Sender: InfoLokerJombang <admin@infolokerjombang.id>\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const testUser = {
    name: 'Test User',
    email: toEmail,
  };

  let successCount = 0;
  let failCount = 0;

  // 1. Account Pending Email
  console.log('1️⃣ Sending Account Pending Email...');
  try {
    const result1 = await sendAccountPendingEmail({
      userName: testUser.name,
      email: testUser.email,
      submittedAt: new Date().toISOString(),
    });
    
    if (result1.success) {
      console.log('   ✅ Account Pending Email sent!');
      console.log(`   📧 Subject: ⏳ InfoLokerJombang - Pengajuan Akun Sedang Diproses\n`);
      successCount++;
    } else {
      console.log('   ❌ Failed:', result1.error);
      failCount++;
    }
  } catch (error) {
    console.log('   ❌ Error:', error);
    failCount++;
  }

  // Wait 2 seconds between emails
  await new Promise(resolve => setTimeout(resolve, 2000));

  // 2. Account Approved Email
  console.log('2️⃣ Sending Account Approved Email...');
  try {
    const result2 = await sendAccountApprovedEmail({
      userName: testUser.name,
      email: testUser.email,
      approvedAt: new Date().toISOString(),
      loginUrl: 'https://infolokerjombang.id/sign-in',
    });
    
    if (result2.success) {
      console.log('   ✅ Account Approved Email sent!');
      console.log(`   📧 Subject: 🎉 InfoLokerJombang - Akun Anda Disetujui!\n`);
      successCount++;
    } else {
      console.log('   ❌ Failed:', result2.error);
      failCount++;
    }
  } catch (error) {
    console.log('   ❌ Error:', error);
    failCount++;
  }

  await new Promise(resolve => setTimeout(resolve, 2000));

  // 3. VIP Basic Upgrade Email
  console.log('3️⃣ Sending VIP Basic Upgrade Email...');
  try {
    const result3 = await sendUpgradeVIPEmail({
      userName: testUser.name,
      email: testUser.email,
      membershipType: 'vip_basic',
      upgradedAt: new Date().toISOString(),
      dashboardUrl: 'https://infolokerjombang.id/vip',
    });
    
    if (result3.success) {
      console.log('   ✅ VIP Basic Upgrade Email sent!');
      console.log(`   📧 Subject: ⭐ InfoLokerJombang - Selamat Anda VIP Basic!\n`);
      successCount++;
    } else {
      console.log('   ❌ Failed:', result3.error);
      failCount++;
    }
  } catch (error) {
    console.log('   ❌ Error:', error);
    failCount++;
  }

  await new Promise(resolve => setTimeout(resolve, 2000));

  // 4. VIP Premium Upgrade Email
  console.log('4️⃣ Sending VIP Premium Upgrade Email...');
  try {
    const result4 = await sendUpgradeVIPEmail({
      userName: testUser.name,
      email: testUser.email,
      membershipType: 'vip_premium',
      upgradedAt: new Date().toISOString(),
      dashboardUrl: 'https://infolokerjombang.id/vip',
    });
    
    if (result4.success) {
      console.log('   ✅ VIP Premium Upgrade Email sent!');
      console.log(`   📧 Subject: 👑 InfoLokerJombang - Selamat Anda VIP Premium!\n`);
      successCount++;
    } else {
      console.log('   ❌ Failed:', result4.error);
      failCount++;
    }
  } catch (error) {
    console.log('   ❌ Error:', error);
    failCount++;
  }

  await new Promise(resolve => setTimeout(resolve, 2000));

  // 5. Invoice Email
  console.log('5️⃣ Sending Invoice Email...');
  try {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1); // 24 hours from now
    
    const result5 = await sendInvoiceEmail({
      toEmail: testUser.email,
      userName: testUser.name,
      invoiceUrl: 'https://invoice.xendit.co/test-invoice-123',
      amount: 50000,
      currency: 'IDR',
      expiryDate: expiryDate.toISOString(),
      description: 'VIP Basic - 1 Bulan',
    });
    
    if (result5.success) {
      console.log('   ✅ Invoice Email sent!');
      console.log(`   📧 Subject: 💰 InfoLokerJombang - Invoice VIP Basic - 1 Bulan\n`);
      successCount++;
    } else {
      console.log('   ❌ Failed:', result5.error);
      failCount++;
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
    console.log(`📬 Check inbox: ${toEmail}`);
    console.log('\n✨ You should receive 5 emails:');
    console.log('   1. Account Pending (⏳)');
    console.log('   2. Account Approved (🎉)');
    console.log('   3. VIP Basic Upgrade (⭐)');
    console.log('   4. VIP Premium Upgrade (👑)');
    console.log('   5. Invoice Payment (💰)\n');
    console.log('💡 Check spam folder if not in inbox!');
  } else {
    console.log('⚠️ Some emails failed to send.');
    console.log('Check error messages above.\n');
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

// Get email from command line
const targetEmail = process.argv[2];

if (!targetEmail) {
  console.log('\n❌ Error: Email address required!\n');
  console.log('Usage:');
  console.log('  npm run test-all-emails your-email@example.com\n');
  process.exit(1);
}

// Validate email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(targetEmail)) {
  console.log('\n❌ Error: Invalid email format!\n');
  process.exit(1);
}

// Run test
testAllEmails(targetEmail);
