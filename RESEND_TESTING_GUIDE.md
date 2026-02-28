# 🧪 Testing Guide Resend Email Integration

## Status Implementasi
✅ **SELESAI** - Resend email integration sudah lengkap!

### File yang Sudah Dibuat:
- ✅ `lib/resend.ts` - Resend client
- ✅ `emails/InvoiceEmail.tsx` - Invoice email template
- ✅ `lib/send-invoice-email.ts` - Helper kirim email
- ✅ `app/api/payment/create-invoice/route.ts` - UPDATED (kirim invoice email)
- ✅ `app/api/webhooks/xendit/route.ts` - UPDATED (kirim confirmation email)

---

## 🚀 Testing Step by Step

### Step 1: Start Dev Server

```bash
# Terminal 1 - Start Next.js dev server
cd C:\Users\user\Music\JOBMATE
npm run dev

# Wait sampai server ready:
# ✓ Ready in 2.5s
# ○ Local: http://localhost:3000
```

---

### Step 2: Test Invoice Email (Create Payment)

**Option A: Via Terminal/CMD**
```bash
# Terminal baru (jangan close terminal dev server!)
curl -X POST http://localhost:3000/api/payment/create-invoice ^
  -H "Content-Type: application/json" ^
  -d "{\"plan\":\"basic\",\"email\":\"reza.nur.h45@gmail.com\",\"fullName\":\"Reza Testing\",\"whatsapp\":\"08123456789\"}"
```

**Atau jalankan file batch:**
```bash
# Klik 2x file ini:
C:\Users\user\Music\JOBMATE\scripts\test-create-invoice.bat
```

**Expected Response:**
```json
{
  "success": true,
  "invoiceUrl": "https://checkout-staging.xendit.co/v2/...",
  "externalId": "jobmate-basic-1729661234567",
  "invoiceId": "...",
  "amount": 10000,
  "expiryDate": "2025-10-24T...",
  "emailSent": true  ← HARUS TRUE!
}
```

**Check Terminal Logs:**
```
[Create Invoice] Sending invoice email to: reza.nur.h45@gmail.com
[Create Invoice] Invoice email sent successfully
```

**Check Inbox:**
- 📧 Email harus masuk ke **reza.nur.h45@gmail.com**
- Subject: **"Invoice Pembayaran - Career VIP Basic - InfoLokerJombang"**
- Ada button **"Bayar Sekarang"** dengan link ke Xendit

---

### Step 3: Test Payment Confirmation Email (Webhook)

**Via Browser:**
1. Copy `invoiceUrl` dari response Step 2
2. Paste di browser: `https://checkout-staging.xendit.co/v2/...`
3. Pilih metode pembayaran (DANA/GoPay/VA)
4. **Untuk testing**, gunakan test credentials Xendit:
   - DANA: Auto-approve di sandbox
   - VA BCA: Nomor test `1234567890`
   - GoPay: Auto-approve di sandbox

**Atau test webhook manually:**
```bash
curl -X POST http://localhost:3000/api/webhooks/xendit ^
  -H "x-callback-token: JpSqP8UucCLpUlK3ODn8uxQnqk0O4bz9atTcVYrdcZ01wR6h" ^
  -H "Content-Type: application/json" ^
  -d "{\"id\":\"test-invoice-123\",\"external_id\":\"jobmate-basic-123\",\"status\":\"PAID\",\"payer_email\":\"reza.nur.h45@gmail.com\",\"customer\":{\"given_names\":\"Reza\",\"surname\":\"Testing\"},\"paid_at\":\"2025-10-23T11:00:00.000Z\"}"
```

**Expected Terminal Logs:**
```
[Xendit Webhook] Sending payment confirmation email to: reza.nur.h45@gmail.com
[Xendit Webhook] Payment confirmation email sent successfully
```

**Check Inbox:**
- 📧 Email ke **reza.nur.h45@gmail.com**
- Subject: **"✅ Pembayaran VIP Basic Berhasil - JOBMATE"**
- Isi: "Pembayaran Anda telah berhasil diproses. Akses VIP Anda telah diaktifkan!"

