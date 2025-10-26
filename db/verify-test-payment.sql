-- =====================================================
-- Verify: Check if test payment data exists
-- =====================================================

-- Check all test payments
SELECT 
  external_id,
  user_name,
  user_email,
  user_whatsapp,
  plan_type,
  status,
  amount,
  created_at
FROM public.payments
WHERE external_id LIKE 'jobmate-%-test-%'
ORDER BY created_at DESC;

-- If no results, check last 5 payments
SELECT 
  external_id,
  user_name,
  user_email,
  user_whatsapp,
  plan_type,
  status,
  created_at
FROM public.payments
ORDER BY created_at DESC
LIMIT 5;

-- Count total payments
SELECT COUNT(*) as total_payments FROM public.payments;
