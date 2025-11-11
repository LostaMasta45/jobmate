# 🔍 Pakasir.com - Cara Kerja Payment Flow

## 📱 Pertanyaan: QRIS dari mana?

### Jawaban: **QRIS string langsung dari Pakasir.com API**

---

## 🔄 Complete Payment Flow

### **Step 1: User Isi Form**
```
User mengisi:
- Nama Lengkap
- Email
- WhatsApp
- Pilih Plan (Basic/Premium)
```

### **Step 2: Create Transaction di Pakasir**
```
Frontend → POST /api/test-payment/create-invoice
           ↓
Backend → POST https://app.pakasir.com/api/transactioncreate/qris
          Body: {
            "project": "jobmate",
            "order_id": "jobmate-test-premium-xxx",
            "amount": 39000,
            "api_key": "teLl..."
          }
```

### **Step 3: Pakasir Response dengan QR String**
```json
{
  "payment": {
    "project": "jobmate",
    "order_id": "jobmate-test-premium-1762601027812",
    "amount": 39000,
    "fee": 1003,
    "total_payment": 40003,
    "payment_method": "qris",
    "payment_number": "00020101021226610016ID.CO.SHOPEE.WWW01189360091800216005230208216005230303UME51440014ID.CO.QRIS.WWW0215ID10243228429300303UME5204792953033605409100003.005802ID5907Pakasir6012KAB. KEBUMEN61055439262230519SP25RZRATEQI2HQ65Q46304A079",
    "expired_at": "2025-09-19T01:18:49.678622564Z"
  }
}
```

**👆 `payment_number` inilah QR STRING yang kita display!**

### **Step 4: Display QR Code**
```tsx
// Frontend: app/test-payment/pay/page.tsx
import QRCode from "react-qr-code";

<QRCode
  value={paymentData.payment_number}  // <- QR string dari Pakasir
  size={256}
/>
```

Library `react-qr-code` mengubah string panjang itu menjadi QR code visual yang bisa di-scan.

### **Step 5: User Scan QR & Bayar**
```
User:
1. Buka app GoPay/OVO/Dana/ShopeePay/dll
2. Pilih menu "Bayar" atau "Scan QR"
3. Scan QR code di layar
4. Konfirmasi pembayaran
5. Transfer sesuai nominal (Rp 40.003)
```

### **Step 6: Auto Check Status (Every 5 seconds)**
```
Frontend → GET /api/test-payment/check-status?order_id=xxx&amount=39000
           ↓
Backend → GET https://app.pakasir.com/api/transactiondetail
          Params: {
            project: "jobmate",
            order_id: "xxx",
            amount: 39000,  ← REQUIRED!
            api_key: "xxx"
          }
           ↓
Pakasir Response:
{
  "transaction": {
    "status": "pending"  // atau "completed"
  }
}
```

**Jika status = "completed":**
```
Frontend otomatis redirect ke → /test-payment/success
```

### **Step 7: Webhook (Bonus - dari Pakasir)**
```
Saat payment berhasil, Pakasir akan POST ke:
POST https://your-domain.com/api/test-payment/webhook

Body:
{
  "amount": 39000,
  "order_id": "jobmate-test-premium-xxx",
  "project": "jobmate",
  "status": "completed",
  "payment_method": "qris",
  "completed_at": "2024-09-10T08:07:02.819+07:00"
}
```

Di webhook handler, Anda bisa:
- Save ke database
- Activate VIP membership
- Send email confirmation
- Update user status

---

## 🔧 Error Yang Tadi: Amount Required

### Masalah:
```
Error: Field validation for 'Amount' failed on the 'required' tag
```

### Penyebab:
Pakasir API `transactiondetail` **WAJIB** membutuhkan parameter `amount`.

### Fix:
```typescript
// ❌ SEBELUM (Error)
fetch(`/api/test-payment/check-status?order_id=${orderId}`)

// ✅ SETELAH (Fixed)
fetch(`/api/test-payment/check-status?order_id=${orderId}&amount=${paymentData.amount}`)
```

### Kenapa amount required?
Untuk validasi tambahan. Pakasir memastikan:
- Order ID benar
- Amount sesuai dengan yang di-create

