# VIP Career InfolokerJombang - Project Design Document

## 🎯 Konsep Utama

Website katalog loker eksklusif untuk member VIP grup WhatsApp "Career InfolokerJombang" - sebuah platform yang memungkinkan member berbayar untuk mengakses arsip lengkap semua lowongan kerja yang pernah dibagikan di grup WA, Instagram, dan poster fisik.

**Tujuan Akhir:** Menjadikan Career VIP InfolokerJombang sebagai pusat informasi kerja terlengkap dan terupdate di Kota Jombang.

---

## 💡 Analisis & Ide Tambahan

### ✅ Kekuatan Konsep Anda
1. **Integrasi dengan JobMate** - Member tidak perlu registrasi ulang, seamless UX
2. **AI-Powered Admin** - Upload poster → auto-extract data = sangat time-saving
3. **Eksklusivitas** - Member VIP merasa valued karena akses yang tidak bisa didapat gratis
4. **Multi-Source** - WA + IG + Poster = coverage lengkap

### 🚀 Ide Pengembangan Tambahan

#### 1. **Fitur Notifikasi Real-time**
- Push notification browser ketika ada loker baru sesuai preferensi member
- WhatsApp notification (via API Business) untuk loker yang match kriteria
- Email digest mingguan dengan loker terupdate

#### 2. **Smart Filtering & Personalisasi**
- Member bisa set "Job Alert" dengan kriteria spesifik (lokasi, kategori, gaji minimum)
- AI recommendation: "Loker yang cocok untukmu" berdasarkan history browsing & simpan
- Filter advanced: fresh graduate friendly, remote work, part-time, full-time

#### 3. **Social Proof & Engagement**
- Badge "X orang sudah apply" di setiap loker
- Section "Loker paling diminati minggu ini"
- Testimoni success story: "Saya diterima kerja lewat Career VIP"
- Leaderboard: "Top 5 Perusahaan yang paling banyak hiring"

#### 4. **Enhanced Admin Tools**
- Bulk upload: admin bisa upload multiple poster sekaligus
- Auto-expiry: loker otomatis archived setelah deadline
- Template response WA: "Untuk info lengkap klik: [link-loker]"
- Analytics dashboard: track CTR per loker, conversion rate
- AI suggestion: "Loker ini mirip dengan [loker-lama], perlu diupdate?"

#### 5. **Monetization Features**
- Member tier: VIP Basic (akses 1 bulan terakhir) vs VIP Premium (unlimited archive)
- Perusahaan bisa bayar untuk "Featured Job" → muncul di paling atas
- Affiliate link: member yang invite teman baru dapat diskon

#### 6. **Integration Ecosystem**
- Direct apply via JobMate: klik "Apply" → auto buka CV Builder di JobMate
- Share to social: member bisa share loker tertentu (tapi harus login dulu untuk lihat detail)
- Export to PDF: download loker sebagai PDF untuk dibaca offline

---

## 🎨 Design System

### Color Palette
```
Primary: #1E3A8A (Navy Blue)
Secondary: #FBBF24 (Gold)
Background: #FFFFFF (White)
Surface: #F3F4F6 (Light Gray)
Text Primary: #111827 (Almost Black)
Text Secondary: #6B7280 (Gray)
Success: #10B981 (Green)
Warning: #F59E0B (Orange)
Error: #EF4444 (Red)
```

### Typography
```
Headings: Inter Bold (H1: 36px, H2: 30px, H3: 24px)
Body: Inter Regular (16px)
Small: Inter Regular (14px)
Caption: Inter Regular (12px)
```

### Components Style Guide
- Border radius: 8px (cards), 6px (buttons), 4px (inputs)
- Shadow: soft shadow untuk cards (shadow-md)
- Spacing: 4px grid system (p-2, p-4, p-6, p-8)
- Icons: Lucide React icons
- Animations: smooth transitions (duration-200)

---

## 🏗️ Struktur Folder

