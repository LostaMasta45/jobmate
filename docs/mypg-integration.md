# MY PG (KlikQRIS) Integration Documentation

## Overview

Integrasi payment gateway MY PG (klikqris.com) untuk JOBMATE.

---

## 🔗 URL Endpoints

### Production URLs (setelah deploy)

| Endpoint | URL | Deskripsi |
|----------|-----|-----------|
| **Payment Page** | `https://jobmate.web.id/test-mypg` | Halaman form pembayaran |
| **Test Payment** | `https://jobmate.web.id/test-mypg?plan=test` | Test pembayaran Rp 1.000 |
| **Admin Dashboard** | `https://jobmate.web.id/test-mypg/admin` | Lihat semua transaksi |
| **Webhook URL** | `https://jobmate.web.id/api/mypg/webhook` | ⚠️ SET DI APK KLIKQRIS |

### API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/mypg/create-invoice` | Buat transaksi baru |
| GET | `/api/mypg/check-status?order_id=XXX` | Cek status pembayaran |
| POST | `/api/mypg/webhook` | Terima notifikasi dari KlikQRIS |
| GET | `/api/mypg/transactions` | List semua transaksi |

---

## ⚙️ Konfigurasi di Android App KlikQRIS

### 1. Setting Webhook URL
Buka app **KlikQRIS** di Android:
1. Pergi ke **Settings** / **Pengaturan**
2. Cari menu **Webhook** atau **Notifikasi URL**
3. Masukkan URL:
   ```
   https://jobmate.web.id/api/mypg/webhook
   ```
4. Simpan

### 2. API Credentials
Credentials yang digunakan (sudah dikonfigurasi di kode):
- **API Key**: `WGyyEYlAiGwbHeiwHbcuJlyDlx9xCOsxJ2kPAI1X`
- **Merchant ID**: `176930678538`
- **Base URL**: `https://klikqris.com/api/qrisv2/`

---

## 📋 Plans / Paket Pembayaran

| Plan | Harga | Deskripsi |
|------|-------|-----------|
| **test** | Rp 1.000 | Untuk testing integrasi |
| **basic** | Rp 10.000 | VIP Basic (30 hari) |
| **premium** | Rp 39.000 | VIP Premium (Lifetime) |

### Test Link:
- Test Rp 1.000: `/test-mypg?plan=test`
- Basic: `/test-mypg?plan=basic`
- Premium: `/test-mypg?plan=premium`

---

## 📧 Email Notifications

Email otomatis terkirim pada:
1. **Invoice Email** - Saat membuat pembayaran (template: `InvoiceEmailTable`)
2. **Success Email** - Saat pembayaran berhasil (template: `PaymentSuccessEmail`)

---

## 🗄️ Database Table

Tabel: `mypg_transactions`

| Column | Type | Deskripsi |
|--------|------|-----------|
| id | UUID | Primary key |
| order_id | VARCHAR(100) | ID order unik |
| amount | DECIMAL | Nominal asli |
| total_amount | DECIMAL | Nominal + kode unik |
| status | VARCHAR(20) | PENDING/PAID/EXPIRED |
| email | VARCHAR(255) | Email customer |
| full_name | VARCHAR(255) | Nama customer |
| plan_type | VARCHAR(50) | test/basic/premium |
| paid_at | TIMESTAMP | Waktu pembayaran |
| created_at | TIMESTAMP | Waktu dibuat |

### Cara Setup Database:
1. Buka **Supabase Dashboard** → **SQL Editor**
2. Jalankan script: `supabase/migrations/mypg_transactions.sql`

---

## 🔄 Alur Pembayaran

```
1. User buka /test-mypg → Isi form → Submit
                ↓
2. API /api/mypg/create-invoice → Buat QRIS via klikqris.com
                ↓
3. Simpan ke database + Kirim Email Invoice
                ↓
4. User scan QRIS → Bayar via e-wallet/m-banking
                ↓
5. Webhook dari KlikQRIS → /api/mypg/webhook
                ↓
6. Update status database + Kirim Email Success
                ↓
7. User redirect ke /test-mypg/success
```

---

## ✅ Checklist Sebelum Produksi

- [ ] Deploy ke production server
- [ ] Set Webhook URL di app KlikQRIS Android
- [ ] Jalankan SQL migration untuk tabel `mypg_transactions`
- [ ] Test pembayaran dengan plan=test (Rp 1.000)
- [ ] Verifikasi email notifications terkirim
- [ ] Cek admin dashboard menampilkan transaksi

---

## 🧪 Testing

1. Buka: `/test-mypg?plan=test`
2. Isi form dengan data test
3. Scan QRIS dan bayar Rp 1.000
4. Cek email untuk invoice dan success notification
5. Cek admin dashboard: `/test-mypg/admin`

---

## 📚 Referensi

- [MY PG API Documentation](https://klikqris.com/pg/dokumentasi)
- Supabase Dashboard: `https://supabase.com/dashboard`
