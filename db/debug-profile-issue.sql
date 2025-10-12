-- =====================================================
-- Debug Profile Issues
-- =====================================================
-- Run this in Supabase SQL Editor to diagnose the problem

-- Step 1: Check if profiles table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'profiles'
) AS profiles_table_exists;

-- Step 2: Check profiles table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- Step 3: Check how many users vs profiles
SELECT 
  (SELECT COUNT(*) FROM auth.users) as total_users,
  (SELECT COUNT(*) FROM public.profiles) as total_profiles;

-- Step 4: Check which users don't have profiles
SELECT 
  auth.users.id,
  auth.users.email,
  auth.users.created_at,
  CASE 
    WHEN profiles.id IS NULL THEN '❌ NO PROFILE'
    ELSE '✅ HAS PROFILE'
  END as status
FROM auth.users
LEFT JOIN public.profiles ON auth.users.id = profiles.id
ORDER BY auth.users.created_at DESC;

-- Step 5: Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY cmd, policyname;

-- Step 6: Check if trigger exists
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- =====================================================
-- DIAGNOSIS RESULTS:
-- =====================================================
-- 
-- If Step 1 returns FALSE:
--   → profiles table doesn't exist
--   → Need to create it first
--
-- If Step 3 shows total_users > total_profiles:
--   → Some users don't have profiles
--   → Run create-profile-trigger.sql
--
-- If Step 5 shows no policies or wrong policies:
--   → RLS not configured correctly
--   → Run fix-profiles-rls-clean.sql
--
-- If Step 6 returns no rows:
--   → Trigger not created
--   → Run create-profile-trigger.sql
--
-- =====================================================