```
career-vip-jombang/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                    # Homepage
│   │   ├── loker/
│   │   │   ├── page.tsx                # Daftar loker
│   │   │   └── [id]/page.tsx           # Detail loker
│   │   ├── perusahaan/
│   │   │   ├── page.tsx                # Daftar perusahaan
│   │   │   └── [slug]/page.tsx         # Detail perusahaan
│   │   └── login/page.tsx              # Login member
│   ├── (member)/
│   │   └── dashboard/
│   │       ├── page.tsx                # Member dashboard
│   │       ├── saved/page.tsx          # Loker tersimpan
│   │       ├── alerts/page.tsx         # Job alerts settings
│   │       └── profile/page.tsx        # Profil & preferensi
│   ├── (admin)/
│   │   └── admin/
│   │       ├── page.tsx                # Admin dashboard
│   │       ├── loker/
│   │       │   ├── page.tsx            # Semua loker
│   │       │   ├── tambah/page.tsx     # Tambah loker
│   │       │   └── [id]/edit/page.tsx  # Edit loker
│   │       ├── perusahaan/page.tsx     # Manage perusahaan
│   │       ├── member/page.tsx         # Member management
│   │       └── analytics/page.tsx      # Analytics
│   ├── api/
│   │   ├── loker/
│   │   │   ├── route.ts                # GET, POST loker
│   │   │   ├── [id]/route.ts           # GET, PATCH, DELETE loker
│   │   │   └── search/route.ts         # Search loker
│   │   ├── ai/
│   │   │   ├── parse-poster/route.ts   # Upload poster → AI extract
│   │   │   └── generate-desc/route.ts  # Generate job description
│   │   ├── perusahaan/route.ts
│   │   ├── member/route.ts
│   │   └── analytics/route.ts
│   └── layout.tsx
├── components/
│   ├── layout/
│   │   ├── Header.tsx                  # Public header
│   │   ├── Footer.tsx                  # Public footer
│   │   ├── MemberNav.tsx               # Member navigation
│   │   └── AdminSidebar.tsx            # Admin sidebar
│   ├── loker/
│   │   ├── LokerCard.tsx               # Card loker di grid
│   │   ├── LokerDetail.tsx             # Detail lengkap loker
│   │   ├── LokerFilters.tsx            # Filter & search
│   │   ├── LokerGrid.tsx               # Grid container
│   │   └── LokerBookmark.tsx           # Tombol bookmark
│   ├── perusahaan/
│   │   ├── PerusahaanCard.tsx
│   │   └── PerusahaanDetail.tsx
│   ├── admin/
│   │   ├── LokerForm.tsx               # Form tambah/edit loker
│   │   ├── PosterUpload.tsx            # Upload & AI parse
│   │   ├── StatsCard.tsx               # Card statistik
│   │   └── AnalyticsChart.tsx          # Chart analytics
│   ├── member/
│   │   ├── JobAlerts.tsx               # Setup job alerts
│   │   ├── SavedLoker.tsx              # Daftar loker tersimpan
│   │   └── Recommendations.tsx         # AI recommendations
│   └── ui/                             # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── select.tsx
│       ├── badge.tsx
│       ├── dialog.tsx
│       └── ... (shadcn/ui lengkap)
├── lib/
│   ├── supabase/
│   │   ├── client.ts                   # Supabase browser client
│   │   ├── server.ts                   # Supabase server client
│   │   └── types.ts                    # Database types
│   ├── ai/
│   │   ├── sumpod.ts                   # Sumpod API wrapper
│   │   └── prompts.ts                  # AI prompts templates
│   ├── utils/
│   │   ├── date.ts                     # Date formatting
│   │   ├── currency.ts                 # Currency formatting
│   │   └── validation.ts               # Form validation
│   └── constants.ts                    # App constants
├── types/
│   ├── loker.ts
│   ├── perusahaan.ts
│   ├── member.ts
│   └── analytics.ts
├── hooks/
│   ├── useLoker.ts
│   ├── useBookmark.ts
│   ├── useJobAlerts.ts
│   └── useAnalytics.ts
├── public/
│   ├── images/
│   ├── logos/
│   └── placeholders/
└── styles/
    └── globals.css
```

