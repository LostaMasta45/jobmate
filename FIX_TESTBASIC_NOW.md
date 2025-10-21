# 🚨 FIX TESTBASIC USER - DUAL COLUMN ISSUE

## 🐛 Problem Found!

Database memiliki **2 kolom membership berbeda**:

```sql
-- Kolom LAMA (legacy)
membership_tier: 'basic'         ← Masih old value
membership_expires_at: [date]

-- Kolom BARU
membership: 'vip_premium'        ← Updated correctly
membership_expiry: null
```

**Root Cause:**
- API hanya update kolom `membership` (baru)
- Tapi `membership_tier` (lama) masih `'basic'`
- Middleware query kolom `membership` → dapat value lama dari cache/RLS

## ✅ Solusi - API Sudah Diperbaiki!

API sekarang update **BOTH** kolom legacy DAN baru:

```typescript
// Update data:
{
  membership: 'vip_premium',          // New
  membership_tier: 'premium',         // Legacy (mapped)
  membership_status: 'active',
  membership_expiry: null,            // New
  membership_expires_at: null,        // Legacy
}
```

---

## 🚀 CARA FIX SEKARANG:

### Step 1: Restart Dev Server

**IMPORTANT:** Restart server agar API update diload!

```bash
# Stop server (Ctrl+C)
# Then start again:
npm run dev
```

### Step 2: Run Script di Browser Console

1. **Buka:** http://localhost:3001
2. **Press:** F12 → tab Console
3. **Copy & Paste script** dari file `FIX_NOW_BROWSER_CONSOLE.md`
4. **Press Enter**

Script akan:
- ✅ Check status sebelum update (show BOTH columns)
- ✅ Update membership with BOTH new + legacy columns
- ✅ Verify after update

### Step 3: Verify Update Berhasil

Check console output untuk verify BOTH columns updated:

**Expected output:**
```
📋 Checking testbasic@example.com...
Current Status:
  - membership: vip_premium       ✅
  - membership_tier: premium      ✅
  - membership_status: active     ✅
  - membership_expiry: null       ✅
  - membership_expires_at: null   ✅
```

### Step 4: User LOGOUT & LOGIN

**CRITICAL:**
```
User testbasic HARUS logout dan login ulang!
Tanpa ini, session JWT masih lama.
```

Instruksi:
1. ✅ Logout dari aplikasi
2. ⏱️  Tunggu 2 detik
3. 🔐 Login dengan: `testbasic@example.com` / password
4. ✨ Sekarang akses `/vip` berhasil!

---

## 🔍 Verify di Middleware Log

Setelah user login ulang, check terminal logs:

**Expected:**
```
[MIDDLEWARE] User: testbasic@example.com
[MIDDLEWARE] Membership: vip_premium      ✅ (bukan "free" lagi!)
[MIDDLEWARE] Membership Status: active
[MIDDLEWARE] Path: /vip
[MIDDLEWARE] VIP Premium access granted   ✅
```

---

## 🎯 Alternative: Manual SQL Fix (If API Still Fails)

If API masih gagal, run SQL langsung di Supabase:

```sql
-- Update testbasic user
UPDATE profiles
SET 
  membership = 'vip_premium',
  membership_tier = 'premium',
  membership_status = 'active',
  membership_expiry = NULL,
  membership_expires_at = NULL,
  updated_at = NOW()
WHERE email = 'testbasic@example.com';

-- Verify
SELECT 
  email,
  membership,
  membership_tier,
  membership_status,
  membership_expiry,
  membership_expires_at
FROM profiles
WHERE email = 'testbasic@example.com';
```

Expected result:
```
| email                  | membership   | membership_tier | status | expiry | expires_at |
|------------------------|--------------|-----------------|--------|--------|------------|
| testbasic@example.com  | vip_premium  | premium         | active | null   | null       |
```

---

## 📋 Quick Commands (Browser Console)

### Check Status Only:
```javascript
checkUser('testbasic@example.com')
```

### Fix Single User:
```javascript
fixSingle('testbasic@example.com', 'vip_premium')
```

### Fix All Users:
```javascript
fixAll()
```

---

## 🚨 If Still "free" After All Steps

### Debug Checklist:

1. ✅ **Verify database updated:**
   ```javascript
   checkUser('testbasic@example.com')
   // Should show: membership: vip_premium
   ```

2. ✅ **User sudah logout-login?**
   - Jika belum → Tell them to logout NOW
   - Jika sudah → Try login 2x (normal behavior)

3. ✅ **Clear browser cache:**
   ```javascript
   localStorage.clear();
   sessionStorage.clear();
   ```
   Then: Ctrl+Shift+R (hard refresh)

4. ✅ **Restart dev server:**
   ```bash
   # Terminal
   Ctrl+C
   npm run dev
   ```

5. ✅ **Check RLS policies:**
   - Maybe RLS blocking the query?
   - Try disable RLS temporarily:
   ```sql
   ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
   -- Test access
   -- Then enable again:
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   ```

---

## 📊 Summary

| Issue | Root Cause | Solution |
|-------|-----------|----------|
| Middleware baca "free" | Dual column inconsistency | Update BOTH columns |
| API hanya update `membership` | Legacy column ignored | Now updates `membership_tier` too |
| User harus login 2x | JWT token cache | Logout → Login (expected) |

**Key Fix:**
🔥 **API now updates BOTH `membership` (new) AND `membership_tier` (legacy)** 🔥

---

**Status:** ✅ API Fixed + Script Updated  
**Action Required:** Restart dev server → Run script → User logout/login
