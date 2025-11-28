# Quick Debug Commands - Reset Password

## 🚀 Test Sekarang (Copy-Paste Commands)

### 1️⃣ Cek Email di Database

**Supabase SQL Editor:**
```sql
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email = 'updatesumobito@gmail.com';
```

**Expected:** 1 row with email  
**If 0 rows:** Email belum terdaftar → register dulu

---

### 2️⃣ Start Server & Test

**Terminal:**
```bash
npm run dev
```

**Browser:**
```
1. Open: http://localhost:3000/reset
2. Press F12 (open console)
3. Enter: updatesumobito@gmail.com
4. Submit form
5. Watch console logs
```

---

### 3️⃣ Check Console Output

**Look for:**
```
✅ SUCCESS:
   📧 Supabase Response:
     Error: null
   ✅ Reset request successful!

❌ ERROR:
   ❌ Reset failed: [error message]
```

---

### 4️⃣ Check Supabase Logs

**Dashboard:**
```
1. https://supabase.com/dashboard
2. Your Project → Authentication → Logs
3. Filter: password_recovery
4. Check last event
```

---

### 5️⃣ Search Email

**Gmail Search:**
```
from:@mail.app.supabase.io
```

**Check:**
- Inbox
- Spam/Junk
- All Mail

---

## 🔧 Quick Fixes

### Email Not Found in DB?
```bash
Go to: http://localhost:3000/sign-up
Register: updatesumobito@gmail.com
Then retry reset
```

### Rate Limit Error?
```sql
-- Clear rate limit (dev only):
DELETE FROM auth.rate_limit 
WHERE email = 'updatesumobito@gmail.com';
```

### Project Paused?
```
Dashboard → Click "Restore Project"
Wait 2-3 minutes
Retry
```

### Email Auth Disabled?
```
Dashboard → Settings → Authentication
Enable "Email Provider" toggle
Save & retry
```

---

## 📋 Tell Me Results

**Copy this template and fill in:**

```
✅ STEP 1: Email in Database
   Result: YES / NO
   
✅ STEP 2: Console Output
   Error: YES / NO
   Message: _______
   
✅ STEP 3: Supabase Logs
   Event found: YES / NO
   Status: _______
   
✅ STEP 4: Email Received
   Found: YES / NO
   Location: inbox / spam / not found
```

**Then send me these results!** 📊

---

## 🎯 Most Common Issue

**90% of cases:** Email sudah terdaftar tapi:
1. ✅ Supabase sends email successfully
2. ❌ Gmail blocks/filters it

**Solution:**
- Check spam folder carefully
- Search: `from:@mail.app.supabase.io`
- Wait full 3 minutes
- Check "All Mail" folder
- Try different email (outlook/yahoo)

---

**Test now dengan commands di atas, lalu kasih tau hasilnya!** 🚀
