# 📸 Upload Logo ke Imgur untuk Email

## Langkah-langkah Manual Upload:

### 1. Buka Imgur
- Go to: https://imgur.com/upload
- Tidak perlu login/register

### 2. Upload Logo Panjang
- Drag & drop: `public/Logo/logopanjang.png`
- Atau klik "Browse" dan pilih file
- Tunggu upload selesai
- **Copy Direct Link** (klik kanan pada gambar → Copy Image Address)
- Format URL: `https://i.imgur.com/xxxxx.png`

### 3. Upload Logo Kecil
- Upload: `public/Logo/logokecil.png`
- **Copy Direct Link**
- Format URL: `https://i.imgur.com/yyyyy.png`

### 4. Paste URLs ke File
Setelah dapat 2 URLs, update file `emails/InvoiceEmailTable.tsx`:

```tsx
// Ganti bagian ini:
const LOGO_PANJANG_CID = 'logo-panjang';
const LOGO_KECIL_CID = 'logo-kecil';

// Dengan URLs dari Imgur:
const LOGO_PANJANG_URL = 'https://i.imgur.com/XXXXX.png'; // Paste URL logo panjang
const LOGO_KECIL_URL = 'https://i.imgur.com/YYYYY.png';   // Paste URL logo kecil
```

Dan update src:
```tsx
// Ganti cid: dengan URL langsung
<img src={LOGO_PANJANG_URL} ... />
<img src={LOGO_KECIL_URL} ... />
```

## Alternative: Cloudinary

Bisa juga pakai Cloudinary (lebih profesional):
1. Daftar gratis: https://cloudinary.com/
2. Upload logo ke Media Library
3. Copy URL yang diberikan

## Kenapa Imgur/Cloudinary?

✅ **Direct URL** - Logo langsung accessible
✅ **No Attachment** - Tidak akan muncul sebagai attachment
✅ **Fast CDN** - Loading cepat dari CDN global
✅ **Email Compatible** - Semua email client bisa load
✅ **Free Forever** - Imgur free unlimited

---

**Setelah upload, beri tahu saya URL-nya, saya akan update kode!**
