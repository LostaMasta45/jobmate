# Test Reset Password dengan Debug Logging

## 🎯 Quick Test untuk Email: updatesumobito@gmail.com

Saya sudah tambahkan debug logging ke reset page. Mari test step-by-step:

---

## Step 1: Cek Email Terdaftar di Database

**Buka Supabase Dashboard:**
1. Go to: https://supabase.com/dashboard
2. Pilih project JobMate
3. Klik **SQL Editor** di sidebar
4. Paste & run query ini:

```sql
SELECT 
  id, 
  email, 
  email_confirmed_at,
  created_at,
  last_sign_in_at
FROM auth.users 
WHERE email = 'updatesumobito@gmail.com';
```

**Expected Result:**
```
✅ 1 row found
   email: updatesumobito@gmail.com
   email_confirmed_at: [some date or NULL]
   
❌ 0 rows found
   → Email belum terdaftar, harus signup dulu
```

**Hasil Anda:** ________________

---

## Step 2: Test Reset dengan Console Logging

**A. Start Development Server**
```bash
npm run dev
```

**B. Open Browser with Console**
1. Buka: http://localhost:3000/reset
2. Tekan `F12` atau `Ctrl+Shift+I` (open DevTools)
3. Klik tab **Console**

**C. Submit Reset Form**
1. Masukkan email: `updatesumobito@gmail.com`
2. Klik **"Kirim Link Reset"**
3. Perhatikan console logs

**Expected Console Output:**
```
🔍 Debug Info:
  Email: updatesumobito@gmail.com
  Redirect URL: http://localhost:3000/auth/verify?type=recovery
  Supabase URL: [your-supabase-url]

📧 Supabase Response:
  Data: null  (atau object)
  Error: null (jika sukses) atau {message, status} (jika error)

✅ Reset request successful! Check email (and spam folder)
```

**Hasil Console Anda:** ________________

---

## Step 3: Interpret Console Output

### Case 1: Success (No Error)
```
📧 Supabase Response:
  Data: null
  Error: null
  
✅ Reset request successful!
```
**Meaning:** Request berhasil dikirim ke Supabase
**Next:** Cek email inbox/spam dalam 2-3 menit

---

### Case 2: Email Not Found Error
```
❌ Reset failed: {
  message: "User not found",
  status: 400
}
```
**Meaning:** Email tidak terdaftar di database
**Fix:** Register email dulu di `/sign-up`

---

### Case 3: Rate Limit Error
```
❌ Reset failed: {
  message: "Email rate limit exceeded",
  status: 429
}
```
**Meaning:** Terlalu banyak request (>4 per jam)
**Fix:** Tunggu 1 jam atau gunakan email lain

---

### Case 4: Network Error
```
💥 Unexpected error: NetworkError
```
**Meaning:** Koneksi ke Supabase gagal
**Fix:** Cek internet, cek Supabase project status

---

## Step 4: Cek Supabase Auth Logs

**Navigate to:**
1. Supabase Dashboard → **Authentication** → **Logs**
2. Filter by: **Last 1 hour**
3. Look for: `password_recovery` events

**Expected Logs:**
```
✅ Event: password_recovery
   Email: updatesumobito@gmail.com
   Status: success
   Timestamp: [just now]
```

**If no logs:**
```
❌ Request never reached Supabase
   → Check console errors (Step 2)
   → Check network tab in DevTools
```

**Hasil Logs Anda:** ________________

---

## Step 5: Cek Email Inbox

**Where to check:**
1. **Gmail Inbox** - Primary tab
2. **Gmail Spam/Junk** - Check here too!
3. **Gmail Search** - Type: `from:@mail.app.supabase.io`
4. **All Mail** folder - Sometimes hidden here

**Email Details:**
```
From: no-reply@mail.app.supabase.io
Subject: Reset Your Password (atau similar)
Body: Contains reset link
Link format: .../auth/verify?token=...&type=recovery
```

**Wait Time:**
- Normal: 10-60 seconds
- Max: 3 minutes
- If >5 minutes: Something wrong

**Hasil Email:** ________________

---

## 🔧 Common Issues & Quick Fixes

### Issue 1: Email Not in Database
**Symptoms:**
- Console: "User not found"
- SQL query: 0 rows

**Fix:**
```bash
# Register user first:
1. Go to: http://localhost:3000/sign-up
2. Register with: updatesumobito@gmail.com
3. Confirm email if required
4. Then try reset password again
```

