mantap broku 🔥 berikut **versi final prompt landing page `/jobmate`**
sudah lengkap: copywriting, struktur, animasi ringan, performa optimal, **plus bagian baru yang menjelaskan semua tools JobMate** (biar user tertarik pindah ke dashboard).

---

# 🧠 PROMPT FINAL – LANDING PAGE “CAREER VIP INFOLOKERJOMBANG”

**Tujuan:** buat landingpage cepat, keren, dan konversional di `/jobmate`
**Framework:** Next.js (App Router) + Tailwind + shadcn/ui
**Prioritas:** ringan, SSG/ISR, visual profesional, tone lokal friendly.

---

## ⚙️ KONFIGURASI TEKNIS

* Framework: **Next.js 15 (App Router, TypeScript)**
* Styling: **Tailwind CSS**
* UI Kit: **shadcn/ui** (Button, Card, Badge, Accordion)
* Icon: **lucide-react**
* Font: `Inter` / `Manrope` via `next/font` (`display: swap`)
* Animasi: **Framer Motion** (lazy load, `LazyMotion` + `domAnimation`)
* SEO: **next-seo**
* Gambar: **next/image** format AVIF/WebP, <180KB
* Analytics (optional): `@vercel/analytics`
* **NO** GSAP, AOS, Lottie, atau script berat.

**Performance rules:**

* Semua section **SSG** + **ISR 1h**
* Code-splitting pada Testimoni dan FAQ
* Dynamic import komponen non-kritis
* Lighthouse target: Performance > 90 (mobile), LCP < 2s
* Hanya 1 font family, subset minimal
* Gunakan warna utama:

  * Hijau tua `#0C3B2E`,
  * Maroon `#991B1B`,
  * Emas `#FACC15`.

---

## 📄 STRUKTUR SECTION `/jobmate`

1. **Navbar Sticky Ringan**
   Logo InfoLokerJombang kiri. Nav kanan: Paket • VIP Career • Tools JobMate • Chat Admin (WA).
   CTA Header: “Gabung Sekarang” → `#pricing`.

2. **Hero Section**

   ```
   STOP BUANG WAKTU CARI LOKER YANG GAK JELAS!
   Kini Kamu NGGAK PERLU CAPEK scroll IG, FB, Telegram, atau platform lain.
   Semua loker valid & update setiap hari langsung dikirim ke GRUB WA PREMIUM!
   ```

   CTA 1: [Gabung Sekarang] scroll ke #pricing
   CTA 2: [Lihat VIP Career] → /jobmate/vip
   Background: ilustrasi pekerja di depan banyak notifikasi grup.

3. **Pain Point**

   * 😩 Capek scroll tiap malam tapi info loker gak jelas
   * 😕 Loker udah tutup / gaji gak sesuai
   * 😴 Notifikasi grup numpuk, gak tahu mana valid
   * 😔 Bosen cari tapi hasil nihil
   * 😓 Mager karena harus buka banyak platform
     💭 *“Berapa lama lagi mau capek scroll grup loker TANPA HASIL?”*
     ➡️ *Jangan khawatir — Solusinya ada di JOMBANG CAREER VIP.*

4. **Apa Itu Jombang Career VIP**
   Judul: *Apa Itu Grup WhatsApp “JOMBANG CAREER VIP”?*
   Deskripsi & fitur:

   * ✅ Stop Capek Cari Loker
   * ✅ Loker Terpercaya, Tanpa Hoax
   * ✅ Satu Tempat Semua Loker
   * ✅ Info Terbaru Setiap Hari
     💚 **184.000+ orang mempercayai InfoLokerJombang.**
     CTA kecil: [Gabung Sekarang].

5. **Edukasi/Story**
   *Bukan kamu yang gagal, tapi sistem carimu yang perlu di-upgrade!*
   contoh: Scroll tiap malam, CV pasaran, hasil nihil.

6. **Dua Pilihan**
   “Sekarang Kamu Punya 2 Pilihan:
   1️⃣ Terus ngandelin cara lama.
   2️⃣ Gabung ke Career VIP dan siap kerja!”
   CTA: [Lihat Paket ↓].

