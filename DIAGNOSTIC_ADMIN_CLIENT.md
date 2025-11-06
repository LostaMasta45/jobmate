# Diagnostic: Admin Client Connection Issues

**Error:** "Database error creating new user" (Code: unexpected_failure)  
**Status:** Even when user doesn't exist in Supabase

---

## 🔍 Step 1: Run Diagnostic Test

### Access Test Page:
```
http://localhost:3000/admin/test-admin-client
```

### What It Tests:
1. ✅ Environment variables (SUPABASE_SERVICE_ROLE_KEY)
2. ✅ Admin client can list users
3. ✅ Admin client can create users
4. ✅ Admin client can delete users

### Expected Result:
```
✅ Service Role Key: Present (XXX chars)
✅ Supabase URL: https://xxxxx.supabase.co
✅ List Users: Success (X users found)
✅ Create Test User: Success
✅ Delete Test User: Success
```

### If Test Fails:
Continue to Step 2 to diagnose the specific issue.

---

## 🔍 Step 2: Check Server Logs

### When Approving User:
The server now logs detailed information:

```bash
# In terminal where `npm run dev` is running:

[ADMIN] Creating user for haha@gmail.com
[ADMIN] Password length: 9
[ADMIN] Using service role key: YES (length: XXX)
[ADMIN] Supabase URL: https://xxxxx.supabase.co
[ADMIN] CreateUser payload: { email: '...', passwordLength: 9, emailConfirm: true }

# If error occurs:
❌ [ADMIN] Create user error details: {
  message: 'Database error creating new user',
  status: 500,
  code: 'unexpected_failure',
  name: 'AuthApiError',
  stack: '...'
}
❌ [ADMIN] Full error object: {...}
```

### What to Look For:
1. **Service role key**: Should say "YES (length: 200+)"
2. **Password length**: Should be at least 6 characters
3. **Error details**: Look for specific error codes

---

## 🔧 Common Issues & Fixes

### Issue 1: Service Role Key Missing or Invalid

**Symptoms:**
```
[ADMIN] Using service role key: NO
```
or
```
[ADMIN] Using service role key: YES (length: 20)  ← Too short!
```

**Fix:**
1. Check `.env.local`:
```bash
# Should look like this:
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOi...
# Very long key (200+ characters)
```

2. Get correct key from Supabase Dashboard:
```
Dashboard > Settings > API > service_role key (secret)
Click "Copy" then paste to .env.local
```

3. **Restart dev server** after changing .env.local:
```bash
# Stop server (Ctrl+C)
npm run dev  # Start again
```

---

### Issue 2: Auth Policies in Supabase

**Symptoms:**
```
Database error creating new user
Code: unexpected_failure
```

**Fix:**
1. Go to **Supabase Dashboard**
2. Click **Authentication** (sidebar)
3. Click **Policies** tab
4. Check if there are any policies blocking user creation

**Expected Configuration:**
- **Email Auth**: Enabled
- **Auto-confirm Email**: Optional (your choice)
- **Minimum Password Length**: 6 characters (default)

To check:
```
Dashboard > Authentication > Policies
- auth.users table should allow admin (service role) to insert
```

---

### Issue 3: Database Connection Issues

**Symptoms:**
```
Test: List Users → ❌ Failed
Error: "Failed to fetch" or "Network error"
```

**Fix:**
1. Check Supabase project status:
```
Dashboard > Project Status
Should show: "Healthy" ✅
```

2. Check if project is paused:
```
Dashboard > Project Settings
If paused: Click "Resume Project"
```

3. Verify Supabase URL:
```bash
# In .env.local:
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
# Should match Dashboard URL
```

---

### Issue 4: Password Requirements

**Symptoms:**
```
Error: "Password does not meet requirements"
```

**Current Password Generation:**
```typescript
// Format: JM + 8 random chars + 4 uppercase chars + !
// Example: JMa8f7g3h2ABCD!
// Length: 2 + 8 + 4 + 1 = 15 characters
```

