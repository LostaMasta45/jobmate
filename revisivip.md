# VIP Career InfolokerJombang - Revisi Arsitektur & Business Model

## 🎯 Model Bisnis Final

### Dua Paket Membership

#### 📦 Paket 1: VIP Career Basic - Rp 10.000/bulan
**Yang Didapat:**
- ✅ Akses ke Grup WhatsApp VIP Career InfolokerJombang
- ✅ Akses penuh ke website VIP Career (cari & lihat semua loker)
- ✅ Fitur bookmark & job alerts
- ✅ Notifikasi loker baru

**Target Market:** Job seekers yang hanya butuh info loker terupdate

#### 📦 Paket 2: VIP Career Premium - Rp 39.000/bulan
**Yang Didapat:**
- ✅ Semua fitur Paket 1
- ✅ **PLUS** Akses penuh ke JobMate Dashboard (All Tools):
  - CV ATS Generator
  - Cover Letter Generator
  - Surat Lamaran Generator
  - WhatsApp Message Generator
  - Email Generator
  - PDF Tools (merge, split, compress)
  - Follow-up Tracker & Kanban
  - Application Tracker

**Target Market:** Job seekers yang serius & butuh tools lengkap untuk apply kerja

---

## 🏗️ Arsitektur Sistem - Rekomendasi Terbaik

### ✅ **OPSI 1: MONOREPO - Single App, Multi-Dashboard (RECOMMENDED)**

**Struktur:**
```
https://jobmate.id                    → Landing page utama
https://jobmate.id/pricing            → Halaman pricing & payment
https://jobmate.id/vip                → Dashboard VIP Career (Basic + Premium)
https://jobmate.id/dashboard          → Dashboard JobMate (Premium only)
https://jobmate.id/admin              → Admin dashboard (manage both)
```

**Kenapa ini terbaik:**

#### ✅ Kelebihan:
1. **Single Codebase** - Mudah maintain, 1 deployment, 1 database
2. **Shared Authentication** - User sekali login, bisa akses semua sesuai tier
3. **Seamless Upgrade** - User Basic bisa upgrade ke Premium tanpa logout/pindah akun
4. **Shared Components** - Navbar, Footer, UI components bisa reuse
5. **Single Supabase Instance** - Hemat biaya, mudah manage RLS policies
6. **Better SEO** - Satu domain authority, tidak split
7. **Easier Analytics** - Track user journey dari pricing → payment → usage dalam 1 app

#### ⚠️ Kekurangan:
1. Bundle size besar (tapi bisa diatasi dengan code splitting)
2. Butuh routing & middleware yang rapi

#### 🔧 Implementasi:

**Folder Structure:**
```
jobmate/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx                    # Landing page utama
│   │   ├── pricing/page.tsx            # Pricing & comparison
│   │   ├── payment/page.tsx            # Payment page
│   │   └── success/page.tsx            # Payment success
│   ├── (vip)/                          # VIP Career Dashboard
│   │   └── vip/
│   │       ├── layout.tsx              # VIP-specific layout
│   │       ├── page.tsx                # VIP dashboard home
│   │       ├── loker/
│   │       │   ├── page.tsx            # List loker
│   │       │   └── [id]/page.tsx       # Detail loker
│   │       ├── perusahaan/
│   │       │   ├── page.tsx
│   │       │   └── [slug]/page.tsx
│   │       ├── saved/page.tsx          # Bookmarks
│   │       └── alerts/page.tsx         # Job alerts
│   ├── (jobmate)/                      # JobMate Dashboard (Premium only)
│   │   └── dashboard/
│   │       ├── layout.tsx              # JobMate-specific layout
│   │       ├── page.tsx                # Dashboard home
│   │       └── ... (existing JobMate pages)
│   ├── (admin)/
│   │   └── admin/
│   │       ├── page.tsx                # Admin dashboard
│   │       ├── vip-loker/              # Manage loker
│   │       ├── members/                # Manage members
│   │       └── analytics/              # Analytics both platforms
│   └── api/
│       ├── vip/                        # VIP Career APIs
│       ├── payment/                    # Payment webhook
│       └── ... (existing JobMate APIs)
├── components/
│   ├── vip/                            # VIP-specific components
│   ├── jobmate/                        # JobMate-specific components
│   └── shared/                         # Shared components
└── middleware.ts                       # Role-based routing
```

