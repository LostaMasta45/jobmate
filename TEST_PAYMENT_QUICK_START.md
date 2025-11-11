# 🚀 Quick Start - Test Payment Pakasir.com

## ✅ Files Yang Sudah Dibuat

### 1. Pages
- ✅ `app/test-payment/page.tsx` - Main test payment page
- ✅ `app/test-payment/success/page.tsx` - Success page
- ✅ `app/test-payment/cancel/page.tsx` - Cancel page

### 2. API Routes
- ✅ `app/api/test-payment/create-invoice/route.ts` - Payment API with Pakasir.com

### 3. Documentation
- ✅ `TEST_PAYMENT_PAKASIR_GUIDE.md` - Complete documentation
- ✅ `TEST_PAYMENT_QUICK_START.md` - This file

## 🔑 API Key Pakasir.com
```
teLlWce5MvY8y0YeTqolnZNRveRRRtll
```

## 🏃 Cara Test Payment

### 1. Jalankan Development Server
```bash
npm run dev
```

### 2. Akses URL Test Payment
```
http://localhost:3000/test-payment?plan=premium
http://localhost:3000/test-payment?plan=basic
```

### 3. Isi Form dan Submit
- Masukkan data test
- Klik "TEST Pembayaran Pakasir.com"
- System akan redirect ke Pakasir.com (jika API sudah benar)

## ⚙️ Konfigurasi Yang Perlu Disesuaikan

### File: `app/api/test-payment/create-invoice/route.ts`

#### 1. API Endpoint (Line 53)
```typescript
const pakasirResponse = await fetch('https://api.pakasir.com/v1/invoices', {
```
👉 **Ganti dengan endpoint Pakasir.com yang benar**

#### 2. Authorization Header (Line 56-58)
```typescript
headers: {
  'Authorization': `Bearer ${PAKASIR_API_KEY}`,
```
👉 **Sesuaikan format auth dengan dokumentasi Pakasir.com**

#### 3. Request Body (Line 61-87)
```typescript
body: JSON.stringify({
  external_id: externalId,
  amount: amount,
  // ... field lainnya
})
```
👉 **Sesuaikan field dengan API docs Pakasir.com**

#### 4. Response Field (Line 112)
```typescript
const paymentUrl = invoice.payment_url || ...
```
👉 **Sesuaikan nama field payment URL**

## 🔍 Testing Checklist

- [ ] Development server running
- [ ] Akses `/test-payment` berhasil
- [ ] Form validation berjalan
- [ ] API endpoint Pakasir.com sudah disesuaikan
- [ ] Authorization header sudah benar
- [ ] Request body fields sudah sesuai
- [ ] Submit form berhasil create invoice
- [ ] Redirect ke payment URL Pakasir.com
- [ ] Success page dapat diakses
- [ ] Cancel page dapat diakses

## 📞 Troubleshooting

### Error saat submit form?
1. Buka Browser Console (F12)
2. Lihat error message di tab Console
3. Check Network tab untuk melihat request/response
4. Lihat server terminal untuk backend logs

### API Pakasir.com error?
1. Cek API endpoint URL
2. Cek format Authorization
3. Cek required fields
4. Review dokumentasi Pakasir.com

## 📚 Resources

- **Full Guide:** `TEST_PAYMENT_PAKASIR_GUIDE.md`
- **Pakasir.com Docs:** [Request dari Pakasir.com support]
- **Production Payment:** `app/payment/page.tsx` (untuk referensi)

## 🎨 Visual Indicators

Test payment page memiliki:
- 🟡 **Yellow banner** di top: "TEST MODE - PAKASIR.COM"
- 🟣 **Purple/Blue color scheme** (berbeda dari orange production)
- 🏷️ **"TEST MODE" badge** di card header
- 🧪 **"(TEST)" suffix** di plan names

## ✨ Next Steps

Setelah test berhasil:
1. Implement webhook handler
2. Add database logging (optional)
3. Move to production
4. Setup monitoring

---

**API Key:** teLlWce5MvY8y0YeTqolnZNRveRRRtll  
**Created:** 2025-11-08  
**Ready to test!** 🚀
