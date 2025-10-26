-- =====================================================
-- Test: Insert Dummy Payment Data (VIP BASIC)
-- Purpose: Test success page with customer data
-- =====================================================

-- Insert test payment VIP BASIC with fixed external_id
INSERT INTO public.payments (
  external_id,
  invoice_id,
  user_email,
  user_name,
  user_whatsapp,
  plan_type,
  amount,
  status,
  invoice_url,
  paid_at,
  expired_at,
  created_at,
  updated_at
) VALUES (
  'jobmate-basic-test-1234567890',
  'xendit-test-invoice-123',
  'test@example.com',
  'Test User VIP Basic',
  '081234567890',
  'basic',
  10000,
  'paid',
  'https://checkout.xendit.co/web/test-invoice-123',
  NOW(),
  NOW() + INTERVAL '30 days',
  NOW(),
  NOW()
)
ON CONFLICT (external_id) DO UPDATE SET
  status = 'paid',
  paid_at = NOW(),
  updated_at = NOW()
RETURNING external_id, user_name, user_whatsapp, plan_type;

-- Insert test payment VIP PREMIUM with fixed external_id
INSERT INTO public.payments (
  external_id,
  invoice_id,
  user_email,
  user_name,
  user_whatsapp,
  plan_type,
  amount,
  status,
  invoice_url,
  paid_at,
  expired_at,
  created_at,
  updated_at
) VALUES (
  'jobmate-premium-test-9876543210',
  'xendit-test-invoice-456',
  'premium@example.com',
  'Test User VIP Premium',
  '089876543210',
  'premium',
  39000,
  'paid',
  'https://checkout.xendit.co/web/test-invoice-456',
  NOW(),
  NOW() + INTERVAL '1 year',
  NOW(),
  NOW()
)
ON CONFLICT (external_id) DO UPDATE SET
  status = 'paid',
  paid_at = NOW(),
  updated_at = NOW()
RETURNING external_id, user_name, user_whatsapp, plan_type;

-- Query to get the external_ids for testing
SELECT 
  external_id,
  user_name,
  user_email,
  user_whatsapp,
  plan_type,
  status,
  amount
FROM public.payments
WHERE external_id LIKE 'jobmate-%-test-%'
ORDER BY created_at DESC
LIMIT 2;
