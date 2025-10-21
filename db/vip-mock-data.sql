-- ============================================
-- VIP CAREER - MOCK DATA untuk Testing
-- ============================================
-- Run SETELAH vip-schema-complete.sql
-- ============================================

-- 1. INSERT PERUSAHAAN (10 companies)
-- ============================================
INSERT INTO vip_perusahaan (slug, name, logo_url, deskripsi, lokasi, website, email, whatsapp, instagram, industri, ukuran) VALUES
('pt-maju-jaya', 'PT Maju Jaya Elektronik', NULL, 'Perusahaan elektronik terkemuka di Jombang', 'Jombang Kota', 'https://majujaya.com', 'hrd@majujaya.com', '081234567890', '@majujaya', 'Manufacturing', 'Menengah'),
('cv-sukses-mandiri', 'CV Sukses Mandiri', NULL, 'UMKM bergerak di bidang fashion dan konveksi', 'Mojowarno', NULL, 'info@suksesmandiri.com', '082345678901', '@suksesmandiri', 'Fashion', 'UMKM'),
('toko-berkah', 'Toko Berkah Furniture', NULL, 'Toko furniture terlengkap di Jombang', 'Ploso', NULL, 'tokoberkah@gmail.com', '083456789012', NULL, 'Retail', 'UMKM'),
('restoran-nusantara', 'Restoran Nusantara', NULL, 'Restoran masakan Indonesia dengan 3 cabang', 'Jombang Kota', NULL, 'hrd.nusantara@gmail.com', '084567890123', '@resto_nusantara', 'F&B', 'UMKM'),
('pt-indah-karya', 'PT Indah Karya Sejahtera', NULL, 'Perusahaan konstruksi dan developer properti', 'Sumobito', 'https://indahkarya.co.id', 'recruitment@indahkarya.co.id', '085678901234', '@indahkarya_official', 'Construction', 'Besar'),
('startup-tekno', 'Tekno Digital Solutions', NULL, 'Startup teknologi berbasis AI dan software', 'Jombang Kota', 'https://teknodigital.id', 'hello@teknodigital.id', '086789012345', '@teknodigital', 'Technology', 'Startup'),
('cv-makmur', 'CV Makmur Jaya', NULL, 'Distributor alat kesehatan', 'Diwek', NULL, 'cvmakmur@yahoo.com', '087890123456', NULL, 'Healthcare', 'UMKM'),
('toko-modern', 'Toko Modern Mart', NULL, 'Supermarket dan minimarket', 'Jombang Kota', NULL, 'hrd.modernmart@gmail.com', '088901234567', '@modernmart', 'Retail', 'Menengah'),
('pt-cemerlang', 'PT Cemerlang Abadi', NULL, 'Perusahaan logistik dan ekspedisi', 'Kabuh', 'https://cemerlang.co.id', 'hr@cemerlang.co.id', '089012345678', '@cemerlang_logistik', 'Logistics', 'Menengah'),
('sekolah-harapan', 'Sekolah Harapan Bangsa', NULL, 'Lembaga pendidikan swasta', 'Jombang Kota', 'https://harapanbangsa.sch.id', 'info@harapanbangsa.sch.id', '081111222233', '@harapanbangsa', 'Education', 'UMKM');

-- 2. INSERT LOKER NORMAL (12 loker tanpa poster)
-- ============================================

-- Loker 1: IT di Startup
INSERT INTO vip_loker (
  title, perusahaan_id, perusahaan_name, lokasi, kategori, tipe_kerja,
  gaji_min, gaji_max, gaji_text, deskripsi, persyaratan, kualifikasi,
  deadline, sumber, status, is_featured, kontak_wa, kontak_email
) VALUES (
  'Full Stack Developer',
  (SELECT id FROM vip_perusahaan WHERE slug = 'startup-tekno'),
  'Tekno Digital Solutions',
  'Jombang Kota',
  ARRAY['IT', 'Web Development'],
  'Full-time',
  5000000,
  7000000,
  NULL,
  'Kami mencari Full Stack Developer berpengalaman untuk join tim kami membangun aplikasi berbasis AI.',
  'Min. 2 tahun pengalaman
Mahir React.js dan Node.js
Paham database PostgreSQL
Bisa kerja dalam tim',
  ARRAY['Pengalaman 2+ tahun sebagai Full Stack Developer', 'Menguasai React.js, Node.js, PostgreSQL', 'Paham RESTful API dan GraphQL', 'Komunikasi baik'],
  (CURRENT_DATE + INTERVAL '30 days')::DATE,
  'WA',
  'published',
  TRUE,
  '086789012345',
  'hello@teknodigital.id'
);

