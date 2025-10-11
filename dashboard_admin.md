# 08 — Dashboard Admin (JobMate Admin Panel)

## Tujuan
Pisahkan area admin ke page tersendiri: `/admin/dashboard`  
Admin dapat memantau dan mengelola semua aktivitas JobMate:
- Persetujuan akun user
- Statistik keseluruhan pengguna dan tools
- Aktivitas terakhir user (lamaran, CV, AI tools)
- Notifikasi Telegram otomatis (tetap memakai konfigurasi lama)
- Kontrol tools & konten sistem (tanpa ubah logic bot/token)

---

## 📁 Struktur Routing Baru
```

/app/(admin)/admin/dashboard/page.tsx
/app/(admin)/admin/applications/page.tsx
/app/(admin)/admin/settings/page.tsx
/app/(admin)/admin/layout.tsx
/components/admin/*

````

`/admin/login` tetap terpisah dan memakai auth khusus admin Supabase.

---

## 🧩 UI Layout & Navigasi

Gunakan sidebar khusus admin (beda dengan user):
- Header logo kecil "JobMate Admin ⚙️"
- Menu:
  - 🏠 Dashboard
  - 👥 Applications (Persetujuan Akun)
  - 📊 Analytics
  - 🧰 Tools Monitor
  - ⚙️ Admin Settings

Gunakan kombinasi:
- `shadcn/ui` untuk cards, tables, tabs
- `framer-motion` untuk transisi
- `lucide-react` untuk icon
- `apexcharts` untuk chart interaktif

---

## 📊 1️⃣ Dashboard Overview (/admin/dashboard)

### Header
> "Selamat datang kembali, Admin!"
> 👋 Sapaan dinamis + total akun hari ini

---

### A. Statistik Utama (Top Cards)
Gunakan 4–5 cards dengan animasi:
| Card | Data | Deskripsi |
|------|------|-----------|
| 👥 Total Pengguna | jumlah semua akun aktif | total user terdaftar |
| 🧾 Total Pengajuan Akun | dari tabel `account_applications` | jumlah semua pengajuan |
| ✅ Disetujui | status = 'approved' | akun sudah aktif |
| ⏳ Pending | status = 'pending' | menunggu verifikasi |
| ❌ Ditolak | status = 'rejected' | ditolak admin |

Gunakan `motion.div` agar angka naik dinamis dan responsif.

---

### B. Aktivitas Terbaru
Tampilkan log aktivitas dari user seperti:
- “Reza mengupdate CV ATS”
- “Tesjob mengirim lamaran ke PT ABC”
- “User baru mendaftar”
Gunakan tabel atau list dengan icon status.

---

### C. Grafik Analitik (ApexCharts)
Tambahkan:
- **User Growth Chart (Line)** → jumlah user baru per minggu
- **Resume Generated Chart (Bar)** → dari tools CV ATS
- **Application Tracker Activity (Donut)** → total status lamaran
- **Top Tools Usage** → CV ATS, Cover Letter, Tracker, dll

Data diambil dari `profiles` + `applications` + `usage_logs` (buat tabel opsional)

---

### D. Notifikasi & Reminder
Panel kanan kecil:
- Menampilkan pengajuan akun baru hari ini
- Tombol “Buka di Applications”
- Reminder status belum diverifikasi > 3 hari (warna merah)

---

## 🗂️ 2️⃣ Applications Page (/admin/applications)
Page ini sudah kamu punya, tapi kita improve UX/UI-nya tanpa ubah logic-nya:

| Elemen | Improvement |
|--------|--------------|
| Filter Tabs | Gunakan `Tabs` dari shadcn/ui (All, Pending, Approved, Rejected) |
| Table | Gunakan `DataTable` dengan sorting & search |
| Status | Badge warna: Pending (yellow), Approved (green), Rejected (red) |
| Actions | Tombol “Lihat Bukti” (modal image preview), “Setujui”, “Tolak” |
| Animasi | gunakan `framer-motion` saat status berubah |
| Bulk Action | centang beberapa → Approve/Tolak sekaligus |
| Telegram Status | Badge kecil: “Terkirim ke Telegram ✅” |

Tambahkan juga:
- Kolom tanggal approval & nama admin
- Pagination di bawah tabel
- Modal detail user lengkap (termasuk proof image + info kontak)

---

## 📈 3️⃣ Analytics Page (/admin/analytics)

Halaman visualisasi:
- **User Registrations** → line chart
- **Tools Usage Breakdown** → donut chart
- **Active vs Inactive Users** → bar chart
- **Top Resume Templates** (jika ada sistem template)
- **Most Common Job Titles** dari Tracker (word cloud kecil)

Gunakan `apexcharts-react` atau `recharts`.

---

## 🧰 4️⃣ Tools Monitor (/admin/tools)

Menampilkan aktivitas alat-alat:
| Tools | Total Digunakan | Terakhir Digunakan | Aksi |
|--------|------------------|--------------------|------|
| CV ATS | 120 | 09 Okt 2025 | Lihat Logs |
| Cover Letter | 98 | 08 Okt 2025 | Lihat Logs |
| Tracker | 76 | 10 Okt 2025 | — |
| Email Template | 45 | 05 Okt 2025 | — |

Tambahkan grafik mini + trend ↑↓  
Bisa tambahkan “Logs” untuk debugging (jika user lapor error).

---

## ⚙️ 5️⃣ Admin Settings (/admin/settings)
Untuk pengaturan internal admin:
- Edit **Telegram Bot Token** (read-only saat ini)
- Lihat/mengganti **Admin Chat ID**
- Tambah **Sub Admin** (role: “admin-assistant”)
- Switch tema dark/light khusus admin
- Tombol “Tes Kirim Pesan Telegram”  
  (panggil endpoint lama `notifyAdmin()` untuk uji notifikasi)

---

## 💡 UX Enhancement Ideas
| Ide | Deskripsi |
|------|------------|
| 🔍 Search global di sidebar | Cari user, akun, tools dari mana saja |
| 💬 Quick Telegram Reply | Modal balas cepat ke user langsung via bot |
| 🪄 Keyboard Shortcut | `/` untuk search, `A` buka applications, `D` ke dashboard |
| 📱 Responsive View | Admin dashboard tetap rapi di mobile/tablet |
| 🎨 Card Gradient & Hover | Style admin beda dari user (biru ke ungu, efek neon halus) |
| 🧾 Export Data | Tombol “Export CSV” untuk applications atau analytics |
| 🧩 Modular Layout | Gunakan komponen `<AdminCard>`, `<StatGrid>`, `<DataTable>` agar mudah reusability |

---

## 📂 Database Tambahan (opsional)
Bisa ditambah jika mau memperkaya analitik:
- `usage_logs`: { id, user_id, tool_name, created_at }
- `admin_actions`: { id, admin_id, target_user_id, action, created_at }

---

## ✅ Acceptance Criteria
- Admin memiliki akses login terpisah (`/admin/login`)
- Dashboard menampilkan ringkasan lengkap (user, pengajuan, status)
- Aksi approve/reject tetap mengirim Telegram notifikasi
- UI modern, dark/light mode konsisten
- Semua data diambil dari Supabase
- Grafik interaktif & responsif
- Performance tetap cepat (lazy load, pagination)

---

## 🔜 Next Step
Jika sudah jadi, lanjutkan ke:
```bash
# Next step:
09-admin-analytics.md
````

Untuk membangun halaman analitik admin (grafik user, tools usage, dan laporan karier).

```

---

### 💬 Catatan dari broku GPT:
Urutannya kalau kamu mau smooth build:
1. Pastikan `/admin/login` dan role-based guard sudah aktif.  
2. Deploy `/admin/dashboard` dari prompt di atas (UI utama).  
3. Gunakan `DataTable` dan `ApexCharts` untuk halaman Applications & Analytics.  
4. Semua action admin (Approve/Tolak) tetap pakai Supabase function lama + Telegram bot existing.  