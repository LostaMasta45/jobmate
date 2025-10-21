-- ============================================
-- CREATE VIP_MEMBER_VIEWS TABLE
-- This table tracks which loker a member has viewed
-- ============================================

-- 1. Create the table
CREATE TABLE IF NOT EXISTS vip_member_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loker_id UUID NOT NULL REFERENCES vip_loker(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT now(),
  
  -- Create unique constraint to prevent exact duplicates
  CONSTRAINT vip_member_views_unique UNIQUE (loker_id, member_id, viewed_at)
);

-- 2. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_vip_member_views_loker_id ON vip_member_views(loker_id);
CREATE INDEX IF NOT EXISTS idx_vip_member_views_member_id ON vip_member_views(member_id);
CREATE INDEX IF NOT EXISTS idx_vip_member_views_viewed_at ON vip_member_views(viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_vip_member_views_member_date ON vip_member_views(member_id, viewed_at DESC);

-- 3. Enable RLS
ALTER TABLE vip_member_views ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies if any
DROP POLICY IF EXISTS "Users can insert their own views" ON vip_member_views;
DROP POLICY IF EXISTS "Users can view their own views" ON vip_member_views;
DROP POLICY IF EXISTS "Admin can view all views" ON vip_member_views;

-- 5. Create RLS Policies

-- Policy: Users can INSERT their own views
CREATE POLICY "Users can insert their own views"
  ON vip_member_views
  FOR INSERT
  TO authenticated
  WITH CHECK (member_id = auth.uid());

-- Policy: Users can SELECT their own views
CREATE POLICY "Users can view their own views"
  ON vip_member_views
  FOR SELECT
  TO authenticated
  USING (member_id = auth.uid());

-- Policy: Admin can view all views
CREATE POLICY "Admin can view all views"
  ON vip_member_views
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 6. Create helper function (optional but useful)
CREATE OR REPLACE FUNCTION track_loker_view(p_loker_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert view record (ignore if already exists today)
  INSERT INTO vip_member_views (loker_id, member_id, viewed_at)
  VALUES (p_loker_id, auth.uid(), now())
  ON CONFLICT (loker_id, member_id, viewed_at) DO NOTHING;
  
  -- Optionally increment view_count on vip_loker table
  UPDATE vip_loker
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = p_loker_id;
END;
$$;

-- 7. Grant permissions
GRANT ALL ON vip_member_views TO authenticated;
GRANT EXECUTE ON FUNCTION track_loker_view TO authenticated;

-- ============================================
-- VERIFICATION QUERIES
-- Run these to verify everything is set up correctly
-- ============================================

-- Check table exists
SELECT 
  tablename,
  schemaname
FROM pg_tables 
WHERE tablename = 'vip_member_views';

-- Check indexes
SELECT 
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename = 'vip_member_views';

-- Check RLS is enabled
SELECT 
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'vip_member_views';

-- Check policies
SELECT 
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'vip_member_views';

-- ============================================
-- TEST QUERIES
-- Run these to test if everything works
-- ============================================

-- Test 1: Insert a view (should succeed)
INSERT INTO vip_member_views (loker_id, member_id, viewed_at)
VALUES (
  (SELECT id FROM vip_loker WHERE status = 'published' LIMIT 1),
  auth.uid(),
  now()
);

-- Test 2: Select your views (should return data)
SELECT 
  v.*,
  l.title as loker_title,
  l.perusahaan_name
FROM vip_member_views v
JOIN vip_loker l ON l.id = v.loker_id
WHERE v.member_id = auth.uid()
ORDER BY v.viewed_at DESC
LIMIT 10;

-- Test 3: Count unique views in last 7 days
SELECT 
  COUNT(DISTINCT loker_id) as unique_views,
  COUNT(*) as total_views
FROM vip_member_views
WHERE member_id = auth.uid()
AND viewed_at >= now() - interval '7 days';

-- Test 4: Use helper function
SELECT track_loker_view(
  (SELECT id FROM vip_loker WHERE status = 'published' LIMIT 1)
);

-- ============================================
-- CLEANUP (if you need to start fresh)
-- ============================================

-- Uncomment these lines only if you want to delete all data and start over:

-- DELETE FROM vip_member_views WHERE member_id = auth.uid();
-- DROP TABLE IF EXISTS vip_member_views CASCADE;
-- DROP FUNCTION IF EXISTS track_loker_view;

-- ============================================
-- MIGRATION FROM OLD TABLE (if exists)
-- ============================================

-- If you have data in vip_loker_views, migrate it:
/*
INSERT INTO vip_member_views (loker_id, member_id, viewed_at)
SELECT 
  loker_id,
  member_id,
  viewed_at
FROM vip_loker_views
ON CONFLICT (loker_id, member_id, viewed_at) DO NOTHING;

-- After migration, you can drop old table:
-- DROP TABLE IF EXISTS vip_loker_views;
*/

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ vip_member_views table created successfully!';
  RAISE NOTICE '✅ Indexes created';
  RAISE NOTICE '✅ RLS policies configured';
  RAISE NOTICE '✅ Helper function created';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Next steps:';
  RAISE NOTICE '1. Run verification queries above';
  RAISE NOTICE '2. Run test queries to confirm it works';
  RAISE NOTICE '3. Restart your Next.js dev server';
  RAISE NOTICE '4. Test view tracking in the app';
END $$;