-- Loker 2: Marketing
INSERT INTO vip_loker (
  title, perusahaan_id, perusahaan_name, lokasi, kategori, tipe_kerja,
  gaji_text, deskripsi, kualifikasi, deadline, sumber, status, kontak_wa
) VALUES (
  'Marketing Executive',
  (SELECT id FROM vip_perusahaan WHERE slug = 'pt-maju-jaya'),
  'PT Maju Jaya Elektronik',
  'Jombang Kota',
  ARRAY['Marketing', 'Sales'],
  'Full-time',
  'Rp 4-6 juta + komisi',
  'Bertanggung jawab untuk strategi marketing dan meningkatkan penjualan produk elektronik kami.',
  ARRAY['Min. D3 Marketing/Komunikasi', 'Pengalaman 1-2 tahun di bidang marketing', 'Kreatif dan inovatif', 'Mampu bekerja dengan target'],
  (CURRENT_DATE + INTERVAL '20 days')::DATE,
  'IG',
  'published',
  '081234567890'
);

-- Loker 3: Admin
INSERT INTO vip_loker (
  title, perusahaan_id, perusahaan_name, lokasi, kategori, tipe_kerja,
  gaji_min, gaji_max, deskripsi, kualifikasi, sumber, status, kontak_email
) VALUES (
  'Staff Administrasi',
  (SELECT id FROM vip_perusahaan WHERE slug = 'cv-sukses-mandiri'),
  'CV Sukses Mandiri',
  'Mojowarno',
  ARRAY['Administrasi'],
  'Full-time',
  3500000,
  4500000,
  'Dibutuhkan staff administrasi untuk mengelola data dan dokumen perusahaan.',
  ARRAY['Pendidikan min. SMA/SMK', 'Teliti dan rapih', 'Menguasai Microsoft Office', 'Jujur dan bertanggung jawab'],
  'WA',
  'published',
  'info@suksesmandiri.com'
);

-- Loker 4: Sales
INSERT INTO vip_loker (
  title, perusahaan_id, perusahaan_name, lokasi, kategori, tipe_kerja,
  gaji_text, deskripsi, kualifikasi, deadline, sumber, status, is_featured, kontak_wa
) VALUES (
  'Sales Marketing Furniture',
  (SELECT id FROM vip_perusahaan WHERE slug = 'toko-berkah'),
  'Toko Berkah Furniture',
  'Ploso',
  ARRAY['Sales', 'Marketing'],
  'Full-time',
  'Gaji pokok + komisi menarik',
  'Mencari sales yang energik untuk memasarkan produk furniture berkualitas.',
  ARRAY['Pengalaman di bidang sales (diutamakan)', 'Komunikasi baik', 'Berorientasi pada target', 'Berpenampilan menarik'],
  (CURRENT_DATE + INTERVAL '15 days')::DATE,
  'WA',
  'published',
  TRUE,
  '083456789012'
);

-- Loker 5: F&B
INSERT INTO vip_loker (
  title, perusahaan_id, perusahaan_name, lokasi, kategori, tipe_kerja,
  gaji_min, gaji_max, deskripsi, kualifikasi, deadline, sumber, status, kontak_wa, kontak_email
) VALUES (
  'Waitress / Pelayan Restoran',
  (SELECT id FROM vip_perusahaan WHERE slug = 'restoran-nusantara'),
  'Restoran Nusantara',
  'Jombang Kota',
  ARRAY['F&B', 'Customer Service'],
  'Full-time',
  2800000,
  3500000,
  'Dibutuhkan pelayan restoran yang ramah dan cekatan untuk melayani pelanggan.',
  ARRAY['Usia 18-28 tahun', 'Berpenampilan menarik dan rapi', 'Ramah dan komunikatif', 'Bisa bekerja shift'],
  (CURRENT_DATE + INTERVAL '10 days')::DATE,
  'IG',
  'published',
  '084567890123',
  'hrd.nusantara@gmail.com'
);

