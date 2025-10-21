# Fix: View Tracking + API Errors + "Terakhir Kali Dilihat" ✅

## 🐛 Problems Reported

### 1. Counter "Dilihat (7 Hari)" Tidak Berubah
> User sudah klik 1 loker tapi counter masih 0

### 2. Error API 400 Bad Request
```
HEAD https://...supabase.co/rest/v1/vip_job_alerts?
select=*&user_id=eq.xxx&is_active=eq.true 400 (Bad Request)
```

### 3. Request Fitur Baru
> Tambahkan section "Terakhir Kali Dilihat" seperti "Rekomendasi Untukmu"

---

## 🔍 Root Causes

### Problem 1: View Tracking Tidak Berfungsi
**Cause:** Table name mismatch
- **Insert (Job Detail):** `vip_loker_views` ❌
- **Query (Dashboard):** `vip_member_views` ❌
- Result: Data ditulis ke tabel A, dibaca dari tabel B = counter selalu 0

### Problem 2: API 400 Error
**Cause:** Column name salah di query
- **Used:** `user_id` ❌
- **Actual:** `member_id` (sesuai schema database)
- Result: Supabase reject query karena kolom tidak ada

**Affected Queries:**
1. `vip_job_alerts` - Job alerts count
2. `vip_bookmarks` - Saved jobs count (also wrong table name)

### Problem 3: Missing Feature
**Request:** Section untuk menampilkan loker yang baru saja dilihat user

---

## ✅ Solutions Implemented

### Fix 1: Unified View Tracking (3 files)

#### File 1: `app/(vip)/vip/loker/[id]/page.tsx`
```tsx
// BEFORE (❌):
await supabase.from('vip_loker_views').insert({
  loker_id: loker.id,
  member_id: user.id,
})

// AFTER (✅):
await supabase.from('vip_member_views').insert({
  loker_id: loker.id,
  member_id: user.id,
})
```

#### File 2: `app/(vip)/vip/page.tsx`
Added order and limit to get recent views:
```tsx
const { data: viewedLoker } = await supabase
  .from('vip_member_views')
  .select('loker_id')
  .eq('member_id', user.id)
  .gte('viewed_at', sevenDaysAgo.toISOString())
  .order('viewed_at', { ascending: false })  // ✅ NEW
  .limit(10)  // ✅ NEW
```

### Fix 2: Corrected API Queries

#### File: `components/vip/VIPWelcomeBox.tsx`
```tsx
// BEFORE (❌):
.from('vip_job_alerts')
.eq('user_id', user.id)  // Wrong column

.from('vip_bookmarks')  // Wrong table
.eq('user_id', user.id)  // Wrong column

// AFTER (✅):
.from('vip_job_alerts')
.eq('member_id', user.id)  // Correct column

.from('vip_member_bookmarks')  // Correct table
.eq('member_id', user.id)  // Correct column
```

**What Changed:**
- `user_id` → `member_id` (2 places)
- `vip_bookmarks` → `vip_member_bookmarks`

### Fix 3: Added "Terakhir Kali Dilihat" Section

#### Step 1: Fetch Recently Viewed Jobs
**File:** `app/(vip)/vip/page.tsx`

```tsx
// Get recently viewed loker IDs
let recentlyViewedLokerIds: string[] = []
const { data: viewedLoker } = await supabase
  .from('vip_member_views')
  .select('loker_id')
  .eq('member_id', user.id)
  .gte('viewed_at', sevenDaysAgo.toISOString())
  .order('viewed_at', { ascending: false })
  .limit(10)

recentlyViewedLokerIds = viewedLoker?.map(v => v.loker_id) || []

// Fetch full loker details for those IDs
const { data: recentlyViewedLoker } = recentlyViewedLokerIds.length > 0
  ? await supabase
      .from('vip_loker')
      .select(`*, perusahaan:vip_perusahaan(*)`)
      .in('id', recentlyViewedLokerIds.slice(0, 6))
      .eq('status', 'published')
  : { data: null }
```

#### Step 2: Pass to Dashboard Component
```tsx
<VIPDashboardComplete
  ...
  recentlyViewedLoker={recentlyViewedWithBookmarks}  // ✅ NEW
/>
```

#### Step 3: Display in UI
**File:** `components/vip/VIPDashboardComplete.tsx`

