-- =====================================================
-- CREATE ADMIN USER
-- =====================================================
-- Purpose: Create admin user untuk approve/reject applications
-- =====================================================

-- =====================================================
-- METHOD 1: Create User via Supabase Dashboard (RECOMMENDED)
-- =====================================================
-- 1. Go to: Supabase Dashboard → Authentication → Users
-- 2. Click: "Add user" → "Create new user"
-- 3. Fill:
--    Email: admin@jobmate.com
--    Password: Admin123456!
--    ✅ Auto Confirm User
-- 4. Click: "Create user"
-- 5. Copy the USER_ID that was created
-- 6. Run Step 2 below with that USER_ID

-- =====================================================
-- STEP 1: Get User ID (After creating via Dashboard)
-- =====================================================
-- After creating user via Dashboard, get the ID:
-- Check in Dashboard → Authentication → Users → Click on admin@jobmate.com
-- Or run this (may not work without service_role access):
/*
SELECT id, email 
FROM auth.users 
WHERE email = 'admin@jobmate.com';
*/
-- Copy the UUID shown

-- =====================================================
-- STEP 2: Create Admin Profile
-- =====================================================
-- Replace 'PASTE_USER_ID_HERE' with the UUID from Step 1

-- INSERT INTO public.profiles (id, name, email, role, created_at, updated_at)
-- VALUES (
--   'PASTE_USER_ID_HERE',  -- Replace with actual UUID from Step 1
--   'Admin JobMate',
--   'admin@jobmate.com',
--   'admin',
--   NOW(),
--   NOW()
-- );

-- Example (replace UUID):
-- INSERT INTO public.profiles (id, name, email, role, created_at, updated_at)
-- VALUES (
--   '12345678-1234-1234-1234-123456789012',  -- Your actual UUID here
--   'Admin JobMate',
--   'admin@jobmate.com',
--   'admin',
--   NOW(),
--   NOW()
-- );

-- =====================================================
-- STEP 3: Update Telegram Settings in Database
-- =====================================================
-- Insert your Telegram bot token and admin chat ID

INSERT INTO public.admin_settings (id, telegram_bot_token, telegram_admin_chat_id, created_at, updated_at)
VALUES (
  1,
  '7974285481:AAGyTCCKGXWohPprzhMkZU-KWMX38S7Ecw4',
  '474127500',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  telegram_bot_token = EXCLUDED.telegram_bot_token,
  telegram_admin_chat_id = EXCLUDED.telegram_admin_chat_id,
  updated_at = NOW();

-- =====================================================
-- STEP 4: Verify Setup
-- =====================================================

-- Check admin profile created
SELECT id, name, email, role 
FROM public.profiles 
WHERE email = 'admin@jobmate.com';
-- Expected: 1 row with role = 'admin'

-- Check telegram settings
SELECT telegram_bot_token, telegram_admin_chat_id 
FROM public.admin_settings 
WHERE id = 1;
-- Expected: Your bot token and chat ID

-- =====================================================
-- ALTERNATIVE: Quick Setup with Known UUID
-- =====================================================
-- If you already know the UUID of admin user, use this:
-- (Replace the UUID with your actual admin user UUID)

/*
-- All in one command:
DO $$
DECLARE
  admin_user_id UUID := 'PASTE_ADMIN_USER_UUID_HERE';  -- Replace!
BEGIN
  -- Insert admin profile
  INSERT INTO public.profiles (id, name, email, role, created_at, updated_at)
  VALUES (
    admin_user_id,
    'Admin JobMate',
    'admin@jobmate.com',
    'admin',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    updated_at = NOW();

  -- Insert telegram settings
  INSERT INTO public.admin_settings (id, telegram_bot_token, telegram_admin_chat_id, created_at, updated_at)
  VALUES (
    1,
    '7974285481:AAGyTCCKGXWohPprzhMkZU-KWMX38S7Ecw4',
    '474127500',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    telegram_bot_token = EXCLUDED.telegram_bot_token,
    telegram_admin_chat_id = EXCLUDED.telegram_admin_chat_id,
    updated_at = NOW();

  RAISE NOTICE 'Admin setup complete!';
END $$;
*/

-- =====================================================
-- STEP-BY-STEP INSTRUCTIONS
-- =====================================================
/*
1. Create user via Dashboard:
   - Email: admin@jobmate.com
   - Password: Admin123456!
   - Auto confirm: YES

2. Get UUID from Dashboard:
   - Click on the user
   - Copy the ID (UUID)

3. Run this SQL with your UUID:
   INSERT INTO public.profiles (id, name, email, role)
   VALUES ('YOUR_UUID_HERE', 'Admin JobMate', 'admin@jobmate.com', 'admin');

4. Run telegram settings SQL (already included above):
   - Already inserted automatically
   - Check with: SELECT * FROM admin_settings;

5. Test login:
   - Go to: http://localhost:3000/sign-in
   - Login: admin@jobmate.com / Admin123456!
   - Should redirect to dashboard
   - Can access: /admin/applications

6. Verify admin role:
   - Run: SELECT role FROM profiles WHERE email = 'admin@jobmate.com';
   - Should return: 'admin'
*/

-- =====================================================
-- TROUBLESHOOTING
-- =====================================================

-- If "relation profiles does not exist":
-- Run: CREATE TABLE IF NOT EXISTS profiles (...) 
-- Use the schema from: db/migrations/001_initial_schema.sql

-- If "trigger not working":
-- The trigger should auto-create profile when user created
-- If not working, create profile manually as shown above

-- If "cannot access auth.users":
-- Normal, you don't have service_role access
-- Just use Dashboard to check user ID

-- =====================================================
-- CREDENTIALS
-- =====================================================
-- Admin Login:
--   Email: admin@jobmate.com
--   Password: Admin123456!
--
-- Telegram:
--   Bot Token: 7974285481:AAGyTCCKGXWohPprzhMkZU-KWMX38S7Ecw4
--   Admin Chat ID: 474127500
-- =====================================================
