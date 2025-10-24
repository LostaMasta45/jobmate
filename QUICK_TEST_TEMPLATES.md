# Quick Test Guide - 10 Templates Surat Lamaran

## 🧪 How to Test

### 1. Start Development Server
```bash
npm run dev
```

### 2. Navigate to Surat Lamaran
```
http://localhost:3000/surat-lamaran-sederhana/buat
```

### 3. Fill Sample Data

**Biodata Tab:**
- Nama Lengkap: `John Doe`
- Tempat Lahir: `Jakarta`
- Tanggal Lahir: `2000-01-01`
- Jenis Kelamin: `Laki-laki`
- Status: `Belum Menikah`
- Pendidikan: `S1 Teknik Informatika`
- No HP: `081234567890`
- Email: `john@email.com`
- Kota: `Jakarta Selatan`
- Alamat: `Jl. Sudirman No. 123`

**Data Lamaran Tab:**
- Kepada: `HRD Manager`
- Nama Perusahaan: `PT Tech Indonesia`
- Kota Perusahaan: `Jakarta`
- Jenis Instansi: `PT`
- Posisi: `Frontend Developer`
- Sumber: `LinkedIn`
- Lampiran: (default sudah ada)

### 4. Test Each Template

#### ✅ Template 1: Classic Professional
**Expected:**
- Black & white layout
- Times New Roman font
- Data pribadi dalam tabel 3 kolom
- Format paling simple dan clean

**Test:**
- [x] Click Template 1 image
- [x] Preview berubah instantly
- [x] Data muncul lengkap
- [x] Tabel align rapi (titik dua sejajar)
- [ ] Download PDF
- [ ] Download Word

#### ✅ Template 2: Modern Minimalist Blue
**Expected:**
- Header biru navy dengan position
- Icon emoji (📧 📱 📍) di kontak
- Data pribadi dalam box biru muda
- Modern look

**Test:**
- [x] Click Template 2 image
- [x] Header biru muncul
- [x] Icon kontak display
- [x] Box data pribadi background biru
- [ ] Download PDF (check colors)

#### ✅ Template 3: Corporate Formal Border
**Expected:**
- Border 1pt di seluruh halaman
- Header centered dengan border bottom
- Data dalam tabel dengan border
- Very formal look

**Test:**
- [x] Click Template 3 image
- [x] Border visible di preview
- [x] Tabel data pribadi dengan border
- [ ] Print test (border print correctly)

#### ✅ Template 4: Creative Sidebar
**Expected:**
- Sidebar kiri warna teal gradient
- Foto placeholder dengan icon 👤
- Data kontak di sidebar
- Content di kanan

**Test:**
- [x] Click Template 4 image
- [x] Sidebar teal visible
- [x] Foto icon muncul
- [x] Layout 2 kolom (sidebar + content)
- [ ] PDF export (check layout)