---

## 🗄️ Database Schema

### Table: `vip_loker`
```sql
CREATE TABLE vip_loker (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  perusahaan_id UUID REFERENCES vip_perusahaan(id),
  perusahaan_name TEXT NOT NULL, -- denormalized untuk performa
  lokasi TEXT NOT NULL,
  kategori TEXT[], -- {IT, Marketing, Finance, etc}
  tipe_kerja TEXT, -- Full-time, Part-time, Contract, Freelance
  gaji_min BIGINT,
  gaji_max BIGINT,
  gaji_text TEXT, -- "Rp 5-7 juta" atau "Nego"
  deskripsi TEXT,
  persyaratan TEXT,
  kualifikasi TEXT[],
  deadline DATE,
  sumber TEXT, -- WA, IG, Poster
  poster_url TEXT, -- URL poster asli
  status TEXT DEFAULT 'published', -- draft, published, expired, archived
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  apply_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  expired_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_vip_loker_status ON vip_loker(status);
CREATE INDEX idx_vip_loker_kategori ON vip_loker USING GIN(kategori);
CREATE INDEX idx_vip_loker_lokasi ON vip_loker(lokasi);
CREATE INDEX idx_vip_loker_deadline ON vip_loker(deadline);
CREATE INDEX idx_vip_loker_published_at ON vip_loker(published_at DESC);
```

### Table: `vip_perusahaan`
```sql
CREATE TABLE vip_perusahaan (
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

CREATE INDEX idx_vip_perusahaan_slug ON vip_perusahaan(slug);
```

### Table: `vip_member_bookmarks`
```sql
CREATE TABLE vip_member_bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  loker_id UUID REFERENCES vip_loker(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(member_id, loker_id)
);

CREATE INDEX idx_vip_bookmarks_member ON vip_member_bookmarks(member_id);
CREATE INDEX idx_vip_bookmarks_loker ON vip_member_bookmarks(loker_id);
```

### Table: `vip_job_alerts`
```sql
CREATE TABLE vip_job_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nama_alert TEXT NOT NULL,
  kategori TEXT[],
  lokasi TEXT[],
  tipe_kerja TEXT[],
  gaji_min BIGINT,
  is_active BOOLEAN DEFAULT true,
  notif_email BOOLEAN DEFAULT true,
  notif_wa BOOLEAN DEFAULT false,
  notif_browser BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_vip_alerts_member ON vip_job_alerts(member_id);
CREATE INDEX idx_vip_alerts_active ON vip_job_alerts(is_active);
```

### Table: `vip_loker_views`
```sql
CREATE TABLE vip_loker_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loker_id UUID REFERENCES vip_loker(id) ON DELETE CASCADE,
  member_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_vip_views_loker ON vip_loker_views(loker_id);
CREATE INDEX idx_vip_views_member ON vip_loker_views(member_id);
CREATE INDEX idx_vip_views_date ON vip_loker_views(viewed_at);
```

### Table: `vip_loker_applications` (tracking)
```sql
CREATE TABLE vip_loker_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loker_id UUID REFERENCES vip_loker(id) ON DELETE CASCADE,
  member_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  method TEXT, -- whatsapp, email, external
  applied_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_vip_applications_loker ON vip_loker_applications(loker_id);
CREATE INDEX idx_vip_applications_member ON vip_loker_applications(member_id);
```

### Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE vip_loker ENABLE ROW LEVEL SECURITY;
ALTER TABLE vip_member_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE vip_job_alerts ENABLE ROW LEVEL SECURITY;

-- Policy: Public dapat read loker yang published
CREATE POLICY "Public can read published loker"
  ON vip_loker FOR SELECT
  USING (status = 'published' AND (expired_at IS NULL OR expired_at > NOW()));

-- Policy: Admin dapat full access loker
CREATE POLICY "Admin can manage loker"
  ON vip_loker FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy: Member hanya bisa manage bookmark sendiri
CREATE POLICY "Member can manage own bookmarks"
  ON vip_member_bookmarks FOR ALL
  USING (member_id = auth.uid());

