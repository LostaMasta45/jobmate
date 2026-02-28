# Setup Supabase with Resend SMTP - Complete Guide

## 🎉 Domain Verified! Now Let's Connect to Supabase

---

## 📋 Step 1: Get SMTP Credentials from Resend

### 1.1 Get API Key
1. **Go to:** https://resend.com/api-keys
2. **Click:** "Create API Key"
3. **Name:** `Supabase JobMate`
4. **Permission:** "Sending access"
5. **Copy the API key:** `re_xxxxxxxxxxxxxxxxxxxxxxxxxx`
   - ⚠️ **IMPORTANT:** Save this! Only shown once!

### 1.2 SMTP Settings (Already Available)
```
SMTP Host:     smtp.resend.com
SMTP Port:     587 (TLS) or 465 (SSL)
SMTP Username: resend
SMTP Password: [Your API Key from step 1.1]
```

**Note:** SMTP Password = API Key (same thing!)

---

## 🔧 Step 2: Configure Supabase SMTP Settings

### 2.1 Open Supabase Dashboard
1. **Go to:** https://supabase.com/dashboard
2. **Select:** JobMate project
3. **Navigate:** Settings → Authentication
4. **Scroll to:** SMTP Settings section

### 2.2 Enable Custom SMTP
1. **Toggle ON:** "Enable Custom SMTP"
2. **Fill in the form:**

```
┌────────────────────────────────────────────────┐
│ SMTP Settings                                  │
├────────────────────────────────────────────────┤
│                                                │
│ Enable Custom SMTP:  [✓] ON                   │
│                                                │
│ SMTP Host:                                     │
│ └─ smtp.resend.com                            │
│                                                │
│ SMTP Port:                                     │
│ └─ 587                                        │
│                                                │
│ SMTP Username:                                 │
│ └─ resend                                     │
│                                                │
│ SMTP Password:                                 │
│ └─ re_xxxxxxxxxxxxxxxxxxxxxxxxxx              │
│    (Your Resend API Key)                       │
│                                                │
│ Sender Email:                                  │
│ └─ noreply@infolokerjombang.id                     │
│                                                │
│ Sender Name:                                   │
│ └─ JobMate                                    │
│                                                │
│ [ Save ]                                       │
└────────────────────────────────────────────────┘
```

### 2.3 **Exact Values to Enter:**

| Field | Value |
|-------|-------|
| **Enable Custom SMTP** | ✅ ON |
| **SMTP Host** | `smtp.resend.com` |
| **SMTP Port** | `587` |
| **SMTP Username** | `resend` |
| **SMTP Password** | `re_xxxxx...` (API Key) |
| **Sender Email** | `noreply@infolokerjombang.id` |
| **Sender Name** | `JobMate` |

### 2.4 Click "Save"

Wait for confirmation message: ✅ "Settings saved successfully"

---

## ✅ Step 3: Test Configuration

### 3.1 Test Reset Password Email

1. **Go to:** http://localhost:3005/reset
2. **Enter email:** your-email@gmail.com
3. **Click:** "Kirim Link Reset"
4. **Check inbox**

**Expected Result:**
```
From: JobMate <noreply@infolokerjombang.id> ✅
Subject: Reset Your Password
Body: [Your elegant template]
```

### 3.2 Verify Email Details

Check email headers (in Gmail: Show Original):
```
From: JobMate <noreply@infolokerjombang.id>
To: your-email@gmail.com
Return-Path: noreply@infolokerjombang.id
Authentication-Results: PASS (DKIM, SPF)
```

---

## 🔍 Step 4: Troubleshooting

### Issue 1: "SMTP Authentication Failed"

**Error:**
```
Failed to send email: SMTP authentication failed
```

**Fix:**
1. Verify API Key is correct (re_xxxx...)
2. Check username is exactly: `resend` (lowercase)
3. Port must be: `587` or `465`
4. Re-generate API key if needed

### Issue 2: "Sender not verified"

**Error:**
```
Sender email not verified
```

**Fix:**
1. Check domain status in Resend: https://resend.com/domains
2. Must show: ✅ Verified
3. If not, check DNS records again
4. Wait up to 24 hours for propagation

### Issue 3: Email not arriving

**Check:**
1. Spam folder
2. Resend Dashboard → Emails → Check delivery status
3. Supabase Dashboard → Authentication → Logs → Check errors
4. Email quota not exceeded (3,000/month free)

---

## 📊 Verification Checklist

After setup, verify these:

```
Configuration:
[ ] Custom SMTP enabled in Supabase
[ ] SMTP host: smtp.resend.com
[ ] SMTP port: 587
[ ] Username: resend
[ ] Password: Valid Resend API key
[ ] Sender email: noreply@infolokerjombang.id
[ ] Sender name: JobMate

Domain:
[ ] infolokerjombang.id verified in Resend
[ ] DNS records properly configured
[ ] SPF, DKIM, DMARC records active

Testing:
[ ] Reset password email sends successfully
[ ] Email arrives in inbox (not spam)
[ ] From address shows: noreply@infolokerjombang.id
[ ] Email template looks elegant
[ ] Links in email work correctly
```

