# 🔍 Debug: Email Tidak Terkirim di Production

> **Issue**: User sudah test payment di jobmate.web.id, tapi email tidak terkirim ke reza.nur.h45@gmail.com
> **Date**: October 24, 2025

## ✅ Yang Sudah Dikonfirmasi

1. ✅ Code Resend sudah ter-commit (commit `f3024ce`)
2. ✅ Files sudah ada:
   - `emails/InvoiceEmail.tsx`
   - `lib/resend.ts`
   - `lib/send-invoice-email.ts`
3. ✅ API routes sudah updated:
   - `app/api/payment/create-invoice/route.ts`
   - `app/api/webhooks/xendit/route.ts`
4. ✅ Test lokal berhasil: `npx tsx scripts/test-resend.ts` ✅

## 🔍 Checklist Debug Production

### Step 1: Verify Code di GitHub/Vercel
```bash
# Check apakah commit sudah di-push
cd C:\Users\user\Music\JOBMATE
git status
# Expected: "Your branch is up to date with 'origin/main'"

# Check remote GitHub
# Buka: https://github.com/YOUR_USERNAME/jobmate/commit/f3024ce
# Pastikan commit ada di GitHub
```

**Action**: Jika commit belum di-push:
```bash
git push origin main
```

### Step 2: Verify Vercel Deployment
1. Login https://vercel.com
2. Pilih project **JOBMATE**
3. Tab **Deployments**
4. Check deployment terbaru:
   - ✅ Status: Ready (hijau)
   - ✅ Commit: `f3024ce` atau lebih baru
   - ✅ Date: October 24, 2025 atau setelahnya

**Action**: Jika deployment masih commit lama:
- Tunggu auto-deploy selesai (1-2 menit)
- Atau trigger manual: Deployments > ⋯ (three dots) > Redeploy

### Step 3: Verify Environment Variables di Vercel
1. Vercel > Project JOBMATE > **Settings**
2. Sidebar: **Environment Variables**
3. **CRITICAL CHECK**:

**Required Variables:**
```
RESEND_API_KEY
Value: re_XvExKiw2_PcjvgAzivLgAok5DMFUk2P8Z
Environment: ✅ Production ✅ Preview ✅ Development

RESEND_FROM_EMAIL
Value: onboarding@resend.dev
Environment: ✅ Production ✅ Preview ✅ Development
```

**⚠️ COMMON MISTAKE:**
- Variable ada tapi **Production unchecked** ❌
- Variable typo (e.g., `RESEND_API_KEYS` dengan S) ❌

**Action**: Jika variable salah atau tidak ada:
1. Add/Edit variable
2. Pastikan **Production** checked ✅
3. Click **Save**
4. **IMPORTANT**: Redeploy setelah update env vars!
   - Deployments > Latest > ⋯ > Redeploy

### Step 4: Check Vercel Function Logs
1. Vercel > Project JOBMATE > **Logs**
2. Tab: **Functions** (bukan Runtime Logs)
3. Search: `/api/payment/create-invoice`
4. Look for recent requests (saat user test tadi)

**Check for:**
- ✅ `[Create Invoice] Sending invoice email to: reza.nur.h45@gmail.com`
- ✅ `[Create Invoice] Invoice email sent successfully`
- ❌ `Failed to send email`
- ❌ `RESEND_API_KEY is not defined`
- ❌ Error 500

**If No Logs Found:**
- Function tidak ter-trigger (check payment flow)
- Atau deployment belum aktif (check Step 2)

**If Error Found:**
- Screenshot error message
- Check error type below

### Step 5: Check Resend Dashboard
1. Login https://resend.com
2. Tab: **Emails**
3. Filter: Last 24 hours
4. Look for emails sent to `reza.nur.h45@gmail.com`

**Possible Status:**
- ✅ **Delivered**: Email sent successfully (check inbox/spam)
- ⚠️ **Bounced**: Email rejected (check recipient)
- ❌ **Failed**: Check error message
- 🔍 **Not Found**: Email tidak pernah di-attempt (check Vercel logs)

## 🐛 Common Errors & Solutions

### Error 1: "RESEND_API_KEY is not defined"
**Cause**: Environment variable tidak set atau typo

**Solution:**
1. Vercel > Settings > Environment Variables
2. Add `RESEND_API_KEY` with value: `re_XvExKiw2_PcjvgAzivLgAok5DMFUk2P8Z`
3. Check **Production** ✅
4. Save
5. **Redeploy** (critical!)

### Error 2: "validation_error: You can only send testing emails to..."
**Cause**: Resend development mode restriction

**Solution:**
- Pastikan email recipient: `reza.nur.h45@gmail.com` (already registered)
- Atau invite email lain ke Resend team

### Error 3: Email sent but not received
**Cause**: Email masuk spam atau bounced

**Solution:**
1. Check spam folder di Gmail
2. Check Resend dashboard untuk delivery status
3. If bounced, verify email address correct

### Error 4: Function timeout
**Cause**: Function execution time > 10s (Vercel hobby plan limit)

**Solution:**
- Check Vercel logs for timeout errors
- Optimize email sending (already async, should be fast)
- Upgrade Vercel plan if needed

### Error 5: Import error "@/emails/InvoiceEmail"
**Cause**: File tidak ter-deploy atau typo

