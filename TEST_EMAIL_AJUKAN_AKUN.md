# 📧 TEST EMAIL NOTIFICATION - AJUKAN AKUN

**Date**: 2025-10-30  
**Test Email**: reza.nur.h45@gmail.com  
**Purpose**: Test email notification saat submit ajukan akun

---

## 🎯 What Will Be Tested

Saat user submit form `/ajukan-akun`, sistem akan:
1. ✅ Save application ke database
2. ✅ Upload proof file ke storage
3. ✅ **Send email notification** ke user (THIS IS WHAT WE TEST!)
4. ✅ Send Telegram notification ke admin

### Email yang Akan Dikirim:
- **Subject**: ⏳ Pengajuan Akun JobMate Sedang Diproses
- **To**: reza.nur.h45@gmail.com
- **Content**: AccountPendingEmail component
  - Greeting dengan nama user
  - Konfirmasi pengajuan diterima
  - Estimasi waktu review (1x24 jam)
  - Next steps: tunggu email approval

---

## 🔧 Prerequisites

### 1. ✅ Check Resend API Key
```bash
# File: .env.local
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

**Verify:**
```bash
# Run in terminal
grep RESEND_API_KEY .env.local
```

**If not found:**
- Get API key from: https://resend.com/api-keys
- Add to `.env.local`
- Restart dev server

---

### 2. ✅ Check FROM_EMAIL Configuration
```typescript
// File: lib/resend.ts
export const FROM_EMAIL = "JobMate <noreply@yourdomain.com>";
```

**Important:**
- Domain harus verified di Resend
- Jika pakai Resend sandbox: `onboarding@resend.dev`

---

### 3. ✅ Cleanup Old Data (If Needed)

**Option A: Via Supabase Dashboard (Recommended)**

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Go to: **Table Editor** > `account_applications`
4. Search: email = `reza.nur.h45@gmail.com`
5. If found → Click delete icon
6. Go to: **Authentication** > **Users**
7. Search: `reza.nur.h45@gmail.com`
8. If found → Click "..." → Delete user

**Option B: Via SQL Editor**

```sql
-- Run this in Supabase SQL Editor
SELECT * FROM account_applications 
WHERE email = 'reza.nur.h45@gmail.com';

-- If data exists, delete:
DELETE FROM account_applications 
WHERE email = 'reza.nur.h45@gmail.com';

-- Check profiles
SELECT * FROM profiles 
WHERE email = 'reza.nur.h45@gmail.com';

