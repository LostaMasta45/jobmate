## 🎯 Tujuan

Buat **dashboard admin** yang:

* Cepat, ringan, dan efisien dipakai harian.
* Fokus ke *input & moderasi loker lokal Jombang*.
* Integrasi kuat dengan AI (parser poster & caption generator).
* Memberikan insight real-time tentang aktivitas & performa loker.

---

## 🗂️ STRUKTUR HALAMAN ADMIN

**Sidebar utama (sticky & collapsible):**

* Dashboard
* Kelola Loker
* Upload Poster
* Perusahaan
* Member
* Laporan & Analitik
* Tools AI
* Pengaturan
* Logout

---

## 🧠 DASHBOARD UTAMA (Overview)

### Tujuan:

Memberi gambaran cepat tentang aktivitas harian dan performa sistem.

**Elemen UI utama:**

* **Statistik Ringkas (Cards grid 2x2)**

  * Total Loker Aktif
  * Loker Baru Hari Ini
  * Jumlah Perusahaan Terdaftar
  * Member Aktif
    (Gunakan ikon + warna berbeda tiap card)
* **Grafik Aktivitas Mingguan**

  * Garis “Loker Ditambahkan per Hari”
  * Bar “Jumlah Pelamar (klik apply)”
* **Panel Notifikasi Cepat**

  * AI Parsing gagal / duplikat / laporan user.
  * Tombol “Tinjau Sekarang”.
* **Tabel Mini “Loker Terbaru Hari Ini”** (judul, perusahaan, status, waktu upload).
* **Banner Kecil**: “💡 Tips: Gunakan AI Caption Generator untuk hemat waktu posting.”

**UX tambahan:**

* Hover menampilkan detail angka.
* Klik kartu → navigasi otomatis ke halaman terkait.

---

## 🧾 KELOLA LOKER (List & Moderasi)

### Tujuan:

Admin bisa melihat, mengedit, memfilter, dan memoderasi semua loker dengan cepat.

**UI:**

* Tabel utama dengan kolom:

  * [ ] checkbox (multi-select)
  * Judul Loker
  * Perusahaan
  * Lokasi
  * Status (Draft / Published / Expired)
  * Deadline
  * Views / Apply
  * Aksi (✏️ Edit | 👁️ Lihat | ❌ Hapus)
* Filter atas (sticky):

  * Lokasi, Kategori, Sumber (Poster/WA/IG), Status, Urutan (Terbaru/Terlama).
* Floating bar bawah:

  * “🧠 Analisa AI Ulang”, “🗑️ Hapus Terpilih”, “📤 Publish Batch”.

**UX:**

* Klik 2x pada baris = buka modal detail cepat.
* Status otomatis berubah jadi “Expired” setelah lewat deadline (dengan badge warna abu).
* Notifikasi toast saat aksi sukses.

---

## 🧩 UPLOAD POSTER (AI Integrated) ( ini kita sudah ada, hanya tambahkan saja )

### Tujuan:

Admin cukup upload gambar, AI melakukan ekstraksi otomatis dan isi form loker.

**UI Flow:**

1. **Upload Area (Drag & Drop)**

   * Preview poster + progress bar.
   * Tombol “🧠 Jalankan AI Parse”.
2. **Hasil Parsing (AI Result Panel)**

   * Field otomatis terisi: Judul, Perusahaan, Lokasi, Gaji, Kualifikasi, Kontak, Deadline, Kategori.
   * Tampilkan badge “Confidence: 92%”.
   * Highlight teks yang berhasil dikenali.
3. **Tombol Cepat:**

   * “Edit Manual”
   * “Analisa Ulang AI”
   * “Gunakan & Simpan Draft”
   * “Publish Sekarang”
4. **Panel Samping (Optional)**

   * “📢 Caption Otomatis” dari AI → siap copy ke WA/IG.
   * Tombol “Salin Caption”.

**UX:**

* Setelah parsing, muncul notifikasi ringan:
  “✅ Data berhasil diisi otomatis oleh AI (92% akurat)”.
* Jika AI mendeteksi duplikat → tampil modal peringatan “Loker ini mirip dengan posting sebelumnya (85% similarity)”.

---

## 🏢 HALAMAN PERUSAHAAN

### Tujuan:

Memudahkan admin memantau perusahaan lokal.

**UI:**

* Grid atau tabel:

  * Logo, Nama, Lokasi, Jumlah Loker, Status Verifikasi (Verified / Belum).
* Tombol “Verifikasi Perusahaan” untuk menandai sumber terpercaya.
* Filter: Kecamatan, Status Verifikasi, Jumlah Posting.
* Klik perusahaan → lihat profil + semua loker terkait.

**UX:**

* Bisa upload logo perusahaan langsung dari modal edit.
* Tooltip: tampilkan kontak HR, email, WA.

---

## 👥 HALAMAN MEMBER

### Tujuan:

Memantau dan mengelola member VIP Basic & Premium.

**UI:**

* Tabel dengan kolom:

  * Nama
  * Email
  * Jenis Member (Basic / Premium)
  * Status (Aktif / Nonaktif)
  * Tanggal Bergabung
  * Expired / Lifetime
  * Aksi: 🔄 Perpanjang | 🔒 Nonaktifkan
* Filter: Jenis Member, Status, Rentang Waktu.

**UX:**

* Klik nama → modal detail (riwayat login, pembelian, upgrade).
* Badge warna berbeda untuk Premium Lifetime.
* Notifikasi otomatis saat masa aktif <7 hari (tampil di Dashboard utama).

---

## 📊 ANALITIK & LAPORAN

### Tujuan:

Menampilkan insight tentang performa portal & engagement pengguna.

**UI:**

* Grafik ringkasan:

  * “Jumlah Loker Baru per Minggu”
  * “Kategori Terpopuler”
  * “Lokasi Terbanyak Posting”
  * “CTR (Klik Apply) per Kategori”
* Top 5 perusahaan dengan posting terbanyak.
* Top 5 loker dengan view tertinggi.
* Tombol “Unduh Laporan (PDF/CSV)”.

**UX:**

* Klik grafik → buka tabel detail.
* Tooltip data saat hover.
* Notifikasi “Laporan mingguan berhasil dikirim ke email admin.”

---

## 🧠 TOOLS AI (Khusus Admin)

### Tujuan:

Kumpulkan semua fitur AI dalam satu tempat.

**UI:**

* **AI Parser Poster**
  Jalankan analisa ulang poster lama.
* **AI Caption Generator**
  Ketik “Loker Kasir Jombang” → hasil caption WA/IG lengkap emoji & hashtag.
* **AI Text Cleaner**
  Bersihkan format teks WA sebelum di-upload.
* **AI Duplikat Checker**
  Paste teks → tampilkan hasil perbandingan dengan database.

**UX:**

* Panel kanan menampilkan hasil langsung (no refresh).
* Tombol “Salin Hasil” di tiap tool.

---





## 🎨 ARAH DESAIN UI

* Layout dashboard modular (card-grid + section collapsible).
* Warna dominan abu muda & biru lembut, aksen emas untuk premium.
* Gunakan icon lucide-react (ringan & profesional).
* Komponen utama: Card, Table, Tabs, Chart, Modal, Tooltip, Toast.
* Transisi lembut antar halaman (fade & slide).
