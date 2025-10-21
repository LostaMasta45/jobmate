# 🎨 Redesign Brief – UI & UX Improvement
Tugas: lakukan **redesign menyeluruh pada UI dan UX** website **VIP Career InfolokerJombang** agar tampil lebih **modern, bersih, dan premium**, tanpa mengubah struktur fitur utama atau data yang sudah ada.

Fokus perbaikan: visual, tata letak, warna, interaksi, dan pengalaman pengguna.

---

## 🧠 ARAH DESAIN BARU
- **Gaya:** Modern minimalist, clean, fresh, dengan *feel* profesional seperti Glints / JobStreet / Notion hybrid.  
- **Moodboard:** putih bersih, aksen biru navy & emas lembut.  
- **Tipografi:** gunakan kombinasi `Poppins SemiBold` (judul) dan `Inter Regular` (isi).  
- **Spacing:** beri *padding & margin* lebih lega antar elemen (seperti Dribbble layout).  
- **Shadow & Elevation:** halus, radius besar (rounded-2xl).  
- **Animasi:** gunakan *Framer Motion* untuk transisi ringan (fade-slide in/out).  

---

## 🪄 ELEMEN YANG PERLU DITINGKATKAN

### 1️⃣ Header & Navigasi
- Ganti header menjadi **transparan glassmorphism** dengan efek blur 0.7, berubah solid saat scroll.
- Tambahkan tombol **Dark Mode (☀️/🌙)** di kanan atas.
- Pastikan navigasi mobile memakai drawer clean dan tidak memenuhi layar.

---

### 2️⃣ Dashboard & Card Loker
- Gunakan layout **2 kolom grid** di desktop dan **1 kolom full-width** di mobile.
- Kartu loker dibuat lebih menarik:
  - Logo perusahaan di kiri, info utama kanan.
  - Gunakan badge warna untuk kategori & tipe kerja.
  - Tambahkan animasi hover: *scale-up halus + shadow naik*.
  - Tambahkan micro-interaction saat klik “Simpan” → icon hati kecil muncul ✨.
- Tambahkan label waktu (ex: “Diposting 3 jam lalu”) dengan font kecil abu halus.

---

### 3️⃣ Filter & Search UX
- Jadikan **filter bar sticky** di atas list loker.
- Gunakan komponen **chips filter (shadcn ToggleGroup)**:
  - Lokasi: Kecamatan di Jombang (Sumobito, Diwek, Ploso, Mojowarno, Jombang Kota)
  - Kategori: IT, Marketing, Sales, F&B, Retail
  - Tambahkan animasi aktif (warna biru lembut dengan outline emas tipis)
- Buat search bar besar dengan ikon kaca pembesar kiri dan tombol clear kanan.

---

### 4️⃣ Halaman Detail Loker
- Tambahkan logo perusahaan besar di atas judul.
- Tambahkan “AI Summary” kecil di atas deskripsi (ikon ⚙️ AI).
- Gunakan grid 2 kolom: kiri (deskripsi), kanan (info ringkas: gaji, deadline, sumber, tombol Lamar).
- Tambahkan *progress bar* “Waktu aktif lowongan” (ex: 12 hari tersisa).
- Gunakan CTA berwarna hijau untuk WhatsApp, biru untuk Email.

---

### 5️⃣ Status Member & Profile Bar
- Buat card profil di dashboard kiri atas:
  - Avatar user, nama, status “⭐ VIP Basic” atau “🔥 VIP Premium”
  - Masa aktif (contoh: “Aktif hingga 16 Nov 2025”)
  - Tombol “Upgrade Premium” dengan gradient emas.
- Buat sidebar collapsible (bisa disembunyikan di mobile).

---

### 6️⃣ Admin Panel UX
- Tambahkan *poster preview mini* di halaman upload.
- Tampilkan hasil AI parse di dialog card “AI Extract Result” dengan opsi:
  - `Gunakan hasil ini`
  - `Edit manual`
  - `Jalankan ulang AI`
- Tambahkan indikator kepercayaan AI (confidence bar) di tiap hasil parse.
- Gunakan toast notifikasi sukses/gagal untuk aksi publish.

---

### 7️⃣ Warna & Tema
Gunakan sistem warna berikut:

| Variable | Warna | Fungsi |
|-----------|--------|--------|
| `--color-primary` | `#0F172A` | teks & header |
| `--color-secondary` | `#2563EB` | tombol & accent |
| `--color-accent` | `#FACC15` | highlight & badge |
| `--color-bg` | `#F9FAFB` | latar utama |
| `--color-muted` | `#64748B` | teks sekunder |
| `--color-success` | `#22C55E` | tombol WA |
| `--color-error` | `#EF4444` | notifikasi |

---

### 8️⃣ Interaksi Kecil yang Meningkatkan UX
- Skeleton loader di setiap list.
- Toast setelah aksi (tersimpan, upload, publish).
- Transisi halaman antar route menggunakan fade in/out 0.3s.
- Scroll-to-top button di kanan bawah.
- Pull-to-refresh untuk mobile.
- Notifikasi kecil “Loker baru hari ini ✨” di atas list.

---

### 9️⃣ Responsivitas
- Mobile-first dengan breakpoints:
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
- Gunakan *drawer* untuk sidebar admin dan navigasi mobile.
- Pastikan tombol tetap besar (tap area minimal 44px).

---

### 🔮 Optional Upgrade
Tambahkan fitur UI baru (tanpa backend tambahan):
- “🎯 Rekomendasi Untukmu” card carousel di dashboard.
- “📄 Loker Tersimpan Minggu Ini” section.
- “🏆 Perusahaan Terpopuler” grid dengan badge logo besar.

---

# 💎 OUTPUT YANG DIHARAPKAN
Redesign semua halaman yang sudah ada (tanpa ubah struktur data) agar tampil dengan:
1. **Tampilan lebih lega, tipografi jelas, dan hierarki visual kuat**
2. **Filter & navigasi intuitif**
3. **Interaksi ringan dan elegan**
4. **Warna seragam, profesional, dan mudah dibaca**
5. **Rasa premium seperti aplikasi Job Portal nasional**

Gunakan Tailwind + shadcn/ui. Pastikan hasil akhir siap diimplementasikan langsung tanpa refactor besar.
