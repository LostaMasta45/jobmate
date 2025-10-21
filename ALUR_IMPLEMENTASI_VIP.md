# Alur Implementasi VIP Career - OPSI 1 (Extend JobMate Existing)

## 🎯 Konsep: EXTEND, Bukan Buat Baru

**TIDAK** perlu buat folder/project baru! Kita akan **menambahkan fitur VIP Career ke dalam project JobMate yang sudah ada ini**.

**Analogi:**
- JobMate saat ini = Rumah dengan 1 lantai (Dashboard + Tools)
- Setelah VIP Career = Rumah dengan 2 lantai (Lantai 1: VIP Career, Lantai 2: JobMate Tools)
- Masih 1 rumah, 1 pintu masuk, tapi isinya lebih lengkap

---

## 📂 Struktur Folder - Before vs After

### BEFORE (JobMate Current):
```
JOBMATE/
├── app/
│   ├── (protected)/
│   │   ├── dashboard/          # Dashboard JobMate
│   │   ├── tools/              # CV, Cover Letter, dll
│   │   └── admin/              # Admin existing
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   └── layout.tsx
├── components/
├── lib/
└── ...
```

### AFTER (JobMate + VIP Career):
```
JOBMATE/
├── app/
│   ├── (marketing)/            # 🆕 Landing + Pricing (dikerjakan terakhir)
│   │   ├── page.tsx            # Landing page
│   │   ├── pricing/
│   │   │   └── page.tsx        # Pricing page
│   │   ├── payment/
│   │   │   └── page.tsx        # Payment checkout
│   │   └── success/
│   │       └── page.tsx        # Payment success
│   ├── (vip)/                  # 🆕 VIP Career Dashboard
│   │   └── vip/
│   │       ├── layout.tsx      # Layout dengan VIP sidebar
│   │       ├── page.tsx        # VIP dashboard home
│   │       ├── loker/
│   │       │   ├── page.tsx    # List loker
│   │       │   └── [id]/
│   │       │       └── page.tsx # Detail loker
│   │       ├── perusahaan/
│   │       │   ├── page.tsx
│   │       │   └── [slug]/
│   │       │       └── page.tsx
│   │       ├── saved/
│   │       │   └── page.tsx    # Bookmarks
│   │       └── alerts/
│   │           └── page.tsx    # Job alerts
│   ├── (jobmate)/              # 🔄 Rename dari (protected)
│   │   ├── dashboard/          # Dashboard JobMate (existing)
│   │   ├── tools/              # Tools existing
│   │   └── layout.tsx          # Layout dengan JobMate sidebar
│   ├── (admin)/                # 🔄 Move admin kesini
│   │   └── admin/
│   │       ├── page.tsx        # Admin dashboard (existing + new)
│   │       ├── vip-loker/      # 🆕 Manage loker VIP
│   │       │   ├── page.tsx
│   │       │   └── tambah/
│   │       │       └── page.tsx
│   │       └── ... (existing admin pages)
│   ├── (auth)/                 # Existing auth pages
│   │   ├── login/
│   │   └── register/
│   ├── api/
│   │   ├── vip/                # 🆕 VIP Career APIs
│   │   │   ├── loker/
│   │   │   ├── perusahaan/
│   │   │   └── ai/
│   │   ├── payment/            # 🆕 Payment APIs
│   │   │   ├── create/
│   │   │   └── webhook/
│   │   └── ... (existing APIs)
│   └── layout.tsx
├── components/
│   ├── vip/                    # 🆕 VIP-specific components
│   │   ├── LokerCard.tsx
│   │   ├── LokerFilters.tsx
│   │   └── VIPSidebar.tsx
│   ├── jobmate/                # 🔄 Existing components (optional: organize)
│   ├── layout/                 # Shared layout components
│   │   ├── Sidebar.tsx         # 🔄 Update untuk multi-dashboard
│   │   └── Topbar.tsx
│   └── ui/                     # Existing shadcn/ui
├── lib/
│   ├── vip/                    # 🆕 VIP-specific utilities
│   │   └── loker-utils.ts
│   ├── payment/                # 🆕 Payment integration
│   │   └── midtrans.ts
│   ├── ai/                     # 🆕 AI integration
│   │   └── sumpod.ts
│   └── ... (existing lib)
├── types/
│   ├── vip.ts                  # 🆕 VIP types
│   └── ... (existing types)
└── middleware.ts               # 🔄 Update untuk routing logic
```

