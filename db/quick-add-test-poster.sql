-- ============================================
-- Quick Add Test Poster untuk VIP Loker
-- ============================================
-- Run this in Supabase SQL Editor
-- Adds a test job with poster for immediate testing
-- ============================================

-- Add test job dengan poster
INSERT INTO vip_loker (
  title,
  perusahaan_name,
  lokasi,
  kategori,
  tipe_kerja,
  gaji_text,
  gaji_min,
  gaji_max,
  deskripsi,
  persyaratan,
  kualifikasi,
  poster_url,
  status,
  is_featured,
  published_at,
  created_at
) VALUES (
  'Frontend Developer - React & Next.js',
  'PT Teknologi Nusantara',
  'Jombang Kota',
  ARRAY['IT', 'Web Development', 'Technology'],
  'Full-time',
  'Rp 5-7 juta',
  5000000,
  7000000,
  'Kami mencari Frontend Developer berpengalaman untuk bergabung dengan tim development kami. Bertanggung jawab untuk membangun dan maintain aplikasi web modern menggunakan React dan Next.js.',
  'Minimal S1 Teknik Informatika atau setara. Berpengalaman min 1-2 tahun dalam web development. Menguasai React, Next.js, TypeScript, dan TailwindCSS.',
  ARRAY[
    'S1 Teknik Informatika / Sistem Informasi',
    'Pengalaman 1-2 tahun React & Next.js',
    'Menguasai TypeScript',
    'Familiar dengan TailwindCSS',
    'Memahami Git & GitHub',
    'Mampu bekerja dalam tim'
  ],
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80',
  'published',
  true,
  NOW(),
  NOW()
),
(
  'Marketing Manager - Digital Marketing',
  'PT Kreatif Sejahtera',
  'Jombang Kota',
  ARRAY['Marketing', 'Content Creator', 'Creative'],
  'Full-time',
  'Rp 6-9 juta',
  6000000,
  9000000,
  'Bertanggung jawab untuk strategi marketing digital, social media management, dan content creation untuk meningkatkan brand awareness dan sales.',
  'S1 Marketing/Komunikasi. Pengalaman 2-3 tahun di digital marketing. Kreatif, inovatif, dan up-to-date dengan trend digital.',
  ARRAY[
    'S1 Marketing / Komunikasi',
    'Pengalaman 2-3 tahun digital marketing',
    'Menguasai social media marketing',
    'Kreatif dalam content creation',
    'Mampu analisis data & reporting',
    'Excellent communication skills'
  ],
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=80',
  'published',
  true,
  NOW(),
  NOW()
),
(
  'UI/UX Designer - Mobile & Web',
  'PT Digital Creative Studio',
  'Jombang Kota',
  ARRAY['Design', 'Creative', 'IT'],
  'Full-time',
  'Rp 4.5-6.5 juta',
  4500000,
  6500000,
  'Mencari UI/UX Designer untuk merancang user interface dan user experience yang menarik dan user-friendly untuk aplikasi mobile dan web.',
  'Portfolio wajib. Menguasai Figma/Adobe XD. Paham design system, user research, dan prototyping.',
  ARRAY[
    'Portfolio design yang kuat',
    'Menguasai Figma / Adobe XD',
    'Paham UI/UX principles',
    'Design thinking & user research',
    'Dapat berkolaborasi dengan developer',
    'Up-to-date dengan design trends'
  ],
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80',
  'published',
  false,
  NOW(),
  NOW()
);

-- Verify results
SELECT 
  id,
  title,
  perusahaan_name,
  lokasi,
  CASE 
    WHEN poster_url IS NOT NULL THEN '✅ Has Poster'
    ELSE '❌ No Poster'
  END as status,
  LEFT(poster_url, 50) || '...' as poster_preview
FROM vip_loker
WHERE title LIKE '%Frontend Developer%' 
   OR title LIKE '%Marketing Manager%'
   OR title LIKE '%UI/UX Designer%'
ORDER BY created_at DESC;

-- Summary
SELECT 
  COUNT(*) as total_inserted,
  COUNT(poster_url) as with_poster
FROM vip_loker
WHERE created_at > NOW() - INTERVAL '1 minute';