**Middleware untuk Access Control:**
```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);
  const { data: { session } } = await supabase.auth.getSession();
  
  const path = request.nextUrl.pathname;
  
  // Public routes
  if (path === '/' || path.startsWith('/pricing') || path.startsWith('/payment')) {
    return response;
  }
  
  // Protected routes - require login
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Get user profile with membership info
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, membership_tier, membership_status, membership_expires_at')
    .eq('id', session.user.id)
    .single();
  
  // Check membership status
  const isActive = profile?.membership_status === 'active' && 
                   (!profile?.membership_expires_at || new Date(profile.membership_expires_at) > new Date());
  
  if (!isActive && !path.startsWith('/pricing')) {
    return NextResponse.redirect(new URL('/pricing?expired=true', request.url));
  }
  
  // VIP routes - both Basic and Premium can access
  if (path.startsWith('/vip')) {
    if (!['basic', 'premium'].includes(profile?.membership_tier)) {
      return NextResponse.redirect(new URL('/pricing', request.url));
    }
    return response;
  }
  
  // JobMate routes - only Premium can access
  if (path.startsWith('/dashboard') || path.startsWith('/tools')) {
    if (profile?.membership_tier !== 'premium') {
      return NextResponse.redirect(new URL('/vip?upgrade=true', request.url));
    }
    return response;
  }
  
  // Admin routes
  if (path.startsWith('/admin')) {
    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/vip', request.url));
    }
    return response;
  }
  
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
```

---

### 🔄 **OPSI 2: SUBDOMAIN - Separate Apps (Alternative)**

**Struktur:**
```
https://jobmate.id                    → Landing + Pricing + Payment
https://career.jobmate.id             → VIP Career Dashboard (Basic + Premium)
https://app.jobmate.id                → JobMate Dashboard (Premium only)
https://admin.jobmate.id              → Admin dashboard
```

#### ✅ Kelebihan:
1. **Clear Separation** - Masing-masing app punya identity jelas
2. **Independent Deployment** - Deploy VIP Career tanpa affect JobMate
3. **Better Performance** - Bundle size lebih kecil per app
4. **Easier Team Collaboration** - Tim bisa fokus di app masing-masing

#### ⚠️ Kekurangan:
1. **Multiple Deployments** - Butuh 3-4 Vercel projects
2. **Code Duplication** - Shared components harus di-package terpisah (monorepo tools)
3. **Authentication Complexity** - Butuh cookie sharing across subdomains
4. **More Expensive** - Multiple deployments = more Vercel usage
5. **SEO Split** - Domain authority terbagi

#### 🔧 Implementasi:

**Monorepo dengan Turborepo:**
```
jobmate-monorepo/
├── apps/
│   ├── main/                          # jobmate.id
│   │   └── app/
│   │       ├── page.tsx               # Landing page
│   │       ├── pricing/
│   │       └── payment/
│   ├── career/                        # career.jobmate.id
│   │   └── app/
│   │       └── (dashboard)/
│   │           ├── page.tsx           # VIP dashboard
│   │           └── loker/
│   ├── jobmate/                       # app.jobmate.id
│   │   └── app/
│   │       └── (dashboard)/
│   │           └── ... (existing JobMate)
│   └── admin/                         # admin.jobmate.id
│       └── app/
│           └── (admin)/
├── packages/
│   ├── ui/                            # Shared UI components
│   ├── database/                      # Supabase client & types
│   ├── auth/                          # Shared auth logic
│   └── config/                        # Shared config
├── turbo.json
└── package.json
```

**Cookie Sharing untuk Auth:**
```typescript
// Supabase cookie harus set dengan domain: .jobmate.id
// Sehingga bisa diakses dari career.jobmate.id dan app.jobmate.id

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: {
      getItem: (key) => getCookie(key),
      setItem: (key, value) => {
        setCookie(key, value, {
          domain: '.jobmate.id', // ← Important!
          secure: true,
          sameSite: 'lax'
        });
      },
      removeItem: (key) => deleteCookie(key)
    }
  }
});
```

---

### 🚫 **OPSI 3: Separate Domains (NOT RECOMMENDED)**

**Contoh:**
```
https://jobmate.id        → JobMate Dashboard
https://careervip.id      → VIP Career Dashboard
```

#### ❌ Kenapa tidak recommended:
1. Butuh 2 domain → biaya domain lebih
2. Butuh 2 branding → confusing untuk user
3. Authentication tidak bisa shared → user harus login 2 kali
4. Database terpisah atau butuh cross-domain auth (kompleks)
5. Payment system harus track 2 domain
6. SEO completely split

---

## 🏆 Rekomendasi Final: **OPSI 1 - MONOREPO Single App**

### Alasan Teknis:
1. **Simplicity** - 1 app, 1 deployment, 1 database, 1 auth system
2. **Cost Effective** - 1 Vercel project, 1 domain, 1 Supabase instance
3. **Better UX** - User tidak bingung, seamless upgrade path
4. **Easier Maintenance** - Update shared components langsung reflect ke semua dashboard
5. **Unified Analytics** - Track user behavior across pricing → VIP → JobMate

### Implementasi Strategy:

#### 1. **Navigation & Branding**