---

## 📧 Preview Email Templates

### Email 1: Invoice (Saat Create Payment)
```
Subject: Invoice Pembayaran - Career VIP Basic - InfoLokerJombang
From: onboarding@resend.dev
To: reza.nur.h45@gmail.com

┌─────────────────────────────────────┐
│       Invoice Pembayaran            │ ← Header biru (#4F46E5)
└─────────────────────────────────────┘

Halo Reza Testing,

Terima kasih telah menggunakan layanan kami. 
Berikut adalah detail invoice Anda:

┌─────────────────────────────────────┐
│ Detail Pembayaran                   │
│ Deskripsi: Career VIP Basic         │
│ Jumlah: IDR 10.000                  │ ← Font besar, bold
│ Berlaku hingga: 24/10/2025 12:00   │
└─────────────────────────────────────┘

        [ Bayar Sekarang ]  ← Button biru
        
Link pembayaran kedaluwarsa dalam 24 jam.
```

### Email 2: Payment Confirmation (Saat Bayar Berhasil)
```
Subject: ✅ Pembayaran VIP Basic Berhasil - JOBMATE
From: onboarding@resend.dev
To: reza.nur.h45@gmail.com

┌─────────────────────────────────────┐
│   ✓ Pembayaran Berhasil!           │ ← Header hijau (#10B981)
└─────────────────────────────────────┘

Halo Reza Testing,

Pembayaran Anda telah berhasil diproses.

┌─────────────────────────────────────┐
│ Detail Pembayaran                   │
│ Jumlah: IDR 10.000                  │
│ Tanggal: 23/10/2025 11:00          │
│ Status: PAID ✓                      │ ← Hijau, bold
└─────────────────────────────────────┘

Terima kasih atas pembayaran Anda!
**Akses VIP Anda telah diaktifkan!**
```

---

## 🎨 Improve Desain Email (Opsional)

Jika ingin design lebih menarik, edit file:
- **Invoice**: `C:\Users\user\Music\JOBMATE\emails\InvoiceEmail.tsx`
- **Confirmation**: `C:\Users\user\Music\JOBMATE\app\api\webhooks\xendit\route.ts` (function PaymentSuccessEmail)

**Ide Improvement:**
1. ✅ Tambah logo JOBMATE
2. ✅ Warna gradient
3. ✅ Better typography
4. ✅ Social media links
5. ✅ Footer dengan contact info

**Contoh update invoice template:**
```tsx
// Tambahkan logo
<div className="header">
  <img src="https://infolokerjombang.id/logo.png" alt="JOBMATE" style="height: 40px" />
  <h1>Invoice Pembayaran</h1>
</div>

// Better button styling
<a href={invoiceUrl} className="button" 
   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
  💳 Bayar Sekarang
</a>
```

---

## 🔧 Troubleshooting

### ❌ Email tidak terkirim

**Check 1: API Key benar?**
```bash
# Check .env.local
type .env.local | findstr RESEND_API_KEY

# Output harus:
# RESEND_API_KEY=re_XvExKiw2_...
```

**Check 2: Email recipient harus `reza.nur.h45@gmail.com`**
```
Error: validation_error - You can only send to your own email

Fix: Di development, hanya bisa kirim ke email owner Resend.
Untuk test ke email lain, invite di: https://resend.com/settings/team
```

**Check 3: Terminal logs**
```bash
# Harus ada log:
[Create Invoice] Invoice email sent successfully
[Xendit Webhook] Payment confirmation email sent successfully

# Jika ada error:
Failed to send email: { statusCode: 403, ... }
→ Check recipient email atau API key
```

### ❌ Webhook tidak trigger

**Check 1: Callback token benar?**
```bash
# Di .env.local
XENDIT_WEBHOOK_VERIFICATION_TOKEN=JpSqP8UucCLpUlK3ODn8uxQnqk0O4bz9atTcVYrdcZ01wR6h
```

