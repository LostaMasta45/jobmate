-- =====================================================
-- DISABLE RLS FOR DEMO MODE (TESTING ONLY)
-- =====================================================
-- Run this script if you're using demo user without auth
-- This will disable Row Level Security temporarily for testing

-- Check current RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('resumes', 'templates');

-- Disable RLS on resumes table (for demo/testing)
ALTER TABLE public.resumes DISABLE ROW LEVEL SECURITY;

-- Disable RLS on templates table (for demo/testing) 
ALTER TABLE public.templates DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('resumes', 'templates');

-- =====================================================
-- DEMO USER INSERT (if auth.users doesn't have demo user)
-- =====================================================
-- This ensures demo user exists in auth.users table

-- Check if demo user exists
SELECT id, email FROM auth.users 
WHERE id = '00000000-0000-0000-0000-000000000001';

-- If demo user doesn't exist, uncomment and run this:
-- INSERT INTO auth.users (
--   id, 
--   email, 
--   encrypted_password, 
--   email_confirmed_at,
--   created_at,
--   updated_at,
--   raw_app_meta_data,
--   raw_user_meta_data,
--   is_super_admin,
--   role,
--   aud,
--   confirmation_token
-- ) 
-- VALUES (
--   '00000000-0000-0000-0000-000000000001'::uuid,
--   'demo@jobmate.com',
--   crypt('demo123456', gen_salt('bf')),
--   NOW(),
--   NOW(),
--   NOW(),
--   '{"provider":"email","providers":["email"]}'::jsonb,
--   '{}'::jsonb,
--   false,
--   'authenticated',
--   'authenticated',
--   ''
-- )
-- ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- TEST INSERT (Verify database is working)
-- =====================================================
-- Test if you can insert a dummy resume

-- INSERT INTO public.resumes (
--   id,
--   user_id,
--   title,
--   content,
--   ats_score
-- )
-- VALUES (
--   gen_random_uuid(),
--   '00000000-0000-0000-0000-000000000001'::uuid,
--   'Test CV - DELETE ME',
--   '{
--     "id": "test-123",
--     "title": "Test CV",
--     "basics": {
--       "firstName": "Test",
--       "lastName": "User",
--       "headline": "Test Headline",
--       "email": "test@example.com"
--     },
--     "summary": "Test summary",
--     "experiences": [],
--     "education": [],
--     "skills": ["Test"],
--     "customSections": []
--   }'::jsonb,
--   75
-- );

-- Check if test insert worked
SELECT id, title, user_id, ats_score, created_at 
FROM public.resumes 
ORDER BY created_at DESC 
LIMIT 5;

-- =====================================================
-- CLEANUP (After testing, delete test data)
-- =====================================================
-- DELETE FROM public.resumes WHERE title LIKE '%Test CV%';

-- =====================================================
-- RE-ENABLE RLS (For production use)
-- =====================================================
-- After testing is done, re-enable RLS for security

-- ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
