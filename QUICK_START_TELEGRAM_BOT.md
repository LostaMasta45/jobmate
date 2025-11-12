# 🚀 QUICK START - TELEGRAM BOT MONITORING

## ⚡ 5-Minute Setup Guide

### Step 1: Run Database Migration (1 min)

1. Buka **Supabase Dashboard** → SQL Editor
2. Copy & paste isi file `supabase-monitoring-extension.sql`
3. Click **Run**
4. Verify berhasil:
   ```sql
   SELECT * FROM admin_notification_preferences;
   SELECT * FROM daily_summary_logs;
   ```

### Step 2: Verify Environment Variables (1 min)

Check file `.env` atau `.env.local`:
```env
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_ADMIN_CHAT_ID=123456789
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

**Cara dapat:**
- **Bot Token**: Chat @BotFather di Telegram → `/newbot`
- **Chat ID**: Chat bot Anda → Forward ke @userinfobot → lihat ID

### Step 3: Test Bot (2 min)

```bash
# Install tsx jika belum (one-time)
npm install -D tsx

# Test bot
npx tsx test-telegram-bot.ts --basic

# Atau test semua
npx tsx test-telegram-bot.ts
```

**Expected Output:**
```
✅ Basic message sent successfully!
```

**Check Telegram** - Anda harus terima message dari bot.

### Step 4: Restart Dev Server (1 min)

```bash
# Stop current server (Ctrl+C)
# Start again
npm run dev
```

---

## 🧪 Testing

### Test Tool Usage Notification

1. Buka tool apa saja (Cover Letter, CV, Email)
2. Generate dokumen
3. Check Telegram - harus dapat notif seperti:

```
🛠️ TOOL USED

━━━━━━━━━━━━━━━━━━━━━
👤 User
Your Name
📧 your@email.com
🆓 FREE

🔧 Tool
Cover Letter Generator

📄 Document
"Marketing Manager at Google"

📈 Usage Today
• Total tools: 1x
• Same tool: 1x
📊 Quota: 1/5

⏰ 11/11/2025, 10:30:00
━━━━━━━━━━━━━━━━━━━━━
```

### Test Daily Summary (Manual)

```bash
# Option 1: Via test script
npx tsx test-telegram-bot.ts --daily-summary

# Option 2: Via browser (login sebagai admin)
https://localhost:3001/api/cron/daily-summary
```

---

## 📋 Quick Troubleshooting

### ❌ No message received

**Check:**
1. Bot token correct?
   ```bash
   # Test via curl
   curl "https://api.telegram.org/bot<YOUR_TOKEN>/getMe"
   ```
2. Chat ID correct?
   - Chat your bot
   - Forward message to @userinfobot
   - Copy the ID

3. Bot started?
   - Must click "Start" button di bot Telegram

### ❌ Module not found

```bash
# Install dependencies
npm install

# Clean build
rm -rf .next
npm run dev
```

### ❌ Database error

```sql
-- Verify tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('usage_logs', 'admin_notification_preferences', 'daily_summary_logs');
```

---

## 🎯 What's Integrated

✅ **Already Monitoring:**
- Cover Letter Generator
- Email Template Generator
- AI Cover Letter (3 variations)
- CV ATS Generator
- CV Creative Generator

✅ **Automatic Tracking:**
- Tool usage logged to database
- Telegram notifications sent to admin
- Usage stats calculated (quota, frequency)
- High usage alerts (>20x per day)

✅ **Daily Summary:**
- Cron job ready at `/api/cron/daily-summary`
- Manual test via GET request (admin only)

---

## 📚 Next Steps

### Deploy to Production

1. **Push to Git**
   ```bash
   git add .
   git commit -m "feat: add telegram bot monitoring"
   git push
   ```

2. **Set Environment Variables** di Vercel:
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_ADMIN_CHAT_ID`
   - `CRON_SECRET` (generate random string)

3. **Setup Cron Job** di Vercel Dashboard:
   - Path: `/api/cron/daily-summary`
   - Schedule: `0 2 * * *` (09:00 WIB)
   - Authorization: `Bearer YOUR_CRON_SECRET`

### Add More Tools

Edit tool actions (example):
```typescript
// In your tool action
try {
  const { logToolUsageWithNotification } = await import("@/lib/telegram-monitoring");
  await logToolUsageWithNotification(
    "Your Tool Name",
    "Document Title",
    { metadata: "optional" }
  );
} catch (error) {
  console.error("Monitoring failed:", error);
}
```

---

## 💡 Pro Tips

1. **Rate Limiting**: Notifications auto-batch jika >10 per hour
2. **Error Handling**: Monitoring failures won't break your app
3. **Privacy**: No passwords or sensitive data in notifications
4. **Testing**: Always test locally first before deploy

---

## 📞 Need Help?

Check full documentation:
- `TELEGRAM_MONITORING_IMPLEMENTATION_COMPLETE.md` - Full guide
- `test-telegram-bot.ts` - Test script with examples
- `telegrambot.md` - Original feature proposals

---

**Ready to go!** 🚀

**Testing Command:**
```bash
npx tsx test-telegram-bot.ts --basic
```

**Expected:** ✅ Message received in Telegram
