-- ============================================
-- DEBUG: Payment 404 Not Found
-- ============================================

-- Step 1: Check if payment exists in database
-- Run this in Supabase SQL Editor
SELECT 
  id,
  external_id,
  user_email,
  user_name,
  plan_type,
  amount,
  status,
  invoice_id,
  invoice_url,
  created_at,
  paid_at
FROM payments
WHERE external_id = 'jobmate-basic-1761112019187';

-- Expected:
-- If FOUND → Payment exists, check status
-- If EMPTY → Payment not in database yet

-- ============================================
-- Step 2: Check all recent payments
-- ============================================
SELECT 
  external_id,
  user_email,
  plan_type,
  amount,
  status,
  created_at
FROM payments
ORDER BY created_at DESC
LIMIT 10;

-- This shows last 10 payments created

-- ============================================
-- Step 3: If payment not found, check reason
-- ============================================

-- Reason 1: Invoice not created yet
-- → User didn't submit payment form
-- → API /api/payment/create-invoice failed

-- Reason 2: Webhook not triggered yet
-- → Invoice created but not paid
-- → Payment pending in Xendit

-- Reason 3: Webhook failed
-- → Check Vercel logs (Functions → /api/webhooks/xendit)
-- → Check Xendit Dashboard (Webhooks → Logs)

-- ============================================
-- Step 4: Manual insert (ONLY IF NEEDED)
-- ============================================
-- WARNING: Only use this if payment was made but webhook failed!

-- First, check Xendit Dashboard for invoice details:
-- 1. Login: https://dashboard.xendit.co
-- 2. Go to: Transactions → Invoices
-- 3. Find: jobmate-basic-1761112019187
-- 4. Check: Status (PAID or PENDING?)
-- 5. Note: Invoice ID, Amount, User Email

-- If invoice is PAID but not in database, insert manually:
/*
INSERT INTO payments (
  external_id,
  user_email,
  user_name,
  user_whatsapp,
  plan_type,
  amount,
  status,
  invoice_id,
  invoice_url,
  paid_at,
  expired_at
) VALUES (
  'jobmate-basic-1761112019187',  -- external_id from URL
  'user@example.com',              -- from Xendit invoice
  'User Name',                     -- from Xendit invoice
  '08123456789',                   -- from Xendit invoice
  'basic',                         -- basic or premium
  10000,                           -- amount in Rupiah
  'paid',                          -- status
  'xendit-invoice-id-here',        -- from Xendit dashboard
  'https://checkout.xendit.co/v2/...',  -- from Xendit
  NOW(),                           -- paid_at
  NOW() + INTERVAL '30 days'      -- expired_at
);
*/

-- ============================================
-- Step 5: Check RLS policies (if query returns empty)
-- ============================================

-- Check if RLS is blocking query
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'payments';

-- If rowsecurity = true, check policies:
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'payments';

-- Expected: Service role should bypass RLS
-- If not, temporarily disable RLS for testing:
-- ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
