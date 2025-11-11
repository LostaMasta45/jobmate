Kamu adalah full-stack engineer senior dan UI/UX designer profesional. Tugasmu adalah membangun ulang aplikasi web bernama **JobMate 2.0** — platform all-in-one untuk pencari kerja, menggunakan teknologi modern dengan tampilan dashboard elegan dan fitur AI.

---

## 🧠 TEKNOLOGI UTAMA
- Framework: **Next.js (App Router, TypeScript, Server Components)**
- UI: **Tailwind CSS + shadcn/ui + lucide-react + framer-motion**
- Database & Auth: **Supabase** (RLS diaktifkan)
- AI: **OpenAI API**
  - API Key: `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`
- PDF Service: **iLovePDF API**
  - Secret Key: `secret_key_e5ab451ba8a4c44e27be1d3ea3aece59_-Qc-Jad36a6d0a84b10be065dd9b3e865c7b8`
  - Public Key: `project_public_fa1dce6798894535b5cd082c0a8684dd_kYQjM6f1f2428afa806b693d33f63f8a9ecd8`
- State: **React Query / Zustand** (optional)
- Deploy: **Vercel**

---

## 🎯 TUJUAN
Membangun ulang JobMate agar:
1. **Dashboard tampil modern & interaktif**
2. **Semua tools terintegrasi ke AI Generator**
3. **Data tiap user tersimpan di Supabase (per user_id)**
4. **Setiap generator bisa hasilkan teks dari OpenAI**
5. **Fitur PDF tools berfungsi via iLovePDF API**
6. **Dark mode dan light mode aktif**
7. **UI bergaya shadcn, UX halus dan nyaman**

---

## 🧩 STRUKTUR FITUR

### 🔹 DASHBOARD (/dashboard)
- Tampilan mirip gambar referensi:
  - Header: “Halo [nama], selamat datang di JobMate!”
  - Statistik kartu: Total Lamaran, Dalam Proses, Diterima, Ditolak
  - Tabel “Lamaran Terbaru” + “Timeline Progress”
  - Riwayat CV + tombol Refresh
  - Menu Tools Tersedia (grid cards): Cover Letter, CV ATS, CV Profile, Template Email, Tracker, PDF Tools, WA Generator
- Data berasal dari tabel Supabase (`applications`, `resumes`, `profiles`)

---

### 🔹 COVER LETTER GENERATOR (/cover-letter)
Form Input:
- Nama Lengkap  
- Email  
- Nama Perusahaan  
- Posisi yang Dilamar  
- Skill Utama  
- Pengalaman Singkat  
- Alasan Melamar  
- Nada Bahasa (Formal / Semi-formal / Santai)

Fungsi:
- Kirim ke OpenAI API untuk generate surat lamaran otomatis
- Hasil muncul di panel kanan (bisa disalin atau diunduh PDF)
- Tombol: [Generate Surat Lamaran] + [Unduh PDF]

---

### 🔹 CV ATS GENERATOR (/cv-ats)
- Input Judul Resume
- Pilih Template (minimal 2 style)
- Tambah/Edit data CV (nama, kontak, pendidikan, pengalaman, skill)
- AI Generator:
  - Ambil input job description → generate bullet point pengalaman relevan
  - Beri **ATS Score & Saran perbaikan**
- Simpan ke Supabase + export PDF
- Tabel daftar CV di sisi kanan

---

### 🔹 CV PROFILE GENERATOR (/cv-profile)
Form:
- Nama Lengkap  
- Pendidikan Terakhir  
- Pengalaman Kerja (opsional)  
- Skill Utama  
- Pekerjaan yang Dilamar  
- Gaya Bahasa

AI:
- Gunakan OpenAI API untuk membuat ringkasan profil profesional (“About Me” section)
- Output muncul di panel kanan, bisa disalin atau simpan ke resume

---

### 🔹 EMAIL TEMPLATE GENERATOR (/email-template)
Form:
- Nama Lengkap  
- Posisi  
- Nama Perusahaan  
- Sumber Lowongan  
- Alasan Melamar  
- Keahlian / Kualifikasi  
- Gaya Bahasa (Profesional / Ramah)
- Checkbox: “Melampirkan CV”

AI:
- Generate email lamaran kerja otomatis
- Output bisa di-copy, simpan ke template user, atau ekspor PDF

---