-- Policy: Member hanya bisa manage job alerts sendiri
CREATE POLICY "Member can manage own alerts"
  ON vip_job_alerts FOR ALL
  USING (member_id = auth.uid());
```

---

## 🔌 API Endpoints

### Loker APIs
```
GET    /api/loker              - List semua loker (with filters & pagination)
POST   /api/loker              - Create loker baru (admin only)
GET    /api/loker/[id]         - Get detail loker
PATCH  /api/loker/[id]         - Update loker (admin only)
DELETE /api/loker/[id]         - Delete loker (admin only)
POST   /api/loker/[id]/view    - Track view (increment counter)
POST   /api/loker/[id]/apply   - Track application (increment counter)
GET    /api/loker/search       - Search loker (advanced filters)
GET    /api/loker/trending     - Get trending loker
GET    /api/loker/recommended  - Get recommended loker for member
```

### Perusahaan APIs
```
GET    /api/perusahaan         - List perusahaan
POST   /api/perusahaan         - Create perusahaan (admin only)
GET    /api/perusahaan/[slug]  - Get detail perusahaan
PATCH  /api/perusahaan/[slug]  - Update perusahaan (admin only)
GET    /api/perusahaan/[slug]/loker - Get loker by perusahaan
```

### Member APIs
```
GET    /api/member/bookmarks   - Get member bookmarks
POST   /api/member/bookmarks   - Add bookmark
DELETE /api/member/bookmarks/[id] - Remove bookmark
GET    /api/member/alerts      - Get job alerts
POST   /api/member/alerts      - Create job alert
PATCH  /api/member/alerts/[id] - Update job alert
DELETE /api/member/alerts/[id] - Delete job alert
GET    /api/member/history     - Get view history
```

### AI APIs (Sumpod Integration)
```
POST   /api/ai/parse-poster    - Upload poster → extract data
  Body: { image: File }
  Response: {
    title: string,
    perusahaan: string,
    lokasi: string,
    kategori: string[],
    gaji: string,
    kontak: { wa?: string, email?: string },
    raw_text: string
  }

POST   /api/ai/generate-desc   - Generate job description
  Body: { title: string, perusahaan: string, raw_text?: string }
  Response: {
    deskripsi: string,
    persyaratan: string,
    kualifikasi: string[]
  }
```

### Analytics APIs
```
GET    /api/analytics/dashboard - Admin dashboard stats
GET    /api/analytics/loker/[id] - Loker performance
GET    /api/analytics/trending  - Trending categories & locations
GET    /api/analytics/conversion - Apply conversion rate
```

---

## 🤖 AI Integration (Sumpod)

### Use Case 1: Parse Poster
```typescript
// lib/ai/sumpod.ts
export async function parsePoster(imageFile: File) {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  const response = await fetch('https://api.sumpod.com/v1/ocr/extract', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.SUMPOD_API_KEY}`
    },
    body: formData
  });
  
  const { text } = await response.json();
  
  // Extract job info using LLM
  const extractResponse = await fetch('https://api.sumpod.com/v1/llm/extract', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.SUMPOD_API_KEY}`
    },
    body: JSON.stringify({
      text,
      schema: {
        title: 'string',
        perusahaan: 'string',
        lokasi: 'string',
        kategori: 'array<string>',
        gaji: 'string',
        deadline: 'date',
        kontak: {
          whatsapp: 'string?',
          email: 'string?'
        }
      }
    })
  });
  
  return await extractResponse.json();
}
```

### Use Case 2: Generate Job Description
```typescript
export async function generateJobDescription(data: {
  title: string;
  perusahaan: string;
  raw_text?: string;
}) {
  const prompt = `
Buatkan deskripsi pekerjaan profesional untuk:
Posisi: ${data.title}
Perusahaan: ${data.perusahaan}
${data.raw_text ? `Info tambahan: ${data.raw_text}` : ''}

Format:
1. Deskripsi Pekerjaan (2-3 paragraf)
2. Persyaratan (bullet points)
3. Kualifikasi (bullet points)
`;

  const response = await fetch('https://api.sumpod.com/v1/llm/complete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.SUMPOD_API_KEY}`
    },
    body: JSON.stringify({
      prompt,
      model: 'gpt-4',
      temperature: 0.7
    })
  });
  
  const { completion } = await response.json();
  
  // Parse completion menjadi structured data
  return parseJobDescription(completion);
}
```

---

## 📱 Halaman Detail & User Flow

### 1. Homepage (/) - User Flow
```
User Landing
    ↓
