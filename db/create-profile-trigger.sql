-- =====================================================
-- Auto-Create Profile on User Signup
-- =====================================================
-- Run this in Supabase SQL Editor
-- This ensures every new user gets a profile automatically

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create function to auto-create profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to run function on user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Verify trigger exists
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Create profiles for existing users who don't have one
INSERT INTO public.profiles (id, full_name, created_at, updated_at)
SELECT 
  auth.users.id,
  COALESCE(
    auth.users.raw_user_meta_data->>'full_name',
    SPLIT_PART(auth.users.email, '@', 1)
  ) as full_name,
  NOW(),
  NOW()
FROM auth.users
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = auth.users.id
)
ON CONFLICT (id) DO NOTHING;

-- Verify profiles created
SELECT 
  COUNT(*) as total_users,
  COUNT(profiles.id) as users_with_profiles
FROM auth.users
LEFT JOIN public.profiles ON auth.users.id = profiles.id;
