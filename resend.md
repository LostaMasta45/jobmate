# Tutorial Lengkap Integrasi Resend.com dengan Xendit di JOBMATE

> 🎯 **Tujuan**: Kirim email invoice otomatis saat user membuat pembayaran & email konfirmasi saat pembayaran berhasil di **jobmate.web.id**

## Status Project
- ✅ Xendit payment sudah jalan di jobmate.web.id
- ✅ Create invoice API sudah ada: `app/api/payment/create-invoice/route.ts`
- ✅ Webhook Xendit sudah ada: `app/api/webhooks/xendit/route.ts`
- ⏳ **Tinggal tambahkan Resend untuk email notification**

## Daftar Isi
1. [Persiapan Resend.com](#1-persiapan-resendcom)
2. [Setup Environment Variables](#2-setup-environment-variables)
3. [Install Dependencies](#3-install-dependencies)
4. [Buat File Struktur](#4-buat-file-struktur)
5. [Update API Routes](#5-update-api-routes)
6. [Testing Lokal](#6-testing-lokal)
7. [Deploy Production](#7-deploy-production)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Persiapan Resend.com

### Step 1.1: Daftar & Login Resend
1. Buka browser, ke: **https://resend.com/signup**
2. Daftar dengan email Anda (gratis!)
3. Verifikasi email
4. Login ke dashboard: **https://resend.com/overview**

### Step 1.2: Dapatkan API Key
1. Di dashboard Resend, klik menu **"API Keys"** (sidebar kiri)
2. Klik tombol **"Create API Key"**
3. Nama: `JOBMATE_PRODUCTION`
4. Permission: **Full Access** (default)
5. Klik **"Add"**
6. **⚠️ COPY API KEY SEKARANG!** (hanya muncul 1x)
   ```
   Format: re_xxxxxxxxxxxxxxxxx
   ```
7. Save di notepad dulu, akan kita pakai nanti

### Step 1.3: Add Testing Email (Development)
> Untuk testing di localhost, Resend hanya bisa kirim ke email yang terdaftar

1. Di dashboard, klik **"Settings"** > **"Team"**
2. **Invite yourself** dengan email yang ingin test (bisa email pribadi Anda)
3. Check inbox & accept invitation
4. Sekarang email Anda bisa terima test emails! ✅

### Step 1.4: Verifikasi Domain (Optional - Skip dulu untuk testing)
> Untuk production, gunakan domain custom `noreply@jobmate.web.id`

**Untuk sekarang, gunakan sender default:**
```bash
From: onboarding@resend.dev  # ← Sender untuk development/testing
```

**Nanti untuk production (optional):**
1. Dashboard Resend > **"Domains"** > **"Add Domain"**
2. Domain: `noreply.jobmate.web.id` atau `mail.jobmate.web.id`
3. Add DNS records di Cloudflare (akan dikasih instruksi)
4. Wait 5-30 menit untuk verification
5. Ubah sender jadi: `noreply@jobmate.web.id`

**💡 Tip**: Mulai dengan `onboarding@resend.dev`, upgrade domain nanti setelah testing berhasil!

---

## 2. Setup Environment Variables

### Step 2.1: Update `.env.local` (Local Development)
1. Buka file: **`C:\Users\user\Music\JOBMATE\.env.local`**
2. Tambahkan di baris paling bawah:

```bash
# Xendit (pastikan sudah ada)
XENDIT_SECRET_KEY=xnd_production_xxxxx
XENDIT_WEBHOOK_VERIFICATION_TOKEN=xxxxx

# Resend Email (TAMBAHKAN INI)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=onboarding@resend.dev
```

3. **Ganti `re_xxxxxxxxxxxxxxxxx` dengan API key dari Step 1.2**
4. Save file (Ctrl+S)

### Step 2.2: Tambahkan ke Vercel (Production)
1. Buka browser: **https://vercel.com**
2. Login & pilih project **JOBMATE**
3. Klik tab **"Settings"** (di atas)
4. Sidebar kiri: **"Environment Variables"**
5. Tambahkan 2 variable baru:

**Variable 1:**
```
Name:  RESEND_API_KEY
Value: re_xxxxxxxxxxxxxxxxx  ← paste API key Anda
Environment: Production ✅ Preview ✅ Development ✅
```

**Variable 2:**
```
Name:  RESEND_FROM_EMAIL
Value: onboarding@resend.dev
Environment: Production ✅ Preview ✅ Development ✅
```

6. Klik **"Save"** untuk masing-masing variable

### Step 2.3: Verifikasi Environment Variables
```bash
# Check di terminal (local):
cd C:\Users\user\Music\JOBMATE
node -e "console.log(process.env.RESEND_API_KEY)"

# Expected output:
# re_xxxxxxxxxxxxxxxxx

# Jika undefined → restart VS Code / terminal
```

---

## 3. Install Dependencies

### Step 3.1: Install Packages
```bash
# Buka terminal di VS Code (Ctrl+`)
# Pastikan di folder: C:\Users\user\Music\JOBMATE

npm install resend @react-email/render

# Output expected:
# added 2 packages...
# ✅ resend installed
# ✅ @react-email/render installed
```

### Step 3.2: Verify Installation
```bash
# Check apakah sudah ter-install:
npm list resend

# Expected output:
# jobmate@2.0.0 C:\Users\user\Music\JOBMATE
# └── resend@x.x.x
```

---

## 4. Buat File Struktur

> Sekarang kita buat 4 file baru untuk handling email

### Step 4.1: Buat `lib/resend.ts`
**Lokasi**: `C:\Users\user\Music\JOBMATE\lib\resend.ts`

```typescript
// lib/resend.ts
import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

// Default sender email
export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
```

**Cara buat:**
1. Di VS Code, klik folder **`lib`**
2. Klik kanan > **New File**
3. Nama: `resend.ts`
4. Copy-paste code di atas
5. Save (Ctrl+S)

### Step 4.2: Buat folder `emails` & file template
**Lokasi**: `C:\Users\user\Music\JOBMATE\emails\InvoiceEmail.tsx`

**Cara buat:**
1. Di VS Code, klik root folder **`JOBMATE`**
2. Klik kanan > **New Folder** > Nama: `emails`
3. Klik folder `emails`  > New File > Nama: `InvoiceEmail.tsx`
4. Copy-paste code di bawah:

```typescript
// emails/InvoiceEmail.tsx
import React from 'react';

interface InvoiceEmailProps {
  userName: string;
  invoiceUrl: string;
  amount: number;
  currency: string;
  expiryDate: string;
  description: string;
}

export const InvoiceEmail: React.FC<InvoiceEmailProps> = ({
  userName,
  invoiceUrl,
  amount,
  currency,
  expiryDate,
  description,
}) => {
  return (
    <html>
      <head>
        <style>{`
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { background: #f9fafb; padding: 30px; margin: 20px 0; border-radius: 8px; }
          .button { display: inline-block; background: #4F46E5; color: white; padding: 12px 30px; 
                   text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .invoice-details { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; }
          .amount { font-size: 32px; font-weight: bold; color: #4F46E5; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="header">
            <h1>Invoice Pembayaran</h1>
          </div>
          
          <div className="content">
            <p>Halo {userName},</p>
            <p>Terima kasih telah menggunakan layanan kami. Berikut adalah detail invoice Anda:</p>
            
            <div className="invoice-details">
              <h2>Detail Pembayaran</h2>
              <p><strong>Deskripsi:</strong> {description}</p>
              <p><strong>Jumlah:</strong></p>
              <p className="amount">{currency} {amount.toLocaleString('id-ID')}</p>
              <p><strong>Berlaku hingga:</strong> {new Date(expiryDate).toLocaleString('id-ID')}</p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <a href={invoiceUrl} className="button">
                Bayar Sekarang
              </a>
            </div>
            
            <p style={{ marginTop: 30, fontSize: 14, color: '#666' }}>
              Link pembayaran ini akan kedaluwarsa pada {new Date(expiryDate).toLocaleString('id-ID')}.
              Segera lakukan pembayaran untuk menghindari pembatalan otomatis.
            </p>
          </div>
          
          <div className="footer">
            <p>Email ini dikirim secara otomatis. Jangan membalas email ini.</p>
            <p>Jika ada pertanyaan, hubungi support kami.</p>
          </div>
        </div>
      </body>
    </html>
  );
};

// Plain text version
export const InvoiceEmailText = ({
  userName,
  invoiceUrl,
  amount,
  currency,
  expiryDate,
  description,
}: InvoiceEmailProps) => `
Halo ${userName},

Terima kasih telah menggunakan layanan kami. Berikut adalah detail invoice Anda:

Detail Pembayaran:
- Deskripsi: ${description}
- Jumlah: ${currency} ${amount.toLocaleString('id-ID')}
- Berlaku hingga: ${new Date(expiryDate).toLocaleString('id-ID')}

Bayar sekarang: ${invoiceUrl}

Link pembayaran ini akan kedaluwarsa pada ${new Date(expiryDate).toLocaleString('id-ID')}.

---
Email ini dikirim secara otomatis. Jangan membalas email ini.
`;
```

### Step 4.3: Buat `lib/send-invoice-email.ts`
**Lokasi**: `C:\Users\user\Music\JOBMATE\lib\send-invoice-email.ts`

**Cara buat:**
1. Di VS Code, klik folder **`lib`**
2. New File > Nama: `send-invoice-email.ts`
3. Copy-paste code di bawah:

```typescript
// lib/send-invoice-email.ts
import { resend, FROM_EMAIL } from './resend';
import { InvoiceEmail, InvoiceEmailText } from '@/emails/InvoiceEmail';
import { render } from '@react-email/render';

interface SendInvoiceEmailParams {
  toEmail: string;
  userName: string;
  invoiceUrl: string;
  amount: number;
  currency: string;
  expiryDate: string;
  description: string;
}

export async function sendInvoiceEmail(params: SendInvoiceEmailParams) {
  try {
    const emailHtml = render(InvoiceEmail(params));
    const emailText = InvoiceEmailText(params);

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.toEmail,
      subject: `Invoice Pembayaran - ${params.description}`,
      html: emailHtml,
      text: emailText,
      // Optional: tags untuk tracking
      tags: [
        { name: 'category', value: 'invoice' },
        { name: 'amount', value: params.amount.toString() },
      ],
    });

    if (error) {
      console.error('Failed to send email:', error);
      return { success: false, error };
    }

    console.log('Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}
```

---

## 5. Update API Routes

### Step 5.1: Update Create Invoice API
**File**: `C:\Users\user\Music\JOBMATE\app\api\payment\create-invoice\route.ts`

**Yang perlu diubah:**
1. **Tambahkan import** di baris paling atas (setelah import yang sudah ada):
```typescript
import { sendInvoiceEmail } from '@/lib/send-invoice-email';
```

2. **Cari bagian kode ini** (sekitar baris 110-130):
```typescript
    if (dbError) {
      console.error('[Create Invoice] Database UPSERT error:', dbError);
      console.error('[Create Invoice] CRITICAL: Payment created in Xendit but not in database!');
      console.error('[Create Invoice] External ID:', externalId);
      console.error('[Create Invoice] Invoice ID:', invoice.id);
      // Still return success - webhook will handle the save
      // But this is logged as CRITICAL for monitoring
    } else {
      console.log('[Create Invoice] Payment saved to database:', paymentData?.external_id);
    }
```

3. **TAMBAHKAN kode ini** tepat SETELAH bagian `if (dbError)` di atas, SEBELUM `return NextResponse.json({...})`:

```typescript
    // ✨ NEW: Send invoice email
    try {
      console.log('[Create Invoice] Sending invoice email to:', email);
      
      const emailResult = await sendInvoiceEmail({
        toEmail: email,
        userName: fullName || email.split('@')[0],
        invoiceUrl: invoice.invoice_url,
        amount: amount,
        currency: 'IDR',
        expiryDate: invoice.expiry_date,
        description: `${selectedPlan.name} - InfoLokerJombang`,
      });

      if (emailResult.success) {
        console.log('[Create Invoice] Invoice email sent successfully');
      } else {
        console.error('[Create Invoice] Failed to send invoice email:', emailResult.error);
        // Don't fail the request, email is optional
      }
    } catch (emailError) {
      console.error('[Create Invoice] Error sending invoice email:', emailError);
      // Don't fail the request
    }
```

4. **UBAH response** (cari `return NextResponse.json({`) menjadi:
```typescript
    return NextResponse.json({
      success: true,
      invoiceUrl: invoice.invoice_url,
      externalId: externalId,
      invoiceId: invoice.id,
      amount: amount,
      expiryDate: invoice.expiry_date,
      emailSent: true, // 👈 TAMBAHKAN INI
    });
```

5. Save file (Ctrl+S)

### Step 5.2: Update Webhook API  
**File**: `C:\Users\user\Music\JOBMATE\app\api\webhooks\xendit\route.ts`

**Yang perlu diubah:**
1. **Tambahkan import** di baris paling atas (setelah import yang sudah ada):
```typescript
import { resend, FROM_EMAIL } from '@/lib/resend';
```

2. **Tambahkan email template** tepat SETELAH semua import, SEBELUM function `verifyXenditToken`:

```typescript
// ✨ NEW: Email template untuk payment confirmation
const PaymentSuccessEmail = ({ userName, amount, transactionDate, planType }: any) => `
  <html>
    <body style="font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #10B981; color: white; padding: 20px; text-align: center;">
          <h1>✓ Pembayaran Berhasil!</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <p>Halo ${userName},</p>
          <p>Pembayaran Anda telah berhasil diproses.</p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2>Detail Pembayaran</h2>
            <p><strong>Jumlah:</strong> IDR ${amount.toLocaleString('id-ID')}</p>
            <p><strong>Tanggal:</strong> ${new Date(transactionDate).toLocaleString('id-ID')}</p>
            <p style="color: #10B981; font-weight: bold;">Status: PAID ✓</p>
          </div>
          <p>Terima kasih atas pembayaran Anda!</p>
          <p><strong>Akses VIP Anda telah diaktifkan!</strong></p>
        </div>
      </div>
    </body>
  </html>
`;
```

3. **Cari bagian `if (status === 'PAID')` handler** (sekitar baris 115-160)
4. **Cari bagian setelah database upsert** (setelah `console.log('[Xendit Webhook] Payment upserted successfully:', data);`)
5. **GANTI seluruh blok `try { fetch(...send-confirmation-email)... }`** dengan kode ini:

```typescript
      // ✨ NEW: Send payment confirmation email directly via Resend
      try {
        console.log('[Xendit Webhook] Sending payment confirmation email to:', customerEmail);
        
        const emailHtml = PaymentSuccessEmail({
          userName: customerName,
          amount: amount,
          transactionDate: paid_at || new Date().toISOString(),
          planType: planType,
        });

        const emailResponse = await resend.emails.send({
          from: FROM_EMAIL,
          to: customerEmail,
          subject: `✅ Pembayaran ${planType === 'premium' ? 'VIP Premium' : 'VIP Basic'} Berhasil - JOBMATE`,
          html: emailHtml,
          tags: [
            { name: 'category', value: 'payment-confirmation' },
            { name: 'plan', value: planType },
          ],
        });

        console.log('[Xendit Webhook] Payment confirmation email sent successfully:', emailResponse);
      } catch (emailError) {
        console.error('[Xendit Webhook] Error sending payment confirmation email:', emailError);
        // Don't fail webhook if email fails
      }
```

6. Save file (Ctrl+S)

---

## 6. Testing Lokal

### Step 6.1: Test Resend Connection (Quick Test)
**File**: `C:\Users\user\Music\JOBMATE\scripts\test-resend.ts`

1. Buat folder **`scripts`** kalau belum ada
2. Buat file **`test-resend.ts`** di dalamnya
3. Copy-paste code ini:

```typescript
// scripts/test-resend.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  console.log('🧪 Testing Resend connection...');
  console.log('API Key:', process.env.RESEND_API_KEY?.substring(0, 10) + '...');
  
  const { data, error } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'YOUR_EMAIL@gmail.com', // ⚠️ GANTI DENGAN EMAIL ANDA!
    subject: '🧪 Test Email JOBMATE',
    html: '<h1>Hello from JOBMATE!</h1><p>✅ Resend integration works!</p>',
  });

  if (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } else {
    console.log('✅ Email sent successfully!');
    console.log('📧 Check your inbox:', data);
    process.exit(0);
  }
}

testEmail();
```

4. **Jalankan test:**
```bash
# Terminal di VS Code
npm install -D tsx  # install runner
npx tsx scripts/test-resend.ts

# Expected output:
# 🧪 Testing Resend connection...
# API Key: re_xxxxxxx...
# ✅ Email sent successfully!
# 📧 Check your inbox: { id: '...' }
```

5. **Check inbox Anda!** Email harus masuk dalam 1-2 detik ✅

### Step 6.2: Test Create Invoice API (Integration Test)
**Pastikan dev server jalan:**
```bash
npm run dev
# Server: http://localhost:3000
```

**Option A: Test via Browser**
1. Buka: **http://localhost:3000**
2. Cari tombol/page untuk **upgrade VIP** atau **payment**
3. Isi form:
   - Email: `your-email@gmail.com` (yang sudah terdaftar di Resend!)
   - Plan: Basic atau Premium
   - Submit
4. **Check terminal** - harus ada log: `[Create Invoice] Invoice email sent successfully`
5. **Check inbox** - harus ada email invoice! ✅

**Option B: Test via API Call**
```bash
# Buka terminal baru (jangan matikan dev server)
curl -X POST http://localhost:3000/api/payment/create-invoice -H "Content-Type: application/json" -d "{\"plan\":\"basic\",\"email\":\"YOUR_EMAIL@gmail.com\",\"fullName\":\"Test User\",\"whatsapp\":\"08123456789\"}"

# Expected response:
{
  "success": true,
  "invoiceUrl": "https://checkout.xendit.co/...",
  "externalId": "jobmate-basic-...",
  "emailSent": true  // ← HARUS TRUE!
}
```

**Verifikasi:**
- ✅ Response `emailSent: true`
- ✅ Email invoice masuk ke inbox
- ✅ Terminal log: `Invoice email sent successfully`

### Step 6.3: Test Payment Confirmation Email
> Untuk test webhook perlu payment real atau sandbox

**Via Xendit Sandbox:**
1. Buka invoice URL dari step sebelumnya
2. Klik **"Bayar Sekarang"**
3. Pilih metode: **Virtual Account** atau **E-Wallet**
4. Untuk testing Xendit sandbox, gunakan **test credentials**:
   - DANA: Test mode akan auto-approve
   - VA: Gunakan test VA numbers
5. Complete payment
6. **Check terminal** - ada log: `Payment confirmation email sent successfully`
7. **Check inbox** - ada email "✅ Pembayaran Berhasil!" ✅

---

## 7. Deploy Production

### Step 7.1: Commit & Push Code
```bash
# Di terminal VS Code
cd C:\Users\user\Music\JOBMATE

# Check status
git status

# Add files
git add .

# Commit
git commit -m "Add Resend email integration for invoice notifications

- Add lib/resend.ts for Resend client
- Add lib/send-invoice-email.ts helper
- Add emails/InvoiceEmail.tsx template
- Update create-invoice API to send invoice email
- Update webhook to send payment confirmation
- Add RESEND_API_KEY and RESEND_FROM_EMAIL env vars

Co-authored-by: factory-droid[bot] <138933559+factory-droid[bot]@users.noreply.github.com>"

# Push
git push origin main
```

### Step 7.2: Vercel Auto-Deploy
1. Push akan trigger auto-deploy di Vercel
2. Monitor di: **https://vercel.com/your-username/jobmate/deployments**
3. Wait 1-2 menit untuk build selesai
4. Check logs untuk ensure no errors

### Step 7.3: Verify Environment Variables (Production)
1. Vercel Dashboard > **jobmate** project
2. Settings > **Environment Variables**
3. Pastikan ada:
   - ✅ `RESEND_API_KEY` = `re_xxxxx` (Production checked)
   - ✅ `RESEND_FROM_EMAIL` = `onboarding@resend.dev` (Production checked)
4. Kalau belum ada, tambahkan sekarang! (lihat Step 2.2)

### Step 7.4: Test Production API
```bash
# Test create invoice
curl -X POST https://jobmate.web.id/api/payment/create-invoice \
  -H "Content-Type: application/json" \
  -d '{
    "plan": "basic",
    "email": "YOUR_EMAIL@gmail.com",
    "fullName": "Test User",
    "whatsapp": "08123456789"
  }'

# Expected:
# {"success":true,"invoiceUrl":"https://checkout.xendit.co/...","emailSent":true}
```

### Step 7.5: Monitor Logs
```bash
# Check Vercel logs:
https://vercel.com/your-username/jobmate/logs

# Search for:
# "[Create Invoice] Invoice email sent successfully"
# "[Xendit Webhook] Payment confirmation email sent successfully"

# Check Resend logs:
https://resend.com/emails
# Lihat status delivery: Delivered, Bounced, etc.
```

### Step 7.6: Upgrade ke Custom Domain (Optional)
> Untuk production professional, gunakan domain sendiri

**Benefit:**
- Email dari: `noreply@jobmate.web.id` (bukan onboarding@resend.dev)
- Better deliverability & trust
- No rate limits untuk verified domain

**Steps:**
1. Resend Dashboard > **"Domains"** > **"Add Domain"**
2. Domain: `noreply.jobmate.web.id`
3. Add DNS Records di **Cloudflare** (or domain provider):
   ```
   Type: TXT   | Name: _resend.noreply.jobmate.web.id | Value: [provided-by-resend]
   Type: MX    | Name: noreply.jobmate.web.id         | Value: feedback-smtp.us-east-1.amazonses.com
   Type: TXT   | Name: noreply.jobmate.web.id         | Value: [DKIM-key]
   ```
4. Wait 5-30 menit untuk DNS propagation
5. Verify di Resend dashboard
6. Update Vercel env: `RESEND_FROM_EMAIL=noreply@jobmate.web.id`
7. Redeploy

---

## 8. Troubleshooting

### ❌ Problem 1: Email tidak terkirim

**Symptom**: Log `Failed to send invoice email` atau email tidak masuk inbox

**Debug Steps:**
```bash
# 1. Check API Key di .env.local
cat .env.local | grep RESEND
# Output harus: RESEND_API_KEY=re_xxxxx

# 2. Test API key langsung
npx tsx scripts/test-resend.ts
# Harus berhasil kirim email

# 3. Check Vercel environment variables
# Vercel Dashboard > Settings > Environment Variables
# Pastikan RESEND_API_KEY ada dan correct

# 4. Check Resend dashboard
# https://resend.com/emails
# Lihat apakah email masuk queue
```

**Common Causes:**
- ✅ API key salah/expired → Regenerate di resend.com
- ✅ Environment variable tidak set di Vercel → Add & redeploy
- ✅ Email recipient tidak terdaftar (development) → Add email di Resend team
- ✅ Rate limit exceeded (3,000/month free) → Check usage di resend.com/overview

### ❌ Problem 2: Error "Cannot find module '@/lib/resend'"

**Symptom**: Import error saat build

**Fix:**
```bash
# Check file exists
ls lib/resend.ts
# Harus ada file

# Check tsconfig.json paths
# Pastikan ada:
# "paths": { "@/*": ["./*"] }

# Restart Next.js dev server
npm run dev
```

### ❌ Problem 3: Email masuk Spam

**Symptom**: Email masuk spam folder, bukan inbox

**Fix untuk Development:**
- Gunakan `onboarding@resend.dev` → already whitelisted
- Add email testing di Resend team
- Mark email as "Not Spam" di Gmail

**Fix untuk Production:**
1. Verifikasi domain custom (noreply@jobmate.web.id)
2. Setup SPF, DKIM, DMARC DNS records
3. Warm up email sending (start kecil)
4. Monitor bounce rate di: https://resend.com/emails

### ❌ Problem 4: Webhook tidak trigger email

**Symptom**: Payment berhasil tapi tidak ada email confirmation

**Debug Steps:**
```bash
# 1. Check Vercel logs
https://vercel.com/your-username/jobmate/logs
# Search: "[Xendit Webhook]"

# 2. Check webhook handler
# File: app/api/webhooks/xendit/route.ts
# Pastikan ada kode send email di dalam if (status === 'PAID')

# 3. Test webhook manually
curl -X POST https://jobmate.web.id/api/webhooks/xendit \
  -H "x-callback-token: YOUR_WEBHOOK_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"external_id":"test-123","status":"PAID","payer_email":"test@example.com"}'
```

### ⚙️ Check Logs & Monitoring

**Vercel Logs:**
```bash
# Real-time logs:
https://vercel.com/your-username/jobmate/logs

# Search keywords:
- "Invoice email sent successfully"
- "Payment confirmation email sent"
- "Failed to send email"
- "RESEND_API_KEY"
```

**Resend Dashboard:**
```bash
# Email delivery logs:
https://resend.com/emails

# Metrics to check:
- Delivery Rate (should be >95%)
- Bounce Rate (should be <5%)
- Spam Reports (should be 0)
- API Usage (free: 3,000/month)
```

### 🔧 Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Email not sent | Check API key in Vercel env vars |
| Email to spam | Use verified domain or whitelist sender |
| Rate limit | Upgrade Resend plan or wait next month |
| Import error | Check file paths & tsconfig.json |
| Webhook error | Check x-callback-token header |
| Build error | Run `npm install` & restart dev server |

---

## Quick Start Checklist

**Copy checklist ini ke notepad & centang saat selesai:**

```
SETUP RESEND
[ ] 1. Daftar di resend.com/signup & verify email
[ ] 2. Buat API Key di resend.com/api-keys → copy `re_xxxxx`
[ ] 3. Add testing email di Resend Settings > Team (invite yourself)

ENVIRONMENT VARIABLES  
[ ] 4. Add ke .env.local: RESEND_API_KEY=re_xxxxx
[ ] 5. Add ke .env.local: RESEND_FROM_EMAIL=onboarding@resend.dev
[ ] 6. Add ke Vercel env vars (Step 2.2) → both variables
[ ] 7. Verify: npx tsx -e "console.log(process.env.RESEND_API_KEY)"

INSTALL DEPENDENCIES
[ ] 8. npm install resend @react-email/render
[ ] 9. npm install -D tsx (for testing)
[ ] 10. Verify: npm list resend (should show installed)

CREATE FILES
[ ] 11. Buat lib/resend.ts (copy dari Step 4.1)
[ ] 12. Buat folder emails/ & file InvoiceEmail.tsx (Step 4.2)
[ ] 13. Buat lib/send-invoice-email.ts (Step 4.3)

UPDATE API ROUTES
[ ] 14. Update app/api/payment/create-invoice/route.ts (Step 5.1)
       - Import sendInvoiceEmail
       - Add send email logic after database save
       - Add emailSent to response
[ ] 15. Update app/api/webhooks/xendit/route.ts (Step 5.2)
       - Import resend & FROM_EMAIL
       - Add PaymentSuccessEmail template
       - Add send email in PAID handler

TESTING
[ ] 16. Buat scripts/test-resend.ts & test basic email
[ ] 17. Run: npx tsx scripts/test-resend.ts → check inbox ✅
[ ] 18. Run: npm run dev
[ ] 19. Test create invoice via browser atau API
[ ] 20. Verify email invoice masuk ✅

DEPLOY PRODUCTION
[ ] 21. git add . && git commit
[ ] 22. git push origin main
[ ] 23. Verify Vercel deployment success
[ ] 24. Test production: curl create-invoice API
[ ] 25. Monitor logs: vercel.com & resend.com/emails

OPTIONAL (Later)
[ ] 26. Verify custom domain noreply@jobmate.web.id
[ ] 27. Update RESEND_FROM_EMAIL to custom domain
[ ] 28. Redeploy & test
```

---

## Estimasi Biaya

### Resend.com
- **Free**: 3,000 emails/bulan (cukup untuk start)
- **Pro**: $20/bulan = 50,000 emails
- **Business**: $80/bulan = 100,000 emails

**Contoh perhitungan:**
- 100 invoice/hari = 3,000/bulan → **FREE** ✅
- 500 invoice/hari = 15,000/bulan → **PRO** ($20)

---

## Resources

- [Resend Docs](https://resend.com/docs/send-with-nextjs) - Official Next.js guide
- [Resend Dashboard](https://resend.com/overview) - Analytics & logs
- [React Email](https://react.email/) - Email templates
- [Email Testing](https://resend.com/emails) - Delivery logs

---

## Next Steps (Optional)

1. **Custom Domain** - Verifikasi `noreply@jobmate.web.id`
2. **Email Templates** - Design lebih menarik dengan React Email
3. **Email Tracking** - Monitor open/click rates
4. **Reminder Emails** - Kirim reminder sebelum invoice expire
5. **Receipt Emails** - Send PDF receipt setelah payment

---

## Summary

### ✅ Apa yang Sudah Dikonfigurasi

**Infrastructure:**
- ✅ Resend.com account & API key
- ✅ Environment variables (local & Vercel)
- ✅ Dependencies installed: `resend`, `@react-email/render`

**Code Structure:**
- ✅ `lib/resend.ts` - Resend client initialization
- ✅ `lib/send-invoice-email.ts` - Email sending helper
- ✅ `emails/InvoiceEmail.tsx` - HTML email template
- ✅ `app/api/payment/create-invoice/route.ts` - Send invoice email
- ✅ `app/api/webhooks/xendit/route.ts` - Send confirmation email

**Email Flow:**
1. User buat payment → **Invoice email sent** ✉️
2. User bayar via Xendit → **Webhook trigger** → **Confirmation email sent** ✅

### 📊 Metrics to Monitor

**Resend Dashboard** (https://resend.com/overview):
- Email sent: target 100% success rate
- Delivery rate: > 95%
- Bounce rate: < 5%
- Monthly quota: 3,000 emails (free tier)

**Vercel Logs** (https://vercel.com/logs):
- `[Create Invoice] Invoice email sent successfully`
- `[Xendit Webhook] Payment confirmation email sent successfully`

### 🚀 Next Steps (Optional)

1. **Customize Email Design**
   - Edit `emails/InvoiceEmail.tsx`
   - Add company logo, branding colors
   - Test different email clients (Gmail, Outlook, Apple Mail)

2. **Add More Email Types**
   - Welcome email saat user register
   - Password reset email
   - Reminder email sebelum invoice expire
   - Receipt PDF attachment

3. **Verify Custom Domain**
   - Setup `noreply@jobmate.web.id`
   - Better deliverability & professional appearance
   - No rate limits

4. **Email Analytics**
   - Track open rates (add tracking pixel)
   - Track click rates (add UTM parameters)
   - A/B test subject lines

### 📚 Resources

- [Resend Documentation](https://resend.com/docs/send-with-nextjs)
- [React Email Components](https://react.email/docs/introduction)
- [Xendit API Docs](https://developers.xendit.co/api-reference)
- [Email Best Practices](https://resend.com/docs/knowledge-base/email-best-practices)

---

## 🎉 Done!

**Sistem email invoice sudah siap di JOBMATE!**

- ✅ Invoice email otomatis saat create payment
- ✅ Confirmation email otomatis saat payment berhasil
- ✅ Production-ready dengan monitoring

**Questions or issues?** Check [Troubleshooting](#8-troubleshooting) section atau contact support.

**Happy Coding!** 🚀
