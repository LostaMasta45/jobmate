-- ============================================
-- SETUP TEST USERS - VIP Career
-- ============================================
-- Run ini SETELAH schema + mock data
-- ============================================

-- STEP 1: Cari user yang ada di database
-- ============================================
-- Copy query ini, run, lalu lihat hasilnya
SELECT 
  u.id,
  u.email,
  u.created_at,
  p.full_name,
  p.role,
  p.membership_tier
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
ORDER BY u.created_at DESC
LIMIT 10;

-- ============================================
-- STEP 2: Pilih 2 user dari hasil di atas
-- ============================================
-- Ganti 'USER_ID_1' dan 'USER_ID_2' dengan ID yang real
-- Contoh ID format: '123e4567-e89b-12d3-a456-426614174000'

-- USER 1: Set sebagai BASIC member (Rp 10K/bulan)
-- ============================================
-- Ganti USER_ID_1 dengan ID user pertama dari hasil query STEP 1
UPDATE profiles SET
  membership_tier = 'basic',
  membership_status = 'active',
  membership_started_at = NOW(),
  membership_expires_at = NOW() + INTERVAL '30 days',
  wa_number = '081234567890'
WHERE id = 'USER_ID_1'; -- <-- GANTI INI

-- Verify user 1
SELECT 
  u.email,
  p.membership_tier,
  p.membership_status,
  p.membership_expires_at
FROM auth.users u
JOIN profiles p ON p.id = u.id
WHERE p.id = 'USER_ID_1'; -- <-- GANTI INI


-- USER 2: Set sebagai PREMIUM member (Lifetime)
-- ============================================
-- Ganti USER_ID_2 dengan ID user kedua dari hasil query STEP 1
UPDATE profiles SET
  membership_tier = 'premium',
  membership_status = 'active',
  membership_started_at = NOW(),
  membership_expires_at = NULL, -- NULL = lifetime access
  wa_number = '082345678901'
WHERE id = 'USER_ID_2'; -- <-- GANTI INI

-- Verify user 2
SELECT 
  u.email,
  p.membership_tier,
  p.membership_status,
  p.membership_expires_at
FROM auth.users u
JOIN profiles p ON p.id = u.id
WHERE p.id = 'USER_ID_2'; -- <-- GANTI INI


-- ============================================
-- ALTERNATIVE: Jika hanya punya 1 user
-- ============================================
-- Set user pertama sebagai PREMIUM (biar bisa test semua)
-- Nanti bisa buat user baru untuk test Basic

-- Ambil ID user pertama dan set jadi Premium
UPDATE profiles SET
  membership_tier = 'premium',
  membership_status = 'active',
  membership_started_at = NOW(),
  membership_expires_at = NULL
WHERE id = (
  SELECT id FROM auth.users 
  ORDER BY created_at DESC 
  LIMIT 1
);

-- Verify
SELECT 
  u.email,
  p.membership_tier,
  p.membership_status,
  p.membership_expires_at
FROM auth.users u
JOIN profiles p ON p.id = u.id
WHERE p.membership_tier IS NOT NULL;


-- ============================================
-- QUICK SETUP: Auto-assign first 2 users
-- ============================================
-- Gunakan ini jika mau cepat tanpa cari ID manual

-- Set user pertama jadi PREMIUM
WITH first_user AS (
  SELECT id FROM auth.users 
  ORDER BY created_at ASC 
  LIMIT 1
)
UPDATE profiles SET
  membership_tier = 'premium',
  membership_status = 'active',
  membership_started_at = NOW(),
  membership_expires_at = NULL,
  wa_number = '081234567890'
WHERE id IN (SELECT id FROM first_user);

-- Set user kedua jadi BASIC
WITH second_user AS (
  SELECT id FROM auth.users 
  ORDER BY created_at ASC 
  LIMIT 1 OFFSET 1
)
UPDATE profiles SET
  membership_tier = 'basic',
  membership_status = 'active',
  membership_started_at = NOW(),
  membership_expires_at = NOW() + INTERVAL '30 days',
  wa_number = '082345678901'
WHERE id IN (SELECT id FROM second_user);

-- Final verification
SELECT 
  u.email,
  p.full_name,
  p.membership_tier,
  p.membership_status,
  p.membership_expires_at,
  CASE 
    WHEN p.membership_expires_at IS NULL THEN '✅ Lifetime'
    WHEN p.membership_expires_at > NOW() THEN '✅ Active'
    ELSE '❌ Expired'
  END as status_label
FROM auth.users u
JOIN profiles p ON p.id = u.id
WHERE p.membership_tier IS NOT NULL
ORDER BY p.membership_tier DESC;


-- ============================================
-- BONUS: Create New Test Users (Optional)
-- ============================================
-- Jika mau buat user baru khusus untuk testing
-- (Lebih baik lewat Supabase Dashboard → Authentication → Add User)

-- Setelah buat user baru di dashboard, run ini untuk set membership
-- Ganti EMAIL dengan email user baru

-- Set new user jadi Basic
UPDATE profiles SET
  membership_tier = 'basic',
  membership_status = 'active',
  membership_started_at = NOW(),
  membership_expires_at = NOW() + INTERVAL '30 days'
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'testbasic@example.com'
);

-- Set new user jadi Premium
UPDATE profiles SET
  membership_tier = 'premium',
  membership_status = 'active',
  membership_started_at = NOW(),
  membership_expires_at = NULL
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'testpremium@example.com'
);