7. **Pricing (#pricing)**
   Dua kartu berdampingan.

   **VIP BASIC – Rp10.000/bulan**

   * Grup WA Career VIP InfoLokerJombang
   * Web Job Portal VIP
   * Bonus Template CV ATS-friendly
     💬 *Cocok buat kamu yang baru mulai cari kerja.*
     CTA → `/jobmate/vip?plan=basic`

   **VIP PREMIUM – Rp39.000 Lifetime** ⭐ *Rekomendasi Admin*

   * Semua fitur BASIC
   * Semua Tools JobMate
   * Akses Seumur Hidup
     💬 *Sekali bayar, selamanya akses kerja!*
     🔥 “Setara 1 nasi goreng + es teh, tapi hasilnya peluang kerja seumur hidup.”
     CTA → `/jobmate/vip?plan=premium`

8. **Section Tambahan – “Apa Itu Tools JobMate?”**
   Tambahkan tepat setelah pricing, sebelum testimoni.

   ---

   ### 🚀 Tools JobMate — Semua yang Kamu Butuh untuk Siap Kerja

   > Dapatkan semua fitur ini di paket **VIP PREMIUM**

   **🧾 1. CV ATS Generator**
   Buat CV otomatis yang lolos sistem HRD dengan format profesional dan kompatibel ATS.

   **📄 2. Template Surat Lamaran & Email**
   Pilih dari 20+ contoh surat lamaran kerja formal & kreatif, tinggal isi nama dan posisi.

   **📋 3. Job Application Tracker (Kanban)**
   Pantau semua lamaranmu: *Terkirim – Interview – Diterima – Ditolak*, semuanya dalam dashboard pribadi.

   **💬 4. Interview Checklist & Panduan HRD**
   Siap wawancara dengan daftar pertanyaan umum, tips, dan trik menjawab versi HRD.

   **🎨 5. Skill-Based Resume Generator**
   Buat CV berbasis keahlian, bukan pengalaman, cocok untuk freshgraduate!

   **🧠 6. WhatsApp Message Generator**
   Bikin pesan WA profesional saat kirim lamaran — gak perlu mikir format lagi.

   **📂 7. Merge & Convert PDF Tools**
   Gabungkan, ubah, dan kompres file lamaranmu langsung di browser — tanpa aplikasi tambahan.

   **🎯 8. Profile Builder**
   Simpan semua data (pendidikan, skill, pengalaman) agar form lamaran bisa auto-generate kapanpun.

   CTA mini:
   👉 *Semua tools ini ada di Dashboard JobMate!*
   [Coba Sekarang → /jobmate/dashboard]

   **Visual:** grid ikon 4x2, style minimal shadcn card hover-lift (shadow-lg, rounded-2xl).

   ---

9. **Testimoni (ringan)**
   “Dulu susah cari kerja, sekarang tiap hari dapat info valid.” — *Rani, Mojowarno*
   “Cuma 39 ribu dapet tools lengkap buat CV & interview!” — *Bima, Sumobito*
   “Keterima kerja karena grup ini. Makasih InfoLokerJombang!” — *Dina, Peterongan*

10. **FAQ**
    (Accordion Shadcn, isi seperti versi sebelumnya.)

11. **CTA Penutup**
    Judul: *Siap Gak Siap, Kerja Harus Dimulai dari Sekarang 💪*
    Sub: *Gabung sekarang bareng 184.000+ pencari kerja Jombang.*
    CTA besar tengah: [GABUNG SEKARANG – PILIH PAKETMU].
    Footer: Powered by InfoLokerJombang × JobMate ©2025.

---

## 🎨 STYLING & UX

* Tombol utama: `bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md hover:scale-[1.02]`.
* Badge Premium: `bg-amber-200 text-amber-900 font-medium rounded-md px-2 py-1`.
* Section Tools: gunakan **grid** + **framer-motion fadeInUp** ringan.
* Divider antar section: `mask-image: linear-gradient(black,transparent)` atau `clip-path` gelombang ringan (CSS).
* Gunakan `react-wrap-balancer` untuk heading panjang.
* Floating WhatsApp Button kanan bawah, `aria-label="Chat Admin"`.

---

## 🧩 LIBRARY FINAL (ringan)

```json
"dependencies": {
  "next": "latest",
  "react": "latest",
  "react-dom": "latest",
  "tailwindcss": "latest",
  "clsx": "latest",
  "tailwind-merge": "latest",
  "lucide-react": "latest",
  "framer-motion": "latest",
  "next-seo": "latest",
  "@vercel/analytics": "latest",
  "react-wrap-balancer": "latest",
  "@radix-ui/react-accordion": "latest",
  "shadcn-ui": "latest"
}
```

---

## 💡 Catatan Terakhir

* Gunakan **static props (SSG)** dan preload minimal.
* Simpan section Tools JobMate sebagai komponen reusable (`components/tools-section.tsx`) agar bisa ditampilkan juga di dashboard jika perlu.
* Tambahkan meta:

  * title: *“Career VIP InfoLokerJombang — Siap Kerja Setiap Hari”*
  * desc: *“Gabung grup VIP + akses tools JobMate: CV, Email Lamaran, Interview Guide, dan banyak lagi.”*