-- If exists, delete:
DELETE FROM profiles 
WHERE email = 'reza.nur.h45@gmail.com';
```

**Option C: Use Cleanup Script**

```bash
# File provided: db/cleanup-test-email.sql
# Run step by step in Supabase SQL Editor
```

---

## 🚀 Testing Steps

### Step 1: Start Development Server
```bash
npm run dev
```

Server should be running at: http://localhost:3000

---

### Step 2: Open Form Ajukan Akun

Navigate to: http://localhost:3000/ajukan-akun

---

### Step 3: Fill the Form

**Test Data:**
```
Nama Lengkap: Reza Test Email
Username: rezaemail
Email: reza.nur.h45@gmail.com
WhatsApp: 081234567890
Password: test123
```

**Important:**
- ✅ Use VALID email format
- ✅ Username: lowercase, alphanumeric, underscore only
- ✅ WhatsApp: must start with 8
- ✅ Password: min 6 characters

---

### Step 4: Upload Bukti Pembayaran

**Upload any image/PDF:**
- ✅ Max 2MB
- ✅ Formats: JPG, PNG, PDF
- ✅ Can be any test file (tidak harus real payment proof)

---

### Step 5: Submit Form

1. Click: **"Kirim Pengajuan Sekarang"**
2. Dialog konfirmasi akan muncul
3. Review data
4. Click: **"Ya, Kirim Pengajuan"**

---

### Step 6: Monitor Console Logs

**Terminal (npm run dev) will show:**

```bash
[Ajukan Akun API] Received application: {...}
[Ajukan Akun API] Supabase client created
[Ajukan Akun API] Uploading file: 1730xxx-rezaemail.png
[Ajukan Akun API] File uploaded successfully
[Ajukan Akun API] Inserting application to database
[Ajukan Akun API] Application saved successfully, ID: xxx-xxx-xxx
[Email Debug] HTML type: string
[Email Debug] HTML length: 1234
✅ Account pending email sent to reza.nur.h45@gmail.com
Telegram notification sent successfully
[Ajukan Akun API] Application submitted successfully
```

**Look for:**
- ✅ `File uploaded successfully`
- ✅ `Application saved successfully`
- ✅ `Account pending email sent to reza.nur.h45@gmail.com`
- ✅ `Telegram notification sent successfully`

**If you see errors:**
- ❌ `Failed to send account pending email:` → Check Resend API key
- ❌ `Telegram notification failed:` → OK, not critical for email test

---

### Step 7: Check Email Inbox

**Go to:** https://mail.google.com
**Login:** reza.nur.h45@gmail.com

**Expected Email:**
- **Subject**: ⏳ Pengajuan Akun JobMate Sedang Diproses
- **From**: JobMate <noreply@yourdomain.com> (or onboarding@resend.dev)
- **Content**:
  ```
  Halo Reza Test Email,
  
  Terima kasih telah mengajukan akun JobMate!
  
  ✅ Pengajuan Anda telah kami terima
  ⏰ Tim kami akan meninjau dalam 1x24 jam
  📧 Anda akan menerima email jika disetujui
  
  [More details...]
  ```

**If email NOT received:**
1. Check **Spam/Junk folder**
2. Wait 1-2 minutes (Resend can be slow sometimes)
3. Check terminal logs for errors
4. Check Resend dashboard: https://resend.com/emails

---

### Step 8: Verify in Supabase

**Go to:** Supabase Dashboard > Table Editor > `account_applications`

**Should see:**
- ✅ New row with email: `reza.nur.h45@gmail.com`
- ✅ Status: `pending`
- ✅ proof_path: `1730xxx-rezaemail.png`
- ✅ full_name: `Reza Test Email`
- ✅ telegram_link_code: `xxxxxxxxxxxx`

---

## 🐛 Troubleshooting

### Problem 1: Email Not Sent
**Symptoms:**
```
Failed to send account pending email: {...}
```

**Solutions:**
1. Check RESEND_API_KEY in .env.local
2. Verify domain in Resend dashboard
3. Check FROM_EMAIL format
4. Check Resend quota (free: 100 emails/day)

**Quick Fix:**
```bash
# .env.local
RESEND_API_KEY=re_your_actual_key_here

