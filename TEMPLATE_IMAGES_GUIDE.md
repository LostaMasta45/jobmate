# Template Images Guide

## Lokasi Template Images
Template preview images disimpan di: `public/Template/`

## Format & Naming
- **Format**: PNG
- **Nama file**: `1.png`, `2.png`, `3.png`, ..., `10.png`
- **Aspect Ratio**: 210:297 (A4 portrait)
- **Resolusi recommended**: 420x595 px atau 630x892 px

## Status Saat Ini
✅ `1.png` - Tersedia
⚠️ `2.png` sampai `10.png` - Menggunakan fallback ke `1.png`

## Cara Menambahkan Template Images Baru

1. Buat screenshot atau preview dari template surat lamaran
2. Crop dengan aspect ratio A4 (210:297)
3. Resize ke ukuran 420x595 px atau lebih besar
4. Save sebagai PNG dengan nama sesuai nomor template:
   - Template 2 → `2.png`
   - Template 3 → `3.png`
   - dst...
5. Upload ke folder `public/Template/`
6. Update mapping di `components/surat-lamaran/TemplatePicker.tsx` jika perlu:

```typescript
const templateImages: Record<string, string> = {
  "template-1": "/Template/1.png",
  "template-2": "/Template/2.png", // ✅ update saat file tersedia
  "template-3": "/Template/3.png", // ✅ update saat file tersedia
  // dst...
}
```

## Komponen Yang Terpengaruh
- `components/surat-lamaran/TemplatePicker.tsx` - Menampilkan grid preview template
- `app/surat-lamaran-sederhana/buat/page.tsx` - Menggunakan TemplatePicker

## Fitur Preview Template
✅ Grid layout responsif (2-3-5 kolom)
✅ Hover effect dengan scale & shadow
✅ Selected state dengan ring & checkmark
✅ Auto-update preview saat diklik
✅ Image optimization dengan Next.js Image
