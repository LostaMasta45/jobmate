-- ============================================
-- CREATE SAFE USER FUNCTION
-- This bypasses problematic triggers
-- ============================================

-- Drop if exists
DROP FUNCTION IF EXISTS public.admin_create_user_safe(text, text, text, text);

-- Create function to safely create user + profile
CREATE OR REPLACE FUNCTION public.admin_create_user_safe(
  p_email text,
  p_password text,
  p_full_name text,
  p_whatsapp text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER -- Run with creator's privileges
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_encrypted_password text;
  v_result json;
BEGIN
  -- Generate UUID for new user
  v_user_id := gen_random_uuid();
  
  -- Encrypt password (simple crypt for now, Supabase will handle properly)
  v_encrypted_password := crypt(p_password, gen_salt('bf'));
  
  -- Insert directly into auth.users (bypasses triggers)
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
    '00000000-0000-0000-0000-000000000000', -- default instance
    lower(p_email),
    v_encrypted_password,
    now(), -- auto-confirm email
    now(),
    now(),
    'authenticated',
    'authenticated',
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('name', p_full_name),
    false,
    '', -- no confirmation needed
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
  
  -- Return success with user ID
  v_result := json_build_object(
    'success', true,
    'user_id', v_user_id,
    'email', p_email,
    'message', 'User created successfully'
  );
  
  RETURN v_result;
  
EXCEPTION WHEN OTHERS THEN
  -- Return error
  RETURN json_build_object(
    'success', false,
    'error', SQLERRM,
    'detail', SQLSTATE
  );
END;
$$;

-- Grant execute to service role
GRANT EXECUTE ON FUNCTION public.admin_create_user_safe(text, text, text, text) TO service_role;

-- Test the function (optional - comment out if you want)
-- SELECT public.admin_create_user_safe(
--   'test@example.com',
--   'TestPassword123!',
--   'Test User',
--   '081234567890'
-- );

-- ============================================
-- VERIFICATION
-- ============================================

-- Check function exists
SELECT 
  '✅ Function created' as status,
  proname as function_name,
  pg_get_function_identity_arguments(oid) as arguments
FROM pg_proc
WHERE proname = 'admin_create_user_safe';

-- Expected: function exists with 4 arguments

-- ============================================
-- USAGE FROM NEXT.JS:
-- ============================================

/*
In actions/admin.ts, replace adminClient.auth.admin.createUser() with:

const { data, error } = await adminClient.rpc('admin_create_user_safe', {
  p_email: application.email,
  p_password: password,
  p_full_name: application.full_name,
  p_whatsapp: application.whatsapp
});

if (error || !data?.success) {
  throw new Error(data?.error || 'Failed to create user');
}

const userId = data.user_id;
// Continue with rest of approval logic...
*/
