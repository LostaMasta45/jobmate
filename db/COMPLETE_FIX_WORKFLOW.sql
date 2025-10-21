-- ========================================
-- COMPLETE FIX: JobMate User Workflow
-- ========================================
-- This fixes all issues in the flow:
-- User applies → Admin approves → Admin sets VIP → User login works
-- 
-- Run this ONCE in Supabase SQL Editor

-- ========================================
-- STEP 1: Drop Legacy Columns (Clean Database)
-- ========================================

-- We're going to standardize on NEW columns only:
-- - membership (not membership_tier)
-- - membership_expiry (not membership_expires_at)
-- - membership_status

-- Check if legacy columns exist
DO $$
BEGIN
  -- Drop membership_tier if exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'membership_tier'
  ) THEN
    -- First, migrate data from old to new column
    UPDATE profiles
    SET membership = CASE
      WHEN membership_tier = 'basic' THEN 'vip_basic'
      WHEN membership_tier = 'premium' THEN 'vip_premium'
      ELSE COALESCE(membership, 'free')
    END
    WHERE membership_tier IS NOT NULL;
    
    -- Then drop the old column
    ALTER TABLE profiles DROP COLUMN IF EXISTS membership_tier;
    RAISE NOTICE 'Dropped legacy column: membership_tier';
  END IF;
  
  -- Drop membership_expires_at if exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'membership_expires_at'
  ) THEN
    -- Migrate data
    UPDATE profiles
    SET membership_expiry = membership_expires_at
    WHERE membership_expires_at IS NOT NULL 
    AND membership_expiry IS NULL;
    
    -- Drop old column
    ALTER TABLE profiles DROP COLUMN IF EXISTS membership_expires_at;
    RAISE NOTICE 'Dropped legacy column: membership_expires_at';
  END IF;
  
  -- Drop membership_started_at (not used)
  ALTER TABLE profiles DROP COLUMN IF EXISTS membership_started_at;
END $$;

-- ========================================
-- STEP 2: Ensure NEW Columns Exist
-- ========================================

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS membership TEXT DEFAULT 'free';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS membership_status TEXT DEFAULT 'inactive';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS membership_expiry TIMESTAMPTZ;

-- Add constraints
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_membership_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_membership_check 
  CHECK (membership IN ('free', 'vip_basic', 'vip_premium'));

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_membership_status_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_membership_status_check 
  CHECK (membership_status IN ('active', 'inactive', 'expired', 'cancelled'));

-- ========================================
-- STEP 3: Create Trigger for Profile ID Sync
-- ========================================
-- This ensures profiles.id ALWAYS matches auth.users.id

-- Function to sync profile ID with auth.users ID
CREATE OR REPLACE FUNCTION sync_profile_id_with_auth()
RETURNS TRIGGER AS $$
BEGIN
  -- When a new user is created in auth.users, ensure profile uses same ID
  IF EXISTS (SELECT 1 FROM profiles WHERE email = NEW.email) THEN
    -- Update existing profile to use auth.users ID
    UPDATE profiles
    SET id = NEW.id
    WHERE email = NEW.email AND id != NEW.id;
    
    RAISE NOTICE 'Synced profile ID for email: %', NEW.email;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS sync_profile_on_user_create ON auth.users;

-- Create trigger on auth.users
CREATE TRIGGER sync_profile_on_user_create
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION sync_profile_id_with_auth();

-- ========================================
-- STEP 4: Fix Existing ID Mismatches
-- ========================================

-- Find and fix profiles with wrong IDs
DO $$
DECLARE
  profile_record RECORD;
  correct_auth_id UUID;
BEGIN
  FOR profile_record IN 
    SELECT p.id as profile_id, p.email, au.id as auth_id
    FROM profiles p
    JOIN auth.users au ON au.email = p.email
    WHERE p.id != au.id
  LOOP
    RAISE NOTICE 'Fixing ID mismatch for: % (profile: %, auth: %)', 
      profile_record.email, profile_record.profile_id, profile_record.auth_id;
    
    -- Check if target ID already exists
    IF EXISTS (SELECT 1 FROM profiles WHERE id = profile_record.auth_id) THEN
      -- Delete the duplicate profile (keep the one with correct ID)
      DELETE FROM profiles WHERE id = profile_record.profile_id;
      RAISE NOTICE 'Deleted duplicate profile with wrong ID: %', profile_record.profile_id;
    ELSE
      -- Safe to update ID
      UPDATE profiles
      SET id = profile_record.auth_id
      WHERE id = profile_record.profile_id;
      RAISE NOTICE 'Updated profile ID to match auth.users: %', profile_record.auth_id;
    END IF;
  END LOOP;
