-- =====================================================
-- CHECK VIP TABLES EXIST
-- =====================================================
-- Run this in Supabase SQL Editor

-- Check if tables exist
SELECT 
  schemaname, 
  tablename 
FROM pg_tables 
WHERE tablename IN ('vip_perusahaan', 'vip_loker', 'vip_member_bookmarks', 'vip_job_alerts')
ORDER BY tablename;

-- If tables exist, check columns for vip_perusahaan
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'vip_perusahaan'
ORDER BY ordinal_position;

-- Check columns for vip_loker
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'vip_loker'
ORDER BY ordinal_position;

-- Count existing data
SELECT 
  (SELECT COUNT(*) FROM vip_perusahaan) as perusahaan_count,
  (SELECT COUNT(*) FROM vip_loker) as loker_count;
