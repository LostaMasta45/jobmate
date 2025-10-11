-- =====================================================
-- SETUP ADMIN COMPLETE
-- =====================================================
-- Run this after creating admin user via Dashboard
-- =====================================================

-- =====================================================
-- STEP 1: Create Admin User via Dashboard FIRST
-- =====================================================
-- Go to: Supabase Dashboard → Authentication → Users
-- Click: "Add user" → "Create new user"
-- Email: admin@jobmate.com
-- Password: Admin123456!
-- ✅ Auto Confirm User
-- Click: "Create user"
-- Then copy the USER ID from the dashboard

-- =====================================================
-- STEP 2: Create Admin Profile
-- =====================================================
-- Replace 'YOUR_ADMIN_USER_ID' with the UUID from Step 1

-- PASTE YOUR ADMIN USER ID HERE:
-- Example: '12345678-1234-1234-1234-123456789012'

-- Run this after replacing the ID:
/*
INSERT INTO public.profiles (id, name, email, role, created_at, updated_at)
VALUES (
  'YOUR_ADMIN_USER_ID_HERE',  -- ⚠️ REPLACE THIS!
  'Admin JobMate',
  'admin@jobmate.com',
  'admin',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  updated_at = NOW();
*/

-- =====================================================
-- STEP 3: Insert Telegram Settings
-- =====================================================

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

-- Check admin profile
SELECT 
  id, 
  name, 
  email, 
  role,
  created_at
FROM public.profiles 
WHERE email = 'admin@jobmate.com';
-- Expected: 1 row with role = 'admin'

-- Check telegram settings
SELECT 
  telegram_bot_token,
  telegram_admin_chat_id,
  created_at
FROM public.admin_settings 
WHERE id = 1;
-- Expected: Your bot token and chat ID

-- =====================================================
-- STEP 5: Test Admin Access
-- =====================================================
-- After running this SQL:
-- 1. Go to: http://localhost:3000/sign-in
-- 2. Login: admin@jobmate.com / Admin123456!
-- 3. Should redirect to: /dashboard
-- 4. Navigate to: /admin/applications
-- 5. Should see applications page (empty for now)

-- =====================================================
-- SUCCESS CRITERIA
-- =====================================================
-- ✅ Admin user created via Dashboard
-- ✅ Admin profile created with role='admin'
-- ✅ Telegram settings inserted
-- ✅ Can login as admin
-- ✅ Can access /admin/applications
-- =====================================================