Ini security measure untuk prevent fraud.

---

## 📊 Data Flow Diagram

```
┌─────────────┐
│    User     │
│  Fill Form  │
└──────┬──────┘
       │
       ▼
┌─────────────┐      ┌──────────────┐
│  Frontend   │─────→│   Backend    │
│   Submit    │      │ create-invoice│
└─────────────┘      └───────┬──────┘
                             │
                             ▼
                     ┌──────────────┐
                     │  Pakasir.com │
                     │      API     │
                     └───────┬──────┘
                             │
                   ┌─────────┴─────────┐
                   │   QR String       │
                   │ payment_number    │
                   └─────────┬─────────┘
                             │
                             ▼
                     ┌──────────────┐
                     │   Display    │
                     │   QR Code    │
                     │   + Timer    │
                     └───────┬──────┘
                             │
                   ┌─────────┴─────────┐
                   │  Auto Check (5s)  │
                   └─────────┬─────────┘
                             │
                    ┌────────▼────────┐
                    │ Status = ?      │
                    └────────┬────────┘
                             │
                   ┌─────────┴─────────┐
                   │                   │
              pending              completed
                   │                   │
              Stay here          Redirect Success
```

---

## 🎯 Key Points

### 1. **QR String Source**
- ❌ BUKAN dari generate sendiri
- ✅ DARI Pakasir.com API response
- ✅ Field: `payment.payment_number`

### 2. **QR Code Display**
- Library: `react-qr-code`
- Input: QR string dari Pakasir
- Output: Visual QR code yang bisa di-scan

### 3. **Status Check Requirements**
- ✅ order_id (required)
- ✅ amount (required)
- ✅ project (from config)
- ✅ api_key (from config)

### 4. **Auto-Check Mechanism**
- Interval: Every 5 seconds
- Method: GET /api/test-payment/check-status
- Action: Redirect saat status = completed

### 5. **Webhook (Optional tapi Recommended)**
- Triggered by: Pakasir saat payment berhasil
- Purpose: Backend notification
- Use case: Database update, email, membership activation

---

## 🧪 Testing Flow

### Local Development (Sandbox)
```bash
# 1. Start server
npm run dev

# 2. Buka browser
http://localhost:3001/test-payment?plan=premium

# 3. Isi form & submit
# 4. Lihat QR code muncul
# 5. Test dengan payment simulation:

curl -X POST https://app.pakasir.com/api/paymentsimulation \
  -H 'Content-Type: application/json' \
  -d '{
    "project": "jobmate",
    "order_id": "ORDER_ID_DARI_PAGE",
    "amount": 39000,
    "api_key": "teLlWce5MvY8y0YeTqolnZNRveRRRtll"
  }'

# 6. Auto-check akan detect dan redirect ke success
```

### Production (Real Payment)
```
1. User scan QR dengan app payment real
2. Transfer sesuai nominal
3. Pakasir detect payment
4. Status berubah ke "completed"
5. Auto-check detect
6. Redirect to success
7. Webhook triggered (if configured)
```

---

## 🔐 Security Notes

1. **API Key**
   - Disimpan di: Backend only (route.ts)
   - ❌ JANGAN expose ke frontend
   - ✅ Use environment variables for production

2. **Amount Validation**
   - Always validate amount di webhook
   - Compare dengan order di database
   - Prevent fraud/manipulation

3. **Order ID**
   - Generate unique ID
   - Format: `jobmate-test-premium-{timestamp}`
   - Prevent duplicate orders

---

## ✅ Summary

**QRIS String:** Dari Pakasir API response  
**Display:** Pakai library `react-qr-code`  
**Check Status:** Need order_id + amount  
**Auto Refresh:** Every 5 seconds  
**Webhook:** Bonus notification dari Pakasir  

**Error Fixed:** ✅ Amount sekarang di-pass ke check-status API

---

**File Updated:**
- ✅ `app/test-payment/pay/page.tsx` - Pass amount to check-status
- ✅ `app/api/test-payment/check-status/route.ts` - Require amount parameter

**Ready to test!** 🚀
