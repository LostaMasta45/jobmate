# TODO: Template Preview Images

## 📸 Task: Add Visual Previews for Templates

Currently, templates are shown as text previews in cards. To improve UX, add PNG preview images showing how each template looks when filled.

---

## 🎯 Goal

User dapat melihat tampilan akhir template sebelum memilih, seperti gambar yang diberikan:

![Example Preview](contoh: gambar yang Anda berikan menunjukkan format rapi dengan alignment yang baik)

---

## 📁 File Structure

```
public/
  templates/
    preview/
      template-1.png
      template-2.png
      template-3.png
      template-4.png
      template-5.png
      template-6.png
      template-7.png
      template-8.png
      template-9.png
      template-10.png
```

---

## 🔧 Implementation Steps

### Step 1: Generate Preview Images

**Option A: Manual Screenshots**
1. Fill form with sample data
2. Select each template
3. Take screenshot of preview
4. Crop to show main content
5. Save as PNG (800x600px recommended)

**Option B: Automated Generation**
1. Create script to generate previews
2. Use html2canvas or Puppeteer
3. Batch generate all 10 templates
4. Save to public folder

**Sample Data to Use**:
```typescript
const sampleData = {
  biodata: {
    namaLengkap: "Reza Nur Hamami",
    tempatLahir: "Jombang",
    tanggalLahir: "2000-12-26",
    jenisKelamin: "Laki-laki",
    status: "Belum Menikah",
    pendidikan: "SMKN 3 JOMBANG",
    noHandphone: "083122866975",
    email: "reza.nurh45@gmail.com",
    alamatKota: "Sumobito",
    alamatLengkap: "Sumobito"
  },
  perusahaan: {
    kepadaYth: "HRD",
    namaPerusahaan: "PT ABC Indonesia",
    kotaPerusahaan: "Jakarta",
    jenisInstansi: "PT",
    posisiLowongan: "Staff Marketing",
    sumberLowongan: "JobStreet",
    tanggalLamaran: "2025-01-22",
    lampiran: [
      "CV - Daftar Riwayat Hidup",
      "Scan/Fotokopi Ijazah & Transkrip Nilai",
      "Scan/Fotokopi SKCK",
      "Foto Terbaru Ukuran 3x4 atau 4x6",
      "Scan/Fotokopi KTP"
    ]
  }
}
```

---

### Step 2: Update TemplatePicker Component

**File**: `components/surat-lamaran/TemplatePicker.tsx` (FUTURE UPDATE)

**Current Code**:
```typescript
<div className="text-xs text-muted-foreground line-clamp-4 whitespace-pre-wrap font-serif bg-muted/30 p-3 rounded">
  {template.body.slice(0, 180)}...
</div>
```

**Updated Code**:
```typescript
<div className="relative aspect-[4/3] bg-muted/30 rounded overflow-hidden">
  <Image
    src={`/templates/preview/${template.id}.png`}
    alt={template.name}
    fill
    className="object-cover"
  />
</div>
<p className="text-xs text-muted-foreground mt-2 line-clamp-2">
  {template.name}
</p>
```

---

### Step 3: Update Template Type (Optional)

**File**: `lib/templates.ts`

```typescript
export type Template = {
  id: string
  name: string
  body: string
  previewImage?: string  // Optional: path to preview image
  description?: string   // Optional: short description
}
```

---

## 🎨 Preview Image Specifications

### Dimensions:
- **Width**: 800px
- **Height**: 600px
- **Aspect Ratio**: 4:3
- **Format**: PNG (for quality)
- **File Size**: Target < 200KB per image

### Content:
- Show complete letter format
- Use sample data (consistent across all)
- Maintain readability
- White background
- Times New Roman font visible

### Styling:
- Clean appearance
- No UI elements (buttons, borders)
- Just the letter content
- Professional look

---

## 🔄 Alternative: Dynamic Preview Generation

Instead of static images, generate preview on-the-fly:

```typescript
// In TemplatePicker
const [previewImages, setPreviewImages] = useState<Record<string, string>>({})

useEffect(() => {
  // Generate preview for each template
  templates.forEach(async (template) => {
    const preview = await generateTemplatePreview(template, sampleData)
    setPreviewImages(prev => ({
      ...prev,
      [template.id]: preview
    }))
  })
}, [])

// In render
<img 
  src={previewImages[template.id] || '/placeholder.png'} 
  alt={template.name}
  className="w-full h-full object-cover"
/>
```

---

## 📝 Benefits

### With Preview Images:
- ✅ Visual selection (easier to choose)
- ✅ Better UX (see before use)
- ✅ Faster decision making
- ✅ Professional appearance
- ✅ Reduced trial & error

### Without Preview Images:
- ❌ Text-only preview (hard to visualize)
- ❌ Need to try each template
- ❌ Time consuming
- ❌ Less intuitive

---

## 🚀 Priority

**Status**: Optional Enhancement
**Priority**: Medium
**Effort**: Low-Medium
**Impact**: High (UX improvement)

---

## 💡 Notes

1. **Current State**: Text preview works, but visual would be better
2. **User Feedback**: Users prefer seeing final result
3. **Industry Standard**: Most letter generators show visual previews
4. **Implementation**: Can be done incrementally (add images as available)

---

## 🎯 Success Criteria

- [ ] All 10 templates have preview images
- [ ] Images are properly sized and optimized
- [ ] TemplatePicker displays images correctly
- [ ] Images load fast (< 500ms)
- [ ] Fallback text preview if image fails
- [ ] Responsive on mobile devices
- [ ] Images look professional

---

## 📅 Timeline Estimate

**If doing manually**:
- Generate 10 preview images: 1-2 hours
- Update component: 30 minutes
- Testing & optimization: 30 minutes
- **Total**: 2-3 hours

**If doing programmatically**:
- Setup generation script: 2 hours
- Generate & verify all images: 1 hour
- Update component: 30 minutes
- **Total**: 3-4 hours

---

**Recommendation**: Start with manual screenshots using sample data for fastest implementation, then optionally create automated generation later.