**Solution:**
1. Check GitHub: file `emails/InvoiceEmail.tsx` exists
2. Check Vercel build logs for errors
3. Verify tsconfig.json paths: `"@/*": ["./*"]`

## 🧪 Manual Testing Steps

### Test 1: Direct API Call (Verify Backend)
```bash
# From any terminal/command prompt
curl -X POST https://jobmate.web.id/api/payment/create-invoice \
  -H "Content-Type: application/json" \
  -d "{\"plan\":\"basic\",\"email\":\"reza.nur.h45@gmail.com\",\"fullName\":\"Debug Test\",\"whatsapp\":\"081234567890\"}"
```

**Expected Response:**
```json
{
  "success": true,
  "invoiceUrl": "https://checkout.xendit.co/...",
  "emailSent": true  // ← MUST BE TRUE!
}
```

**If `emailSent: false` or error:**
- Check Vercel logs immediately
- Check Resend dashboard
- Error message in response will give clue

### Test 2: Via Browser (Full User Flow)
1. Buka https://jobmate.web.id
2. Scroll ke pricing section
3. Click "Mulai dengan Basic"
4. Fill form:
   - Email: `reza.nur.h45@gmail.com`
   - Nama: `Debug Test`
   - WhatsApp: `081234567890`
5. Submit
6. **Check browser console** (F12 > Console)
   - Look for errors
   - Check network tab for `/api/payment/create-invoice` response
7. Check inbox immediately after submit

### Test 3: Check Webhook Email (After Payment)
1. Complete payment di Xendit (use test mode)
2. Wait 10-30 seconds for webhook
3. Check Vercel logs: `/api/webhooks/xendit`
4. Look for: `[Xendit Webhook] Payment confirmation email sent successfully`
5. Check inbox for confirmation email

## 🔧 Quick Fixes to Try

### Fix 1: Redeploy Vercel
```
Vercel > Deployments > Latest > ⋯ > Redeploy
Wait 2 minutes
Test again
```

### Fix 2: Update Environment Variables
```
1. Vercel > Settings > Environment Variables
2. Edit RESEND_API_KEY
3. Re-enter value: re_XvExKiw2_PcjvgAzivLgAok5DMFUk2P8Z
4. Save
5. Redeploy
```

### Fix 3: Clear Vercel Cache
```
Vercel > Settings > General
Scroll to "Build & Development Settings"
Click "Clear Build Cache"
Redeploy
```

### Fix 4: Check Resend API Key Validity
```bash
# Test if API key still valid
cd C:\Users\user\Music\JOBMATE
npx tsx scripts/test-resend.ts

# If fails → regenerate API key di resend.com
```

## 📊 Debugging Checklist

Copy this checklist and mark as you go:

```
DEPLOYMENT
[ ] 1. Commit f3024ce exists in GitHub
[ ] 2. Vercel deployed commit f3024ce or newer
[ ] 3. Deployment status: Ready (green)
[ ] 4. No build errors in Vercel logs

ENVIRONMENT VARIABLES
[ ] 5. RESEND_API_KEY exists in Vercel
[ ] 6. RESEND_API_KEY value correct: re_XvExKiw2_...
[ ] 7. RESEND_API_KEY Production checked ✅
[ ] 8. RESEND_FROM_EMAIL exists: onboarding@resend.dev
[ ] 9. RESEND_FROM_EMAIL Production checked ✅

API TESTING
[ ] 10. Curl test API returns emailSent: true
[ ] 11. Browser test submits successfully
[ ] 12. Vercel logs show "Invoice email sent successfully"
[ ] 13. Resend dashboard shows email attempt

EMAIL DELIVERY
[ ] 14. Resend status: Delivered (not bounced/failed)
[ ] 15. Email in inbox (check reza.nur.h45@gmail.com)
[ ] 16. Email not in spam folder
[ ] 17. Email content correct (invoice details)

WEBHOOK (Optional - after payment)
[ ] 18. Payment completed in Xendit
[ ] 19. Webhook triggered in Vercel logs
[ ] 20. Confirmation email sent
```

## 🆘 Still Not Working?

**If email still not sent after all checks:**

### Option A: Check Vercel Logs Live
```
1. Vercel > Logs > Functions
2. Filter: /api/payment/create-invoice
3. Make a test payment
4. Watch logs in real-time
5. Screenshot any errors
```

### Option B: Add Debug Logging
Update `app/api/payment/create-invoice/route.ts`:

```typescript
// After sending email, add:
console.log('[DEBUG] Environment check:', {
  hasResendKey: !!process.env.RESEND_API_KEY,
  keyPrefix: process.env.RESEND_API_KEY?.substring(0, 8),
  fromEmail: process.env.RESEND_FROM_EMAIL,
  emailResult: emailResult,
});
```

Commit, push, redeploy, test again, check logs.

### Option C: Temporary Workaround
If urgent, bisa send email manual via Resend API test:
```
1. Login resend.com
2. API Keys > Test API
3. Send email manually dengan invoice details
```

## 📝 Next Steps

**Once Working:**
1. Document what fixed it
2. Add monitoring/alerting
3. Consider verify domain untuk unlimited emails

**If Still Failing:**
1. Share Vercel logs screenshot
2. Share Resend dashboard screenshot
3. Share curl test response
4. We can debug together

---

**Debug Started**: October 24, 2025
**Status**: Investigating
**Priority**: HIGH (production issue)
