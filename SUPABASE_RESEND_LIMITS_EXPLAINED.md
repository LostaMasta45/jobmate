# Supabase + Resend SMTP: Limits & Template Management

## 🤔 Your Questions Answered

### Q1: Jika pakai Resend SMTP, template tetap edit di Supabase?

**Answer: YES! ✅**

```
Template Management: Supabase Dashboard
Email Delivery: Resend SMTP

Workflow:
1. Edit template → Supabase Dashboard (Auth → Email Templates)
2. User requests reset → Supabase generates HTML from template
3. Send email → Goes through Resend SMTP
4. Delivered → From admin@jobmate.web.id via Resend
```

---

### Q2: Limit dari Supabase atau Resend?

**Answer: BOTH! (Different types of limits)**

```
Supabase Limits:     Rate limiting (4/hour per user)
Resend Limits:       Monthly quota (3,000/month free)

You get BOTH limits applied!
```

---

## 📊 Complete Limit Breakdown

### When Using Supabase Default Email (Before):

```
Template: Supabase Dashboard
Sending: Supabase infrastructure
From: @mail.app.supabase.io

Limits:
✅ Monthly emails: UNLIMITED
✅ Total volume: No cap
⚠️ Rate limit: 4 requests/hour per email (Supabase)
⚠️ IP limit: 60 requests/hour per IP (Supabase)

Cost: $0 (Free forever)
```

---

### When Using Resend SMTP (Now):

```
Template: Supabase Dashboard ← STILL HERE!
Sending: Resend SMTP infrastructure
From: @jobmate.web.id

Limits:
⚠️ Monthly emails: 3,000 (Resend Free)
⚠️ Daily emails: 100 (Resend Free)
⚠️ Rate limit: 4 requests/hour per email (Supabase)
⚠️ IP limit: 60 requests/hour per IP (Supabase)

Cost: $0 (Free tier Resend)
      $20/month (Pro - 50,000 emails)
```

---

## 🔄 How It Works Together

### Complete Flow:

```
┌────────────────────────────────────────┐
│ 1. User requests password reset        │
│    (http://localhost:3005/reset)       │
└──────────────┬─────────────────────────┘
               │
               ▼
┌────────────────────────────────────────┐
│ 2. Supabase Auth triggered             │
│    - Checks rate limit (4/hour) ✅     │
│    - Generates token                   │
│    - Loads template from Dashboard     │
└──────────────┬─────────────────────────┘
               │
               ▼
┌────────────────────────────────────────┐
│ 3. Supabase generates HTML             │
│    - Uses template you edited          │
│    - Inserts {{ .ConfirmationURL }}    │
│    - Prepares email content            │
└──────────────┬─────────────────────────┘
               │
               ▼
┌────────────────────────────────────────┐
│ 4. Connect to Resend SMTP              │
│    - Host: smtp.resend.com             │
│    - Port: 587                         │
│    - Auth: resend / re_xxxxx           │
└──────────────┬─────────────────────────┘
               │
               ▼
┌────────────────────────────────────────┐
│ 5. Resend delivers email               │
│    - Checks monthly limit (3,000) ✅   │
│    - Checks daily limit (100) ✅       │
│    - Sends from: admin@jobmate.web.id  │
│    - Uses your verified domain         │
└──────────────┬─────────────────────────┘
               │
               ▼
┌────────────────────────────────────────┐
│ 6. User receives email ✅              │
│    From: admin@jobmate.web.id          │
│    Via: Resend infrastructure          │
└────────────────────────────────────────┘
```

---

## 📋 Comparison Table

| Feature | Supabase Default | Supabase + Resend SMTP |
|---------|------------------|------------------------|
| **Template Editing** | Supabase Dashboard | Supabase Dashboard ✅ (SAME!) |
| **Email Generation** | Supabase | Supabase ✅ (SAME!) |
| **SMTP Delivery** | Supabase servers | Resend servers |
| **From Address** | @mail.app.supabase.io | @jobmate.web.id ✅ |
| **Monthly Limit** | Unlimited ✅ | 3,000 (free) ⚠️ |
| **Daily Limit** | None ✅ | 100 (free) ⚠️ |
| **Rate Limit** | 4/hour per email | 4/hour per email (SAME!) |
| **Cost** | $0 | $0 (or $20 Pro) |

