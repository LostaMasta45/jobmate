-- ============================================
-- STEP 1: GET YOUR USER ID
-- ============================================
-- Run this query first, then copy your user ID

SELECT 
  id as user_id,
  email,
  created_at
FROM auth.users
ORDER BY created_at DESC;

-- Copy the "user_id" value (long string with dashes)
-- Example: a1b2c3d4-e5f6-7890-abcd-1234567890ab
