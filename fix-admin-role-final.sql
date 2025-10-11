-- =====================================================
-- FIX ADMIN ROLE - FINAL
-- =====================================================
-- Problem: Admin tidak redirect ke /admin/applications
-- Cause: Role masih 'user' bukan 'admin'
-- =====================================================

-- STEP 1: Check current role for admin@jobmate.com
SELECT 
  id,
  name,
  email,
  role,
  created_at
FROM public.profiles
WHERE email = 'admin@jobmate.com';

-- Expected: Should show role = 'user' (that's the problem!)
-- We need to change it to 'admin'

-- =====================================================
-- STEP 2: Update role to 'admin' (using email, not UUID)
-- =====================================================

UPDATE public.profiles
SET 
  role = 'admin',
  name = 'Admin JobMate',
  updated_at = NOW()
WHERE email = 'admin@jobmate.com';

-- =====================================================
-- STEP 3: Verify role updated
-- =====================================================

SELECT 
  id,
  name,
  email,
  role,
  updated_at
FROM public.profiles
WHERE email = 'admin@jobmate.com';

-- Expected: role = 'admin' ✅

-- =====================================================
-- STEP 4: Verify telegram settings exist
-- =====================================================

SELECT 
  id,
  telegram_bot_token,
  telegram_admin_chat_id,
  created_at
FROM public.admin_settings
WHERE id = 1;

-- Expected: Bot token and chat ID present

-- If not present, insert:
INSERT INTO public.admin_settings (id, telegram_bot_token, telegram_admin_chat_id)
VALUES (
  1,
  '7974285481:AAGyTCCKGXWohPprzhMkZU-KWMX38S7Ecw4',
  '474127500'
)
ON CONFLICT (id) DO UPDATE SET
  telegram_bot_token = EXCLUDED.telegram_bot_token,
  telegram_admin_chat_id = EXCLUDED.telegram_admin_chat_id,
  updated_at = NOW();

-- =====================================================
-- VERIFICATION COMPLETE
-- =====================================================

-- Final check - should show role = 'admin'
SELECT 
  email,
  role,
  'Role is: ' || role as status
FROM public.profiles
WHERE email = 'admin@jobmate.com';

-- ✅ If role = 'admin', proceed to test login
-- ❌ If role = 'user', run STEP 2 again

-- =====================================================
-- AFTER RUNNING THIS SQL
-- =====================================================
-- 1. Logout dari aplikasi
-- 2. Clear browser cache / hard refresh
-- 3. Login lagi: admin@jobmate.com / Admin123456!
-- 4. Should redirect to: /admin/applications
-- 5. Dashboard admin should appear
-- =====================================================
