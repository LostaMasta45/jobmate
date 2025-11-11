# 🧪 Test Payment Pakasir.com - Panduan Lengkap

## 📋 Overview
Halaman test payment untuk menguji integrasi payment gateway **Pakasir.com** sebelum di-implementasikan ke production.

## 🔑 API Key
```
API Key: teLlWce5MvY8y0YeTqolnZNRveRRRtll
```

## 📍 URLs yang Dibuat

### 1. Test Payment Page
```
http://localhost:3000/test-payment?plan=premium
http://localhost:3000/test-payment?plan=basic
```

### 2. Success Page
```
http://localhost:3000/test-payment/success?external_id=xxx
```

### 3. Cancel Page
```
http://localhost:3000/test-payment/cancel?external_id=xxx
```

### 4. API Endpoint
```
POST /api/test-payment/create-invoice
GET  /api/test-payment/create-invoice (untuk cek status API)
```

## 🎯 Cara Menggunakan

### Step 1: Jalankan Development Server
```bash
npm run dev
```

### Step 2: Akses Test Payment Page
Buka browser dan akses:
```
http://localhost:3000/test-payment?plan=premium
```

### Step 3: Isi Form
- Nama Lengkap
- Email
- Nomor WhatsApp

### Step 4: Klik "TEST Pembayaran Pakasir.com"
System akan:
1. Validasi form data
2. Membuat invoice ke Pakasir.com API
3. Redirect ke payment page Pakasir.com

## 🛠️ Konfigurasi API Pakasir.com

File yang perlu disesuaikan: `app/api/test-payment/create-invoice/route.ts`

### 1. API Endpoint
```typescript
// Line 53 - Ganti dengan endpoint Pakasir.com yang benar
const pakasirResponse = await fetch('https://api.pakasir.com/v1/invoices', {
```

Kemungkinan endpoint lain:
- `https://api.pakasir.com/v1/payments`
- `https://api.pakasir.com/v1/transactions`
- `https://pakasir.com/api/v1/invoices`

### 2. Authorization Header
```typescript
// Line 56-58 - Pilih metode auth yang sesuai
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${PAKASIR_API_KEY}`,  // Option 1
  // 'X-API-Key': PAKASIR_API_KEY,               // Option 2
  // 'Api-Key': PAKASIR_API_KEY,                 // Option 3
},
```

### 3. Request Body Fields
```typescript
// Line 61-87 - Sesuaikan field dengan dokumentasi Pakasir.com
body: JSON.stringify({
  external_id: externalId,        // ID unik transaksi
  amount: amount,                 // Jumlah pembayaran
  customer_email: email,          // Email customer
  customer_name: fullName,        // Nama customer
  customer_phone: whatsapp,       // Nomor WA
  description: 'Description',     // Deskripsi
  success_url: 'URL',            // URL success
  cancel_url: 'URL',             // URL cancel
  callback_url: 'URL',           // Webhook URL
  currency: 'IDR',
  expires_at: 'ISO Date',
  items: [...],
  metadata: {...}
})
```

### 4. Response Field
```typescript
// Line 112 - Sesuaikan nama field payment URL
const paymentUrl = invoice.payment_url || invoice.invoice_url || invoice.checkout_url || invoice.url;
```

## 🔍 Debug & Testing

### 1. Cek API Status
```bash
curl http://localhost:3000/api/test-payment/create-invoice
```

Response:
```json
{
  "status": "TEST Payment API Ready",
  "gateway": "Pakasir.com",
  "apiKey": "Configured",
  "timestamp": "2025-11-08T...",
  "note": "This is a test payment endpoint..."
}
```

### 2. Cek Console Logs
Buka browser console (F12) untuk melihat:
- Request yang dikirim
- Response dari Pakasir.com
- Error messages (jika ada)

Atau cek terminal server untuk server-side logs:
```
[TEST Payment] Creating invoice with Pakasir.com:
[TEST Payment] Pakasir.com invoice created:
[TEST Payment] Pakasir.com API error:
```

### 3. Test dengan cURL
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

## ⚠️ Troubleshooting

### Error: "Network error connecting to Pakasir.com"
- Cek API endpoint URL
- Cek koneksi internet
- Pastikan Pakasir.com API dapat diakses

### Error: "Failed to create invoice" (401 Unauthorized)
- Cek API Key
- Cek format Authorization header
- Pastikan API Key valid dan active

### Error: "Failed to create invoice" (400 Bad Request)
- Cek field-field request body
- Sesuaikan dengan dokumentasi Pakasir.com
- Cek format data (currency, amount, etc)

### Error: "No payment URL received"
- Cek response dari Pakasir.com
- Sesuaikan field name di line 112
- Lihat console log untuk full response

## 📚 Dokumentasi Pakasir.com

Untuk informasi lengkap tentang API Pakasir.com:
1. Cek dokumentasi resmi di website Pakasir.com
2. Hubungi support Pakasir.com untuk API docs
3. Tanyakan tentang:
   - API Endpoint yang benar
   - Format authorization
   - Required fields
   - Response structure
   - Webhook configuration

## 🎨 Perbedaan dengan Payment Asli

| Feature | Production Payment | Test Payment |
|---------|-------------------|--------------|
| Gateway | Xendit | Pakasir.com |
| URL | `/payment` | `/test-payment` |
| API | `/api/payment/create-invoice` | `/api/test-payment/create-invoice` |
| Color Theme | Amber/Orange | Purple/Blue |
| Banner | None | Yellow "TEST MODE" banner |
| Database | Saves to `payments` table | No database save |
| Email | Sends invoice email | No email |
| Webhook | `/api/webhooks/xendit` | `/api/test-payment/webhook` (to be created) |

## 🚀 Next Steps

### 1. Implement Webhook Handler
Create: `app/api/test-payment/webhook/route.ts`
```typescript
export async function POST(request: NextRequest) {
  // Handle callback dari Pakasir.com
  // Update status payment
  // Activate VIP membership
}
```

### 2. Add Database Logging (Optional)
Untuk tracking test transactions:
```sql
CREATE TABLE test_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  external_id TEXT UNIQUE,
  user_email TEXT,
  amount INTEGER,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3. Production Implementation
Setelah test sukses:
1. Copy API integration ke production payment
2. Update environment variables
3. Setup webhook di Pakasir.com dashboard
4. Test dengan real transaction
5. Deploy to production

## 📞 Support

Jika ada masalah:
1. Cek console logs (browser & server)
2. Review dokumentasi Pakasir.com
3. Contact Pakasir.com support
4. Check API key validity

---

**Created:** 2025-11-08  
**API Key:** teLlWce5MvY8y0YeTqolnZNRveRRRtll  
**Purpose:** Testing Pakasir.com payment gateway integration
