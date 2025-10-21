# 🚨 EMERGENCY FIX - Testbasic User

## Problem:
Middleware gets `undefined` for all profile fields despite user being logged in.

## Root Cause:
Profile either:
1. Doesn't exist
2. Has wrong ID (doesn't match auth.users)
3. Is blocked by RLS policy

## 🔥 SOLUTION - Run These SQL Files in Order

### Step 1: Diagnostic

```bash
Run: db/EMERGENCY_DIAGNOSTIC.sql
```

This will show you:
- ✅ If auth.users exists
- ✅ If profile exists  
- ✅ If IDs match
- ✅ What middleware query returns
- ✅ RLS status

**Read the output carefully!** It will tell you exactly what's wrong.

### Step 2: Nuclear Fix

If diagnostic shows profile missing or ID mismatch:

```bash
Run: db/NUCLEAR_FIX_TESTBASIC.sql
```

This will:
- ✅ Delete any existing broken profile
- ✅ Create fresh profile with CORRECT ID
- ✅ Set membership to vip_premium
- ✅ Verify the fix worked

**Expected Output:**
```
✅ TESTBASIC USER RECREATED SUCCESSFULLY
Auth ID: [UUID]
Profile ID: [SAME UUID]
✅ IDs MATCH - CORRECT!
Membership: vip_premium
Status: active
```

### Step 3: Disable RLS (If query still fails)

If profile exists and ID matches but still undefined:

```sql
-- Temporarily disable RLS
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
```

Then user try login. If it works, RLS is the problem.

**Re-enable after confirming:**
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

### Step 4: User Actions

After running SQL fixes:

```bash
1. ✅ User LOGOUT completely
2. ✅ Close ALL browser tabs of localhost:3001
3. ✅ Clear browser cache:
   Chrome: Ctrl+Shift+Delete → Select "All time" → Clear data
4. ✅ Close browser completely
5. ✅ Open browser again
6. ✅ Go to: http://localhost:3001
7. ✅ LOGIN: testbasic@example.com
```

### Step 5: Verify Success

**Terminal should show:**
```
[MIDDLEWARE] User: testbasic@example.com
[MIDDLEWARE] Role: user                   ✅ (not undefined!)
[MIDDLEWARE] Membership: vip_premium      ✅ (not undefined!)
[MIDDLEWARE] Membership Status: active    ✅ (not undefined!)
[MIDDLEWARE] Path: /vip
✅ Access granted
```

**Browser:**
- ✅ No redirect to /sign-in
- ✅ Can access /vip
- ✅ Dashboard shows VIP Premium

---

## 🔍 Still Not Working?

### Check Server Logs

Look for this in terminal after login:
```
[MIDDLEWARE] User: testbasic@example.com
[MIDDLEWARE] Role: undefined              ← Still undefined?
```

If still undefined, run this SQL:

```sql
-- Check what auth.uid() returns
SELECT 
  auth.uid() as current_user_id,
  (SELECT id FROM auth.users WHERE email = 'testbasic@example.com') as expected_id,
  CASE 
    WHEN auth.uid() = (SELECT id FROM auth.users WHERE email = 'testbasic@example.com')
    THEN '✅ MATCH'
    ELSE '❌ MISMATCH - User not authenticated properly'
  END as auth_check;
```

### Check Middleware Code

Verify middleware query:

```typescript
// Should be:
const { data: profile } = await supabase
  .from("profiles")
  .select("role, membership, membership_status, membership_expiry")
  .eq("id", user.id)  // ← Check this user.id exists
  .single();
```

Add logging:
```typescript
console.log('[DEBUG] user.id:', user.id);
console.log('[DEBUG] profile query result:', profile);
```

### Manual Test Query

Run in Supabase SQL Editor:

```sql
-- Replace [USER_ID] with actual auth.users ID
SELECT 
  role,
  membership,
  membership_status,
  membership_expiry
FROM profiles
WHERE id = '[USER_ID]';  -- Use actual UUID

-- If this returns data → Profile OK
-- If this returns nothing → Profile doesn't exist with this ID
```

---

## 🎯 Expected Final State

After all fixes:

```sql
-- This query should return ✅ for everything
SELECT 
  'Auth user exists' as check_name,
  CASE WHEN COUNT(*) = 1 THEN '✅' ELSE '❌' END as status
FROM auth.users WHERE email = 'testbasic@example.com'

UNION ALL

SELECT 
  'Profile exists' as check_name,
  CASE WHEN COUNT(*) = 1 THEN '✅' ELSE '❌' END as status
FROM profiles WHERE email = 'testbasic@example.com'

UNION ALL

SELECT 
  'IDs match' as check_name,
  CASE 
    WHEN p.id = au.id THEN '✅'
    ELSE '❌'
  END as status
FROM auth.users au
JOIN profiles p ON p.email = au.email
WHERE au.email = 'testbasic@example.com'

UNION ALL

SELECT 
  'Has VIP premium' as check_name,
  CASE 
    WHEN membership = 'vip_premium' AND membership_status = 'active' THEN '✅'
    ELSE '❌'
  END as status
FROM profiles
WHERE email = 'testbasic@example.com';
```

**All 4 checks should show ✅**

---

## 📋 Quick Command Reference

```bash
# Run diagnostic
Supabase SQL Editor → db/EMERGENCY_DIAGNOSTIC.sql → RUN

# Run nuclear fix
Supabase SQL Editor → db/NUCLEAR_FIX_TESTBASIC.sql → RUN

# Disable RLS (if needed)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

# Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

# User logout
http://localhost:3001 → Click LOGOUT

# Clear cache
Chrome: Ctrl+Shift+Delete → All time → Clear

# Login
http://localhost:3001/sign-in
```

---

**Run NUCLEAR_FIX_TESTBASIC.sql NOW!** 🚀
