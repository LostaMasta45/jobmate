# ✅ FIXED: Status CHECK Constraint Error

## ❌ Error

```
Error code: 23514
new row for relation "vip_loker" violates check constraint "vip_loker_status_check"
```

**Cause:** API trying to insert `status: 'active'` but database schema only allows:
- `'draft'`
- `'published'`
- `'expired'`
- `'archived'`

---

## ✅ SOLUTION

### Changed Status Value:

**Before:**
```typescript
status: 'active'  // ❌ Not in allowed values!
```

**After:**
```typescript
status: 'published'  // ✅ Valid value
```

---

## 🔧 Files Fixed

### 1. API Endpoint
**File:** `app/api/admin/vip/loker/route.ts`

```typescript
status: 'published', // Changed from 'active'
```

### 2. Admin List Page
**File:** `app/(admin)/admin/vip-loker/page.tsx`

```typescript
// Stats card
{lokerList?.filter(l => l.status === 'published').length || 0}

// Badge styling
className={loker.status === 'published' ? 'bg-green-50...' : 'bg-gray-50...'}
```

### 3. Quick Setup SQL
**File:** `db/quick-setup-vip-tables.sql`

```sql
-- Updated to match vip-schema-complete.sql
status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'expired', 'archived'))

-- Updated policy
USING (status = 'published')
```

---

## 📊 Status Values Explained

### Valid Status Values:

| Status | Meaning | When to Use |
|--------|---------|-------------|
| `draft` | Draft, not published yet | Admin still editing |
| `published` | Published & visible to users | Default for saved loker |
| `expired` | Deadline passed | Auto-set after deadline |
| `archived` | Archived, not shown | Manually archived |

### Default When Admin Saves:
```typescript
status: 'published'  // Immediately visible to VIP members
```

---

## 🧪 TEST NOW

### 1. Upload Poster

```
http://localhost:3000/admin/vip-loker/tambah
```

### 2. Save Loker

Click "Simpan Loker"

**Expected Console:**
```
[API] Inserting loker: {
  ...
  "status": "published",  ← Should be 'published'
  ...
}

POST /api/admin/vip/loker 200 ✅
```

**Expected Browser:**
- ✅ "Loker berhasil disimpan!"
- ✅ Redirect to list
- ✅ NO database error!

### 3. Check List

```
http://localhost:3000/admin/vip-loker
```

**Expected:**
- ✅ See your loker in list
- ✅ Badge shows: "published" (green)
- ✅ Stats show: "Published: 1"

---

## 🎯 Complete Data Flow

```
1. User uploads poster
   ↓
2. AI extracts data
   ↓
3. Form auto-fills
   ↓
4. User reviews & edits
   ↓
5. Click "Simpan Loker"
   ↓
6. API receives data
   ↓
7. Check/create perusahaan ✅
   ↓
8. Insert loker with:
   - title ✅
   - perusahaan_name ✅
   - status: 'published' ✅
   ↓
9. Success! Loker saved ✅
   ↓
10. Redirect to list
   ↓
11. Loker visible with "published" badge ✅
```

---

## 📝 Summary

**Error:** CHECK constraint violation on status column

**Root Cause:** Schema mismatch
- Schema expects: `'draft', 'published', 'expired', 'archived'`
- API was sending: `'active'`

**Solution:**
1. ✅ Changed API status to `'published'`
2. ✅ Updated list page filters
3. ✅ Updated quick-setup SQL
4. ✅ Aligned all status values

**Files Changed:**
- `app/api/admin/vip/loker/route.ts`
- `app/(admin)/admin/vip-loker/page.tsx`
- `db/quick-setup-vip-tables.sql`

**Status:** FIXED ✅

**Test:** Upload poster & save - Should work now! 🚀

---

## ✅ Verification Checklist

- [ ] Upload poster works
- [ ] AI parsing works
- [ ] Form auto-fills
- [ ] Click "Simpan Loker"
- [ ] No database error
- [ ] Success toast appears
- [ ] Redirect to list
- [ ] Loker appears in list
- [ ] Status badge shows "published" (green)
- [ ] Stats show correct count

---

**Ready to test!** 🎉
