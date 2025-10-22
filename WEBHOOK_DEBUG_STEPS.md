# 🚨 URGENT FIX: Payment Sukses tapi Data Tidak Masuk Database

## 🔴 Masalah

**Status:**
```
✅ Xendit Dashboard: Payment SUCCESSFUL
❌ Vercel Log: Database error PGRST116 (0 rows)
❌ Success Page: 404 Not Found
```

**Error di Vercel:**
```
[Check Status] Database error: {
  code: 'PGRST116',
  details: 'The result contains 0 rows',
  hint: null,
  message: 'Cannot coerce the result to a single JSON object'
}
```

**Artinya:** Payment sudah dibayar di Xendit, tapi data TIDAK masuk ke database Supabase!

---

## 🔍 Root Cause

Ada 2 kemungkinan:

### 1. **Webhook Tidak Triggered** (Most Likely)
- Xendit tidak kirim webhook ke server
- Webhook URL salah atau tidak terdaftar
- Webhook verification token salah

### 2. **Webhook Triggered tapi Gagal**
- Webhook diterima tapi error saat insert database
- Check Vercel logs untuk POST /api/webhooks/xendit

---

## ✅ SOLUTION: Manual Check & Fix

### Step 1: Check Webhook di Xendit Dashboard

1. **Login:** https://dashboard.xendit.co
2. **Toggle:** Test Mode (orange)
3. **Go to:** Settings → Webhooks
4. **Check webhook URL:**
   ```
   Expected: https://jobmate.web.id/api/webhooks/xendit
   Status: Should be ✅ Enabled
   ```

5. **Check webhook logs:**
   - Click webhook URL
   - Check "Recent Deliveries" or "Logs"
   - Look for invoice: `jobmate-basic-1761112019187`
   
6. **Check delivery status:**
   ```
   ✅ 200 OK - Webhook success
   ❌ 404 - Webhook URL not found
   ❌ 500 - Server error
   ❌ No delivery - Webhook not sent
   ```

---

### Step 2: Check Vercel Webhook Logs

1. **Go to:** https://vercel.com
2. **Select:** jobmate project
3. **Go to:** Logs
4. **Filter:** `/api/webhooks/xendit`
5. **Time:** Oct 22, 12:47 PM (waktu payment sukses)
6. **Check for:**
   ```
   POST /api/webhooks/xendit
   Status: 200 or 500?
   ```

**Look for errors:**
- Verification token mismatch
- Database insert error
- Missing environment variables

---

### Step 3: Manual Insert Payment (Temporary Fix)

**While debugging, manually insert payment ke database:**

1. **Go to Supabase:** https://supabase.com
2. **Select your project**
3. **Go to:** SQL Editor
4. **Run this query:**

```sql
-- Manual insert payment record
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
  expired_at,
  created_at
) VALUES (
  'jobmate-basic-1761112019187',  -- From screenshot
  'user@example.com',              -- Check Xendit invoice for email
  'Test User',                     -- Check Xendit invoice for name
  '08123456789',                   -- Check Xendit invoice
  'basic',                         -- VIP Basic
  10000,                           -- Rp 10.000
  'paid',                          -- Status
  'inv_xxx',                       -- Get from Xendit dashboard
  'https://checkout.xendit.co/...',-- Get from Xendit
  NOW(),                           -- Paid at
  NOW() + INTERVAL '30 days',     -- Expires 30 days later
  NOW()                            -- Created at
);
```

2. **Get real data from Xendit:**
   - Open invoice: `jobmate-basic-1761112019187`
   - Copy: Email, Name, WhatsApp, Invoice ID, Invoice URL
   - Replace in SQL above

3. **Run query**

4. **Verify:**
```sql
SELECT * FROM payments 
WHERE external_id = 'jobmate-basic-1761112019187';
```

5. **Refresh success page** → Should work now! ✅

---

### Step 4: Check Environment Variables

**Verify env vars di Vercel:**

1. **Vercel Dashboard → Settings → Environment Variables**

