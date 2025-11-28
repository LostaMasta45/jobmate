# Fix: "Unable to process request" - Supabase Auth

## 🔴 Error Yang Terjadi

```
AuthApiError: Unable to process request
```

**Meaning:** Request berhasil sampai ke Supabase, tapi Supabase menolak karena konfigurasi belum benar.

---

## ✅ Solusi: Configure Supabase Auth Settings

### Step 1: Enable Email Auth Provider

1. **Go to:** https://supabase.com/dashboard
2. **Select project:** JobMate
3. **Navigate to:** Authentication → Providers
4. **Find:** Email (should be in the list)
5. **Check:** Is it **Enabled**?
   - ✅ Toggle harus ON (hijau)
   - ❌ Jika OFF, klik toggle untuk enable
6. **Save** (jika ada tombol save)

---

### Step 2: Configure Site URL

1. **Navigate to:** Authentication → URL Configuration
2. **Find:** Site URL
3. **Set to:**
   ```
   http://localhost:3000
   ```
   (untuk development)
   
4. **Save**

---

### Step 3: Add Redirect URLs

1. **Navigate to:** Authentication → URL Configuration
2. **Find:** Redirect URLs
3. **Add these URLs:**
   ```
   http://localhost:3000/**
   http://localhost:3000/auth/verify
   http://localhost:3000/auth/callback
   ```
   
4. **Format:** One URL per line or comma-separated
5. **Save**

---

### Step 4: Check Email Settings

1. **Navigate to:** Authentication → Email Templates (or Email Settings)
2. **Check:** Email provider status
   - Should show: **Default (Supabase)** or **Custom SMTP**
   - Status: **Active** (green)
   
3. **If not active:**
   - Click "Enable email provider"
   - Or check project billing/status

---

## 🎯 Quick Fix Checklist

Copy this and check each item:

```
Supabase Dashboard → Authentication:

[ ] Providers → Email → Enabled (toggle ON)
[ ] URL Configuration → Site URL: http://localhost:3000
[ ] URL Configuration → Redirect URLs: 
    - http://localhost:3000/**
    - http://localhost:3000/auth/verify
[ ] Email Templates → Provider Status: Active
```

---

## 🚀 After Configuration

### Test Again:

1. **Go back to:** http://localhost:3000/reset
2. **Refresh page:** Ctrl+R
3. **Enter email:** updatesumobito@gmail.com
4. **Click:** Kirim Link Reset
5. **Check console:** Should see success logs now

**Expected Console:**
```
🔍 Debug Info:
  Email: updatesumobito@gmail.com
  Redirect URL: http://localhost:3000/auth/verify?type=recovery

📧 Supabase Response:
  Data: null
  Error: null

✅ Reset request successful! Check email (and spam folder)
```

---

## 🔍 Alternative: Check with SQL

**Test if email auth is working:**

1. **Go to:** Supabase Dashboard → SQL Editor
2. **Run this:**
   ```sql
   -- Check if email exists
   SELECT id, email, email_confirmed_at 
   FROM auth.users 
   WHERE email = 'updatesumobito@gmail.com';
   ```

3. **If no results:**
   - Email not registered
   - Register at /sign-up first

---

## 📸 Visual Guide

### 1. Enable Email Provider

```
Dashboard → Authentication → Providers

┌─────────────────────────────────────┐
│ Email Provider                      │
│ ┌─────────────────────────────────┐│
│ │ ⚪ OFF    🟢 ON  ← Turn this ON ││
│ └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

### 2. Site URL

```
Dashboard → Authentication → URL Configuration

┌─────────────────────────────────────┐
│ Site URL                            │
│ ┌─────────────────────────────────┐│
│ │ http://localhost:3000           ││
│ └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

### 3. Redirect URLs

```
Dashboard → Authentication → URL Configuration

┌─────────────────────────────────────┐
│ Redirect URLs (whitelist)           │
│ ┌─────────────────────────────────┐│
│ │ http://localhost:3000/**        ││
│ │ http://localhost:3000/auth/*    ││
│ └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

---

## 🎯 Most Common Cause

**90% of "Unable to process request" errors:**
- ❌ Redirect URL not whitelisted
- ❌ Site URL not configured
- ❌ Email provider not enabled

**After fixing these, it should work!**

---

## 📞 Still Not Working?

**Screenshot and send:**
1. Authentication → Providers (show Email status)
2. Authentication → URL Configuration (show Site URL & Redirect URLs)
3. Authentication → Email Templates (show provider status)

**Then I can help further!**

---

## ⚡ Quick Command to Test After Fix

**After configuring Supabase:**

```bash
# 1. Refresh browser
Press: Ctrl+R or F5

# 2. Open console
Press: F12

# 3. Go to reset page
http://localhost:3000/reset

# 4. Submit with test email
updatesumobito@gmail.com

# 5. Check console logs
Should show: ✅ Reset request successful!
```

---

**Go to Supabase Dashboard NOW and check these settings!** 🚀
