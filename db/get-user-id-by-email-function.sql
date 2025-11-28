-- Function to get user ID by email from auth.users
-- Run this in Supabase SQL Editor

-- Create function to lookup user by email (accessible via service_role)
CREATE OR REPLACE FUNCTION get_user_id_by_email(user_email TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_id UUID;
BEGIN
  SELECT id INTO user_id
  FROM auth.users
  WHERE email = lower(user_email)
  LIMIT 1;
  
  RETURN user_id;
END;
$$;

-- Grant execute to service_role
GRANT EXECUTE ON FUNCTION get_user_id_by_email(TEXT) TO service_role;

-- Test (replace with actual email)
-- SELECT get_user_id_by_email('test@example.com');