**Kesimpulan: Kita TIDAK buat folder baru di luar. Semuanya di dalam folder JOBMATE ini.**

---

## 🚀 Alur Implementasi Step-by-Step

### PHASE 1: Database Setup (Week 1)
**Tujuan:** Siapkan database schema untuk VIP Career + membership system

#### Step 1.1: Create Database Tables
```bash
# Di Supabase SQL Editor, run:
```

```sql
-- File: db/vip-schema-complete.sql

-- 1. Extend profiles table untuk membership
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS membership_tier TEXT CHECK (membership_tier IN ('basic', 'premium', 'admin'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS membership_status TEXT DEFAULT 'inactive' CHECK (membership_status IN ('active', 'inactive', 'expired', 'cancelled'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS membership_started_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS membership_expires_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS wa_number TEXT;

CREATE INDEX IF NOT EXISTS idx_profiles_membership_tier ON profiles(membership_tier);
CREATE INDEX IF NOT EXISTS idx_profiles_membership_status ON profiles(membership_status);

-- 2. Table: vip_perusahaan
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vip_perusahaan_slug ON vip_perusahaan(slug);

-- 3. Table: vip_loker
CREATE TABLE IF NOT EXISTS vip_loker (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  perusahaan_id UUID REFERENCES vip_perusahaan(id),
  perusahaan_name TEXT NOT NULL,
  lokasi TEXT NOT NULL,
  kategori TEXT[],
  tipe_kerja TEXT,
  gaji_min BIGINT,
  gaji_max BIGINT,
  gaji_text TEXT,
  deskripsi TEXT,
  persyaratan TEXT,
  kualifikasi TEXT[],
  deadline DATE,
  sumber TEXT,
  poster_url TEXT,
  status TEXT DEFAULT 'published',
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  apply_count INTEGER DEFAULT 0,
  kontak_wa TEXT,
  kontak_email TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_vip_loker_status ON vip_loker(status);
CREATE INDEX IF NOT EXISTS idx_vip_loker_kategori ON vip_loker USING GIN(kategori);
CREATE INDEX IF NOT EXISTS idx_vip_loker_lokasi ON vip_loker(lokasi);
CREATE INDEX IF NOT EXISTS idx_vip_loker_published_at ON vip_loker(published_at DESC);

-- 4. Table: vip_member_bookmarks
CREATE TABLE IF NOT EXISTS vip_member_bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  loker_id UUID REFERENCES vip_loker(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(member_id, loker_id)
);

CREATE INDEX IF NOT EXISTS idx_vip_bookmarks_member ON vip_member_bookmarks(member_id);

-- 5. Table: vip_job_alerts
CREATE TABLE IF NOT EXISTS vip_job_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nama_alert TEXT NOT NULL,
  kategori TEXT[],
  lokasi TEXT[],
  tipe_kerja TEXT[],
  gaji_min BIGINT,
  is_active BOOLEAN DEFAULT true,
  notif_email BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vip_alerts_member ON vip_job_alerts(member_id);

-- 6. Table: orders (payment tracking)
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_id TEXT NOT NULL,
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

-- 7. Enable RLS
ALTER TABLE vip_perusahaan ENABLE ROW LEVEL SECURITY;
ALTER TABLE vip_loker ENABLE ROW LEVEL SECURITY;
ALTER TABLE vip_member_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE vip_job_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 8. RLS Policies

-- vip_perusahaan: public can read
CREATE POLICY "Public can read perusahaan"
  ON vip_perusahaan FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage perusahaan"
  ON vip_perusahaan FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- vip_loker: public can read published
CREATE POLICY "Public can read published loker"
  ON vip_loker FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admin can manage loker"
  ON vip_loker FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- vip_member_bookmarks: member owns their bookmarks
CREATE POLICY "Member can manage own bookmarks"
  ON vip_member_bookmarks FOR ALL
  USING (member_id = auth.uid());

-- vip_job_alerts: member owns their alerts
CREATE POLICY "Member can manage own alerts"
  ON vip_job_alerts FOR ALL
  USING (member_id = auth.uid());

-- orders: user can read own orders
CREATE POLICY "User can read own orders"
  ON orders FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admin can read all orders"
  ON orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
```

