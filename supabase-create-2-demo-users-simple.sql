-- =====================================================
-- CREATE 2 DEMO USERS - SIMPLIFIED METHOD
-- =====================================================
-- RECOMMENDATION: Use Supabase Dashboard instead!
-- This SQL is for reference only.
--
-- ⚠️ IMPORTANT: Creating users via SQL directly in auth.users
-- requires service_role access and may not work in SQL Editor
--
-- BETTER METHOD:
-- 1. Go to Supabase Dashboard
-- 2. Navigate to: Authentication → Users
-- 3. Click "Add user" → "Create new user"
-- 4. Fill in email and password
-- 5. Check "Auto Confirm User"
-- 6. Click "Create user"
-- =====================================================

-- =====================================================
-- METHOD 1: Via Supabase Dashboard (RECOMMENDED) ✅
-- =====================================================
-- Step-by-step:
-- 1. Open Supabase Dashboard
-- 2. Go to: Authentication → Users
-- 3. Click: "Add user" → "Create new user"
-- 
-- Demo User 1:
--   Email: demo1@jobmate.com
--   Password: Demo123456!
--   ✓ Auto Confirm User
--
-- Demo User 2:
--   Email: demo2@jobmate.com
--   Password: Demo123456!
--   ✓ Auto Confirm User
--
-- DONE! Users ready to use.

-- =====================================================
-- METHOD 2: Via SQL (FOR REFERENCE)
-- =====================================================
-- Note: This may require service_role access
-- If this doesn't work, use Method 1 above

-- Check if auth schema accessible
-- SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'auth';

-- If you have access to auth.users (service_role), you can try:
-- But this is NOT RECOMMENDED - use Dashboard instead!

/*
-- This is EXAMPLE ONLY - may not work without proper permissions
INSERT INTO auth.users (
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data
) VALUES (
  'demo1@jobmate.com',
  crypt('Demo123456!', gen_salt('bf')), -- requires pgcrypto extension
  NOW(),
  '{"name": "Demo User 1"}'::jsonb
);
*/

-- =====================================================
-- METHOD 3: Via Supabase Admin API (Advanced)
-- =====================================================
-- Use Supabase Admin API from your backend:
-- https://supabase.com/docs/reference/javascript/auth-admin-createuser

/*
Example Node.js code:

const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // NOT anon key!
)

// Create User 1
const { data: user1, error: error1 } = await supabase.auth.admin.createUser({
  email: 'demo1@jobmate.com',
  password: 'Demo123456!',
  email_confirm: true,
  user_metadata: { name: 'Demo User 1' }
})

// Create User 2
const { data: user2, error: error2 } = await supabase.auth.admin.createUser({
  email: 'demo2@jobmate.com',
  password: 'Demo123456!',
  email_confirm: true,
  user_metadata: { name: 'Demo User 2' }
})
*/

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- After creating users via Dashboard or API, verify:

-- Check if users exist (may need admin access)
-- SELECT id, email, email_confirmed_at, created_at 
-- FROM auth.users 
-- WHERE email IN ('demo1@jobmate.com', 'demo2@jobmate.com');

-- Check if profiles created (if you have profiles table with trigger)
SELECT id, email, name, role, created_at 
FROM public.profiles 
WHERE email IN ('demo1@jobmate.com', 'demo2@jobmate.com');

-- If profiles don't exist, create them manually:
-- (Only needed if you have profiles table)
/*
INSERT INTO public.profiles (id, email, name, role)
VALUES 
  ((SELECT id FROM auth.users WHERE email = 'demo1@jobmate.com'), 'demo1@jobmate.com', 'Demo User 1', 'user'),
  ((SELECT id FROM auth.users WHERE email = 'demo2@jobmate.com'), 'demo2@jobmate.com', 'Demo User 2', 'user')
ON CONFLICT (id) DO NOTHING;
*/

-- =====================================================
-- SUMMARY
-- =====================================================
-- ✅ BEST METHOD: Use Supabase Dashboard
--    - Easy, visual, no SQL needed
--    - Most reliable
--    - Works every time
--
-- ⚠️ SQL Method: Not recommended
--    - Requires service_role access
--    - Complex password hashing
--    - May fail with permissions
--
-- 🔧 API Method: For automation
--    - Good for creating many users
--    - Requires backend code
--    - Need service_role key
-- =====================================================

-- =====================================================
-- CREDENTIALS FOR TESTING
-- =====================================================
-- User 1:
--   Email: demo1@jobmate.com
--   Password: Demo123456!
--
-- User 2:
--   Email: demo2@jobmate.com
--   Password: Demo123456!
--
-- Login URL: http://localhost:3000/sign-in
-- =====================================================
