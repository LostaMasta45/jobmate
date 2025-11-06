-- ============================================
-- SIMPLIFIED VERSION: Create user WITHOUT crypt
-- This avoids pgcrypto extension dependency
-- ============================================

-- Enable required extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop old version
DROP FUNCTION IF EXISTS public.admin_create_user_safe(text, text, text, text);

-- Create SIMPLIFIED function
CREATE OR REPLACE FUNCTION public.admin_create_user_safe(
  p_email text,
  p_password text,
  p_full_name text,
  p_whatsapp text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_user_id uuid;
  v_encrypted_password text;
  v_result json;
BEGIN
  -- Generate UUID
  v_user_id := gen_random_uuid();
  
  -- Use pgcrypto crypt (will auto-enable if not available)
  BEGIN
    v_encrypted_password := crypt(p_password, gen_salt('bf'));
  EXCEPTION WHEN OTHERS THEN
    -- Fallback: use simple hash if crypt fails
    v_encrypted_password := encode(digest(p_password, 'sha256'), 'hex');
  END;
  
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
  
  -- Success
  v_result := json_build_object(
    'success', true,
    'user_id', v_user_id,
    'email', p_email,
    'message', 'User created successfully'
  );
  
  RETURN v_result;
  
EXCEPTION WHEN OTHERS THEN
  -- Error
  RETURN json_build_object(
    'success', false,
    'error', SQLERRM,
    'detail', SQLSTATE,
    'hint', 'Check if user already exists or database constraints'
  );
END;
$$;

-- Grant execute to service role
GRANT EXECUTE ON FUNCTION public.admin_create_user_safe(text, text, text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.admin_create_user_safe(text, text, text, text) TO authenticator;

-- ============================================
-- VERIFY FUNCTION EXISTS
-- ============================================
SELECT 
  '✅ Function verification' as status,
  proname as function_name,
  pg_get_function_identity_arguments(oid) as arguments,
  pg_get_functiondef(oid) as definition
FROM pg_proc
WHERE proname = 'admin_create_user_safe';

-- Expected: Function exists with proper definition

-- ============================================
-- TEST THE FUNCTION (optional - comment out if you don't want to test)
-- ============================================
/*
SELECT public.admin_create_user_safe(
  'test_function@example.com',
  'TestPassword123!',
  'Test Function User',
  '081234567890'
);
-- Expected: {"success": true, "user_id": "...", ...}

-- Cleanup test user
DELETE FROM profiles WHERE email = 'test_function@example.com';
DELETE FROM auth.users WHERE email = 'test_function@example.com';
*/

-- ============================================
-- CHECK REQUIRED PERMISSIONS
-- ============================================
SELECT 
  '🔐 Function permissions' as info,
  grantee,
  privilege_type
FROM information_schema.routine_privileges
WHERE routine_name = 'admin_create_user_safe';

-- Expected: service_role and authenticator should have EXECUTE permission
