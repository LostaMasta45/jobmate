# 🔧 Fix: Poster Tidak Muncul di Home Page

## ✅ Code Sudah Benar!

File `ModernLokerCard.tsx` **sudah diupdate** dengan poster support.

## 🐛 Possible Issues

### Issue 1: Data Belum Punya Poster
**Check:**
```sql
-- Run di Supabase SQL Editor
SELECT 
  COUNT(*) as total,
  COUNT(poster_url) as dengan_poster,
  COUNT(*) - COUNT(poster_url) as tanpa_poster
FROM vip_loker
WHERE status = 'published';
```

**Solution:**
Jika belum ada poster, add sample posters:
```sql
-- Run: db/add-sample-posters.sql
```

### Issue 2: Browser Cache
**Solution:**
```
Hard Refresh: Ctrl + Shift + R
Clear Cache: F12 → Application → Clear Storage
```

### Issue 3: Image Loading Error
**Check Console:**
```
F12 → Console
Lihat error image loading
```

**Common Errors:**
- 404: URL tidak valid
- CORS: Domain tidak allowed
- Auth: Supabase bucket not public

---

## 🧪 Quick Test

### Test 1: Add Sample Job dengan Poster
```sql
-- Insert di Supabase SQL Editor
INSERT INTO vip_loker (
  title,
  perusahaan_name,
  lokasi,
  kategori,
  gaji_text,
  poster_url,
  status,
  published_at
) VALUES (
  'Frontend Developer (TEST)',
  'PT Teknologi Nusantara',
  'Jombang Kota',
  ARRAY['IT', 'Web Development'],
  'Rp 5-7 juta',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80',
  'published',
  NOW()
);
```

### Test 2: Verify Display
```
1. Go to: http://localhost:3000/vip/loker
2. Hard refresh: Ctrl + Shift + R
3. Find "Frontend Developer (TEST)"
4. Should show poster image (height 192px)
```

---

## 🔍 Debug Checklist

### Step 1: Check Database
```sql
-- Check poster URLs
SELECT id, title, poster_url 
FROM vip_loker 
WHERE status = 'published' 
  AND poster_url IS NOT NULL
ORDER BY created_at DESC
LIMIT 5;
```

### Step 2: Check Browser Network
```
F12 → Network → Filter: Img
Reload page
Check:
- ✅ Poster images loading (200 status)
- ❌ 404 errors
- ❌ CORS errors
```

### Step 3: Check Component Rendering
```javascript
// F12 → Console
// Check if poster_url exists
console.log(document.querySelectorAll('[alt*="Frontend"]'));
```

### Step 4: Force Refresh
```bash
# Restart dev server
npm run dev

# Clear browser cache
Ctrl + Shift + R

# Or hard reload
Ctrl + F5
```

---

## 📊 Expected Result

### With Poster:
```
┌────────────────────┐
│ ╔════════════════╗ │
│ ║                ║ │ ← Poster (h-48 = 192px)
│ ║ [JOB IMAGE]    ║ │
│ ║                ║ │
│ ║  [Badges]      ║ │ ← Top right
│ ║                ║ │
│ ║  Title         ║ │ ← Bottom overlay
│ ║  Company       ║ │
│ ╚════════════════╝ │
│  🏢 Logo      ❤️   │ ← Simplified header
│  📍 Location  💰   │
└────────────────────┘
```

### Without Poster:
```
┌────────────────────┐
│ ── [Bar] ──        │ ← Color bar
│ [Badges]        ❤️  │
│                    │
│  🏢                │
│  [Logo]  Title     │ ← Full header
│          Company   │
│                    │
│  📍 Location  💰   │
└────────────────────┘
```

---

## ✅ Solution Steps

### Option A: Add Test Data
```bash
# 1. Run SQL to add sample posters
# File: db/add-sample-posters.sql
# Paste di Supabase SQL Editor dan run

# 2. Hard refresh browser
Ctrl + Shift + R

# 3. Check home page
http://localhost:3000/vip/loker
```

### Option B: Upload via Admin
```bash
# 1. Login sebagai admin
http://localhost:3000/admin/vip-loker/tambah

# 2. Upload poster image
# 3. Parse with AI
# 4. Save loker

# 5. Check home page
http://localhost:3000/vip/loker
```

### Option C: Manual Update Existing Job
```sql
-- Update existing job dengan poster
UPDATE vip_loker
SET poster_url = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80'
WHERE id = 'YOUR_JOB_ID'
  AND poster_url IS NULL;
```

---

## 🎨 Visual Verification

### Check Browser DevTools:

**Elements Tab:**
```html
<!-- Should see this structure -->
<div class="relative w-full h-48 overflow-hidden">
  <img 
    src="https://..."
    alt="Frontend Developer"
    ...
  />
</div>
```

**Network Tab:**
```
Filter: Img
Status: 200 (green)
Type: png/jpeg/webp
Size: ~150KB
```

**Console Tab:**
```
No errors related to:
- Image loading
- Next.js Image component
- CORS
```

---

## 📝 Verification Script

Save as `verify-posters.sh`:
```bash
#!/bin/bash

echo "🔍 Checking Poster Display..."

# Check if dev server running
if curl -s http://localhost:3000 > /dev/null; then
  echo "✅ Dev server running"
else
  echo "❌ Dev server not running. Run: npm run dev"
  exit 1
fi

# Open browser
echo "🌐 Opening browser..."
start http://localhost:3000/vip/loker

echo ""
echo "📋 Manual Checks:"
echo "1. ✅ Poster images visible?"
echo "2. ✅ Height ~192px (h-48)?"
echo "3. ✅ Hover zoom works?"
echo "4. ✅ No broken images?"
echo "5. ✅ Title overlay readable?"
```

---

## 🚀 Final Checklist

- [ ] Database has jobs with `poster_url`
- [ ] Browser cache cleared (Ctrl + Shift + R)
- [ ] Dev server restarted
- [ ] Console has no errors
- [ ] Network tab shows images loading (200)
- [ ] Poster displays with correct height (192px)
- [ ] Hover effects working
- [ ] Title overlay readable

---

**Status:** Code ✅ Ready | Data ❓ Check Database  
**Next:** Add sample posters or upload via admin