Hero CTA "Jadi Member Sekarang"
    ↓
[Already Member?] → Login → Dashboard
[Not Member Yet?] → Info pricing → Contact admin WA
    ↓
Scroll untuk lihat "Loker Terbaru"
    ↓
Click card loker (preview saja, blur detail)
    ↓
"Login untuk lihat detail lengkap"
```

### 2. Halaman Loker (/loker) - Features
- **Smart Search**: search by posisi, perusahaan, atau kata kunci
- **Filters**:
  - Lokasi: [Jombang Kota, Mojoagung, Ploso, Tembelang, dll]
  - Kategori: [IT, Marketing, Sales, Finance, dll]
  - Tipe: [Full-time, Part-time, Freelance, Remote]
  - Gaji: [< 3jt, 3-5jt, 5-7jt, > 7jt, Nego]
  - Sort: [Terbaru, Deadline, Gaji Tertinggi]
- **View Options**: Grid view atau List view
- **Infinite Scroll** atau Pagination (pilih salah satu)

### 3. Halaman Detail Loker (/loker/[id]) - Layout
```
┌─────────────────────────────────────────────────────┐
│ [Badge: VERIFIED] [Badge: URGENT]                   │
│ Title: Frontend Developer                           │
│ Company: PT Tech Jombang | 📍 Jombang Kota          │
│ 💰 Rp 5-7 juta | 📅 Deadline: 31 Mei 2024          │
├─────────────────────────────────────────────────────┤
│ [❤️ Bookmark] [📤 Share] [👁️ 125 views]             │
├─────────────────────────────────────────────────────┤
│                                                      │
│ Deskripsi Pekerjaan                                 │
│ [Full description here...]                          │
│                                                      │
│ Persyaratan                                         │
│ • Min D3/S1 Teknik Informatika                      │
│ • Pengalaman 1-2 tahun                              │
│ • ...                                               │
│                                                      │
│ Kualifikasi                                         │
│ • Menguasai React.js & Next.js                      │
│ • ...                                               │
│                                                      │
│ ┌─────────────────────────────────┐                │
│ │ 📲 LAMAR VIA WHATSAPP           │                │
│ └─────────────────────────────────┘                │
│ ┌─────────────────────────────────┐                │
│ │ ✉️ KIRIM EMAIL LAMARAN          │                │
│ └─────────────────────────────────┘                │
│                                                      │
├─────────────────────────────────────────────────────┤
│ Tentang Perusahaan                                  │
│ [Logo] PT Tech Jombang                              │
│ [Short description]                                 │
│ [Link: Lihat semua loker dari perusahaan ini]      │
├─────────────────────────────────────────────────────┤
│ Loker Serupa                                        │
│ [Card] [Card] [Card]                                │
└─────────────────────────────────────────────────────┘
```

### 4. Dashboard Member (/dashboard) - Sections
```
┌─────────────────────────────────────────────────────┐
│ Selamat Datang, [Nama Member]!                      │
│ Member sejak: Januari 2024                          │
├─────────────────────────────────────────────────────┤
│ [📊 Stats Card]                                     │
│ Total Loker Aktif: 127 | Tersimpan: 5 | Dilihat: 23│
├─────────────────────────────────────────────────────┤
│ [Tabs: Semua Loker | 💾 Tersimpan | 🔔 Job Alerts] │
├─────────────────────────────────────────────────────┤
│ Loker Terbaru Untukmu                               │
│ [List of recommended loker cards]                   │
└─────────────────────────────────────────────────────┘
```

### 5. Admin Dashboard (/admin) - Sections
```
┌──────────────┬──────────────────────────────────────┐
│ [Sidebar]    │ Dashboard Admin                      │
│              ├──────────────────────────────────────┤
│ • Dashboard  │ [Stats Cards]                        │
│ • Loker      │ Total Loker: 127 | Aktif: 98        │
│   - Semua    │ Member Aktif: 45 | Views/minggu: 850│
│   - Tambah   ├──────────────────────────────────────┤
│ • Perusahaan │ [Chart: Posting per hari]            │
│ • Member     │ [Chart: Kategori terpopuler]         │
│ • Analytics  ├──────────────────────────────────────┤
│              │ Loker Terbaru                        │
│              │ [Table with actions]                 │
└──────────────┴──────────────────────────────────────┘
```

### 6. Admin - Tambah Loker - UI Flow
```
Step 1: Upload Poster (Optional)
┌─────────────────────────────────────────┐
│ 📤 Upload Poster atau Isi Manual       │
│                                         │
│ [Drag & Drop Area]                      │
│ atau                                    │
│ [Browse File]                           │
│                                         │
│ [Upload & Parse dengan AI] ← Magic!    │
└─────────────────────────────────────────┘
         ↓ (jika upload)
         ↓ Loading... AI sedang membaca poster
         ↓
