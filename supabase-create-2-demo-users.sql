-- ========================================
-- CREATE 2 DEMO USERS FOR TESTING
-- ========================================
-- Purpose: Create 2 demo users to test multi-device sync
-- Users:
--   1. demo1@jobmate.com / Demo123456!
--   2. demo2@jobmate.com / Demo123456!
-- ========================================

-- Step 1: Insert into auth.users (Supabase Auth)
-- Note: Run these in Supabase SQL Editor (requires admin access)

-- Demo User 1
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'demo1@jobmate.com',
  '$2a$10$8aK7Z.2kY5qxR8L9X1Q2qOJYqF8YvGp0mZ7xJ5fN6qD8wK3mL9xHm', -- Password: Demo123456!
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Demo User 1"}',
  'authenticated',
  'authenticated'
);

-- Demo User 2
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  '00000000-0000-0000-0000-000000000000',
  'demo2@jobmate.com',
  '$2a$10$8aK7Z.2kY5qxR8L9X1Q2qOJYqF8YvGp0mZ7xJ5fN6qD8wK3mL9xHm', -- Password: Demo123456!
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Demo User 2"}',
  'authenticated',
  'authenticated'
);

-- Step 2: Create identities for email login
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  '{"sub": "11111111-1111-1111-1111-111111111111", "email": "demo1@jobmate.com"}',
  'email',
  NOW(),
  NOW(),
  NOW()
);

INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  '22222222-2222-2222-2222-222222222222',
  '{"sub": "22222222-2222-2222-2222-222222222222", "email": "demo2@jobmate.com"}',
  'email',
  NOW(),
  NOW(),
  NOW()
);

-- Step 3: Create profiles (if profiles table exists)
INSERT INTO public.profiles (
  id,
  email,
  name,
  role,
  created_at,
  updated_at
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'demo1@jobmate.com',
  'Demo User 1',
  'user',
  NOW(),
  NOW()
);

INSERT INTO public.profiles (
  id,
  email,
  name,
  role,
  created_at,
  updated_at
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  'demo2@jobmate.com',
  'Demo User 2',
  'user',
  NOW(),
  NOW()
);

-- Step 4: Verify users created
SELECT 
  id, 
  email, 
  email_confirmed_at,
  created_at
FROM auth.users 
WHERE email IN ('demo1@jobmate.com', 'demo2@jobmate.com');

-- Step 5: Verify profiles created
SELECT 
  id, 
  email, 
  name, 
  role,
  created_at
FROM public.profiles 
WHERE email IN ('demo1@jobmate.com', 'demo2@jobmate.com');

-- ========================================
-- ALTERNATIVE: Use Supabase Dashboard
-- ========================================
-- If SQL doesn't work, create users via Supabase Dashboard:
-- 1. Go to: Authentication > Users
-- 2. Click "Add user" > "Create new user"
-- 3. Email: demo1@jobmate.com
-- 4. Password: Demo123456!
-- 5. Check "Auto Confirm User"
-- 6. Repeat for demo2@jobmate.com
-- ========================================

-- ========================================
-- IMPORTANT NOTES
-- ========================================
-- 1. Password hash shown is for "Demo123456!" 
--    (bcrypt hash - may need regeneration in your Supabase instance)
-- 2. If password doesn't work, use Dashboard method above
-- 3. Both users will have separate data in resumes table
-- 4. Test by logging in from 2 different browsers/devices
-- ========================================
