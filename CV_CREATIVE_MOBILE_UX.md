# CV Creative Mobile UX/UX Modernization Plan

## Visi
Menciptakan pengalaman pembuatan CV di mobile yang setara dengan aplikasi native (seperti Typeform atau Instagram Stories), di mana user merasa dipandu langkah demi langkah dengan visual yang "clean", "fresh", dan navigasi yang ergonomis.

## 1. Core UX Improvements (Mobile First)

### A. Navigasi "Thumb-Friendly" (Floating Bottom Bar)
*   **Masalah:** Navigasi standar seringkali berada di posisi yang sulit dijangkau atau tersembunyi di scroll paling bawah.
*   **Solusi:**
    *   Fixed Bottom Bar yang melayang (floating) dengan padding dari bawah layar.
    *   Efek *Glassmorphism* (blur background) agar konten di belakangnya terlihat samar tapi tetap terbaca.
    *   Tombol utama (Next) berukuran besar di sebelah kanan.
    *   Tombol sekunder (Back) lebih kecil/subtle di kiri.

### B. Segmented Progress Indicator
*   **Masalah:** Teks "Step 3 of 8" membosankan dan tidak memberikan sense of progress yang visual.
*   **Solusi:**
    *   Baris garis tipis di bagian paling atas layar (mirip Instagram Stories).
    *   Garis yang sudah dilewati berwarna solid (Gradient Purple-Pink).
    *   Garis yang belum dilewati berwarna abu-abu transparan.

### C. Transisi Halaman (Motion)
*   **Masalah:** Pergantian step terasa kaku (blink/reload).
*   **Solusi:**
    *   Menggunakan `framer-motion`.
    *   Animasi *Slide Left* saat Next.
    *   Animasi *Slide Right* saat Back.
    *   Konten step memiliki efek *Fade In* + *Scale Up* sedikit.

### D. Preview "Quick Peek"
*   **Masalah:** Mode preview saat ini mengganti seluruh layar, membuat konteks "edit" hilang.
*   **Solusi:**
    *   Tombol "Preview" kecil di pojok kanan atas atau di bottom bar.
    *   Membuka *Drawer/Modal* dari bawah (85% height).
    *   User bisa swipe down untuk menutup dan kembali edit instan.

## 2. Visual UI Refinements

### A. Container "Clean Card"
*   Background aplikasi mobile: Abu-abu sangat muda (`bg-slate-50`) atau gradient halus.
*   Konten form berada di dalam Card putih dengan shadow lembut (`shadow-sm` atau `shadow-md`).
*   Border radius besar (`rounded-2xl` atau `rounded-3xl`) untuk kesan modern/friendly.

### B. Typography & Spacing
*   Heading step lebih besar dan jelas.
*   Jarak antar input field diperbesar (`gap-6`).
*   Input field tinggi minimal 48px (standar touch target mobile).

---

## Roadmap Implementasi

1.  **Phase 1: Structural & Navigation** (Current Task)
    *   Implementasi Mobile Layout Wrapper.
    *   Floating Bottom Bar.
    *   Segmented Progress Bar.
    *   Basic Animations.

2.  **Phase 2: Component Polish**
    *   Redesign input forms (Basics, Education, etc) agar fit di mobile card.
    *   Improve typography.

3.  **Phase 3: Preview Experience**
    *   Implementasi Slide-up Drawer untuk Preview.
