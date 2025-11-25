# Proposal Redesign Landing Page JobMate - V2 (High-Fidelity & Motion)

Dokumen ini berisi usulan perbaikan UI/UX **Advanced** untuk Landing Page JobMate. Fokus utama adalah **Visual Excellence** & **Micro-Interactions** tanpa mengubah *Copywriting* (Teks) dan *Fungsi* yang sudah ada.

Target: "Silicon Valley Standard" - Clean, Fast, & Premium.

## 1. Konsep Visual: "Cosmic Glass & Kinetic Flow"
*   **Atmosphere:** Deep Dark Background (`#0a0a0a`) dengan *ambient glow* dinamis (Cyan/Teal & Purple).
*   **Materials:**
    *   *Frosted Glass High-End:* Blur yang lebih halus dengan noise texture tipis.
    *   *Neon Borders:* Garis tepi tipis (1px) yang menyala saat di-hover.
*   **Motion:**
    *   *Scroll-Triggered Animations:* Elemen muncul dengan elegan saat user scroll.
    *   *Kinetic Typography:* Teks headline tidak statis, tapi memiliki animasi *reveal*.

## 2. Detail Perbaikan Per Section (Strict: No Copywriting Change)

### A. Navbar (Dynamic Island Style)
*   **Konten:** Menu sama persis (Home, Fitur, Harga, Testimoni).
*   **Upgrade UI/UX:**
    *   **Floating Pill:** Navbar berbentuk "kapsul" yang melayang, mengecil saat scroll ke bawah.
    *   **Glass Effect:** Backdrop blur saturasi tinggi.
    *   **Magnetic Buttons:** Tombol menu memiliki efek magnetik halus saat cursor mendekat.

### B. Hero Section (Immersive Entry)
*   **Konten:** Headline & Subheadline "Bantu kamu Lolos ATS..." (Tetap).
*   **Upgrade UI/UX:**
    *   **Background:** **Aurora Beams** atau **Grid Lines** yang bergerak lambat di background, memberikan kedalaman tanpa mengganggu teks.
    *   **Text Effect:** Judul utama menggunakan animasi *Word Pull Up* (muncul per kata dari bawah) atau *Typewriter*.
    *   **Hero Image:** Ganti gambar statis dengan **3D Tilting Card** yang berisi mockup dashboard JobMate. Bergerak mengikuti posisi mouse (Parallax).

### C. Pain Points (Meteor Cards)
*   **Konten:** 4 Poin Masalah & Solusi (Tetap).
*   **Upgrade UI/UX:**
    *   **Meteor Effect:** Efek garis cahaya jatuh (meteor) di background kartu secara acak.
    *   **Spotlight Hover:** Saat mouse bergerak di atas grid, ada efek "senter" yang menyorot border kartu.
    *   **Layout:** Grid 2x2 yang rapi dengan icon animasi (Lottie/Framer) yang memvisualisasikan masalah.

### D. Features / Solution (Bento Grid Pro)
*   **Konten:** CV ATS, Email, Tracker, Stats (Tetap).
*   **Upgrade UI/UX:**
    *   **Interactive Bento:** Grid box tidak statis.
        *   *Box CV:* Saat hover, menampilkan animasi scan garis (scanning effect).
        *   *Box Email:* Menampilkan animasi amplop terbuka/terkirim.
    *   **Glowing Borders:** Border antar grid menyala perlahan.
    *   **Noise Texture:** Background grid memiliki tekstur halus agar terlihat premium.

### E. Comparison (Sticky Scroll Reveal)
*   **Konten:** Tabel "Cara Lama" vs "JobMate" (Tetap).
*   **Upgrade UI/UX:**
    *   **Slider Comparison:** User bisa menggeser garis tengah (*slider*) untuk melihat perbedaan visual "Before vs After" secara langsung.
    *   **Color Coding:** Sisi kiri (Lama) desaturasi/abu-abu, sisi kanan (JobMate) full color & glowing.
    *   **Sticky Header:** Saat scroll tabel panjang, header tabel tetap menempel di atas.

### F. Pricing (Background Beams)
*   **Konten:** Paket Basic & Premium (Tetap).
*   **Upgrade UI/UX:**
    *   **Background Beams:** Efek cahaya sorot (beams) yang berputar di belakang kartu Premium (Best Value).
    *   **Moving Border:** Garis border kartu Premium bergerak melingkar warna-warni (Gradient Border).
    *   **Button Shine:** Tombol "Daftar Premium" memiliki efek kilau cahaya (*shimmer*) yang lewat setiap 3 detik.

### G. Testimonials (Infinite Moving Cards)
*   **Konten:** Review user (Tetap).
*   **Upgrade UI/UX:**
    *   **Infinite Scroll:** Kartu berjalan mulus tanpa putus (looping).
    *   **Pause on Hover:** Saat user menunjuk salah satu review, animasi berhenti agar mudah dibaca.
    *   **Avatar Glow:** Foto user memiliki ring/lingkaran cahaya tipis.

### H. FAQ & CTA (Explosion of Light)
*   **Konten:** Pertanyaan & Ajakan Bertindak (Tetap).
*   **Upgrade UI/UX:**
    *   **Clean Accordion:** Pertanyaan FAQ tanpa border box, hanya garis pemisah tipis yang elegan. Icon (+) berputar jadi (x) saat dibuka.
    *   **CTA Finale:** Background tombol CTA utama memiliki partikel yang meledak pelan atau *gradient mesh* yang bergerak.
    *   **Footer:** Minimalis dengan logo JobMate efek metallic.

## 3. Implementasi Teknis (Next Steps)
Mengupdate komponen di `components/landing-v2/` dengan library:
*   **Framer Motion** (Animation primitives)
*   **Tailwind CSS** (Styling)
*   **Lucide React** (Icons)
*   **Aceternity UI Concept** (Inspirasi efek visual)

**Note:** Semua perubahan hanya pada level CSS, Animasi, dan Struktur DOM. Teks/Copywriting dijamin 100% sama dengan original.

