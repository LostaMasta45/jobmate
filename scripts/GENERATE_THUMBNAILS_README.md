# Generate Template Thumbnails - Guide

## 🎯 Tujuan
Generate thumbnail preview lengkap (full content) untuk semua 20 template surat lamaran.

## 📋 Pilihan Metode

### Metode 1: Manual Screenshot (Recommended - Lebih Cepat)

1. **Start Dev Server**
   ```bash
   npm run dev
   ```

2. **Buka Browser**
   - Kunjungi: `http://localhost:3000/generate-thumbnails`
   - Login jika perlu

3. **Screenshot Setiap Template**
   - Gunakan Windows Snipping Tool (Win + Shift + S)
   - Atau gunakan browser extension seperti:
     - **GoFullPage** (Chrome) - Recommended
     - **Fireshot** (Firefox)
   
4. **Untuk Setiap Template:**
   - Scroll ke template yang ingin di-capture
   - Klik tombol "Capture This" untuk melihat instruksi
   - Screenshot HANYA area kotak putih (preview area)
   - Simpan sebagai: `template-1.png`, `template-2.png`, dst.
   
5. **Simpan File**
   ```
   /public/Template/
   ├── template-1.png
   ├── template-2.png
   ├── template-3.png
   ├── ...
   └── template-20.png
   ```

### Metode 2: Otomatis dengan Script

1. **Install Puppeteer**
   ```bash
   npm install --save-dev puppeteer
   ```

2. **Start Dev Server** (di terminal terpisah)
   ```bash
   npm run dev
   ```

3. **Run Script** (di terminal baru)
   ```bash
   node scripts/generate-thumbnails.js
   ```

4. **Wait for Completion**
   - Script akan otomatis screenshot semua 20 template
   - File disimpan ke `/public/Template/`

## 🔧 Update Code Setelah Generate

Setelah semua thumbnail di-generate, update file `TemplatePicker.tsx`:

```typescript
// File: components/surat-lamaran/TemplatePicker.tsx

const templateImages: Record<string, string> = {
  "template-1": "/Template/template-1.png",
  "template-2": "/Template/template-2.png",
  "template-3": "/Template/template-3.png",
  "template-4": "/Template/template-4.png",
  "template-5": "/Template/template-5.png",
  "template-6": "/Template/template-6.png",
  "template-7": "/Template/template-7.png",
  "template-8": "/Template/template-8.png",
  "template-9": "/Template/template-9.png",
  "template-10": "/Template/template-10.png",
  "template-11": "/Template/template-11.png",
  "template-12": "/Template/template-12.png",
  "template-13": "/Template/template-13.png",
  "template-14": "/Template/template-14.png",
  "template-15": "/Template/template-15.png",
  "template-16": "/Template/template-16.png",
  "template-17": "/Template/template-17.png",
  "template-18": "/Template/template-18.png",
  "template-19": "/Template/template-19.png",
  "template-20": "/Template/template-20.png",
}
```

## 📐 Spesifikasi Thumbnail

- **Dimensi**: 794 x 1123 pixels (A4 ratio)
- **Format**: PNG
- **Quality**: High (deviceScaleFactor: 2)
- **Content**: Full preview dengan sample data
- **Background**: White (#ffffff)

## ✅ Checklist

- [ ] Generate semua 20 thumbnail
- [ ] Verifikasi semua file ada di `/public/Template/`
- [ ] Update `templateImages` mapping di `TemplatePicker.tsx`
- [ ] Test di browser - template preview muncul dengan benar
- [ ] Commit dan push changes

## 🐛 Troubleshooting

### Script Error: "Dev server is not running"
- Pastikan `npm run dev` berjalan di terminal lain
- Check di browser: `http://localhost:3000` harus accessible

### Screenshot Blank/Kosong
- Wait sebentar sampai page fully loaded
- Refresh page dan coba lagi
- Check console untuk error

### File Size Terlalu Besar
- Compress dengan TinyPNG atau ImageOptim
- Target: < 200KB per file
- Format PNG sudah optimal untuk text content

## 🎨 Sample Data Used

Preview menggunakan data contoh:
- **Nama**: Budi Santoso
- **Posisi**: Software Engineer
- **Perusahaan**: PT Teknologi Nusantara
- **Pendidikan**: S1 Teknik Informatika

Data ini cukup representatif untuk menampilkan layout lengkap setiap template.

## 📝 Notes

- Template 1-10: Klasik (Hitam-Putih)
- Template 11-20: Berwarna (Modern)
- Semua template ATS-friendly
- Layout responsive untuk preview
