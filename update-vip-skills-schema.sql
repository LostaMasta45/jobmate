-- Add skills column to vip_loker and profiles tables
-- This enables the Match Score feature by storing structured skill tags

-- 1. Add skills to vip_loker
ALTER TABLE vip_loker 
ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}';

-- 2. Add skills to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}';

-- 3. Create index for faster array intersection queries (GIN index)
CREATE INDEX IF NOT EXISTS idx_vip_loker_skills ON vip_loker USING GIN (skills);
CREATE INDEX IF NOT EXISTS idx_profiles_skills ON profiles USING GIN (skills);

-- 4. Enable RLS for these columns (should inherit from table, but good to check)
-- Policies typically cover "all columns", so no specific policy needed if SELECT * is allowed.