**Global Navbar (untuk semua halaman):**
```tsx
// components/shared/GlobalNav.tsx
export function GlobalNav() {
  const { user, profile } = useAuth();
  
  return (
    <nav>
      <Logo />
      <NavLinks>
        <Link href="/">Home</Link>
        <Link href="/pricing">Pricing</Link>
        
        {user && (
          <>
            {/* VIP Career link - visible for Basic & Premium */}
            {['basic', 'premium'].includes(profile?.membership_tier) && (
              <Link href="/vip">
                <BriefcaseIcon /> VIP Career
              </Link>
            )}
            
            {/* JobMate link - visible only for Premium */}
            {profile?.membership_tier === 'premium' && (
              <Link href="/dashboard">
                <LayoutDashboardIcon /> JobMate Tools
              </Link>
            )}
          </>
        )}
      </NavLinks>
      
      <UserMenu />
    </nav>
  );
}
```

**VIP Career Sidebar (ketika di /vip/*):**
```tsx
// components/vip/VIPSidebar.tsx
export function VIPSidebar() {
  return (
    <aside>
      <SidebarHeader>
        <h2>VIP Career</h2>
        <Badge>Jombang</Badge>
      </SidebarHeader>
      
      <SidebarMenu>
        <MenuItem href="/vip" icon={HomeIcon}>Dashboard</MenuItem>
        <MenuItem href="/vip/loker" icon={BriefcaseIcon}>Cari Loker</MenuItem>
        <MenuItem href="/vip/perusahaan" icon={BuildingIcon}>Perusahaan</MenuItem>
        <MenuItem href="/vip/saved" icon={BookmarkIcon}>Tersimpan</MenuItem>
        <MenuItem href="/vip/alerts" icon={BellIcon}>Job Alerts</MenuItem>
      </SidebarMenu>
      
      {/* Upgrade CTA for Basic users */}
      {profile?.membership_tier === 'basic' && (
        <UpgradeCard>
          <h3>Upgrade ke Premium</h3>
          <p>Dapatkan akses ke JobMate Tools!</p>
          <Button href="/pricing?upgrade=true">Upgrade Sekarang</Button>
        </UpgradeCard>
      )}
      
      <SidebarFooter>
        <Button href="/dashboard" variant="outline" fullWidth>
          <ArrowRightIcon /> Ke JobMate Tools
        </Button>
      </SidebarFooter>
    </aside>
  );
}
```

**JobMate Sidebar (ketika di /dashboard/*):**
```tsx
// components/jobmate/JobMateSidebar.tsx (existing, modified)
export function JobMateSidebar() {
  return (
    <aside>
      <SidebarHeader>
        <h2>JobMate</h2>
        <Badge variant="premium">Premium</Badge>
      </SidebarHeader>
      
      <SidebarMenu>
        <MenuItem href="/dashboard">Dashboard</MenuItem>
        <MenuItem href="/dashboard/tracker">Tracker</MenuItem>
        <MenuItem href="/tools/cv-generator">CV Generator</MenuItem>
        <MenuItem href="/tools/cover-letter">Cover Letter</MenuItem>
        {/* ... existing menu items */}
      </SidebarMenu>
      
      <SidebarFooter>
        <Button href="/vip" variant="outline" fullWidth>
          <ArrowLeftIcon /> Ke VIP Career
        </Button>
      </SidebarFooter>
    </aside>
  );
}
```

#### 2. **Layout Structure**

```tsx
// app/(vip)/vip/layout.tsx
export default function VIPLayout({ children }) {
  return (
    <div className="flex h-screen">
      <VIPSidebar />
      <main className="flex-1 overflow-y-auto">
        <GlobalNav />
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

// app/(jobmate)/dashboard/layout.tsx
export default function JobMateLayout({ children }) {
  return (
    <div className="flex h-screen">
      <JobMateSidebar />
      <main className="flex-1 overflow-y-auto">
        <GlobalNav />
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
```

---

## 💳 Landing Page & Payment Flow

### Halaman Pricing (/pricing)

**Design Structure:**
```
┌────────────────────────────────────────────────────────────┐
│ [Global Nav: Logo | Home | Pricing | Login/Signup]        │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  Hero Section                                              │
│  Pilih Paket yang Sesuai untuk Karir Anda                 │
│  Akses loker eksklusif Jombang + tools apply kerja        │
│                                                             │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌────────────────────┐    ┌────────────────────┐         │
│  │  VIP CAREER BASIC  │    │ VIP CAREER PREMIUM │         │
│  │                    │    │   [MOST POPULAR]   │         │
│  │  Rp 10.000/bulan   │    │  Rp 39.000/bulan   │         │
│  │                    │    │                    │         │
│  │  ✓ Grup WA VIP     │    │  ✓ Semua fitur     │         │
│  │  ✓ Akses Web VIP   │    │    Basic           │         │
│  │  ✓ Cari Loker      │    │  ✓ JobMate Tools:  │         │
│  │  ✓ Bookmark        │    │    - CV Generator  │         │
│  │  ✓ Job Alerts      │    │    - Cover Letter  │         │
│  │                    │    │    - Surat Lamaran │         │
│  │                    │    │    - WA Generator  │         │
│  │  [Pilih Basic]     │    │    - PDF Tools     │         │
│  │                    │    │    - Tracker       │         │
│  └────────────────────┘    │                    │         │
│                            │  [Pilih Premium]   │         │
│                            └────────────────────┘         │
│                                                             │
├────────────────────────────────────────────────────────────┤
│  Comparison Table                                          │
│  [Detailed feature comparison]                             │
├────────────────────────────────────────────────────────────┤
│  FAQ                                                       │
│  - Apakah bisa upgrade nanti?                             │
│  - Bagaimana cara pembayaran?                             │
│  - Apakah ada free trial?                                 │
└────────────────────────────────────────────────────────────┘
```

**Pricing Page Component:**
```tsx
// app/(marketing)/pricing/page.tsx
export default function PricingPage() {
  const { user } = useAuth();
  
  const plans = [
    {
      id: 'basic',
      name: 'VIP Career Basic',
      price: 10000,
      interval: 'bulan',
      features: [
        'Akses Grup WhatsApp VIP',
        'Akses penuh website VIP Career',
        'Cari & lihat semua loker',
        'Bookmark loker favorit',
        'Job alerts notifikasi',
        'Update loker real-time'
      ],
      cta: 'Pilih Basic',
      popular: false
    },
    {
      id: 'premium',
      name: 'VIP Career Premium',
      price: 39000,
      interval: 'bulan',
      features: [
        'Semua fitur VIP Career Basic',
        '✨ CV ATS Generator',
        '✨ Cover Letter Generator',
        '✨ Surat Lamaran Generator',
        '✨ WhatsApp Message Generator',
        '✨ Email Generator',
        '✨ PDF Tools (merge, split, compress)',
        '✨ Application Tracker & Kanban',
        '✨ Follow-up Reminder System'
      ],
      cta: 'Pilih Premium',
      popular: true
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <GlobalNav />
      
      {/* Hero */}
      <section className="py-20 text-center">
        <h1 className="text-5xl font-bold mb-4">
          Pilih Paket yang Sesuai untuk Karir Anda
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Akses loker eksklusif Jombang + tools profesional untuk apply kerja dengan percaya diri
        </p>
      </section>
      
      {/* Pricing Cards */}
      <section className="pb-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {plans.map(plan => (
            <PricingCard
              key={plan.id}
              plan={plan}
              onSelect={() => handleSelectPlan(plan.id)}
            />
          ))}
        </div>
      </section>
      
      {/* Comparison Table */}
      <section className="py-20 bg-gray-50">
        <ComparisonTable />
      </section>
      
      {/* FAQ */}
      <section className="py-20">
        <FAQ />
      </section>
    </div>
  );
}
```

### Halaman Payment (/payment)

**Flow:**
1. User klik "Pilih Basic" atau "Pilih Premium"
2. Redirect ke `/payment?plan=basic` atau `/payment?plan=premium`
3. User pilih metode payment (Bank Transfer / QRIS / E-Wallet)
4. Generate payment link atau QR code
5. User bayar
6. Webhook dari payment gateway → update membership status
7. Redirect ke `/success?plan=basic`

**Payment Integration Options:**

#### Option A: **Midtrans** (Recommended untuk Indonesia)
```typescript
// lib/payment/midtrans.ts
import Midtrans from 'midtrans-client';

const snap = new Midtrans.Snap({
  isProduction: process.env.NODE_ENV === 'production',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
});

export async function createTransaction(data: {
  orderId: string;
  amount: number;
  customerDetails: {
    email: string;
    name: string;
  };
  itemDetails: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
}) {
  const transaction = await snap.createTransaction({
    transaction_details: {
      order_id: data.orderId,
      gross_amount: data.amount
    },
    customer_details: data.customerDetails,
    item_details: data.itemDetails,
    enabled_payments: ['bank_transfer', 'gopay', 'shopeepay', 'qris']
  });
  
  return transaction;
}
```

**Payment Page:**
```tsx
// app/(marketing)/payment/page.tsx
'use client';

export default function PaymentPage({ searchParams }: { searchParams: { plan: string } }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const plan = searchParams.plan === 'premium' ? {
    id: 'premium',
    name: 'VIP Career Premium',
    price: 39000
  } : {
    id: 'basic',
    name: 'VIP Career Basic',
    price: 10000
  };
  
  const handlePayment = async () => {
    setLoading(true);
    
    try {
      // Create order in database
      const { data: order } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          plan_id: plan.id,
          amount: plan.price,
          status: 'pending'
        })
        .select()
        .single();
      
      // Create Midtrans transaction
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          planId: plan.id,
          amount: plan.price
        })
      });
      
      const { token } = await response.json();
      
      // Open Midtrans Snap popup
      window.snap.pay(token, {
        onSuccess: (result) => {
          // Redirect to success page
          window.location.href = `/success?order=${order.id}`;
        },
        onPending: (result) => {
          // Show pending message
          alert('Pembayaran pending, mohon selesaikan pembayaran');
        },
        onError: (result) => {
          // Show error
          alert('Pembayaran gagal');
        }
      });
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        
        <div className="border-b pb-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
          <p className="text-gray-600">Langganan bulanan</p>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>Rp {plan.price.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>Rp {plan.price.toLocaleString('id-ID')}</span>
          </div>
        </div>
        
        <Button
          onClick={handlePayment}
          disabled={loading}
          size="lg"
          className="w-full"
        >
          {loading ? 'Memproses...' : 'Bayar Sekarang'}
        </Button>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Metode pembayaran: Bank Transfer, GoPay, ShopeePay, QRIS</p>
        </div>
      </div>
    </div>
  );
}
```

#### Webhook Handler:
```typescript
// app/api/payment/webhook/route.ts
import { NextRequest } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Verify signature dari Midtrans
  const serverKey = process.env.MIDTRANS_SERVER_KEY!;
  const hash = crypto
    .createHash('sha512')
    .update(`${body.order_id}${body.status_code}${body.gross_amount}${serverKey}`)
    .digest('hex');
  
  if (hash !== body.signature_key) {
    return Response.json({ error: 'Invalid signature' }, { status: 401 });
  }
  
  const orderId = body.order_id;
  const status = body.transaction_status;
  
  // Update order status
  await supabase
    .from('orders')
    .update({ 
      status: status === 'settlement' ? 'paid' : status,
      payment_method: body.payment_type,
      paid_at: status === 'settlement' ? new Date().toISOString() : null
    })
    .eq('id', orderId);
  
  // If payment success, activate membership
  if (status === 'settlement') {
    const { data: order } = await supabase
      .from('orders')
      .select('user_id, plan_id')
      .eq('id', orderId)
      .single();
    
    // Update user profile
    await supabase
      .from('profiles')
      .update({
        membership_tier: order.plan_id, // 'basic' or 'premium'
        membership_status: 'active',
        membership_started_at: new Date().toISOString(),
        membership_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      })
      .eq('id', order.user_id);
    
    // Send confirmation email
    // Send WA invitation to VIP group
    await sendWAInvitation(order.user_id);
  }
  
  return Response.json({ success: true });
}