END $$;

-- ========================================
-- STEP 5: Create Helper Function for Admin
-- ========================================

-- Function to update membership (used by admin)
CREATE OR REPLACE FUNCTION admin_update_membership(
  user_email TEXT,
  new_membership TEXT,
  new_expiry TIMESTAMPTZ DEFAULT NULL
)
RETURNS TABLE (
  success BOOLEAN,
  message TEXT,
  profile_id UUID
) AS $$
DECLARE
  target_user_id UUID;
  target_profile RECORD;
BEGIN
  -- Get auth.users ID
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = user_email;
  
  IF target_user_id IS NULL THEN
    RETURN QUERY SELECT FALSE, 'User not found: ' || user_email, NULL::UUID;
    RETURN;
  END IF;
  
  -- Get profile
  SELECT * INTO target_profile
  FROM profiles
  WHERE id = target_user_id;
  
  IF target_profile IS NULL THEN
    RETURN QUERY SELECT FALSE, 'Profile not found for user: ' || user_email, target_user_id;
    RETURN;
  END IF;
  
  -- Calculate expiry based on membership type
  IF new_membership = 'vip_premium' THEN
    new_expiry := NULL; -- Lifetime
  ELSIF new_membership = 'vip_basic' AND new_expiry IS NULL THEN
    new_expiry := NOW() + INTERVAL '30 days'; -- Default 30 days
  ELSIF new_membership = 'free' THEN
    new_expiry := NULL;
  END IF;
  
  -- Update membership
  UPDATE profiles
  SET 
    membership = new_membership,
    membership_status = CASE 
      WHEN new_membership = 'free' THEN 'inactive'
      ELSE 'active'
    END,
    membership_expiry = new_expiry,
    updated_at = NOW()
  WHERE id = target_user_id;
  
  RETURN QUERY SELECT 
    TRUE, 
    'Membership updated to ' || new_membership || ' for ' || user_email,
    target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- STEP 6: Update RLS Policies
-- ========================================

-- Drop old policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Create comprehensive RLS policies
CREATE POLICY "users_select_own_profile"
ON profiles FOR SELECT
TO authenticated
USING (
  auth.uid() = id  -- User can see their own profile
  OR 
  EXISTS (  -- OR user is admin
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "users_update_own_profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "admins_all_access"
ON profiles FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ========================================
-- STEP 7: Verify All Users
-- ========================================

-- Check for any remaining issues
SELECT 
  'ID Mismatch Check' as check_type,
  COUNT(*) as count
FROM profiles p
JOIN auth.users au ON au.email = p.email
WHERE p.id != au.id

UNION ALL

SELECT 
  'Missing Auth Users' as check_type,
  COUNT(*) as count
FROM profiles p
LEFT JOIN auth.users au ON au.id = p.id
WHERE au.id IS NULL

UNION ALL

SELECT 
  'Legacy Column Check' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'profiles' 
      AND column_name IN ('membership_tier', 'membership_expires_at')
    ) THEN 1
    ELSE 0
  END as count;

-- ========================================
-- SUCCESS! 
-- ========================================

-- Show final summary
SELECT 
  email,
  membership,
  membership_status,
  membership_expiry,
  CASE 
    WHEN membership = 'vip_premium' THEN '✅ VIP Premium'
    WHEN membership = 'vip_basic' THEN '✅ VIP Basic'
    ELSE '⭕ Free User'
  END as status,
  id
FROM profiles
ORDER BY created_at DESC
LIMIT 10;

-- ========================================
-- Final Success Messages
-- ========================================
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ DATABASE MIGRATION COMPLETE!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Changes made:';
  RAISE NOTICE '1. ✅ Removed legacy columns (membership_tier, membership_expires_at)';
  RAISE NOTICE '2. ✅ Created trigger for ID sync';
  RAISE NOTICE '3. ✅ Fixed existing ID mismatches';
  RAISE NOTICE '4. ✅ Created admin helper function';
  RAISE NOTICE '5. ✅ Updated RLS policies';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Restart dev server (npm run dev)';
  RAISE NOTICE '2. Test user registration → approval → membership upgrade flow';
  RAISE NOTICE '3. Existing users must logout and login again';
END $$;
