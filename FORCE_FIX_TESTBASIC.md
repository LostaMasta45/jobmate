# 🚨 FORCE FIX TestBasic - Middleware Still Reads "free"

## Problem:
```
Database:     membership = 'vip_premium' ✅
Middleware:   Membership: free           ❌ WRONG!
```

## Root Cause Options:
1. ✅ **RLS Policy blocking the read** (most likely)
2. User ID mismatch
3. Cache di Supabase client
4. Default value "free" overriding

---

## 🔥 EMERGENCY FIX - Run SQL Langsung

### Step 1: Buka Supabase Dashboard
1. Go to: https://supabase.com/dashboard
2. Pilih project: `gyamsjmrrntwwcqljene`
3. Klik: **SQL Editor**

### Step 2: Verify Current Data
```sql
-- Check current profile
SELECT 
  id,
  email,
  membership,
  membership_tier,
  membership_status,
  membership_expiry,
  membership_expires_at,
  role,
  updated_at
FROM profiles
WHERE email = 'testbasic@example.com';
```

**Expected:**
- `membership`: Should be `vip_premium`
- `membership_tier`: Should be `premium`

**If membership is still "free":**
→ API update FAILED, need to update manually

**If membership is "vip_premium":**
→ RLS policy blocking the read

---

## 🔥 Solution 1: Force Update dengan Admin Client

### Run di SQL Editor:
```sql
-- FORCE UPDATE dengan semua kolom
UPDATE profiles
SET 
  membership = 'vip_premium',
  membership_tier = 'premium',
  membership_status = 'active',
  membership_expiry = NULL,
  membership_expires_at = NULL,
  updated_at = NOW()
WHERE email = 'testbasic@example.com';

-- Verify immediately
SELECT email, membership, membership_tier, membership_status
FROM profiles
WHERE email = 'testbasic@example.com';
```

---

## 🔥 Solution 2: Disable RLS Temporarily

```sql
-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'profiles';

-- Temporarily disable RLS for testing
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Test access now (user should login and try /vip)

-- IMPORTANT: Enable RLS again after testing!
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

---

## 🔥 Solution 3: Add Admin Bypass Policy

```sql
-- Create policy that allows SELECT for active users
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
TO authenticated
USING (
  auth.uid() = id 
  OR 
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- Verify policy created
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

---

## 🔥 Solution 4: Force Session Refresh via API

Run di browser console:
```javascript
// Force logout via API
await fetch('http://localhost:3001/api/auth/signout', { method: 'POST' });

// Wait 2 seconds
await new Promise(r => setTimeout(r, 2000));

// Clear ALL browser data
localStorage.clear();
sessionStorage.clear();
document.cookie.split(";").forEach(c => {
  document.cookie = c.trim().split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
});

// Verify cleared
console.log('✅ All data cleared. Now close this tab and open new one.');
console.log('Then login to: http://localhost:3001/sign-in');
```

---

## 🎯 Recommended Flow:

### A. Quick Check First:
```sql
-- Supabase SQL Editor
SELECT email, membership, membership_tier 
FROM profiles 
WHERE email = 'testbasic@example.com';
```

### B. If "free" → Force Update:
```sql
UPDATE profiles
SET membership = 'vip_premium', membership_tier = 'premium'
WHERE email = 'testbasic@example.com';
```

### C. If "vip_premium" → RLS Issue:
```sql
-- Temporarily disable RLS
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
```

### D. User Actions:
1. ✅ Logout completely
2. ✅ Close ALL browser tabs of localhost:3001
3. ✅ Open fresh tab
4. ✅ Login again
5. ✅ Try access /vip

### E. Check Middleware Log:
```
Expected after login:
[MIDDLEWARE] Membership: vip_premium  ✅
```

---

## 🔍 Debug: Check User ID Match

Run di browser console AFTER login:
```javascript
// Get current user
const { data: { user } } = await (await fetch('/api/auth/user')).json();
console.log('JWT User ID:', user?.id);

// Check profile
const res = await fetch(`/api/admin/force-update-membership?email=testbasic@example.com`);
const profile = await res.json();
console.log('Profile User ID:', profile.data?.id);
console.log('Membership:', profile.data?.membership);

// Should match!
if (user?.id === profile.data?.id) {
  console.log('✅ User ID MATCH');
} else {
  console.log('❌ USER ID MISMATCH! This is the problem!');
}
```

---

## 💡 If User ID Mismatch:

Problem: Ada 2 users dengan email sama tapi ID beda!

Fix:
```sql
-- Find duplicate users
SELECT id, email, created_at, membership 
FROM profiles 
WHERE email = 'testbasic@example.com'
ORDER BY created_at;

-- Delete the OLD one (keep newest)
DELETE FROM profiles 
WHERE email = 'testbasic@example.com' 
AND id != (
  SELECT id FROM profiles 
  WHERE email = 'testbasic@example.com' 
  ORDER BY created_at DESC 
  LIMIT 1
);
```

---

## 🚨 Nuclear Option: Recreate User

If nothing works:
```sql
-- Backup current data
CREATE TEMP TABLE testbasic_backup AS
SELECT * FROM profiles WHERE email = 'testbasic@example.com';

-- Delete user completely
DELETE FROM auth.users WHERE email = 'testbasic@example.com';
DELETE FROM profiles WHERE email = 'testbasic@example.com';

-- User need to re-register
-- Then run update script again
```

---

**Next Step:** Run SQL Solution 1 first, then test!
