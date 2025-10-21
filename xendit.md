# Tutorial Lengkap Integrasi Xendit Payment Gateway

## 📋 Daftar Isi
1. [Setup Xendit Dashboard](#1-setup-xendit-dashboard)
   - 1.1 Buat Akun Xendit
   - 1.2 Aktifkan Test Mode
   - 1.3 Dapatkan API Keys
   - 1.3a Setup API Key Permissions ⭐ **PENTING**
   - 1.4 Setup Callback/Webhook URL
   - 1.5 Dapatkan Webhook Verification Token
2. [Instalasi Dependencies](#2-instalasi-dependencies)
3. [Database Schema](#3-database-schema)
4. [Environment Variables](#4-environment-variables)
5. [API Routes](#5-api-routes)
6. [Payment Flow Implementation](#6-payment-flow-implementation)
7. [Webhook Handler](#7-webhook-handler)
8. [Testing Guide](#8-testing-guide)
9. [Production Checklist](#9-production-checklist)

---

## 1. Setup Xendit Dashboard

### 1.1 Buat Akun Xendit
1. Daftar di https://dashboard.xendit.co/register
2. Isi data perusahaan/pribadi
3. Verifikasi email

### 1.2 Aktifkan Test Mode
1. Login ke https://dashboard.xendit.co
2. Di sidebar kiri, cari toggle **"Live Mode / Test Mode"**
3. Pastikan dalam **Test Mode** (biasanya ada badge warna kuning/oranye)
4. Semua transaksi di test mode tidak akan charge uang asli

### 1.3 Dapatkan API Keys
1. Buka **Settings** > **API Keys** atau langsung ke https://dashboard.xendit.co/settings/developers#api-keys
2. Akan ada 2 jenis keys:
   - **Secret Key (Production)** - untuk live transaction
   - **Secret Key (Test)** - untuk testing
3. Copy **Secret Key (Test)**
4. Format: `xnd_test_...` (test) atau `xnd_production_...` (live)
5. **PENTING**: Jangan pernah commit API key ke git!

### 1.3a Setup API Key Permissions

Setelah generate API key, kamu perlu set **Permissions** untuk key tersebut:

1. **Di halaman API Keys**, klik **"Edit"** atau **"Permissions"** pada API key yang baru dibuat
2. Akan muncul halaman **Permissions** dengan berbagai kategori
3. **Set permissions berikut:**

#### ✅ Money-in products: **Write**
   - ✅ Invoices: **Write** (untuk create invoice)
   - Ini yang paling penting untuk payment gateway
   - Checklist sub-permissions:
     - Credit card ✓
     - Virtual accounts ✓
     - Retail Outlets (OTC) ✓
     - Invoices ✓ ← **WAJIB**
     - E-wallets ✓
     - PayLater ✓

#### ✅ Transaction: **Read**
   - Untuk cek status transaksi
   - Read-only sudah cukup

#### ⚙️ Report: **Read** (Optional)
   - Untuk akses transaction reports
   - Tidak wajib untuk payment flow dasar

#### ⚙️ xenPlatform > Account: **Read** (Optional)
   - Untuk info akun Xendit
   - Tidak wajib

**Permissions yang TIDAK PERLU diaktifkan:**
- ❌ Money-out products (Disbursements, Payout Link) - tidak dipakai
- ❌ Balance - tidak perlu akses balance
- ❌ xenShield - tidak perlu untuk integrasi dasar

4. **Klik "Save Changes"** setelah set permissions
5. **Copy API Key** yang sudah di-configure

**Screenshot reference:**
```
Money-in products         [None]  [Read]  [Write] ← Pilih Write
  └─ Invoices ✓
  └─ Virtual accounts ✓
  └─ E-wallets ✓

Transaction              [None]  [Read]  ← Pilih Read

Money-out products       [None]  [Read]  [Write] ← Biarkan None
Balance                  [None]  [Read]  ← Biarkan None
Report                   [None]  [Read]  [Write] ← Optional: Read
```

⚠️ **PENTING**: 
- Tanpa permission **Invoices: Write**, API call `createInvoice()` akan error `403 Forbidden`
- Pastikan permissions sudah benar sebelum testing

### 1.4 Setup Callback/Webhook URL (Localhost ke Public URL)

Xendit webhook butuh **public URL** yang bisa diakses dari internet. Karena `localhost:3000` tidak bisa diakses dari luar, kita perlu "expose" localhost ke public URL menggunakan **ngrok** atau tools sejenis.

#### Step 1: Install ngrok

**Windows:**
1. Download ngrok dari https://ngrok.com/download
2. Extract file `ngrok.exe` ke folder (contoh: `C:\ngrok\`)
3. (Optional) Tambahkan ke PATH agar bisa dijalankan dari mana saja

**Atau via Chocolatey:**
```bash
choco install ngrok
```

**Atau via npm (global):**
```bash
npm install -g ngrok
```

#### Step 2: Daftar akun ngrok (Gratis)

1. Daftar di https://dashboard.ngrok.com/signup
2. Login ke https://dashboard.ngrok.com/
3. Copy **Authtoken** dari https://dashboard.ngrok.com/get-started/your-authtoken
4. Jalankan di terminal:
   ```bash
   ngrok config add-authtoken YOUR_AUTHTOKEN_HERE
   ```
   Contoh:
   ```bash
   ngrok config add-authtoken 2a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p
   ```

#### Step 3: Jalankan ngrok untuk expose localhost:3000

1. **Buka terminal/CMD baru** (jangan tutup terminal dev server)
2. Jalankan ngrok:
   ```bash
   ngrok http 3000
   ```
3. Akan muncul output seperti ini:
   ```
   ngrok

   Session Status                online
   Account                       your-email@example.com (Plan: Free)
   Version                       3.x.x
   Region                        Asia Pacific (ap)
   Latency                       -
   Web Interface                 http://127.0.0.1:4040
   Forwarding                    https://abc123def456.ngrok-free.app -> http://localhost:3000

   Connections                   ttl     opn     rt1     rt5     p50     p90
                                 0       0       0.00    0.00    0.00    0.00
   ```

4. **Copy URL forwarding** (contoh: `https://abc123def456.ngrok-free.app`)
   - ⚠️ URL ini akan **berubah setiap kali restart ngrok** (versi free)
   - Untuk URL tetap, upgrade ke ngrok paid plan

#### Step 4: Pastikan Dev Server Running

Di terminal lain, jalankan Next.js dev server:
```bash
npm run dev
```

Pastikan server berjalan di `http://localhost:3000`

#### Step 5: Test ngrok URL

1. Buka browser, akses ngrok URL: `https://abc123def456.ngrok-free.app`
2. Akan muncul **ngrok warning page**, klik **"Visit Site"**
3. Harusnya landing page JobMate muncul (sama seperti localhost:3000)

#### Step 6: Setup Webhook URL di Xendit Dashboard

1. Buka Xendit Dashboard: https://dashboard.xendit.co/settings/developers#webhooks
2. **Pastikan di Test Mode** (ada toggle di sidebar kiri)
3. Klik **"+ Add Webhook URL"**
4. **Isi form webhook:**

   **Webhook URL:**
   ```
   https://abc123def456.ngrok-free.app/api/webhooks/xendit
   ```
   (Ganti `abc123def456.ngrok-free.app` dengan URL ngrok kamu)

   **Environment:** Test (pilih Test Mode)

   **Select Events to Track:**
   - ✅ Invoice
     - ✅ `invoice.created` (optional)
     - ✅ `invoice.paid` ⭐ **WAJIB**
     - ✅ `invoice.expired` ⭐ **WAJIB**
     - ✅ `invoice.payment_failed` (optional)

5. Klik **"Test Webhook"** untuk cek koneksi
   - Xendit akan kirim test payload ke URL kamu
   - Cek terminal dev server, harusnya ada log request masuk
   - Jika sukses, akan muncul **"Success"** ✅

6. Klik **"Create Webhook"**

#### Step 7: Copy Webhook Verification Token

1. Setelah webhook dibuat, akan muncul di list webhooks
2. Klik webhook yang baru dibuat, atau klik **"View Details"**
3. Copy **"Verification Token"** atau **"Callback Token"**
4. Format: string random panjang seperti `abc123def456ghi789jklmno012pqr345stu678vwx901yz234`
5. Simpan token ini, akan dipakai di `.env.local`

---

#### Alternative Tools (Selain ngrok)

**1. Cloudflare Tunnel (Gratis, tanpa batas waktu)**
```bash
# Install cloudflared
# Windows: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/

# Run tunnel
cloudflared tunnel --url http://localhost:3000
```

**2. localtunnel (Gratis, via npm)**
```bash
# Install
npm install -g localtunnel

# Run
lt --port 3000 --subdomain jobmate-dev

# Output: https://jobmate-dev.loca.lt
```

**3. Visual Studio Code Port Forwarding (Jika pakai VS Code)**
- Buka terminal di VS Code
- Run `npm run dev`
- Di tab **PORTS**, klik kanan port 3000 → **Forward Port**
- Pilih **Public** visibility
- Copy forwarded URL

---

#### ⚠️ Important Notes:

**1. Setiap kali restart ngrok (free plan):**
   - URL akan berubah
   - **Update webhook URL di Xendit Dashboard**
   - Atau gunakan paid plan untuk static URL

**2. Jangan tutup terminal ngrok:**
   - Biarkan terminal ngrok tetap berjalan selama development
   - Jika ngrok mati, webhook tidak akan terkirim

**3. Monitor webhook logs:**
   - Buka http://localhost:4040 (ngrok web interface)
   - Lihat semua HTTP requests yang masuk
   - Berguna untuk debug webhook

**4. Production:**
   - Di production, tidak perlu ngrok
   - Langsung pakai domain: `https://yourdomain.com/api/webhooks/xendit`

---

#### Troubleshooting

**Problem: ngrok command not found**
```bash
# Windows: Pastikan ngrok.exe ada di PATH atau jalankan dengan full path
C:\ngrok\ngrok.exe http 3000
```

**Problem: "ERR_NGROK_108" atau session expired**
```bash
# Login ulang dengan authtoken
ngrok config add-authtoken YOUR_AUTHTOKEN
```

**Problem: Webhook test failed di Xendit**
- Pastikan dev server running (`npm run dev`)
- Pastikan ngrok running
- Test buka ngrok URL di browser dulu
- Cek ngrok logs: http://localhost:4040

**Problem: Webhook received tapi error di backend**
- Cek console log di terminal `npm run dev`
- Pastikan route `/api/webhooks/xendit/route.ts` sudah dibuat
- Cek middleware tidak block webhook route

### 1.5 Dapatkan Webhook Verification Token

Sudah dijelaskan di **Step 7** section 1.4 di atas.

Token ini akan dipakai di file `.env.local`:
```bash
XENDIT_WEBHOOK_VERIFICATION_TOKEN=abc123def456ghi789jklmno012pqr345
```

---

## 2. Instalasi Dependencies

```bash
# Install Xendit SDK
npm install xendit-node

# Install types (jika pakai TypeScript)
npm install --save-dev @types/node
```

---

## 3. Database Schema

### 3.1 Create Payments Table

Buat file: `db/payments-table.sql`

```sql
-- Table untuk menyimpan record payment
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- User info (optional, bisa null jika user belum register)
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  
  -- Payment details
  plan_type TEXT NOT NULL CHECK (plan_type IN ('basic', 'premium')),
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'IDR',
  
  -- Xendit info
  external_id TEXT UNIQUE NOT NULL, -- ID unik yang kita generate
  invoice_id TEXT UNIQUE, -- ID dari Xendit
  invoice_url TEXT, -- URL untuk payment
  payment_method TEXT, -- e.g., 'QRIS', 'BANK_TRANSFER', 'E_WALLET'
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'expired', 'failed')),
  paid_at TIMESTAMPTZ,
  expired_at TIMESTAMPTZ,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index untuk performa
CREATE INDEX IF NOT EXISTS idx_payments_external_id ON payments(external_id);
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_email ON payments(email);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);

-- Enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Policy: User bisa lihat payment mereka sendiri (by email atau user_id)
CREATE POLICY "Users can view their own payments"
  ON payments FOR SELECT
  USING (
    auth.uid() = user_id 
    OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Policy: Admin bisa lihat semua payments
CREATE POLICY "Admins can view all payments"
  ON payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Function untuk auto update updated_at
CREATE OR REPLACE FUNCTION update_payments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_payments_updated_at_trigger
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_payments_updated_at();
```

**Jalankan di Supabase SQL Editor:**
1. Buka https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql
2. Copy-paste SQL di atas
3. Klik **Run**

---

## 4. Environment Variables

Tambahkan ke file `.env.local`:

```bash
# Xendit Configuration
XENDIT_SECRET_KEY=xnd_test_YOUR_TEST_SECRET_KEY_HERE
XENDIT_WEBHOOK_VERIFICATION_TOKEN=your_webhook_verification_token_here

# Payment URLs (untuk redirect)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
# Untuk production: https://yourdomain.com
```

⚠️ **PENTING**: 
- Tambahkan `.env.local` ke `.gitignore`
- Jangan commit API keys ke repository!

---

## 5. API Routes

### 5.1 Create Xendit Client

Buat file: `lib/xendit/client.ts`

```typescript
import Xendit from 'xendit-node';

if (!process.env.XENDIT_SECRET_KEY) {
  throw new Error('XENDIT_SECRET_KEY is not set');
}

// Initialize Xendit client
export const xenditClient = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY!,
});

// Helper functions
export const PLAN_PRICES = {
  basic: 10000, // Rp 10.000
  premium: 39000, // Rp 39.000
} as const;

export const PLAN_NAMES = {
  basic: 'Career VIP Basic - InfoLokerJombang',
  premium: 'Career VIP Premium - InfoLokerJombang',
} as const;

export type PlanType = keyof typeof PLAN_PRICES;
```

### 5.2 Create Invoice API

Buat file: `app/api/payment/create-invoice/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { xenditClient, PLAN_PRICES, PLAN_NAMES, PlanType } from '@/lib/xendit/client';
import { createClient } from '@/lib/supabase/server';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plan, email, fullName, whatsapp } = body;

    // Validation
    if (!plan || !email || !fullName || !whatsapp) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['basic', 'premium'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan type' },
        { status: 400 }
      );
    }

    const planType = plan as PlanType;
    const amount = PLAN_PRICES[planType];
    const description = PLAN_NAMES[planType];

    // Generate unique external_id
    const externalId = `jobmate-${planType}-${nanoid(16)}`;

    // Create invoice via Xendit
    const invoice = await xenditClient.Invoice.createInvoice({
      externalID: externalId,
      amount: amount,
      payerEmail: email,
      description: description,
      currency: 'IDR',
      reminderTime: 1, // Reminder 1 hari sebelum expire
      successRedirectURL: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?external_id=${externalId}`,
      failureRedirectURL: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/failed?external_id=${externalId}`,
      customer: {
        givenNames: fullName,
        email: email,
        mobileNumber: whatsapp,
      },
      customerNotificationPreference: {
        invoiceCreated: ['email', 'whatsapp'],
        invoicePaid: ['email', 'whatsapp'],
      },
      items: [
        {
          name: description,
          quantity: 1,
          price: amount,
        },
      ],
    });

    // Save payment record to database
    const supabase = await createClient();
    const { data: payment, error: dbError } = await supabase
      .from('payments')
      .insert({
        external_id: externalId,
        invoice_id: invoice.id,
        invoice_url: invoice.invoice_url,
        email: email,
        full_name: fullName,
        whatsapp: whatsapp,
        plan_type: planType,
        amount: amount,
        currency: 'IDR',
        status: 'pending',
        expired_at: new Date(invoice.expiry_date).toISOString(),
        metadata: {
          xendit_invoice_id: invoice.id,
          customer_email: email,
        },
      })
      .select()
      .single();

    if (dbError) {
      console.error('[Create Invoice] Database error:', dbError);
      // Invoice sudah dibuat di Xendit, tapi gagal save ke DB
      // User masih bisa bayar, tapi kita perlu handle via webhook
    }

    return NextResponse.json({
      success: true,
      invoiceUrl: invoice.invoice_url,
      externalId: externalId,
      invoiceId: invoice.id,
      amount: amount,
      expiryDate: invoice.expiry_date,
    });

  } catch (error: any) {
    console.error('[Create Invoice] Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create invoice',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
```

### 5.3 Check Payment Status API

Buat file: `app/api/payment/check-status/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const externalId = searchParams.get('external_id');

    if (!externalId) {
      return NextResponse.json(
        { error: 'external_id is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: payment, error } = await supabase
      .from('payments')
      .select('*')
      .eq('external_id', externalId)
      .single();

    if (error || !payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      payment: {
        externalId: payment.external_id,
        status: payment.status,
        amount: payment.amount,
        planType: payment.plan_type,
        paidAt: payment.paid_at,
        expiredAt: payment.expired_at,
      },
    });

  } catch (error: any) {
    console.error('[Check Status] Error:', error);
    return NextResponse.json(
      { error: 'Failed to check payment status' },
      { status: 500 }
    );
  }
}
```

---

## 6. Payment Flow Implementation

### 6.1 Update PricingSection Component

Edit file: `components/landing/PricingSection.tsx`

Ubah button action dari:
```tsx
<a href="/vip?plan=basic">Mulai dengan Basic</a>
```

Menjadi:
```tsx
<button onClick={() => handlePayment('basic')}>Mulai dengan Basic</button>
```

Tambahkan handler:

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// ... existing imports and code ...

export function PricingSection() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handlePayment = async (plan: 'basic' | 'premium') => {
    setLoading(plan);

    // Redirect ke payment form page
    router.push(`/payment?plan=${plan}`);
  };

  // ... rest of component ...
  
  // Update button VIP Basic
  <Button
    onClick={() => handlePayment('basic')}
    disabled={loading === 'basic'}
    size="lg"
    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
  >
    {loading === 'basic' ? 'Memproses...' : 'Mulai dengan Basic'}
  </Button>

  // Update button VIP Premium
  <Button
    onClick={() => handlePayment('premium')}
    disabled={loading === 'premium'}
    size="lg"
    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
  >
    {loading === 'premium' ? 'Memproses...' : 'Ambil Premium Sekarang! 🚀'}
  </Button>
}
```

### 6.2 Create Payment Form Page

Buat file: `app/payment/page.tsx`

```typescript
"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, CreditCard, Loader2 } from "lucide-react";

function PaymentFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') as 'basic' | 'premium';

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    email: "",
    fullName: "",
    whatsapp: "",
  });

  const planDetails = {
    basic: { name: 'VIP Basic', price: 10000, priceText: 'Rp 10.000' },
    premium: { name: 'VIP Premium', price: 39000, priceText: 'Rp 39.000' },
  };

  const currentPlan = plan && planDetails[plan] ? planDetails[plan] : planDetails.premium;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create invoice via API
      const response = await fetch('/api/payment/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: plan || 'premium',
          email: formData.email,
          fullName: formData.fullName,
          whatsapp: formData.whatsapp,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Gagal membuat invoice');
      }

      // Redirect to Xendit payment page
      window.location.href = result.invoiceUrl;

    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan. Silakan coba lagi.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500 text-white">
            <CreditCard className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">Pembayaran {currentPlan.name}</CardTitle>
          <CardDescription>
            Isi data di bawah untuk melanjutkan ke halaman pembayaran
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Plan Info */}
          <div className="mb-6 rounded-lg bg-amber-50 dark:bg-amber-950/20 p-4 border border-amber-200 dark:border-amber-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-lg">{currentPlan.name}</p>
                <p className="text-sm text-muted-foreground">Akses lifetime ke JobMate</p>
              </div>
              <p className="text-2xl font-bold text-amber-600">{currentPlan.priceText}</p>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nama Lengkap *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Aktif *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                Invoice akan dikirim ke email ini
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">Nomor WhatsApp *</Label>
              <Input
                id="whatsapp"
                type="tel"
                placeholder="08123456789"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className="rounded-lg bg-muted p-4 text-sm">
              <p className="font-medium mb-2">Metode Pembayaran:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Transfer Bank (BCA, BNI, BRI, Mandiri)</li>
                <li>E-Wallet (OVO, DANA, GoPay, LinkAja)</li>
                <li>QRIS (Scan & Pay)</li>
                <li>Alfamart / Indomaret</li>
              </ul>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Membuat Invoice...
                </>
              ) : (
                <>
                  Lanjut ke Pembayaran
                  <CheckCircle2 className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>🔒 Pembayaran aman dan terenkripsi via Xendit</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <PaymentFormContent />
    </Suspense>
  );
}
```

### 6.3 Create Payment Success Page

Buat file: `app/payment/success/page.tsx`

```typescript
"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const externalId = searchParams.get('external_id');

  const [loading, setLoading] = React.useState(true);
  const [payment, setPayment] = React.useState<any>(null);
  const [countdown, setCountdown] = React.useState(5);

  React.useEffect(() => {
    const checkPayment = async () => {
      if (!externalId) return;

      try {
        const response = await fetch(`/api/payment/check-status?external_id=${externalId}`);
        const result = await response.json();

        if (result.success && result.payment) {
          setPayment(result.payment);
        }
      } catch (error) {
        console.error('Error checking payment:', error);
      } finally {
        setLoading(false);
      }
    };

    checkPayment();
  }, [externalId]);

  // Auto redirect countdown
  React.useEffect(() => {
    if (!loading && payment?.status === 'paid') {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push('/ajukan-akun');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [loading, payment, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-lg">
          <CardContent className="py-12 text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-amber-600" />
            <p className="text-muted-foreground">Memverifikasi pembayaran...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">
            Pembayaran Berhasil! 🎉
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="rounded-lg bg-green-50 dark:bg-green-950/20 p-4 border border-green-200 dark:border-green-800">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Paket yang Dibeli:</p>
              <p className="text-xl font-bold text-green-600">
                {payment?.planType === 'basic' ? 'VIP Basic' : 'VIP Premium'}
              </p>
              <p className="text-2xl font-bold mt-2">
                Rp {payment?.amount?.toLocaleString('id-ID')}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-600 font-bold text-xs">
                1
              </div>
              <div>
                <p className="font-medium">Pembayaran Terverifikasi ✅</p>
                <p className="text-sm text-muted-foreground">
                  Pembayaran Anda telah berhasil diproses
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 font-bold text-xs">
                2
              </div>
              <div>
                <p className="font-medium">Langkah Selanjutnya</p>
                <p className="text-sm text-muted-foreground">
                  Silakan ajukan akun untuk mendapatkan akses ke JobMate
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 font-bold text-xs">
                3
              </div>
              <div>
                <p className="font-medium">Admin akan Review</p>
                <p className="text-sm text-muted-foreground">
                  Maksimal 1x24 jam akun Anda akan aktif
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border-2 border-dashed border-amber-300 bg-amber-50 dark:bg-amber-950/20 p-4 text-center">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
              Auto redirect ke halaman Ajukan Akun dalam {countdown} detik...
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button asChild size="lg" className="w-full">
              <Link href="/ajukan-akun">
                Ajukan Akun Sekarang
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full">
              <Link href="/">
                Kembali ke Beranda
              </Link>
            </Button>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            <p>Ada pertanyaan? Hubungi admin via WhatsApp</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
```

### 6.4 Create Payment Failed Page

Buat file: `app/payment/failed/page.tsx`

```typescript
"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const externalId = searchParams.get('external_id');

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-600">
            Pembayaran Gagal
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="rounded-lg bg-red-50 dark:bg-red-950/20 p-4 border border-red-200 dark:border-red-800 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Maaf, pembayaran Anda tidak dapat diproses
            </p>
            <p className="text-xs text-muted-foreground">
              ID: {externalId}
            </p>
          </div>

          <div className="space-y-3 text-sm">
            <p className="font-medium">Kemungkinan penyebab:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Pembayaran dibatalkan</li>
              <li>Invoice sudah expired</li>
              <li>Saldo tidak mencukupi</li>
              <li>Koneksi terputus saat proses</li>
            </ul>
          </div>

          <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 p-4 border border-blue-200 dark:border-blue-800">
            <p className="text-sm font-medium mb-2">💡 Apa yang harus dilakukan?</p>
            <p className="text-sm text-muted-foreground">
              Silakan coba lagi dengan memilih paket yang diinginkan. 
              Jika masalah berlanjut, hubungi admin via WhatsApp.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button asChild size="lg" className="w-full">
              <Link href="/#pricing">
                Coba Lagi
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full">
              <Link href="/">
                Kembali ke Beranda
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentFailedContent />
    </Suspense>
  );
}
```

---

## 7. Webhook Handler

### 7.1 Create Webhook API Route

Buat file: `app/api/webhooks/xendit/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

// Verify Xendit webhook signature
function verifyXenditSignature(payload: string, signature: string): boolean {
  const webhookToken = process.env.XENDIT_WEBHOOK_VERIFICATION_TOKEN;
  if (!webhookToken) {
    console.warn('[Xendit Webhook] XENDIT_WEBHOOK_VERIFICATION_TOKEN not set');
    return false;
  }

  const computedSignature = crypto
    .createHmac('sha256', webhookToken)
    .update(payload)
    .digest('hex');

  return computedSignature === signature;
}

export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const rawBody = await request.text();
    const signature = request.headers.get('x-callback-token') || '';

    // Verify signature
    if (!verifyXenditSignature(rawBody, signature)) {
      console.error('[Xendit Webhook] Invalid signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse webhook payload
    const payload = JSON.parse(rawBody);
    console.log('[Xendit Webhook] Received:', payload);

    const {
      id: invoiceId,
      external_id: externalId,
      status,
      paid_at,
      payment_method,
      payment_channel,
    } = payload;

    // Update payment in database
    const supabase = await createClient();

    if (status === 'PAID') {
      // Payment successful
      const { data, error } = await supabase
        .from('payments')
        .update({
          status: 'paid',
          paid_at: new Date(paid_at).toISOString(),
          payment_method: payment_method || payment_channel,
          updated_at: new Date().toISOString(),
        })
        .eq('external_id', externalId)
        .select()
        .single();

      if (error) {
        console.error('[Xendit Webhook] Database update error:', error);
        return NextResponse.json(
          { error: 'Database error' },
          { status: 500 }
        );
      }

      console.log('[Xendit Webhook] Payment updated to PAID:', data);

      // TODO: Additional actions on successful payment:
      // - Send confirmation email
      // - Send WhatsApp notification
      // - Trigger Telegram notification to admin
      // - Auto-approve account if auto-approval is enabled

    } else if (status === 'EXPIRED') {
      // Invoice expired
      await supabase
        .from('payments')
        .update({
          status: 'expired',
          updated_at: new Date().toISOString(),
        })
        .eq('external_id', externalId);

      console.log('[Xendit Webhook] Payment marked as EXPIRED');

    } else if (status === 'FAILED') {
      // Payment failed
      await supabase
        .from('payments')
        .update({
          status: 'failed',
          updated_at: new Date().toISOString(),
        })
        .eq('external_id', externalId);

      console.log('[Xendit Webhook] Payment marked as FAILED');
    }

    // Respond to Xendit
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('[Xendit Webhook] Error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed', message: error.message },
      { status: 500 }
    );
  }
}

// Allow POST requests only
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
```

### 7.2 Update Middleware untuk Allow Webhook

Edit file: `middleware.ts`

Tambahkan webhook path ke public routes:

```typescript
const publicRoutes = [
  "/",
  "/sign-in",
  "/sign-up",
  "/ajukan-akun",
  "/ajukan-akun/terima-kasih",
  "/payment",
  "/payment/success",
  "/payment/failed",
  "/api/webhooks/xendit", // <-- Tambahkan ini
  // ... other routes
];
```

---

## 8. Testing Guide

### 8.1 Setup ngrok untuk Local Testing

```bash
# Install ngrok: https://ngrok.com/download

# Start ngrok
ngrok http 3000

# Copy forwarding URL (e.g., https://abc123.ngrok.io)
```

### 8.2 Update Webhook URL di Xendit Dashboard

1. Buka Xendit Dashboard > Settings > Webhooks
2. Update webhook URL: `https://abc123.ngrok.io/api/webhooks/xendit`
3. Save

### 8.3 Test Payment Flow

1. **Start development server:**
   ```bash
   npm run dev
   ```

2. **Buka landing page:**
   - Go to `http://localhost:3000`
   - Scroll ke pricing section
   - Klik button "Mulai dengan Basic" atau "Ambil Premium"

3. **Isi payment form:**
   - Nama lengkap
   - Email (gunakan email test, e.g., `test@example.com`)
   - WhatsApp

4. **Di Xendit payment page:**
   - Pilih metode pembayaran (e.g., Bank Transfer)
   - Copy virtual account number

5. **Simulate payment via Xendit Dashboard:**
   - Buka Xendit Dashboard > Test Mode
   - Go to "Transactions" atau "Invoices"
   - Find invoice yang baru dibuat
   - Klik "Simulate Payment"
   - Invoice akan berubah status jadi PAID

6. **Verify webhook received:**
   - Check console log di terminal `npm run dev`
   - Should see: `[Xendit Webhook] Received: {...}`
   - Check database: payment status should be "paid"

7. **Test redirect flow:**
   - After payment simulation, akan redirect ke `/payment/success`
   - Auto countdown 5 detik
   - Redirect ke `/ajukan-akun`

### 8.4 Test dengan Kartu Kredit Test

Xendit menyediakan test card numbers:

**Card Number:** `4000000000000002`  
**CVV:** `123`  
**Expiry:** Any future date  
**Result:** Success

**Card Number:** `4000000000000010`  
**CVV:** `123`  
**Expiry:** Any future date  
**Result:** Failed

### 8.5 Monitor Webhook Logs

```bash
# Terminal 1: Run dev server
npm run dev

# Terminal 2: Monitor ngrok requests
ngrok http 3000 --log=stdout
```

Atau gunakan Xendit Dashboard:
- Settings > Webhooks > View Logs
- See all webhook attempts, payloads, and responses

---

## 9. Production Checklist

### 9.1 Environment Variables

Update `.env.local` untuk production:

```bash
# PRODUCTION MODE
XENDIT_SECRET_KEY=xnd_production_YOUR_PRODUCTION_KEY_HERE
XENDIT_WEBHOOK_VERIFICATION_TOKEN=your_production_webhook_token
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### 9.2 Switch to Live Mode

1. Buka Xendit Dashboard
2. Toggle dari "Test Mode" ke "Live Mode"
3. Generate new **Production API Key**
4. Update webhook URL: `https://yourdomain.com/api/webhooks/xendit`
5. Test webhook connection

### 9.3 Security Checklist

- [ ] Xendit API keys disimpan di environment variables (NEVER in code)
- [ ] `.env.local` ada di `.gitignore`
- [ ] Webhook signature verification aktif
- [ ] RLS policies di Supabase sudah benar
- [ ] HTTPS enabled di production domain
- [ ] Rate limiting di webhook endpoint (optional, tapi recommended)

### 9.4 Testing di Production

1. **Small test transaction:**
   - Buat payment dengan amount kecil (e.g., Rp 1.000)
   - Test full flow end-to-end

2. **Verify database:**
   - Check payment record tersimpan
   - Status updated correctly via webhook

3. **Monitor logs:**
   - Check Vercel/deployment logs
   - Check Xendit webhook logs
   - Check Supabase database

### 9.5 Monitoring & Alerts

Setup monitoring untuk:
- Failed webhook deliveries
- Payment errors
- Database connection issues

**Tools:**
- Sentry untuk error tracking
- Xendit Dashboard untuk payment monitoring
- Supabase logs untuk database queries

---

## 10. Troubleshooting

### Issue: Webhook tidak received

**Solution:**
1. Check ngrok masih running
2. Verify webhook URL di Xendit dashboard
3. Check middleware tidak block `/api/webhooks/xendit`
4. Look at Xendit webhook logs untuk error messages

### Issue: Signature verification failed

**Solution:**
1. Pastikan `XENDIT_WEBHOOK_VERIFICATION_TOKEN` sudah benar
2. Copy ulang token dari Xendit dashboard
3. Restart dev server setelah update .env

### Issue: Payment status tidak update

**Solution:**
1. Check webhook received (console log)
2. Check database query error di terminal
3. Verify `external_id` match antara invoice dan database
4. Check RLS policies di Supabase

### Issue: Redirect loop di payment success

**Solution:**
1. Check countdown logic
2. Verify `external_id` parameter ada di URL
3. Check API `/api/payment/check-status` return data

---

## 11. Additional Features

### 11.1 Auto-Approve Account setelah Payment

Edit webhook handler, tambahkan setelah payment updated:

```typescript
if (status === 'PAID' && data) {
  // Auto create user account
  const { data: { user }, error: signUpError } = await supabase.auth.admin.createUser({
    email: data.email,
    password: 'generate-secure-password', // Or send to user via email
    email_confirm: true,
  });

  if (!signUpError && user) {
    // Create profile
    await supabase.from('profiles').insert({
      id: user.id,
      full_name: data.full_name,
      username: data.email.split('@')[0],
      membership: data.plan_type, // 'basic' or 'premium'
    });

    // Send welcome email with credentials
    // TODO: Implement email sending
  }
}
```

### 11.2 Email Notifications

Integrate dengan email service (e.g., Resend, SendGrid):

```typescript
// After payment success
await sendEmail({
  to: data.email,
  subject: 'Payment Confirmed - JobMate VIP',
  template: 'payment-success',
  data: {
    name: data.full_name,
    plan: data.plan_type,
    amount: data.amount,
  },
});
```

### 11.3 Admin Dashboard untuk Payments

Buat halaman di `/admin/payments` untuk melihat semua transaksi:
- List semua payments
- Filter by status
- Export to CSV
- Manual approval/rejection

---

## 12. FAQ

**Q: Apakah aman menyimpan password di payment table?**  
A: Tidak, sebaiknya jangan simpan password. Gunakan flow email verification atau auto-generate password setelah payment.

**Q: Bagaimana handle refund?**  
A: Xendit support refund via API. Buat endpoint `/api/payment/refund` yang call Xendit Refund API.

**Q: Bisa support recurring payment untuk VIP Basic?**  
A: Ya! Gunakan Xendit Recurring feature. Buat subscription plan dan charge otomatis tiap bulan.

**Q: Xendit fee berapa persen?**  
A: Berbeda per metode pembayaran. Cek https://www.xendit.co/id/pricing/

---

## 13. Resources

- **Xendit Documentation:** https://developers.xendit.co/api-reference
- **Xendit Node.js SDK:** https://github.com/xendit/xendit-node
- **Xendit Dashboard:** https://dashboard.xendit.co
- **ngrok:** https://ngrok.com/docs
- **Supabase RLS:** https://supabase.com/docs/guides/auth/row-level-security

---

## Summary

Sekarang kamu sudah punya sistem payment lengkap dengan Xendit! 🚀

**Flow yang sudah dibuat:**
1. User klik pricing button di landing page
2. Isi form payment (nama, email, whatsapp)
3. Create invoice via Xendit API
4. Redirect ke Xendit payment page
5. User pilih metode pembayaran & bayar
6. Xendit kirim webhook ke backend
7. Update payment status di database
8. Redirect ke success page
9. Auto redirect ke ajukan akun (5 detik)
10. Admin review & approve account

**Next Steps:**
- Test di test mode
- Setup email notifications
- Implement auto-approval (optional)
- Deploy to production
- Switch to live mode

Happy coding! 🎉
