# Supabase Email Limits - Complete Guide

## 📧 Email Limits Overview

### Supabase Auth Emails (Built-in)

**Emails yang termasuk:**
- ✅ Signup verification email
- ✅ Password reset email
- ✅ Magic link email
- ✅ Email change confirmation
- ✅ Invite user email

---

## 🚫 Rate Limits (Default Supabase)

### 1. **Per-User Rate Limits**

#### Password Reset:
```
Limit: 4 requests per hour per email
Cooldown: 1 hour

Example:
User A requests reset 4x → OK
User A requests 5th time → ❌ Rate limited
Wait 1 hour → Can request again
```

#### Email Verification:
```
Limit: 4 requests per hour per email
(Same as password reset)
```

#### Magic Link:
```
Limit: 4 requests per hour per email
```

---

### 2. **Per-IP Rate Limits**

```
Limit: 60 requests per hour per IP
Applies to: All auth endpoints combined

Example:
IP 1.2.3.4 makes 60 auth requests (signup/login/reset) → OK
61st request → ❌ Rate limited
```

---

### 3. **Global Project Limits**

#### Free Tier:
```
✅ Unlimited auth emails (signup, reset, magic link)
✅ No daily/monthly cap on auth emails
✅ Included in free tier

BUT:
⚠️ Rate limits still apply (per user, per IP)
⚠️ Email delivery not guaranteed (best effort)
⚠️ From default Supabase domain
```

#### Pro Tier ($25/month):
```
✅ Same unlimited auth emails
✅ Better delivery rate
✅ Can use custom SMTP
✅ Higher rate limits (configurable)
```

---

## 📊 Email Types & Limits Summary

| Email Type | Free Tier | Pro Tier | Rate Limit |
|------------|-----------|----------|------------|
| **Signup Verification** | Unlimited | Unlimited | 4/hour per email |
| **Password Reset** | Unlimited | Unlimited | 4/hour per email |
| **Magic Link** | Unlimited | Unlimited | 4/hour per email |
| **Email Change** | Unlimited | Unlimited | 4/hour per email |
| **Custom Notifications*** | ❌ Not built-in | Via SMTP/API | Depends on provider |

**Custom notifications*** = Password changed, new login, etc. (not built-in Supabase Auth)

---

## 🎯 Custom Notification Emails

### ❌ NOT Included in Supabase Auth:

These emails require custom implementation:
- Password successfully changed notification
- New device login alert
- Account settings changed
- Suspicious activity alert
- Welcome email (custom content)

### ✅ How to Send Custom Emails:

#### Option 1: Resend.com (Recommended)
```typescript
// Free tier: 3,000 emails/month
// Pro tier: 50,000 emails/month ($20)

import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'noreply@infolokerjombang.id',
  to: user.email,
  subject: 'Password Changed Successfully',
  html: '<p>Your password was changed...</p>'
});
```

**Limits:**
- Free: 3,000 emails/month (100/day)
- Pro: 50,000 emails/month ($20)

#### Option 2: Supabase Edge Functions + SMTP
```typescript
// Use Supabase SMTP settings
// Same limits as auth emails (unlimited)
// But requires Pro tier for custom SMTP
```

#### Option 3: SendGrid
```
Free: 100 emails/day
Essentials: $19.95/month (up to 50,000/month)
```

---

## ⚠️ What Happens When Limit Reached?

### User Hits Rate Limit (4 requests/hour):

**Error Response:**
```json
{
  "error": "Email rate limit exceeded",
  "message": "For security purposes, you can only request this 4 times per hour",
  "status": 429
}
```

**User Experience:**
```
1. User requests 4th reset password → ✅ OK
2. User requests 5th time → ❌ Error shown
3. UI should show: "Too many requests. Try again in X minutes"
4. Wait 1 hour → Can try again
```

**How to Handle in UI:**
```typescript
const { error } = await supabase.auth.resetPasswordForEmail(email);

if (error?.status === 429) {
  setError("Terlalu banyak percobaan. Tunggu 1 jam dan coba lagi.");
  // Optionally show countdown timer
}
```

---

### IP Hits Rate Limit (60 requests/hour):

**Affects:**
- All users from that IP
- Common in offices, schools, public WiFi

**Solution:**
- Wait 1 hour
- Use different IP/network
- Contact Supabase support for whitelist

---

## 💡 Best Practices

### 1. **Implement Client-Side Rate Limiting**
```typescript
// Prevent spam clicking
const [lastRequestTime, setLastRequestTime] = useState<number | null>(null);
const [requestCount, setRequestCount] = useState(0);

const handleReset = async () => {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  
  // Check if within 1 hour window
  if (lastRequestTime && (now - lastRequestTime) < oneHour) {
    if (requestCount >= 4) {
      const timeLeft = Math.ceil((oneHour - (now - lastRequestTime)) / 60000);
      setError(`Tunggu ${timeLeft} menit lagi`);
      return;
    }
    setRequestCount(requestCount + 1);
  } else {
    // Reset counter after 1 hour
    setRequestCount(1);
    setLastRequestTime(now);
  }
  
  // Proceed with request
  await supabase.auth.resetPasswordForEmail(email);
};
```

