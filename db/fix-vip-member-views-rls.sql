-- ============================================
-- Fix VIP Member Views RLS Policies
-- Ensure users can insert and read their views
-- ============================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can insert their own views" ON vip_member_views;
DROP POLICY IF EXISTS "Users can view their own views" ON vip_member_views;
DROP POLICY IF EXISTS "Admin can view all views" ON vip_member_views;

-- Enable RLS
ALTER TABLE vip_member_views ENABLE ROW LEVEL SECURITY;

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

-- Verify policies
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'vip_member_views';

-- Test: Try to insert a view (should succeed)
-- Run this after fixing policies:
/*
INSERT INTO vip_member_views (loker_id, member_id, viewed_at)
VALUES (
  (SELECT id FROM vip_loker WHERE status = 'published' LIMIT 1),
  auth.uid(),
  now()
);
*/

-- Test: Check your own views (should return data)
/*
SELECT 
  v.*,
  l.title as loker_title
FROM vip_member_views v
JOIN vip_loker l ON l.id = v.loker_id
WHERE v.member_id = auth.uid()
ORDER BY v.viewed_at DESC
LIMIT 10;
*/
