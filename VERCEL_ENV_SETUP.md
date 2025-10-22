# 🚀 Vercel Environment Variable Setup - PENTING!

## ⚠️ MASALAH: Redirect ke vercel.app instead of jobmate.web.id

### Root Cause:
Environment variable `NEXT_PUBLIC_BASE_URL` belum diset di Vercel Dashboard.

Code di `create-invoice/route.ts` sudah benar:
```typescript
success_redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://jobmate.web.id'}/payment/success`
```

Tapi karena `process.env.NEXT_PUBLIC_BASE_URL` **undefined** di Vercel, dia fallback ke hardcoded URL.

**Problem:** Preview deployments tetap pakai vercel.app URL.

---

## ✅ SOLUTION: Set Environment Variable di Vercel

### Step 1: Login to Vercel Dashboard

1. Go to: https://vercel.com
2. Login dengan akun Anda
3. Select project: **jobmate** (atau nama project Anda)

### Step 2: Navigate to Environment Variables

1. Click **Settings** (top menu)
2. Click **Environment Variables** (sidebar)

### Step 3: Add NEXT_PUBLIC_BASE_URL

1. Click **Add New** button
2. Fill in:
   - **Key:** `NEXT_PUBLIC_BASE_URL`
   - **Value:** `https://jobmate.web.id`
   - **Environment:** Select **ALL** (Production, Preview, Development)
3. Click **Save**

### Step 4: Redeploy

**Option A: Trigger Redeploy (Fastest)**
1. Go to **Deployments** tab
2. Click **...** (three dots) on latest deployment
3. Click **Redeploy**
4. Wait ~2 minutes

**Option B: Push New Commit (Recommended)**
```bash
git add .
git commit -m "fix: configure BASE_URL for production domain"
git push origin main
```

---

## 📋 Complete Environment Variables Checklist

Pastikan SEMUA environment variables ini sudah diset di Vercel:

### ✅ Required for Payment System:

```
NEXT_PUBLIC_BASE_URL=https://jobmate.web.id
XENDIT_API_KEY=xnd_development_... (atau xnd_production_...)
XENDIT_WEBHOOK_TOKEN=<your_webhook_verification_token>
```

### ✅ Required for Core Features:

```
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_project_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<your_supabase_service_role_key>
```

### ✅ Required for AI Features:

```
OPENAI_API_KEY=<your_openai_compatible_api_key>
OPENAI_BASE_URL=<your_openai_compatible_base_url>
```

### ✅ Required for PDF Tools:

```
ILOVEPDF_PUBLIC_KEY=<your_ilovepdf_public_key>
ILOVEPDF_SECRET_KEY=<your_ilovepdf_secret_key>
```

### ✅ Optional (Telegram Notifications):

```
TELEGRAM_BOT_TOKEN=<your_telegram_bot_token>
TELEGRAM_ADMIN_CHAT_ID=<your_telegram_chat_id>
```

---

## 🧪 How to Test After Setting Env Var

### Test 1: Create Invoice
1. Go to: https://jobmate.web.id/payment
2. Fill form and submit
3. **Check Xendit invoice URL** in API response (Network tab)
4. Should show: `success_redirect_url: "https://jobmate.web.id/payment/success?external_id=..."`
5. **NOT:** `success_redirect_url: "https://jobmate-ivory.vercel.app/..."`

### Test 2: Complete Payment Flow
1. Create test invoice
2. Simulate payment (Xendit dashboard)
3. **Check redirect URL** after payment
4. Should land on: `https://jobmate.web.id/payment/success?external_id=...`
5. **NOT:** `https://jobmate-ivory.vercel.app/payment/success?external_id=...`

---

## 🔍 Debugging: Check if Env Var is Loaded

Add temporary console.log in `create-invoice/route.ts`:

```typescript
console.log('BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL);
console.log('Success Redirect URL:', successRedirectUrl);
```

**Expected output:**
```
BASE_URL: https://jobmate.web.id
Success Redirect URL: https://jobmate.web.id/payment/success?external_id=jobmate-basic-123
```

**If you see:**
```
BASE_URL: undefined
Success Redirect URL: https://jobmate.web.id/payment/success?external_id=jobmate-basic-123
```

Then env var is **NOT set** in Vercel!

---

## ⚡ Quick Fix Checklist

- [ ] Login to Vercel Dashboard
- [ ] Go to Settings → Environment Variables
- [ ] Add `NEXT_PUBLIC_BASE_URL` = `https://jobmate.web.id`
- [ ] Select **ALL environments** (Production, Preview, Development)
- [ ] Click **Save**
- [ ] Redeploy or push new commit
- [ ] Wait ~2 minutes for deployment
- [ ] Test: Create payment and check redirect URL
- [ ] Verify: URL should be jobmate.web.id (NOT vercel.app)

---

## 🎯 Why This is Important

### Before Fix:
```
User pays → Redirects to:
https://jobmate-ivory.vercel.app/payment/success?external_id=123

Problem:
❌ vercel.app domain (not professional)
❌ Users confused (different domain)
❌ SEO issues (multiple domains)
```

### After Fix:
```
User pays → Redirects to:
https://jobmate.web.id/payment/success?external_id=123

Result:
✅ Custom domain (professional)
✅ Consistent branding
✅ Better SEO
✅ User trust
```

---

## 📝 Summary

**Problem:** Redirect ke vercel.app domain
**Root Cause:** `NEXT_PUBLIC_BASE_URL` not set in Vercel
**Solution:** Add environment variable in Vercel Dashboard

**Steps:**
1. Vercel Dashboard → Settings → Environment Variables
2. Add: `NEXT_PUBLIC_BASE_URL` = `https://jobmate.web.id`
3. Save & Redeploy
4. Test payment flow

**Expected Result:** All redirects use jobmate.web.id domain ✅

---

**Last Updated:** 2025-01-XX  
**Status:** ⚠️ ACTION REQUIRED  
**Priority:** 🔴 HIGH (affects user experience)
