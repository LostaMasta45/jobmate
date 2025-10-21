# 🚨 EMERGENCY FIX: Update Membership via API

Jika Supabase SQL Editor tidak bisa diakses, gunakan API endpoint ini.

## 📋 Option 1: Via Browser Console (EASIEST)

### Step 1: Open Browser Console
1. Buka aplikasi di browser: http://localhost:3000
2. Press **F12** atau **Right Click → Inspect**
3. Pilih tab **"Console"**

### Step 2: Paste & Run JavaScript

**Copy & paste code ini di console:**

```javascript
// Fix Losta User - VIP Basic
fetch('http://localhost:3000/api/admin/force-update-membership', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'lostamasta.com@gmail.com',
    membership: 'vip_basic',
    days: 30
  })
})
.then(res => res.json())
.then(data => {
  console.log('✅ UPDATE SUCCESS:', data);
  alert('User berhasil di-update ke VIP Basic!');
})
.catch(err => {
  console.error('❌ ERROR:', err);
  alert('Error: ' + err.message);
});
```

**Press Enter** to run.

### Step 3: Check Response
Should see:
```javascript
✅ UPDATE SUCCESS: {
  success: true,
  message: "Updated lostamasta.com@gmail.com to vip_basic",
  data: {
    email: "lostamasta.com@gmail.com",
    membership: "vip_basic",
    membership_status: "active",
    membership_expiry: "2025-11-XX..."
  }
}
```

---

## 📋 Option 2: Via curl (Terminal)

Open terminal and run:

```bash
curl -X POST http://localhost:3000/api/admin/force-update-membership \
  -H "Content-Type: application/json" \
  -d '{
    "email": "lostamasta.com@gmail.com",
    "membership": "vip_basic",
    "days": 30
  }'
```

---

## 📋 Option 3: Via Postman/Insomnia

**Method**: POST  
**URL**: `http://localhost:3000/api/admin/force-update-membership`  
**Headers**:
```
Content-Type: application/json
```
**Body** (raw JSON):
```json
{
  "email": "lostamasta.com@gmail.com",
  "membership": "vip_basic",
  "days": 30
}
```

---

## 🔍 Verify Update: Check Current Status

**Via Browser Console:**
```javascript
fetch('http://localhost:3000/api/admin/force-update-membership?email=lostamasta.com@gmail.com')
  .then(res => res.json())
  .then(data => console.log('Current Status:', data));
```

**Via curl:**
```bash
curl http://localhost:3000/api/admin/force-update-membership?email=lostamasta.com@gmail.com
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "email": "lostamasta.com@gmail.com",
    "membership": "vip_basic",
    "membership_status": "active",
    "membership_expiry": "2025-11-XX...",
    "role": "user"
  }
}
```

---

## 🎯 Update Different Membership Types

### VIP Premium (Lifetime):
```javascript
fetch('http://localhost:3000/api/admin/force-update-membership', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    membership: 'vip_premium'
    // No days needed - Premium is lifetime
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

### VIP Basic (Custom Days):
```javascript
fetch('http://localhost:3000/api/admin/force-update-membership', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    membership: 'vip_basic',
    days: 90 // 3 months
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

### Downgrade to Free:
```javascript
fetch('http://localhost:3000/api/admin/force-update-membership', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    membership: 'free'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## ✅ After Update Success

### Step 1: User Logout/Login
1. User **logout** dari aplikasi
2. User **login** kembali
3. Should work now!

### Step 2: Check Middleware Logs
After login, should see:
```
[MIDDLEWARE] User: lostamasta.com@gmail.com
[MIDDLEWARE] Membership: vip_basic ✅
[MIDDLEWARE] Membership Status: active ✅
[MIDDLEWARE] VIP access granted: vip_basic ✅
```

### Step 3: Test Access
- ✅ Can access `/vip/loker`
- ✅ Can access `/vip/perusahaan`
- ✅ Can access `/dashboard`
- ❌ Cannot access `/tools/**` (redirects to VIP)

---

## ⚠️ Troubleshooting

### Error: "User not found"
```javascript
// Check if user exists in profiles table
fetch('http://localhost:3000/api/admin/force-update-membership?email=lostamasta.com@gmail.com')
  .then(res => res.json())
  .then(data => console.log(data));
```

If user not found, check:
1. Email spelling correct?
2. User has profile in profiles table?
3. Check via Supabase Table Editor

### Error: "Internal server error"
Check server console (terminal running npm run dev) for detailed error.

### Update Not Reflecting
1. **Clear browser cache**: Ctrl+Shift+Delete
2. **Restart dev server**: Stop (Ctrl+C) and run `npm run dev`
3. **Try incognito mode**: Ctrl+Shift+N

---

## 📁 Files Created

1. ✅ `app/api/admin/force-update-membership/route.ts` - API endpoint
2. ✅ `EMERGENCY_FIX_VIA_API.md` - This guide
3. ✅ `STEP_BY_STEP_FIX_LOSTA.md` - Complete troubleshooting

---

## 🎉 Quick Copy-Paste Solution

**JUST RUN THIS IN BROWSER CONSOLE (F12):**

```javascript
fetch('http://localhost:3000/api/admin/force-update-membership', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'lostamasta.com@gmail.com',
    membership: 'vip_basic',
    days: 30
  })
})
.then(res => res.json())
.then(data => {
  console.log('Result:', data);
  if (data.success) {
    alert('✅ SUCCESS! User updated to VIP Basic. Now logout and login again.');
  } else {
    alert('❌ ERROR: ' + (data.error || 'Unknown error'));
  }
});
```

**Then**: User logout/login → Should work! 🎉

---

**This is the EASIEST way if Supabase SQL Editor is not accessible!**
