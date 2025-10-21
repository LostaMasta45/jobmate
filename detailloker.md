Revisi UI MEMBER-ONLY untuk situs "Career VIP InfolokerJombang".

A. Akses & Layout
- Semua route dilindungi (anggap user sudah login), tampilkan badge "VIP Active" + paket (Basic Rp10K/bln atau Premium Rp39K/bln).
- Layout kiri: Sidebar; kanan: Main content.
- Sidebar menu: Dashboard, Cari Loker, Perusahaan, Tersimpan, Job Alerts, Profil, (Premium) Tools Karier.
- Topbar: greeting + status membership + tombol "Upgrade Premium".

B. Halaman /dashboard (Member Dashboard)
1) Hero Personal:
   - "Hai, {namaUser} — VIP aktif sampai {tanggalBerakhir}" + badge paket.
   - Quick actions: [Cari Loker], [Loker Tersimpan], [Edit Minat].
2) Insight Cards (4 card, ada mini-sparkline/ikon):
   - Loker Aktif, Perusahaan Terdaftar, Tersimpan, Dilihat Minggu Ini (+/- tren).
3) Section Tabs:
   - Tab1: "Rekomendasi Untukmu" (berdasar minat).
   - Tab2: "Loker Terbaru".
   - Di atas grid, sediakan filter chips horizontal: [Semua] [Jombang Kota] [Sumobito] [Diwek] [Mojowarno] [+Kategori].
4) Komponen Kartu Loker (wajib):
   - Variasi A (umum): Title, company, lokasi, range gaji, tags (kategori/tipe), posted time, CTA [Lihat Detail], icon ❤️ (bookmark), 🔔 (aktifkan alert).
   - Variasi B (hasil AI parsing poster): tampilkan badge kecil "🧠 Generated from Poster", thumbnail poster (kecil/rounded), highlights AI:
     • Posisi/Jabatan
     • Kualifikasi ringkas (max 3 bullet)
     • Benefit ringkas (max 3 bullet) bila ada
     • Lokasi
     • Kontak WA/Email (CTA [Kirim WA] langsung)
     • Badge "Verified Company" jika applicable
     • Tombol [Lihat Poster] (lightbox)
   - Hover effect lembut; mobile friendly (1 kolom), desktop (3 kolom).
5) Aktivitas Terakhir:
   - List kecil "Terakhir kamu lihat": judul, perusahaan, timestamp + tombol "Lanjutkan Melihat".
6) Perusahaan Populer:
   - Carousel logo perusahaan: {logo, nama, jumlah loker aktif} → klik ke profil perusahaan.
7) Banner Upgrade (jika paket Basic):
   - Gradient card: "Upgrade ke Premium (Rp39.000/bln) → akses Tools Karier (CV Builder, Cover Letter, Interview Checklist) + Grup WA Premium".
   - CTA besar "Upgrade Sekarang".

C. Halaman /loker
- Search bar besar (placeholder: "Cari posisi, perusahaan, atau lokasi...") + debounce.
- Filter panel atas: Lokasi (kecamatan), Kategori/Tag, Tipe kerja (FT/PT/Freelance/Magang), Urutkan (Terbaru/Deadline/Gaji).
- Grid kartu loker (pakai komponen yang sama di dashboard).
- Pagination di bawah.
- Sticky quick-filter chips di mobile.

D. Halaman /loker/[id] (Detail Loker) ( jadi nanti ini hasil dari pharse poster yang akan di upload admin di page admin)
- Header: Title besar + company (badge Verified jika ada).
- Info ringkas: lokasi, tipe kerja, tanggal posting, sumber (WA/IG/Poster).
- Jika berasal dari poster (AI):
  - Badge "🧠 Generated from Poster".
  - Section Poster: thumbnail → lightbox.
  - Section Teks Terstruktur:
    • Posisi/Jabatan
    • Kualifikasi (bullet)
    • Benefit (bullet)
    • Lokasi
    • Jumlah dibutuhkan (jika ada)
    • Deadline (jika ada; jika tidak, tampilkan "Buka sampai posisi terisi")
    • Kontak/Kirim ke: tombol [Kirim WA] dan [Kirim Email]
    • Tags: chip klik-able → filter ke /loker
- Related jobs (3–4 item).
- Actions sticky (mobile): ❤️ Simpan, 📱 Kirim WA, Lihat Poster.

E. Halaman /perusahaan
- Search bar + grid kartu perusahaan: logo, nama, lokasi, jumlah loker aktif, tombol [Lihat].
- /perusahaan/[slug]: header profil (logo + nama + lokasi + kontak), daftar loker aktif perusahaan itu (pakai kartu yang sama).

F. Halaman /tersimpan
- Grid loker yang sudah dibookmark user. Empty state ilustratif dengan CTA kembali ke Cari Loker.

G. Halaman /alerts
- Preferensi notifikasi: toggle ON/OFF notifikasi WA/Email.
- Pilih minat: kategori/tag, lokasi, tipe kerja.
- Frekuensi: Harian/Mingguan. Tombol [Simpan Preferensi].

H. Halaman /profil
- Info akun: nama, email/WA, status paket, tanggal berakhir.
- Minat karier (chips multi-select).
- Keamanan sederhana (ubah password).
- Riwayat tindakan (opsional): terakhir dilihat/tersimpan.

I. Komponen & UX Umum
- Gunakan HeroUI: Card, Badge, Tabs, Tooltip, Dialog/Sheet (poster lightbox), Dropdown, Pagination.
- Animasi halus (Framer Motion ringan), skeleton loading grid.
- Mobile-first; desktop 3 kolom; tablet 2; hp 1 kolom.
- Warna:
  - Primary #2563EB, Gradient premium #2563EB→#9333EA, Accent emas #FACC15, BG #F9FAFB, Card #FFFFFF.
- Ikon lucide/heroicons, tipografi Inter/Poppins, shadow lembut.
- Floating FAB (kanan bawah): WhatsApp Admin VIP + Feedback.

J. Data Mock (untuk render contoh)
- Sediakan 6–9 data loker campuran:
  • 60% loker umum
  • 40% loker "generated from poster" dengan fields: posisi, perusahaan, lokasi, kualifikasi (array), benefit (array), kontakWA, deadline (nullable), posterUrl, tags (array), isAiParsed=true.
- Sediakan 6 perusahaan populer (logo placeholder + jumlah loker).
- Tandai beberapa item sebagai "Verified Company".

K. Acceptance Criteria
- Dashboard memuat: greeting personal, 4 insight cards, tab (Rekomendasi/Terbaru) + chips filter, grid kartu loker (dengan variasi AI Parsed), Aktivitas Terakhir, Perusahaan Populer, Banner Upgrade (jika Basic).
- Kartu AI Parsed menampilkan badge, thumbnail poster, highlights (kualifikasi/benefit), dan CTA WA+Poster.
- Semua halaman siap dipakai tanpa backend (mock state), mudah diganti ke data nyata nanti.
```