Step 2: Form Auto-Filled (atau manual)
┌─────────────────────────────────────────┐
│ Judul Posisi: [Frontend Developer]     │
│ Perusahaan: [Dropdown: pilih atau buat]│
│ Lokasi: [Jombang Kota]                 │
│ Kategori: [Multi-select: IT, Web Dev]  │
│ Tipe Kerja: [Full-time]                │
│ Gaji: [Min: 5000000] [Max: 7000000]    │
│        [atau text: "Nego"]             │
│ Deadline: [31/05/2024]                 │
│ Sumber: [○ WA ○ IG ○ Poster]          │
│                                         │
│ Deskripsi: [Rich text editor]          │
│ [Auto-generated by AI ✨]              │
│                                         │
│ Persyaratan: [Rich text editor]        │
│ Kualifikasi: [Tag input, dynamic]      │
│                                         │
│ Kontak Apply:                           │
│ WhatsApp: [+62...]                     │
│ Email: [hr@...]                        │
│                                         │
│ [💾 Simpan Draft] [✅ Publikasikan]   │
└─────────────────────────────────────────┘
```

---

## 🎯 Feature Priority (MVP → Future)

### MVP (Phase 1) - Wajib Ada
- ✅ Homepage dengan hero & loker terbaru
- ✅ Daftar loker + filter dasar (lokasi, kategori)
- ✅ Detail loker + CTA apply (WA/Email)
- ✅ Login member (integrasi Supabase dari JobMate)
- ✅ Dashboard member (list loker + bookmark)
- ✅ Admin dashboard (tambah loker manual)
- ✅ Admin: upload poster + AI parse (Sumpod)
- ✅ Halaman perusahaan + detail

### Phase 2 - Enhanced Features
- ⭐ Job alerts (email notification)
- ⭐ AI recommendations
- ⭐ Analytics dashboard admin (CTR, views, etc)
- ⭐ Bulk upload poster
- ⭐ Auto-expiry loker
- ⭐ Member tier (Basic vs Premium)

### Phase 3 - Advanced Features
- 🚀 WhatsApp notification (via Business API)
- 🚀 Push notification browser
- 🚀 Featured job (paid promotion)
- 🚀 Integration dengan JobMate (direct apply)
- 🚀 Mobile app (React Native)
- 🚀 Chatbot AI untuk cari loker

---

## 🔐 Authentication & Authorization

### User Roles
```typescript
type UserRole = 'admin' | 'member' | 'guest';

