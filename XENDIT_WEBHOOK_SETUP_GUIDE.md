# 🎯 Xendit Webhook Setup - Step by Step Guide

## ⚠️ PENTING: Pilih Webhook yang Benar!

Xendit dashboard ada **BANYAK** pilihan webhook, tapi untuk JobMate kita **HANYA BUTUH 1 WEBHOOK**!

---

## 📋 Quick Summary

**Yang HARUS disetup:**
- ✅ **Payment Links** → **Invoices paid** ← **INI SAJA!**

**Yang JANGAN disetup (skip semua):**
- ❌ Payments → Payment Token Status
- ❌ Payments → Payment Request Status  
- ❌ Payments → Payment Status
- ❌ Payment Session (Completed/Expired)
- ❌ Subscription
- ❌ Refund
- ❌ Payout
- ❌ Reports
- ❌ xenPlatform

---

## 🔧 Step-by-Step Setup

### Step 1: Buka Xendit Webhooks Page

1. Login ke Xendit Dashboard: https://dashboard.xendit.co
2. **Pastikan mode = "Test Mode"** (ada toggle di sidebar kiri)
3. Go to **Settings** > **Webhooks**
4. Atau langsung ke: https://dashboard.xendit.co/settings/developers#webhooks

### Step 2: Locate "Payment Links" Section

Scroll halaman webhook sampai ketemu section **"Payment Links"**.

**Section hierarchy:**
```
Payments (skip)
  ├─ Payments API
  │  ├─ Payment Token Status        ← Skip ❌
  │  ├─ Payment Request Status      ← Skip ❌
  │  └─ Payment Status              ← Skip ❌
  │
  ├─ Payment Session
  │  ├─ Payment Session Completed   ← Skip ❌
  │  └─ Payment Session Expired     ← Skip ❌
  │
  └─ Payment Links                   ← INI YANG KITA MAU! ✅
     └─ Invoices paid                ← SETUP DISINI! ⭐

Subscription (skip ❌)
Refund (skip ❌)
Payout (skip ❌)
Reports (skip ❌)
xenPlatform (skip ❌)
```

### Step 3: Fill Webhook URL untuk "Invoices paid"

Di row **"Invoices paid"**, ada 3 kolom:
1. **Product:** Payment Links
2. **Type:** Invoices paid
3. **Webhook URL:** (isi disini)

**Isi Webhook URL dengan:**
```
https://infolokerjombang.id/api/webhooks/xendit
```

⚠️ **IMPORTANT:**
- Harus `https://` (bukan `http://`)
- Harus exact path `/api/webhooks/xendit`
- JANGAN ada trailing slash `/` di akhir

### Step 4: Enable Optional Notifications (Recommended)

Di bawah URL field, ada 2 checkbox options:

**Checkbox 1:**
```
☑️ Also notify my application when an invoice has expired
```
→ **Centang ini!** Kita butuh notifikasi ketika invoice expired.

**Checkbox 2:**
```
☑️ Also notify my application when a payment has been received after expiry
```
→ **Optional** (centang jika mau handle late payments)

### Step 5: Test Webhook

1. Klik button **"Test and save"**
2. Xendit akan kirim test POST request ke URL kamu
3. Tunggu beberapa detik...

**Possible results:**

✅ **Success (status 200):**
```
✅ Webhook test successful
```
→ Webhook berhasil! Lanjut ke Step 6.

