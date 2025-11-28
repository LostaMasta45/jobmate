# Quick Fix: Email Masuk Spam

## 🎯 Do These 5 Things NOW (15 Minutes)

### ✅ 1. Check DNS Records Propagated (5 min)

**Go to:** https://dnschecker.org/

**Test these 3:**

#### Test 1: SPF Record
```
Domain: jobmate.web.id
Type: TXT
Look for: v=spf1 include:_spf.resend.com ~all
```

#### Test 2: DKIM Record
```
Domain: resend._domainkey.jobmate.web.id
Type: TXT
Look for: v=DKIM1; k=rsa; p=MIGfMA0...
```

#### Test 3: DMARC Record
```
Domain: _dmarc.jobmate.web.id
Type: TXT
Look for: v=DMARC1; p=...
```

**Expected:** Semua harus ✅ hijau di mayoritas server

**If NOT green:** Wait 24 hours for DNS propagation

---

### ✅ 2. Add Return-Path Record (2 min)

**Go to your DNS provider (where you added TXT records before)**

**Add new record:**
```
Type: CNAME
Name: re
Value: feedback-smtp.resend.com
TTL: 3600
```

**Save and wait 5 minutes**

---

### ✅ 3. Test Email Score (3 min)

**Go to:** https://www.mail-tester.com/

**Steps:**
1. Copy email address shown (example: test-abc123@mail-tester.com)
2. Go to: http://localhost:3005/reset
3. Submit reset with that email
4. Go back to mail-tester and click "Then check your score"

**Target Score:** 9/10 or 10/10

**If < 9/10:** Note what issues are shown

---

### ✅ 4. Ask Users Mark "Not Spam" (2 min)

**For your test emails:**
1. Check spam folder
2. Select email
3. Click "Not spam" or "Report not spam"
4. Do this 5-10 times with different accounts

**This trains Gmail that your emails are legitimate**

---

### ✅ 5. Update DMARC Policy (3 min)

**Go to your DNS provider**

**Find existing DMARC record:**
```
Type: TXT
Name: _dmarc
Current Value: v=DMARC1; p=none; ...
```

**Update to:**
```
Type: TXT
Name: _dmarc
New Value: v=DMARC1; p=quarantine; rua=mailto:postmaster@jobmate.web.id; pct=100; adkim=s; aspf=s
```

**Save**

---

## 📊 Expected Results

### Today (After Fixes):
```
If DNS propagated: 7-8/10 mail-tester score
Emails: Still might go to spam (normal!)
```

### Tomorrow (24 hours):
```
DNS fully propagated: 9-10/10 score
Emails: 50% inbox, 50% spam
```

### Week 1:
```
Domain warming up
Emails: 70% inbox, 30% spam
```

### Week 2-4:
```
Domain reputation built
Emails: 90%+ inbox
```

---

## 🚨 Most Common Issue

**90% chance it's this:**

```
Problem: DNS not fully propagated yet
Timeline: Takes 24-48 hours
Solution: Just wait!

Even if:
- SPF ✅
- DKIM ✅
- DMARC ✅

Still need time for:
- Global DNS propagation
- Domain reputation building
- Warm-up period
```

---

## ✅ Quick Verification

**After doing steps 1-5, check:**

```
[ ] SPF record green in dnschecker.org
[ ] DKIM record green in dnschecker.org
[ ] DMARC record green in dnschecker.org
[ ] Return-Path CNAME added
[ ] Mail-tester score > 8/10
[ ] Asked 5+ users to mark "not spam"
```

---

## 📞 Tell Me Results

**After completing the 5 steps, report:**

1. DNSChecker results:
   - SPF: ✅/⏳/❌
   - DKIM: ✅/⏳/❌
   - DMARC: ✅/⏳/❌

2. Mail-tester score: __/10

3. Issues shown (if any): _______

**Then I can give specific next steps!**

---

## 💡 Quick Wins

**While waiting for DNS:**

```
✅ Send emails to your own Gmail
✅ Mark "not spam" repeatedly
✅ Send to active Gmail accounts
✅ Avoid sending to old emails
✅ Keep volume low (< 50/day)
```

**This helps build initial reputation!**

---

**Do the 5 steps above NOW and tell me:**
1. DNS propagation status
2. Mail-tester score
3. Any errors

Then I'll help further! 🚀
