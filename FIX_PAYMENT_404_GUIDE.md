# 🔧 FIX: Payment 404 Not Found

## 🚨 Error yang Terjadi

**Error Message:**
```
Data Pembayaran Tidak Ditemukan
External ID: jobmate-basic-1761112019187

Kemungkinan penyebab:
• Invoice belum dibayar
• Data sedang diproses (tunggu 1-2 menit)
• Link sudah kadaluarsa
```

**Console Error:**
```
GET /api/payment/check-status?external_id=jobmate-basic-1761112019187
404 (Not Found)

[Success Page] Error fetching payment: Error: API returned 404
```

---

## 🔍 Diagnosis: Kenapa 404?

### Possible Causes:

#### 1. **Invoice Belum Dibuat**
- User mengisi form tapi gagal create invoice
- API `/api/payment/create-invoice` error
- Check: Vercel logs (Functions tab)

#### 2. **Invoice Pending (Belum Dibayar)**
- Invoice sudah dibuat di Xendit
- Tapi user belum bayar / belum simulate payment
- Database masih kosong (webhook belum triggered)

#### 3. **Webhook Belum/Gagal Triggered**
- User sudah bayar / simulate
- Tapi webhook `/api/webhooks/xendit` gagal
- Check: Vercel logs, Xendit webhook logs

#### 4. **Database Query Error**
- Payment ada di database
- Tapi RLS policies block query
- Atau external_id tidak match

---

## ✅ SOLUTION: Step-by-Step Fix

### Step 1: Check Xendit Dashboard

**Tujuan:** Cek apakah invoice ada & statusnya apa

1. **Login ke Xendit:**
   - URL: https://dashboard.xendit.co
   - Pastikan mode: **Test Mode** (toggle orange)

2. **Go to Transactions → Invoices**

3. **Search invoice:**
   - External ID: `jobmate-basic-1761112019187`
   - Atau sort by: Created date (descending)

4. **Check status:**
   ```
   ✅ Status: PAID → Invoice sudah dibayar
   ⏳ Status: PENDING → Invoice belum dibayar
   ❌ Status: EXPIRED → Invoice kadaluarsa
   ```

**Result:**

- **If NOT FOUND** → Invoice belum dibuat, go to Step 2
- **If PENDING** → Invoice belum dibayar, go to Step 3
- **If PAID** → Invoice sudah bayar, go to Step 4

---

### Step 2: If Invoice NOT FOUND (Create Payment)

**Artinya:** User belum berhasil create invoice

**Solution:** Create payment baru

1. **Go to:** https://jobmate.web.id/payment

2. **Fill form:**
   ```
   Plan: VIP Basic (Rp 10.000)
   Email: your-email@gmail.com
   Nama: Test User
   WhatsApp: 08123456789
   ```

3. **Submit**

4. **Expected result:**
   - Redirect ke Xendit payment page
   - Invoice created di Xendit dashboard
   - Check Xendit dashboard lagi

**If failed:**
- Check browser console (F12)
- Check network tab for API errors
- Check Vercel logs (Functions → `/api/payment/create-invoice`)

---

### Step 3: If Invoice PENDING (Simulate Payment)

**Artinya:** Invoice sudah dibuat tapi belum dibayar

**Solution:** Simulate payment di Xendit dashboard

#### Option A: Via Xendit Dashboard (RECOMMENDED)

1. **Xendit Dashboard → Invoices**
2. **Find invoice:** `jobmate-basic-1761112019187`
3. **Click invoice** to open details
4. **Click button:** **"Mark as Paid"** atau **"Simulate Payment"**
5. **Confirm**

**Expected result:**
- Status change: PENDING → PAID
- Webhook triggered automatically
- Database updated
- Success page now works!

#### Option B: Via Payment Link

1. **Get invoice URL** from Xendit dashboard
2. **Or check email** (Xendit sends invoice email)
3. **Click payment link**
4. **Select payment method** (any method in test mode)
5. **Complete payment** (simulated)

---

### Step 4: If Invoice PAID (Check Database)

**Artinya:** Invoice sudah dibayar tapi data tidak masuk database

**Possible Causes:**
1. Webhook belum triggered (tunggu 1-2 menit)
2. Webhook error
3. Database insert failed

#### A. Wait & Refresh (1-2 Minutes)

Sometimes webhook has delay:

1. **Wait 2 minutes**
2. **Refresh success page**
3. **Should work now**

#### B. Check Webhook Logs

**In Xendit Dashboard:**

1. Go to: **Settings** → **Webhooks**
2. Toggle: **Test Mode**
3. Find webhook: `https://jobmate.web.id/api/webhooks/xendit`
4. Click **"Logs"** or **"Recent Deliveries"**
5. Check status:
   ```
   ✅ 200 OK → Webhook success
   ❌ 404/500 → Webhook failed
   ```

**In Vercel Dashboard:**

1. Go to: https://vercel.com
2. Select project: **jobmate**
3. Go to: **Logs** or **Functions**
4. Filter: `/api/webhooks/xendit`
5. Check for errors

#### C. Check Database (Supabase)

