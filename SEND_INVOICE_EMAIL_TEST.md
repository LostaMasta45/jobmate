# Test Invoice Email dengan Dark Mode 🌙✨

## Cara Kirim Test Email

### Command:
```bash
npx ts-node scripts/test-invoice-dark-mode.ts EMAIL_ANDA@gmail.com
```

### Contoh:
```bash
npx ts-node scripts/test-invoice-dark-mode.ts admin@example.com
```

---

## ✨ Yang Sudah Ditambahkan ke Email

### 1. **Dark Mode Support** 🌙
- Email otomatis deteksi dark mode dari device
- Menggunakan `@media (prefers-color-scheme: dark)`
- Warna disesuaikan untuk dark mode:
  - Background: Dark blue gradient (#0f172a)
  - Cards: Dark slate (#1e293b, #334155)
  - Text: Light colors (#f1f5f9, #cbd5e1)
  
### 2. **Logo Jobmate** 🎨
- Logo `logopanjang.png` di header
- Filter white untuk kontras dengan background biru
- Floating animation

### 3. **CSS Animations** ✨
- Slide up entrance animation
- Float effect pada logo
- Pulse effect pada amount box
- Shimmer effect pada button
- Glow effect pada amount box
- Progress bar animation
- Smooth transitions

---

## 📱 Cara Test Dark Mode

### Di HP (Paling Akurat):
1. Kirim email ke alamat Anda
2. Aktifkan dark mode di HP:
   - **Android**: Settings > Display > Dark theme
   - **iPhone**: Settings > Display & Brightness > Dark
3. Buka email
4. Email akan otomatis tampil dengan theme gelap!

### Di Desktop:
**Gmail (Chrome/Firefox):**
1. Aktifkan system dark mode:
   - **Windows**: Settings > Personalization > Colors > Dark
   - **Mac**: System Preferences > General > Dark
2. Buka Gmail
3. Settings > Theme > View all > Dark
4. Email akan menyesuaikan

**Apple Mail (Mac):**
1. Aktifkan dark mode di Mac
2. Apple Mail otomatis follow system theme
3. Email support dark mode secara native

**Outlook:**
- Desktop app support dark mode
- Web version: Settings > Appearance > Dark mode

---

## 🎯 Fitur Email

### Light Mode (Default):
- Background: Purple-pink gradient
- Container: White
- Text: Dark gray
- Cards: Light gray background
- Buttons: Blue gradient with glow

### Dark Mode (Auto-detect):
- Background: Dark blue gradient
- Container: Dark slate
- Text: Light gray/white
- Cards: Dark gray background
- Buttons: Same blue gradient (tetap stand out)
- All colors optimized untuk visibility

---

## ⚠️ Catatan Penting

### Logo URL:
Saat ini logo menggunakan placeholder URL:
```
https://raw.githubusercontent.com/yourusername/jobmate/main/public/Logo/logopanjang.png
```

**Untuk production**, ganti dengan:
1. URL dari domain Jobmate: `https://infolokerjombang.id/Logo/logopanjang.png`
2. Atau upload ke CDN (Cloudinary, ImgIX, dll)
3. Atau gunakan base64 encoded image (file jadi lebih besar tapi reliable)

### Email Client Support:

| Feature | Gmail | Outlook | Apple Mail | Yahoo |
|---------|-------|---------|------------|-------|
| Dark Mode | ✅ | ✅ | ✅ | ⚠️ Limited |
| CSS Animations | ⚠️ Basic | ⚠️ Basic | ✅ Full | ⚠️ Basic |
| Gradient BG | ✅ | ✅ | ✅ | ✅ |
| Logo Image | ✅ | ✅ | ✅ | ✅ |

**Legend:**
- ✅ Full support
- ⚠️ Partial support
- ❌ Not supported

---

## 🧪 Test Script Details

### File: `scripts/test-invoice-dark-mode.ts`

Features:
- Load environment variables dari `.env`
- Render React email component ke HTML
- Send via Resend API
- Pretty console output dengan emoji
- Error handling

### Environment Variables Required:
```env
RESEND_API_KEY=re_xxx...
```

---

## 📧 Email Structure

```
┌─────────────────────────────┐
│ Header (Blue Gradient)      │
│ - Logo Jobmate (white)      │
│ - "Invoice Pembayaran"      │
├─────────────────────────────┤
│ Content                     │
│ - Greeting                  │
│ - Invoice Card              │
│ - Amount Box (animated)     │
│ - Countdown Timer           │
│ - CTA Button                │
│ - Payment Methods           │
│ - Trust Badge               │
│ - Warning Box               │
├─────────────────────────────┤
│ Footer                      │
│ - Company Info              │
│ - Contact Email             │
│ - Copyright                 │
└─────────────────────────────┘
```

---

## 🎨 Color System

### Primary Gradient:
```css
linear-gradient(135deg, #5547d0 0%, #3977d3 50%, #00acc7 100%)
```

### Light Mode:
- Background: `#ffffff`
- Text: `#1f2937`
- Secondary: `#6b7280`

### Dark Mode:
- Background: `#0f172a`
- Text: `#f1f5f9`
- Secondary: `#cbd5e1`

---

## 🚀 Quick Start

```bash
# 1. Pastikan env sudah setup
cat .env | grep RESEND_API_KEY

# 2. Kirim test email
npx ts-node scripts/test-invoice-dark-mode.ts your@email.com

# 3. Check inbox & test dark mode di HP
```

---

## ✅ Checklist Testing

- [ ] Email terkirim tanpa error
- [ ] Logo muncul di header
- [ ] Animasi jalan di email client
- [ ] Dark mode work di HP dengan dark mode enabled
- [ ] Light mode work di HP dengan light mode
- [ ] Button clickable
- [ ] Countdown timer display correctly
- [ ] All text readable di dark & light mode

---

**Siap untuk test!** 🚀

Kirim email dengan command:
```bash
npx ts-node scripts/test-invoice-dark-mode.ts EMAIL_ANDA@gmail.com
```