**If This Fails:**
Check Supabase Auth settings:
```
Dashboard > Authentication > Settings > Password Requirements
- Minimum length: Should be 6 or less (15 is safe)
- Special characters required: Make sure it accepts "!"
```

---

### Issue 5: Rate Limiting

**Symptoms:**
```
Error after multiple failed attempts
Status: 429 (Too Many Requests)
```

**Fix:**
Wait 5-10 minutes before trying again, or:
```
Dashboard > Authentication > Rate Limits
Temporarily increase limits for testing
```

---

## 🧪 Manual Test User Creation

Try creating a user directly via Supabase Dashboard:

1. Go to **Dashboard > Authentication > Users**
2. Click **"Add user"**
3. Enter:
   - Email: `manual-test@example.com`
   - Password: `Test123!`
   - Auto-confirm email: ✅ Yes
4. Click **"Create user"**

**If this works:**
- Problem is in our code/config

**If this fails:**
- Problem is in Supabase Auth configuration

---

## 🔬 Advanced Debugging

### Check Supabase Logs:

1. Go to **Dashboard > Logs**
2. Select **"Auth Logs"**
3. Filter by:
   - Event: "user.create"
   - Email: "haha@gmail.com"
4. Look for error messages

### Common Error Patterns:

| Error Code | Meaning | Fix |
|------------|---------|-----|
| `unexpected_failure` | Generic auth error | Check policies & key |
| `user_already_exists` | Duplicate user | Delete from Dashboard |
| `invalid_password` | Password too weak | Use stronger password |
| `email_exists` | Email in use | Check auth.users table |
| `rate_limit_exceeded` | Too many requests | Wait or increase limits |

---

## ✅ Verification Checklist

After fixing, verify:

- [ ] Visit `/admin/test-admin-client`
- [ ] All tests show ✅ green
- [ ] Service role key present & correct length
- [ ] Can list users successfully
- [ ] Can create test user
- [ ] Can delete test user
- [ ] Go to `/admin/applications`
- [ ] Try to approve `haha@gmail.com`
- [ ] Should succeed without errors
- [ ] Check user created in Supabase Dashboard
- [ ] Test login with the new user

---

## 📋 Quick Checklist for Root Cause

Copy this and check each item:

```
□ Service role key in .env.local (200+ chars)
□ Supabase URL correct in .env.local
□ Dev server restarted after .env changes
□ Test page shows all ✅ green
□ Supabase project status: Healthy
□ Supabase Auth enabled
□ No blocking policies on auth.users
□ Password requirements met (6+ chars, has special char)
□ Not rate limited (< 10 attempts in last 5 min)
□ Can manually create user in Dashboard
□ Supabase logs show no policy errors
```

---

## 🚨 If Still Failing

### Last Resort Fixes:

1. **Regenerate Service Role Key:**
```
Dashboard > Settings > API
Click "Generate new service_role key"
Update .env.local
Restart server
```

2. **Check Project Limits:**
```
Dashboard > Settings > Billing
Verify not hitting free tier limits:
- Users: 50,000 (free tier)
- Auth requests: Unlimited
```

3. **Contact Supabase Support:**
```
Dashboard > Support
Provide:
- Error message
- Project ID
- Timestamp of error
- Logs from /admin/test-admin-client
```

---

## 📊 Expected Test Output

### Success:
```json
{
  "env_check": {
    "hasServiceRoleKey": true,
    "keyLength": 267,
    "hasSupabaseUrl": true,
    "supabaseUrl": "https://xxxxx.supabase.co"
  },
  "tests": [
    {
      "name": "List Users",
      "success": true,
      "userCount": 5
    },
    {
      "name": "Create Test User",
      "success": true,
      "userId": "uuid-here"
    },
    {
      "name": "Delete Test User",
      "success": true
    }
  ]
}
```

### Failure Example:
```json
{
  "env_check": {
    "hasServiceRoleKey": false,  ← Problem!
    "keyLength": 0
  },
  "tests": [
    {
      "name": "List Users",
      "success": false,
      "error": "Invalid API key"  ← Root cause
    }
  ]
}
```

---

**Next Step:** Visit `/admin/test-admin-client` and run the diagnostic!
