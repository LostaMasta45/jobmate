-- ============================================
-- MANUAL INSERT: jobmate-premium-1761113144725
-- ============================================
-- Run this in Supabase SQL Editor to fix 404 error

-- Step 1: Check if payment already exists
SELECT * FROM payments 
WHERE external_id = 'jobmate-premium-1761113144725';

-- If result is EMPTY, proceed with insert below
-- If result has data, payment already exists (skip insert)

-- ============================================
-- Step 2: INSERT payment record
-- ============================================

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
  payment_method,
  paid_at,
  expired_at,
  created_at,
  updated_at
) VALUES (
  'jobmate-premium-1761113144725',  -- External ID from URL
  'REPLACE_WITH_EMAIL',              -- ⚠️ Get from Xendit invoice
  'REPLACE_WITH_NAME',               -- ⚠️ Get from Xendit invoice
  'REPLACE_WITH_WHATSAPP',           -- ⚠️ Get from Xendit invoice
  'premium',                         -- VIP Premium
  39000,                             -- Rp 39,000
  'paid',                            -- Status
  'REPLACE_WITH_INVOICE_ID',         -- ⚠️ Get from Xendit (starts with inv-)
  'REPLACE_WITH_INVOICE_URL',        -- ⚠️ Get from Xendit
  'simulated',                       -- Payment method (test mode)
  '2025-10-22 13:06:00',            -- Paid at (from log: 13:06)
  '2026-10-22 13:06:00',            -- Expired 1 year later (premium = lifetime)
  '2025-10-22 13:05:44',            -- Created at (from log: 13:05)
  NOW()                              -- Updated at
) RETURNING *;

-- ============================================
-- Step 3: Verify insert
-- ============================================

SELECT 
  external_id,
  user_email,
  plan_type,
  amount,
  status,
  paid_at,
  created_at
FROM payments 
WHERE external_id = 'jobmate-premium-1761113144725';

-- Expected result: 1 row showing the payment

-- ============================================
-- WHERE TO GET REAL DATA?
-- ============================================

-- 1. Login to Xendit Dashboard: https://dashboard.xendit.co
-- 2. Go to: Transactions → Invoices
-- 3. Search: jobmate-premium-1761113144725
-- 4. Click invoice to see details
-- 5. Copy the following:
--    - Customer Email → Replace REPLACE_WITH_EMAIL
--    - Customer Name → Replace REPLACE_WITH_NAME
--    - Customer Phone → Replace REPLACE_WITH_WHATSAPP
--    - Invoice ID (inv-xxxxx) → Replace REPLACE_WITH_INVOICE_ID
--    - Invoice URL → Replace REPLACE_WITH_INVOICE_URL
-- 6. Run the INSERT query with real data
-- 7. Refresh success page: Should work! ✅

-- ============================================
-- AFTER INSERT
-- ============================================

-- Success page URL:
-- https://jobmate.web.id/payment/success?external_id=jobmate-premium-1761113144725

-- Should now show:
-- ✅ Confetti animation
-- ✅ "Terima Kasih, [Name]!" greeting
-- ✅ Gold VIP PREMIUM badge
-- ✅ Payment amount: Rp 39,000
-- ✅ All payment details

-- ============================================
-- TROUBLESHOOTING
-- ============================================

-- If insert fails with duplicate key error:
DELETE FROM payments WHERE external_id = 'jobmate-premium-1761113144725';
-- Then run INSERT again

-- If RLS prevents insert:
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
-- Then run INSERT again
-- Then re-enable RLS:
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