-- Loker 6: Construction
INSERT INTO vip_loker (
  title, perusahaan_id, perusahaan_name, lokasi, kategori, tipe_kerja,
  gaji_text, deskripsi, persyaratan, kualifikasi, sumber, status, kontak_email
) VALUES (
  'Site Manager Konstruksi',
  (SELECT id FROM vip_perusahaan WHERE slug = 'pt-indah-karya'),
  'PT Indah Karya Sejahtera',
  'Sumobito',
  ARRAY['Construction', 'Engineering'],
  'Full-time',
  'Nego (sesuai pengalaman)',
  'Kami membutuhkan Site Manager berpengalaman untuk mengawasi proyek konstruksi perumahan.',
  'Min. S1 Teknik Sipil
Pengalaman 5+ tahun sebagai Site Manager
Paham K3 dan manajemen proyek
Siap mobile ke lokasi proyek',
  ARRAY['S1 Teknik Sipil', 'Pengalaman 5+ tahun', 'Sertifikat K3', 'Leadership kuat', 'Problem solving'],
  'WA',
  'published',
  'recruitment@indahkarya.co.id'
);

-- Loker 7: Healthcare
INSERT INTO vip_loker (
  title, perusahaan_id, perusahaan_name, lokasi, kategori, tipe_kerja,
  gaji_min, gaji_max, deskripsi, kualifikasi, deadline, sumber, status, kontak_wa
) VALUES (
  'Sales Representative Alat Kesehatan',
  (SELECT id FROM vip_perusahaan WHERE slug = 'cv-makmur'),
  'CV Makmur Jaya',
  'Diwek',
  ARRAY['Sales', 'Healthcare'],
  'Full-time',
  3000000,
  5000000,
  'Mencari sales representative untuk memasarkan alat kesehatan ke rumah sakit dan klinik.',
  ARRAY['D3/S1 jurusan apapun', 'Pengalaman sales 1+ tahun', 'Punya kendaraan pribadi (motor)', 'Komunikasi persuasif'],
  (CURRENT_DATE + INTERVAL '25 days')::DATE,
  'WA',
  'published',
  '087890123456'
);

-- Loker 8: Retail
INSERT INTO vip_loker (
  title, perusahaan_id, perusahaan_name, lokasi, kategori, tipe_kerja,
  gaji_min, gaji_max, deskripsi, kualifikasi, sumber, status, is_featured, kontak_wa, kontak_email
) VALUES (
  'Kasir & Customer Service',
  (SELECT id FROM vip_perusahaan WHERE slug = 'toko-modern'),
  'Toko Modern Mart',
  'Jombang Kota',
  ARRAY['Retail', 'Customer Service'],
  'Full-time',
  3200000,
  4000000,
  'Dibutuhkan kasir dan customer service untuk melayani pelanggan toko dengan ramah.',
  ARRAY['Pendidikan min. SMA/SMK', 'Jujur dan teliti', 'Ramah dan komunikatif', 'Bisa mengoperasikan komputer'],
  'WA',
  'published',
  TRUE,
  '088901234567',
  'hrd.modernmart@gmail.com'
);

-- Loker 9: Logistik
INSERT INTO vip_loker (
  title, perusahaan_id, perusahaan_name, lokasi, kategori, tipe_kerja,
  gaji_text, deskripsi, kualifikasi, sumber, status, kontak_wa
) VALUES (
  'Driver & Kurir Ekspedisi',
  (SELECT id FROM vip_perusahaan WHERE slug = 'pt-cemerlang'),
  'PT Cemerlang Abadi',
  'Kabuh',
  ARRAY['Logistik', 'Transportation'],
  'Full-time',
  'Rp 3.5-4.5 juta + tunjangan',
  'Dibutuhkan driver dan kurir untuk pengiriman barang antar kota.',
  ARRAY['Punya SIM A/C aktif', 'Pengalaman 1+ tahun sebagai driver', 'Hafal rute Jombang dan sekitarnya', 'Jujur dan bertanggung jawab'],
  'WA',
  'published',
  '089012345678'
);

