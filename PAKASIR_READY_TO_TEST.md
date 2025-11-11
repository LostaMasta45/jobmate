# ✅ Pakasir.com Integration Ready!

## 🎉 Update Berdasarkan Dokumentasi Resmi

Integrasi sudah diupdate menggunakan **metode URL** dari dokumentasi Pakasir.com (lebih simple dan tidak perlu API call).

Dokumentasi: https://pakasir.com/p/docs

---

## 🔧 Setup Langkah Terakhir

### 1. Dapatkan Project SLUG

1. Login ke: https://app.pakasir.com
2. Buat atau buka **Proyek** Anda
3. Catat **SLUG** proyek (contoh: `depodomain`, `myproject`, dll)

### 2. Set SLUG di Project

**Opsi A - Via .env.local (Recommended):**

Buka file `.env.local` di root project, tambahkan:
```env
PAKASIR_PROJECT_SLUG=your-project-slug
```
*(Ganti `your-project-slug` dengan slug sebenarnya)*

**Opsi B - Edit Langsung:**

Buka file: `app/api/test-payment/create-invoice/route.ts`

Edit line 8:
```typescript
const PAKASIR_PROJECT_SLUG = 'your-project-slug';  // ganti dengan slug Anda
```

### 3. Restart Server
```bash
npm run dev
```

### 4. Test Payment
Buka: `http://localhost:3000/test-payment?plan=premium`

---

## 🎯 Cara Kerja

1. User mengisi form payment
2. System membuat URL Pakasir:
   ```
   https://app.pakasir.com/pay/{SLUG}/{AMOUNT}?order_id={ORDER_ID}&redirect={SUCCESS_URL}
   ```
3. User di-redirect ke halaman payment Pakasir.com
4. Setelah bayar, user kembali ke success page Anda

---

## 🔗 URL Format yang Digunakan

```
https://app.pakasir.com/pay/{slug}/{amount}?order_id={order_id}&redirect={redirect_url}
```

**Contoh Real:**
```
https://app.pakasir.com/pay/depodomain/39000?order_id=jobmate-test-premium-1699999999&redirect=http://localhost:3000/test-payment/success?order_id=jobmate-test-premium-1699999999
```

---

## 📋 Checklist

- [ ] Login ke https://app.pakasir.com
- [ ] Buat/buka Proyek
- [ ] Catat SLUG proyek
- [ ] Set `PAKASIR_PROJECT_SLUG` di .env.local atau route.ts
- [ ] Restart development server: `npm run dev`
- [ ] Test payment: `http://localhost:3000/test-payment?plan=premium`
- [ ] Isi form dan submit
- [ ] Verifikasi redirect ke Pakasir.com
- [ ] Test payment flow sampai selesai

---

## 🎨 What Changed

| Before | After |
|--------|-------|
| Complex API call dengan fetch | Simple URL redirect |
| Need many request body fields | Only need: slug, amount, order_id |
| Complex error handling | Direct redirect, no API errors |
| Authorization headers needed | No auth needed (slug is public) |

---

## 🔔 Optional: Setup Webhook

Untuk terima notifikasi otomatis saat payment berhasil:

1. Buka proyek di Pakasir dashboard
2. Set **Webhook URL** ke:
   ```
   https://your-domain.com/api/test-payment/webhook
   ```
3. Pakasir akan POST data saat payment success:
   ```json
   {
     "amount": 39000,
     "order_id": "jobmate-test-premium-...",
     "project": "your-slug",
     "status": "completed",
     "payment_method": "qris",
     "completed_at": "2024-09-10T08:07:02.819+07:00"
   }
   ```

---

## 📞 Need Help?

- Dokumentasi: https://pakasir.com/p/docs
- Support: Join grup WhatsApp (ada di docs)
- Dashboard: https://app.pakasir.com

---

**Status:** ✅ Ready to test (tinggal set SLUG)  
**API Key:** teLlWce5MvY8y0YeTqolnZNRveRRRtll ✅  
**Method:** URL Redirect (Simple & Reliable) ✅
