# 📧 RESEND EMAIL - Setup Complete Guide

## 🤔 Pertanyaan Kamu: Bisa Kirim ke Semua Email?

**JAWABAN:** 
- ❌ **TIDAK BISA** (jika domain belum verified)
- ✅ **BISA** (setelah domain verified)

---

## 📊 Resend.com - 2 Mode

### 🔵 Development Mode (Default) - RESTRICTED
```
Status: Testing/Development
Domain: onboarding@resend.dev (default dari Resend)

Kirim Email Ke:
❌ Semua email → TIDAK BISA
✅ Email yang verified di Resend → BISA

Example:
✅ admin@jobmate.web.id (jika sudah add di Resend)
✅ your-email@gmail.com (jika sudah add di Resend)
❌ random-user@gmail.com → REJECTED!
❌ customer@yahoo.com → REJECTED!
```

**Kenapa dibatasi?**
- Prevent spam
- Protect reputation
- For testing only

---

### 🟢 Production Mode - UNLIMITED ✅
```
Status: Production Ready
Domain: jobmate.web.id (VERIFIED)

Kirim Email Ke:
✅ SEMUA email di dunia! 🌍
✅ Gmail, Yahoo, Outlook, dll
✅ Customer email manapun
✅ No restrictions!

Example:
✅ user@gmail.com → SUCCESS!
✅ customer@yahoo.com → SUCCESS!
✅ anyone@anywhere.com → SUCCESS!
```

**Requirement:**
- Domain MUST be verified
- DNS records configured
- SPF, DKIM, DMARC setup

---

## ✅ Cara Setup Production Mode (Kirim ke Semua Email)

### Step 1: Login ke Resend Dashboard
```
URL: https://resend.com/login
Login dengan account kamu
```

---

### Step 2: Add Domain
```
1. Klik "Domains" di sidebar
2. Klik "Add Domain"
3. Enter: jobmate.web.id
4. Klik "Add"
```

**Result:** Resend akan berikan DNS records yang perlu di-add

---

### Step 3: Get DNS Records
```
Resend akan show 3 DNS records:

1. SPF Record (TXT)
   Type: TXT
   Name: @
   Value: v=spf1 include:_spf.resend.com ~all

2. DKIM Record (TXT)
   Type: TXT
   Name: resend._domainkey
   Value: [long string dari Resend]

3. DMARC Record (TXT) - Optional tapi recommended
   Type: TXT
   Name: _dmarc
   Value: v=DMARC1; p=none; rua=mailto:dmarc@jobmate.web.id
```

---

### Step 4: Add DNS Records ke Domain Provider

**Dimana jobmate.web.id didaftarkan?**
- Niagahoster?
- Cloudflare?
- Namecheap?
- GoDaddy?

**Contoh jika pakai Cloudflare:**

```
1. Login ke Cloudflare
2. Select domain: jobmate.web.id
3. Klik "DNS"
4. Klik "Add record"

Record 1 (SPF):
  Type: TXT
  Name: @
  Content: v=spf1 include:_spf.resend.com ~all
  TTL: Auto
  [Save]

Record 2 (DKIM):
  Type: TXT
  Name: resend._domainkey
  Content: [paste dari Resend]
  TTL: Auto
  [Save]

Record 3 (DMARC):
  Type: TXT
  Name: _dmarc
  Content: v=DMARC1; p=none; rua=mailto:dmarc@jobmate.web.id
  TTL: Auto
  [Save]
```

---

### Step 5: Verify Domain di Resend

```
1. Kembali ke Resend Dashboard
2. Klik "Domains"
3. Klik "Verify" di jobmate.web.id
4. Resend akan check DNS records
```

**Wait Time:**
- DNS propagation: 15 minutes - 48 hours
- Biasanya: 30 minutes - 2 hours

**Status:**
```
⏳ Pending → DNS belum propagate
✅ Verified → READY! Bisa kirim ke semua email!
❌ Failed → DNS records salah, cek lagi
```

---

### Step 6: Update From Email

**File:** `.env.local`

**Before (Development):**
```
RESEND_FROM_EMAIL=onboarding@resend.dev
```

**After (Production):**
```
RESEND_FROM_EMAIL=noreply@jobmate.web.id
```

**Or custom:**
```
RESEND_FROM_EMAIL=info@jobmate.web.id
RESEND_FROM_EMAIL=support@jobmate.web.id
RESEND_FROM_EMAIL=hello@jobmate.web.id
```

**Note:** Email name BEBAS, yang penting @jobmate.web.id

---

## 🔍 Cek Status Domain Sekarang

