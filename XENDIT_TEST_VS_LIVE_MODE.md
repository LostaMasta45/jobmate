# 🔄 Xendit: Test Mode vs Live Mode

## 📌 Penjelasan Singkat

### ❓ Apakah uang yang dibayar benar-benar masuk?

**Tergantung mode yang dipakai:**

---

## 🧪 TEST MODE (Saat Ini)

### Karakteristik:
- ✅ **Tidak ada uang asli yang berpindah**
- ✅ Untuk testing dan development
- ✅ Semua transaksi FAKE/simulasi
- ✅ Bisa simulate payment dari dashboard
- ✅ Tidak akan charge kartu kredit asli
- ✅ Tidak akan debet rekening bank

### API Key:
```
XENDIT_SECRET_KEY=xnd_test_xxxxxxxxxxxxx
```
(Notice: **xnd_test_**)

### Cara Bayar (Test Mode):
1. User klik "Lanjut ke Pembayaran"
2. Redirect ke Xendit payment page
3. **JANGAN bayar pakai uang asli!**
4. Simulate payment dari **Xendit Dashboard**:
   - Go to Transactions > Invoices
   - Find invoice yang baru dibuat
   - Klik **"Mark as Paid"** atau **"Simulate Payment"**
   - Invoice langsung paid tanpa bayar uang

### Kapan Pakai:
- ✅ Saat development/testing
- ✅ Saat coba-coba fitur
- ✅ Sebelum go live

---

## 💰 LIVE MODE (Production)

### Karakteristik:
- 💵 **UANG ASLI MASUK ke rekening Xendit Anda**
- 💵 Semua transaksi REAL
- 💵 User bayar pakai uang sungguhan
- 💵 Uang akan di-settle ke rekening bank Anda
- ⚠️ **HATI-HATI: Tidak bisa simulate/fake payment**

### API Key:
```
XENDIT_SECRET_KEY=xnd_production_xxxxxxxxxxxxx
```
(Notice: **xnd_production_**)

### Cara Bayar (Live Mode):
1. User klik "Lanjut ke Pembayaran"
2. Redirect ke Xendit payment page
3. User pilih metode: QRIS/VA/E-Wallet/Credit Card
4. **User bayar pakai uang asli** (Rp 10.000 atau Rp 39.000)
5. Setelah bayar, webhook triggered
6. Database updated, user dapat akses VIP

### Settlement (Pencairan Dana):
- Xendit akan hold dana selama **settlement period** (biasanya T+1 atau T+7 hari)
- Setelah settlement, uang akan ditransfer ke **rekening bank Anda**
- Xendit potong **fee** (biasanya 2-3% per transaksi)

**Contoh:**
```
User bayar: Rp 39.000
Fee Xendit (2.5%): Rp 975
Anda terima: Rp 38.025
```

### Kapan Pakai:
- ✅ Saat production/live
- ✅ Saat mau terima uang asli
- ✅ Setelah semua testing sukses

---

## 🔁 Cara Switch dari Test ke Live Mode

### Step 1: Verifikasi Bisnis di Xendit

**PENTING:** Live Mode hanya bisa diaktifkan setelah **verifikasi bisnis** approved.

1. Login ke Xendit Dashboard: https://dashboard.xendit.co
2. Go to **Settings** > **Business Information**
3. Lengkapi:
   - Nama bisnis/perusahaan
   - Nomor KTP/NIK
   - NPWP (jika ada)
   - Alamat
   - Rekening bank (untuk settlement)
4. Upload dokumen:
   - KTP
   - NPWP (jika ada)
   - Selfie dengan KTP
5. Submit untuk review
6. **Tunggu approval** (biasanya 1-3 hari kerja)

### Step 2: Generate Live API Key

Setelah bisnis approved:

1. Go to **Settings** > **API Keys**
2. Pastikan toggle **"Live Mode"** aktif (warna hijau)
3. Klik **"Generate Live Key"** atau **"Create API Key"**
4. Set permissions:
   - ✅ Money-in products: **Write**
   - ✅ Invoices: **Write**
   - ✅ Transaction: **Read**
5. Copy **Secret Key**
   - Format: `xnd_production_xxxxxxxxxxxx`
   - ⚠️ **JANGAN PERNAH COMMIT KE GIT!**

### Step 3: Update Environment Variables

**Di Vercel Dashboard:**

1. Go to Settings > Environment Variables
2. Update `XENDIT_SECRET_KEY`:
   ```
   OLD: xnd_test_xxxxxxxxxxxxx
   NEW: xnd_production_xxxxxxxxxxxxx
   ```
3. Save
4. **Redeploy** website

### Step 4: Update Webhook URL (Live Mode)

