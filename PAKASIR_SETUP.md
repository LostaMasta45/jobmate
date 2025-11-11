# 🔧 Pakasir.com Setup - Fix Error

## ❌ Error
```
ENOTFOUND api.pakasir.com - Network error
```

## ✅ Yang Perlu Dilakukan

### 1️⃣ Dapatkan Dokumentasi API Pakasir.com

Hubungi Pakasir.com support untuk mendapatkan:
- API Endpoint URL (contoh: `https://pakasir.com/api/v1/invoices`)
- Authorization method (Bearer Token / API Key / Basic Auth)
- Request body fields yang required
- Response structure

### 2️⃣ Set API Endpoint

**Opsi A - Via .env.local (Recommended):**
```env
PAKASIR_API_ENDPOINT=https://pakasir.com/api/v1/invoices
```

**Opsi B - Edit langsung di route.ts line 11:**
```typescript
const PAKASIR_API_ENDPOINT = 'https://pakasir.com/api/v1/invoices';
```

### 3️⃣ Restart Server
```bash
npm run dev
```

### 4️⃣ Test Lagi
Akses: `http://localhost:3000/test-payment?plan=premium`

---

## 📞 Yang Perlu Ditanyakan ke Pakasir.com

1. **API Endpoint URL untuk create payment/invoice?**
2. **Format Authorization header yang benar?**
3. **Field apa saja yang required di request body?**
4. **Nama field untuk payment URL di response?**

---

API Key sudah terkonfigurasi ✅  
Tinggal set endpoint yang benar dari dokumentasi Pakasir.com
