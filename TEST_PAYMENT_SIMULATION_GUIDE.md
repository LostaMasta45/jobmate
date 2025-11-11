# 🧪 Test Payment Simulation Guide

## ❓ Pertanyaan User

1. **"Transaksi tidak muncul di dashboard Pakasir?"**
   - Transaksi AKAN muncul setelah Anda create payment via API
   - Check di: https://app.pakasir.com → Menu Transaksi
   - Filter by status "Completed" atau "All"

2. **"Cara approve payment di test mode?"**
   - Gunakan Payment Simulation API (Sandbox mode only)
   - Saya sudah buatkan Admin Panel untuk ini!

---

## 🎯 Cara Test Payment (Complete Flow)

### **Step 1: Buat Payment**
```
1. Akses: http://localhost:3001/test-payment?plan=premium
2. Isi form (nama, email, whatsapp)
3. Submit → akan muncul QR Code page
4. CATAT Order ID di halaman (misal: jobmate-test-premium-1762601027812)
```

### **Step 2: Simulate Payment (2 Cara)**

#### **Cara A: Via Admin Panel (RECOMMENDED)**
```
1. Buka tab baru: http://localhost:3001/test-payment/admin
2. Copy Order ID dari payment page
3. Isi Amount (10000 untuk Basic, 39000 untuk Premium)
4. Klik "Simulate Payment Success"
5. ✅ Done! Kembali ke payment page → akan auto redirect ke success
```

#### **Cara B: Via cURL (Manual)**
```bash
curl -X POST https://app.pakasir.com/api/paymentsimulation \
  -H 'Content-Type: application/json' \
  -d '{
    "project": "jobmate",
    "order_id": "jobmate-test-premium-1762601027812",
    "amount": 39000,
    "api_key": "teLlWce5MvY8y0YeTqolnZNRveRRRtll"
  }'
```

### **Step 3: Verifikasi**
```
1. Payment page akan auto-check setiap 5 detik
2. Setelah simulation, status berubah ke "completed"
3. Auto redirect ke success page dengan confetti! 🎉
4. Cek dashboard Pakasir: transaksi akan muncul dengan status "completed"
```

---

## 📱 Admin Panel Features

**URL:** `http://localhost:3001/test-payment/admin`

### Fitur:
- ✅ Input Order ID & Amount
- ✅ Quick fill buttons (Basic/Premium)
- ✅ Simulate payment dengan 1 klik
- ✅ Response display
- ✅ Links ke payment page & Pakasir dashboard

### Screenshot Flow:
```
┌─────────────────────┐
│  Test Payment Form  │
│  /test-payment      │
└──────────┬──────────┘
           │ Submit
           ▼
┌─────────────────────┐
│   QR Code Page      │
│  /test-payment/pay  │
│  (Copy Order ID)    │
└──────────┬──────────┘
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼
Real Payment   Admin Panel
(Scan QR)     (Simulate)
    │             │
    └──────┬──────┘
           │
           ▼
┌─────────────────────┐
│  Success Page       │
│  with Confetti! 🎉  │
└─────────────────────┘
```

---

## 🔍 Troubleshooting

### "Transaksi tidak muncul di Pakasir dashboard"
**Solusi:**
1. Refresh halaman dashboard Pakasir
2. Check filter status (pastikan "All" atau "Completed")
3. Check Project yang aktif (harus "jobmate")
4. Tunggu 1-2 menit setelah create transaction

### "Simulation tidak trigger auto-redirect"
**Solusi:**
1. Pastikan payment page masih terbuka
2. Tunggu 5-10 detik (auto-check interval)
3. Atau klik manual "Cek Status Pembayaran"
4. Check browser console untuk errors

### "Error: Amount mismatch"
**Solusi:**
1. Amount harus sama dengan saat create transaction
2. Basic: 10000 (bukan 10003)
3. Premium: 39000 (bukan 40003)
4. Jangan include biaya admin!

---

## 📊 API Reference

### Create Transaction
```
POST /api/test-payment/create-invoice
Body: { plan, email, fullName, whatsapp }
Response: { payment: {...}, orderId, ... }
```

### Check Status
```
GET /api/test-payment/check-status?order_id=xxx&amount=xxx
Response: { success, status, transaction }
```

### Simulate Payment
```
POST /api/test-payment/simulate
Body: { orderId, amount }
Response: { success, message, response }
```

### Webhook (Auto-triggered by Pakasir)
```
POST /api/test-payment/webhook
Body: { order_id, amount, status, ... }
```

---

## 🎬 Complete Testing Scenario

### Scenario 1: Test Premium Payment
```bash
# 1. Create payment
Open: http://localhost:3001/test-payment?plan=premium
Fill form → Submit

# 2. Get Order ID from payment page
Order ID: jobmate-test-premium-1762601027812

# 3. Simulate payment
Open: http://localhost:3001/test-payment/admin
Paste Order ID: jobmate-test-premium-1762601027812
Amount: 39000
Click "Simulate Payment Success"

# 4. Wait for auto-redirect
→ Success page with confetti!

# 5. Verify in Pakasir
https://app.pakasir.com → Transaksi
Status: Completed ✅
```

### Scenario 2: Test Basic Payment
```bash
# Same steps, but:
- Plan: basic
- Amount: 10000
```

---

## 🔐 Security Notes

**⚠️ Admin Panel:**
- HANYA untuk testing/development
- JANGAN deploy ke production
- Tambahkan auth jika ingin deploy

**🔒 API Key:**
- Already configured di backend
- TIDAK exposed ke client
- Safe untuk testing

---

## 📚 Files Yang Dibuat

1. **Admin Panel**
   - `app/test-payment/admin/page.tsx` - UI untuk simulate payment

2. **API Routes**
   - `app/api/test-payment/simulate/route.ts` - Simulate payment API

3. **Updates**
   - `app/test-payment/page.tsx` - Save last order ID ke sessionStorage

4. **Documentation**
   - `TEST_PAYMENT_SIMULATION_GUIDE.md` - This file

---

## ✅ Checklist Testing

### Full Flow Test:
- [ ] Create payment (Basic)
- [ ] QR Code muncul
- [ ] Simulate via admin panel
- [ ] Auto-redirect ke success
- [ ] Confetti animation muncul
- [ ] Data customer benar
- [ ] Transaksi muncul di Pakasir
- [ ] Ulangi untuk Premium

### Edge Cases:
- [ ] Wrong Order ID → Error
- [ ] Wrong Amount → Error
- [ ] Expired payment → Status check fail
- [ ] Network error → Retry works

---

## 🚀 Quick Access URLs

- **Create Payment:** http://localhost:3001/test-payment
- **Admin Panel:** http://localhost:3001/test-payment/admin
- **Pakasir Dashboard:** https://app.pakasir.com
- **Pakasir Docs:** https://pakasir.com/p/docs

---

**Status:** ✅ Ready to test  
**Mode:** Sandbox/Test  
**API Key:** Configured  
**Admin Panel:** Available  

**Selamat mencoba! 🎉**
