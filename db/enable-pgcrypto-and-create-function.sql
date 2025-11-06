-- ============================================
-- STEP 1: Enable pgcrypto extension
-- ============================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Verify extension enabled
SELECT 
  '✅ pgcrypto extension' as status,
  extname as extension_name,
  extversion as version
FROM pg_extension
WHERE extname = 'pgcrypto';

-- Expected: Should show pgcrypto is installed

-- ============================================
-- STEP 2: Drop old function
-- ============================================
DROP FUNCTION IF EXISTS public.admin_create_user_safe(text, text, text, text);

-- ============================================
-- STEP 3: Create function with pgcrypto
-- ============================================
CREATE OR REPLACE FUNCTION public.admin_create_user_safe(
  p_email text,
  p_password text,
  p_full_name text,
  p_whatsapp text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
  v_user_id uuid;
  v_encrypted_password text;
BEGIN
  -- Generate UUID
  v_user_id := gen_random_uuid();
  
  -- Hash password with crypt (now pgcrypto is enabled)
  v_encrypted_password := crypt(p_password, gen_salt('bf'));
  
  -- Insert to auth.users
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    aud,
    role,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    confirmation_token,
    email_change_token_new,
    recovery_token
  ) VALUES (
    v_user_id,
    '00000000-0000-0000-0000-000000000000',
    lower(p_email),
    v_encrypted_password,
    now(),
    now(),
    now(),
    'authenticated',
    'authenticated',
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('name', p_full_name),
    false,
    '',
    '',
    ''
  );
  
  -- Create profile
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    name,
    role,
    membership,
    membership_status,
    whatsapp,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    lower(p_email),
    p_full_name,
    p_full_name,
    'user',
    'free',
    'active',
    p_whatsapp,
    now(),
    now()
  );
  
  RETURN json_build_object(
    'success', true,
    'user_id', v_user_id,
    'email', p_email
  );
  
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object(
    'success', false,
    'error', SQLERRM,
    'detail', SQLSTATE
  );
END;
$$;

-- ============================================
-- STEP 4: Grant permissions
-- ============================================
GRANT EXECUTE ON FUNCTION public.admin_create_user_safe(text, text, text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.admin_create_user_safe(text, text, text, text) TO authenticator;

-- ============================================
-- STEP 5: Verify everything
-- ============================================
SELECT 
  '✅ Verification' as step,
  (SELECT COUNT(*) FROM pg_extension WHERE extname = 'pgcrypto') as pgcrypto_enabled,
  (SELECT COUNT(*) FROM pg_proc WHERE proname = 'admin_create_user_safe') as function_exists;

-- Expected: pgcrypto_enabled = 1, function_exists = 1

-- ============================================
-- STEP 6: Test the function (optional)
-- ============================================
/*
SELECT public.admin_create_user_safe(
  'test_pgcrypto@example.com',
  'TestPassword123!',
  'Test PGCrypto User',
  '081234567890'
);

-- Cleanup
DELETE FROM profiles WHERE email = 'test_pgcrypto@example.com';
DELETE FROM auth.users WHERE email = 'test_pgcrypto@example.com';
*/

SELECT '🎉 All done! Function ready to use.' as final_status;