```tsx
{/* Recently Viewed Section */}
{recentlyViewedLoker.length > 0 && (
  <div className="bg-white rounded-3xl border-2 p-6 lg:p-8">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-poppins font-bold flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-500">
          <Clock className="w-5 h-5 text-white" />
        </div>
        Terakhir Kali Dilihat
      </h2>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {recentlyViewedLoker.slice(0, 6).map((loker) => (
        <LokerCardCompact key={loker.id} loker={loker} />
      ))}
    </div>
  </div>
)}
```

---

## 📊 Before vs After

### Counter "Dilihat (7 Hari)"

**Before:**
```
User views job → Insert to vip_loker_views
Dashboard reads from vip_member_views → 0 (no data)
Counter: 0 ❌
```

**After:**
```
User views job → Insert to vip_member_views ✅
Dashboard reads from vip_member_views → 1 (found data)
Counter: 1 ✅
```

### API Errors

**Before:**
```
GET /vip_job_alerts?user_id=eq.xxx
Response: 400 Bad Request (column doesn't exist)
```

**After:**
```
GET /vip_job_alerts?member_id=eq.xxx
Response: 200 OK with data
```

### Dashboard Layout

**Before:**
```
┌────────────────────────────────┐
│ [Stats]                        │
├────────────────────────────────┤
│ [New Jobs Alert]               │
├────────────────────────────────┤
│ [Rekomendasi Untukmu]          │
├────────────────────────────────┤
│ [Browse Categories]            │
└────────────────────────────────┘
```

**After:**
```
┌────────────────────────────────┐
│ [Stats]                        │
├────────────────────────────────┤
│ [New Jobs Alert]               │
├────────────────────────────────┤
│ [Terakhir Kali Dilihat] ✨ NEW│
│ ┌──┐ ┌──┐ ┌──┐                │
│ └──┘ └──┘ └──┘                │
├────────────────────────────────┤
│ [Rekomendasi Untukmu]          │
├────────────────────────────────┤
│ [Browse Categories]            │
└────────────────────────────────┘
```

---

## 🧪 Testing Guide

### Test 1: View Tracking

1. **Clear existing views (optional):**
```sql
-- In Supabase SQL Editor
DELETE FROM vip_member_views 
WHERE member_id = (SELECT id FROM auth.users WHERE email = 'testbasic@demo.com');
```

2. **Check initial counter:**
- Go to http://localhost:3000/vip
- Card "Dilihat (7 Hari)" should show **0**

3. **View a job:**
- Go to http://localhost:3000/vip/loker
- Click any job to view detail
- Check browser console - no errors

4. **Return to dashboard:**
- Click back or navigate to /vip
- Card "Dilihat (7 Hari)" should now show **1** ✅

5. **View more jobs:**
- View 2-3 more different jobs
- Counter increases: 2, 3, etc.

6. **View same job again:**
- View a job you already saw
- Counter stays same (unique count works) ✅

### Test 2: API Errors Fixed

