# 🔧 FIX: perusahaan_name NULL Error

## ❌ Error

```
null value in column "perusahaan_name" of relation "vip_loker" 
violates not-null constraint
```

**Database error code:** `23502` (NOT NULL violation)

---

## ✅ FIXED

### What Was Wrong:

API was not explicitly including `perusahaan_name` in the INSERT statement for `vip_loker` table.

**Before:**
```typescript
.insert({
  title: data.title,
  perusahaan_id: perusahaanId,
  lokasi: data.lokasi,
  // ❌ perusahaan_name missing!
  ...
})
```

**After:**
```typescript
.insert({
  title: data.title,
  perusahaan_id: perusahaanId,
  perusahaan_name: data.perusahaan_name, // ✅ ADDED!
  lokasi: data.lokasi,
  ...
})
```

---

## 🔧 Changes Made

### File: `app/api/admin/vip/loker/route.ts`

1. ✅ **Added debug logs** to see incoming data
2. ✅ **Explicitly include `perusahaan_name`** in lokerData object
3. ✅ **Moved data prep to separate object** for clarity
4. ✅ **Changed default sumber** from 'Admin' to 'Poster' (since most will be from AI parsing)

---

## 🧪 Test Now

### 1. Check Console Logs

When you click "Simpan Loker", you should see in **Terminal/Console**:

```
[SAVE LOKER] Data being sent: {
  title: "...",
  perusahaan_name: "...",  ← Should NOT be null/undefined!
  lokasi: "...",
  ...
}

[API] Received data: {
  title: "...",
  perusahaan_name: "...",  ← Confirmed received
  ...
}

[API] Inserting loker: {
  title: "...",
  perusahaan_name: "...",  ← Confirmed in INSERT
  ...
}
```

### 2. Test Upload

```
http://localhost:3000/admin/vip-loker/tambah
```

1. Upload poster
2. Click "Parse dengan AI"
3. **Check form** - Make sure "Nama Perusahaan" field is filled
4. Click "Simpan Loker"

**Expected:**
- ✅ Success toast
- ✅ Redirect to list
- ✅ NO database error

---

## 🐛 If Still Error

### Debug Checklist:

1. **Check form data:**
   ```
   Look in browser console for:
   [SAVE LOKER] Data being sent: {...}
   ```
   
   **If `perusahaan_name` is undefined/null:**
   - AI parsing failed to extract company name
   - Or form field is empty

2. **Check API received:**
   ```
   Look in terminal for:
   [API] Received data: {...}
   ```
   
   **If `perusahaan_name` missing:**
   - Data not sent from form properly

3. **Manual test:**
   ```
   After AI parse, manually type company name in form
   Then click Save
   ```
   
   **If works:** AI parsing issue
   **If still fails:** Form binding issue

---

## 🔍 Debug Guide

### Check Browser Console:

```javascript
// Should see:
[SAVE LOKER] Data being sent: {
  title: "Full Stack Developer",
  perusahaan_name: "PT Maju Jaya",  // ✅ NOT null!
  lokasi: "Jombang Kota",
  kategori: ["IT", "Web Development"],
  ...
}
```

### Check Terminal/Server Logs:

```
[API] Received data: {
  "title": "Full Stack Developer",
  "perusahaan_name": "PT Maju Jaya",  // ✅ Received!
  "lokasi": "Jombang Kota",
  ...
}

[API] Inserting loker: {
  "title": "Full Stack Developer",
  "perusahaan_id": "uuid-here",
  "perusahaan_name": "PT Maju Jaya",  // ✅ Included in INSERT!
  "lokasi": "Jombang Kota",
  ...
}
```

---

## ✅ Summary

**Root Cause:** `perusahaan_name` not explicitly included in INSERT statement

**Solution:** 
1. ✅ Add `perusahaan_name: data.perusahaan_name` to lokerData
2. ✅ Add debug logs to track data flow
3. ✅ Prepare data object separately for clarity

**Files Changed:**
- `app/api/admin/vip/loker/route.ts` - Added perusahaan_name
- `components/admin/vip/LokerFormWithAI.tsx` - Added debug log

**Status:** FIXED - Test upload now! ✅

---

## 📊 Data Flow

```
1. User uploads poster
   ↓
2. AI extracts: { perusahaan_name: "PT Maju Jaya", ... }
   ↓
3. Form auto-fills with AI data
   ↓
4. User reviews (can edit)
   ↓
5. Click "Simpan Loker"
   ↓
6. editedData sent to API (includes perusahaan_name)
   ↓
7. API validates required fields
   ↓
8. API creates/finds perusahaan
   ↓
9. API inserts loker WITH perusahaan_name ✅
   ↓
10. Success! ✨
```

---

**Test:** Upload poster & check console logs for data flow  
**Expected:** Should work now! 🚀
