-- ========================================
-- FIX EXISTING PAYMENTS: Update NULL Customer Data
-- ========================================
-- Run this in Supabase SQL Editor if you have existing payments
-- with NULL user_name or user_whatsapp

-- 1. Check how many payments need fixing
SELECT 
  COUNT(*) as total_needs_fix,
  COUNT(CASE WHEN user_name IS NULL THEN 1 END) as missing_name,
  COUNT(CASE WHEN user_whatsapp IS NULL THEN 1 END) as missing_whatsapp
FROM payments
WHERE user_name IS NULL OR user_whatsapp IS NULL;

-- 2. View payments that need fixing
SELECT 
  external_id,
  user_email,
  user_name,
  user_whatsapp,
  status,
  created_at
FROM payments
WHERE user_name IS NULL OR user_whatsapp IS NULL
ORDER BY created_at DESC;

-- ========================================
-- OPTION 1: Manual Update (RECOMMENDED)
-- ========================================
-- Update specific payment by email
-- Replace with actual customer data

-- Example for reza.nur.h45@gmail.com:
UPDATE payments
SET 
  user_name = 'Reza Nur Hakim',      -- ← Replace with actual name
  user_whatsapp = '+6281234567890',  -- ← Replace with actual WhatsApp
  updated_at = NOW()
WHERE user_email = 'reza.nur.h45@gmail.com'
AND (user_name IS NULL OR user_whatsapp IS NULL);

-- ========================================
-- OPTION 2: Set Default Values for NULL
-- ========================================
-- If you don't have the original data,
-- set placeholder values

-- Set "Tidak Tersedia" for NULL values
UPDATE payments
SET 
  user_name = COALESCE(user_name, 'Tidak Tersedia'),
  user_whatsapp = COALESCE(user_whatsapp, '-'),
  updated_at = NOW()
WHERE user_name IS NULL OR user_whatsapp IS NULL;

-- ========================================
-- OPTION 3: Extract from email
-- ========================================
-- Use email username as fallback name
-- Better than "Unknown User"

UPDATE payments
SET 
  user_name = CASE 
    WHEN user_name IS NULL THEN 
      INITCAP(SPLIT_PART(user_email, '@', 1))
    ELSE user_name
  END,
  user_whatsapp = COALESCE(user_whatsapp, '-'),
  updated_at = NOW()
WHERE user_name IS NULL OR user_whatsapp IS NULL;

-- Example result: 
-- reza.nur.h45@gmail.com → "Reza.Nur.H45"

-- ========================================
-- VERIFICATION
-- ========================================
-- Check if all payments now have data
SELECT 
  COUNT(*) as total_payments,
  COUNT(CASE WHEN user_name IS NOT NULL THEN 1 END) as has_name,
  COUNT(CASE WHEN user_whatsapp IS NOT NULL THEN 1 END) as has_whatsapp,
  COUNT(CASE WHEN user_name IS NULL OR user_whatsapp IS NULL THEN 1 END) as still_null
FROM payments;

-- View updated payments
SELECT 
  external_id,
  user_email,
  user_name,
  user_whatsapp,
  status,
  updated_at
FROM payments
ORDER BY updated_at DESC
LIMIT 10;

-- ========================================
-- SPECIFIC USER FIX (FOR YOUR CASE)
-- ========================================
-- If you know the email from screenshot

-- 1. Find the payment
SELECT * FROM payments 
WHERE user_email = 'reza.nur.h45@gmail.com'
ORDER BY created_at DESC;

-- 2. Update with correct data (get from user or form)
UPDATE payments
SET 
  user_name = 'Reza Nur Hakim',     -- Get from user
  user_whatsapp = '+628123456789',   -- Get from user
  updated_at = NOW()
WHERE user_email = 'reza.nur.h45@gmail.com';

-- 3. Verify
SELECT 
  user_name,
  user_email,
  user_whatsapp,
  status
FROM payments 
WHERE user_email = 'reza.nur.h45@gmail.com';

-- ========================================
-- NOTES
-- ========================================
-- • Run OPTION 1 if you have actual customer data
-- • Run OPTION 2 if you just want to fill NULL values
-- • Run OPTION 3 for better placeholder than "Unknown User"
-- • After update, reload /payment/success page to see changes
