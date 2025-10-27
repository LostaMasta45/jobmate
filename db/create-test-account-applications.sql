-- =====================================================
-- Create Test Data for Account Applications
-- Purpose: Testing Cek Status Pengajuan feature
-- Date: 2025-10-26
-- =====================================================

-- Step 1: Check existing data
SELECT 
  '📊 Current Account Applications' as info,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
  COUNT(*) FILTER (WHERE status = 'approved') as approved_count,
  COUNT(*) FILTER (WHERE status = 'rejected') as rejected_count
FROM account_applications;

-- Step 2: Show existing applications
SELECT 
  '📋 Existing Applications' as info,
  id,
  full_name,
  email,
  status,
  created_at,
  approved_at
FROM account_applications
ORDER BY created_at DESC
LIMIT 10;

-- =====================================================
-- Step 3: Create sample test data if needed
-- =====================================================

-- Test User 1: PENDING STATUS
INSERT INTO account_applications (
  full_name,
  username,
  email,
  whatsapp,
  proof_path,
  encrypted_password,
  telegram_link_code,
  status,
  created_at,
  updated_at
) VALUES (
  'Budi Santoso',
  'budisantoso',
  'budi.test@example.com',
  '081234567890',
  'test-proof-budi.jpg',
  'password123',
  'TEST001',
  'pending',
  NOW() - INTERVAL '12 hours',
  NOW() - INTERVAL '12 hours'
)
ON CONFLICT (email) DO UPDATE
SET status = 'pending',
    updated_at = NOW();

-- Test User 2: APPROVED STATUS (VIP PREMIUM)
INSERT INTO account_applications (
  full_name,
  username,
  email,
  whatsapp,
  proof_path,
  encrypted_password,
  telegram_link_code,
  status,
  created_at,
  updated_at,
  approved_at
) VALUES (
  'Siti Nurhaliza',
  'sitinur',
  'siti.test@example.com',
  '081234567891',
  'test-proof-siti.jpg',
  'password123',
  'TEST002',
  'approved',
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '1 day'
)
ON CONFLICT (email) DO UPDATE
SET status = 'approved',
    approved_at = NOW() - INTERVAL '1 day',
    updated_at = NOW();

