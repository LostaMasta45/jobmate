/**
 * 🤖 TELEGRAM BOT TESTING SCRIPT
 * 
 * Test semua fungsi Telegram Bot monitoring
 * 
 * Usage:
 * 1. Pastikan TELEGRAM_BOT_TOKEN dan TELEGRAM_ADMIN_CHAT_ID sudah diset di .env
 * 2. Run: npx tsx test-telegram-bot.ts
 * 3. Atau test specific function: npx tsx test-telegram-bot.ts --tool-usage
 */

import {
  sendTelegramMessage,
  notifyToolUsage,
  sendDailyAdminSummary,
  notifySystemError,
  sendAdminNotification
} from "./lib/telegram";

// ================================================
// Test Functions
// ================================================

async function testBasicMessage() {
  console.log("\n🧪 Test 1: Basic Message");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!chatId || !botToken) {
    console.error("❌ TELEGRAM_ADMIN_CHAT_ID atau TELEGRAM_BOT_TOKEN tidak ditemukan di .env");
    console.log("   Silakan set di file .env:");
    console.log("   TELEGRAM_BOT_TOKEN=your_bot_token");
    console.log("   TELEGRAM_ADMIN_CHAT_ID=your_chat_id");
    return false;
  }

  console.log("📤 Sending basic test message...");
  const result = await sendTelegramMessage(
    chatId,
    "✅ *TELEGRAM BOT TEST*\n\nBot berhasil terhubung!\nSemua fungsi monitoring siap digunakan.",
    botToken
  );

  if (result) {
    console.log("✅ Basic message sent successfully!");
  } else {
    console.log("❌ Failed to send basic message");
  }

  return result;
}

async function testToolUsageNotification() {
  console.log("\n🧪 Test 2: Tool Usage Notification");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  
  console.log("📤 Sending tool usage notification...");
  
  const result = await notifyToolUsage({
    userName: "John Doe (Test User)",
    userEmail: "john.doe@example.com",
    membershipType: "vip_premium",
    toolName: "CV ATS Generator",
    documentTitle: "Software Engineer Resume - Google",
    usageCount: 5,
    sameToolCount: 2,
    // quota: { used: 3, limit: 5 } // Uncomment untuk free user
  });

  if (result) {
    console.log("✅ Tool usage notification sent successfully!");
  } else {
    console.log("❌ Failed to send tool usage notification");
  }

  return result;
}

async function testToolUsageFreeUser() {
  console.log("\n🧪 Test 3: Tool Usage (Free User with Quota)");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  
  console.log("📤 Sending free user tool usage...");
  
  const result = await notifyToolUsage({
    userName: "Jane Smith (Test Free User)",
    userEmail: "jane.smith@example.com",
    membershipType: "free",
    toolName: "Cover Letter Generator",
    documentTitle: "Application for Marketing Manager",
    usageCount: 4,
    sameToolCount: 3,
    quota: { used: 4, limit: 5 } // Free user quota
  });

  if (result) {
    console.log("✅ Free user notification sent successfully!");
  } else {
    console.log("❌ Failed to send free user notification");
  }

  return result;
}

async function testHighUsageAlert() {
  console.log("\n🧪 Test 4: High Usage Alert");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  
  console.log("📤 Sending high usage alert...");
  
  const result = await notifyToolUsage({
    userName: "Suspicious User (Test)",
    userEmail: "suspicious@example.com",
    membershipType: "free",
    toolName: "Email Template",
    documentTitle: "Test Email #25",
    usageCount: 30,
    sameToolCount: 25, // HIGH USAGE - akan trigger warning
    quota: { used: 5, limit: 5 } // Quota exceeded
  });

  if (result) {
    console.log("✅ High usage alert sent successfully!");
  } else {
    console.log("❌ Failed to send high usage alert");
  }

  return result;
}

async function testDailySummary() {
  console.log("\n🧪 Test 5: Daily Admin Summary");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  
  console.log("📤 Sending daily summary report...");
  
  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const result = await sendDailyAdminSummary({
    date: today,
    totalUsers: 1250,
    newUsers: 15,
    activeUsers24h: 342,
    vipBasic: 87,
    vipPremium: 43,
    pendingApplications: 8, // Will show alert ⚠️
    approvedToday: 12,
    rejectedToday: 3,
    totalToolUsage: 456,
    cvGenerated: 123,
    coverLetters: 89,
    emailTemplates: 67,
    revenueToday: 2500000,
    newSubscriptions: 5,
    dashboardUrl: "https://jobmate.app/admin/dashboard"
  });

  if (result) {
    console.log("✅ Daily summary sent successfully!");
  } else {
    console.log("❌ Failed to send daily summary");
  }

  return result;
}