**Action:** 
```bash
# Copy SQL diatas, paste ke Supabase SQL Editor, execute
```

#### Step 1.2: Create Types File
```bash
# Kita akan create file types untuk VIP
```

**Action:** Nanti saya buatkan file `types/vip.ts`

---

### PHASE 2: Core VIP Features (Week 2-5)
**Tujuan:** Build VIP Career dashboard (tanpa landing page dulu)

#### Step 2.1: Update Middleware untuk Routing Logic (Week 2 - Day 1)

**File to modify: `middleware.ts`**

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  const path = request.nextUrl.pathname

  // Public routes - accessible to everyone
  const publicRoutes = ['/', '/pricing', '/payment', '/success']
  if (publicRoutes.some(route => path === route || path.startsWith(route))) {
    return response
  }

  // Auth routes - redirect to dashboard if already logged in
  if (path.startsWith('/login') || path.startsWith('/register')) {
    if (session) {
      return NextResponse.redirect(new URL('/vip', request.url))
    }
    return response
  }

  // Protected routes - require login
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Get user profile with membership info
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, membership_tier, membership_status, membership_expires_at')
    .eq('id', session.user.id)
    .single()

  // Check membership status (skip for admin)
  if (profile?.role !== 'admin') {
    const isActive = profile?.membership_status === 'active' && 
                     (!profile?.membership_expires_at || new Date(profile.membership_expires_at) > new Date())
    
    if (!isActive && !path.startsWith('/pricing') && !path.startsWith('/payment')) {
      return NextResponse.redirect(new URL('/pricing?expired=true', request.url))
    }
  }

  // VIP routes - Basic and Premium can access
  if (path.startsWith('/vip')) {
    if (profile?.role === 'admin' || ['basic', 'premium'].includes(profile?.membership_tier || '')) {
      return response
    }
    return NextResponse.redirect(new URL('/pricing', request.url))
  }

  // JobMate routes (dashboard, tools) - only Premium can access
  if (path.startsWith('/dashboard') || path.startsWith('/tools')) {
    if (profile?.role === 'admin' || profile?.membership_tier === 'premium') {
      return response
    }
    // Basic user trying to access JobMate - redirect to upgrade
    return NextResponse.redirect(new URL('/vip?upgrade=true', request.url))
  }

  // Admin routes - only admin can access
  if (path.startsWith('/admin')) {
    if (profile?.role === 'admin') {
      return response
    }
    return NextResponse.redirect(new URL('/vip', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
```

**Action:** Saya akan update file `middleware.ts`

#### Step 2.2: Create VIP Types (Week 2 - Day 1)

**New file: `types/vip.ts`**

```typescript
export interface Perusahaan {
  id: string
  slug: string
  name: string
  logo_url?: string
  deskripsi?: string
  lokasi?: string
  website?: string
  email?: string
  whatsapp?: string
  instagram?: string
  industri?: string
  created_at: string
  updated_at: string
}

export interface Loker {
  id: string
  title: string
  perusahaan_id?: string
  perusahaan_name: string
  perusahaan?: Perusahaan
  lokasi: string
  kategori: string[]
  tipe_kerja?: string
  gaji_min?: number
  gaji_max?: number
  gaji_text?: string
  deskripsi?: string
  persyaratan?: string
  kualifikasi?: string[]
  deadline?: string
  sumber?: string
  poster_url?: string
  status: 'draft' | 'published' | 'expired' | 'archived'
  is_featured: boolean
  view_count: number
  apply_count: number
  kontak_wa?: string
  kontak_email?: string
  created_by?: string
  created_at: string
  updated_at: string
  published_at?: string
  is_bookmarked?: boolean
}

export interface Bookmark {
  id: string
  member_id: string
  loker_id: string
  loker?: Loker
  created_at: string
}

export interface JobAlert {
  id: string
  member_id: string
  nama_alert: string
  kategori?: string[]
  lokasi?: string[]
  tipe_kerja?: string[]
  gaji_min?: number
  is_active: boolean
  notif_email: boolean
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id: string
  plan_id: 'basic' | 'premium'
  amount: number
  status: 'pending' | 'paid' | 'failed' | 'expired' | 'refunded'
  payment_method?: string
  provider_order_id?: string
  paid_at?: string
  created_at: string
  updated_at: string
}

export interface LokerFilters {
  search?: string
  kategori?: string[]
  lokasi?: string[]
  tipe_kerja?: string
  gaji_min?: number
  gaji_max?: number
  sort?: 'terbaru' | 'deadline' | 'gaji'
}
```

**Action:** Saya akan create file ini

#### Step 2.3: Create VIP Dashboard Layout (Week 2 - Day 2-3)

**New folder structure:**
```
app/(vip)/vip/
├── layout.tsx          # VIP layout dengan sidebar
└── page.tsx            # VIP dashboard home
```

**New file: `app/(vip)/vip/layout.tsx`**

```tsx
import { VIPSidebar } from '@/components/vip/VIPSidebar'
import { Topbar } from '@/components/layout/Topbar'

export default function VIPLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <VIPSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
```

**New file: `components/vip/VIPSidebar.tsx`**

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Briefcase, 
  Building2, 
  Bookmark, 
  Bell,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth' // assume this exists

const menuItems = [
  { href: '/vip', label: 'Dashboard', icon: Home },
  { href: '/vip/loker', label: 'Cari Loker', icon: Briefcase },
  { href: '/vip/perusahaan', label: 'Perusahaan', icon: Building2 },
  { href: '/vip/saved', label: 'Tersimpan', icon: Bookmark },
  { href: '/vip/alerts', label: 'Job Alerts', icon: Bell },
]

export function VIPSidebar() {
  const pathname = usePathname()
  const { profile } = useAuth()
  
  const isBasic = profile?.membership_tier === 'basic'

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-navy-900">VIP Career</h2>
        <Badge variant="outline" className="mt-2">Jombang</Badge>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${isActive 
                  ? 'bg-blue-50 text-blue-700 font-medium' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Upgrade CTA for Basic users */}
      {isBasic && (
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-semibold">Upgrade Premium</h3>
            </div>
            <p className="text-sm text-blue-50 mb-3">
              Dapatkan akses ke JobMate Tools!
            </p>
            <Button 
              asChild 
              size="sm" 
              className="w-full bg-white text-blue-600 hover:bg-blue-50"
            >
              <Link href="/pricing?upgrade=true">
                Upgrade Sekarang
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* Link to JobMate for Premium */}
      {!isBasic && (
        <div className="p-4 border-t border-gray-200">
          <Button asChild variant="outline" className="w-full">
            <Link href="/dashboard" className="flex items-center justify-between">
              <span>Ke JobMate Tools</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      )}
    </aside>
  )
}
```

**Action:** Saya akan create semua file ini

#### Step 2.4: Create VIP Dashboard Home (Week 2 - Day 3)

**New file: `app/(vip)/vip/page.tsx`**

```tsx
import { createClient } from '@/lib/supabase/server'
import { LokerCard } from '@/components/vip/LokerCard'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function VIPDashboardPage() {
  const supabase = createClient()
  
  // Get latest loker
  const { data: loker } = await supabase
    .from('vip_loker')
    .select('*, perusahaan:vip_perusahaan(*)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(6)

  // Get stats
  const { count: totalLoker } = await supabase
    .from('vip_loker')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Selamat Datang di VIP Career Jombang
        </h1>
        <p className="text-gray-600 mt-2">
          Temukan loker terbaru dan terupdate khusus untuk member VIP
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600">Total Loker Aktif</div>
          <div className="text-3xl font-bold text-blue-600 mt-2">
            {totalLoker || 0}
          </div>
        </div>
        {/* Add more stats as needed */}
      </div>

      {/* Latest Loker */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Loker Terbaru</h2>
          <Button asChild variant="outline">
            <Link href="/vip/loker">Lihat Semua</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loker?.map((item) => (
            <LokerCard key={item.id} loker={item} />
          ))}
        </div>
      </div>
    </div>
  )
}
```

**Action:** Saya akan create file ini

#### Step 2.5: Create Loker List & Detail Pages (Week 3)

**Files to create:**
- `app/(vip)/vip/loker/page.tsx` - List loker dengan filters
- `app/(vip)/vip/loker/[id]/page.tsx` - Detail loker
- `components/vip/LokerCard.tsx` - Card component
- `components/vip/LokerFilters.tsx` - Filter component

**Action:** Saya akan create semua file ini dengan implementasi lengkap

#### Step 2.6: Create Bookmark & Job Alerts (Week 4)

**Files to create:**
- `app/(vip)/vip/saved/page.tsx` - Saved loker page
- `app/(vip)/vip/alerts/page.tsx` - Job alerts management
- `components/vip/BookmarkButton.tsx` - Bookmark toggle button

**Action:** Saya akan create semua file ini

---

### PHASE 3: Admin VIP Loker Management (Week 5-6)

#### Step 3.1: Create Admin VIP Loker Pages

**Files to create:**
- `app/(admin)/admin/vip-loker/page.tsx` - List semua loker (table)
- `app/(admin)/admin/vip-loker/tambah/page.tsx` - Form tambah loker + AI
- `components/vip/admin/LokerForm.tsx` - Form component
- `components/vip/admin/PosterUpload.tsx` - Upload & AI parse component

#### Step 3.2: Setup AI Integration (Sumpod atau alternative)

**Files to create:**
- `lib/ai/sumpod.ts` - Sumpod API wrapper
- `app/api/vip/ai/parse-poster/route.ts` - API endpoint

**Action:** Saya akan implement AI poster parsing

---

### PHASE 4: Payment Integration (Week 7-8)

**Dikerjakan setelah VIP Core selesai**

#### Step 4.1: Setup Midtrans
- Daftar Midtrans account
- Get API keys (sandbox dulu)
- Install package: `npm install midtrans-client`

#### Step 4.2: Create Pricing Page
- `app/(marketing)/pricing/page.tsx`

#### Step 4.3: Create Payment Flow
- `app/(marketing)/payment/page.tsx`
- `app/api/payment/create/route.ts`
- `app/api/payment/webhook/route.ts`

---

### PHASE 5: Landing Page (Week 9-10) - TERAKHIR

**Dikerjakan paling akhir setelah semua core features jalan**

#### Files to create:
- `app/(marketing)/page.tsx` - Landing page
- `app/(marketing)/layout.tsx` - Marketing layout
- `components/marketing/Hero.tsx`
- `components/marketing/Features.tsx`
- etc.

---

## 📋 Prioritas Pengerjaan (Summary)

### ✅ Phase 1 (Week 1): Database
1. Run SQL schema di Supabase
2. Create types file
3. Test database access

### ✅ Phase 2 (Week 2-5): VIP Core
1. Update middleware
2. Create VIP layout & sidebar
3. Create VIP dashboard home
4. Create loker list & detail
5. Create bookmark & alerts
6. **Testing: User bisa cari & bookmark loker**

### ✅ Phase 3 (Week 5-6): Admin VIP
1. Admin loker management pages
2. AI poster parsing integration
3. **Testing: Admin bisa upload & publish loker**

### ✅ Phase 4 (Week 7-8): Payment
1. Setup Midtrans
2. Create pricing page
3. Payment checkout & webhook
4. **Testing: User bisa bayar & membership ter-activate**

### ✅ Phase 5 (Week 9-10): Landing Page
1. Create landing page
2. Marketing content
3. SEO optimization
4. **Testing: End-to-end dari landing → pricing → payment → dashboard**

---

## 🎯 Next Action - Mau Mulai Sekarang?

Kalau kamu setuju dengan alur ini, kita bisa **mulai SEKARANG** dengan:

### Action 1: Create Database Schema
```bash
# Saya akan buatkan file SQL lengkap
# Kamu tinggal copy-paste ke Supabase SQL Editor
```

### Action 2: Create VIP Types
```bash
# Saya akan create file types/vip.ts
```

### Action 3: Update Middleware
```bash
# Saya akan update middleware.ts dengan routing logic baru
```

### Action 4: Create VIP Dashboard Basic Structure
```bash
# Saya akan create:
# - app/(vip)/vip/layout.tsx
# - app/(vip)/vip/page.tsx
# - components/vip/VIPSidebar.tsx
```

**Apakah kamu siap untuk saya mulai create semua file-file ini sekarang?**

Atau ada yang ingin didiskusikan/diubah dulu dari alur ini? 🚀
