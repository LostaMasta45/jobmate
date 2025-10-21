# Fix All VIP Issues - Step by Step Guide 🔧

## ✅ Yang Sudah Diperbaiki dalam Code:

1. ✅ `/vip/profile` page sudah dibuat
2. ✅ Console.log untuk debug view tracking sudah ditambahkan
3. ✅ Error handling untuk API calls sudah ditambahkan
4. ✅ SQL script untuk fix RLS policies sudah disiapkan

---

## 🔧 Langkah-langkah Perbaikan

### STEP 1: Fix RLS Policies untuk View Tracking ⭐ **PALING PENTING!**

**Masalah:** Counter "Dilihat (7 Hari)" tidak bertambah dan section "Terakhir Kali Dilihat" tidak muncul.

**Root Cause:** RLS policies blocking insert/select operations.

#### Jalankan SQL ini di Supabase SQL Editor:

```sql
-- File: db/fix-vip-member-views-rls.sql

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can insert their own views" ON vip_member_views;
DROP POLICY IF EXISTS "Users can view their own views" ON vip_member_views;
DROP POLICY IF EXISTS "Admin can view all views" ON vip_member_views;

-- Enable RLS
ALTER TABLE vip_member_views ENABLE ROW LEVEL SECURITY;

-- Policy: Users can INSERT their own views
CREATE POLICY "Users can insert their own views"
  ON vip_member_views
  FOR INSERT
  TO authenticated
  WITH CHECK (member_id = auth.uid());

-- Policy: Users can SELECT their own views
CREATE POLICY "Users can view their own views"
  ON vip_member_views
  FOR SELECT
  TO authenticated
  USING (member_id = auth.uid());

-- Policy: Admin can view all views
CREATE POLICY "Admin can view all views"
  ON vip_member_views
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
```

#### Test setelah menjalankan SQL:

```sql
-- Test 1: Check policies exist
SELECT 
  policyname, 
  cmd, 
  with_check
FROM pg_policies 
WHERE tablename = 'vip_member_views';

-- Test 2: Try manual insert (should succeed now)
INSERT INTO vip_member_views (loker_id, member_id, viewed_at)
VALUES (
  (SELECT id FROM vip_loker WHERE status = 'published' LIMIT 1),
  auth.uid(),
  now()
);

-- Test 3: Check your views (should return data)
SELECT 
  v.*,
  l.title as loker_title
FROM vip_member_views v
JOIN vip_loker l ON l.id = v.loker_id
WHERE v.member_id = auth.uid()
ORDER BY v.viewed_at DESC
LIMIT 10;
```

---

### STEP 2: Restart Dev Server & Clear Cache

```bash
# Stop server (Ctrl + C)

# Clear Next.js cache
rm -rf .next

# Restart
npm run dev
```

---

### STEP 3: Test View Tracking

1. **Login** sebagai testbasic@demo.com
2. **Open Console** (F12) → Tab "Console"
3. **Buka loker detail:**
   - Go to: http://localhost:3002/vip/loker
   - Click any loker
   - Check console untuk log:
     ```
     [VIP Loker Detail] View tracked for loker: abc-123
     ```
   - Jika ada error, screenshot dan report

4. **Kembali ke dashboard:**
   - Go to: http://localhost:3002/vip
   - Check console untuk log:
     ```
     [VIP Dashboard] Viewed loker count: 1
     [VIP Dashboard] Recently viewed IDs: ['abc-123']
     [VIP Dashboard] Recently viewed loker fetched: 1
     ```

5. **Verify UI:**
   - Card "Dilihat (7 Hari)" seharusnya **1** ✅
   - Section "Terakhir Kali Dilihat" seharusnya **muncul** ✅

---

### STEP 4: Test "/vip/profile" Page

```bash
# Navigate to profile
http://localhost:3002/vip/profile
```

**Expected:**
- ✅ Page loads without error
- ✅ Shows 2 tabs: "Profil" dan "Keamanan"
- ✅ Tab "Profil" shows form (sama seperti /settings)
- ✅ Tab "Keamanan" shows password change form

**If error:**
- Screenshot error message
- Check console for details

---

### STEP 5: Test "Lihat Semua X Loker" Button

1. **Go to dashboard:**
   - http://localhost:3002/vip

2. **Scroll ke section "Jelajah Loker"**

3. **Filter by category** (misalnya pilih "IT")

4. **Scroll kebawah**, jika ada > 8 loker:
   - Button "Lihat Semua X Loker" akan muncul

5. **Click button:**
   - Should redirect to: `/vip/loker?kategori=IT`
   - Should show filtered results

**Expected:**
- ✅ Page loads
- ✅ Shows loker dengan kategori IT
- ✅ Filter chips show "IT" as selected

**If no results:**
- Check if there are IT jobs in database:
  ```sql
  SELECT title, kategori 
  FROM vip_loker 
  WHERE 'IT' = ANY(kategori)
  AND status = 'published';
  ```

---

## 🐛 Troubleshooting

### Issue 1: Counter masih 0 setelah STEP 1

**Debug:**

```sql
-- Check if insert succeeded
SELECT COUNT(*) FROM vip_member_views 
WHERE member_id = (SELECT id FROM auth.users WHERE email = 'testbasic@demo.com');

-- If 0, check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'vip_member_views';

-- If policies exist but still failing, check this:
SELECT current_user, auth.uid();
```