2. **Check these exist:**
   ```
   XENDIT_SECRET_KEY=xnd_test_xxxxxxxxxxxxx
   XENDIT_WEBHOOK_VERIFICATION_TOKEN=<your_token>
   SUPABASE_SERVICE_ROLE_KEY=<your_key>
   NEXT_PUBLIC_BASE_URL=https://jobmate.web.id
   ```

3. **If missing, add them:**
   - Get webhook token from Xendit Settings → Webhooks
   - Get Supabase keys from Supabase project settings
   - Redeploy after adding

---

### Step 5: Manually Trigger Webhook (Test)

**Force Xendit to resend webhook:**

1. **Xendit Dashboard → Settings → Webhooks**
2. **Find webhook:** `https://jobmate.web.id/api/webhooks/xendit`
3. **Look for:** "Test" or "Send Test Event" button
4. **Or resend failed delivery:**
   - Go to webhook logs
   - Find failed delivery
   - Click "Resend"

5. **Check Vercel logs** for incoming POST request

---

## 🔧 Permanent Fix: Ensure Webhook Works

### Fix 1: Verify Webhook URL

**Current URL should be:**
```
https://jobmate.web.id/api/webhooks/xendit
```

**NOT:**
```
❌ https://jobmate-ivory.vercel.app/api/webhooks/xendit
❌ http://localhost:3000/api/webhooks/xendit
```

### Fix 2: Check Webhook Token

**In Xendit Dashboard:**
1. Settings → Webhooks
2. Copy "Verification Token"

**In Vercel:**
1. Settings → Environment Variables
2. Add/Update:
   ```
   Key: XENDIT_WEBHOOK_VERIFICATION_TOKEN
   Value: <token_from_xendit>
   Environment: All (Production, Preview, Development)
   ```

3. **Redeploy**

### Fix 3: Test Webhook Locally

**Use webhook.site to test:**

1. Go to: https://webhook.site
2. Copy your unique URL
3. In Xendit, temporarily change webhook URL to webhook.site URL
4. Simulate payment
5. Check webhook.site to see payload
6. Verify data structure matches your code

---

## 🧪 Test After Fix

### Full Test Flow:

1. **Create new payment:**
   ```
   https://jobmate.web.id/payment
   Use different email (to avoid duplicate)
   ```

2. **Mark as paid in Xendit**

3. **Check Vercel logs:**
   ```
   Should see: POST /api/webhooks/xendit - 200 OK
   Should see: [Webhook] Invoice paid: jobmate-basic-xxx
   Should see: [Webhook] Payment saved to database
   ```

4. **Check Supabase:**
   ```sql
   SELECT * FROM payments ORDER BY created_at DESC LIMIT 1;
   ```

5. **Go to success page:**
   ```
   https://jobmate.web.id/payment/success?external_id=jobmate-basic-xxx
   ```

6. **Should work!** ✅

---

## 📊 Quick Diagnostic Checklist

**Check in order:**

- [ ] Xendit payment status = PAID ✅ (from screenshot)
- [ ] Webhook URL configured in Xendit
- [ ] Webhook verification token matches
- [ ] Vercel logs show POST /api/webhooks/xendit
- [ ] Webhook returns 200 OK (not 404/500)
- [ ] Database has SUPABASE_SERVICE_ROLE_KEY
- [ ] Payment record exists in Supabase
- [ ] external_id matches exactly

---

## 🎯 QUICK FIX NOW

**If you need it working RIGHT NOW:**

1. **Manual insert ke database** (Step 3 above)
2. **Get data from Xendit invoice page**
3. **Run SQL insert**
4. **Success page will work immediately**

**Then fix webhook for future payments:**
1. Check webhook configuration
2. Verify environment variables
3. Test with new payment

---

## 📝 Summary

**Problem:** Payment paid in Xendit, but data not in database

**Root Cause:** Webhook not triggered or failed

**Quick Fix:** Manual insert to database (see Step 3)

**Permanent Fix:** Configure webhook properly (see Step 4-5)

**Files:**
- Webhook code: `app/api/webhooks/xendit/route.ts`
- Check status: `app/api/payment/check-status/route.ts`
- Database: Supabase `payments` table

---

**URGENT ACTION:** Do Step 3 (manual insert) NOW to unblock user, then fix webhook for future payments.
