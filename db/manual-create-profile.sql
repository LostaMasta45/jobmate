-- =====================================================
-- Manual Create Profile for Current User
-- =====================================================
-- Use this if you need to manually create a profile for yourself

-- First, check your user ID
SELECT 
  id,
  email,
  created_at,
  raw_user_meta_data
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- Copy your user ID from above, then run this:
-- Replace 'YOUR-USER-ID-HERE' with your actual user ID

INSERT INTO public.profiles (
  id, 
  full_name, 
  created_at, 
  updated_at
)
VALUES (
  'YOUR-USER-ID-HERE'::uuid,  -- ⚠️ REPLACE THIS!
  'Your Name',                 -- ⚠️ REPLACE THIS!
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  updated_at = NOW();

-- Verify profile created
SELECT * FROM public.profiles 
WHERE id = 'YOUR-USER-ID-HERE'::uuid;  -- ⚠️ REPLACE THIS!

-- =====================================================
-- Or create profiles for ALL users at once:
-- =====================================================

INSERT INTO public.profiles (id, full_name, created_at, updated_at)
SELECT 
  auth.users.id,
  COALESCE(
    auth.users.raw_user_meta_data->>'full_name',
    SPLIT_PART(auth.users.email, '@', 1),
    'User'
  ) as full_name,
  NOW(),
  NOW()
FROM auth.users
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = auth.users.id
)
ON CONFLICT (id) DO NOTHING;

-- Verify all users now have profiles
SELECT 
  COUNT(*) as total_users,
  COUNT(profiles.id) as users_with_profiles,
  CASE 
    WHEN COUNT(*) = COUNT(profiles.id) THEN '✅ ALL GOOD'
    ELSE '❌ SOME MISSING'
  END as status
FROM auth.users
LEFT JOIN public.profiles ON auth.users.id = profiles.id;
