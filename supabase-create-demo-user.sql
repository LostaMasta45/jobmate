-- =====================================================
-- CREATE DEMO USER - Fix Foreign Key Error
-- =====================================================
-- Error: user_id violates foreign key constraint
-- Solution: Create demo user in auth.users table

-- =====================================================
-- OPTION 1: Check Existing Users (RECOMMENDED)
-- =====================================================
-- First, check if you have any existing users
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- =====================================================
-- OPTION 2: Use Existing User ID (EASIEST!)
-- =====================================================
-- If you have existing users, copy one of the IDs above
-- and update DEMO_USER_ID in lib/supabase/server.ts

-- Example:
-- export const DEMO_USER_ID = "your-existing-user-id-here";

-- =====================================================
-- OPTION 3: Create Demo User in auth.users
-- =====================================================
-- WARNING: This modifies auth schema - use carefully!

-- Method A: Simple insert (may not work due to auth constraints)
-- INSERT INTO auth.users (
--   instance_id,
--   id,
--   aud,
--   role,
--   email,
--   encrypted_password,
--   email_confirmed_at,
--   raw_app_meta_data,
--   raw_user_meta_data,
--   created_at,
--   updated_at,
--   confirmation_token,
--   email_change,
--   email_change_token_new,
--   recovery_token
-- )
-- VALUES (
--   '00000000-0000-0000-0000-000000000000',
--   '00000000-0000-0000-0000-000000000001'::uuid,
--   'authenticated',
--   'authenticated',
--   'demo@jobmate.com',
--   crypt('demo123456', gen_salt('bf')),
--   NOW(),
--   '{"provider":"email","providers":["email"]}'::jsonb,
--   '{"name":"Demo User"}'::jsonb,
--   NOW(),
--   NOW(),
--   '',
--   '',
--   '',
--   ''
-- )
-- ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- OPTION 4: Temporarily Drop Foreign Key (TESTING ONLY!)
-- =====================================================
-- This is DANGEROUS but works for quick testing

-- Drop foreign key constraint
ALTER TABLE public.resumes 
DROP CONSTRAINT IF EXISTS resumes_user_id_fkey;

-- Now you can insert without valid user_id
INSERT INTO public.resumes (
  id,
  user_id,
  title,
  content,
  ats_score
)
VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Test CV Manual',
  '{
    "id": "test-123",
    "title": "Test CV Manual",
    "basics": {
      "firstName": "Test",
      "lastName": "User",
      "headline": "Test Headline",
      "email": "test@test.com"
    },
    "summary": "Test summary",
    "experiences": [],
    "education": [],
    "skills": ["Test"],
    "customSections": []
  }'::jsonb,
  75
);

-- Verify insert worked
SELECT id, title, user_id, ats_score FROM public.resumes;

-- RE-ADD foreign key later (after testing):
-- ALTER TABLE public.resumes
-- ADD CONSTRAINT resumes_user_id_fkey
-- FOREIGN KEY (user_id)
-- REFERENCES auth.users(id)
-- ON DELETE CASCADE;

-- =====================================================
-- OPTION 5: Create Real Test User via Supabase Auth
-- =====================================================
-- BEST PRACTICE: Create user via Supabase dashboard
-- 1. Go to Authentication → Users
-- 2. Click "Add user"
-- 3. Email: test@jobmate.com
-- 4. Password: Test123456!
-- 5. Auto confirm: Yes
-- 6. Click "Create user"
-- 7. Copy the user ID
-- 8. Update DEMO_USER_ID in code

-- =====================================================
-- RECOMMENDED SOLUTION FOR YOUR CASE
-- =====================================================

-- Step 1: Get your existing user (if you logged in before)
SELECT id, email FROM auth.users LIMIT 1;

-- Step 2: Copy the ID from above result

-- Step 3: Update lib/supabase/server.ts
-- export const DEMO_USER_ID = "paste-your-id-here";

-- OR if no users exist:

-- Step 4: Drop foreign key temporarily
ALTER TABLE public.resumes DROP CONSTRAINT IF EXISTS resumes_user_id_fkey;

-- Step 5: Test insert
INSERT INTO public.resumes (
  id, user_id, title, content, ats_score
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Demo CV',
  '{"id":"demo","title":"Demo CV","basics":{"firstName":"Demo","lastName":"User","headline":"Demo","email":"demo@test.com"},"summary":"Demo","experiences":[],"education":[],"skills":["Demo"],"customSections":[]}'::jsonb,
  80
);

-- Step 6: Verify
SELECT * FROM public.resumes;

-- =====================================================
-- CLEANUP (After testing)
-- =====================================================
-- DELETE FROM public.resumes WHERE title LIKE '%Test%' OR title LIKE '%Demo%';

-- Re-add foreign key if dropped:
-- ALTER TABLE public.resumes
-- ADD CONSTRAINT resumes_user_id_fkey
-- FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