async function testSystemError() {
  console.log("\n🧪 Test 6: System Error Alert");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  
  console.log("📤 Sending system error alert...");
  
  const result = await notifySystemError({
    errorType: "Database Connection Timeout",
    errorMessage: "Failed to connect to Supabase after 3 retries",
    location: "/api/ai/generate-cover-letter/route.ts:45",
    affectedUser: "john.doe@example.com",
    severity: "HIGH"
  });

  if (result) {
    console.log("✅ System error alert sent successfully!");
  } else {
    console.log("❌ Failed to send system error alert");
  }

  return result;
}

async function testCriticalError() {
  console.log("\n🧪 Test 7: Critical Error (Production Down)");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  
  console.log("📤 Sending CRITICAL error...");
  
  const result = await notifySystemError({
    errorType: "Application Crash",
    errorMessage: "OpenAI API quota exceeded - All AI features down",
    severity: "CRITICAL"
  });

  if (result) {
    console.log("✅ Critical error alert sent successfully!");
  } else {
    console.log("❌ Failed to send critical error alert");
  }

  return result;
}

async function testExistingNotification() {
  console.log("\n🧪 Test 8: Test Existing Notification (New Application)");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  
  console.log("📤 Testing existing notification system...");
  
  const result = await sendAdminNotification(`🔔 *TEST - EXISTING NOTIFICATION*

━━━━━━━━━━━━━━━━━━━━━
Ini test untuk verify bahwa existing notification system masih berfungsi dengan baik.

✅ Jika Anda menerima message ini, berarti:
1. Bot configuration benar
2. TELEGRAM_BOT_TOKEN valid
3. TELEGRAM_ADMIN_CHAT_ID correct
4. Siap implement Option B features!

⏰ ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
━━━━━━━━━━━━━━━━━━━━━`);

  if (result) {
    console.log("✅ Existing notification test passed!");
  } else {
    console.log("❌ Existing notification test failed");
  }

  return result;
}

// ================================================
// Main Test Runner
// ================================================

async function runAllTests() {
  console.log("🚀 TELEGRAM BOT MONITORING - FULL TEST SUITE");
  console.log("════════════════════════════════════════════");
  console.log("Testing all Option B features...\n");

  const results = {
    basicMessage: await testBasicMessage(),
    toolUsage: await testToolUsageNotification(),
    freeUser: await testToolUsageFreeUser(),
    highUsage: await testHighUsageAlert(),
    dailySummary: await testDailySummary(),
    systemError: await testSystemError(),
    criticalError: await testCriticalError(),
    existingNotif: await testExistingNotification()
  };

  // Summary
  console.log("\n📊 TEST RESULTS SUMMARY");
  console.log("════════════════════════════════════════════");
  
  const passed = Object.values(results).filter(r => r === true).length;
  const total = Object.keys(results).length;

  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${total - passed}/${total}`);
  
  console.log("\nDetailed Results:");
  Object.entries(results).forEach(([test, result]) => {
    const emoji = result ? "✅" : "❌";
    console.log(`  ${emoji} ${test}`);
  });

  console.log("\n════════════════════════════════════════════");
  
  if (passed === total) {
    console.log("🎉 ALL TESTS PASSED! Telegram Bot siap digunakan.");
  } else {
    console.log("⚠️  Some tests failed. Check configuration:");
    console.log("   1. Verify TELEGRAM_BOT_TOKEN in .env");
    console.log("   2. Verify TELEGRAM_ADMIN_CHAT_ID in .env");
    console.log("   3. Check bot permissions in Telegram");
  }

  return passed === total;
}

// ================================================
// CLI Arguments Handler
// ================================================

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    console.log(`
🤖 Telegram Bot Test Script

Usage:
  npx tsx test-telegram-bot.ts [options]

Options:
  --all              Run all tests (default)
  --basic            Test basic message only
  --tool-usage       Test tool usage notification
  --free-user        Test free user with quota
  --high-usage       Test high usage alert
  --daily-summary    Test daily admin summary
  --system-error     Test system error alert
  --critical         Test critical error alert
  --existing         Test existing notification
  --help, -h         Show this help message

Examples:
  npx tsx test-telegram-bot.ts
  npx tsx test-telegram-bot.ts --tool-usage
  npx tsx test-telegram-bot.ts --daily-summary
    `);
    return;
  }

  if (args.includes("--basic")) {
    await testBasicMessage();
  } else if (args.includes("--tool-usage")) {
    await testToolUsageNotification();
  } else if (args.includes("--free-user")) {
    await testToolUsageFreeUser();
  } else if (args.includes("--high-usage")) {
    await testHighUsageAlert();
  } else if (args.includes("--daily-summary")) {
    await testDailySummary();
  } else if (args.includes("--system-error")) {
    await testSystemError();
  } else if (args.includes("--critical")) {
    await testCriticalError();
  } else if (args.includes("--existing")) {
    await testExistingNotification();
  } else {
    // Run all tests by default
    await runAllTests();
  }
}

// Run
main().catch(console.error);
