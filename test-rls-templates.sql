-- =====================================================
-- TEST RLS ISOLATION FOR TEMPLATES
-- =====================================================
-- Run these queries while logged in as different users
-- to verify data isolation works correctly
-- =====================================================

-- =====================================================
-- STEP 1: Check Current User
-- =====================================================
-- Run this to see who you're logged in as
SELECT 
  auth.uid() as current_user_id,
  CASE 
    WHEN auth.uid() IS NULL THEN '❌ NOT LOGGED IN'
    ELSE '✅ LOGGED IN'
  END as login_status;

-- =====================================================
-- STEP 2: View My Templates
-- =====================================================
-- This should only show templates for current user
SELECT 
  id,
  user_id,
  type,
  title,
  LEFT(content, 50) as content_preview,
  created_at
FROM public.templates
ORDER BY created_at DESC;

-- Expected:
-- - User 1 logged in → sees only User 1's templates
-- - User 2 logged in → sees only User 2's templates

-- =====================================================
-- STEP 3: Count Templates by Type
-- =====================================================
-- Count templates per type for current user
SELECT 
  type,
  COUNT(*) as count
FROM public.templates
GROUP BY type
ORDER BY type;

-- =====================================================
-- STEP 4: Test Isolation (After Creating Data)
-- =====================================================
-- After User 1 and User 2 each create a cover letter:

-- When logged in as User 1:
SELECT 
  COUNT(*) as my_templates_count,
  'User 1 templates' as user_label
FROM public.templates;
-- Expected: Shows only User 1's count

-- When logged in as User 2:
SELECT 
  COUNT(*) as my_templates_count,
  'User 2 templates' as user_label
FROM public.templates;
-- Expected: Shows only User 2's count (different from User 1)

-- =====================================================
-- STEP 5: Verify Cannot See Other User's Data
-- =====================================================
-- Get a template ID from User 1 (copy from query above)
-- Then login as User 2 and try to access it:

-- SELECT * FROM public.templates WHERE id = 'USER_1_TEMPLATE_ID_HERE';
-- Expected: 0 rows returned (RLS blocks access)

-- =====================================================
-- ADMIN VIEW (Service Role Only)
-- =====================================================
-- If you have service_role access, you can see all:
-- (This will NOT work in normal SQL Editor)

/*
SELECT 
  user_id,
  type,
  COUNT(*) as count
FROM public.templates
GROUP BY user_id, type
ORDER BY user_id, type;
-- Expected: Shows breakdown per user_id
*/

-- =====================================================
-- SUCCESS CRITERIA
-- =====================================================
-- ✅ User 1 sees only their templates
-- ✅ User 2 sees only their templates
-- ✅ User 1 cannot see User 2's templates
-- ✅ User 2 cannot see User 1's templates
-- ✅ Count differs between users
-- ✅ RLS working perfectly!
-- =====================================================
