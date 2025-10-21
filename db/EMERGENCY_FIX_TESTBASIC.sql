-- 🚨 EMERGENCY FIX: TestBasic User
-- Middleware reads "free" despite database showing "vip_premium"
-- Run this in Supabase SQL Editor

-- Step 1: Verify current state
SELECT 
  id,
  email,
  membership,
  membership_tier,
  membership_status,
  membership_expiry,
  membership_expires_at,
  role,
  created_at,
  updated_at
FROM profiles
WHERE email = 'testbasic@example.com';

-- Step 2: Check for duplicates
SELECT COUNT(*), email 
FROM profiles 
WHERE email = 'testbasic@example.com'
GROUP BY email;

-- Step 3: FORCE UPDATE all membership columns
UPDATE profiles
SET 
  membership = 'vip_premium',
  membership_tier = 'premium',
  membership_status = 'active',
  membership_expiry = NULL,
  membership_expires_at = NULL,
  updated_at = NOW()
WHERE email = 'testbasic@example.com';

-- Step 4: Verify update successful
SELECT 
  email,
  membership,
  membership_tier,
  membership_status,
  'Should be: vip_premium' as expected_membership,
  'Should be: premium' as expected_tier,
  CASE 
    WHEN membership = 'vip_premium' AND membership_tier = 'premium' 
    THEN '✅ CORRECT'
    ELSE '❌ STILL WRONG'
  END as status
FROM profiles
WHERE email = 'testbasic@example.com';

-- Step 5: Check RLS status
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'profiles';

-- Step 6: Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- Step 7 (OPTIONAL): Temporarily disable RLS for testing
-- ONLY RUN IF STEP 4 SHOWS CORRECT DATA BUT MIDDLEWARE STILL READS "free"
-- ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- After testing, RE-ENABLE:
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ===== DIAGNOSTIC QUERIES =====

-- Check auth.users table
SELECT id, email, created_at, confirmed_at
FROM auth.users
WHERE email = 'testbasic@example.com';

-- Check if auth.users ID matches profiles ID
SELECT 
  p.id as profile_id,
  p.email,
  p.membership,
  au.id as auth_id,
  CASE WHEN p.id = au.id THEN '✅ MATCH' ELSE '❌ MISMATCH' END as id_status
FROM profiles p
LEFT JOIN auth.users au ON au.email = p.email
WHERE p.email = 'testbasic@example.com';

-- ===== RESULTS INTERPRETATION =====

/*
EXPECTED OUTPUT FROM STEP 4:

| email                  | membership   | tier    | status      |
|------------------------|--------------|---------|-------------|
| testbasic@example.com  | vip_premium  | premium | ✅ CORRECT  |

IF OUTPUT IS CORRECT BUT MIDDLEWARE STILL READS "free":
→ Problem is RLS policy or session cache
→ User MUST logout and login again
→ OR disable RLS temporarily

IF OUTPUT STILL SHOWS "free":
→ UPDATE query failed
→ Check RLS policies blocking UPDATE
→ Try running as superuser/service role
*/

-- ===== NEXT STEPS =====

/*
1. Run Step 1-4 above
2. If Step 4 shows ✅ CORRECT:
   → Tell user to LOGOUT and LOGIN again
   → Check middleware log for "vip_premium"
   
3. If Step 4 shows ❌ STILL WRONG:
   → Check RLS policies (Step 6)
   → Try disable RLS temporarily (Step 7)
   → Contact DBA for service role access
   
4. If ID mismatch in diagnostic:
   → Delete duplicate profile
   → User must re-register
*/