1. **Go to:** https://supabase.com
2. **Select project**
3. **Go to:** SQL Editor
4. **Run query:**

```sql
-- Check if payment exists
SELECT 
  external_id,
  user_email,
  status,
  created_at,
  paid_at
FROM payments
WHERE external_id = 'jobmate-basic-1761112019187';
```

**Result:**

- **If FOUND** → Payment exists! Go to Step D
- **If EMPTY** → Payment not in database, go to Step E

#### D. If Payment Exists (RLS Issue?)

Database has payment but API returns 404?

**Possible cause:** RLS policies blocking query

**Solution:**

1. **Check RLS:**
```sql
SELECT rowsecurity FROM pg_tables WHERE tablename = 'payments';
```

2. **If true, check policies:**
```sql
SELECT * FROM pg_policies WHERE tablename = 'payments';
```

3. **Ensure service role bypasses RLS:**
   - Check `.env.local` has `SUPABASE_SERVICE_ROLE_KEY`
   - API should use service role, not anon key

4. **Temporarily disable RLS for testing:**
```sql
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
```

#### E. If Payment NOT Exists (Manual Insert)

**Last resort:** Manually insert payment record

1. **Get invoice details from Xendit dashboard**
2. **Copy:** Invoice ID, Email, Name, Amount, etc.
3. **Run SQL in Supabase:**

```sql
INSERT INTO payments (
  external_id,
  user_email,
  user_name,
  user_whatsapp,
  plan_type,
  amount,
  status,
  invoice_id,
  invoice_url,
  paid_at,
  expired_at
) VALUES (
  'jobmate-basic-1761112019187',
  'user@example.com',      -- from Xendit
  'Test User',             -- from Xendit
  '08123456789',           -- from Xendit
  'basic',                 -- basic or premium
  10000,                   -- amount
  'paid',
  'xendit-invoice-id-here', -- from Xendit dashboard
  'https://checkout.xendit.co/v2/...',
  NOW(),
  NOW() + INTERVAL '30 days'
);
```

4. **Refresh success page** → Should work now!

---

## 🧪 Quick Test Flow

### Full Test (Clean Slate):

1. **Create new payment:**
   ```
   https://jobmate.web.id/payment
   Fill form → Submit
   ```

2. **Check Xendit dashboard:**
   ```
   Invoice created? ✅
   External ID matches? ✅
   ```

3. **Simulate payment:**
   ```
   Xendit dashboard → "Mark as Paid"
   ```

4. **Wait 30 seconds**

5. **Go to success page:**
   ```
   https://jobmate.web.id/payment/success?external_id=jobmate-basic-[timestamp]
   ```

6. **Expected result:**
   ```
   ✅ Confetti animation
   ✅ "Terima Kasih!" greeting
   ✅ Payment details displayed
   ✅ No 404 error
   ```

---

## 🚨 Common Issues & Solutions

### Issue 1: Invoice Not Created

**Symptoms:**
- Can't find invoice in Xendit
- Error when submitting form

**Solutions:**
1. Check `XENDIT_SECRET_KEY` in Vercel env vars
2. Check Vercel logs for create-invoice errors
3. Check browser console for API errors
4. Try different email/name

### Issue 2: Webhook Not Working

**Symptoms:**
- Invoice PAID in Xendit
- But database empty
- 404 on success page

**Solutions:**
1. Check webhook URL in Xendit settings
2. Should be: `https://jobmate.web.id/api/webhooks/xendit`
3. Check `XENDIT_WEBHOOK_VERIFICATION_TOKEN` in Vercel
4. Check Vercel logs for webhook errors
5. Manually trigger webhook from Xendit dashboard

### Issue 3: Database Query Issues

**Symptoms:**
- Payment exists in database
- But API returns 404

**Solutions:**
1. Check RLS policies
2. Ensure using service role key (not anon key)
3. Check external_id matches exactly
4. Check Vercel logs for database errors

---

## 📊 Debug Checklist

Before asking for help, check:

- [ ] Xendit dashboard - Invoice exists?
- [ ] Xendit dashboard - Invoice status (PAID/PENDING)?
- [ ] Xendit webhook logs - Webhook delivered?
- [ ] Vercel logs (Functions) - Any errors?
- [ ] Browser console (F12) - Any errors?
- [ ] Supabase database - Payment record exists?
- [ ] Environment variables - All keys configured?

---

## 🎯 Summary

**Error:** 404 Payment Not Found

**Root Causes:**
1. Invoice belum dibuat → Create payment
2. Invoice pending → Simulate payment
3. Webhook gagal → Check logs, manual insert
4. Database issue → Check RLS, service role

**Quick Fix:**
1. Go to Xendit dashboard
2. Find invoice: `jobmate-basic-1761112019187`
3. Click "Mark as Paid"
4. Wait 30 seconds
5. Refresh success page
6. Should work! ✅

**Files for Debugging:**
- `DEBUG_PAYMENT_404.sql` - SQL queries
- `FIX_PAYMENT_404_GUIDE.md` - This guide

---

**Last Updated:** 2025-01-XX  
**Status:** Troubleshooting Guide  
**Next:** Follow steps above to fix 404