---

## 🎨 Optional: Update Email Templates

Now that you have custom domain, update templates:

1. **Go to:** Supabase Dashboard → Authentication → Email Templates
2. **Update templates** with your branding
3. **Use Template 3** from `CUSTOMIZE_SUPABASE_EMAIL_TEMPLATE.md`
4. **Update footer** links to match your domain

Example changes:
```html
<!-- Before -->
<a href="https://supabase.com">Website</a>

<!-- After -->
<a href="https://infolokerjombang.id">Website</a>
```

---

## 📈 Monitoring Setup

### Monitor Email Delivery

**In Resend Dashboard:**
1. Go to: https://resend.com/emails
2. See real-time delivery status
3. Check bounce/complaint rates
4. View open/click rates (if enabled)

**In Supabase Dashboard:**
1. Go to: Authentication → Logs
2. Filter by: email events
3. Monitor success/failure rates

---

## 💰 Cost & Limits

### Current Setup:
```
Resend Free Tier:
✅ 3,000 emails/month
✅ 100 emails/day
✅ 1 verified domain (infolokerjombang.id)
✅ SMTP access
✅ Email analytics
Cost: $0/month

Supabase:
✅ Unlimited auth emails (using your SMTP)
✅ No additional cost
Cost: $0/month

Total: $0/month ✅
```

### Usage Estimate:
```
Expected JobMate usage:
- Password resets: ~20/month
- Signup verifications: ~50/month
- Total: ~70 emails/month

Status: Well within free tier (3,000/month) ✅
```

---

## 🚀 Advanced Configuration (Optional)

### 1. Multiple Sender Addresses

After domain verified, you can use:
```
noreply@infolokerjombang.id   - Automated emails
support@infolokerjombang.id   - Support replies
team@infolokerjombang.id      - Team notifications
hello@infolokerjombang.id     - Marketing emails
```

**Setup:**
- Just change "Sender Email" in Supabase
- Or set per-email in custom code

### 2. Reply-To Address

Set reply-to for user responses:
```
Sender Email: noreply@infolokerjombang.id
Reply-To: support@infolokerjombang.id (in template)
```

### 3. Track Email Opens/Clicks

Enable in Resend:
1. API Keys → Edit
2. Enable: "Track opens"
3. Enable: "Track clicks"
4. View analytics in Resend dashboard

---

## 🎯 Final Configuration Summary

### What You Have Now:

**Email Flow:**
```
User requests reset
    ↓
Supabase Auth triggers
    ↓
Connects to: smtp.resend.com
    ↓
Sends via: Resend infrastructure
    ↓
From: noreply@infolokerjombang.id ✅
    ↓
User receives professional email
```

**Benefits:**
- ✅ Professional sender address (@infolokerjombang.id)
- ✅ Better deliverability (verified domain)
- ✅ Email analytics/tracking
- ✅ Brand consistency
- ✅ Still FREE (3,000 emails/month)

---

## 📝 Quick Reference Card

**Copy this for reference:**

```
┌─────────────────────────────────────────┐
│ Supabase SMTP Configuration             │
├─────────────────────────────────────────┤
│ Host:     smtp.resend.com               │
│ Port:     587                           │
│ User:     resend                        │
│ Pass:     re_xxxxx (API Key)            │
│ From:     noreply@infolokerjombang.id        │
│ Name:     JobMate                       │
└─────────────────────────────────────────┘

Resend Dashboard: https://resend.com/
Supabase Settings: https://supabase.com/dashboard
                   → Settings → Authentication
                   → SMTP Settings

Limits: 3,000 emails/month (free)
Status: ✅ Domain verified
```

---

## ✅ Success Criteria

You'll know it's working when:

1. ✅ Supabase saves SMTP settings without error
2. ✅ Test email sends successfully
3. ✅ Email arrives with: `From: JobMate <noreply@infolokerjombang.id>`
4. ✅ Email is NOT in spam folder
5. ✅ Links in email work correctly
6. ✅ Resend dashboard shows delivery success
7. ✅ Supabase auth logs show no errors

---

## 🎉 You're Done!

**Email system upgraded:**
- ❌ Before: `no-reply@mail.app.supabase.io`
- ✅ After: `noreply@infolokerjombang.id` 

**Professional, branded, and FREE!** 🚀

---

## 📞 Need Help?

**If stuck, check:**
1. API key copied correctly (re_xxxxx...)
2. Domain shows "Verified" in Resend
3. Port is 587 (not 465)
4. Username is exactly "resend"
5. Sender email matches verified domain

**Still issues? Provide:**
- Screenshot of Supabase SMTP settings
- Screenshot of Resend domain status
- Error message (if any)
- Supabase auth logs

Then I can help debug! 🔧