-- Loker 10: Education
INSERT INTO vip_loker (
  title, perusahaan_id, perusahaan_name, lokasi, kategori, tipe_kerja,
  gaji_min, gaji_max, deskripsi, kualifikasi, deadline, sumber, status, kontak_email
) VALUES (
  'Guru Matematika SMP',
  (SELECT id FROM vip_perusahaan WHERE slug = 'sekolah-harapan'),
  'Sekolah Harapan Bangsa',
  'Jombang Kota',
  ARRAY['Education', 'Teaching'],
  'Full-time',
  4000000,
  5500000,
  'Kami membutuhkan guru matematika SMP yang berpengalaman dan menyenangkan.',
  ARRAY['S1 Pendidikan Matematika', 'Pengalaman mengajar min. 2 tahun', 'Sabar dan komunikatif', 'Menguasai metode pengajaran modern'],
  (CURRENT_DATE + INTERVAL '20 days')::DATE,
  'WA',
  'published',
  'info@harapanbangsa.sch.id'
);

-- Loker 11: Remote Job
INSERT INTO vip_loker (
  title, perusahaan_id, perusahaan_name, lokasi, kategori, tipe_kerja,
  gaji_text, deskripsi, kualifikasi, deadline, sumber, status, is_featured, kontak_wa, kontak_email
) VALUES (
  'Content Writer (Remote)',
  (SELECT id FROM vip_perusahaan WHERE slug = 'startup-tekno'),
  'Tekno Digital Solutions',
  'Remote',
  ARRAY['Content Creator', 'Marketing'],
  'Remote',
  'Rp 3-5 juta (project based)',
  'Mencari content writer freelance untuk membuat artikel blog dan konten social media.',
  ARRAY['Pengalaman menulis artikel SEO', 'Portfolio writing yang menarik', 'Kreatif dan update trend', 'Bisa kerja remote dengan deadline'],
  (CURRENT_DATE + INTERVAL '30 days')::DATE,
  'IG',
  'published',
  TRUE,
  '086789012345',
  'hello@teknodigital.id'
);

-- Loker 12: Part Time
INSERT INTO vip_loker (
  title, perusahaan_id, perusahaan_name, lokasi, kategori, tipe_kerja,
  gaji_text, deskripsi, kualifikasi, sumber, status, kontak_wa
) VALUES (
  'Barista Part Time',
  (SELECT id FROM vip_perusahaan WHERE slug = 'restoran-nusantara'),
  'Restoran Nusantara',
  'Jombang Kota',
  ARRAY['F&B', 'Barista'],
  'Part-time',
  'Rp 25.000/jam',
  'Dibutuhkan barista part time untuk weekend dan hari libur.',
  ARRAY['Pengalaman sebagai barista (diutamakan)', 'Bisa membuat berbagai jenis kopi', 'Ramah dan cekatan', 'Bisa kerja weekend'],
  'WA',
  'published',
  '084567890123'
);

-- 3. INSERT LOKER AI PARSED (8 loker dengan poster)
-- ============================================

-- AI Parsed 1
INSERT INTO vip_loker (
  title, perusahaan_id, perusahaan_name, lokasi, kategori, tipe_kerja,
  gaji_text, deskripsi, kualifikasi, deadline, sumber, poster_url,
  status, is_featured, kontak_wa
) VALUES (
  'Staff Produksi',
  (SELECT id FROM vip_perusahaan WHERE slug = 'pt-maju-jaya'),
  'PT Maju Jaya Elektronik',
  'Jombang Kota',
  ARRAY['Manufacturing', 'Production'],
  'Full-time',
  'UMR + Tunjangan',
  'Benefit: BPJS Kesehatan, BPJS Ketenagakerjaan, Uang makan, Tunjangan transport',
  ARRAY['Laki-laki, usia 18-35 tahun', 'Pendidikan min. SMA/SMK', 'Sehat jasmani dan rohani', 'Siap kerja shift'],
  (CURRENT_DATE + INTERVAL '14 days')::DATE,
  'Poster',
  'https://placehold.co/600x800/2563eb/ffffff?text=Loker+Staff+Produksi',
  'published',
  TRUE,
  '081234567890'
);

