-- ============================================
-- VIP CAREER JOMBANG - DATABASE SCHEMA
-- ============================================
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. EXTEND PROFILES TABLE untuk Membership System
-- ============================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS membership_tier TEXT CHECK (membership_tier IN ('basic', 'premium'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS membership_status TEXT DEFAULT 'inactive' CHECK (membership_status IN ('active', 'inactive', 'expired', 'cancelled'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS membership_started_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS membership_expires_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS wa_number TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS wa_invite_sent BOOLEAN DEFAULT false;

-- Indexes untuk performa
CREATE INDEX IF NOT EXISTS idx_profiles_membership_tier ON profiles(membership_tier);
CREATE INDEX IF NOT EXISTS idx_profiles_membership_status ON profiles(membership_status);
CREATE INDEX IF NOT EXISTS idx_profiles_membership_expires ON profiles(membership_expires_at);

-- 2. TABLE: vip_perusahaan (Companies)
-- ============================================
CREATE TABLE IF NOT EXISTS vip_perusahaan (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  logo_url TEXT,
  deskripsi TEXT,
  lokasi TEXT,
  website TEXT,
  email TEXT,
  whatsapp TEXT,
  instagram TEXT,
  industri TEXT,
  ukuran TEXT, -- Startup, UMKM, Menengah, Besar
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vip_perusahaan_slug ON vip_perusahaan(slug);
CREATE INDEX IF NOT EXISTS idx_vip_perusahaan_name ON vip_perusahaan(name);
CREATE INDEX IF NOT EXISTS idx_vip_perusahaan_lokasi ON vip_perusahaan(lokasi);

-- 3. TABLE: vip_loker (Job Listings)
-- ============================================
CREATE TABLE IF NOT EXISTS vip_loker (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  perusahaan_id UUID REFERENCES vip_perusahaan(id) ON DELETE SET NULL,
  perusahaan_name TEXT NOT NULL,
  lokasi TEXT NOT NULL,
  kategori TEXT[] DEFAULT '{}',
  tipe_kerja TEXT, -- Full-time, Part-time, Contract, Freelance, Remote
  gaji_min BIGINT,
  gaji_max BIGINT,
  gaji_text TEXT, -- "Rp 5-7 juta" atau "Nego"
  deskripsi TEXT,
  persyaratan TEXT,
  kualifikasi TEXT[] DEFAULT '{}',
  deadline DATE,
  sumber TEXT, -- WA, IG, Poster
  poster_url TEXT,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'expired', 'archived')),
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  apply_count INTEGER DEFAULT 0,
  kontak_wa TEXT,
  kontak_email TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes untuk performa search & filter
CREATE INDEX IF NOT EXISTS idx_vip_loker_status ON vip_loker(status);
CREATE INDEX IF NOT EXISTS idx_vip_loker_kategori ON vip_loker USING GIN(kategori);
CREATE INDEX IF NOT EXISTS idx_vip_loker_lokasi ON vip_loker(lokasi);
CREATE INDEX IF NOT EXISTS idx_vip_loker_deadline ON vip_loker(deadline);
CREATE INDEX IF NOT EXISTS idx_vip_loker_published_at ON vip_loker(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_vip_loker_perusahaan ON vip_loker(perusahaan_id);
CREATE INDEX IF NOT EXISTS idx_vip_loker_title_search ON vip_loker USING gin(to_tsvector('indonesian', title));

-- 4. TABLE: vip_member_bookmarks (Saved Jobs)
-- ============================================
CREATE TABLE IF NOT EXISTS vip_member_bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  loker_id UUID REFERENCES vip_loker(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(member_id, loker_id)
);

CREATE INDEX IF NOT EXISTS idx_vip_bookmarks_member ON vip_member_bookmarks(member_id);
CREATE INDEX IF NOT EXISTS idx_vip_bookmarks_loker ON vip_member_bookmarks(loker_id);
CREATE INDEX IF NOT EXISTS idx_vip_bookmarks_created ON vip_member_bookmarks(created_at DESC);

-- 5. TABLE: vip_job_alerts (Job Alert Settings)
-- ============================================
CREATE TABLE IF NOT EXISTS vip_job_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nama_alert TEXT NOT NULL,
  kategori TEXT[] DEFAULT '{}',
  lokasi TEXT[] DEFAULT '{}',
  tipe_kerja TEXT[] DEFAULT '{}',
  gaji_min BIGINT,
  is_active BOOLEAN DEFAULT true,
  notif_email BOOLEAN DEFAULT true,
  notif_browser BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vip_alerts_member ON vip_job_alerts(member_id);
CREATE INDEX IF NOT EXISTS idx_vip_alerts_active ON vip_job_alerts(is_active);

-- 6. TABLE: vip_loker_views (View Tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS vip_loker_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loker_id UUID REFERENCES vip_loker(id) ON DELETE CASCADE NOT NULL,
  member_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vip_views_loker ON vip_loker_views(loker_id);
CREATE INDEX IF NOT EXISTS idx_vip_views_member ON vip_loker_views(member_id);
CREATE INDEX IF NOT EXISTS idx_vip_views_date ON vip_loker_views(viewed_at DESC);

-- 7. TABLE: vip_loker_applications (Apply Tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS vip_loker_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loker_id UUID REFERENCES vip_loker(id) ON DELETE CASCADE NOT NULL,
  member_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  method TEXT CHECK (method IN ('whatsapp', 'email')),
  applied_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vip_applications_loker ON vip_loker_applications(loker_id);
CREATE INDEX IF NOT EXISTS idx_vip_applications_member ON vip_loker_applications(member_id);
CREATE INDEX IF NOT EXISTS idx_vip_applications_date ON vip_loker_applications(applied_at DESC);

-- 8. TABLE: orders (Payment Orders)
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_id TEXT NOT NULL CHECK (plan_id IN ('basic', 'premium')),
  amount BIGINT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'expired', 'refunded')),
  payment_method TEXT,
  provider_order_id TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);

-- 9. TABLE: vip_wa_invitations (WhatsApp Group Invites Tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS vip_wa_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  wa_number TEXT NOT NULL,
  invite_link TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'joined', 'failed')),
  sent_at TIMESTAMPTZ,
  joined_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_wa_invitations_status ON vip_wa_invitations(status);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all VIP tables
ALTER TABLE vip_perusahaan ENABLE ROW LEVEL SECURITY;
ALTER TABLE vip_loker ENABLE ROW LEVEL SECURITY;
ALTER TABLE vip_member_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE vip_job_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE vip_loker_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE vip_loker_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE vip_wa_invitations ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICIES: vip_perusahaan
-- ============================================

-- Drop existing policies first
DROP POLICY IF EXISTS "Public can read perusahaan" ON vip_perusahaan;
DROP POLICY IF EXISTS "Admin can manage perusahaan" ON vip_perusahaan;

-- Public can read all perusahaan
CREATE POLICY "Public can read perusahaan"
  ON vip_perusahaan FOR SELECT
  USING (true);

-- Admin can manage perusahaan
CREATE POLICY "Admin can manage perusahaan"
  ON vip_perusahaan FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ============================================
-- POLICIES: vip_loker
-- ============================================

-- Drop existing policies first
DROP POLICY IF EXISTS "Public can read published loker" ON vip_loker;
DROP POLICY IF EXISTS "Admin can manage loker" ON vip_loker;
DROP POLICY IF EXISTS "Users can insert views" ON vip_loker_views;
DROP POLICY IF EXISTS "Users can insert applications" ON vip_loker_applications;

-- Public can read published loker
CREATE POLICY "Public can read published loker"
  ON vip_loker FOR SELECT
  USING (status = 'published');

-- Admin can manage all loker
CREATE POLICY "Admin can manage loker"
  ON vip_loker FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Track views (authenticated users only)
CREATE POLICY "Users can insert views"
  ON vip_loker_views FOR INSERT
  WITH CHECK (auth.uid() = member_id);

-- Track applications (authenticated users only)
CREATE POLICY "Users can insert applications"
  ON vip_loker_applications FOR INSERT
  WITH CHECK (auth.uid() = member_id);

-- ============================================
-- POLICIES: vip_member_bookmarks
-- ============================================

-- Drop existing policies first
DROP POLICY IF EXISTS "Members can read own bookmarks" ON vip_member_bookmarks;
DROP POLICY IF EXISTS "Members can create own bookmarks" ON vip_member_bookmarks;
DROP POLICY IF EXISTS "Members can delete own bookmarks" ON vip_member_bookmarks;

-- Members can read their own bookmarks
CREATE POLICY "Members can read own bookmarks"
  ON vip_member_bookmarks FOR SELECT
  USING (member_id = auth.uid());

-- Members can create their own bookmarks
CREATE POLICY "Members can create own bookmarks"
  ON vip_member_bookmarks FOR INSERT
  WITH CHECK (member_id = auth.uid());

-- Members can delete their own bookmarks
CREATE POLICY "Members can delete own bookmarks"
  ON vip_member_bookmarks FOR DELETE
  USING (member_id = auth.uid());

-- ============================================
-- POLICIES: vip_job_alerts
-- ============================================

-- Drop existing policies first
DROP POLICY IF EXISTS "Members can manage own alerts" ON vip_job_alerts;

-- Members can manage their own job alerts
CREATE POLICY "Members can manage own alerts"
  ON vip_job_alerts FOR ALL
  USING (member_id = auth.uid())
  WITH CHECK (member_id = auth.uid());

-- ============================================
-- POLICIES: orders
-- ============================================

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can read own orders" ON orders;
DROP POLICY IF EXISTS "Admin can read all orders" ON orders;
DROP POLICY IF EXISTS "System can insert orders" ON orders;
DROP POLICY IF EXISTS "System can update orders" ON orders;

-- Users can read their own orders
CREATE POLICY "Users can read own orders"
  ON orders FOR SELECT
  USING (user_id = auth.uid());

-- Admin can read all orders
CREATE POLICY "Admin can read all orders"
  ON orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- System can insert orders (via API)
CREATE POLICY "System can insert orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- System can update orders (via webhook)
CREATE POLICY "System can update orders"
  ON orders FOR UPDATE
  USING (true);

-- ============================================
-- POLICIES: vip_wa_invitations
-- ============================================

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can read own invitations" ON vip_wa_invitations;
DROP POLICY IF EXISTS "Admin can manage invitations" ON vip_wa_invitations;

-- Users can read their own invitations
CREATE POLICY "Users can read own invitations"
  ON vip_wa_invitations FOR SELECT
  USING (user_id = auth.uid());

-- Admin can manage all invitations
CREATE POLICY "Admin can manage invitations"
  ON vip_wa_invitations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_vip_perusahaan_updated_at ON vip_perusahaan;
CREATE TRIGGER update_vip_perusahaan_updated_at
  BEFORE UPDATE ON vip_perusahaan
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_vip_loker_updated_at ON vip_loker;
CREATE TRIGGER update_vip_loker_updated_at
  BEFORE UPDATE ON vip_loker
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_vip_job_alerts_updated_at ON vip_job_alerts;
CREATE TRIGGER update_vip_job_alerts_updated_at
  BEFORE UPDATE ON vip_job_alerts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function: Increment view count
CREATE OR REPLACE FUNCTION increment_loker_view_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE vip_loker
  SET view_count = view_count + 1
  WHERE id = NEW.loker_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS increment_view_count ON vip_loker_views;
CREATE TRIGGER increment_view_count
  AFTER INSERT ON vip_loker_views
  FOR EACH ROW
  EXECUTE FUNCTION increment_loker_view_count();

-- Function: Increment apply count
CREATE OR REPLACE FUNCTION increment_loker_apply_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE vip_loker
  SET apply_count = apply_count + 1
  WHERE id = NEW.loker_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS increment_apply_count ON vip_loker_applications;
CREATE TRIGGER increment_apply_count
  AFTER INSERT ON vip_loker_applications
  FOR EACH ROW
  EXECUTE FUNCTION increment_loker_apply_count();

-- ============================================
-- SEED DATA (Optional - for testing)
-- ============================================

-- Insert demo perusahaan
INSERT INTO vip_perusahaan (slug, name, lokasi, industri, ukuran) VALUES
  ('pt-tech-jombang', 'PT Tech Jombang', 'Jombang Kota', 'Technology', 'Menengah'),
  ('cv-maju-bersama', 'CV Maju Bersama', 'Mojoagung', 'Manufacturing', 'UMKM'),
  ('pt-karya-sentosa', 'PT Karya Sentosa', 'Jombang Kota', 'Retail', 'Besar')
ON CONFLICT (slug) DO NOTHING;

-- Insert demo loker
INSERT INTO vip_loker (title, perusahaan_name, lokasi, kategori, tipe_kerja, gaji_text, deskripsi, status, sumber) VALUES
  (
    'Frontend Developer',
    'PT Tech Jombang',
    'Jombang Kota',
    ARRAY['IT', 'Web Development'],
    'Full-time',
    'Rp 5.000.000 - Rp 7.000.000',
    'Mencari Frontend Developer berpengalaman dengan React.js dan Next.js',
    'published',
    'WA'
  ),
  (
    'Marketing Staff',
    'CV Maju Bersama',
    'Mojoagung',
    ARRAY['Marketing', 'Sales'],
    'Full-time',
    'Rp 3.500.000 - Rp 5.000.000',
    'Dibutuhkan Marketing Staff untuk promosi produk',
    'published',
    'IG'
  ),
  (
    'Admin Gudang',
    'PT Karya Sentosa',
    'Jombang Kota',
    ARRAY['Administrasi', 'Logistik'],
    'Full-time',
    'Rp 3.000.000 - Rp 4.000.000',
    'Mencari Admin Gudang yang teliti dan bertanggung jawab',
    'published',
    'Poster'
  )
ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if tables created successfully
SELECT 
  tablename, 
  schemaname 
FROM pg_tables 
WHERE tablename LIKE 'vip_%' OR tablename = 'orders';

-- Check profiles table columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name LIKE 'membership%';

-- Count demo data
SELECT 
  (SELECT COUNT(*) FROM vip_perusahaan) as total_perusahaan,
  (SELECT COUNT(*) FROM vip_loker) as total_loker;
