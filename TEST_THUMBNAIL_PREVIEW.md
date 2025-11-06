# 🧪 Test Thumbnail Preview - Quick Guide

## ✅ Pre-requisites
- [x] Dev server running (`npm run dev`)
- [x] 20 thumbnail files di `/public/Template/`
- [x] `TemplatePicker.tsx` sudah diupdate

## 🎯 Test Cases

### Test 1: Akses Halaman Surat Lamaran
```
URL: http://localhost:3000/surat-lamaran-sederhana/buat
Expected: Halaman form pembuatan surat lamaran terbuka
```

**Checklist:**
- [ ] Page loads tanpa error
- [ ] Form wizard muncul dengan step-by-step
- [ ] Template picker section terlihat

### Test 2: Template Picker - Classic Tab
```
Location: Template selection section → Tab "Klasik (Hitam-Putih)"
```

**Checklist:**
- [ ] Tab "Klasik (Hitam-Putih)" terlihat
- [ ] 10 template cards muncul (template-1 s/d template-10)
- [ ] Setiap card menampilkan **thumbnail LENGKAP** (bukan hanya header)
- [ ] Thumbnail menampilkan full content: header, biodata, lampiran, signature
- [ ] Image load dengan benar (tidak broken image)
- [ ] Hover effect: overlay hitam transparan muncul
- [ ] Template name di bawah thumbnail

**Visual Check:**
- [ ] Template 1: Klasik Profesional - format standar dengan data lengkap
- [ ] Template 2: Modern Minimalis - spacing lebar, clean
- [ ] Template 3: Corporate Formal - header formal, table data
- [ ] Template 4: Creative Bold - bold headers, section terlihat jelas
- [ ] Template 5: Elegant Classic - classic layout dengan spacing elegan
- [ ] Template 6: Two Column Pro - 2 kolom layout terlihat
- [ ] Template 7: Bold Statement - bold titles, strong visual
- [ ] Template 8: Compact Efficient - compact spacing, efficient
- [ ] Template 9: Executive Premium - premium look, spacious
- [ ] Template 10: Fresh Graduate - friendly untuk fresh grad

### Test 3: Template Picker - Colored Tab
```
Location: Template selection section → Tab "Berwarna (Modern)"
```

**Checklist:**
- [ ] Tab "Berwarna (Modern)" terlihat
- [ ] 10 template cards muncul (template-11 s/d template-20)
- [ ] Setiap card menampilkan **thumbnail BERWARNA lengkap**
- [ ] Color badge terlihat di corner kanan atas thumbnail
- [ ] Full content visible dengan accent color

**Color Badge Check:**
- [ ] Template 11: Blue badge terlihat
- [ ] Template 12: Green badge terlihat
- [ ] Template 13: Teal badge terlihat
- [ ] Template 14: Purple badge terlihat
- [ ] Template 15: Orange badge terlihat
- [ ] Template 16: Navy badge terlihat
- [ ] Template 17: Forest Green badge terlihat
- [ ] Template 18: Royal Blue badge terlihat
- [ ] Template 19: Burgundy badge terlihat
- [ ] Template 20: Slate badge terlihat

### Test 4: Template Selection Interaction
```
Action: Klik pada salah satu template
```

**Checklist:**
- [ ] Template terpilih mendapat border highlight (ring-2 ring-primary)
- [ ] Checkmark icon muncul di center thumbnail
- [ ] Template info card muncul di bawah (nama, deskripsi, category)
- [ ] Bisa ganti pilihan dengan klik template lain
- [ ] Selected state pindah ke template baru

### Test 5: Responsive Check (Optional)
```
Action: Resize browser window atau buka di mobile
```

**Checklist:**
- [ ] Desktop (lg): 5 columns grid
- [ ] Tablet (md): 3 columns grid
- [ ] Mobile: 2 columns grid
- [ ] Thumbnail tetap proporsi A4
- [ ] Tidak ada overflow horizontal

### Test 6: Image Loading Performance
```
Action: Monitor network tab di browser DevTools
```

**Checklist:**
- [ ] Semua 20 images load successfully (200 status)
- [ ] No 404 errors untuk template images
- [ ] File sizes reasonable (< 220KB per image)
- [ ] Total load time < 3 seconds (on fast connection)
- [ ] Images cached properly (subsequent loads faster)

