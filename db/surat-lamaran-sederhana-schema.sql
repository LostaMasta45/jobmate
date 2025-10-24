-- =====================================================
-- Surat Lamaran Sederhana - Database Schema
-- =====================================================

-- Create surat_lamaran_sederhana table
CREATE TABLE IF NOT EXISTS public.surat_lamaran_sederhana (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Biodata
  nama_lengkap TEXT NOT NULL,
  tempat_lahir TEXT,
  tanggal_lahir DATE,
  jenis_kelamin TEXT,
  status_pernikahan TEXT,
  pendidikan TEXT,
  no_handphone TEXT,
  email TEXT,
  alamat_kota TEXT,
  alamat_lengkap TEXT,
  
  -- Data Perusahaan
  kepada_yth TEXT NOT NULL,
  nama_perusahaan TEXT NOT NULL,
  kota_perusahaan TEXT,
  jenis_instansi TEXT,
  posisi_lowongan TEXT NOT NULL,
  sumber_lowongan TEXT,
  tanggal_lamaran DATE,
  lampiran TEXT[], -- array of attachments
  
  -- Template
  template_id TEXT NOT NULL,
  template_name TEXT,
  
  -- Generated Content
  generated_content TEXT NOT NULL,
  
  -- Metadata
  status TEXT DEFAULT 'draft', -- draft, final
  word_count INTEGER DEFAULT 0,
  char_count INTEGER DEFAULT 0,
  times_downloaded INTEGER DEFAULT 0,
  last_downloaded_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_surat_lamaran_sederhana_user_id 
  ON public.surat_lamaran_sederhana(user_id);
CREATE INDEX IF NOT EXISTS idx_surat_lamaran_sederhana_created_at 
  ON public.surat_lamaran_sederhana(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_surat_lamaran_sederhana_perusahaan 
  ON public.surat_lamaran_sederhana(nama_perusahaan);

-- Enable RLS
ALTER TABLE public.surat_lamaran_sederhana ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own surat lamaran" ON public.surat_lamaran_sederhana;
DROP POLICY IF EXISTS "Users can insert own surat lamaran" ON public.surat_lamaran_sederhana;
DROP POLICY IF EXISTS "Users can update own surat lamaran" ON public.surat_lamaran_sederhana;
DROP POLICY IF EXISTS "Users can delete own surat lamaran" ON public.surat_lamaran_sederhana;
DROP POLICY IF EXISTS "Admin can view all surat lamaran" ON public.surat_lamaran_sederhana;

-- RLS Policies

-- Users can view their own surat lamaran
CREATE POLICY "Users can view own surat lamaran"
ON public.surat_lamaran_sederhana
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Users can insert their own surat lamaran
CREATE POLICY "Users can insert own surat lamaran"
ON public.surat_lamaran_sederhana
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Users can update their own surat lamaran
CREATE POLICY "Users can update own surat lamaran"
ON public.surat_lamaran_sederhana
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete their own surat lamaran
CREATE POLICY "Users can delete own surat lamaran"
ON public.surat_lamaran_sederhana
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Admin can view all surat lamaran
CREATE POLICY "Admin can view all surat lamaran"
ON public.surat_lamaran_sederhana
FOR SELECT
TO authenticated
USING (
  (auth.jwt() ->> 'role')::text = 'admin'
  OR user_id = auth.uid()
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_surat_lamaran_sederhana_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_surat_lamaran_sederhana_updated_at_trigger 
  ON public.surat_lamaran_sederhana;
  
CREATE TRIGGER update_surat_lamaran_sederhana_updated_at_trigger
BEFORE UPDATE ON public.surat_lamaran_sederhana
FOR EACH ROW
EXECUTE FUNCTION update_surat_lamaran_sederhana_updated_at();

-- Verify
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE tablename = 'surat_lamaran_sederhana'
ORDER BY policyname;
