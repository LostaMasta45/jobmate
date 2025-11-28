# Debug: Email Reset Password Tidak Terkirim

## 🔍 Checklist Debugging

### 1. Cek Email Terdaftar di Database

**SQL Query di Supabase:**
```sql
-- Buka Supabase Dashboard → SQL Editor
-- Jalankan query ini:

SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email = 'updatesumobito@gmail.com';
```

**Expected Result:**
- ✅ Ada 1 row dengan email tersebut
- ❌ Tidak ada row → Email belum terdaftar

**Jika tidak ada:**
```sql
-- Register user dulu atau cek typo email
```

---

### 2. Cek Browser Console

**Buka Developer Tools:**
1. Tekan `F12` atau `Ctrl+Shift+I`
2. Tab **Console**
3. Submit reset password form
4. Lihat apakah ada error:

**Possible Errors:**

**Error 1: "User not found"**
```
Cause: Email tidak terdaftar
Fix: Register email dulu atau gunakan email yang sudah terdaftar
```

**Error 2: "Email rate limit exceeded"**
```
Cause: Terlalu banyak request (>4 per jam)
Fix: Tunggu 1 jam atau gunakan email lain
```

**Error 3: Network error**
```
Cause: Koneksi Supabase gagal
Fix: Cek internet, cek Supabase project status
```

---

### 3. Cek Supabase Auth Settings

**Go to:** https://supabase.com/dashboard

**Navigate to:** Your Project → Settings → Authentication

**Check these settings:**

#### ✅ Email Auth Enabled
```
Setting: Enable Email Provider
Status: Should be ON (green)
Location: Authentication → Providers → Email
```

#### ✅ Confirm Email Setting
```
Setting: Enable email confirmations
Status: Can be ON or OFF (both work for reset)
Location: Authentication → Email
```

#### ✅ Site URL
```
Setting: Site URL
Value: http://localhost:3000 (for dev)
       OR https://yourdomain.com (for prod)
Location: Authentication → URL Configuration
```

#### ✅ Redirect URLs
```
Setting: Redirect URLs
Should include:
- http://localhost:3000/auth/verify
- http://localhost:3000/**

Location: Authentication → URL Configuration
```

---

### 4. Test dengan Logging

Mari kita tambahkan logging untuk debug. Edit file reset page:

**File:** `app/(auth)/reset/page.tsx`

**Add console.log untuk debugging:**

```typescript
const handleResetPassword = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!validateEmail(email)) {
    return;
  }

  setLoading(true);
  setError(null);

  try {
    const supabase = createClient();
    const redirectUrl = `${window.location.origin}/auth/verify?type=recovery`;
    
    console.log('🔍 Attempting reset for:', email);
    console.log('🔗 Redirect URL:', redirectUrl);
    
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    console.log('📧 Reset response:', { data, error });

    if (error) {
      console.error('❌ Reset error:', error);
      setError(error.message);
      setLoading(false);
      return;
    }

    console.log('✅ Reset email sent successfully');
    setSuccess(true);
    setLoading(false);
  } catch (err) {
    console.error("💥 Unexpected error:", err);
    setError("Terjadi kesalahan sistem.");
    setLoading(false);
  }
};
```

---

### 5. Cek Supabase Logs

**Go to:** Supabase Dashboard → Authentication → Logs

**Filter by:**
- Event Type: `password_recovery`
- Time: Last 1 hour

**Look for:**
```
✅ Success: Event logged, email sent
❌ No logs: Request never reached Supabase (frontend issue)
❌ Error logs: Check error message
```

---

### 6. Test dengan Supabase SQL Command

**Manually trigger reset from Supabase:**

```sql
-- Buka SQL Editor di Supabase Dashboard
-- Jalankan ini untuk test:

SELECT auth.send_reset_password_email(
  'updatesumobito@gmail.com',
  'http://localhost:3000/auth/verify?type=recovery'
);
```

**Expected:**
- ✅ Returns success → Email should arrive
- ❌ Error → Check error message

---

### 7. Check Email Provider Status

**Supabase Email Status:**

Go to: Dashboard → Settings → Authentication

**Check:**
```
Email Provider: Should show "Default" or "Custom SMTP"
Status: Active (green)
```

**If using Default:**
- From: `no-reply@mail.app.supabase.io`
- Should work automatically

**If shows inactive:**
- Contact Supabase support
- Check project billing status

---

### 8. Common Issues & Solutions

#### Issue 1: Email Tidak Terdaftar
```bash
Symptom: No error, success page shows, but no email
Cause: Email not in auth.users table
Fix: Register email first or use existing email
```

