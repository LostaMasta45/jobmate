# Debug: Supabase 500 Error "Unable to process request"

## 🔴 Current Error
```
AuthApiError: Unable to process request
POST /auth/v1/recover 500 (Internal Server Error)
```

---

## 🔍 Possible Causes & Solutions

### 1. Email Provider Not Enabled (Most Common)

**Check:**
1. Supabase Dashboard → **Authentication** → **Providers**
2. Find **Email** in the list
3. Status should be **Enabled** (green toggle ON)

**If disabled:**
- Click the toggle to enable
- Save changes
- Wait 10 seconds
- Test again

---

### 2. Confirm Email Required (But User Not Confirmed)

**Check:**
1. Dashboard → **Authentication** → **Settings**
2. Find: **Enable email confirmations**
3. If ON: Users must confirm email before reset

**Solution A - Disable Confirmation (for testing):**
```
Turn OFF "Enable email confirmations"
Save
Test reset again
```

**Solution B - Confirm the email manually:**
```sql
-- Run in SQL Editor:
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = 'updatesumobito@gmail.com';
```

---

### 3. Redirect URL Format Issue

**Current redirect URL:**
```
http://localhost:3005/auth/verify?type=recovery
```

**Supabase needs EXACT match or wildcard.**

**Fix in Dashboard:**

Go to: Authentication → URL Configuration → Redirect URLs

**Try these variations:**
```
http://localhost:3005/**
http://localhost:3005/auth/**
http://localhost:3005/auth/verify
http://localhost:3005/auth/verify?type=recovery

(Add ALL of them, one per line)
```

**Format tips:**
- No trailing slash
- Include the query parameter version
- Use `**` for wildcard

---

### 4. Site URL Must Match EXACTLY

**Check:**
1. Dashboard → Authentication → URL Configuration
2. Site URL field

**Set to:**
```
http://localhost:3005
```

**NOT:**
```
❌ http://localhost:3005/
❌ https://localhost:3005
❌ localhost:3005
```

---

### 5. Project Status Issue

**Check:**
1. Go to Dashboard home
2. Look at project status

**If "Paused":**
- Click "Restore project"
- Wait 2-3 minutes
- Test again

**If "Active" but still error:**
- May be temporary Supabase issue
- Wait 5 minutes and retry

---

### 6. Rate Limiting

**Check:**
1. Dashboard → Authentication → **Rate Limits** (if exists)
2. Or check logs for rate limit messages

**If rate limited:**
- Wait 1 hour
- Or use different email for testing

---

## 🎯 Step-by-Step Fix Process

### Step 1: Enable Email Provider
```
Dashboard → Authentication → Providers
Email: Toggle ON ✅
Save
```

### Step 2: Disable Email Confirmation (temporary)
```
Dashboard → Authentication → Settings
"Enable email confirmations": Toggle OFF
Save
```

### Step 3: Set Site URL
```
Dashboard → Authentication → URL Configuration
Site URL: http://localhost:3005
Save
```

### Step 4: Add ALL Redirect URLs
```
Dashboard → Authentication → URL Configuration
Redirect URLs (add each line):
http://localhost:3005/**
http://localhost:3005/auth/**
http://localhost:3005/auth/verify
Save
```

### Step 5: Check User Exists
```sql
-- SQL Editor:
SELECT id, email, email_confirmed_at, banned_until
FROM auth.users 
WHERE email = 'updatesumobito@gmail.com';
```

**If banned_until is set:**
```sql
-- Clear ban:
UPDATE auth.users 
SET banned_until = NULL
WHERE email = 'updatesumobito@gmail.com';
```

### Step 6: Test Again
```
1. Refresh browser (Ctrl+R)
2. Go to /reset
3. Submit: updatesumobito@gmail.com
4. Check console
```

---

## 🔧 Alternative: Test with Fresh Email

**Try with different email:**
```
1. Go to /sign-up
2. Register: test123@gmail.com (use your real email)
3. Confirm email if required
4. Try reset with test123@gmail.com
```

**If new email works:**
→ Issue specific to updatesumobito@gmail.com (banned/not confirmed)

**If new email also fails:**
→ Configuration issue (check steps above)

---

## 📊 Debug Checklist

Copy and fill this in:

```
SUPABASE CONFIGURATION:

[ ] Email Provider Enabled?
    Location: Authentication → Providers → Email
    Status: ON/OFF?

[ ] Email Confirmation Disabled (for testing)?
    Location: Authentication → Settings
    "Enable email confirmations": ON/OFF?

[ ] Site URL Set?
    Location: Authentication → URL Configuration
    Value: _________________

[ ] Redirect URLs Added?
    Location: Authentication → URL Configuration
    Values: _________________

[ ] Project Status?
    Dashboard home
    Status: Active/Paused/Suspended?

[ ] User Exists in Database?
    SQL: SELECT * FROM auth.users WHERE email='updatesumobito@gmail.com'
    Result: Found/Not Found?
    
[ ] User Confirmed?
    email_confirmed_at: NULL/Date?

[ ] User Banned?
    banned_until: NULL/Date?
```

---

## 🚨 Emergency Workaround

**If nothing works, use Magic Link instead:**

Update the reset page to use magic link (passwordless login):

```typescript
// Replace resetPasswordForEmail with:
const { error } = await supabase.auth.signInWithOtp({
  email: email,
  options: {
    emailRedirectTo: `${window.location.origin}/dashboard`,
  }
});
```

This bypasses password reset and logs user in directly via email link.

---

## 📸 Screenshots Needed

**To help debug, screenshot these:**

1. **Authentication → Providers**
   - Show Email provider status

2. **Authentication → Settings**
   - Show email confirmation setting

3. **Authentication → URL Configuration**
   - Show Site URL
   - Show Redirect URLs

4. **SQL Query Result**
   ```sql
   SELECT id, email, email_confirmed_at, banned_until
   FROM auth.users 
   WHERE email = 'updatesumobito@gmail.com';
   ```

5. **Project Dashboard**
   - Show project status (Active/Paused)

---

## 🔍 Check Supabase Logs

**Real-time error details:**

1. Dashboard → **Logs** (in sidebar)
2. Or: **Authentication** → **Logs**
3. Filter by: Last 15 minutes
4. Look for `/auth/v1/recover` requests
5. Check error message details

**Common log errors:**
- "redirect_to not allowed" → Fix redirect URLs
- "email provider disabled" → Enable email provider
- "user not found" → Email not registered
- "rate limit exceeded" → Wait 1 hour

---

**Try ALL steps above and report back dengan hasil checklist!** 🔍