---

## 🎯 Key Takeaways

### 1. Template Management

**WHERE you edit templates:**
```
✅ Supabase Dashboard → Authentication → Email Templates

This does NOT change when using Resend SMTP!
You still edit templates in Supabase.
```

**What Supabase does:**
- Manages templates
- Generates HTML from templates
- Handles rate limiting
- Inserts dynamic values ({{ .ConfirmationURL }})

**What Resend does:**
- Delivers the email
- Provides SMTP infrastructure
- Tracks deliverability
- Handles monthly/daily quotas

---

### 2. Limits Applied

**Supabase Limits (Still Active):**
```
✅ Rate limit: 4 requests/hour per email
✅ IP limit: 60 requests/hour per IP
✅ Token expiry: 1 hour (default)

These are AUTH limits, not email limits!
They protect against abuse.
```

**Resend Limits (New):**
```
⚠️ Monthly emails: 3,000 (Free tier)
⚠️ Daily emails: 100 (Free tier)
⚠️ No rate limits (Resend doesn't rate limit)

These are DELIVERY limits!
They limit total volume.
```

**Combined Effect:**
```
Example scenario:

User requests 5 resets in 1 hour:
  1st request: ✅ Sent (Supabase rate: 1/4, Resend: 1/100 daily)
  2nd request: ✅ Sent (Supabase rate: 2/4, Resend: 2/100 daily)
  3rd request: ✅ Sent (Supabase rate: 3/4, Resend: 3/100 daily)
  4th request: ✅ Sent (Supabase rate: 4/4, Resend: 4/100 daily)
  5th request: ❌ BLOCKED by Supabase (rate limit exceeded)

If you send 101 emails in one day:
  1-100: ✅ Sent (within Resend daily limit)
  101: ❌ BLOCKED by Resend (daily limit exceeded)

If you send 3,001 emails in one month:
  1-3,000: ✅ Sent (within Resend monthly limit)
  3,001: ❌ BLOCKED by Resend (monthly limit exceeded)
```

---

## 💡 Practical Impact for JobMate

### Your Expected Usage:

```
Monthly estimates:
- Signups: ~50-100 verification emails
- Password resets: ~20-30 reset emails
- Total: ~100 emails/month

Limits:
- Supabase rate: 4/hour per user ✅ (No impact)
- Resend daily: 100 emails ✅ (Well within)
- Resend monthly: 3,000 emails ✅ (Well within)

Status: NO ISSUES! All limits are safe! 🎉
```

---

## 🔧 Template Editing Workflow

### Step-by-Step:

1. **Edit Template:**
   ```
   Go to: Supabase Dashboard
   Navigate: Authentication → Email Templates
   Select: "Reset Password" template
   Edit: HTML/text content
   Use: {{ .ConfirmationURL }} for reset link
   Save: Template stored in Supabase
   ```

2. **User Triggers Email:**
   ```
   User: Submits email at /reset
   Supabase: Checks rate limit (4/hour)
   Supabase: Generates HTML from YOUR template
   Supabase: Connects to Resend SMTP
   ```

3. **Resend Delivers:**
   ```
   Resend: Checks daily/monthly limits
   Resend: Sends email via SMTP
   Resend: Tracks delivery status
   User: Receives email from @jobmate.web.id
   ```

**You never edit anything in Resend!**
**Resend is ONLY for delivery (SMTP server)**

---

## 📊 What Each Service Does

### Supabase Responsibilities:

```
✅ Store email templates
✅ Manage authentication flow
✅ Generate password reset tokens
✅ Rate limit requests (4/hour)
✅ Render HTML from templates
✅ Insert dynamic variables
✅ Connect to SMTP server (Resend)
```

### Resend Responsibilities:

```
✅ Accept SMTP connection from Supabase
✅ Deliver emails via SMTP
✅ Check daily limit (100/day)
✅ Check monthly limit (3,000/month)
✅ Track delivery status
✅ Provide analytics
✅ Handle bounces/complaints
```