#### Issue 2: Supabase Project Paused
```bash
Symptom: Network timeout or 500 error
Cause: Free tier project auto-paused after inactivity
Fix: Go to dashboard, click "Restore project"
```

#### Issue 3: Email Confirmations Required
```bash
Symptom: Email sent but user not in auth.users
Cause: Email confirmation enabled, user never verified
Fix: Check auth.users.email_confirmed_at is not null
```

#### Issue 4: Wrong Redirect URL
```bash
Symptom: Email arrives but link broken
Cause: Redirect URL not whitelisted
Fix: Add to Supabase → Auth → Redirect URLs
```

#### Issue 5: Gmail Blocks Email
```bash
Symptom: Email not in inbox or spam
Cause: Gmail aggressive filtering
Fix: 
  1. Check Gmail "All Mail" folder
  2. Search: from:no-reply@mail.app.supabase.io
  3. Mark as "Not Spam" if found
```

---

## 🛠️ Step-by-Step Debug Process

### Step 1: Verify Email Exists
```sql
SELECT * FROM auth.users WHERE email = 'updatesumobito@gmail.com';
```
- ❌ **No result?** → Register email first
- ✅ **Has result?** → Continue

### Step 2: Check Browser Console
- Open DevTools (F12)
- Submit reset form
- Look for errors
- ❌ **See error?** → Fix based on error message
- ✅ **No error?** → Continue

### Step 3: Check Supabase Logs
- Dashboard → Auth → Logs
- Filter: `password_recovery`
- ❌ **No logs?** → Frontend not calling API (check Step 2)
- ❌ **Error logs?** → Check error message
- ✅ **Success logs?** → Continue

### Step 4: Check Email Delivery
- Wait 2-3 minutes
- Check inbox AND spam
- Search: `from:mail.app.supabase.io`
- ❌ **Not found?** → Check Supabase email provider status
- ✅ **Found?** → Success!

---

## 🔧 Quick Fix Commands

### Fix 1: Ensure User Exists
```sql
-- If user doesn't exist, create via signup:
-- Go to /sign-up and register
-- OR insert manually:

INSERT INTO auth.users (email, encrypted_password)
VALUES ('updatesumobito@gmail.com', crypt('temppassword', gen_salt('bf')));
```

### Fix 2: Reset Rate Limit (Dev Only)
```sql
-- If hit rate limit, clear it:
DELETE FROM auth.rate_limit 
WHERE email = 'updatesumobito@gmail.com';
```

### Fix 3: Force Email Confirmation
```sql
-- If email needs confirmation:
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = 'updatesumobito@gmail.com';
```

---

## 📊 Expected Flow vs Actual Flow

### Expected Flow:
```
1. User submits email ✅
2. Frontend calls resetPasswordForEmail() ✅
3. Supabase Auth receives request ✅
4. Supabase generates token ✅
5. Supabase sends email ❓ ← CHECK THIS
6. User receives email ❓ ← AND THIS
7. User clicks link ⏸️
8. Sets new password ⏸️
```

### What to Check:
- **Step 5 failing?** → Check Supabase email provider
- **Step 6 failing?** → Check spam, email provider
- **Both failing?** → Check email exists in DB

---

## 🎯 Test Right Now

**Run this test sequence:**

1. **Open SQL Editor** (Supabase Dashboard)
   ```sql
   SELECT email, email_confirmed_at 
   FROM auth.users 
   WHERE email = 'updatesumobito@gmail.com';
   ```
   **Result:** _______________

2. **Open Browser Console** (F12)
   ```
   Go to: http://localhost:3000/reset
   Submit: updatesumobito@gmail.com
   Check Console Logs
   ```
   **Any errors?** _______________

3. **Check Supabase Logs**
   ```
   Dashboard → Auth → Logs
   Filter: password_recovery
   ```
   **See logs?** _______________

4. **Check Email**
   ```
   Gmail search: from:@mail.app.supabase.io
   Check spam folder too
   ```
   **Email found?** _______________

---

## 📞 Still Not Working?

**Provide this info:**

1. SQL query result (email exists?)
2. Browser console errors (any errors?)
3. Supabase auth logs (success/error?)
4. Email provider status (active?)
5. Site URL configured? (localhost:3000?)

**Then I can help debug further!**

---

## 🚨 Emergency Fallback

**If email system completely broken, use Magic Link:**

```typescript
// Alternative: Use magic link instead
const { error } = await supabase.auth.signInWithOtp({
  email: email,
  options: {
    emailRedirectTo: `${window.location.origin}/dashboard`,
  }
});
```

This bypasses password reset and logs user in directly.