// Extend existing JobMate profiles table
// Atau tambahkan field:
// vip_member_since: TIMESTAMPTZ
// vip_tier: TEXT (basic, premium)
```

### Access Control
| Role   | Public Pages | Member Dashboard | Admin Dashboard |
|--------|-------------|------------------|-----------------|
| Guest  | ✅ (limited) | ❌               | ❌              |
| Member | ✅           | ✅               | ❌              |
| Admin  | ✅           | ✅               | ✅              |

### Middleware Protection
```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);
  const { data: { session } } = await supabase.auth.getSession();
  
  // Protect member routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session?.user.id)
      .single();
    
    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
  
  return response;
}
```

---

## 🚀 Deployment Checklist

### Environment Variables
```env
# Supabase (same as JobMate)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=

# Sumpod AI
SUMPOD_API_KEY=
NEXT_PUBLIC_SUMPOD_PUBLIC_KEY=

# App Config
NEXT_PUBLIC_APP_URL=https://career-vip.vercel.app
NEXT_PUBLIC_WA_ADMIN=+6281234567890

# Email (optional, untuk notifications)
RESEND_API_KEY=
```

### Vercel Deployment Steps
1. Push code ke GitHub
2. Import project di Vercel
3. Set environment variables
4. Deploy
5. Set custom domain: `careervip-jombang.com` (optional)

### Post-Deployment Tasks
- [ ] Setup database schema di Supabase
- [ ] Enable RLS policies
- [ ] Upload logo & images ke Supabase Storage
- [ ] Test Sumpod AI integration
- [ ] Create admin user
- [ ] Import initial perusahaan data
- [ ] Test member login from JobMate
- [ ] Setup analytics (Vercel Analytics + Supabase)

---

## 📊 Success Metrics

### KPIs untuk Website VIP
1. **Member Engagement**
   - Daily Active Members (DAM)
   - Avg time on site
   - Pages per session
   - Bounce rate < 40%

2. **Content Metrics**
   - Total loker published per bulan: target 50+
   - Loker aktif (belum expired): target 30+
   - Avg views per loker: target 20+

3. **Conversion Metrics**
   - View-to-Apply rate: target 5%
   - Bookmark rate: target 10%
   - Job alert setup rate: target 30% of members

4. **Admin Efficiency**
   - Avg time to publish loker: < 3 menit (dengan AI)
   - AI parse accuracy: > 90%

---

## 💰 Business Model (Optional)

### Monetization Ideas
1. **Member Subscription**
   - VIP Basic: Rp 25k/bulan (akses 1 bulan terakhir)
   - VIP Premium: Rp 50k/bulan (unlimited archive + priority notif)

2. **Employer Services**
   - Featured Job: Rp 50k/posting (muncul di top)
   - Company Profile Page: Rp 100k/bulan

3. **Affiliate & Partnership**
   - Referral program: member invite teman → dapat 1 bulan gratis
   - Partnership dengan recruitment agency Jombang

---

## 🎨 UI Components Library

### Rekomendasi shadcn/ui Components
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add select
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add form
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add table
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add pagination
npx shadcn-ui@latest add skeleton
```

### Custom Components to Build
1. **LokerCard** - card untuk list loker
2. **FilterBar** - search + filters
3. **StatsCard** - untuk dashboard admin
4. **BookmarkButton** - toggle bookmark
5. **ShareButton** - share ke social media
6. **PosterUploader** - drag & drop + preview
7. **RichTextEditor** - untuk deskripsi loker

---

## 🗺️ Roadmap Implementasi

### Week 1-2: Setup & Foundation
- [ ] Setup Next.js + Tailwind + shadcn/ui
- [ ] Setup Supabase connection (reuse JobMate)
- [ ] Create database schema
- [ ] Setup authentication
- [ ] Build base layout (Header, Footer, Sidebar)

### Week 3-4: Public Pages
- [ ] Homepage (hero + loker terbaru + testimonial)
- [ ] Halaman daftar loker (grid + filters)
- [ ] Halaman detail loker
- [ ] Halaman perusahaan (list + detail)
- [ ] Login page

### Week 5-6: Member Dashboard
- [ ] Member dashboard layout
- [ ] Bookmarks feature
- [ ] View history
- [ ] Basic profile settings