#### ✅ Template 5: Elegant Line Accent
**Expected:**
- Line gold (#b8860b) sebagai separator
- Header centered
- Font Georgia/serif
- Elegant spacing

**Test:**
- [x] Click Template 5 image
- [x] Gold line visible
- [x] Layout centered
- [x] Elegant look confirmed

#### ✅ Template 6: Two-Column Layout
**Expected:**
- Header navy blue full width
- Data di kolom kiri (background gray)
- Isi surat di kolom kanan
- Section labels with color

**Test:**
- [x] Click Template 6 image
- [x] Header biru full width
- [x] 2 kolom layout
- [x] Data kiri dengan background
- [ ] Print/PDF test

#### ✅ Template 7: Bold Header Red
**Expected:**
- Header gradient merah bold
- Nama besar di header
- Profil box dengan border merah
- Achievement focus

**Test:**
- [x] Click Template 7 image
- [x] Header merah gradient
- [x] Nama besar visible
- [x] Profil box dengan border
- [ ] PDF (check gradient)

#### ✅ Template 8: Compact Single-Page
**Expected:**
- Font 10pt (lebih kecil)
- Data inline dalam box
- Super compact
- All fit in 1 page

**Test:**
- [x] Click Template 8 image
- [x] Text lebih kecil
- [x] Layout compact
- [x] 1 halaman confirmed
- [ ] PDF test

#### ✅ Template 9: Executive Professional
**Expected:**
- Gold accent line (#d97706)
- "Executive Summary" section
- Professional profile table
- Premium look

**Test:**
- [x] Click Template 9 image
- [x] Gold line visible
- [x] Executive summary box
- [x] Professional table
- [ ] PDF export

#### ✅ Template 10: Fresh Graduate Achievement
**Expected:**
- Teal gradient header
- "Academic Excellence" box
- Leadership section
- Modern youthful design

**Test:**
- [x] Click Template 10 image
- [x] Teal header gradient
- [x] Academic box dengan border
- [x] Leadership section visible
- [ ] PDF export

---

## ✅ Visual Testing Checklist

### General Tests (All Templates)
- [x] Template switching works instantly
- [x] No errors in console
- [x] All data fields render
- [x] Lampiran list shows
- [x] Empty fields show "—"
- [x] Long text wraps properly
- [x] Layout stays in A4 bounds
- [x] Margin 25mm consistent

### Specific Element Tests
- [x] **Tables:** Titik dua sejajar (Template 1, 3, 5, 9)
- [x] **Colors:** Background colors show (Template 2, 4, 6, 7, 10)
- [x] **Gradients:** Gradients render (Template 2, 4, 7, 10)
- [x] **Borders:** Borders visible (Template 3, 7, 10)
- [x] **Icons:** Emoji icons display (Template 2, 4, 6, 7, 10)
- [x] **Layout:** Multi-column works (Template 4, 6)
- [x] **Fonts:** Different fonts applied
- [x] **Spacing:** Consistent spacing per template

### Template Info Display
- [x] Selected template shows info box
- [x] Name displays correctly
- [x] Description shows
- [x] Category badge shows
- [x] Icon in info box

---

## 🐛 Known Issues to Check

### High Priority
1. **Word Export:** Currently only Template 1 format
   - Need to update based on templateId
   
2. **Template Images:** Using fallback image (1.png)
   - Need actual preview images for 2-10

### Medium Priority
3. **Print Layout:** Flex templates in print mode
   - CSS handles with display: block
   - Test actual print

4. **Long Content:** Very long alamat or lampiran
   - May overflow to 2 pages
   - Need testing with max data

### Low Priority
5. **Dark Mode:** Template colors fixed for print
   - Not adjusting to dark mode
   - This is intentional for consistency

---

## 📊 Test Results Template

```
Template #: [Number]
Name: [Template Name]
Date Tested: [Date]
Tester: [Name]

✅ PASS | ❌ FAIL | ⚠️ ISSUE

[ ] Preview loads correctly
[ ] All data fields show
[ ] Colors render as expected
[ ] Layout matches design
[ ] PDF export works
[ ] Word export works
[ ] Print preview OK
[ ] No console errors

Issues Found:
- [List any issues]

Notes:
- [Additional observations]
```

---

## 🚀 Quick Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Check for errors
npm run lint

# Type check
npx tsc --noEmit
```

---

## 📝 Testing Notes

### What to Look For:
1. **Layout Integrity:** No overlapping elements
2. **Data Accuracy:** All form data appears
3. **Typography:** Font sizes readable
4. **Colors:** Consistent with design
5. **Spacing:** Not too tight or too loose
6. **Alignment:** Tables and text aligned
7. **A4 Fit:** Everything in one page
8. **Print Ready:** Looks good in print preview

### Common Issues:
- Empty data shows as blank (should be "—")
- Long text overflows container
- Colors not printing
- Layout breaks on small screens
- PDF export different from preview

### Quick Fixes:
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Check console for errors
- Verify data filled completely
- Test with different data lengths

---

## ✨ Success Criteria

Template is considered **READY** when:
- ✅ Visual preview matches design
- ✅ All data fields render correctly
- ✅ PDF export matches preview
- ✅ Word export matches preview
- ✅ Print preview looks good
- ✅ Fits in 1 A4 page (297mm height)
- ✅ No console errors
- ✅ Responsive to data changes

---

**Last Updated:** 2025-10-24  
**Status:** Visual Testing ✅ | Export Testing ⏳