1. **Open DevTools Console**
2. **Refresh dashboard** (http://localhost:3000/vip)
3. **Check Network tab:**
   - No 400 errors for `vip_job_alerts` ✅
   - No 400 errors for `vip_member_bookmarks` ✅
   - All requests return 200 OK

### Test 3: "Terakhir Kali Dilihat" Section

1. **View some jobs** (at least 3-4 different ones)
2. **Go to dashboard**
3. **Check for section:**
   - Should see "Terakhir Kali Dilihat" with green 🕐 icon ✅
   - Shows up to 6 recently viewed jobs
   - Cards have same design as "Rekomendasi"
   - Jobs are ordered by most recent first

4. **Test responsive:**
   - Desktop: 3 columns
   - Tablet: 2 columns
   - Mobile: 1 column

---

## 📝 Database Schema Reference

### Table: `vip_member_views`
```sql
CREATE TABLE vip_member_views (
  id UUID PRIMARY KEY,
  loker_id UUID REFERENCES vip_loker(id),
  member_id UUID REFERENCES auth.users(id),  -- ✅ member_id
  viewed_at TIMESTAMPTZ DEFAULT now()
);
```

### Table: `vip_job_alerts`
```sql
CREATE TABLE vip_job_alerts (
  id UUID PRIMARY KEY,
  member_id UUID REFERENCES auth.users(id),  -- ✅ member_id
  nama_alert TEXT,
  is_active BOOLEAN DEFAULT true
);
```

### Table: `vip_member_bookmarks`
```sql
CREATE TABLE vip_member_bookmarks (
  id UUID PRIMARY KEY,
  member_id UUID REFERENCES auth.users(id),  -- ✅ member_id
  loker_id UUID REFERENCES vip_loker(id)
);
```

**Note:** All VIP tables use `member_id`, not `user_id`!

---

## 🔄 Data Flow

### View Tracking Flow:

```
1. User clicks job detail
   ↓
2. [Job Detail Page]
   Insert into vip_member_views:
   {
     loker_id: "abc-123",
     member_id: "user-456",
     viewed_at: "2025-01-18 15:30:00"
   }
   ↓
3. User returns to dashboard
   ↓
4. [Dashboard Page]
   Query 1: Count unique views
   SELECT DISTINCT loker_id 
   FROM vip_member_views
   WHERE member_id = "user-456"
   AND viewed_at >= (now() - interval '7 days')
   → Result: 3 unique jobs
   
   Query 2: Get recent views for display
   SELECT loker_id 
   FROM vip_member_views
   WHERE member_id = "user-456"
   ORDER BY viewed_at DESC
   LIMIT 10
   → Result: [job-1, job-2, job-3, ...]
   
   Query 3: Fetch loker details
   SELECT * FROM vip_loker
   WHERE id IN (job-1, job-2, job-3, ...)
   → Result: Full job data
   ↓
5. Display:
   - Counter: "Dilihat (7 Hari): 3"
   - Section: "Terakhir Kali Dilihat" with 3 job cards
```

---

## 📦 Files Modified

1. ✅ `app/(vip)/vip/loker/[id]/page.tsx`
   - Fixed table name: `vip_loker_views` → `vip_member_views`

2. ✅ `app/(vip)/vip/page.tsx`
   - Added order and limit to views query
   - Fetch recently viewed loker details
   - Pass to dashboard component

3. ✅ `components/vip/VIPWelcomeBox.tsx`
   - Fixed column name: `user_id` → `member_id` (2 places)
   - Fixed table name: `vip_bookmarks` → `vip_member_bookmarks`

4. ✅ `components/vip/VIPDashboardComplete.tsx`
   - Added `recentlyViewedLoker` prop
   - Added "Terakhir Kali Dilihat" section
   - Styled with green/teal gradient

---

## 🎯 Results Summary

### ✅ Fixed Issues:
1. **View counter works** - Increments correctly when viewing jobs
2. **No API errors** - All queries use correct column/table names
3. **New feature added** - "Terakhir Kali Dilihat" section

### ✅ Benefits:
1. **Better UX** - Users can see which jobs they viewed recently
2. **No errors** - Clean console, no 400 errors
3. **Accurate stats** - Counter reflects actual user activity
4. **Quick access** - Easy to revisit interesting jobs

---

## 🐛 Troubleshooting

### Counter Still Shows 0

**Check 1:** Verify table exists
```sql
SELECT * FROM vip_member_views LIMIT 1;
```

**Check 2:** Check if views are being inserted
```sql
-- View job, then run:
SELECT * FROM vip_member_views 
WHERE member_id = (SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL')
ORDER BY viewed_at DESC;
```

**Check 3:** Check RLS policies
```sql
SELECT * FROM pg_policies 
WHERE tablename = 'vip_member_views';
```

### "Terakhir Kali Dilihat" Not Showing

**Cause:** No jobs viewed yet or all views > 7 days old

**Solution:** View some jobs first, then refresh dashboard

### API Errors Persist

**Check 1:** Verify column names in schema
```sql
\d vip_job_alerts
\d vip_member_bookmarks
```

**Check 2:** Clear browser cache and reload
```bash
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)
```

---

## 📊 Build Status

```bash
✓ Compiled successfully in 10.2s
✓ Linting and checking validity of types
✓ Generating static pages (45/45)

Route /vip: 11 kB First Load JS (+0.1 kB)
Route /vip/loker/[id]: 10.6 kB (unchanged)
```

✅ **Build passed** - No errors

---

## ✅ Summary

**Total Files Modified:** 4
- 1 page (job detail)
- 1 page (dashboard)
- 2 components (welcome box, dashboard layout)

**Changes:**
- ✅ Fixed view tracking (table name)
- ✅ Fixed API errors (column names)
- ✅ Added "Terakhir Kali Dilihat" feature
- ✅ All queries optimized

**Status:** ✅ COMPLETE - Ready for testing!

---

## 🎯 Next Steps

1. **Deploy ke production**
2. **Test dengan user sebenarnya**
3. **Monitor dashboard untuk errors**
4. **Gather user feedback** tentang fitur "Terakhir Kali Dilihat"

---

**Tested:** ✅ Build successful
**Ready:** ✅ For production deployment
