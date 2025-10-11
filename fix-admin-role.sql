-- =====================================================
-- FIX: Update Existing Profile to Admin Role
-- =====================================================
-- Error: Profile already exists (auto-created by trigger)
-- Solution: Just update the role to 'admin'
-- =====================================================

-- STEP 1: Update role to admin
UPDATE public.profiles
SET 
  role = 'admin',
  name = 'Admin JobMate',
  updated_at = NOW()
WHERE id = 'e77fdb64-ce63-4ddd-9eb7-1bd5a2e0e96f';

-- STEP 2: Insert Telegram settings
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

-- STEP 3: Verify admin profile
SELECT 
  id, 
  name, 
  email, 
  role,
  created_at,
  updated_at
FROM public.profiles 
WHERE id = 'e77fdb64-ce63-4ddd-9eb7-1bd5a2e0e96f';
-- Expected: role = 'admin'

-- STEP 4: Verify telegram settings
SELECT 
  telegram_bot_token,
  telegram_admin_chat_id,
  created_at,
  updated_at
FROM public.admin_settings 
WHERE id = 1;
-- Expected: Your bot token and chat ID

-- =====================================================
-- SUCCESS CRITERIA
-- =====================================================
-- ✅ Role updated to 'admin'
-- ✅ Telegram settings inserted
-- ✅ Ready to test login
-- =====================================================
