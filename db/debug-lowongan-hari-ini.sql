-- ======================================
-- DEBUG: Lowongan Hari Ini
-- ======================================

-- 1. Check lowongan yang published hari ini
SELECT 
  id,
  title,
  perusahaan_name,
  lokasi,
  status,
  published_at,
  created_at,
  DATE(published_at) as publish_date,
  DATE(created_at) as create_date,
  DATE(NOW()) as today_date,
  -- Check if published today
  DATE(published_at) = DATE(NOW()) as is_published_today,
  -- Check if created today
  DATE(created_at) = DATE(NOW()) as is_created_today,
  view_count
FROM vip_loker
WHERE status = 'published'
  AND (
    DATE(published_at) = DATE(NOW()) 
    OR DATE(created_at) = DATE(NOW())
  )
ORDER BY created_at DESC;

-- 2. Check all published lowongan (untuk lihat apakah ada data)
SELECT 
  COUNT(*) as total_published,
  COUNT(CASE WHEN DATE(published_at) = DATE(NOW()) THEN 1 END) as published_today,
  COUNT(CASE WHEN DATE(created_at) = DATE(NOW()) THEN 1 END) as created_today
FROM vip_loker
WHERE status = 'published';

-- 3. Check top 20 lowongan by view_count (yang di-fetch dashboard)
SELECT 
  id,
  title,
  perusahaan_name,
  view_count,
  DATE(published_at) as publish_date,
  DATE(created_at) as create_date,
  DATE(NOW()) as today_date,
  DATE(published_at) = DATE(NOW()) as is_published_today
FROM vip_loker
WHERE status = 'published'
ORDER BY view_count DESC
LIMIT 20;

-- 4. Check timezone settings
SELECT 
  NOW() as server_now,
  CURRENT_DATE as server_date,
  CURRENT_TIMESTAMP as server_timestamp;

-- 5. List semua lowongan hari ini dengan detail lengkap
SELECT 
  id,
  title,
  perusahaan_name,
  lokasi,
  gaji_text,
  kategori,
  status,
  view_count,
  published_at,
  created_at,
  EXTRACT(HOUR FROM published_at) as publish_hour,
  EXTRACT(HOUR FROM created_at) as create_hour
FROM vip_loker
WHERE status = 'published'
  AND (
    DATE(published_at) = DATE(NOW()) 
    OR DATE(created_at) = DATE(NOW())
  )
ORDER BY 
  COALESCE(published_at, created_at) DESC;
