# 🚀 QUICK TEST: Email Ajukan Akun

**Test Email**: reza.nur.h45@gmail.com  
**Status**: ✅ Ready to Test

---

## ✅ Pre-Check (Already Verified)

- ✅ **Resend configured**: API key found in .env.local
- ✅ **FROM_EMAIL**: onboarding@resend.dev (sandbox mode - OK for testing)
- ✅ **Email function**: sendAccountPendingEmail() implemented
- ✅ **API route**: Calls email function on submit
- ✅ **Testing guide**: Complete guide created

---

## 🎯 LANGKAH CEPAT (5 Menit)

### 1. Cleanup Data Lama (Jika Perlu)

**Via Supabase Dashboard** (Recommended):

1. Go to: https://supabase.com/dashboard
2. Open your project
3. **Table Editor** → `account_applications`
4. Search: `reza.nur.h45@gmail.com`
5. If found → Click delete (trash icon)

**OR via SQL**:
```sql
-- Run in Supabase SQL Editor
DELETE FROM account_applications 
WHERE email = 'reza.nur.h45@gmail.com';
```

---

### 2. Start Dev Server

```bash
npm run dev
```

---

### 3. Open Form & Submit

1. **Go to**: http://localhost:3000/ajukan-akun

2. **Fill form**:
   - Nama: `Reza Test Email`
   - Username: `rezatest`
   - Email: `reza.nur.h45@gmail.com`
   - WhatsApp: `081234567890`
   - Password: `test123`

3. **Upload**: Any image/PDF (max 2MB)

4. **Click**: "Kirim Pengajuan Sekarang"

5. **Confirm**: "Ya, Kirim Pengajuan"

---

### 4. Monitor Terminal

**Look for these logs:**
```bash
✅ File uploaded successfully
✅ Application saved successfully
✅ Account pending email sent to reza.nur.h45@gmail.com  ← THIS!
✅ Telegram notification sent successfully
```

**If you see that line** → Email was sent! ✅

---

### 5. Check Email Inbox

1. **Go to**: https://mail.google.com
2. **Login**: reza.nur.h45@gmail.com
3. **Check inbox** (or Spam folder)

**Expected Email:**
- **Subject**: ⏳ Pengajuan Akun JobMate Sedang Diproses
- **From**: onboarding@resend.dev
- **Content**: Confirmation + timeline + next steps

---

## 🐛 If Email Not Received

### Check 1: Terminal Logs
```
✅ Account pending email sent to reza.nur.h45@gmail.com
```
If you see this → Email was sent successfully.

### Check 2: Spam Folder
Resend sandbox emails might go to spam.

### Check 3: Resend Dashboard
Go to: https://resend.com/emails
- Check if email appears in sent list
- Check delivery status

### Check 4: Wait 1-2 Minutes
Sometimes Resend has slight delay.

---

## 📊 What Happens Behind the Scenes

```
User submits form
    ↓
API Route: /api/ajukan-akun
    ↓
1. Upload proof file to Supabase Storage
2. Insert record to account_applications table
3. ⭐ Call sendAccountPendingEmail()
    ↓
    Resend API
    ↓
    Gmail SMTP
    ↓
    📧 Email delivered to inbox
4. Send Telegram notification to admin
    ↓
Redirect to /terima-kasih page
```

---

## 📧 Email Details

**Template**: `emails/AccountPendingEmail.tsx`

**Content**:
```
Halo [Nama],

Terima kasih telah mengajukan akun JobMate!

✅ Pengajuan Anda telah kami terima
⏰ Tim kami akan meninjau dalam 1x24 jam
📧 Anda akan menerima email jika disetujui

[Details about next steps...]

---
Tim JobMate
```

**Styling**:
- Professional design
- Responsive
- Dark mode support
- Consistent branding

---

## ✅ Success Criteria

Test **BERHASIL** jika:
1. ✅ Form submit tanpa error
2. ✅ Console log: "Account pending email sent..."
3. ✅ **Email received** in inbox (or spam)
4. ✅ Email content correct
5. ✅ Redirect ke thank you page

---

## 🔄 To Re-Test

1. **Delete application** in Supabase:
   ```sql
   DELETE FROM account_applications 
   WHERE email = 'reza.nur.h45@gmail.com';
   ```

2. **Submit again** with same form data

3. **Check email** again

---

## 📁 Files Reference

### Created Today:
1. **`db/cleanup-test-email.sql`**
   - SQL script untuk cleanup data
   - Safe with verification steps

2. **`TEST_EMAIL_AJUKAN_AKUN.md`**
   - Complete testing guide
   - Troubleshooting section
   - Expected results

3. **`QUICK_TEST_EMAIL_AJUKAN.md`** (this file)
   - Quick reference
   - 5-minute test guide

### Existing Files:
- `lib/email-notifications.ts` - Email functions
- `emails/AccountPendingEmail.tsx` - Email template
- `app/api/ajukan-akun/route.ts` - API endpoint

---

## 🎯 Ready to Go!

### Checklist:
- [x] ✅ Resend API key configured
- [x] ✅ Email function implemented
- [ ] Clean up old data (if needed)
- [ ] Start dev server
- [ ] Submit form
- [ ] **Check email inbox!** 📧

---

## 💡 Pro Tips

1. **Use sandbox mode** for testing (onboarding@resend.dev)
2. **Check Spam folder** if not in inbox
3. **Monitor terminal logs** for real-time feedback
4. **Wait 1-2 minutes** for email delivery
5. **Use Resend dashboard** to verify sent emails

---

## 🎉 When It Works

You'll see:
- ✅ Success message in terminal
- ✅ Redirect to thank you page with confetti
- ✅ **Email in inbox** with correct content
- ✅ Application saved in database

**That's it!** Email notification is working! 🎊

---

**Last Updated**: 2025-10-30  
**Test Status**: Ready  
**Next Step**: Submit form and check email!
