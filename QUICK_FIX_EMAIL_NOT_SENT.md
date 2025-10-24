# ⚡ QUICK FIX: Email Tidak Terkirim di Production

> **Problem**: Payment di jobmate.web.id tidak kirim email
> **Quick Solution**: 3 langkah cepat

## 🚀 Quick Fix (5 Menit)

### Step 1: Push Code ke GitHub (IMPORTANT!)
```bash
cd C:\Users\user\Music\JOBMATE
git add .
git commit -m "fix: ensure Resend email integration deployed"
git push origin main
```

**Why**: Code Resend mungkin belum ke-push ke GitHub!

### Step 2: Verify & Set Environment Variables
1. Login **https://vercel.com**
2. Pilih project **JOBMATE**
3. Click **Settings** tab
4. Sidebar: **Environment Variables**
5. **ADD atau VERIFY** variable berikut:

**Variable 1:**
```
Name: RESEND_API_KEY
Value: re_XvExKiw2_PcjvgAzivLgAok5DMFUk2P8Z
Environments: ✅ Production ✅ Preview ✅ Development
```

**Variable 2:**
```
Name: RESEND_FROM_EMAIL  
Value: onboarding@resend.dev
Environments: ✅ Production ✅ Preview ✅ Development
```

6. Click **Save** untuk each variable

### Step 3: Redeploy Vercel
1. Masih di Vercel dashboard
2. Click tab **Deployments**
3. Click latest deployment (paling atas)
4. Click **⋯** (three dots menu)
5. Click **Redeploy**
6. Confirm: **Redeploy**
7. Wait 1-2 menit

**Done!** ✅

## 🧪 Test Sekarang

### Quick Test (Via Curl)
```bash
curl -X POST https://jobmate.web.id/api/payment/create-invoice ^
  -H "Content-Type: application/json" ^
  -d "{\"plan\":\"basic\",\"email\":\"reza.nur.h45@gmail.com\",\"fullName\":\"Quick Test\",\"whatsapp\":\"081234567890\"}"
```

**Expected:**
```json
{
  "success": true,
  "invoiceUrl": "...",
  "emailSent": true  // ← HARUS TRUE!
}
```

### Check Email
1. Buka inbox: **reza.nur.h45@gmail.com**
2. Look for email subject: "Invoice Pembayaran - VIP Basic - InfoLokerJombang"
3. Check spam folder juga!

## 🔍 Still Not Working?

### Debug Step 1: Check Vercel Logs
1. Vercel > Logs > **Functions**
2. Filter: `/api/payment/create-invoice`
3. Look for error messages
4. Screenshot dan share

### Debug Step 2: Check Resend Dashboard
1. Login https://resend.com
2. Tab **Emails**
3. Look for recent email attempts
4. Check status: Delivered, Failed, Bounced?

### Debug Step 3: Verify Deployment
```bash
# Check di GitHub apakah commit sudah masuk
# https://github.com/YOUR_USERNAME/jobmate/commits/main

# Pastikan commit terbaru ada file:
# - emails/InvoiceEmail.tsx
# - lib/resend.ts
# - lib/send-invoice-email.ts
```

## 💡 Common Issues

| Issue | Solution |
|-------|----------|
| `emailSent: false` | Environment variables belum set di Vercel |
| Error 500 | Check Vercel logs untuk error message |
| Email not received | Check spam folder atau Resend dashboard |
| "API key not defined" | Redeploy after setting env vars |
| Timeout | Function terlalu lama, check logs |

## 📞 Need Help?

Jika masih error setelah 3 steps di atas:
1. Screenshot Vercel logs (Functions tab)
2. Screenshot Resend dashboard (Emails tab)  
3. Copy response dari curl test
4. Share untuk debug lebih lanjut

---

**TL;DR**: 
1. Push code: `git push origin main`
2. Set env vars di Vercel (RESEND_API_KEY & RESEND_FROM_EMAIL)
3. Redeploy
4. Test!
