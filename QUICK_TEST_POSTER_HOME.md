# 🚀 Quick Test: Poster di Home Page

## ✅ Code Sudah Ready!

`ModernLokerCard.tsx` sudah diupdate untuk menampilkan poster.

---

## 🧪 3-Step Quick Test

### Step 1: Add Test Data (1 menit)

**Run SQL di Supabase:**
```bash
# File: db/quick-add-test-poster.sql
# Copy-paste ke Supabase SQL Editor → Run
```

**Atau manual:**
```sql
INSERT INTO vip_loker (
  title, perusahaan_name, lokasi, kategori,
  gaji_text, poster_url, status, published_at
) VALUES (
  'Frontend Developer TEST',
  'PT Teknologi',
  'Jombang Kota',
  ARRAY['IT'],
  'Rp 5-7jt',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200',
  'published',
  NOW()
);
```

### Step 2: Hard Refresh Browser

```
Ctrl + Shift + R
atau
Ctrl + F5
```

### Step 3: Check Home Page

```
URL: http://localhost:3000/vip/loker

Expected Result:
✅ Card dengan poster → Poster muncul (height 192px)
✅ Title overlay di bawah poster (white text)
✅ Badges di pojok kanan atas poster
✅ Hover zoom effect
```

---

## 📊 Visual Check

### SHOULD LOOK LIKE THIS:

```
╔════════════════════╗
║                    ║
║   [POSTER IMAGE]   ║ ← Full width, h-48
║                    ║
║   [Baru] [Hot]     ║ ← Badges top-right
║                    ║
║  Frontend Dev      ║ ← Title overlay (white)
║  PT Teknologi      ║ ← Company name (white)
╚════════════════════╝
 🏢 Small Logo    ❤️   ← Simplified layout
 📍 Jombang  💰 5-7jt
 IT
 12 jam lalu → Detail
```

---

## 🐛 Troubleshooting

### Issue 1: Poster Tidak Muncul

**Check Database:**
```sql
SELECT COUNT(poster_url) 
FROM vip_loker 
WHERE status = 'published' 
  AND poster_url IS NOT NULL;
```

**If 0:** Run Step 1 (add test data)

### Issue 2: Image Broken/404

**Check Console:**
```
F12 → Console
Look for errors
```

**Common Fixes:**
- Clear cache: Ctrl + Shift + R
- Check URL valid: Open in new tab
- Restart dev server: npm run dev

### Issue 3: Masih Tampilan Lama

**Solution:**
```
1. Hard refresh: Ctrl + Shift + R
2. Clear storage: F12 → Application → Clear site data
3. Incognito window: Ctrl + Shift + N
```

---

## 🎯 Complete Verification

### Browser DevTools Check:

**Elements Tab:**
```html
<!-- Should find this -->
<div class="relative w-full h-48 overflow-hidden">
  <img src="https://images.unsplash.com/..." />
</div>
```

**Network Tab:**
```
Filter: Img
Status: 200 ✅
Type: jpeg/png
Size: ~100-200KB
```

**Console Tab:**
```
No errors ✅
No CORS issues ✅
Images loading ✅
```

---

## 📋 Checklist

Before testing:
- [ ] Dev server running (`npm run dev`)
- [ ] Browser open: `http://localhost:3000/vip/loker`

After SQL insert:
- [ ] Hard refresh (Ctrl + Shift + R)
- [ ] Test job visible in list
- [ ] Poster image displays
- [ ] Height ~192px (h-48)
- [ ] Title overlay readable (white text)
- [ ] Hover zoom works
- [ ] No broken images
- [ ] No console errors

---

## 🎨 Multiple Test Cases

### Test Case 1: Job dengan Poster
```
Expected: Poster layout
- ✅ Poster image full width
- ✅ Title overlay at bottom
- ✅ Badges on poster
- ✅ Small logo below
```

### Test Case 2: Job tanpa Poster
```
Expected: Original layout
- ✅ Color bar at top
- ✅ Badges top-right
- ✅ Large logo + title side-by-side
```

### Test Case 3: Mixed List
```
Expected: Both layouts work
- ✅ Some cards with poster
- ✅ Some cards without poster
- ✅ Consistent spacing
- ✅ No layout shifts
```

---

## 🚀 Quick Command

Save as `test-poster.sh`:
```bash
#!/bin/bash

echo "🧪 Testing Poster Display..."
echo ""

# Check dev server
curl -s http://localhost:3000 > /dev/null
if [ $? -eq 0 ]; then
  echo "✅ Dev server running"
else
  echo "❌ Start dev server: npm run dev"
  exit 1
fi

# Open browser
echo "🌐 Opening browser..."
start http://localhost:3000/vip/loker

echo ""
echo "📋 Checklist:"
echo "1. Hard refresh: Ctrl + Shift + R"
echo "2. Check poster displays (h-48)"
echo "3. Check title overlay readable"
echo "4. Check hover zoom works"
echo "5. Check no broken images"
echo ""
echo "✅ All good? Poster feature working!"
```

---

## 📝 Summary

### Code Status: ✅ READY
- `ModernLokerCard.tsx` ✅ Updated
- Poster display logic ✅ Implemented
- Responsive design ✅ Working
- Hover effects ✅ Added

### Data Status: ❓ CHECK
- Run SQL to add test data
- Verify `poster_url` filled in database

### Browser Status: ⚠️ CACHE
- Clear cache: Ctrl + Shift + R
- Check console for errors
- Verify images loading (Network tab)

---

**Quick Action:**
1. Run `db/quick-add-test-poster.sql` ⚡
2. Hard refresh browser (Ctrl + Shift + R) 🔄
3. Check home page 👀

**Result:** Poster should display! 🎉
