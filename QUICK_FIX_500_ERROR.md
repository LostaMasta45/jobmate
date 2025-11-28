# Quick Fix: 500 Error Reset Password

## 🎯 Do These 5 Things NOW

### 1️⃣ Enable Email Provider
```
Dashboard → Authentication → Providers
Find: Email
Action: Click toggle to turn ON (green)
Save
```

### 2️⃣ Disable Email Confirmation (temporary)
```
Dashboard → Authentication → Settings
Find: "Enable email confirmations"
Action: Turn OFF
Save
```

### 3️⃣ Set Exact Site URL
```
Dashboard → Authentication → URL Configuration
Site URL: http://localhost:3005
(no trailing slash, no https)
Save
```

### 4️⃣ Add These Redirect URLs
```
Dashboard → Authentication → URL Configuration
Redirect URLs (paste all):

http://localhost:3005/**
http://localhost:3005/auth/verify

(One per line or comma separated)
Save
```

### 5️⃣ Confirm User Email Manually
```
Dashboard → SQL Editor
Run this:

UPDATE auth.users 
SET email_confirmed_at = NOW(),
    banned_until = NULL
WHERE email = 'updatesumobito@gmail.com';
```

---

## 🚀 After All 5 Steps

1. **Wait 30 seconds** (let Supabase update)
2. **Refresh browser:** Ctrl+R
3. **Test reset:** Submit updatesumobito@gmail.com
4. **Check result**

---

## ✅ Expected Success

**Console should show:**
```
✅ Reset request successful!
```

**UI should show:**
- Success message
- "Email Terkirim!" screen

---

## ❌ Still Error?

**Screenshot dan kirim:**
1. Authentication → Providers (Email status)
2. Authentication → Settings (Email confirmation)
3. Authentication → URL Configuration (Site URL + Redirects)

**Then I can help further!**

---

**Do ALL 5 steps now!** 🚀