### 2. **Show Clear Error Messages**
```typescript
if (error?.status === 429) {
  return "Terlalu banyak percobaan. Coba lagi dalam 1 jam.";
}
```

### 3. **Add Countdown Timer**
```typescript
// Show remaining time
const timeUntilReset = calculateTimeLeft();
return `Coba lagi dalam ${timeUntilReset} menit`;
```

### 4. **Prevent Button Spam**
```typescript
<Button 
  disabled={loading || isRateLimited}
  onClick={handleReset}
>
  {isRateLimited ? `Tunggu ${timeLeft}m` : 'Kirim Link'}
</Button>
```

---

## 🔧 Monitoring Email Usage

### Check in Supabase Dashboard:

1. **Auth Logs:**
   ```
   Dashboard → Authentication → Logs
   Filter: password_recovery, signup, magic_link
   See: Success/failure rate
   ```

2. **User Activity:**
   ```
   Dashboard → Authentication → Users
   See: Last sign in, email confirmed
   ```

3. **Rate Limit Events:**
   ```
   Check logs for 429 status codes
   Identify problematic IPs/users
   ```

---

## 💰 Cost Analysis

### Scenario 1: Small App (100 users)
```
Monthly emails:
- Signups: 20 → 20 verification emails
- Password resets: 5 → 5 reset emails
- Total: 25 emails/month

Cost: $0 (Free tier) ✅
Limits: No issues
```

### Scenario 2: Medium App (1,000 users)
```
Monthly emails:
- Signups: 200 → 200 verification emails
- Password resets: 30 → 30 reset emails
- Magic links: 50 → 50 emails
- Total: 280 emails/month

Cost: $0 (Free tier) ✅
Limits: No issues

+ Custom notifications (if implemented):
  - Password changed: 30
  - New login alerts: 100
  - Total custom: 130 emails
  
If using Resend: Still free (3,000/month limit) ✅
```

### Scenario 3: Large App (10,000 users)
```
Monthly emails:
- Signups: 2,000 → 2,000 verification emails
- Password resets: 300 → 300 reset emails
- Total auth: 2,300 emails/month

Cost: $0 (Free tier) ✅

+ Custom notifications:
  - Various: 5,000 emails/month
  
If using Resend: Need Pro ($20/month) for 50,000/month
```

---

## 🚀 Recommendations for JobMate

### Current Setup (Supabase Default):
```
✅ FREE forever
✅ Unlimited auth emails (signup, reset, magic link)
✅ Rate limits: 4/hour per user (sufficient)
✅ No monthly cap
```

### When to Upgrade:

#### Use Custom SMTP (Resend/SendGrid) when:
- ✅ Want custom email domain (@infolokerjombang.id)
- ✅ Need custom notification emails (password changed, etc.)
- ✅ Want better analytics/tracking
- ✅ Need higher delivery rate

**Cost:** $20/month (Resend Pro)

#### Stay with Supabase Default when:
- ✅ Budget-conscious (free)
- ✅ OK with @mail.app.supabase.io sender
- ✅ Only need basic auth emails
- ✅ Don't need custom notifications

**Cost:** $0/month ✅

---

## 📋 Quick Reference

### Supabase Auth Email Limits:
```
Type: Password Reset
Limit: 4 requests/hour/email ✅
Cost: Free ✅
Sender: @mail.app.supabase.io

Type: Signup Verification  
Limit: 4 requests/hour/email ✅
Cost: Free ✅

Type: Magic Link
Limit: 4 requests/hour/email ✅
Cost: Free ✅

Type: Custom Notifications (password changed, etc.)
Limit: Not built-in ❌
Cost: Need external service (Resend/SendGrid)
      Resend Free: 3,000/month
      Resend Pro: $20/month
```

---

## ✅ For JobMate Specifically:

### Current Status:
```
✅ Reset password: Works (unlimited, rate limited 4/hour)
✅ Signup verification: Works (unlimited, rate limited 4/hour)
✅ No monthly caps
✅ Free forever
```

### If You Want to Add:
```
❌ Password changed notification
❌ New device login alert
❌ Custom welcome email

→ Need: Resend.com (Free tier: 3,000/month)
→ Cost: $0 if < 3,000 emails/month
→ Upgrade: $20/month for 50,000 emails/month
```

### My Recommendation:
```
✅ Keep Supabase default for now (FREE!)
✅ Monitor usage in first months
✅ Add Resend later if needed for custom emails
✅ Rate limits (4/hour) are sufficient for normal use
```

---

## 🎯 Summary

**Q: Ada limit email Supabase?**
**A:** Ya, tapi generous:

1. ✅ **Unlimited total emails** per month (auth emails)
2. ⚠️ **Rate limited:** 4 requests/hour per user
3. ✅ **Free forever** untuk auth emails
4. ❌ **Custom notifications** not included (need external service)

**For 99% apps, Supabase default limits are MORE than enough!** ✅

---

**Bottom line: Anda aman dengan Supabase default. Tidak perlu khawatir tentang limits untuk use case normal!** 🎉
