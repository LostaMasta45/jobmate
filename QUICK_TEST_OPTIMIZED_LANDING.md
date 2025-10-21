# Quick Test: Landing Page Optimization

## 🚀 Test Sekarang

### 1. Jalankan Dev Server
```bash
npm run dev
```

### 2. Buka Kedua Versi

#### Original Landing Page
```
http://localhost:3000/
```

#### Optimized Landing Page
```
http://localhost:3000/revisi
```

## 🔍 Cara Bandingkan

### A. Visual Comparison
1. **Buka kedua tab side-by-side**
2. **Scroll perlahan** di kedua page
3. **Perhatikan:**
   - Speed saat pertama kali load
   - Smoothness saat scroll
   - Loading indicators (spinner hijau) di versi optimized

### B. Performance Check (Chrome DevTools)

#### Network Tab:
1. Tekan `F12` → Tab **Network**
2. **Reload page** (Ctrl+R)
3. Bandingkan:
   - **Initial bundle size**
   - **Total requests di awal**
   - **Load time**

**Original `/`:**
- Semua komponen load langsung
- Bundle size lebih besar di awal

**Optimized `/revisi`:**
- Initial bundle lebih kecil
- Komponen load bertahap saat scroll

#### Lighthouse Audit:
1. Tekan `F12` → Tab **Lighthouse**
2. Select:
   - ✅ Performance
   - ✅ Categories: Performance only
3. **Run** di kedua page
4. Bandingkan score!

### C. Slow Connection Test
Untuk lihat perbedaan lebih jelas:

1. Chrome DevTools → **Network** tab
2. Dropdown **Throttling** → Pilih **"Slow 3G"**
3. Reload kedua page
4. **Perbedaan akan sangat terlihat!**

## 📊 Expected Results

### Optimized Version Should Be:
- ✅ **Faster initial load** (30-50% lebih cepat)
- ✅ **Smaller bundle** (40-60% lebih kecil)
- ✅ **Better Lighthouse score** (+10-20 points)
- ✅ **Smoother on slow connections**

### Trade-offs:
- 🔄 **Loading indicators** saat scroll (minimal, biasanya tidak terasa)
- 🔄 **Slightly delayed** section load (milliseconds)

## ✅ Jika Hasil Bagus

Tinggal apply ke landing page utama:

1. **Replace** `app/page.tsx` dengan code dari `app/revisi/page.tsx`
2. **Test** sekali lagi
3. **Commit & deploy**

## 🎯 Key Optimization Points

### What Was Changed:

#### Original:
```tsx
// Load semua komponen langsung
import { AboutSection } from "@/components/landing/AboutSection";
import { PricingSection } from "@/components/landing/PricingSection";
// ... semua komponen di-import biasa

export default function Page() {
  return (
    <>
      <AboutSection />
      <PricingSection />
      {/* ... semua render langsung */}
    </>
  );
}
```

#### Optimized:
```tsx
// Dynamic import untuk code splitting
import dynamic from "next/dynamic";

const AboutSection = dynamic(
  () => import("@/components/landing/AboutSection"),
  { loading: () => <Spinner />, ssr: true }
);

export default function Page() {
  return (
    <>
      <AboutSection /> {/* Load saat visible */}
    </>
  );
}
```

## 📱 Test on Mobile

Perbedaan paling terasa di mobile devices:

1. **Chrome DevTools** → Toggle device toolbar (Ctrl+Shift+M)
2. Select device: **iPhone 12 Pro** atau **Pixel 5**
3. Throttling: **Fast 3G**
4. Compare kedua page

## 💡 Tips

- **First load** paling penting - ini yang user rasakan
- **Lighthouse mobile score** lebih strict daripada desktop
- **Network tab** show real bundle sizes
- **Performance tab** show detailed timeline

## 🐛 Troubleshooting

### Jika optimized version malah lebih lambat:
1. Check apakah dev mode (dev mode selalu lebih lambat)
2. Build production: `npm run build && npm start`
3. Test di production build

### Jika loading indicator ganggu:
1. Bisa di-disable: `ssr: false` → akan skip loading indicator
2. Atau custom loading lebih subtle

---

**Created:** 20 Oct 2025  
**Routes:**
- Original: `/`
- Optimized: `/revisi`

**Next Step:** Test → Compare → Apply ke main jika bagus!