# Restart server
npm run dev
```

---

### Problem 2: Email in Spam
**Symptoms:**
- Email sent successfully in logs
- Not in inbox

**Solutions:**
1. Check Spam/Junk folder
2. Add sender to contacts
3. If using custom domain, check SPF/DKIM records

---

### Problem 3: "Duplicate Key" Error
**Symptoms:**
```
Error: duplicate key value violates unique constraint
```

**Solution:**
Run cleanup script to delete old data:
```sql
DELETE FROM account_applications 
WHERE email = 'reza.nur.h45@gmail.com';
```

---

### Problem 4: File Upload Error
**Symptoms:**
```
Gagal upload bukti transfer: ...
```

**Solutions:**
1. Check Supabase storage bucket `proofs` exists
2. Check storage RLS policies
3. File size < 2MB
4. Valid file format (image/pdf)

---

## ✅ Success Criteria

Test dianggap **BERHASIL** jika:

1. ✅ Form submit tanpa error
2. ✅ Data masuk ke database
3. ✅ File terupload ke storage
4. ✅ **Email diterima di inbox** (or spam folder)
5. ✅ Email content sesuai (AccountPendingEmail)
6. ✅ Redirect ke thank you page
7. ✅ Console logs show success

---

## 📊 Expected Results

### Terminal Logs:
```
✅ File uploaded successfully
✅ Application saved successfully
✅ Account pending email sent to reza.nur.h45@gmail.com
✅ Telegram notification sent successfully
```

### Database:
```sql
account_applications:
- email: reza.nur.h45@gmail.com
- status: pending
- proof_path: [file name]
- created_at: [timestamp]
```

### Email Inbox:
```
Subject: ⏳ Pengajuan Akun JobMate Sedang Diproses
From: JobMate
To: reza.nur.h45@gmail.com
Status: Delivered ✓
```

### User Flow:
```
1. Fill form → 2. Submit → 3. Redirect to /terima-kasih
4. See confetti 🎉
5. See kode referensi
6. Check email inbox → Email received! ✅
```

---

## 🔄 Re-Test Instructions

**To test again:**

1. **Cleanup database:**
   ```sql
   DELETE FROM account_applications 
   WHERE email = 'reza.nur.h45@gmail.com';
   ```

2. **Delete auth user** (if approved):
   - Go to Supabase Dashboard
   - Authentication > Users
   - Delete: reza.nur.h45@gmail.com

3. **Delete uploaded file** (optional):
   - Storage > proofs bucket
   - Find and delete test files

4. **Submit new application**
   - Repeat Step 1-8 above

---

## 📧 Email Template Details

### File: `emails/AccountPendingEmail.tsx`

**Content Includes:**
- ✅ Personalized greeting
- ✅ Confirmation message
- ✅ Timeline expectation (1x24 jam)
- ✅ Next steps
- ✅ Contact information
- ✅ FAQ section
- ✅ Professional design
- ✅ Dark mode support

**Styling:**
- Uses Tailwind CSS via @react-email
- Responsive design
- Consistent with JobMate branding

---

## 🎯 Additional Tests (Optional)

### Test 2: Approve Email
After application approved by admin:
```
Subject: 🎉 Selamat! Akun JobMate Anda Telah Disetujui
```

### Test 3: VIP Upgrade Email
After admin upgrades to VIP:
```
Subject: ⭐ Selamat! Anda Sekarang VIP Basic
or
Subject: 👑 Selamat! Anda Sekarang VIP Premium
```

---

## 📝 Notes

### Email Provider: Resend
- **Dashboard**: https://resend.com/dashboard
- **Logs**: https://resend.com/emails
- **Quota**: Free tier = 100 emails/day

### Testing Tips:
1. ✅ Always check console logs first
2. ✅ Check Spam folder if not in inbox
3. ✅ Wait 1-2 minutes for email delivery
4. ✅ Use Resend dashboard to verify sent emails
5. ✅ Test with real email (not temp email)

### Security:
- ❌ Never commit RESEND_API_KEY to git
- ❌ Never expose API key in client-side code
- ✅ Always use .env.local for secrets
- ✅ API key only used in server-side code

---

## 🚀 Ready to Test!

### Quick Checklist:
- [ ] RESEND_API_KEY configured in .env.local
- [ ] Dev server running (npm run dev)
- [ ] Old data cleaned up (if any)
- [ ] Form data ready (see Step 3)
- [ ] Test file ready for upload
- [ ] Email inbox ready to check
- [ ] Console logs monitored

### When Ready:
1. Go to: http://localhost:3000/ajukan-akun
2. Fill form with test data
3. Upload any image/PDF
4. Submit
5. **Check email inbox!** 📧

---

**Good luck testing! 🎉**

If you see the email in inbox → **TEST SUCCESSFUL! ✅**

---

**Last Updated**: 2025-10-30  
**Status**: Ready for Testing  
**Test Email**: reza.nur.h45@gmail.com
