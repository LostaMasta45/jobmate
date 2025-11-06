# Fix User Session Tracking - Step by Step

## Problem
User sessions tidak terdeteksi di real-time monitor, hanya admin yang terdeteksi.

## Root Cause
RLS policies terlalu restrictive atau error tidak terlihat karena sudah di-silence.

## Solution - Ikuti Langkah Ini:

### Step 1: Aktifkan Error Logging (SUDAH SELESAI)
✅ File `lib/monitoring/activity-tracker.ts` sudah diupdate untuk menampilkan error dengan jelas.

### Step 2: Restart Dev Server
```bash
# Stop current dev server (Ctrl+C)
npm run dev
```

### Step 3: Login sebagai User Biasa
1. Buka browser
2. Login sebagai user biasa (bukan admin)
3. Buka Developer Console (F12)
4. Lihat pesan error yang muncul

### Step 4: Lihat Error Message
Cari salah satu dari pesan ini:

#### Jika Melihat: `📋 Table Missing - Run: db/setup-realtime-monitoring.sql`
**Masalah**: Tables belum dibuat

**Solusi**:
```sql
-- Run this in Supabase SQL Editor:
-- File: db/setup-realtime-monitoring.sql
```

#### Jika Melihat: `🔒 RLS Policy Error - Run: db/fix-session-tracking-rls.sql`
**Masalah**: RLS policy memblokir user biasa

**Solusi**:
```sql
-- Run this in Supabase SQL Editor:
-- File: db/fix-user-session-tracking-complete.sql (NEW FILE!)
```

#### Jika Melihat: `⚠️ Empty error object`
**Masalah**: Error tidak jelas

**Solusi**: Lanjut ke Step 5

### Step 5: Run SQL Fix Script
1. Buka Supabase Dashboard
2. Pergi ke SQL Editor
3. Copy paste isi file: `db/fix-user-session-tracking-complete.sql`
4. Run query
5. Lihat output - harus ada pesan ✅

### Step 6: Verify Fix
Setelah run SQL script, run query ini untuk cek policies:

```sql
-- Check policies
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd as operation
FROM pg_policies
WHERE tablename IN ('user_sessions', 'page_views', 'user_events')
ORDER BY tablename, cmd, policyname;
```

Harus ada policies seperti:
- ✅ `authenticated_can_insert_sessions` - INSERT
- ✅ `authenticated_can_update_sessions` - UPDATE
- ✅ `admin_can_view_all_sessions` - SELECT
- ✅ `users_can_view_own_sessions` - SELECT

### Step 7: Test User Session
1. Refresh browser (atau logout/login lagi)
2. Cek console - harus muncul: `[Activity Tracker] ✅ Session started`
3. Run query di Supabase:

```sql
SELECT 
  id,
  user_id,
  email,
  full_name,
  membership,
  current_page,
  device_type,
  browser,
  is_active,
  created_at
FROM user_sessions
WHERE is_active = true
ORDER BY created_at DESC
LIMIT 10;
```

4. Harus melihat session user yang baru login!

### Step 8: Test Real-time Monitor
1. Login sebagai admin
2. Pergi ke `/admin/observability/realtime`
3. Buka tab baru, login sebagai user biasa
4. Refresh halaman real-time monitor
5. Harus melihat user session baru muncul!

## Troubleshooting

### Masih Tidak Muncul?

#### 1. Check Supabase API Keys
```bash
# File: .env.local
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

#### 2. Check RLS Status
```sql
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename IN ('user_sessions', 'page_views', 'user_events');
```

Semua harus `true`.

#### 3. Manual Test Insert
Login sebagai user biasa, lalu run di browser console:

```javascript
// Test insert session manually
const supabase = createClient()
const { data, error } = await supabase
  .from('user_sessions')
  .insert({
    session_id: 'test_' + Date.now(),
    current_page: '/dashboard',
    user_agent: navigator.userAgent,
    device_type: 'desktop',
    browser: 'Chrome',
    os: 'Windows',
    is_active: true
  })
  .select()

console.log('Insert result:', { data, error })
```

**Expected**: `data` berisi session yang baru dibuat, `error` null.

**If error**: Copy error message dan run SQL fix lagi.

#### 4. Check JWT Claims
```javascript
// Run in browser console as user
const supabase = createClient()
const { data: { user } } = await supabase.auth.getUser()
console.log('User:', user)
```

Harus return user object dengan `id`, `email`, dll.

## Files Modified
1. ✅ `lib/monitoring/activity-tracker.ts` - Enhanced error logging
2. ✅ `db/fix-user-session-tracking-complete.sql` - Comprehensive RLS fix

## Quick Test Commands

### 1. Test as User (Browser Console)
```javascript
// After login as regular user
console.log('Testing session tracking...')
```

### 2. Check Sessions (Supabase SQL)
```sql
SELECT * FROM user_sessions 
WHERE is_active = true 
ORDER BY created_at DESC;
```

### 3. Check Real-time (Admin Dashboard)
```
Navigate to: /admin/observability/realtime
Should see active users
```

---

## Expected Result
✅ User sessions terdeteksi di real-time monitor  
✅ Admin bisa melihat semua active users  
✅ User bisa melihat session mereka sendiri  
✅ No more console errors

## Next Step
Restart dev server, login sebagai user biasa, dan check browser console untuk error message!
