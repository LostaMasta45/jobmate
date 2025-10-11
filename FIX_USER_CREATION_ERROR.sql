-- =====================================================
-- FIX: User Creation Error
-- =====================================================
-- Error: "Failed to create user: Database error creating new user"
-- Cause: profiles table has NOT NULL constraints but no auto-create trigger
-- =====================================================

-- SOLUTION 1: Create Trigger to Auto-Create Profile (RECOMMENDED)
-- =====================================================

-- Drop old trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create function to handle new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    'user',
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- SOLUTION 2: Relax Constraints (Alternative)
-- =====================================================
-- If Solution 1 doesn't work, uncomment below:

-- Make name nullable temporarily
-- ALTER TABLE public.profiles ALTER COLUMN name DROP NOT NULL;

-- Or set default value
-- ALTER TABLE public.profiles ALTER COLUMN name SET DEFAULT 'User';

-- =====================================================
-- VERIFY TRIGGER CREATED
-- =====================================================

-- Check if trigger exists
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Check if function exists
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'handle_new_user';

-- =====================================================
-- TEST: Create User After Fix
-- =====================================================
-- Now try creating user again via Supabase Dashboard:
-- 
-- 1. Go to: Authentication → Users
-- 2. Click: "Add user" → "Create new user"
-- 3. Email: demo1@jobmate.com
-- 4. Password: Demo123456!
-- 5. ✅ Auto Confirm User
-- 6. Click: "Create user"
--
-- Should work now! ✅

-- =====================================================
-- VERIFY USER AND PROFILE CREATED
-- =====================================================

-- After creating user, run this to verify:
SELECT 
  p.id,
  p.name,
  p.email,
  p.role,
  p.created_at,
  'Profile exists' as status
FROM public.profiles p
WHERE p.email IN ('demo1@jobmate.com', 'demo2@jobmate.com')
ORDER BY p.created_at DESC;

-- If profile not auto-created, manually insert:
-- (Only if trigger doesn't work)

/*
-- Get user_id from auth.users
-- Note: You need service_role access for this
SELECT id, email FROM auth.users WHERE email = 'demo1@jobmate.com';

-- Then insert profile manually with that ID
INSERT INTO public.profiles (id, name, email, role)
VALUES (
  'USER_ID_FROM_ABOVE',  -- Replace with actual UUID
  'Demo User 1',
  'demo1@jobmate.com',
  'user'
);
*/

-- =====================================================
-- IMPORTANT NOTES
-- =====================================================
-- 1. The trigger should auto-create profile for new users
-- 2. If trigger doesn't work, it might be permissions issue
-- 3. Alternative: Create users via API with admin SDK
-- 4. Or: Manually insert profiles after creating users
-- =====================================================

-- =====================================================
-- SUCCESS CRITERIA
-- =====================================================
-- ✅ Trigger created and active
-- ✅ Function exists and executable
-- ✅ User creation via Dashboard works
-- ✅ Profile auto-created in profiles table
-- =====================================================
