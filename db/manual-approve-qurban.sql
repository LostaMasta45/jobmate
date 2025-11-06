-- ============================================
-- MANUAL WORKAROUND: Approve qurbanjombang@gmail.com manually
-- Since auto-approve is failing, do it manually step by step
-- ============================================

-- IMPORTANT: First create user via Supabase Dashboard UI
-- Go to: Authentication > Users > Add User
-- Email: qurbanjombang@gmail.com
-- Password: (generate strong password, e.g., JMqurban2025!)
-- Auto confirm email: YES
-- User metadata: {"name": "Qurban Jombang"}
-- Click: Create User
-- 
-- COPY the USER ID that was created, then continue with steps below

-- ============================================
-- STEP 1: Get the user ID (after creating via Dashboard)
-- ============================================

-- This should show the user you just created
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at
FROM auth.users
WHERE email = 'qurbanjombang@gmail.com';

-- COPY the 'id' value (UUID format)

-- ============================================
-- STEP 2: Manually insert profile
-- Replace 'USER_ID_HERE' with actual UUID from STEP 1
-- ============================================

-- Check if profile already exists
SELECT * FROM profiles WHERE email = 'qurbanjombang@gmail.com';

-- If profile doesn't exist, create it:
INSERT INTO profiles (
  id,
  email,
  name,
  role,
  membership,
  membership_status,
  created_at,
  updated_at
) VALUES (
  'USER_ID_HERE', -- REPLACE THIS with actual UUID from STEP 1
  'qurbanjombang@gmail.com',
  'Qurban Jombang',
  'user',
  'free',
  'active',
  now(),
  now()
);

-- If profile already exists, update it:
-- UPDATE profiles
-- SET 
--   name = 'Qurban Jombang',
--   role = 'user',
--   membership = 'free',
--   membership_status = 'active',
--   updated_at = now()
-- WHERE id = 'USER_ID_HERE';

-- ============================================
-- STEP 3: Update account application status
-- ============================================

UPDATE account_applications
SET 
  status = 'approved',
  approved_at = now(),
  updated_at = now()
WHERE email = 'qurbanjombang@gmail.com';

-- ============================================
-- STEP 4: Verify everything is correct
-- ============================================

SELECT 
  u.id as user_id,
  u.email,
  u.email_confirmed_at,
  p.name as profile_name,
  p.role,
  p.membership,
  p.membership_status,
  aa.status as application_status
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
LEFT JOIN account_applications aa ON aa.email = u.email
WHERE u.email = 'qurbanjombang@gmail.com';

-- Expected result:
-- - user_id: (UUID)
-- - email: qurbanjombang@gmail.com
-- - email_confirmed_at: (timestamp - not NULL)
-- - profile_name: Qurban Jombang
-- - role: user
-- - membership: free
-- - membership_status: active
-- - application_status: approved

-- ============================================
-- OPTIONAL: Send approval email manually
-- ============================================

-- You can trigger email from Next.js API or just inform user manually

-- ✅ DONE! User is now approved and can login
-- Test login at: http://localhost:3000/auth/sign-in
-- Email: qurbanjombang@gmail.com
-- Password: (password you set in Dashboard)