-- AI Parsed 2
INSERT INTO vip_loker (
  title, perusahaan_id, perusahaan_name, lokasi, kategori, tipe_kerja,
  gaji_text, deskripsi, kualifikasi, sumber, poster_url, status, kontak_wa, kontak_email
) VALUES (
  'Admin Online Shop',
  (SELECT id FROM vip_perusahaan WHERE slug = 'cv-sukses-mandiri'),
  'CV Sukses Mandiri',
  'Mojowarno',
  ARRAY['Administrasi', 'E-Commerce'],
  'Full-time',
  'Rp 3-4 juta',
  'Benefit: Gaji tepat waktu, Bonus penjualan, Lingkungan kerja nyaman',
  ARRAY['Wanita, usia 20-30 tahun', 'Paham e-commerce (Shopee, Tokopedia)', 'Bisa komunikasi dengan customer', 'Teliti dan rapih'],
  'Poster',
  'https://placehold.co/600x800/9333ea/ffffff?text=Loker+Admin+Online+Shop',
  'published',
  '082345678901',
  'info@suksesmandiri.com'
);

-- AI Parsed 3
INSERT INTO vip_loker (
  title, perusahaan_id, perusahaan_name, lokasi, kategori, tipe_kerja,
  gaji_text, deskripsi, kualifikasi, deadline, sumber, poster_url,
  status, is_featured, kontak_wa
) VALUES (
  'SPG / Sales Promotion Girl',
  (SELECT id FROM vip_perusahaan WHERE slug = 'toko-berkah'),
  'Toko Berkah Furniture',
  'Ploso',
  ARRAY['Sales', 'Retail'],
  'Full-time',
  'Gaji pokok Rp 3 juta + Komisi',
  'Benefit: Komisi menarik, Bonus target, BPJS Kesehatan',
  ARRAY['Wanita, usia 18-25 tahun', 'Berpenampilan menarik', 'Komunikasi baik', 'Pengalaman SPG diutamakan'],
  (CURRENT_DATE + INTERVAL '10 days')::DATE,
  'Poster',
  'https://placehold.co/600x800/ea580c/ffffff?text=Loker+SPG',
  'published',
  TRUE,
  '083456789012'
);

-- AI Parsed 4
INSERT INTO vip_loker (
  title, perusahaan_id, perusahaan_name, lokasi, kategori, tipe_kerja,
  gaji_text, deskripsi, kualifikasi, sumber, poster_url, status, kontak_wa
) VALUES (
  'Desain Grafis',
  (SELECT id FROM vip_perusahaan WHERE slug = 'startup-tekno'),
  'Tekno Digital Solutions',
  'Jombang Kota',
  ARRAY['Design', 'Creative'],
  'Full-time',
  'Rp 4-6 juta',
  'Benefit: Laptop kerja, Lingkungan startup, Waktu fleksibel',
  ARRAY['Mahir Adobe Photoshop, Illustrator', 'Portfolio design yang menarik', 'Kreatif dan up-to-date', 'Bisa kerja dengan deadline'],
  'Poster',
  'https://placehold.co/600x800/0891b2/ffffff?text=Loker+Desain+Grafis',
  'published',
  '086789012345'
);

-- AI Parsed 5
INSERT INTO vip_loker (
  title, perusahaan_id, perusahaan_name, lokasi, kategori, tipe_kerja,
  gaji_text, deskripsi, kualifikasi, deadline, sumber, poster_url,
  status, kontak_email
) VALUES (
  'Teknisi Komputer',
  (SELECT id FROM vip_perusahaan WHERE slug = 'pt-maju-jaya'),
  'PT Maju Jaya Elektronik',
  'Jombang Kota',
  ARRAY['IT', 'Technical Support'],
  'Full-time',
  'Rp 3.5-5 juta',
  'Benefit: Sertifikasi, Pelatihan berkala, BPJS',
  ARRAY['Paham hardware & software komputer', 'Bisa troubleshooting', 'Teliti dan cekatan', 'Pendidikan min. SMK TKJ'],
  (CURRENT_DATE + INTERVAL '20 days')::DATE,
  'Poster',
  'https://placehold.co/600x800/7c3aed/ffffff?text=Loker+Teknisi+Komputer',
  'published',
  'hrd@majujaya.com'
);