---

## 🎯 Common Misconceptions

### ❌ Misconception 1:
```
"If I use Resend, I edit templates in Resend"
```
**✅ CORRECT:**
```
Templates are ALWAYS edited in Supabase Dashboard!
Resend is ONLY the delivery channel (SMTP server).
```

---

### ❌ Misconception 2:
```
"Resend replaces Supabase email system"
```
**✅ CORRECT:**
```
Resend SUPPLEMENTS Supabase.
Supabase still handles templates & auth.
Resend only handles delivery via SMTP.
```

---

### ❌ Misconception 3:
```
"With Resend, I get unlimited emails like before"
```
**✅ CORRECT:**
```
NO! You now have Resend limits:
- 3,000/month (free)
- 100/day (free)

Before (Supabase default): Unlimited
After (Resend SMTP): 3,000/month limit

BUT you get custom domain @jobmate.web.id!
```

---

## 💰 Cost Comparison

### Option A: Supabase Default (Before)

```
Cost: $0/month
Monthly emails: Unlimited
From: @mail.app.supabase.io
Rate limit: 4/hour per user

Pros:
✅ Free unlimited emails
✅ Zero setup
✅ No monthly caps

Cons:
❌ Generic sender domain
❌ Less professional
❌ No analytics
```

### Option B: Supabase + Resend Free (Now)

```
Cost: $0/month
Monthly emails: 3,000
Daily emails: 100
From: @jobmate.web.id
Rate limit: 4/hour per user

Pros:
✅ Custom domain
✅ Professional sender
✅ Better deliverability
✅ Email analytics
✅ Still free (3,000/month enough)

Cons:
⚠️ Monthly/daily caps
⚠️ Need to monitor usage
```

### Option C: Supabase + Resend Pro

```
Cost: $20/month
Monthly emails: 50,000
Daily emails: Unlimited
From: @jobmate.web.id
Rate limit: 4/hour per user

Pros:
✅ All Option B benefits
✅ Higher limits
✅ Priority support
✅ Advanced analytics

When to upgrade:
- Growing to > 3,000 emails/month
- Need more than 100 emails/day
- Want advanced features
```

---

## 📈 When Will You Hit Limits?

### Resend Free Tier Limits:

**Daily Limit (100 emails):**
```
Scenario: Viral growth day
- 150 signups in one day
- Each needs verification email
- First 100: ✅ Sent
- Next 50: ❌ Blocked (wait until tomorrow)

Prevention: Monitor daily usage in Resend dashboard
```

**Monthly Limit (3,000 emails):**
```
Scenario: Rapid growth month
- 500 signups/month → 500 verification emails
- 300 password resets/month → 300 reset emails
- Total: 800 emails/month ✅ (within limit)

Scenario: Very high growth
- 2,000 signups/month → 2,000 emails
- 1,500 resets/month → 1,500 emails
- Total: 3,500 emails/month ❌ (exceeds 3,000)
- Need upgrade to Pro ($20/month)
```

---

## ✅ Summary

### Your Questions Answered:

**Q: Template tetap edit di Supabase?**
```
A: YES! ✅
   Templates ALWAYS edited in Supabase Dashboard.
   Resend is ONLY for email delivery (SMTP).
```

**Q: Limit dari Supabase atau Resend?**
```
A: BOTH! ✅
   Supabase: 4 requests/hour per email (rate limit)
   Resend: 3,000/month, 100/day (volume limit)
   
   You get BOTH limits applied.
```

---

## 🎯 Key Points

1. **Template management:** Always in Supabase Dashboard
2. **Email generation:** Supabase renders HTML from template
3. **Email delivery:** Goes through Resend SMTP
4. **Rate limits:** Supabase controls (4/hour per email)
5. **Volume limits:** Resend controls (3,000/month, 100/day)
6. **From address:** Your domain (@jobmate.web.id)
7. **Cost:** $0 for free tier (enough for most cases)

---

**For JobMate specifically:**
```
Expected usage: ~100 emails/month
Resend free limit: 3,000/month
Status: ✅ Safely within limits!

You're good to go! 🚀
```