### Test 7: Full Content Visibility
```
Action: Klik setiap thumbnail untuk lihat detail
```

**Verify Full Content Visible:**
- [ ] **Header**: Tanggal, kepada Yth, perihal
- [ ] **Opening**: Salam pembuka
- [ ] **Body**: Paragraf perkenalan
- [ ] **Data Pribadi**: Table/box dengan info lengkap
- [ ] **Lampiran**: List numbered
- [ ] **Closing**: Hormat saya
- [ ] **Signature**: Nama di bawah

**Sample Data Check:**
- [ ] Nama: "Budi Santoso" terlihat
- [ ] Posisi: "Software Engineer" terlihat
- [ ] Perusahaan: "PT Teknologi Nusantara" terlihat
- [ ] Email: "budi.santoso@email.com" terlihat
- [ ] Address: "Jl. Merdeka No. 123" terlihat

### Test 8: Compare dengan Old Thumbnail
```
Location: /public/Template/1.png (old) vs template-X.png (new)
```

**Difference Check:**
- [ ] Old (1.png): Hanya header/bagian atas terlihat
- [ ] New (template-X.png): FULL content A4 terlihat
- [ ] New thumbnails lebih informatif
- [ ] User bisa buat keputusan lebih baik

## 🐛 Common Issues & Fixes

### Issue: Thumbnail tidak muncul (broken image)
**Fix:**
```bash
# Check file exists
ls public/Template/template-*.png

# Restart dev server
npm run dev
```

### Issue: Masih pakai thumbnail lama (1.png)
**Fix:**
```bash
# Clear browser cache
Ctrl + Shift + R (hard refresh)

# Verify mapping di TemplatePicker.tsx
# Pastikan: "/Template/template-1.png" bukan "/Template/1.png"
```

### Issue: Thumbnail terpotong/tidak full
**Fix:**
```bash
# Regenerate thumbnails
node scripts/generate-thumbnails.js

# Atau screenshot manual dari:
http://localhost:3000/generate-thumbnails
```

## 📊 Expected Results

### Before (Old Thumbnail):
```
- Semua template: 1.png (sama semua)
- Preview: Hanya header ~25% dari document
- User experience: Tidak tahu perbedaan layout
```

### After (New Thumbnails):
```
- Setiap template: Unique thumbnail (template-1.png s/d template-20.png)
- Preview: Full content 100% document visible
- User experience: Bisa lihat full layout sebelum memilih
```

## ✅ Test Summary Checklist

- [ ] All 20 thumbnails load correctly
- [ ] Full content visible in each thumbnail
- [ ] Color badges visible for templates 11-20
- [ ] Selection interaction works smoothly
- [ ] No console errors
- [ ] Performance acceptable (< 3s load)
- [ ] Responsive on different screen sizes
- [ ] Better UX than before

## 🎉 Success Criteria

Test dianggap **PASSED** jika:
1. ✅ Semua 20 thumbnails load tanpa error
2. ✅ Full content (header s/d signature) terlihat di setiap thumbnail
3. ✅ User bisa dengan jelas membedakan layout setiap template
4. ✅ Selection interaction bekerja sempurna
5. ✅ No browser console errors
6. ✅ Performance baik (load time reasonable)

---

## 🚀 Quick Test Commands

```bash
# 1. Pastikan dev server running
npm run dev

# 2. Buka browser
http://localhost:3000/surat-lamaran-sederhana/buat

# 3. Check browser console (F12)
# Tidak boleh ada error

# 4. Test interaction
# Klik tab "Klasik" dan "Berwarna"
# Klik beberapa template untuk test selection

# 5. Verify thumbnails
# Pastikan full content terlihat, bukan hanya header
```

## 📸 Visual Verification

Open DevTools (F12) → Network tab:
```
Filter: Img
Should see:
- template-1.png (200 OK)
- template-2.png (200 OK)
- ...
- template-20.png (200 OK)

No 404 errors!
```

---

**Status:** Ready for testing  
**Test Time:** ~5-10 minutes  
**Priority:** HIGH (verify core feature works)