async function sendWAInvitation(userId: string) {
  // TODO: Integrate with WhatsApp Business API
  // atau manual: admin akan kirim invite link ke nomor WA user
}
```

---

## 💾 Database Schema Update

### Table: `profiles` (extend existing)
```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS membership_tier TEXT CHECK (membership_tier IN ('basic', 'premium', 'admin'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS membership_status TEXT DEFAULT 'inactive' CHECK (membership_status IN ('active', 'inactive', 'expired', 'cancelled'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS membership_started_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS membership_expires_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS wa_number TEXT; -- untuk invite ke grup WA
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS wa_invite_sent BOOLEAN DEFAULT false;

-- Index untuk performa
CREATE INDEX idx_profiles_membership_tier ON profiles(membership_tier);
CREATE INDEX idx_profiles_membership_status ON profiles(membership_status);
CREATE INDEX idx_profiles_membership_expires ON profiles(membership_expires_at);
```

### Table: `orders` (new)
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_id TEXT NOT NULL, -- 'basic' or 'premium'
  amount BIGINT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'expired', 'refunded')),
  payment_method TEXT, -- 'bank_transfer', 'gopay', 'shopeepay', 'qris'
  payment_provider TEXT DEFAULT 'midtrans',
  provider_order_id TEXT, -- order ID dari Midtrans
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
```

### Table: `subscriptions` (recurring tracking)
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_id TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  current_period_start TIMESTAMPTZ DEFAULT NOW(),
  current_period_end TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
```

### Table: `vip_wa_invitations` (tracking WA invites)
```sql
CREATE TABLE vip_wa_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  wa_number TEXT NOT NULL,
  invite_link TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'joined', 'failed')),
  sent_at TIMESTAMPTZ,
  joined_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX idx_wa_invitations_status ON vip_wa_invitations(status);
```

---

## 🎨 Design System untuk 3 Sections

### 1. Landing Page (Marketing)
**Theme:** Modern, vibrant, conversion-focused
- Primary color: Blue (#2563EB)
- Accent: Gold (#F59E0B)
- Large hero images
- Clear CTAs
- Social proof (testimonials, stats)

### 2. VIP Career Dashboard
**Theme:** Professional, clean, loker-focused
- Primary: Navy Blue (#1E3A8A)
- Secondary: Light Blue (#3B82F6)
- Card-based layout
- Focus: loker cards dengan info jelas
- Sidebar: simple navigation

### 3. JobMate Dashboard
**Theme:** Productive, tools-focused (existing)
- Keep existing theme & colors
- Tools-oriented layout
- Sidebar with all tools
- Dashboard widgets

**Unified Elements (across all):**
- Same navbar (top)
- Same font (Inter)
- Same button styles
- Same form inputs
- Consistent spacing (4px grid)

---

## 🚀 User Journey

### Journey 1: New User (Dari Zero ke Basic)
```
1. User buka https://jobmate.id
2. Lihat landing page: "Temukan loker Jombang + Tools apply kerja"
3. Klik "Lihat Paket" → redirect ke /pricing
4. Bandingkan Basic vs Premium
5. Klik "Pilih Basic" → redirect ke /payment?plan=basic
6. Isi data (jika belum login, diminta login/register dulu)
7. Bayar via Midtrans (Bank Transfer / GoPay / dll)
8. Payment success → redirect ke /success
9. Email confirmation diterima
10. WhatsApp invitation ke grup VIP dikirim oleh admin
11. User login → redirect ke /vip (VIP Career Dashboard)
12. User bisa cari loker, bookmark, set job alerts
13. User lihat banner "Upgrade ke Premium" di sidebar
```

### Journey 2: Basic User Upgrade ke Premium
```
1. User login dengan akun Basic
2. Di /vip, lihat banner "Upgrade ke Premium - Dapatkan JobMate Tools!"
3. Klik "Upgrade" → redirect ke /pricing?upgrade=true
4. Lihat comparison dengan highlight "You're here" di Basic
5. Klik "Upgrade ke Premium"
6. Redirect ke /payment?plan=premium&upgrade=true
7. Bayar selisih harga (Rp 29.000 untuk bulan berjalan)
8. Payment success
9. Membership tier di-update dari 'basic' ke 'premium'
10. User refresh → sekarang bisa akses /dashboard (JobMate)
11. Navbar sekarang tampil 2 link: "VIP Career" dan "JobMate Tools"
12. User bisa toggle antar dashboard
```

### Journey 3: Admin Manage Loker
```
1. Admin login
2. Redirect ke /admin (karena role = admin)
3. Dashboard menampilkan stats: loker aktif, member aktif, views, dll
4. Klik "Tambah Loker"
5. Upload poster loker (foto/gambar)
6. Klik "Parse dengan AI"
7. AI extract data dari poster → auto-fill form
8. Admin review & edit jika perlu
9. Klik "Publikasikan"
10. Loker langsung muncul di /vip/loker
11. Member yang set job alert sesuai kategori → dapat notifikasi
```

---

## 📊 Analytics & Tracking

### Events to Track

#### Landing & Pricing
- `page_view_landing`
- `page_view_pricing`
- `click_pilih_basic`
- `click_pilih_premium`
- `click_upgrade_banner`

#### Payment
- `payment_initiated` (plan_id)
- `payment_success` (plan_id, amount)
- `payment_failed` (plan_id, reason)

#### VIP Career Usage
- `vip_loker_search` (query, filters)
- `vip_loker_view` (loker_id)
- `vip_loker_bookmark` (loker_id)
- `vip_loker_apply_click` (loker_id, method: 'wa' | 'email')
- `vip_job_alert_created` (kategori, lokasi)

#### JobMate Usage (existing + new)
- Track usage per tool
- Premium user vs Basic user comparison

#### Conversion Funnels
```
Landing → Pricing → Payment → Success
  100%      60%       40%       35%

VIP Basic → Upgrade Banner Click → Payment → Premium
  100%              15%               10%        8%
```

### Implementation dengan Supabase + Vercel Analytics
```typescript
// lib/analytics.ts
export function trackEvent(event: string, properties?: Record<string, any>) {
  // Vercel Analytics
  if (typeof window !== 'undefined') {
    window.va?.track(event, properties);
  }
  
  // Supabase analytics table (for custom queries)
  supabase.from('analytics_events').insert({
    event,
    properties,
    user_id: getCurrentUserId(),
    timestamp: new Date().toISOString()
  });
}

// Usage
trackEvent('payment_success', {
  plan_id: 'premium',
  amount: 39000,
  payment_method: 'gopay'
});
```

---

## 🔔 Notification System

### 1. **Email Notifications**
- Welcome email (after payment)
- Payment receipt
- Membership expiring soon (7 days before)
- New loker matching job alerts
- Upgrade reminder untuk Basic users

**Implementation dengan Resend:**
```typescript
// lib/email/resend.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(user: User, plan: string) {
  await resend.emails.send({
    from: 'Career VIP Jombang <noreply@jobmate.id>',
    to: user.email,
    subject: `Selamat Bergabung di VIP Career ${plan === 'premium' ? 'Premium' : 'Basic'}!`,
    react: WelcomeEmailTemplate({ user, plan })
  });
}

export async function sendJobAlertEmail(user: User, loker: Loker[]) {
  await resend.emails.send({
    from: 'Career VIP Jombang <noreply@jobmate.id>',
    to: user.email,
    subject: `${loker.length} Loker Baru Sesuai Kriteria Anda`,
    react: JobAlertEmailTemplate({ user, loker })
  });
}
```

### 2. **WhatsApp Notifications** (Future)
- Manual untuk MVP: Admin kirim invite manual
- Auto (Phase 2): Integrate dengan WhatsApp Business API

### 3. **In-App Notifications**
- Toast notifications untuk actions (bookmark saved, alert created)
- Notification bell di navbar (untuk job alerts, system messages)

---

## 🛡️ Security & Performance

### Security Checklist
- ✅ Row Level Security (RLS) untuk semua tables
- ✅ API route protection dengan middleware
- ✅ Payment webhook signature verification
- ✅ Rate limiting untuk AI calls
- ✅ Input validation & sanitization
- ✅ HTTPS only (enforced by Vercel)
- ✅ Environment variables never exposed to client

### Performance Optimization
- ✅ Image optimization (Next.js Image)
- ✅ Code splitting by route groups
- ✅ React Server Components untuk data fetching
- ✅ Caching strategies:
  - Loker list: revalidate every 5 minutes
  - Loker detail: revalidate on-demand
  - User profile: cache di client side
- ✅ Database indexes untuk query optimization
- ✅ Lazy loading untuk heavy components

---

## 💡 Additional Features (Phase 2)

### 1. Referral Program
- User dapat referral code unique
- Share referral link → teman daftar → both dapat 1 bulan gratis
- Leaderboard: Top referrers

### 2. Success Stories
- Member bisa submit success story: "Saya diterima kerja lewat Career VIP"
- Admin approve → tampil di landing page
- Social proof yang powerful

### 3. Company Partnership
- Perusahaan bisa register untuk post loker sendiri
- Pay per posting atau subscription
- Verified badge untuk perusahaan partner

### 4. Mobile App
- React Native app untuk iOS & Android
- Push notifications
- Offline mode untuk bookmarked loker

### 5. AI Career Coach
- Chatbot AI untuk career advice
- CV review & suggestions
- Interview preparation tips

---

## 📝 Migration Plan (dari JobMate existing)

### Step 1: Database Migration
```sql
-- Add new columns to profiles table
ALTER TABLE profiles ADD COLUMN membership_tier TEXT;
ALTER TABLE profiles ADD COLUMN membership_status TEXT DEFAULT 'inactive';
ALTER TABLE profiles ADD COLUMN membership_started_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN membership_expires_at TIMESTAMPTZ;

-- Create new tables
-- (run all CREATE TABLE statements from above)

-- Migrate existing users
-- Jika ingin existing JobMate users dapat access premium:
UPDATE profiles 
SET 
  membership_tier = 'premium',
  membership_status = 'active',
  membership_started_at = NOW(),
  membership_expires_at = NOW() + INTERVAL '30 days'
WHERE role = 'user'; -- atau filter specific users
```

### Step 2: Code Migration
1. Create new route groups: `(marketing)`, `(vip)`, existing `(protected)` jadi `(jobmate)`
2. Move existing pages ke `(jobmate)` group
3. Update middleware untuk new routing
4. Create new VIP components
5. Test authentication flow

### Step 3: Content Migration
1. Populate `vip_perusahaan` table dengan data perusahaan di Jombang
2. Create initial loker posts (at least 10-20)
3. Prepare marketing materials (landing page copy, images, testimonials)

### Step 4: Testing
1. Test Basic user flow
2. Test Premium user flow
3. Test upgrade flow
4. Test payment integration (sandbox mode)
5. Test admin loker management
6. Test AI poster parsing

### Step 5: Soft Launch
1. Deploy to staging
2. Invite beta users (10-20 people)
3. Gather feedback
4. Fix bugs
5. Production deployment

---

## 🎯 Success Metrics & KPIs

### Month 1 Goals
- 50 members (30 Basic + 20 Premium)
- 30 active loker
- 500+ loker views
- 20+ job applications tracked

### Month 3 Goals
- 200 members (100 Basic + 100 Premium)
- 100 active loker
- 3,000+ loker views
- 100+ job applications
- 10% upgrade rate (Basic → Premium)

### Month 6 Goals
- 500 members (200 Basic + 300 Premium)
- 200+ active loker
- 10,000+ loker views
- 500+ job applications
- 5+ company partnerships
- 20% of members have success stories

---

## 💰 Revenue Projection

### Conservative Estimate
```
Month 1:
- 30 Basic × Rp 10,000 = Rp 300,000
- 20 Premium × Rp 39,000 = Rp 780,000
Total: Rp 1,080,000

Month 3:
- 100 Basic × Rp 10,000 = Rp 1,000,000
- 100 Premium × Rp 39,000 = Rp 3,900,000
Total: Rp 4,900,000

Month 6:
- 200 Basic × Rp 10,000 = Rp 2,000,000
- 300 Premium × Rp 39,000 = Rp 11,700,000
Total: Rp 13,700,000/bulan

Annual Revenue (Month 6 rate): ~Rp 164,400,000
```

### Costs Estimate
```
Fixed Monthly:
- Domain: Rp 20,000/bulan
- Supabase Pro: ~Rp 400,000/bulan (if needed, otherwise free tier OK)
- Vercel Pro: ~Rp 300,000/bulan
- Midtrans fees: 2-3% per transaction
- Sumpod AI: ~Rp 500,000/bulan (estimate)

Total Fixed: ~Rp 1,220,000/bulan

Variable:
- WhatsApp Business API: ~Rp 500 per message
- Email (Resend): ~Rp 100 per email
- SMS (jika ada): ~Rp 300 per SMS

Profit Margin (Month 6): 
Rp 13,700,000 - Rp 1,220,000 = Rp 12,480,000 (~91%)
```

---

## 🏁 Final Recommendation

### Implementasi: **OPSI 1 - Monorepo Single App**

**Alasan:**
1. ✅ Simplicity - 1 codebase, 1 deployment, easy maintenance
2. ✅ Cost effective - 1 domain, 1 Vercel project, 1 Supabase
3. ✅ Better UX - Seamless authentication & navigation
4. ✅ Unified brand - jobmate.id untuk semua
5. ✅ Easy upgrades - Basic → Premium tanpa komplikasi
6. ✅ Single analytics - Track full user journey

**URLs:**
```
https://jobmate.id              → Landing page + marketing
https://jobmate.id/pricing      → Pricing & plans comparison
https://jobmate.id/payment      → Checkout & payment
https://jobmate.id/vip          → VIP Career Dashboard (Basic + Premium)
https://jobmate.id/dashboard    → JobMate Tools (Premium only)
https://jobmate.id/admin        → Admin panel (Admin only)
```

**Authentication Flow:**
- Login sekali → akses semua sesuai membership tier
- Basic: dapat akses `/vip/*`
- Premium: dapat akses `/vip/*` + `/dashboard/*`
- Admin: dapat akses semua

**Navigation:**
- Global navbar (top): Logo | Home | Pricing | VIP Career | JobMate Tools | Profile
- VIP Career Sidebar (left, ketika di /vip/*)
- JobMate Sidebar (left, ketika di /dashboard/*)
- Easy toggle between dashboards

---

## 📋 Next Steps

### Yang Perlu Diputuskan:
1. ✅ Approve architecture (Monorepo Single App)
2. ✅ Setup Midtrans account untuk payment
3. ✅ Setup Sumpod AI account (atau alternative OCR + LLM)
4. ✅ Prepare content:
   - Landing page copy
   - Testimonials
   - Initial loker data (10-20 loker)
   - Perusahaan data Jombang
5. ✅ WhatsApp group setup:
   - Create grup WA VIP Career
   - Prepare invitation message template

### Timeline Estimasi:
```
Week 1-2: Setup & Database
- Project structure
- Database schema
- Authentication setup

Week 3-4: Landing & Pricing Pages
- Landing page design & build
- Pricing page
- Payment integration

Week 5-6: VIP Career Dashboard
- Loker list & filters
- Loker detail
- Bookmark & job alerts

Week 7-8: Admin Dashboard
- Loker management
- AI poster parsing
- Member management

Week 9-10: Testing & Polish
- End-to-end testing
- Bug fixes
- Performance optimization
- Mobile responsive polish

Week 11-12: Launch Preparation
- Content population
- Beta testing
- Marketing materials
- Soft launch

Total: 12 minggu (3 bulan)
```

---

## 🎉 Kesimpulan

Model bisnis 2-tier (Basic Rp 10k + Premium Rp 39k) dengan single app monorepo adalah **strategi terbaik** karena:

1. **Low barrier to entry** - Rp 10k sangat affordable untuk job seekers
2. **Clear upgrade path** - Premium memberikan value jelas dengan JobMate tools
3. **Technical simplicity** - 1 app mudah maintain & scale
4. **Better UX** - Seamless experience, no confusion
5. **Strong unit economics** - Profit margin ~91%, scalable

Dengan eksekusi yang baik, target 500 members dalam 6 bulan sangat realistis, menghasilkan ~Rp 13.7 juta/bulan recurring revenue.

**Siap untuk mulai implementasi?** 🚀

Silakan confirm jika ada yang ingin direvisi atau kita bisa langsung mulai coding! 💪
