-- =====================================================
-- Setup Profiles Table for Settings Page
-- =====================================================
-- Run this in Supabase SQL Editor
-- This adds all necessary columns for the settings page

-- Add missing columns to profiles table if they don't exist
DO $$
BEGIN
  -- Profile basic info
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name='profiles' AND column_name='full_name') THEN
    ALTER TABLE profiles ADD COLUMN full_name TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name='profiles' AND column_name='username') THEN
    ALTER TABLE profiles ADD COLUMN username TEXT UNIQUE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name='profiles' AND column_name='avatar_url') THEN
    ALTER TABLE profiles ADD COLUMN avatar_url TEXT;
  END IF;

  -- Contact info
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name='profiles' AND column_name='phone') THEN
    ALTER TABLE profiles ADD COLUMN phone TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name='profiles' AND column_name='whatsapp') THEN
    ALTER TABLE profiles ADD COLUMN whatsapp TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name='profiles' AND column_name='website') THEN
    ALTER TABLE profiles ADD COLUMN website TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name='profiles' AND column_name='linkedin') THEN
    ALTER TABLE profiles ADD COLUMN linkedin TEXT;
  END IF;

  -- Preferences
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name='profiles' AND column_name='locale') THEN
    ALTER TABLE profiles ADD COLUMN locale TEXT DEFAULT 'id';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name='profiles' AND column_name='timezone') THEN
    ALTER TABLE profiles ADD COLUMN timezone TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name='profiles' AND column_name='notify_email') THEN
    ALTER TABLE profiles ADD COLUMN notify_email BOOLEAN DEFAULT TRUE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name='profiles' AND column_name='notify_telegram') THEN
    ALTER TABLE profiles ADD COLUMN notify_telegram BOOLEAN DEFAULT FALSE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name='profiles' AND column_name='telegram_chat_id') THEN
    ALTER TABLE profiles ADD COLUMN telegram_chat_id TEXT;
  END IF;

  -- Optional for future use
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name='profiles' AND column_name='default_resume_id') THEN
    ALTER TABLE profiles ADD COLUMN default_resume_id UUID;
  END IF;

  -- Timestamps
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name='profiles' AND column_name='created_at') THEN
    ALTER TABLE profiles ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name='profiles' AND column_name='updated_at') THEN
    ALTER TABLE profiles ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;

END $$;

-- Create index on username for faster lookup
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- Verify columns
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'profiles'
ORDER BY ordinal_position;
