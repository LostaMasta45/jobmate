-- ============================================
-- FIND ROOT CAUSE: What's blocking createUser?
-- ============================================

-- STEP 1: Find ALL triggers on auth.users
SELECT 
  '🔍 Triggers on auth.users' as info,
  trigger_name,
  event_manipulation as event,
  action_timing as timing,
  action_statement,
  action_orientation
FROM information_schema.triggers
WHERE event_object_schema = 'auth' 
  AND event_object_table = 'users'
ORDER BY trigger_name;

-- STEP 2: Find trigger functions
SELECT 
  '⚙️ Trigger Functions' as info,
  n.nspname as schema,
  p.proname as function_name,
  pg_get_functiondef(p.oid) as function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname IN (
  SELECT trigger_name FROM information_schema.triggers
  WHERE event_object_schema = 'auth' AND event_object_table = 'users'
)
OR p.proname ILIKE '%new_user%'
OR p.proname ILIKE '%handle%user%'
OR p.proname ILIKE '%profile%'
ORDER BY function_name;

-- STEP 3: Check profiles table structure
SELECT 
  '🏗️ Profiles columns' as info,
  column_name,
  data_type,
  is_nullable,
  column_default,
  CASE 
    WHEN is_nullable = 'NO' AND column_default IS NULL THEN '⚠️ REQUIRED'
    ELSE '✓'
  END as status
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY ordinal_position;

-- STEP 4: Check NOT NULL constraints without defaults
SELECT 
  '⚠️ Required fields (NOT NULL without default)' as info,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
  AND is_nullable = 'NO'
  AND column_default IS NULL
  AND column_name != 'id'; -- id is FK, handled separately

-- ============================================
-- BASED ON RESULTS, CHOOSE FIX:
-- ============================================

/*
SCENARIO A: If you see a trigger like "on_auth_user_created" or "handle_new_user"
  → This trigger auto-creates profiles
  → The trigger is FAILING, causing createUser to fail
  → FIX: Drop the trigger OR fix the trigger function

SCENARIO B: If profiles has NOT NULL columns without defaults
  → Example: name TEXT NOT NULL (no default)
  → The trigger tries to insert but missing required values
  → FIX: Add default values OR make columns nullable

SCENARIO C: No triggers found
  → Something else is wrong (constraint, RLS, etc.)
  → FIX: Change approveApplication to create profile manually
*/

-- ============================================
-- FIX OPTION A: Drop problematic trigger
-- ============================================

-- IF you found a trigger like "on_auth_user_created", drop it:
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- DROP FUNCTION IF EXISTS public.handle_new_user();

-- After dropping, approveApplication will need to create profile manually
-- (We'll modify actions/admin.ts for this)

-- ============================================
-- FIX OPTION B: Add default values to required columns
-- ============================================

-- IF profiles has "name TEXT NOT NULL" without default:
-- ALTER TABLE profiles ALTER COLUMN name SET DEFAULT 'User';

-- IF profiles has other required columns, add defaults:
-- ALTER TABLE profiles ALTER COLUMN role SET DEFAULT 'user';
-- ALTER TABLE profiles ALTER COLUMN membership SET DEFAULT 'free';
-- ALTER TABLE profiles ALTER COLUMN membership_status SET DEFAULT 'active';

-- ============================================
-- FIX OPTION C: Make columns nullable temporarily
-- ============================================

-- IF you want quick fix, make name nullable:
-- ALTER TABLE profiles ALTER COLUMN name DROP NOT NULL;

-- ============================================
-- VERIFICATION: After applying fix
-- ============================================

-- Re-check table structure
SELECT 
  column_name,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY ordinal_position;

-- Check if triggers are gone
SELECT trigger_name 
FROM information_schema.triggers
WHERE event_object_schema = 'auth' AND event_object_table = 'users';

-- ============================================
-- RECOMMENDED FIX (safest):
-- ============================================

-- 1. Drop trigger (if exists)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP TRIGGER IF EXISTS handle_new_user ON auth.users CASCADE;

-- 2. Drop function (if exists)
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.on_auth_user_created() CASCADE;

-- 3. Add default values for safety
ALTER TABLE profiles ALTER COLUMN name SET DEFAULT 'User';
ALTER TABLE profiles ALTER COLUMN role SET DEFAULT 'user';

-- 4. Verify cleanup
SELECT 
  '✅ Cleanup verification' as status,
  (SELECT COUNT(*) FROM information_schema.triggers WHERE event_object_schema = 'auth' AND event_object_table = 'users') as trigger_count,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'profiles' AND is_nullable = 'NO' AND column_default IS NULL AND column_name != 'id') as required_fields_without_default;

-- Expected:
-- trigger_count: 0 (no triggers on auth.users)
-- required_fields_without_default: 0 or very few

-- ============================================
-- AFTER RUNNING FIX:
-- ============================================

-- Try approve again from admin dashboard
-- It should work now!
