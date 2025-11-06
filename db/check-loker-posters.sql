-- ============================================
-- Check Loker Posters Status
-- ============================================
-- Run this in Supabase SQL Editor to verify posters
-- ============================================

-- Check how many loker have posters
SELECT 
  COUNT(*) as total_loker,
  COUNT(poster_url) as with_poster,
  COUNT(*) - COUNT(poster_url) as without_poster,
  ROUND(COUNT(poster_url)::numeric / COUNT(*)::numeric * 100, 2) as poster_percentage
FROM vip_loker
WHERE status = 'published';

-- Show recent loker with poster info
SELECT 
  id,
  title,
  perusahaan_name,
  lokasi,
  CASE 
    WHEN poster_url IS NOT NULL THEN '✅ Has Poster'
    ELSE '❌ No Poster'
  END as poster_status,
  LEFT(poster_url, 60) || '...' as poster_url_preview,
  created_at
FROM vip_loker
WHERE status = 'published'
ORDER BY created_at DESC
LIMIT 20;

-- Show loker WITHOUT posters (jika ada)
SELECT 
  id,
  title,
  perusahaan_name,
  lokasi,
  sumber,
  created_at
FROM vip_loker
WHERE status = 'published'
  AND poster_url IS NULL
ORDER BY created_at DESC
LIMIT 10;

-- Show loker WITH posters
SELECT 
  id,
  title,
  perusahaan_name,
  lokasi,
  poster_url,
  created_at
FROM vip_loker
WHERE status = 'published'
  AND poster_url IS NOT NULL
ORDER BY created_at DESC
LIMIT 10;