-- Create profile for approved user (VIP PREMIUM)
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Get or create auth user for siti
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'siti.test@example.com';
  
  IF v_user_id IS NULL THEN
    -- If no auth user exists, create a dummy user ID for testing
    v_user_id := gen_random_uuid();
    RAISE NOTICE 'Created dummy user ID for siti: %', v_user_id;
  END IF;
  
  -- Insert or update profile with VIP PREMIUM
  INSERT INTO profiles (
    id,
    email,
    name,
    full_name,
    membership,
    membership_status,
    membership_expires_at,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    'siti.test@example.com',
    'Siti Nurhaliza',
    'Siti Nurhaliza',
    'vip_premium',
    'active',
    NOW() + INTERVAL '30 days',
    NOW() - INTERVAL '1 day',
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET membership = 'vip_premium',
      membership_status = 'active',
      membership_expires_at = NOW() + INTERVAL '30 days',
      updated_at = NOW();
      
  RAISE NOTICE '✅ Profile created for Siti with VIP PREMIUM';
END $$;

-- Test User 3: REJECTED STATUS
INSERT INTO account_applications (
  full_name,
  username,
  email,
  whatsapp,
  proof_path,
  encrypted_password,
  telegram_link_code,
  status,
  created_at,
  updated_at
) VALUES (
  'Ahmad Yusuf',
  'ahmadyusuf',
  'ahmad.test@example.com',
  '081234567892',
  'test-proof-ahmad.jpg',
  'password123',
  'TEST003',
  'rejected',
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '2 days'
)
ON CONFLICT (email) DO UPDATE
SET status = 'rejected',
    updated_at = NOW();

-- Test User 4: APPROVED (VIP BASIC)  
INSERT INTO account_applications (
  full_name,
  username,
  email,
  whatsapp,
  proof_path,
  encrypted_password,
  telegram_link_code,
  status,
  created_at,
  updated_at,
  approved_at
) VALUES (
  'Dewi Lestari',
  'dewilestari',
  'dewi.test@example.com',
  '081234567893',
  'test-proof-dewi.jpg',
  'password123',
  'TEST004',
  'approved',
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '2 hours',
  NOW() - INTERVAL '2 hours'
)
ON CONFLICT (email) DO UPDATE
SET status = 'approved',
    approved_at = NOW() - INTERVAL '2 hours',
    updated_at = NOW();

-- Create profile for approved user (VIP BASIC)
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Get or create auth user for dewi
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'dewi.test@example.com';
  
  IF v_user_id IS NULL THEN
    -- If no auth user exists, create a dummy user ID for testing
    v_user_id := gen_random_uuid();
    RAISE NOTICE 'Created dummy user ID for dewi: %', v_user_id;
  END IF;
  
  -- Insert or update profile with VIP BASIC
  INSERT INTO profiles (
    id,
    email,
    name,
    full_name,
    membership,
    membership_status,
    membership_expires_at,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    'dewi.test@example.com',
    'Dewi Lestari',
    'Dewi Lestari',
    'vip_basic',
    'active',
    NOW() + INTERVAL '7 days',
    NOW() - INTERVAL '2 hours',
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET membership = 'vip_basic',
      membership_status = 'active',
      membership_expires_at = NOW() + INTERVAL '7 days',
      updated_at = NOW();
      
  RAISE NOTICE '✅ Profile created for Dewi with VIP BASIC';
END $$;

-- =====================================================
-- Step 4: Verify test data created
-- =====================================================

SELECT 
  '✅ Test Data Created' as status,
  full_name,
  email,
  status,
  CASE 
    WHEN status = 'pending' THEN '⏳ Pending'
    WHEN status = 'approved' THEN '✅ Approved'
    WHEN status = 'rejected' THEN '❌ Rejected'
  END as status_icon,
  created_at,
  approved_at
FROM account_applications
WHERE email LIKE '%.test@example.com'
ORDER BY 
  CASE status
    WHEN 'pending' THEN 1
    WHEN 'approved' THEN 2
    WHEN 'rejected' THEN 3
  END;

-- =====================================================
-- Step 5: Test Queries (same as API will use)
-- =====================================================

-- Test Query 1: Check pending user
SELECT 
  '🔍 Test Query: PENDING' as test_type,
  * 
FROM account_applications 
WHERE email = 'budi.test@example.com';

-- Test Query 2: Check approved user
SELECT 
  '🔍 Test Query: APPROVED' as test_type,
  * 
FROM account_applications 
WHERE email = 'siti.test@example.com';

-- Test Query 3: Check rejected user
SELECT 
  '🔍 Test Query: REJECTED' as test_type,
  * 
FROM account_applications 
WHERE email = 'ahmad.test@example.com';

-- Test Query 4: Check non-existent user (should return no rows)
SELECT 
  '🔍 Test Query: NOT FOUND' as test_type,
  * 
FROM account_applications 
WHERE email = 'notfound@example.com';

-- =====================================================
-- TESTING INSTRUCTIONS
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ TEST DATA READY';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE '🧪 Test these emails in the UI:';
  RAISE NOTICE '';
  RAISE NOTICE '1. PENDING Status:';
  RAISE NOTICE '   Email: budi.test@example.com';
  RAISE NOTICE '   Expected: Yellow card, Clock icon, "Menunggu Review"';
  RAISE NOTICE '   VIP: No membership (not approved yet)';
  RAISE NOTICE '';
  RAISE NOTICE '2. APPROVED + VIP PREMIUM:';
  RAISE NOTICE '   Email: siti.test@example.com';
  RAISE NOTICE '   Expected: Purple VIP PREMIUM badge + Green approval card';
  RAISE NOTICE '   Badge: Crown icon, Purple gradient, "ACTIVE" ribbon';
  RAISE NOTICE '   Action: "Login Sekarang" button';
  RAISE NOTICE '';
  RAISE NOTICE '3. REJECTED Status:';
  RAISE NOTICE '   Email: ahmad.test@example.com';
  RAISE NOTICE '   Expected: Red card, XCircle, "Ajukan Lagi" button';
  RAISE NOTICE '   VIP: No membership (rejected)';
  RAISE NOTICE '';
  RAISE NOTICE '4. APPROVED + VIP BASIC:';
  RAISE NOTICE '   Email: dewi.test@example.com';
  RAISE NOTICE '   Expected: Gold VIP BASIC badge + Green approval card';
  RAISE NOTICE '   Badge: Star icon, Gold/Amber gradient, "ACTIVE" ribbon';
  RAISE NOTICE '   Action: "Login Sekarang" button';
  RAISE NOTICE '';
  RAISE NOTICE '5. NOT FOUND:';
  RAISE NOTICE '   Email: notfound@example.com';
  RAISE NOTICE '   Expected: Error card, "Pengajuan Tidak Ditemukan"';
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '🎨 VIP Badge Features:';
  RAISE NOTICE '   - Animated pulse effect on icon';
  RAISE NOTICE '   - Gradient backgrounds';
  RAISE NOTICE '   - Sparkles animation';
  RAISE NOTICE '   - Glowing shadows';
  RAISE NOTICE '   - Active status ribbon';
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '🌐 Test URLs:';
  RAISE NOTICE '   http://localhost:3007/cek-status-pengajuan';
  RAISE NOTICE '   http://localhost:3007/sign-in (scroll down for link)';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
END $$;

-- =====================================================
-- Optional: Clean up test data later
-- =====================================================

-- UNCOMMENT THIS TO DELETE TEST DATA:
/*
DELETE FROM account_applications 
WHERE email LIKE '%.test@example.com';

SELECT '🗑️ Test data deleted' as status;
*/