### Week 7-8: Admin Dashboard
- [ ] Admin layout + sidebar
- [ ] Form tambah loker (manual)
- [ ] List semua loker (table)
- [ ] Edit/delete loker
- [ ] Manage perusahaan

### Week 9-10: AI Integration
- [ ] Setup Sumpod API wrapper
- [ ] Upload poster component
- [ ] AI parse poster → extract data
- [ ] AI generate description
- [ ] Test & refine prompts

### Week 11-12: Polish & Launch
- [ ] Responsive design polish
- [ ] Performance optimization
- [ ] SEO setup (metadata, sitemap)
- [ ] Analytics integration
- [ ] Testing (manual + E2E)
- [ ] Deploy to Vercel
- [ ] Soft launch ke member VIP grup WA

---

## 🤔 Pertanyaan & Saran

### Pertanyaan untuk Anda:
1. **Member Access**: Apakah semua member JobMate otomatis jadi member VIP, atau hanya yang sudah bayar khusus grup WA?
   - Jika terpisah, butuh field `is_vip_member` di table profiles

2. **Payment Integration**: Apakah payment dilakukan manual (via WA/transfer) atau butuh payment gateway?
   - Manual: admin manual approve member
   - Auto: integrasikan Midtrans/Xendit

3. **Poster Storage**: Poster loker disimpan di Supabase Storage atau external (Cloudinary)?
   - Rekomendasi: Supabase Storage (gratis 1GB)

4. **AI Budget**: Berapa budget untuk Sumpod API calls per bulan?
   - Estimasi: 50 loker/bulan × 2 calls (OCR + LLM) = 100 calls/bulan

5. **Admin Team**: Berapa jumlah admin yang akan manage website ini?
   - Jika > 1 admin, butuh audit log untuk track siapa upload apa

### Saran Tambahan:
1. **SEO-Friendly URLs**: 
   - `/loker/frontend-developer-pt-tech-jombang` (bukan `/loker/123`)
   - Gunakan slug generator

2. **Image Optimization**:
   - Gunakan Next.js Image component
   - Lazy loading untuk poster loker

3. **Caching Strategy**:
   - Cache daftar loker (revalidate setiap 5 menit)
   - Cache detail loker (revalidate on-demand when updated)

4. **Rate Limiting**:
   - Limit AI calls per admin: max 100/day
   - Prevent abuse dari member

5. **Backup Strategy**:
   - Daily backup Supabase database
   - Export loker data as JSON (weekly)

---

## 📞 Next Steps

### Yang Perlu Diputuskan:
1. ✅ Approve design & struktur folder
2. ✅ Confirm database schema
3. ✅ Setup Sumpod AI account & API key
4. ✅ Determine member access logic (JobMate = VIP atau terpisah?)
5. ✅ Choose: manual payment atau payment gateway?

### Siap untuk Implementasi?
Jika Anda approve semuanya, saya siap mulai build:
1. Setup project structure
2. Create database schema
3. Build homepage + loker pages
4. Implement admin dashboard
5. Integrate AI features

**Estimasi waktu total: 8-12 minggu** (tergantung complexity & revisi)

---

## 📝 Final Notes

Proyek ini sangat solid dan well-thought! Konsep eksklusivitas + AI-powered admin tools = winning combination. Beberapa highlight:

✨ **Strengths:**
- Clear target audience (member VIP grup WA)
- Solves real problem (arsip loker sulit dicari)
- Leverage existing JobMate ecosystem
- AI automation saves admin time significantly

⚠️ **Potential Challenges:**
- Content moderation (pastikan loker berkualitas & verified)
- Member retention (butuh update loker konsisten)
- Competition (job boards lain di Jombang)

🎯 **Key Success Factors:**
1. **Update Frequency**: Minimal 5-10 loker baru per minggu
2. **Quality Control**: Semua loker harus verified & akurat
3. **UX**: Website harus cepat & mudah digunakan
4. **Community**: Engage member VIP dengan success stories

---

**Siap untuk mulai?** 🚀

Kalau ada pertanyaan atau butuh klarifikasi, silakan tanya. Saya siap membantu implementasi dari awal sampai selesai!
