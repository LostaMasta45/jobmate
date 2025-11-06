-- ============================================
-- ULTRA SIMPLE VERSION: No crypt, just SHA256
-- Works without pgcrypto extension
-- ============================================

-- Drop old version
DROP FUNCTION IF EXISTS public.admin_create_user_safe(text, text, text, text);

-- Create SUPER SIMPLE function (no crypt dependency)
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
BEGIN
  -- Generate UUID
  v_user_id := gen_random_uuid();
  
  -- Simple password hash using SHA256 (no pgcrypto needed)
  v_encrypted_password := encode(digest(p_password, 'sha256'), 'hex');
  
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

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.admin_create_user_safe(text, text, text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.admin_create_user_safe(text, text, text, text) TO authenticator;

-- Verify
SELECT 'SUCCESS: Function created' as status;
SELECT proname, pg_get_function_identity_arguments(oid) 
FROM pg_proc 
WHERE proname = 'admin_create_user_safe';
