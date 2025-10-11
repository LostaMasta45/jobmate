# 02 — Auth & Approval (Ajukan Akun + Admin + Telegram)

Target: Registrasi TIDAK langsung membuat akun. User mengajukan lewat `/ajukan-akun`, admin menilai di `/admin/applications`, lalu sistem membuat akun Supabase saat disetujui. Semua status mengirim notifikasi Telegram.

---

## Rute & Halaman
- `/ajukan-akun` (public) — form pengajuan
- `/ajukan-akun/terima-kasih` — tombol **Hubungkan Telegram**
- `/auth/(sign-in|reset|verify)` — login setelah disetujui
- `/admin/applications` (admin-only) — daftar & detail pengajuan + aksi **Setujui/Tolak**
- `/admin/settings` (admin-only) — set `TELEGRAM_BOT_TOKEN`, `TELEGRAM_ADMIN_CHAT_ID`

---

## Database (Supabase)

### Tabel
**1) `account_applications`**
- `id uuid pk default gen_random_uuid()`
- `full_name text not null`
- `username text not null unique`
- `email text not null unique`
- `whatsapp text not null`
- `proof_path text not null`            # path di Storage (folder `proofs/`)
- `status text not null default 'pending'`  # 'pending' | 'approved' | 'rejected'
- `rejection_reason text`
- `encrypted_password text`             # opsional; auto-purge saat approved
- `telegram_chat_id text`
- `telegram_link_code text unique`      # digunakan saat deep-link /start
- `approved_by uuid`
- `approved_at timestamptz`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

**2) `profiles`**
- `id uuid pk` = `auth.uid()`
- `name text`
- `role text default 'user'`            # 'user' | 'admin'
- `email text`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

**3) `admin_settings`** (single row; atau gunakan pk tetap)
- `id int pk default 1`
- `telegram_bot_token text`
- `telegram_admin_chat_id text`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

### RLS & Policy (garis besar)
- `account_applications`:
  - **SELECT/UPDATE** oleh pemohon hanya untuk row miliknya → cocokkan via email token/signed JWT (server action memberi signed access); **INSERT** public (form ajukan).
  - **SELECT/UPDATE/DELETE** admin penuh.
- `profiles`:
  - user: hanya `id = auth.uid()`.
  - admin: read-all.
- `admin_settings`: admin-only.

> Implementasikan policy SQL eksplisit (SELECT/INSERT/UPDATE/DELETE) sesuai prinsip di atas.

---

## Storage
- Bucket `proofs` (private).  
- Upload bukti transfer (jpg/png/pdf) dari `/ajukan-akun`. Simpan path ke `proof_path`.  
- Admin dapat membuka preview melalui **signed URL** (server action).

---

## Alur Bisnis

### 1) Pengajuan (/ajukan-akun)
Form fields:
- `full_name`, `username`, `email`, `whatsapp`, `password` (opsional*), `proof_transfer` (file)

Langkah:
1. Validasi zod (format email/username unik, ukuran file, mime).
2. Upload file → dapatkan `proof_path`.
3. Generate `telegram_link_code` (uuid/shortid).
4. **(Opsional keamanan)**: `password` dienkripsi AES-256 → `encrypted_password`. *Atau lebih baik: skip password; nanti kirim link set password.*
5. Insert row `pending` ke `account_applications`.
6. Kirim **Telegram** ke admin: ringkasan + link ke `/admin/applications/[id]`.
7. Redirect ke `/ajukan-akun/terima-kasih` (tampilkan tombol “Hubungkan Telegram”).

### 2) Hubungkan Telegram (halaman Terima Kasih)
- Tampilkan tombol: `tg://resolve?domain=<BOT_USERNAME>&start=<telegram_link_code>`
- Endpoint bot (webhook) menyimpan `telegram_chat_id` ke row pengajuan (cari via `telegram_link_code`).

### 3) Review Admin (/admin/applications)
- Tabel + detail view:
  - data pemohon, preview bukti TF (signed URL), status.
  - Tombol **Setujui** / **Tolak**.

**Setujui:**
1. (Opsional) Ambil password:  
   - Jika `encrypted_password` → decrypt → buat **Supabase Auth user** (service role).  
   - Jika tanpa password → buat user, lalu kirim **magic link set password**.
2. Buat row `profiles` (name, email, role 'user').
3. Update `account_applications.status = 'approved'`, set `approved_by`, `approved_at`, purge `encrypted_password`.
4. Kirim **Telegram** ke `telegram_chat_id` (jika ada): “Pengajuan disetujui. Silakan login di /auth/sign-in.”  
   - Jika tidak ada chat id, kirim email.

**Tolak:**
1. Isi `rejection_reason`.
2. Update status → `rejected`.
3. Notif Telegram/email ke pemohon dengan alasan penolakan.

---

## Server Actions / API (contoh modul)
- `/actions/applications.create` — terima pengajuan: upload file, insert row, kirim notif admin.
- `/actions/applications.signUrl` — generate signed URL untuk bukti TF (admin).
- `/actions/admin.approveApplication` — buat user (service key), buat profile, update status, purge password, kirim notif.
- `/actions/admin.rejectApplication` — set status rejected + alasan + notif.
- `/actions/telegram.saveChatId` — webhook: simpan `telegram_chat_id` berdasar `telegram_link_code`.

---

## Integrasi Telegram
- File helper: `/lib/telegram.ts`
  - `getAdminChatId()` → env `TELEGRAM_ADMIN_CHAT_ID` atau dari `admin_settings`.
  - `sendMessage(chatId: string, text: string)` — POST ke `https://api.telegram.org/bot<TOKEN>/sendMessage`.
- Webhook bot:
  - Terima `/start <code>` → parse `<code>` → update `account_applications.telegram_chat_id`.
  - Amankan via token rahasia route.

---

## Variabel Lingkungan (.env.local)
- API Key: `your-openai-api-key-here`
- PDF Service: **iLovePDF API**
  - Secret Key: `your-ilovepdf-secret-key-here`
  - Public Key: `your-ilovepdf-public-key-here`
  - Telegram CHAT ID : your-telegram-chat-id
  - Telegram BOT TOKEN : your-telegram-bot-token
  - Anon Public Supabase : your-supabase-anon-key
  - Project URL supabase : your-supabase-project-url

  
---

## UX & Validasi
- Form ajukan: tampilkan estimasi waktu review + instruksi hubungkan Telegram.
- Status: tampil badge `pending/approved/rejected`.
- Notifikasi toast jelas untuk setiap aksi (submit/approve/reject).
- Admin list: filter by status, search by email/username.

---

## Edge Cases
- Email/username sudah dipakai → blokir saat submit (cek unik).
- File bukti tidak valid → tolak (size/type).
- Approve gagal buat user → rollback & beri pesan admin.
- Telegram tidak terhubung → fallback kirim email.

---

## Definition of Done (DoD) — Fase Auth & Approval
- Pengajuan tersimpan (`pending`) + bukti TF di Storage (private).
- Notif Telegram ke admin saat pengajuan baru.
- Admin bisa **Setujui/Tolak** dengan audit fields tersimpan.
- Saat disetujui: akun Supabase & profile terbentuk; password aman (purge/encrypt) atau magic-link dikirim.
- User bisa login ke `/dashboard`.


- Siap lanjut ke implementasi **Auth & Approval** di `03-database-supabase.md`.