---

### Issue 2: Supabase Project Paused
**Symptoms:**
- Console: Network timeout
- Supabase dashboard shows "Paused"

**Fix:**
```bash
1. Go to: Supabase Dashboard
2. Click "Restore Project" button
3. Wait 2-3 minutes
4. Try reset again
```

---

### Issue 3: Email Auth Disabled
**Symptoms:**
- Console: "Email provider not enabled"
- No errors but no email

**Fix:**
```bash
1. Supabase Dashboard → Settings → Authentication
2. Enable "Email Provider" toggle
3. Save changes
4. Try reset again
```

---

### Issue 4: Wrong Site URL
**Symptoms:**
- Email arrives but link doesn't work
- Redirect to wrong domain

**Fix:**
```bash
1. Supabase → Settings → Authentication → URL Configuration
2. Site URL: http://localhost:3000 (for dev)
3. Redirect URLs: Add http://localhost:3000/**
4. Save & retry
```

---

### Issue 5: Gmail Blocking Emails
**Symptoms:**
- Console shows success
- Supabase logs show success
- But email not in inbox/spam

**Fix:**
```bash
1. Gmail search: from:@mail.app.supabase.io
2. Check "All Mail" folder
3. Check filters/forwarding settings
4. Try different email provider (Yahoo, Outlook)
```

---

## 📊 Debugging Flowchart

```
Start Test
    ↓
[1] Email in DB? (SQL Query)
    ├─ YES → Continue
    └─ NO  → Register first at /sign-up
    ↓
[2] Submit Reset Form
    ↓
[3] Check Console Logs
    ├─ "User not found" → Back to Step 1
    ├─ "Rate limit" → Wait 1 hour
    ├─ "Network error" → Check internet/Supabase
    └─ "Success" → Continue
    ↓
[4] Check Supabase Logs
    ├─ No logs → Frontend issue (check console)
    ├─ Error logs → Check error message
    └─ Success logs → Continue
    ↓
[5] Check Email (2-3 min wait)
    ├─ Not found → Check spam
    ├─ Still not found → Check Gmail search
    ├─ Still not found → Try different email provider
    └─ Found → SUCCESS! Click link & set password
```

---

## 🎯 Complete Test Checklist

Copy this and fill in results:

```
[ ] Step 1: SQL Query Result
    Email found in database? _______
    email_confirmed_at: _______

[ ] Step 2: Browser Console
    Error shown? _______
    Error message: _______
    Success logged? _______

[ ] Step 3: Supabase Auth Logs
    password_recovery event found? _______
    Status: _______

[ ] Step 4: Email Inbox
    Email received? _______
    Location (inbox/spam): _______
    Time to arrive: _______

[ ] Step 5: Click Link
    Link works? _______
    Redirects to verify page? _______
    Can set new password? _______
```

---

## 🚨 If Still Not Working

**Provide this info:**

1. **SQL Query Result:**
   ```
   [Paste result here]
   ```

2. **Browser Console Output:**
   ```
   [Paste console logs here]
   ```

3. **Supabase Auth Logs:**
   ```
   [Screenshot or paste logs]
   ```

4. **Email Search Result:**
   ```
   Found in inbox/spam/not found: _______
   ```

5. **Supabase Project Status:**
   ```
   Active/Paused: _______
   Email Provider: Enabled/Disabled: _______
   Site URL: _______
   ```

**Then I can help debug further!**

---

## 💡 Quick Alternative Test

**If email system broken, test with different email:**

```bash
# Try with your personal email:
1. Register new account: yourname@gmail.com
2. Try reset password
3. Compare results with updatesumobito@gmail.com
```

**If new email works:**
→ Issue specific to updatesumobito@gmail.com (check Gmail filters)

**If new email also fails:**
→ Issue with Supabase email system (check project settings)

---

## ✅ Expected Success Flow

```
1. Open /reset page
2. Enter: updatesumobito@gmail.com
3. Click: Kirim Link Reset
4. See console: ✅ Reset request successful!
5. See Supabase logs: password_recovery success
6. Wait 1-2 minutes
7. Email arrives in inbox or spam
8. Click link → redirects to /auth/verify
9. Enter new password
10. Success! Redirect to dashboard
11. Login with new password
```

---

**Start testing now and tell me which step fails!** 🔍
