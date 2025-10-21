# FIX: Login Still Redirects to /dashboard

## 🐛 Problem
User `testbasic@example.com` login tapi masih masuk ke `/dashboard` (JobMate) bukan `/vip` (VIP Career).

## 🔍 Root Cause
Ada 2 kemungkinan:
1. **SQL INSERT failed** (duplicate key error) → user sudah ada, perlu UPDATE
2. **Middleware cache issue** → role/membership ter-cache di cookie

## ✅ Solution

### Step 1: UPDATE User (Bukan INSERT!)

Run SQL ini di Supabase SQL Editor:

```sql
-- UPDATE existing user
UPDATE profiles
SET 
  membership_tier = 'basic',
  membership_status = 'active',
  membership_started_at = NOW(),
  membership_expires_at = NOW() + INTERVAL '30 days'
WHERE email = 'testbasic@example.com';

-- Verify
SELECT email, membership_tier, membership_status
FROM profiles
WHERE email = 'testbasic@example.com';
```

**Expected Result:**
- `membership_tier` = `basic` ✅
- `membership_status` = `active` ✅

---

### Step 2: Clear Middleware Cookie Cache

**Problem:** Middleware cache role/membership di cookie `user_role` untuk 1 jam.

**Solution: Clear cookies completely**

**Option A: Via Browser DevTools (Recommended)**
1. Press `F12` (open DevTools)
2. Go to **"Application"** tab
3. Sidebar kiri → **"Cookies"** → `http://localhost:3000`
4. Find dan delete cookies:
   - `user_role` ← ini yang penting!
   - Semua yang ada kata `supabase` atau `sb-`
5. **Refresh page** (F5)

**Option B: Clear All Site Data**
1. Press `F12`
2. Go to **"Application"** tab
3. Click **"Clear site data"** button (di atas)
4. Check all boxes
5. Click "Clear site data"
6. Close browser completely
7. Reopen browser

**Option C: Incognito Window (Easiest!)**
1. Close current browser
2. Open **new Incognito window**: `Ctrl+Shift+N` (Chrome) atau `Ctrl+Shift+P` (Firefox)
3. Go to `localhost:3000/sign-in`
4. Login dengan `testbasic@example.com`
5. Should redirect ke `/vip` ✅

---

### Step 3: Logout Properly

Sebelum login lagi, pastikan logout dulu:

1. Di browser, click tombol **Logout** di sidebar
2. Atau manual go to: `localhost:3000/sign-in`
3. Pastikan benar-benar logout (tidak auto-login)

---

### Step 4: Login Lagi

1. Go to: `localhost:3000/sign-in`
2. Login:
   - Email: `testbasic@example.com`
   - Password: `password123` (atau password yang kamu set)
3. After login, should redirect ke `/vip` ✅

---

## 🎯 Expected Result

After login, you should see:

```
URL: localhost:3000/vip

┌──────────────────┬─────────────────────────────────────┐
│ Career VIP       │ Selamat Datang, testbasic! 👋       │
│ Jombang          │                                     │
│                  │ [Blue gradient welcome banner]      │
│ [Badge: Basic]   ├─────────────────────────────────────┤
│                  │ Stats Cards                         │
│ Menu:            │ Total Loker | Perusahaan | Saved   │
│ • Dashboard      ├─────────────────────────────────────┤
│ • Cari Loker     │ Loker Terbaru        [Lihat Semua] │
│ • Perusahaan     │                                     │
│ • Tersimpan      │ [Loker Card] [Loker Card] [Card]   │
│ • Job Alerts     │                                     │
│                  │ Quick Actions                       │
│ [Upgrade CTA]    │ [Cari] [Perusahaan] [Alerts]       │
└──────────────────┴─────────────────────────────────────┘
```

**NOT THIS:**
```
URL: localhost:3000/dashboard

JOBMATE Dashboard (existing)
```

---

## 🔧 Debug: Check Middleware Logic

Jika masih tidak work, kita bisa add console.log untuk debug:

**Edit file: `middleware.ts`**

Add logging setelah line 10:

```typescript
if (user && !userRole) {
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, membership_tier, membership_status, membership_expires_at")
      .eq("id", user.id)
      .single();
    
    userRole = profile?.role;
    membershipTier = profile?.membership_tier;
    membershipStatus = profile?.membership_status;
    membershipExpiresAt = profile?.membership_expires_at;
    
    // ADD THIS DEBUG LOG:
    console.log('[MIDDLEWARE DEBUG]', {
      email: user.email,
      role: userRole,
      tier: membershipTier,
      status: membershipStatus
    });
```

Kemudian:
1. Save file
2. Check terminal output saat login
3. Should see log with `tier: 'basic'`

---

## 🚨 If Still Not Working

Try this manual redirect:

1. After login, manually go to: `localhost:3000/vip`
2. What happens?
   - **Case A:** Shows VIP dashboard ✅ → redirect logic issue
   - **Case B:** Redirects back to `/dashboard` ❌ → membership check failing
   - **Case C:** Error page → database/RLS issue

**If Case B:** Run this to verify data:

```sql
SELECT 
  u.email,
  p.role,
  p.membership_tier,
  p.membership_status,
  p.membership_expires_at,
  (p.membership_status = 'active') as is_active,
  (p.membership_expires_at IS NULL OR p.membership_expires_at > NOW()) as not_expired
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
WHERE u.email = 'testbasic@example.com';
```

Expected:
- `membership_tier` = `basic`
- `is_active` = `true`
- `not_expired` = `true`

---

## 📋 Quick Checklist

Do in order:

- [ ] 1. Run UPDATE SQL (not INSERT)
- [ ] 2. Verify `membership_tier = 'basic'` in database
- [ ] 3. Clear browser cookies (especially `user_role`)
- [ ] 4. Logout properly
- [ ] 5. Close & reopen browser (or use Incognito)
- [ ] 6. Login again
- [ ] 7. Should redirect to `/vip` ✅

---

## 💡 Why This Happens

**Middleware caches role/membership in cookie for 1 hour** to avoid repeated DB queries:

```typescript
// In middleware.ts line ~28
supabaseResponse.cookies.set('user_role', userRole, {
  maxAge: 3600, // 1 hour cache ← THIS!
  httpOnly: true,
  sameSite: 'lax',
  path: '/'
});
```

So even after updating database, middleware still uses old cached value until:
1. Cookie expires (1 hour)
2. You clear cookies manually ✅
3. You use incognito window ✅

**Next time:** After database changes, always clear cookies!

---

## 🎉 After Success

Once you see VIP dashboard:
1. Take screenshot
2. Confirm dengan saya
3. We continue Phase 2: Create loker list, detail pages, etc.

Let's fix this! 🚀
