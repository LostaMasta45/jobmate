# CV Creative Phase 2: Visual Polish & Dashboard

## Tujuan
Setelah struktur UX mobile diperbaiki (Phase 1), tahap selanjutnya adalah meningkatkan kualitas visual agar terasa "Premium" dan "App-like", serta memperbaiki tampilan Dashboard History yang menjadi pintu masuk pengguna.

## 1. Mobile Template Selector (Carousel)
Saat ini `MobileTemplateSelector` menggunakan *Collapsible Grid* yang fungsional tapi kurang "fun". Kita akan mengubahnya menjadi **Horizontal Carousel**.

### Konsep Perubahan:
*   **Horizontal Scroll Snap:** Template berjejer ke samping (horizontal) bukan ke bawah.
*   **Card Besar:** Setiap kartu template mengambil sekitar 80% lebar layar agar user bisa melihat detail warna/style dengan jelas.
*   **Live Selection:** Saat user scroll dan berhenti di satu template, template tersebut otomatis "terpilih" atau ada tombol "Pilih" yang jelas di bawahnya.
*   **Visual Feedback:** Card yang aktif di tengah akan sedikit membesar (scale effect).

### Target File:
*   `components/cv-creative/MobileTemplateSelector.tsx`

## 2. Dashboard / History Page Modernization
Saat ini `CVCreativeHistory` menggunakan Grid Card standar Shadcn. Di mobile, ini terlihat sebagai list panjang yang monoton.

### Konsep Perubahan:
*   **Masonry-style Layout (Visual Trick):** Meskipun di mobile tetap 1 kolom, kita ubah styling cardnya.
*   **Full-Width Preview:** Thumbnail CV mendominasi card (aspect ratio A4 dipotong bagian atas yang menarik).
*   **Quick Actions Overlay:** Tombol Edit/Download muncul lebih elegan (misalnya dengan *long press* atau icon titik tiga yang memunculkan Bottom Sheet action).
*   **Empty State:** Jika belum ada CV, tampilkan ilustrasi menarik + tombol "Buat CV Baru" yang *prominent*.

### Target File:
*   `components/cv-creative/CVCreativeHistory.tsx`

## 3. Micro-Interactions (Polish)
*   **Staggered Animation:** Saat list template atau history muncul, item muncul satu per satu dengan jeda (stagger).
*   **Feedback Haptic (Opsional):** Jika browser mendukung, tambahkan getaran halus saat memilih template.

---

## Rencana Eksekusi
1.  **Refactor `MobileTemplateSelector.tsx`** menjadi Carousel/Swiper.
2.  **Update `CVCreativeHistory.tsx`** untuk tampilan gallery yang lebih immersive.
