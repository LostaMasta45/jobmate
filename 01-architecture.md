# 01 — Arsitektur & Struktur Proyek (JobMate 2.0)

Tujuan: fondasi struktur, routing, layout, proteksi, dan integrasi inti untuk build JobMate 2.0.

---

## ⚙️ Stack Teknis
- **Next.js** (App Router, TypeScript, Server/Client Components, Server Actions)
- **TailwindCSS + shadcn/ui + lucide-react + framer-motion**
- **Supabase** (Auth, Postgres, RLS, Storage)
- **OpenAI API** (generator teks)
- **iLovePDF API** (PDF ops)
- **Telegram Bot** (notifikasi admin & user)

---

## 🧩 Struktur Direktori
/app
├─ ajukan-akun/ # Form pengajuan akun (public)
│ └─ terima-kasih/ # Tombol hubungkan Telegram (deep link /start)
├─ (auth)/ # sign-in, reset, verify (tanpa public sign-up)
├─ (protected)/
│ ├─ dashboard/ # Home pengguna
│ ├─ tools/
│ │ ├─ cover-letter/
│ │ ├─ cv-ats/
│ │ ├─ cv-profile/
│ │ ├─ email-template/
│ │ ├─ tracker/
│ │ ├─ pdf-tools/
│ │ └─ wa-generator/
│ └─ settings/
├─ (admin)/
│ ├─ applications/ # Daftar + detail pengajuan; Approve/Reject
│ └─ settings/ # Set BOT_TOKEN & admin chat id
├─ layout.tsx # Layout global (theme, font, toasts)
└─ page.tsx # Landing/redirect
/components
├─ ui/ # Komponen shadcn/ui
├─ layout/ # Sidebar, Topbar, PageHeader, Empty/Skeleton
├─ forms/ # Reusable form (RHF + zod)
└─ shared/ # Table, Kanban, Upload, PDF widgets
/actions # Server Actions: auth, admin, telegram, tools
/lib # supabaseClient, openai, ilovepdf, telegram, utils
/db # migrations & seeds (SQL/Drizzle)
/styles # tailwind.css, globals.css
/types # zod schemas & TS types


---

## 🧭 Peta Rute
- **Public**: `/ajukan-akun`, `/ajukan-akun/terima-kasih`, `/auth/(sign-in|reset|verify)`
- **Protected (user)**: `/dashboard`, `/tools/*`, `/settings`
- **Admin-only**: `/admin/applications`, `/admin/settings`

> Pendaftaran user **hanya** via `/ajukan-akun`. Tidak ada sign-up publik.

---

## 🔒 Proteksi & Guard
- Middleware:
  - User tidak login → redirect ke `/auth/sign-in`
  - User belum terverifikasi → redirect ke `/auth/verify`
  - Guard admin untuk `/admin/*` → cek `profiles.role === 'admin'`
- RLS Supabase aktif (user hanya akses data miliknya).

---

## 🗃️ Skema Data (inti fase ini)
- `account_applications`: pengajuan akun (pending/approved/rejected), proof_path (Storage), telegram_link_code, telegram_chat_id
- `profiles`: profil user (id=auth.uid(), name, email, role)
- `admin_settings`: telegram_bot_token, telegram_admin_chat_id
> Tabel tools (resumes, applications, templates, documents, dll) dibuat pada fase berikutnya.

---

## 🔔 Alur Telegram
1) Submit pengajuan → kirim notif ke **Admin Chat** (ringkasan + link detail).  
2) Halaman **Terima Kasih** menampilkan tombol **Hubungkan Telegram** (`/start <code>`).  
3) Webhook bot menyimpan `telegram_chat_id` ke row pengajuan.  
4) Saat **Approve/Reject** → kirim DM ke user (jika chat id tersedia), fallback email.

---

## 🧱 Layout & UX
- Sidebar collapsible, Topbar (search stub, notif stub, user menu)
- PageHeader (title, breadcrumb, CTA)
- Dark/Light mode (persist)
- Empty states + Skeleton
- Komponen form pakai RHF + zod; toasts konsisten

---

## 🔑 Environment
Gunakan `.env.local`:
- API Key: `your-openai-api-key-here`
- PDF Service: **iLovePDF API**
  - Secret Key: `your-ilovepdf-secret-key-here`
  - Public Key: `your-ilovepdf-public-key-here`
  - Telegram CHAT ID : your-telegram-chat-id
  - Telegram BOT TOKEN : your-telegram-bot-token
  - Anon Public Supabase : your-supabase-anon-key
  - Project URL supabase : your-supabase-project-url

  
---

## ✅ Output yang Diharapkan (akhir fase arsitektur)
- Folder & routing siap, layout dasar jalan, tema siap.
- Rute public/protected/admin terpisah jelas, guard terpasang.
- Modul helper (`/lib`) & kerangka Server Actions (`/actions`) tersedia.
- Siap lanjut ke implementasi **Auth & Approval** di `02-auth-and-approval.md`.
