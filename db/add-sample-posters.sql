-- ============================================
-- Add Sample Posters to VIP Loker
-- ============================================
-- Run this in Supabase SQL Editor to add sample posters
-- Uses Unsplash images for demonstration
-- ============================================

-- Update IT/Tech jobs with tech-related posters
UPDATE vip_loker
SET poster_url = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80'
WHERE 'IT' = ANY(kategori) 
  AND poster_url IS NULL
  AND status = 'published'
LIMIT 5;

-- Update Marketing jobs with marketing-related posters
UPDATE vip_loker
SET poster_url = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=80'
WHERE 'Marketing' = ANY(kategori)
  AND poster_url IS NULL
  AND status = 'published'
LIMIT 3;

-- Update Sales jobs with business posters
UPDATE vip_loker
SET poster_url = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80'
WHERE 'Sales' = ANY(kategori)
  AND poster_url IS NULL
  AND status = 'published'
LIMIT 3;

-- Update F&B jobs with restaurant/cafe posters
UPDATE vip_loker
SET poster_url = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80'
WHERE 'F&B' = ANY(kategori)
  AND poster_url IS NULL
  AND status = 'published'
LIMIT 3;

-- Update Retail jobs with retail store posters
UPDATE vip_loker
SET poster_url = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80'
WHERE 'Retail' = ANY(kategori)
  AND poster_url IS NULL
  AND status = 'published'
LIMIT 3;

-- Update Administrasi jobs with office posters
UPDATE vip_loker
SET poster_url = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80'
WHERE 'Administrasi' = ANY(kategori)
  AND poster_url IS NULL
  AND status = 'published'
LIMIT 3;

-- Update Design jobs with creative posters
UPDATE vip_loker
SET poster_url = 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80'
WHERE kategori && ARRAY['Design', 'Content Creator', 'Creative']
  AND poster_url IS NULL
  AND status = 'published'
LIMIT 3;

-- Update remaining jobs with generic office/work poster
UPDATE vip_loker
SET poster_url = 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=80'
WHERE poster_url IS NULL
  AND status = 'published'
LIMIT 5;

-- ============================================
-- Verify Results
-- ============================================
SELECT 
  COUNT(*) as total_jobs,
  COUNT(poster_url) as jobs_with_poster,
  COUNT(*) - COUNT(poster_url) as jobs_without_poster
FROM vip_loker
WHERE status = 'published';

-- Show sample of jobs with posters
SELECT 
  id,
  title,
  perusahaan_name,
  kategori,
  LEFT(poster_url, 50) || '...' as poster_url_preview
FROM vip_loker
WHERE poster_url IS NOT NULL
  AND status = 'published'
LIMIT 10;
