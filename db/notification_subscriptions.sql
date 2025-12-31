-- =====================================================
-- NOTIFICATION SUBSCRIPTIONS TABLE
-- Untuk menyimpan push notification subscriptions
-- =====================================================

-- Buat tabel
CREATE TABLE IF NOT EXISTS notification_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  device_info JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint: 1 user bisa punya multiple devices
  UNIQUE(user_id, endpoint)
);

-- Enable RLS
ALTER TABLE notification_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy: User hanya bisa manage subscription sendiri
CREATE POLICY "Users can insert own subscriptions" 
ON notification_subscriptions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own subscriptions" 
ON notification_subscriptions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own subscriptions" 
ON notification_subscriptions FOR DELETE 
USING (auth.uid() = user_id);

-- Admin bisa lihat semua (untuk send notifications)
CREATE POLICY "Admin can view all subscriptions" 
ON notification_subscriptions FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Index untuk performance
CREATE INDEX idx_notification_subs_user ON notification_subscriptions(user_id);

-- Trigger untuk update timestamp
CREATE OR REPLACE FUNCTION update_notification_sub_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_notification_subscriptions_timestamp
  BEFORE UPDATE ON notification_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_notification_sub_timestamp();