### 🔹 JOB APPLICATION TRACKER (/tracker)
Form Input:
- Nama Perusahaan  
- Posisi  
- Tanggal Apply  
- Media/Sumber Lowongan  
- Gaji  
- Nama HRD / Kontak  
- No WhatsApp HRD  
- Link Lowongan  
- Upload Poster  
- Status (Terkirim, Diundang, Ditolak, Diterima)  
- Catatan

Tampilan kanan:
- Statistik: Total, Proses, Diterima, Ditolak
- Timeline card (per perusahaan)  
- Tombol “Lihat Progress” → membuka detail
- Semua tersimpan di tabel `applications` Supabase (user_id spesifik)

---

### 🔹 PDF TOOLS (/pdf-tools)
Integrasi API iLovePDF:
- Gabungkan PDF  
- Pisahkan PDF  
- Kompres PDF  
- Word → PDF  
- HTML → PDF  
- Ekstrak Halaman  
- Atur Ulang Halaman  
- Gambar → PDF  
- Putar PDF  

Semua action dipanggil via iLovePDF API (gunakan key dari env).

---

### 🔹 WA MESSAGE GENERATOR (/wa-generator)
Form:
- Nama Lengkap  
- Posisi  
- Nama Perusahaan  
- Sumber Lowongan  
- Gaya Bahasa (Profesional / Ramah)  
- Checkbox: “Sertakan CV”

AI:
- Generate pesan WhatsApp profesional untuk HRD
- Output muncul di panel kanan + tombol “Copy Pesan”

---

## ⚙️ DATABASE (Supabase)
Tabel:
- `profiles` → data user  
- `resumes` → CV dan hasil ATS  
- `applications` → tracker lamaran  
- `templates` → email & WA template  
- `documents` → file PDF hasil tools  
- `allowlist_emails` → user yang diizinkan  
- Semua tabel aktif RLS (akses hanya `auth.uid()`)

---

## 🧠 IMPROVEMENT TAMBAHAN
- Tambahkan **AI Smart Suggestion Panel** di Dashboard (contoh: “Saran pekerjaan sesuai skill”)
- Tambahkan **Mode Preview CV Langsung** di CV ATS Generator
- Tambahkan **AI Help Assistant (chat mini)** di pojok kanan bawah
- Tambahkan notifikasi toast untuk aksi sukses/error
- Gunakan **glassmorphism card style + animasi hover elegan**
- Gunakan warna aksen utama: `#14B8A6` (Teal JobMate)
- Navigasi sidebar interaktif dengan ikon & label tool
- Responsif penuh (desktop → tablet → mobile)

---

## 📦 STRUKTUR PROJECT
- `/app/(auth)/sign-in|sign-up|verify`
- `/app/(protected)/dashboard`
- `/app/(protected)/cover-letter`
- `/app/(protected)/cv-ats`
- `/app/(protected)/cv-profile`
- `/app/(protected)/email-template`
- `/app/(protected)/tracker`
- `/app/(protected)/pdf-tools`
- `/app/(protected)/wa-generator`
- `/components` → UI, Layout, Card, Modal, Form
- `/lib` → supabaseClient.ts, openaiClient.ts, pdfClient.ts
- `/actions` → server actions tiap fitur
- `.env.example` → semua API key

---

## 🔐 ENVIRONMENT VARIABLES

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=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
ILOVE_SECRET_KEY=secret_key_e5ab451ba8a4c44e27be1d3ea3aece59_-Qc-Jad36a6d0a84b10be065dd9b3e865c7b8
ILOVE_PUBLIC_KEY=project_public_fa1dce6798894535b5cd082c0a8684dd_kYQjM6f1f2428afa806b693d33f63f8a9ecd8


---

## 🎨 GAYA VISUAL
- Tema utama: **Dark Modern Dashboard**
- Warna utama: `#14B8A6` dan `#0F766E`
- Font: `Inter` / `Plus Jakarta Sans`
- Gunakan spacing longgar & border radius `2xl`
- Gunakan komponen `Card`, `Badge`, `Button`, `Tabs`, `DataTable`, `Dialog` dari shadcn/ui
- Transisi lembut (framer-motion) antar halaman

---

## ✅ DELIVERABLE
- Semua halaman dan fitur CRUD aktif
- AI Generator berfungsi di setiap tool
- PDF Tools terhubung ke API
- Dashboard modern seperti referensi gambar
- Data tersimpan per user (Supabase)
- Proyek siap deploy di Vercel

---

Buat proyek ini **dari nol (full build)**, pastikan UI-UX nya profesional dan interaktif. Gunakan komponen shadcn modern, layout yang seimbang, animasi lembut, dan koneksi penuh antara AI + Supabase + PDF API.