**Check 2: Test manual webhook**
```bash
curl -X POST http://localhost:3000/api/webhooks/xendit ^
  -H "x-callback-token: JpSqP8UucCLpUlK3ODn8uxQnqk0O4bz9atTcVYrdcZ01wR6h" ^
  -H "Content-Type: application/json" ^
  -d "{\"external_id\":\"test-123\",\"status\":\"PAID\",\"payer_email\":\"reza.nur.h45@gmail.com\"}"
```

---

## 📊 Monitoring Emails

### Resend Dashboard
1. Login: https://resend.com/overview
2. Klik **"Emails"** di sidebar
3. Lihat semua email yang terkirim:
   - ✅ Delivered
   - ⏳ Queued
   - ❌ Failed

### Check Delivery Status
```bash
# Email ID dari response: { id: '3475f8b7-652b-4386-a0ea-c5c08a84c328' }
# Check di: https://resend.com/emails/3475f8b7-652b-4386-a0ea-c5c08a84c328
```

---

## 🚀 Deploy to Production

### Langkah Deploy:

**1. Commit & Push**
```bash
git add .
git commit -m "Add Resend email integration for invoice notifications"
git push origin main
```

**2. Set Vercel Environment Variables**
Login ke: https://vercel.com/your-username/jobmate/settings/environment-variables

Tambahkan:
- `RESEND_API_KEY` = `re_XvExKiw2_PcjvgAzivLgAok5DMFUk2P8Z`
- `RESEND_FROM_EMAIL` = `onboarding@resend.dev`

**3. Redeploy di Vercel**
Auto-deploy setelah push, atau manual di dashboard.

**4. Test Production**
```bash
curl -X POST https://infolokerjombang.id/api/payment/create-invoice ^
  -H "Content-Type: application/json" ^
  -d "{\"plan\":\"basic\",\"email\":\"reza.nur.h45@gmail.com\",\"fullName\":\"Production Test\",\"whatsapp\":\"08123456789\"}"
```

---

## ⚠️ Important Notes

### Development Mode
- ✅ Email hanya ke `reza.nur.h45@gmail.com`
- ✅ Sender: `onboarding@resend.dev`
- ✅ Rate limit: 100 emails/day (free tier test mode)

### Production Mode (After Domain Verification)
- ✅ Email ke siapa saja
- ✅ Sender: `noreply@infolokerjombang.id` (custom domain)
- ✅ Rate limit: 3,000 emails/month (free tier)

### Verify Custom Domain (Optional)
1. Dashboard Resend → **Domains** → **Add Domain**
2. Domain: `noreply.infolokerjombang.id`
3. Add DNS records di Cloudflare:
   ```
   Type: TXT | Name: _resend.noreply | Value: [given-by-resend]
   Type: MX  | Name: noreply         | Value: feedback-smtp.us-east-1.amazonses.com
   ```
4. Wait 5-30 menit
5. Update `.env.local`: `RESEND_FROM_EMAIL=noreply@infolokerjombang.id`

---

## ✅ Checklist Testing

```
Development Testing:
[ ] npm run dev berhasil
[ ] Test basic email connection (scripts/test-resend.ts) ✅
[ ] Test create invoice → email invoice terkirim
[ ] Test webhook manual → email confirmation terkirim
[ ] Check inbox reza.nur.h45@gmail.com → kedua email masuk
[ ] Check Resend dashboard → semua delivered

Production Testing:
[ ] Environment variables set di Vercel
[ ] Deploy berhasil
[ ] Test create invoice di production
[ ] Test real payment di Xendit sandbox
[ ] Email masuk ke inbox customer
[ ] Monitor Resend dashboard untuk errors
```

---

## 🎉 Done!

Resend integration **READY**! 🚀

Email akan otomatis terkirim:
1. 📧 **Invoice email** saat user create payment
2. ✅ **Confirmation email** saat payment berhasil

**Questions?** Check [Troubleshooting](#-troubleshooting) atau contact support.