❌ **Failed (timeout/error):**
```
❌ Webhook test failed: Connection timeout
atau
❌ Webhook test failed: 404 Not Found
atau
❌ Webhook test failed: 500 Internal Server Error
```
→ Ada masalah. Lihat [Troubleshooting](#troubleshooting) di bawah.

### Step 6: Save Webhook

Jika test berhasil (✅), webhook akan **otomatis tersimpan**.

✅ **Webhook configuration complete!**

---

## 🔐 Copy Verification Token

Setelah webhook tersimpan, Xendit akan generate **Verification Token** (atau Callback Token).

### Where to Find:

**Option 1: Di halaman Webhooks**
- Setelah save, akan muncul **token** di kolom/row webhook
- Format: string panjang random (e.g., `abc123def456...xyz890`)

**Option 2: Klik webhook detail**
- Click pada webhook yang baru dibuat
- Copy **"Verification Token"** atau **"Callback Token"**

### Add to Vercel Environment Variables

1. Copy verification token
2. Buka Vercel Dashboard: https://vercel.com/dashboard
3. Go to project **JobMate** > **Settings** > **Environment Variables**
4. Klik **"Add New"**
5. **Key:** `XENDIT_WEBHOOK_VERIFICATION_TOKEN`
6. **Value:** Paste token yang dicopy
7. **Environments:** Production, Preview, Development (pilih semua)
8. Klik **"Save"**

### Redeploy

⚠️ **WAJIB redeploy** setelah add env var baru!

**Cara redeploy:**

**Option 1: Via Vercel Dashboard**
1. Go to **Deployments** tab
2. Klik **⋯** (three dots) pada latest deployment
3. Klik **"Redeploy"**
4. Wait for deployment to finish

**Option 2: Via Git Push**
```bash
# Commit dummy change
git commit --allow-empty -m "chore: add xendit webhook verification token"
git push origin main
```

Vercel akan auto-redeploy setelah push.

---

## 🧪 Test Full Payment Flow

Setelah webhook configured dan deployed, test full flow:

### Step 1: Create Invoice

1. Buka website: https://infolokerjombang.id
2. Scroll ke **Pricing Section**
3. Klik **"Ambil Premium Sekarang!"** atau **"Mulai dengan Basic"**
4. Isi form payment:
   - Nama lengkap
   - Email (gunakan email test, e.g., `test@example.com`)
   - WhatsApp
5. Klik **"Lanjut ke Pembayaran"**
6. Akan redirect ke **Xendit payment page**

### Step 2: Simulate Payment (Test Mode)

**Option A: Via Xendit Dashboard (RECOMMENDED)**

1. Buka Xendit Dashboard (jangan tutup payment page)
2. Go to **Transactions** atau **Invoices**
3. Find invoice yang baru dibuat (lihat berdasarkan email/amount)
4. Klik invoice tersebut
5. Klik button **"Simulate Payment"** atau **"Mark as Paid"**
6. Invoice status akan berubah jadi **PAID**

**Option B: Via Payment Page (Test Card)**

Di Xendit payment page, pilih metode pembayaran:

**Test Credit Card:**
```
Card Number: 4000000000000002
CVV: 123
Expiry: 12/25 (any future date)
Name: TEST USER
```

**Test E-Wallet:**
- Pilih OVO/DANA/GoPay
- Akan dapat phone number
- Di Xendit dashboard, simulate payment

### Step 3: Verify Webhook Received

**Check Vercel Logs:**

1. Buka Vercel Dashboard > **Deployments**
2. Klik latest deployment
3. Go to **"Function Logs"** atau **"Runtime Logs"**
4. Look for log entry:
   ```
   [Xendit Webhook] Received: {...}
   [Xendit Webhook] Payment updated to PAID: {...}
   ```

Jika log muncul → **Webhook berhasil!** ✅

**Check Database:**

1. Buka Supabase Dashboard
2. Go to **Table Editor** > **payments**
3. Find payment record berdasarkan email/external_id
4. Check kolom:
   - `status` = **"paid"** ✅
   - `paid_at` = timestamp (not null)
   - `payment_method` = method yang dipilih

### Step 4: Test Redirect

Setelah payment sukses:

1. **Automatically redirect** ke `/payment/success?external_id=...`
2. Success page akan show:
   - ✅ Payment confirmed
   - Amount paid
   - Plan type
   - Auto countdown ke ajukan akun page (5 detik)
3. Klik **"Ajukan Akun Sekarang"** atau tunggu auto redirect
4. Fill account application form
5. Submit

### Step 5: Verify Full Integration

Checklist yang harus sukses:

- [x] Invoice created via Xendit API
- [x] Redirect ke Xendit payment page
- [x] Payment processed (simulated or real)
- [x] Webhook received di backend
- [x] Database updated (status = paid)
- [x] Redirect to success page
- [x] Auto redirect to ajukan akun
- [x] Account application submitted

✅ **SEMUA SUKSES = Payment integration COMPLETE!**

---

## 🚨 Troubleshooting

### Problem 1: "Test and save" failed - Connection timeout

**Causes:**
- Vercel deployment belum selesai
- URL salah
- Route tidak ada

**Solution:**

1. **Check Vercel deployment status:**
   - Go to Vercel Dashboard > Deployments
   - Pastikan latest deployment = ✅ Ready

2. **Check webhook route exists:**
   ```bash
   # Test dengan curl
   curl -X POST https://infolokerjombang.id/api/webhooks/xendit \
     -H "Content-Type: application/json" \
     -d '{"test":"data"}'
   
   # Expected response:
   {"success":true} atau {"error":"..."}
   ```

3. **Check URL correct:**
   ```
   ✅ https://infolokerjombang.id/api/webhooks/xendit
   ❌ https://infolokerjombang.id/api/webhooks/xendit/ (trailing slash)
   ❌ http://infolokerjombang.id/api/webhooks/xendit (http instead of https)
   ```

---

### Problem 2: "Test and save" failed - 404 Not Found

**Causes:**
- Route `/api/webhooks/xendit/route.ts` tidak ada
- Deployment belum include file

**Solution:**

1. **Check file exists:**
   ```
   app/api/webhooks/xendit/route.ts
   ```

2. **Check file di-commit ke Git:**
   ```bash
   git status
   # File tidak boleh "untracked"
   
   # Jika belum commit:
   git add app/api/webhooks/xendit/route.ts
   git commit -m "feat: add xendit webhook handler"
   git push origin main
   ```

3. **Wait for Vercel redeploy** (auto after push)

---

### Problem 3: "Test and save" success, but webhook tidak process payment

**Causes:**
- Environment variable `XENDIT_WEBHOOK_VERIFICATION_TOKEN` tidak set
- Signature verification failed

**Solution:**

1. **Check env var di Vercel:**
   - Settings > Environment Variables
   - Cari: `XENDIT_WEBHOOK_VERIFICATION_TOKEN`
   - Pastikan ada dan value benar

2. **Check Vercel logs untuk error:**
   - Deployments > Function Logs
   - Look for:
     ```
     [Xendit Webhook] Invalid signature
     ```

3. **Re-copy verification token:**
   - Xendit Dashboard > Webhooks
   - Copy token lagi (pastikan tidak ada space)
   - Update di Vercel env vars
   - Redeploy

---

### Problem 4: Webhook received tapi database tidak update

**Causes:**
- Database query error
- RLS policy blocking update
- Wrong external_id

**Solution:**

1. **Check Vercel function logs:**
   ```
   [Xendit Webhook] Database update error: ...
   ```

2. **Check Supabase logs:**
   - Supabase Dashboard > Logs
   - Filter by "Error"

3. **Check RLS policies:**
   - Supabase > Authentication > Policies
   - Table `payments` harus allow service role update

4. **Test manual database update:**
   ```sql
   -- Di Supabase SQL Editor
   UPDATE payments 
   SET status = 'paid' 
   WHERE external_id = 'test-external-id';
   ```

---

### Problem 5: Payment success tapi webhook tidak dikirim

**Causes:**
- Webhook URL tidak tersimpan
- Xendit gagal kirim (retry mechanism)

**Solution:**

1. **Check webhook masih active di Xendit:**
   - Xendit Dashboard > Webhooks
   - Pastikan webhook untuk "Invoices paid" masih ada

2. **Check Xendit webhook logs:**
   - Xendit Dashboard > Webhooks
   - Klik webhook > **View Logs**
   - Lihat delivery status & error messages

3. **Manual trigger webhook (test):**
   - Xendit Dashboard > Transactions
   - Klik invoice
   - Klik **"Resend Webhook"**

---

### Problem 6: Webhook dikirim berulang kali

**Behavior:**
- Same payment di-process multiple times
- Database update multiple kali

**Causes:**
- Xendit retry mechanism (jika response lambat)
- Idempotency tidak implemented

**Solution:**

1. **Make webhook handler idempotent:**
   ```typescript
   // Di webhook handler, check existing status:
   const { data: existing } = await supabase
     .from('payments')
     .select('status')
     .eq('external_id', externalId)
     .single();
   
   if (existing?.status === 'paid') {
     // Already processed, return success
     return NextResponse.json({ success: true });
   }
   
   // Continue with update...
   ```

2. **Return 200 response quickly** (< 5 seconds)

---

## 📚 Reference

### Webhook Payload Example (Invoices paid)

```json
{
  "id": "657a1b0f27e8db4e95d5f2a3",
  "external_id": "jobmate-premium-abc123def456",
  "status": "PAID",
  "paid_at": "2025-01-15T10:30:00.000Z",
  "amount": 39000,
  "currency": "IDR",
  "payer_email": "test@example.com",
  "payment_method": "QRIS",
  "payment_channel": "QRIS",
  "merchant_name": "JobMate",
  "description": "Career VIP Premium - InfoLokerJombang",
  "invoice_url": "https://checkout.xendit.co/...",
  "expiry_date": "2025-01-16T10:30:00.000Z"
}
```

### Webhook Response Expected by Xendit

```json
{
  "success": true
}
```

atau

```json
{
  "error": "Error message"
}
```

**HTTP Status Codes:**
- `200` = Success, Xendit will not retry
- `4xx` = Client error, Xendit will not retry
- `5xx` = Server error, Xendit will retry with backoff

---

## ✅ Success Checklist

Setelah setup selesai, pastikan semua ini ✅:

- [ ] Webhook URL configured di Xendit untuk "Invoices paid"
- [ ] Webhook test berhasil (status 200)
- [ ] Verification token copied ke Vercel env vars
- [ ] Vercel redeployed dengan env var baru
- [ ] Test payment flow end-to-end
- [ ] Webhook received (check Vercel logs)
- [ ] Database updated (status = paid)
- [ ] Redirect to success page works
- [ ] No errors in logs

**Jika semua ✅, payment integration COMPLETE! 🎉**

---

## 🎯 Summary

**Yang WAJIB disetup:**

1. ✅ **Payment Links** → **Invoices paid**
   - URL: `https://infolokerjombang.id/api/webhooks/xendit`
   - ✅ Notify on expired
   - ✅ Notify on late payment (optional)

2. ✅ Copy **Verification Token** to Vercel env vars

3. ✅ Redeploy Vercel

4. ✅ Test full payment flow

**Yang JANGAN disetup:**
- ❌ Semua webhook lainnya (Payment API, Subscription, Refund, Payout, Reports, xenPlatform)

**Reason:** Kita pakai **Invoice API** untuk payment, jadi hanya webhook "Invoices paid" yang relevant.

---

## 📞 Need Help?

- **Xendit Documentation:** https://developers.xendit.co/api-reference/#webhooks
- **Xendit Support:** support@xendit.co
- **Check:** `xendit.md` untuk full payment integration guide
- **Check:** `vercel.md` untuk deployment guide

---

**Last Updated:** 2025-01-XX  
**For:** JobMate Payment Integration  
**Platform:** Xendit + Vercel + Next.js
