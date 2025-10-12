-- =====================================================
-- VERIFY USER ISOLATION - Surat Lamaran
-- =====================================================

-- 1. Check total cover letters per user
SELECT 
  user_id,
  COUNT(*) as total_letters,
  MIN(created_at) as first_letter,
  MAX(created_at) as last_letter
FROM public.cover_letters
GROUP BY user_id
ORDER BY total_letters DESC;

-- 2. Check RLS policies are active
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'cover_letters'
ORDER BY policyname;

-- 3. Verify user_id is NOT NULL (data integrity)
SELECT COUNT(*) as total_letters,
       COUNT(user_id) as with_user_id,
       COUNT(*) - COUNT(user_id) as missing_user_id
FROM public.cover_letters;

-- 4. Check if RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'cover_letters';

-- 5. Sample data (anonymized)
SELECT 
  LEFT(user_id::text, 8) as user_id_preview,
  company_name,
  position,
  status,
  created_at,
  template_type
FROM public.cover_letters
ORDER BY created_at DESC
LIMIT 10;

-- =====================================================
-- Expected Results:
-- =====================================================
-- 1. Each user should have their own count
-- 2. Should see 5 RLS policies active
-- 3. missing_user_id should be 0
-- 4. rowsecurity should be 't' (true)
-- 5. Should see sample data grouped by users
