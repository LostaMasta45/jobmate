# 🔧 Pakasir.com Setup Instructions

## ❌ Error Yang Terjadi
```
ENOTFOUND api.pakasir.com
Network error connecting to Pakasir.com
```

## ✅ Solusi

Endpoint API Pakasir.com belum dikonfigurasi dengan benar. Ikuti langkah berikut:

---

## 📝 Langkah 1: Dapatkan Dokumentasi API Pakasir.com

Anda perlu mendapatkan informasi berikut dari Pakasir.com:

### Informasi yang dibutuhkan:
1. **API Endpoint** - URL untuk membuat invoice/payment
   - Contoh: `https://pakasir.com/api/v1/invoices`
   - Contoh: `https://api.pakasir.com/payment/create`

2. **Authorization Method** - Cara authenticate API
   - Bearer Token? `Authorization: Bearer YOUR_API_KEY`
   - API Key Header? `X-API-Key: YOUR_API_KEY`
   - Basic Auth? `Authorization: Basic base64(key:)`

3. **Request Body Fields** - Field apa saja yang required
   ```json
   {
     "amount": 10000,
     "customer_email": "email@example.com",
     "customer_name": "Nama",
     // field lainnya...
   }
   ```

4. **Response Structure** - Format response dari API
   ```json
   {
     "payment_url": "https://...",  // atau "invoice_url", "checkout_url"?
     "id": "...",
     // field lainnya...
   }
   ```

### Cara mendapatkan dokumentasi:
- 📧 Email support Pakasir.com
- 💬 Contact customer service
- 🌐 Cek dashboard Pakasir.com (biasanya ada menu API/Developer)
- 📱 WhatsApp/Telegram support

---

## 🔧 Langkah 2: Konfigurasi Endpoint

### **Opsi A: Via Environment Variable (Recommended)**

1. Buka file `.env.local` di root project
2. Tambahkan:
```env
PAKASIR_API_ENDPOINT=https://pakasir.com/api/v1/invoices
```
*(Ganti URL dengan endpoint yang benar)*

3. Restart development server:
```bash
# Stop server (Ctrl+C)
npm run dev
```

### **Opsi B: Hardcode di File Route**

1. Buka file: `app/api/test-payment/create-invoice/route.ts`
2. Edit line 11:
```typescript
// Line 11 - Ganti dengan endpoint yang benar
const PAKASIR_API_ENDPOINT = 'https://pakasir.com/api/v1/invoices';
```

3. Save dan restart server

---

## 🔧 Langkah 3: Sesuaikan Authorization

Buka file: `app/api/test-payment/create-invoice/route.ts`

### Jika menggunakan Bearer Token (line 82-87):
```typescript
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${PAKASIR_API_KEY}`,
},
```

### Jika menggunakan API Key Header:
```typescript
headers: {
  'Content-Type': 'application/json',
  'X-API-Key': PAKASIR_API_KEY,
  // atau
  // 'Api-Key': PAKASIR_API_KEY,
},
```

### Jika menggunakan Basic Auth:
```typescript
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Basic ${Buffer.from(PAKASIR_API_KEY + ':').toString('base64')}`,
},
```

---

## 🔧 Langkah 4: Sesuaikan Request Body

Edit line 89-115 sesuai dengan field yang required oleh Pakasir.com API:

```typescript
body: JSON.stringify({
  // Sesuaikan field ini dengan dokumentasi Pakasir.com
  amount: amount,                    // atau "total"? "price"?
  customer_email: email,             // atau "email"? "payer_email"?
  customer_name: fullName,           // atau "name"? "payer_name"?
  customer_phone: whatsapp,          // atau "phone"? "mobile"?
  description: `${selectedPlan.name} - InfoLokerJombang TEST`,
  
  // URL callbacks
  success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/test-payment/success?external_id=${externalId}`,
  cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/test-payment/cancel?external_id=${externalId}`,
  
  // Field tambahan (hapus jika tidak perlu)
  external_id: externalId,
  currency: 'IDR',
  expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
}),
```

---

## 🔧 Langkah 5: Sesuaikan Response Handler

Edit line 131 untuk extract payment URL dengan field name yang benar:

```typescript
// Line 131 - Sesuaikan nama field payment URL
const paymentUrl = invoice.payment_url       // coba payment_url
                || invoice.invoice_url       // atau invoice_url
                || invoice.checkout_url      // atau checkout_url
                || invoice.url;              // atau url
```

Atau jika sudah tahu pasti:
```typescript
const paymentUrl = invoice.payment_url; // sesuaikan
```

---

## 🧪 Langkah 6: Test API

### Test 1: Cek API Status
```bash
curl http://localhost:3000/api/test-payment/create-invoice
```

Harus return:
```json
{
  "status": "TEST Payment API Ready",
  "gateway": "Pakasir.com",
  "apiKey": "Configured",
  ...
}
```

### Test 2: Test Payment Form
1. Buka: `http://localhost:3000/test-payment?plan=premium`
2. Isi form dengan data test
3. Submit
4. Lihat console/terminal untuk logs

### Test 3: Direct API Test
```bash
curl -X POST http://localhost:3000/api/test-payment/create-invoice \
  -H "Content-Type: application/json" \
  -d '{
    "plan": "premium",
    "email": "test@example.com",
    "fullName": "Test User",
    "whatsapp": "08123456789"
  }'
```

---

## 🐛 Troubleshooting

### Error: "ENDPOINT_BELUM_DIKONFIGURASI"
✅ Set `PAKASIR_API_ENDPOINT` di `.env.local` atau hardcode di route.ts

### Error: "ENOTFOUND"
✅ Cek spelling URL endpoint  
✅ Pastikan URL bisa diakses (test di browser/Postman)  
✅ Cek koneksi internet

### Error: 401 Unauthorized
✅ Cek API Key masih valid  
✅ Cek format Authorization header  
✅ Cek apakah perlu aktivasi API di dashboard Pakasir.com

### Error: 400 Bad Request
✅ Cek field-field required  
✅ Cek format data (number vs string)  
✅ Review dokumentasi API

### Error: "No payment URL received"
✅ Print full response untuk lihat structure  
✅ Sesuaikan nama field di line 131  
✅ Cek dokumentasi response structure

---

## 📞 Kontak Pakasir.com

Hubungi Pakasir.com untuk mendapatkan:
- ✅ API Documentation
- ✅ API Endpoint URL
- ✅ Authorization method
- ✅ Request/Response structure
- ✅ Webhook configuration
- ✅ Test credentials (sandbox/development mode)

---

## 📝 Checklist Setup

- [ ] Dapatkan dokumentasi API Pakasir.com
- [ ] Set `PAKASIR_API_ENDPOINT` di .env.local
- [ ] Sesuaikan Authorization header (line 82-87)
- [ ] Sesuaikan Request body fields (line 89-115)
- [ ] Sesuaikan Response payment_url field (line 131)
- [ ] Restart development server
- [ ] Test dengan form payment
- [ ] Verifikasi redirect ke payment URL
- [ ] Test payment flow sampai success/cancel

---

**Need Help?** Review file berikut:
- `TEST_PAYMENT_PAKASIR_GUIDE.md` - Full documentation
- `TEST_PAYMENT_QUICK_START.md` - Quick start guide
- `app/api/test-payment/create-invoice/route.ts` - API implementation

**Status:** ⚠️ Waiting for Pakasir.com API documentation  
**API Key:** teLlWce5MvY8y0YeTqolnZNRveRRRtll (Already configured ✅)
