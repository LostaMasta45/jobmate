-- ============================================
-- EMERGENCY FIX: Disable auto-create profile trigger
-- This will allow createUser to succeed
-- ============================================

-- STEP 1: Find all triggers on auth.users
SELECT 
  trigger_name,
  event_manipulation,
  action_timing,
  action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'auth' 
  AND event_object_table = 'users';

-- STEP 2: Find all functions related to profiles
SELECT 
  p.proname as function_name,
  pg_get_functiondef(p.oid) as definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname ILIKE '%profile%'
  AND n.nspname = 'public';

-- ============================================
-- COMMON TRIGGER: handle_new_user
-- This auto-creates profile when auth user is created
-- If this is failing, we need to fix or disable it
-- ============================================

-- Check if this trigger exists
SELECT 
  trigger_name,
  event_manipulation,
  action_timing
FROM information_schema.triggers
WHERE trigger_name ILIKE '%new_user%' OR trigger_name ILIKE '%handle%user%';

-- ============================================
-- TEMPORARY FIX: Disable RLS on profiles
-- WARNING: This removes security, only for testing!
-- ============================================

ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- ============================================
-- AFTER DISABLING RLS:
-- 1. Try approve again in admin dashboard
-- 2. If it works, the problem was RLS
-- 3. After testing, RE-ENABLE RLS:
--    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- ============================================

-- Verify RLS status
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'profiles';

-- Expected: rls_enabled = false (temporarily disabled)