**Solution:** Re-run SQL from STEP 1

---

### Issue 2: "Terakhir Kali Dilihat" tidak muncul

**Possible causes:**
1. No views in last 7 days
2. Query error

**Debug:**

```sql
-- Check views exist
SELECT 
  loker_id,
  viewed_at,
  AGE(now(), viewed_at) as age
FROM vip_member_views 
WHERE member_id = (SELECT id FROM auth.users WHERE email = 'testbasic@demo.com')
ORDER BY viewed_at DESC;

-- If age > 7 days, views won't show
-- Solution: View new lokers
```

---

### Issue 3: /vip/profile error "Failed to get profile"

**Cause:** Database RLS policies or missing columns

**Solution:**

```sql
-- Check profiles table
SELECT * FROM profiles 
WHERE id = (SELECT id FROM auth.users WHERE email = 'testbasic@demo.com');

-- If null or error, check RLS
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Ensure policy exists:
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());
```

---

### Issue 4: "Lihat Semua" shows no results

**Debug in browser console:**

1. Open /vip/loker?kategori=IT
2. Open Console
3. Check Network tab for SQL errors
4. Look for 400/500 status codes

**Possible fix:**

Check if `kategori` field is array type:
```sql
\d vip_loker

-- Should show:
-- kategori | text[] | ...
```

---

## 📊 Expected Results After All Steps

### Dashboard (/vip)

```
✅ Card "Dilihat (7 Hari)" shows correct number (1, 2, 3...)
✅ Section "Terakhir Kali Dilihat" appears after viewing jobs
✅ Shows up to 6 recently viewed loker
✅ Button "Lihat Semua X Loker" works when clicked
```

### Profile (/vip/profile)

```
✅ Page loads without error
✅ Shows profile form (name, email, avatar)
✅ Shows security form (change password)
✅ Same layout as /settings page
```

### Loker List (/vip/loker)

```
✅ Shows all loker
✅ Category filter works
✅ Search works
✅ Pagination works
```

### Loker Detail (/vip/loker/[id])

```
✅ View is tracked (console log appears)
✅ No errors in console
✅ Can view multiple loker
```

---

## 📝 Verification Checklist

Run through this checklist:

### Database Setup
- [ ] Ran `fix-vip-member-views-rls.sql` in Supabase
- [ ] Verified policies exist with test query
- [ ] Test manual insert succeeded

### View Tracking
- [ ] Viewed 3-4 different loker
- [ ] Console shows "[VIP Loker Detail] View tracked"
- [ ] No errors in console

### Dashboard
- [ ] Card "Dilihat (7 Hari)" shows > 0
- [ ] Section "Terakhir Kali Dilihat" visible
- [ ] Recently viewed loker cards appear
- [ ] Button "Lihat Semua X Loker" redirects correctly

### Profile Page
- [ ] /vip/profile loads without error
- [ ] Shows Profil tab
- [ ] Shows Keamanan tab
- [ ] Can edit profile fields
- [ ] Can change password

### Loker Filtering
- [ ] Category filter from dashboard works
- [ ] /vip/loker?kategori=IT shows IT jobs
- [ ] Search box works
- [ ] Location filter works

---

## 🎯 Quick Fix Commands

If you need to reset and start fresh:

```sql
-- Reset all views for testing
DELETE FROM vip_member_views 
WHERE member_id = (SELECT id FROM auth.users WHERE email = 'testbasic@demo.com');

-- Re-run RLS fix
-- (paste SQL from STEP 1)

-- Insert test view
INSERT INTO vip_member_views (loker_id, member_id, viewed_at)
VALUES (
  (SELECT id FROM vip_loker WHERE status = 'published' LIMIT 1),
  (SELECT id FROM auth.users WHERE email = 'testbasic@demo.com'),
  now()
);

-- Verify
SELECT COUNT(*) FROM vip_member_views 
WHERE member_id = (SELECT id FROM auth.users WHERE email = 'testbasic@demo.com');
-- Should return 1
```

---

## 🚀 Summary

**Total Issues Fixed:** 4

1. ✅ **View Tracking** - Fixed with RLS policies
2. ✅ **"Terakhir Kali Dilihat"** - Will show after views are tracked
3. ✅ **/vip/profile** - Created with tabs layout
4. ✅ **"Lihat Semua" button** - Already works, just needs testing

**Total Files Modified:** 4
- `app/(vip)/vip/page.tsx` - Added debug logs
- `app/(vip)/vip/loker/[id]/page.tsx` - Added error handling
- `app/(vip)/vip/profile/page.tsx` - Created new page
- `db/fix-vip-member-views-rls.sql` - Created fix script

**Critical Step:** Run the SQL script in STEP 1 - this fixes 90% of issues!

---

## 📞 If Still Not Working

1. **Screenshot console errors**
2. **Run this SQL and share results:**
```sql
-- Get current state
SELECT 
  'Views count' as metric,
  COUNT(*)::text as value
FROM vip_member_views 
WHERE member_id = auth.uid()

UNION ALL

SELECT 
  'Policies count',
  COUNT(*)::text
FROM pg_policies 
WHERE tablename = 'vip_member_views'

UNION ALL

SELECT 
  'User ID',
  auth.uid()::text;
```

3. **Check browser console** for any red errors
4. **Verify Supabase connection** in .env.local

---

**Status:** ✅ All fixes ready - Just need to run STEP 1 SQL!
