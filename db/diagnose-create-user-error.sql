-- ============================================
-- DIAGNOSTIC: Find root cause of "Database error creating new user"
-- ============================================

-- STEP 1: Check if there's a trigger on auth.users table
-- Triggers can auto-create profiles and might be failing
SELECT 
  '🔍 Triggers on auth.users' as info,
  trigger_name,
  event_manipulation as event,
  action_timing as timing,
  action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'auth' 
  AND event_object_table = 'users'
ORDER BY trigger_name;

-- STEP 2: Check if there's a trigger on profiles table
SELECT 
  '🔍 Triggers on profiles' as info,
  trigger_name,
  event_manipulation as event,
  action_timing as timing,
  action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'public' 
  AND event_object_table = 'profiles'
ORDER BY trigger_name;

-- STEP 3: Check RLS status on profiles table
SELECT 
  '🔒 RLS Status on profiles' as info,
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'profiles';

-- STEP 4: List ALL RLS policies on profiles table
SELECT 
  '📋 RLS Policies on profiles' as info,
  policyname as policy_name,
  cmd as command,
  roles,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'profiles'
ORDER BY policyname;

-- STEP 5: Check profiles table structure
-- Make sure all required columns exist
SELECT 
  '🏗️ Profiles table columns' as info,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY ordinal_position;

-- STEP 6: Check constraints on profiles table
SELECT
  '⚠️ Constraints on profiles' as info,
  con.conname AS constraint_name,
  CASE con.contype
    WHEN 'p' THEN 'PRIMARY KEY'
    WHEN 'u' THEN 'UNIQUE'
    WHEN 'c' THEN 'CHECK'
    WHEN 'f' THEN 'FOREIGN KEY'
    ELSE con.contype::text
  END AS constraint_type,
  pg_get_constraintdef(con.oid) AS definition
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
WHERE rel.relname = 'profiles' AND nsp.nspname = 'public'
ORDER BY constraint_type, constraint_name;

-- STEP 7: Check functions that might be triggered
-- Look for functions related to user creation
SELECT 
  '⚙️ Functions related to users/profiles' as info,
  n.nspname as schema,
  p.proname as function_name,
  pg_get_functiondef(p.oid) as function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE (p.proname ILIKE '%user%' OR p.proname ILIKE '%profile%')
  AND n.nspname IN ('public', 'auth')
ORDER BY function_name;

-- ============================================
-- ANALYSIS GUIDE
-- ============================================

/*
Based on the results above:

1. IF you see a trigger on auth.users (especially INSERT trigger):
   - This trigger might be auto-creating profiles
   - The trigger might be FAILING due to:
     a) Missing required columns in profiles
     b) RLS blocking the insert
     c) Constraint violations

2. IF profiles table has RLS ENABLED (rls_enabled = true):
   - Check if there's a policy allowing service_role to INSERT
   - Service role should bypass RLS, but explicit policy is safer

3. IF profiles table has CHECK constraints:
   - Make sure all constraints can be satisfied
   - Example: role CHECK (role IN ('user', 'admin'))

4. IF profiles table has NOT NULL columns without defaults:
   - These MUST be provided when creating profile
   - Example: name TEXT NOT NULL (requires value)

COMMON FIXES:

A. If trigger is failing → Fix or temporarily disable trigger
B. If RLS blocking → Add service role policy or disable RLS temporarily
C. If constraint failing → Provide required values or relax constraint
D. If missing columns → Add missing columns with defaults
*/

-- ============================================
-- TEMPORARY FIX OPTIONS (choose ONE)
-- ============================================

-- OPTION A: Temporarily disable RLS on profiles for testing
-- WARNING: This disables security, only for debugging!
-- ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
-- After testing, re-enable with:
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- OPTION B: Add policy to allow service role full access
-- This is safer than disabling RLS
/*
CREATE POLICY "Service role bypass for profiles"
ON profiles
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
*/

-- OPTION C: Drop and recreate problematic trigger
-- IF you found a trigger causing issues, you can drop it:
-- DROP TRIGGER IF EXISTS trigger_name ON auth.users;
-- (But you need to identify which trigger first)

-- ============================================
-- RECOMMENDED: Try this SAFE fix first
-- ============================================

-- Add service role policy if it doesn't exist
DO $$ 
BEGIN
  -- Check if policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'profiles' 
      AND policyname = 'Service role can manage profiles'
  ) THEN
    -- Create policy for service role
    EXECUTE '
      CREATE POLICY "Service role can manage profiles"
      ON profiles
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
    ';
    RAISE NOTICE '✅ Created service role policy for profiles';
  ELSE
    RAISE NOTICE '✓ Service role policy already exists';
  END IF;
END $$;

-- ============================================
-- AFTER RUNNING DIAGNOSTIC
-- ============================================

/*
1. Run STEP 1-7 above to see what's configured
2. Look for:
   - Triggers on auth.users that create profiles
   - RLS policies blocking service role
   - NOT NULL constraints without defaults
   
3. Based on findings, run appropriate fix from OPTIONS A/B/C

4. Test by trying to approve qurbanjombang@gmail.com again

5. If still fails, share the output of STEP 1-7 for deeper analysis
*/
