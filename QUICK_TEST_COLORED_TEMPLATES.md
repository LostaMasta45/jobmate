# 🧪 QUICK TEST: Template Berwarna

## Testing Steps

### 1. Start Development Server
```bash
npm run dev
```

### 2. Navigate to Page
```
http://localhost:3001/surat-lamaran-sederhana/buat
```

### 3. Test UX Flow

#### Step A: Lihat Tab Baru
- [ ] Scroll ke **Step 3: Pilih Template Surat**
- [ ] Verify ada 2 tabs: **"Klasik"** dan **"Berwarna"**
- [ ] Info box blue dengan text "💡 Pilih 1 template saja" muncul

#### Step B: Test Tab Klasik
- [ ] Click tab "Klasik (Hitam-Putih)"
- [ ] Verify 10 template muncul (Template 1-10)
- [ ] Templates tidak ada color badge
- [ ] Click salah satu → Selected dengan ring border blue

#### Step C: Test Tab Berwarna
- [ ] Click tab "Berwarna (Modern)"
- [ ] Verify 10 template muncul (Template 11-20)
- [ ] Each template has **color badge** di kanan atas:
  - Template 11: **Blue** badge
  - Template 12: **Green** badge
  - Template 13: **Teal** badge
  - Template 14: **Purple** badge
  - Template 15: **Orange** badge
  - Template 16: **Navy** badge
  - Template 17: **Forest** badge
  - Template 18: **Royal Blue** badge
  - Template 19: **Burgundy** badge
  - Template 20: **Slate** badge

### 4. Test Color Display

#### For Each Colored Template (11-20):

**Template 11 (Blue):**
- [ ] Click template 11
- [ ] Scroll to Step 5: Preview
- [ ] Verify header has **BLUE** border-left (#3B82F6)
- [ ] Verify data box has **LIGHT BLUE** background (#EFF6FF)
- [ ] Verify "DATA PRIBADI" text is **BLUE**

**Template 12 (Green):**
- [ ] Click template 12
- [ ] Preview shows **GREEN** top border (#10B981)
- [ ] Recipient box has **GREEN** left border
- [ ] Biodata box has **LIGHT GREEN** background (#D1FAE5)

**Template 13 (Teal):**
- [ ] Click template 13
- [ ] Header has **TEAL GRADIENT** (teal to light teal)
- [ ] Data box has **TEAL** border
- [ ] Section headers are **TEAL** color

**Template 14 (Purple):**
- [ ] Click template 14
- [ ] Header has **PURPLE** bottom border (#8B5CF6)
- [ ] Table borders are **LIGHT PURPLE** (#E9D5FF)
- [ ] Position text is **PURPLE**

**Template 15 (Orange):**
- [ ] Click template 15
- [ ] Circle avatar has **ORANGE** background (#F97316)
- [ ] Header text is **ORANGE**
- [ ] Info cards have **LIGHT ORANGE** background (#FFF7ED)

**Template 16 (Navy):**
- [ ] Click template 16
- [ ] Top header bar is **NAVY BLUE** (#1E3A8A) dengan white text
- [ ] Lampiran box has **LIGHT BLUE** background (#DBEAFE)

**Template 17 (Forest Green):**
- [ ] Click template 17
- [ ] Header has **DOUBLE FOREST GREEN** border (#166534)
- [ ] Biodata box has **LIGHT GREEN** background (#DCFCE7)

**Template 18 (Royal Blue):**
- [ ] Click template 18
- [ ] Full-width header is **ROYAL BLUE** (#1D4ED8)
- [ ] Data labels are **ROYAL BLUE**
- [ ] Border box is **LIGHT BLUE** (#BFDBFE)

**Template 19 (Burgundy):**
- [ ] Click template 19
- [ ] Top and bottom borders are **BURGUNDY** (#991B1B)
- [ ] Table has **DOTTED BURGUNDY** borders (#FECDD3)
- [ ] Position text is **BURGUNDY**

**Template 20 (Slate):**
- [ ] Click template 20
- [ ] Left border is **SLATE GRAY** (#64748B)
- [ ] Headers are **SLATE** color
- [ ] Background boxes are **LIGHT SLATE** (#F1F5F9)

### 5. Test Download Functionality

#### PDF Download:
```
1. Fill in all biodata and perusahaan fields
2. Select colored template (e.g., Template 11)
3. Click "Download PDF"
4. Open PDF file
5. Verify:
   - Colors preserved in PDF
   - Layout fit dalam 1 halaman A4
   - Text readable (no cut-off)
```

#### DOCX Download:
```
1. Same data as above
2. Click "Download DOCX"
3. Open in Microsoft Word
4. Verify:
   - Colors preserved (may vary slightly)
   - Format maintained
   - 1 page A4
```

### 6. Test A4 Format

**Quick Check:**
- [ ] Preview tampak pas dalam container
- [ ] No horizontal scroll
- [ ] Text tidak terpotong
- [ ] Semua sections visible
- [ ] Signature section muat di bawah

**Detailed Check (Browser DevTools):**
```
1. Open DevTools (F12)
2. Go to Console
3. Check element sizes:
   - Container width ~210mm (A4 width)
   - Height should not exceed 297mm (A4 height)
4. No CSS overflow warnings
```

---

## ✅ Expected Results

### Visual:
- ✅ 2 tabs jelas terlihat
- ✅ Template berwarna menampilkan color badge
- ✅ Preview menampilkan warna yang benar
- ✅ Colors vibrant & professional
- ✅ Layout tetap clean & organized

### Functional:
- ✅ Click template langsung update preview
- ✅ Download PDF dengan warna
- ✅ Download DOCX dengan warna
- ✅ A4 format maintained (1 page)
- ✅ No errors di console

### UX:
- ✅ User tidak bingung pilih mana
- ✅ Color badge membantu identify template
- ✅ Info box jelas menjelaskan cara pakai
- ✅ Smooth transition between tabs

---

## ❌ Common Issues & Solutions

### Issue 1: Warna Masih Hitam-Putih
**Solution:**
- Hard refresh: `Ctrl + Shift + R`
- Clear cache
- Restart dev server: `npm run dev`

### Issue 2: Layout Terpotong
**Solution:**
- Check biodata/perusahaan fields
- Reduce lampiran items if too many
- Use shorter text in custom content

### Issue 3: Download Error
**Solution:**
- Verify all required fields filled
- Check browser console for errors
- Try different browser

---

## 📊 Success Metrics

- [ ] All 10 colored templates working
- [ ] All colors display correctly
- [ ] All downloads successful (PDF & DOCX)
- [ ] A4 format maintained
- [ ] No console errors
- [ ] User feedback positive

---

**Test Date:** 2025-10-25  
**Tester:** Ready for User Testing  
**Status:** ✅ All Fixes Complete