### Check 1: Resend Dashboard
```
1. Login: https://resend.com/domains
2. Lihat status jobmate.web.id
   
Status:
✅ Verified → Bisa kirim ke semua email!
⏳ Pending → DNS belum propagate
❌ Not Added → Perlu add domain dulu
```

---

### Check 2: DNS Records (Manual Check)

**Tool:** https://mxtoolbox.com/

```
1. Open: https://mxtoolbox.com/SuperTool.aspx

2. Check SPF:
   Type: TXT Lookup
   Enter: jobmate.web.id
   Should show: v=spf1 include:_spf.resend.com ~all

3. Check DKIM:
   Type: TXT Lookup
   Enter: resend._domainkey.jobmate.web.id
   Should show: [DKIM string dari Resend]

4. Check DMARC:
   Type: TXT Lookup
   Enter: _dmarc.jobmate.web.id
   Should show: v=DMARC1; p=none...
```

---

## 📧 Test Send Email

### Development Mode (Restricted):
```typescript
// Hanya bisa kirim ke email yang verified di Resend
await resend.emails.send({
  from: 'onboarding@resend.dev',
  to: 'verified-email@gmail.com',  // Must be verified!
  subject: 'Test',
  html: '<p>Hello</p>'
});

// Result:
✅ verified-email@gmail.com → SUCCESS
❌ random@gmail.com → REJECTED
```

---

### Production Mode (Unlimited):
```typescript
// Bisa kirim ke SEMUA email!
await resend.emails.send({
  from: 'noreply@jobmate.web.id',  // Verified domain
  to: 'anyone@anywhere.com',       // ANY email!
  subject: 'Welcome to JobMate',
  html: '<p>Hello</p>'
});

// Result:
✅ anyone@anywhere.com → SUCCESS!
✅ customer@yahoo.com → SUCCESS!
✅ user@outlook.com → SUCCESS!
```

---

## 🎯 Current Status Check

### Kemungkinan 1: Domain Belum Ditambahkan
```
Status di Resend:
❌ jobmate.web.id NOT in domains list

Action Needed:
1. Add domain di Resend
2. Copy DNS records
3. Add ke domain provider
4. Verify
5. Wait DNS propagate (30 min - 2 hours)

Result:
✅ Bisa kirim ke semua email!
```

---

### Kemungkinan 2: Domain Sudah Ditambahkan Tapi Pending
```
Status di Resend:
⏳ jobmate.web.id PENDING verification

Action Needed:
1. Check DNS records sudah benar?
2. Wait DNS propagate
3. Click "Verify" di Resend

Result:
✅ Setelah verified, bisa kirim ke semua email!
```

---

### Kemungkinan 3: Domain Sudah Verified ✅
```
Status di Resend:
✅ jobmate.web.id VERIFIED

Current Status:
✅ SUDAH bisa kirim ke semua email!
✅ No restrictions
✅ Production ready

Pastikan .env.local:
RESEND_FROM_EMAIL=noreply@jobmate.web.id
(bukan onboarding@resend.dev)
```

---

## 🔧 Troubleshooting

### Issue 1: "Email not allowed in development mode"
```
Error: Cannot send email to unverified address in development

Cause:
❌ Domain belum verified
❌ Masih pakai default Resend domain

Solution:
1. Add & verify domain jobmate.web.id
2. Update RESEND_FROM_EMAIL
3. Restart aplikasi
```

---

### Issue 2: DNS Verification Failed
```
Error: DNS records not found

Cause:
❌ DNS records belum di-add
❌ DNS belum propagate
❌ DNS records salah

Solution:
1. Double check DNS records di domain provider
2. Wait 1-2 hours untuk propagation
3. Use https://mxtoolbox.com/ untuk verify
4. Try verify again di Resend
```

---

### Issue 3: Emails Going to Spam
```
Problem: Email masuk ke spam folder

Cause:
⚠️ DMARC policy too strict
⚠️ No SPF/DKIM
⚠️ Low sender reputation (domain baru)

Solution:
1. Pastikan SPF, DKIM, DMARC configured
2. DMARC policy: p=none (jangan p=reject)
3. Warm up domain (kirim sedikit dulu)
4. Add unsubscribe link
5. Good email content (not spammy)
```

---

## 📊 Comparison: Development vs Production

| Feature | Development Mode | Production Mode |
|---------|------------------|-----------------|
| **From Email** | onboarding@resend.dev | noreply@jobmate.web.id |
| **Send To** | Verified emails only | ✅ ANY email! |
| **Restrictions** | Max 100 emails/day | Based on plan |
| **Domain** | Resend's domain | Your domain (verified) |
| **Deliverability** | Low (shared domain) | ✅ High (your domain) |
| **Professional** | ❌ No | ✅ YES |
| **Production Ready** | ❌ NO | ✅ YES |

