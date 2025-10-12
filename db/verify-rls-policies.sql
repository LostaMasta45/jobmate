-- =====================================================
-- Verify RLS Policies are Working
-- =====================================================
-- Run this to check if policies are correctly set up

-- Step 1: Check current policies
SELECT 
  policyname,
  cmd as operation,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY cmd, policyname;

-- Step 2: Test if you can update your own profile
-- This should work WITHOUT error
DO $$
BEGIN
  -- Try to update your profile
  UPDATE profiles 
  SET updated_at = NOW()
  WHERE id = auth.uid();
  
  RAISE NOTICE 'SUCCESS: You can update your profile!';
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'ERROR: Cannot update profile - %', SQLERRM;
END $$;

-- Step 3: Check your current user
SELECT 
  auth.uid() as my_user_id,
  auth.role() as my_role,
  auth.jwt() as my_jwt_claims;

-- Step 4: Check if your profile exists
SELECT 
  id,
  full_name,
  avatar_url,
  created_at
FROM profiles
WHERE id = auth.uid();

-- Step 5: Verify UPDATE policy specifically
SELECT 
  policyname,
  qual as "USING (when can update)",
  with_check as "WITH CHECK (what can update to)"
FROM pg_policies
WHERE tablename = 'profiles'
  AND cmd = 'UPDATE';

-- =====================================================
-- EXPECTED RESULTS:
-- =====================================================
-- Step 1: Should show 5 policies
-- Step 2: Should say "SUCCESS"
-- Step 3: Should show your user_id and role
-- Step 4: Should show your profile data
-- Step 5: Should show UPDATE policies with auth.uid() checks
-- =====================================================
