# 🔧 Kanban Drag & Drop Troubleshooting

## ✅ Perbaikan yang Sudah Dilakukan

### 1. **Fixed Nested Scroll Container Warning**
- ❌ **Error sebelumnya**: `Droppable: unsupported nested scroll container detected`
- ✅ **Fix**: Menghapus `overflow-y-auto` dan `max-h-[400px]` dari dalam kolom
- ✅ **Result**: Warning hilang, drag and drop lebih smooth

### 2. **Optimized Column Heights**
- Mengubah `min-h-[320px]` → `min-h-[240px]` untuk kolom yang lebih compact
- Desktop XL columns: `min-h-[280px]` untuk visual consistency

## 🚨 CHECKLIST: Jika Drag Masih Bermasalah

### ✅ Step 1: Pastikan SQL Migration Sudah Dijalankan

**PENTING**: Tanpa ini, drag and drop TIDAK akan berfungsi!

```sql
-- Jalankan di Supabase SQL Editor:
-- Copy dari file: db/add-order-index.sql

alter table applications add column if not exists order_index int default 0;
-- ... (full SQL dari file)
```

**Cara Verify:**
1. Buka Supabase Dashboard → Table Editor → `applications` table
2. Check apakah ada kolom `order_index` (type: int8)
3. Jika ada, migration sudah berhasil ✅

### ✅ Step 2: Clear Cache & Restart Dev Server

```bash
# Stop server (Ctrl+C)
# Clear Next.js cache
rm -rf .next

# Start fresh
npm run dev
```

### ✅ Step 3: Hard Refresh Browser

- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`
- Atau buka DevTools → Network → Disable cache

### ✅ Step 4: Check Console Errors

Buka DevTools Console dan cari:

**❌ Error yang harus TIDAK ada:**
```
Droppable: unsupported nested scroll container detected
```
Jika masih ada → code belum terupdate, restart dev server.

**✅ Logs yang seharusnya muncul saat drag:**
```
🎯 Drag End: { draggableId: "xxx", from: "Applied", to: "Screening", ... }
✅ Reorder saved successfully
```

### ✅ Step 5: Check Database Connection

Test dengan inspect element aplikasi:
```javascript
// Di browser console, check apakah data punya order_index
console.log(applications[0])
// Should show: { ..., order_index: 0, ... }
```

Jika `order_index` undefined → SQL migration belum dijalankan!

## 🎯 Testing Scenarios

### Test 1: Drag Antar Kolom
1. Drag card dari "Applied" ke "Screening"
2. **Expected**: Card pindah smooth, tidak "melompat" dari tempat lain
3. **Expected Console**: `✅ Reorder saved successfully`
4. Refresh page → card harus tetap di "Screening"

### Test 2: Reorder Dalam Kolom
1. Pastikan ada minimal 2 cards di satu kolom
2. Drag card paling bawah ke paling atas
3. **Expected**: Urutan berubah
4. Refresh page → urutan tetap sama

### Test 3: Drop di Kolom Kosong
1. Drag card ke kolom yang kosong (e.g., "Hired")
2. **Expected**: Card masuk dengan smooth
3. "Drop kartu di sini" placeholder harus hilang

### Test 4: Cancel Drag (ESC)
1. Start drag sebuah card
2. Press `ESC` key
3. **Expected**: Card kembali ke posisi semula, no error

## 🐛 Common Issues & Solutions

### Issue 1: "Kartu Muncul dari Sidebar Saat Drag"

**Penyebab:**
- Ada CSS `transform`, `scale`, `filter` di parent element
- Nested scroll container (seharusnya sudah fixed)

**Solution:**
```tsx
// Pastikan wrapper Kanban punya class ini:
<div className="jobmate-board-safe">
  <DragDropContext onDragEnd={onDragEnd}>
    {/* Kanban columns */}
  </DragDropContext>
</div>
```

CSS `.jobmate-board-safe` (sudah ada di `styles/globals.css`):
```css
.jobmate-board-safe {
  transform: none !important;
  filter: none !important;
  backdrop-filter: none !important;
  will-change: auto !important;
}
```

### Issue 2: "Order Tidak Persist Setelah Refresh"

**Penyebab:**
- SQL migration belum dijalankan
- `order_index` column tidak ada

**Solution:**
1. Jalankan `db/add-order-index.sql` di Supabase
2. Verify dengan query:
```sql
SELECT id, company, status, order_index 
FROM applications 
LIMIT 5;
```

### Issue 3: "Console Warning: Nested Scroll"

**Penyebab:**
- Masih ada `overflow-y-auto` di dalam Droppable

**Solution:**
- File `TrackerKanbanNew.tsx` sudah diperbaiki
- Pastikan tidak ada perubahan local yang belum tersimpan
- Restart dev server

### Issue 4: "Drag Sangat Lambat / Laggy"

**Penyebab:**
- Terlalu banyak re-render
- Database query lambat

**Solution:**
1. Check network tab saat drag → tidak boleh ada requests during drag
2. Requests hanya saat drop (setelah drag selesai)
3. Jika ada banyak cards (>50), consider pagination

### Issue 5: "Card Tidak Bisa Di-drop"

**Penyebab:**
- `droppableId` tidak match
- Missing `provided.placeholder`

**Solution:**
- Sudah fixed di `TrackerKanbanNew.tsx`
- Setiap Droppable punya `droppableId={status.key}`
- Setiap Droppable render `{provided.placeholder}`

## 📊 Expected Behavior (After All Fixes)

### Visual Feedback During Drag:
1. ✅ Card opacity becomes 90% saat di-drag
2. ✅ Shadow dan ring muncul di card yang di-drag
3. ✅ Column yang di-hover punya `ring-2 ring-primary bg-primary/5`
4. ✅ Placeholder space muncul di destination
5. ✅ Cursor berubah jadi `cursor-grabbing`

### Console Logs (Development):
```javascript
// Saat mulai drag:
🎯 Drag End: {
  draggableId: "abc123",
  from: "Applied",
  to: "Screening",
  sourceIndex: 2,
  destIndex: 0
}

// Setelah save:
✅ Reorder saved successfully
```

### Database Updates:
- Status berubah jika pindah kolom
- `order_index` update untuk semua cards di 2 kolom (source & destination)
- Auto revalidate → dashboard stats ikut update

## 🔍 Debug Mode

Aktifkan debug logs tambahan:

```typescript
// Di TrackerKanbanNew.tsx, uncomment ini untuk debug lebih detail:

function onDragEnd(result: DropResult) {
  console.log("🔍 Full result:", result);
  console.log("🔍 Current columns:", columns);
  // ... rest of code
}
```

## ✅ Final Checklist

Sebelum testing, pastikan:

- [ ] SQL migration sudah dijalankan di Supabase
- [ ] Dev server sudah restart
- [ ] Browser cache sudah di-clear (hard refresh)
- [ ] Console tidak ada error warnings
- [ ] Ada minimal 2-3 job applications untuk testing
- [ ] Buka di http://localhost:3000/tools/tracker

## 🎉 Success Indicators

Jika semua benar:
- ✅ No console warnings/errors
- ✅ Drag smooth, tidak "jump" dari tempat lain
- ✅ Drop works di semua kolom
- ✅ Order persist setelah refresh
- ✅ Performance bagus (no lag)

Jika masih ada masalah setelah semua checklist, screenshot console error dan kirim untuk troubleshooting lebih lanjut!