---

## 💡 Recommendations

### For Testing (Development):
```
✅ Use: onboarding@resend.dev
✅ Add your test emails di Resend → "Verified Emails"
✅ Test dengan email yang verified saja
```

### For Production (Live Users):
```
✅ MUST verify domain: jobmate.web.id
✅ Setup: SPF, DKIM, DMARC
✅ Use: noreply@jobmate.web.id
✅ Can send to ANY email worldwide! 🌍
```

---

## 🚀 Step-by-Step Action Plan

### Priority 1: Verify Domain (URGENT)
```bash
1. Login to Resend: https://resend.com/domains

2. Add domain: jobmate.web.id
   (if not added yet)

3. Copy DNS records:
   - SPF
   - DKIM
   - DMARC

4. Add to domain provider:
   (Cloudflare / Niagahoster / dll)

5. Wait 30 min - 2 hours

6. Verify di Resend

7. ✅ Status: VERIFIED
```

**Time:** 30 minutes (setup) + 1-2 hours (DNS propagate)

---

### Priority 2: Update Code
```bash
1. Edit .env.local:
   RESEND_FROM_EMAIL=noreply@jobmate.web.id

2. Restart development server:
   docker-dev-stop.bat
   docker-dev-start-bg.bat

3. Test send email

4. ✅ Should work to ANY email!
```

---

### Priority 3: Update Vercel (Production)
```bash
1. Vercel Dashboard → Settings → Environment Variables

2. Update:
   RESEND_FROM_EMAIL=noreply@jobmate.web.id

3. Redeploy (optional, next deploy will use it)

4. ✅ Production ready!
```

---

## 📝 Quick Check Commands

### Check Domain Status (Resend):
```bash
# Login & check
https://resend.com/domains

# Look for:
✅ jobmate.web.id - VERIFIED
```

### Check DNS Records:
```bash
# SPF Check
nslookup -type=TXT jobmate.web.id

# DKIM Check
nslookup -type=TXT resend._domainkey.jobmate.web.id

# DMARC Check
nslookup -type=TXT _dmarc.jobmate.web.id
```

### Test Send Email:
```typescript
// Test in code
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const { data, error } = await resend.emails.send({
  from: 'noreply@jobmate.web.id',
  to: 'your-email@gmail.com',  // Your personal email to test
  subject: 'Test Production Email',
  html: '<p>If you receive this, production mode works! ✅</p>'
});

console.log('Result:', data ? 'SUCCESS ✅' : `ERROR: ${error}`);
```

---

## ✅ Checklist: Ready for Production

### Domain Setup:
- [ ] Domain jobmate.web.id added to Resend
- [ ] SPF record added to DNS
- [ ] DKIM record added to DNS
- [ ] DMARC record added to DNS
- [ ] Domain status: VERIFIED in Resend
- [ ] DNS propagation complete (check with mxtoolbox)

### Code Setup:
- [ ] `.env.local` updated: RESEND_FROM_EMAIL=noreply@jobmate.web.id
- [ ] Test send email successful
- [ ] Email received (not in spam)

### Production (Vercel):
- [ ] Environment variable updated
- [ ] Redeployed (or wait next deploy)
- [ ] Test send from production

**If ALL checked:** ✅ **READY! Bisa kirim ke semua email!** 🎉

---

## 🎉 Summary

### Current Situation (Most Likely):
```
❌ Domain belum verified
❌ Hanya bisa kirim ke verified emails
❌ Pakai onboarding@resend.dev
```

### After Domain Verification:
```
✅ Domain jobmate.web.id VERIFIED
✅ Bisa kirim ke SEMUA email (Gmail, Yahoo, dll)
✅ Pakai noreply@jobmate.web.id
✅ No restrictions!
✅ Production ready! 🚀
```

### Action Required:
```
1. Add domain di Resend → 5 min
2. Add DNS records → 10 min
3. Wait DNS propagate → 1-2 hours
4. Verify domain → 1 min
5. Update .env.local → 1 min
6. Test! → 2 min

Total: ~2 hours (mostly waiting)
```

---

## 📞 Need Help?

**Resend Documentation:**
- https://resend.com/docs/dashboard/domains/introduction
- https://resend.com/docs/send-with-nextjs

**DNS Tools:**
- https://mxtoolbox.com/ (Check DNS)
- https://www.whatsmydns.net/ (Check propagation)

**Support:**
- Resend: support@resend.com
- Resend Discord: https://resend.com/discord

---

**Created:** 2025-11-10  
**For:** JobMate - Email Setup  
**Domain:** jobmate.web.id  
**Goal:** ✅ Send emails to ANY email address!
