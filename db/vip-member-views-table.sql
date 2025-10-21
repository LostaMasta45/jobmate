-- ============================================
-- VIP Member Views Table
-- Track loker views by members
-- ============================================

-- Create vip_member_views table
CREATE TABLE IF NOT EXISTS vip_member_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loker_id UUID NOT NULL REFERENCES vip_loker(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Indexes for performance
  CONSTRAINT vip_member_views_unique UNIQUE (loker_id, member_id, viewed_at)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_vip_member_views_loker_id ON vip_member_views(loker_id);
CREATE INDEX IF NOT EXISTS idx_vip_member_views_member_id ON vip_member_views(member_id);
CREATE INDEX IF NOT EXISTS idx_vip_member_views_viewed_at ON vip_member_views(viewed_at);

-- Enable RLS
ALTER TABLE vip_member_views ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Members can view their own views"
  ON vip_member_views
  FOR SELECT
  TO authenticated
  USING (member_id = auth.uid());

CREATE POLICY "Members can insert their own views"
  ON vip_member_views
  FOR INSERT
  TO authenticated
  WITH CHECK (member_id = auth.uid());

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

-- Function to log view (can be called from client)
CREATE OR REPLACE FUNCTION log_loker_view(p_loker_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert view record (ignore if duplicate within same day)
  INSERT INTO vip_member_views (loker_id, member_id, viewed_at)
  VALUES (p_loker_id, auth.uid(), now())
  ON CONFLICT (loker_id, member_id, viewed_at) DO NOTHING;
  
  -- Update view count on loker
  UPDATE vip_loker
  SET view_count = view_count + 1
  WHERE id = p_loker_id;
END;
$$;

COMMENT ON TABLE vip_member_views IS 'Track which loker viewed by which member';
COMMENT ON FUNCTION log_loker_view IS 'Log a loker view and increment view count';
