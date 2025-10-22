# 📧 Xendit Email Notifications - Test vs Live Mode

## ❓ Pertanyaan: Apakah Xendit Test Mode Mengirim Email?

**Jawaban Singkat:** 

✅ **YA** - Xendit TETAP mengirim email notification di **Test Mode**, tapi dengan beberapa perbedaan!

---

## 📨 Email yang Dikirim Xendit

### Di Code Anda:

Saat create invoice, Anda sudah set `payer_email`:

```typescript
// File: app/api/payment/create-invoice/route.ts
{
  payer_email: email,  // ✅ Email user yang isi form
  customer: {
    given_names: fullName,
    email: email,       // ✅ Email user
    mobile_number: whatsapp,
  },
}
```

**Result:** Xendit akan mengirim email ke alamat ini.

---

## 🧪 Test Mode: Email Notifications

### ✅ Email AKAN Dikirim ke:

1. **Invoice Created Email**
   - Dikirim ke: `payer_email` (email yang diisi user)
   - Subject: "Invoice dari [Your Business Name]"
   - Isi: Link untuk bayar invoice, detail invoice
   - Status: **AKAN DIKIRIM** di test mode

2. **Payment Reminder Email** (Jika belum bayar)
   - Dikirim otomatis jika invoice belum paid
   - Reminder sebelum expire
   - Status: **AKAN DIKIRIM** di test mode

3. **Payment Success Email** (Setelah bayar/simulate)
   - Dikirim ke: `payer_email`
   - Subject: "Pembayaran Berhasil"
   - Isi: Receipt, bukti pembayaran
   - Status: **AKAN DIKIRIM** di test mode

### ⚠️ Perbedaan Test vs Live:

| Feature | Test Mode 🧪 | Live Mode 💰 |
|---------|--------------|-------------|
| **Invoice email** | ✅ Dikirim | ✅ Dikirim |
| **Payment success email** | ✅ Dikirim | ✅ Dikirim |
| **Email branding** | [TEST] prefix | Normal branding |
| **Email dari** | test@xendit.co | noreply@xendit.co |
| **Real payment link** | ❌ Simulasi | ✅ Real payment |

---

## 🎯 Cara Test Email Notification

### Step 1: Create Invoice (Test Mode)

```bash
# Your current setup already does this
POST /api/payment/create-invoice
{
  "plan": "basic",
  "email": "your-real-email@gmail.com",  # ✅ Gunakan email asli Anda!
  "fullName": "Test User",
  "whatsapp": "08123456789"
}
```

**Result:**
- Invoice created di Xendit
- Email **langsung dikirim** ke `your-real-email@gmail.com`
- Check inbox Anda!

### Step 2: Check Email

**Email yang akan Anda terima:**

```
From: Xendit <test@xendit.co>
Subject: [TEST] Invoice dari InfoLokerJombang

Hi Test User,

Terima kasih telah melakukan pemesanan. 
Berikut adalah invoice Anda:

Invoice ID: xxxxx
Amount: Rp 10.000
Expired: 24 jam

[Bayar Sekarang] ← Link ke Xendit payment page

---
This is a TEST invoice. No real money will be charged.
```

### Step 3: Simulate Payment

1. **Option A: Via Xendit Dashboard**
   - Go to: https://dashboard.xendit.co
   - Transactions → Invoices
   - Find invoice yang baru dibuat
   - Klik **"Mark as Paid"** atau **"Simulate Payment"**
   
2. **Option B: Via Payment Page**
   - Klik link di email
   - Pilih payment method (simulasi)
   - Click "Bayar"

**Result:**
- Invoice status = PAID
- Email **"Payment Success"** dikirim ke `payer_email`
- Webhook triggered
- Database updated

### Step 4: Check Payment Success Email

```
From: Xendit <test@xendit.co>
Subject: [TEST] Pembayaran Berhasil - Invoice xxxxx

Hi Test User,

Pembayaran Anda telah berhasil!

Invoice ID: xxxxx
Amount: Rp 10.000
Paid at: 2025-01-XX 10:00 WIB

Terima kasih telah menggunakan layanan kami.

---
This is a TEST payment. No real money was charged.
```

---

## 💡 Tips: Gunakan Email Asli untuk Testing

### ✅ RECOMMENDED:

```typescript
// Test dengan email asli Anda
{
  "email": "your-real-email@gmail.com",  // ✅ GOOD
  "fullName": "Your Name",
  "whatsapp": "08123456789"
}
```

**Why?**
- Anda bisa lihat email yang diterima user
- Test UX dari perspektif user
- Verify email template Xendit
- Check apakah link bekerja

### ❌ TIDAK DISARANKAN:

```typescript
// Jangan gunakan email fake/tidak exist
{
  "email": "test@test.com",  // ❌ BAD - Email tidak exist
  "fullName": "Test User",
  "whatsapp": "08123456789"
}
```

