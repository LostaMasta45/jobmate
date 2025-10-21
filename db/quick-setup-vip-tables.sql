-- =====================================================
-- QUICK SETUP VIP TABLES - Admin Loker Only
-- =====================================================
-- Run this in Supabase SQL Editor
-- Minimal setup untuk Admin VIP Loker features
-- =====================================================

-- 1. TABLE: vip_perusahaan (Companies)
-- =====================================================
CREATE TABLE IF NOT EXISTS vip_perusahaan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  logo_url TEXT,
  deskripsi TEXT,
  lokasi TEXT,
  website TEXT,
  email TEXT,
  whatsapp TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vip_perusahaan_slug ON vip_perusahaan(slug);
CREATE INDEX IF NOT EXISTS idx_vip_perusahaan_name ON vip_perusahaan(name);

-- 2. TABLE: vip_loker (Job Listings)
-- =====================================================
CREATE TABLE IF NOT EXISTS vip_loker (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  perusahaan_id UUID REFERENCES vip_perusahaan(id) ON DELETE SET NULL,
  perusahaan_name TEXT NOT NULL,
  lokasi TEXT NOT NULL,
  kategori TEXT[] DEFAULT '{}',
  tipe_kerja TEXT,
  gaji_min BIGINT,
  gaji_max BIGINT,
  gaji_text TEXT,
  deskripsi TEXT,
  persyaratan TEXT,
  kualifikasi TEXT[] DEFAULT '{}',
  deadline DATE,
  sumber TEXT DEFAULT 'Admin',
  poster_url TEXT,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'expired', 'archived')),
  kontak_wa TEXT,
  kontak_email TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vip_loker_status ON vip_loker(status);
CREATE INDEX IF NOT EXISTS idx_vip_loker_kategori ON vip_loker USING GIN(kategori);
CREATE INDEX IF NOT EXISTS idx_vip_loker_lokasi ON vip_loker(lokasi);
CREATE INDEX IF NOT EXISTS idx_vip_loker_perusahaan ON vip_loker(perusahaan_id);

-- 3. RLS POLICIES
-- =====================================================
ALTER TABLE vip_perusahaan ENABLE ROW LEVEL SECURITY;
ALTER TABLE vip_loker ENABLE ROW LEVEL SECURITY;

-- Admin full access to vip_perusahaan
DROP POLICY IF EXISTS "Admin full access to vip_perusahaan" ON vip_perusahaan;
CREATE POLICY "Admin full access to vip_perusahaan"
ON vip_perusahaan FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Admin full access to vip_loker
DROP POLICY IF EXISTS "Admin full access to vip_loker" ON vip_loker;
CREATE POLICY "Admin full access to vip_loker"
ON vip_loker FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Public can view published loker (for VIP members later)
DROP POLICY IF EXISTS "Public can view published loker" ON vip_loker;
CREATE POLICY "Public can view published loker"
ON vip_loker FOR SELECT
TO authenticated
USING (status = 'published');

-- =====================================================
-- VERIFY SETUP
-- =====================================================
SELECT 
  'vip_perusahaan' as table_name,
  COUNT(*) as row_count
FROM vip_perusahaan
UNION ALL
SELECT 
  'vip_loker' as table_name,
  COUNT(*) as row_count
FROM vip_loker;

-- Expected: Both tables exist with 0 rows
