# 🧠 JobMate 2.0 — Brief Ringkas (Ajukan Akun + Admin Approval + Telegram)

Bangun **JobMate 2.0** dengan **Next.js + Tailwind + shadcn/ui + Supabase + OpenAI + iLovePDF + Telegram Bot**.  
Fokus awal: **registrasi via “Ajukan Akun”**, **approval di admin**, dan **notifikasi Telegram**.

---

## ⚙️ Stack
- Next.js (App Router, TypeScript), Tailwind, shadcn/ui, lucide-react, framer-motion  
- Supabase (Auth, Postgres, RLS, Storage)  
- OpenAI (generator teks), iLovePDF (PDF tools)  
- Telegram Bot API (notifikasi)

---

## 🧭 Rute Utama
- `/ajukan-akun` — form pengajuan (public)
- `/auth/(sign-in|reset|verify)` — login & verifikasi
- `/dashboard` — area pengguna (protected)
- `/admin/applications` — daftar & detail pengajuan (admin-only)
- `/admin/settings` — set **Telegram Bot Token**, **Admin Chat ID**, dll (admin-only)
- `/tools/*` — fitur (cover letter, CV ATS, tracker, pdf, dst) — nanti

> **Catatan**: Pendaftaran **tidak** lewat sign-up publik. User mengisi **Ajukan Akun** → admin menyetujui → sistem membuat akun Supabase → user login.

---

## 📝 Form “Ajukan Akun”
Field:
- **Nama Lengkap**, **Username unik**, **Email aktif**, **No. WhatsApp**, **Password**, **Upload SS bukti transfer** (jpg/png/pdf)
- Tampilkan info: “Setelah disetujui, Anda akan menerima notifikasi via Telegram/Email.”

**Keamanan Password (wajib):**  
- Simpan password secara **terenkripsi** (AES-256) di `encrypted_password`, **hapus otomatis** setelah akun dibuat.  
- Alternatif (disarankan): **abaikan password** dari form, kirim **magic link** “set password” saat disetujui.

---

## 🧩 Database (tabel inti fase ini)
- `account_applications`  
  - `id`, `full_name`, `username`, `email`, `whatsapp`, `proof_path` (Storage),  
    `status` ('pending'|'approved'|'rejected'), `rejection_reason`,  
    `encrypted_password` (nullable, auto-purge),  
    `telegram_chat_id` (nullable), `telegram_link_code`,  
    `approved_by`, `approved_at`, `created_at`, `updated_at`
- `profiles` (id = auth.uid(), name, role, …)
- `admin_settings` (single row): `telegram_bot_token`, `telegram_admin_chat_id`

**RLS:**  
- `account_applications`: user **hanya bisa melihat miliknya** (via email hash/signed link), admin full-access.  
- `profiles`: user hanya boleh akses miliknya.  
- `admin_settings`: admin-only.

---

## 🤖 Telegram Flow
- Saat pengajuan dibuat:
  - Kirim notif ke **Admin Chat**: ringkasan + link `/admin/applications/[id]` + URL bukti TF.
- Halaman “Terima Kasih” menampilkan tombol **“Hubungkan Telegram”**:
  - `t.me/<BOT>?start=<telegram_link_code>` → bot menyimpan `telegram_chat_id` ke pengajuan.
- Saat **Approved/Rejected**:
  - Jika `telegram_chat_id` tersedia → kirim DM status + instruksi login / alasan penolakan.
  - Jika tidak, fallback ke email.

---

## 🔐 Environment (.env.local)
 - API Key: `your-openai-api-key-here`
- PDF Service: **iLovePDF API**
  - Secret Key: `your-ilovepdf-secret-key-here`
  - Public Key: `your-ilovepdf-public-key-here`
  - Telegram CHAT ID : your-telegram-chat-id
  - Telegram BOT TOKEN : your-telegram-bot-token
  - Anon Public Supabase : your-supabase-anon-key
  - Project URL supabase : your-supabase-project-url

  
---

## 🏗️ Step-by-Step (fase 1)
1) **Scaffold proyek**: Next.js + Tailwind + shadcn/ui; setup layout (Sidebar/Topbar), theme.  
2) **Supabase**: buat tabel `account_applications`, `profiles`, `admin_settings`; aktifkan **RLS**.  
3) **/ajukan-akun**: form + upload ke Storage (folder `proofs/`); simpan row `pending`.  
4) **Telegram**: helper server untuk kirim pesan ke **Admin Chat** setelah pengajuan.  
5) **Link Telegram User**: halaman “Terima Kasih” + tombol deep-link `start=<code>`; endpoint bot menyimpan `telegram_chat_id`.  
6) **/admin/applications**: table + detail → tombol **Setujui/Tolak**.  
   - **Setujui**: (a) buat user di Supabase Auth, (b) buat `profiles`, (c) hapus `encrypted_password`, (d) update status.  
   - Kirim **notif Telegram** ke pemohon (atau email) dengan instruksi login.  
7) **/auth**: Sign-in, Reset, Verify berfungsi; proteksi route ke `/dashboard`.  

> Setelah fase 1 beres, lanjutkan implementasi fitur tools (AI & PDF) sesuai brief berikutnya.

---

## ✅ DoD (Definition of Done) Fase 1
- Pengajuan akun berfungsi, bukti TF tersimpan, status `pending`.  
- Admin dapat menyetujui/menolak; akun Supabase tercipta; profil dibuat.  
- Notifikasi Telegram ke admin & user berjalan; password aman (purge/enkripsi).  
- Proteksi route & RLS aktif; user dapat login ke `/dashboard`.


> Setelah membaca README ini, lanjutkan dengan file `01-architecture.md` untuk struktur proyek dan routing lengkap.