**Why?**
- Email akan bounce (tidak sampai)
- Tidak bisa test apakah email terkirim
- Tidak bisa verify UX

---

## 🔍 Cek Email Delivery Status

### Via Xendit Dashboard:

1. Login ke https://dashboard.xendit.co
2. Go to **Transactions** → **Invoices**
3. Click invoice yang baru dibuat
4. Scroll ke **Activity Log**
5. Lihat status:
   ```
   ✅ Invoice created
   ✅ Email sent to: user@example.com
   ✅ Email delivered
   ✅ Invoice paid (simulated)
   ✅ Payment success email sent
   ```

### Check Your Email:

1. **Inbox** - Check email masuk
2. **Spam/Junk** - Kadang masuk spam (especially test emails)
3. **Promotions Tab** (Gmail) - Xendit email kadang masuk sini

---

## 🚨 Troubleshooting: Email Tidak Terkirim

### Problem 1: Email Tidak Sampai

**Possible Causes:**
1. Email salah/typo
2. Masuk spam folder
3. Email bounce (tidak exist)
4. Email provider block sender

**Solution:**
- ✅ Cek typo di email
- ✅ Check spam/junk folder
- ✅ Gunakan email provider populer (Gmail, Yahoo, Outlook)
- ✅ Verify di Xendit dashboard (Activity Log)

### Problem 2: Email Format Tidak Sesuai

**Xendit Test Mode:**
- Email akan ada prefix **[TEST]**
- Branding bisa berbeda
- Link payment ke test environment

**Solution:**
- Normal untuk test mode
- Live mode akan kirim email normal (tanpa [TEST])

### Problem 3: Webhook Triggered tapi Email Tidak Ada

**Possible Causes:**
- Webhook triggered sebelum Xendit kirim email
- Email delay (bisa 1-5 menit)

**Solution:**
- Tunggu 5 menit
- Check spam folder
- Verify di Xendit dashboard

---

## 💰 Live Mode: Email Notifications

### Perbedaan dengan Test Mode:

1. **Email Branding:**
   - Tidak ada prefix [TEST]
   - Professional email template
   - Custom branding (bisa setup di dashboard)

2. **Email Content:**
   - Real payment instructions
   - Real receipt after payment
   - Invoice dengan logo bisnis Anda

3. **Email Sender:**
   - From: `noreply@xendit.co` atau custom domain
   - Reply-to: Email support Anda (bisa diatur)

4. **Email Delivery:**
   - Higher priority (production SLA)
   - Better deliverability
   - No [TEST] prefix

---

## 📊 Email Flow Diagram

```
User mengisi form payment
         ↓
POST /api/payment/create-invoice
         ↓
Xendit create invoice
         ↓
📧 Email #1: "Invoice Created" → Sent to payer_email
         ↓
User klik link di email
         ↓
User bayar (atau simulate di test mode)
         ↓
Xendit process payment
         ↓
📧 Email #2: "Payment Success" → Sent to payer_email
         ↓
Webhook triggered → Update database
         ↓
User redirect ke /payment/success
```

---

## 🎯 Recommendation

### Untuk Testing:

1. ✅ **Gunakan email asli Anda** (Gmail/Yahoo/Outlook)
2. ✅ **Test full flow:**
   - Create invoice
   - Check email #1 (Invoice)
   - Simulate payment
   - Check email #2 (Success)
3. ✅ **Verify semua link work**
4. ✅ **Check email masuk spam atau tidak**

### Untuk Production:

1. ✅ **Setup custom email branding** di Xendit dashboard
2. ✅ **Test dengan multiple email providers**
3. ✅ **Monitor email delivery rate**
4. ✅ **Setup SPF/DKIM** untuk better deliverability

---

## 📝 Summary

**Pertanyaan:** Apakah Xendit test mode kirim email?

**Jawaban:** 
✅ **YA!** Xendit TETAP kirim email di test mode, dengan perbedaan:

| Feature | Test Mode | Live Mode |
|---------|-----------|-----------|
| **Invoice email** | ✅ Dikirim (prefix [TEST]) | ✅ Dikirim (normal) |
| **Success email** | ✅ Dikirim (prefix [TEST]) | ✅ Dikirim (normal) |
| **Email destination** | `payer_email` yang Anda set | `payer_email` yang Anda set |
| **Real payment** | ❌ Simulasi | ✅ Real money |

**Best Practice:**
- Use real email untuk testing (your own email)
- Check spam folder
- Verify di Xendit dashboard
- Test full flow sebelum go live

**Status Saat Ini:**
- ✅ Code Anda sudah correct (set `payer_email`)
- ✅ Email AKAN dikirim di test mode
- ✅ Test sekarang dengan email asli Anda!

---

**Documentation:** https://docs.xendit.co/api-integration/quick-start  
**Dashboard:** https://dashboard.xendit.co  
**Status:** ✅ Email notifications ACTIVE di test mode