-- AI Parsed 6
INSERT INTO vip_loker (
  title, perusahaan_id, perusahaan_name, lokasi, kategori, tipe_kerja,
  gaji_text, deskripsi, kualifikasi, sumber, poster_url, status, is_featured, kontak_wa
) VALUES (
  'Koki / Chef',
  (SELECT id FROM vip_perusahaan WHERE slug = 'restoran-nusantara'),
  'Restoran Nusantara',
  'Jombang Kota',
  ARRAY['F&B', 'Chef'],
  'Full-time',
  'Rp 4-6 juta (tergantung pengalaman)',
  'Benefit: Makan gratis, Tunjangan transportasi, Bonus kinerja',
  ARRAY['Pengalaman min. 2 tahun sebagai chef', 'Mahir masakan Indonesia', 'Kreatif dalam menu baru', 'Bisa memimpin tim dapur'],
  'Poster',
  'https://placehold.co/600x800/dc2626/ffffff?text=Loker+Chef',
  'published',
  TRUE,
  '084567890123'
);

-- AI Parsed 7
INSERT INTO vip_loker (
  title, perusahaan_id, perusahaan_name, lokasi, kategori, tipe_kerja,
  gaji_text, deskripsi, kualifikasi, sumber, poster_url, status, kontak_wa
) VALUES (
  'Security / Satpam',
  (SELECT id FROM vip_perusahaan WHERE slug = 'pt-indah-karya'),
  'PT Indah Karya Sejahtera',
  'Sumobito',
  ARRAY['Security'],
  'Full-time',
  'UMR + Tunjangan',
  'Benefit: Seragam, BPJS Kesehatan & Ketenagakerjaan, Uang makan',
  ARRAY['Laki-laki, usia max. 40 tahun', 'Tinggi min. 165 cm', 'Sehat jasmani dan rohani', 'Disiplin dan jujur'],
  'Poster',
  'https://placehold.co/600x800/15803d/ffffff?text=Loker+Security',
  'published',
  '085678901234'
);

-- AI Parsed 8
INSERT INTO vip_loker (
  title, perusahaan_id, perusahaan_name, lokasi, kategori, tipe_kerja,
  gaji_text, deskripsi, kualifikasi, deadline, sumber, poster_url,
  status, is_featured, kontak_wa, kontak_email
) VALUES (
  'Social Media Specialist',
  (SELECT id FROM vip_perusahaan WHERE slug = 'startup-tekno'),
  'Tekno Digital Solutions',
  'Jombang Kota',
  ARRAY['Marketing', 'Social Media'],
  'Full-time',
  'Rp 4-7 juta',
  'Benefit: Waktu fleksibel, Work from home option, Laptop & HP kerja',
  ARRAY['Pengalaman mengelola social media', 'Kreatif membuat konten', 'Paham Instagram, TikTok, Facebook', 'Bisa analisis data & insight'],
  (CURRENT_DATE + INTERVAL '25 days')::DATE,
  'Poster',
  'https://placehold.co/600x800/f59e0b/ffffff?text=Loker+Social+Media',
  'published',
  TRUE,
  '086789012345',
  'hello@teknodigital.id'
);

-- ============================================
-- TOTAL: 10 Perusahaan + 20 Loker (12 normal + 8 AI parsed)
-- ============================================

-- Verify data
SELECT 'Perusahaan:', COUNT(*) FROM vip_perusahaan;
SELECT 'Loker Total:', COUNT(*) FROM vip_loker;
SELECT 'Loker Normal:', COUNT(*) FROM vip_loker WHERE sumber != 'Poster' OR poster_url IS NULL;
SELECT 'Loker AI Parsed:', COUNT(*) FROM vip_loker WHERE sumber = 'Poster' AND poster_url IS NOT NULL;