1. Xendit Dashboard > Settings > Webhooks
2. **Pastikan toggle "Live Mode" aktif**
3. Add webhook URL:
   ```
   https://infolokerjombang.id/api/webhooks/xendit
   ```
4. Select events:
   - ✅ Invoices paid
   - ✅ Invoices expired
5. Test webhook (harus return 200 OK)
6. Copy **Verification Token**
7. Update di Vercel env vars:
   ```
   XENDIT_WEBHOOK_VERIFICATION_TOKEN=your_live_token_here
   ```
8. Redeploy

### Step 5: Test Payment (Real Money!)

⚠️ **WARNING:** Ini akan charge uang asli!

1. Buat test payment dengan **amount kecil** (misal Rp 10.000)
2. Bayar pakai QRIS atau VA
3. Verify:
   - Uang benar-benar terpotong
   - Webhook received
   - Database updated
   - Settlement muncul di dashboard

### Step 6: Monitor Settlement

1. Go to Xendit Dashboard > **Balance**
2. Lihat **Pending Settlement** dan **Available Balance**
3. Setup **Auto Disbursement** (otomatis transfer ke bank) atau manual withdraw

---

## 📊 Perbandingan

| Feature | Test Mode 🧪 | Live Mode 💰 |
|---------|-------------|-------------|
| **Uang masuk?** | ❌ Tidak | ✅ Ya, real money |
| **API Key** | `xnd_test_*` | `xnd_production_*` |
| **Simulasi payment?** | ✅ Ya, dari dashboard | ❌ Harus bayar real |
| **Fee Xendit** | ❌ Gratis | ✅ 2-3% per transaksi |
| **Settlement** | ❌ N/A | ✅ T+1 atau T+7 hari |
| **Verifikasi bisnis?** | ❌ Tidak perlu | ✅ Wajib |
| **Webhook** | ✅ Test webhook URL | ✅ Production webhook URL |

---

## 🎯 Recommendation

### Untuk Development (Sekarang):
✅ **Gunakan Test Mode**
- Tidak akan charge uang
- Bisa simulate payment
- Aman untuk testing

### Untuk Production (Nanti):
✅ **Switch ke Live Mode** setelah:
1. ✅ Semua fitur sudah tested dan working
2. ✅ Webhook sudah berhasil 100%
3. ✅ Database schema final
4. ✅ Bisnis verified di Xendit
5. ✅ Rekening bank sudah di-setup untuk settlement

---

## ⚠️ IMPORTANT NOTES

### Jangan Lupa:
1. **JANGAN commit API key ke Git** (test atau live)
2. **Gunakan .env.local untuk development**
3. **Gunakan Vercel env vars untuk production**
4. **Test dulu di Test Mode sebelum Live Mode**
5. **Monitor webhook logs di Vercel & Xendit**

### Security:
- API key = seperti password
- Jika leak, orang bisa create invoice atas nama Anda
- Jika API key leak, langsung regenerate di dashboard

### Settlement:
- Uang tidak langsung masuk ke bank Anda
- Ada holding period (T+1 atau T+7)
- Xendit akan potong fee dari setiap transaksi
- Pastikan rekening bank sudah didaftarkan untuk settlement

---

## 🔍 How to Check Current Mode?

### Via API Key:
```bash
# Check your .env or Vercel env vars
XENDIT_SECRET_KEY=xnd_test_xxxxx → Test Mode 🧪
XENDIT_SECRET_KEY=xnd_production_xxxxx → Live Mode 💰
```

### Via Xendit Dashboard:
- Lihat toggle di sidebar kiri
- **Orange/Yellow = Test Mode 🧪**
- **Green = Live Mode 💰**

---

## 💡 FAQ

**Q: Kalau saya bayar di Test Mode, uang kemana?**  
A: Tidak ada uang yang benar-benar berpindah. Semua fake/simulasi.

**Q: Kapan harus switch ke Live Mode?**  
A: Setelah semua testing sukses dan bisnis verified di Xendit.

**Q: Apakah Test Mode dan Live Mode bisa jalan bersamaan?**  
A: Tidak. Pilih salah satu. Pakai Test Mode untuk development, Live Mode untuk production.

**Q: Berapa fee Xendit?**  
A: Biasanya 2-3% per transaksi + Rp 1.000 (tergantung payment method).

**Q: Berapa lama settlement?**  
A: T+1 untuk e-wallet/QRIS, T+7 untuk credit card.

---

**Status Saat Ini:** 🧪 **TEST MODE**  
**Uang Masuk?** ❌ **Tidak, semua simulasi**

**Untuk Go Live:** Follow steps di atas dan switch ke **LIVE MODE** 💰
