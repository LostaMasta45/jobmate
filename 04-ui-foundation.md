# 04 — UI Foundation (Tailwind + shadcn/ui + Layout)

Tujuan: menyiapkan pondasi UI/UX JobMate 2.0 (tema, komponen dasar, layout dashboard) agar siap diisi fitur.

---

## 1) Instalasi & Inisialisasi

### Dependensi dasar
```bash
# Tailwind + fonts + helper
pnpm add clsx tailwind-merge lucide-react framer-motion

# shadcn/ui (CLI)
pnpm dlx shadcn@latest init

Setup Tailwind

Pastikan tailwind.config.ts berisi preset shadcn dan path komponen:

import { type Config } from "tailwindcss"
import { fontFamily } from "tailwindcss/defaultTheme"

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#14B8A6",   // teal utama
          dark: "#0F766E",
          light: "#2DD4BF",
        },
      },
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        card: "0 10px 30px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

- app/globals.css

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --radius: 0.75rem;
}

Tambah komponen shadcn yang diperlukan

# Komponen umum
pnpm shadcn add button card input textarea label badge tabs
pnpm shadcn add dropdown-menu avatar dialog sheet tooltip toast
pnpm shadcn add table skeleton separator toggle switch checkbox
pnpm shadcn add breadcrumb progress alert select calendar

2) Struktur Layout

/components
  /layout
    Sidebar.tsx
    Topbar.tsx
    PageHeader.tsx
    ThemeToggle.tsx
    AppShell.tsx
  /ui (hasil shadcn)

  AppShell (kerangka halaman)

Menyusun Sidebar (kiri), Topbar (atas), dan children (konten).

Responsif: Sidebar collapsible di mobile (pakai sheet untuk drawer).

Menyediakan area notifikasi/toast.

Spesifikasi minimal AppShell:

Sidebar: logo JobMate, menu utama (Dashboard, Tools, Settings), menu admin (kondisional).

Topbar: breadcrumb ringan, search stub, ThemeToggle, user menu (Profile/Logout).

Main: container max-w-7xl, padding px-4 md:px-6 py-6.

3) Sidebar

Menu (ikon lucide-react):

Dashboard (/dashboard) — LayoutDashboard

Tools (submenu):

Cover Letter (/tools/cover-letter) — FileText

CV ATS (/tools/cv-ats) — FileBadge2

CV Profile (/tools/cv-profile) — IdCard

Email Template (/tools/email-template) — Mails

Tracker (/tools/tracker) — KanbanSquare

PDF Tools (/tools/pdf-tools) — FileCog

WA Generator (/tools/wa-generator) — MessageSquareText

Settings (/settings) — Settings2

(Admin) Applications (/admin/applications) — ShieldCheck

(Admin) Admin Settings (/admin/settings) — SlidersHorizontal

Interaksi:

Highlight route aktif.

Collapsible state simpan di localStorage (jobmate_sidebar_collapsed).

4) Topbar

Elemen:

Breadcrumb (opsional judul halaman)

Search input stub (nonfungsional dulu)

ThemeToggle (dark/light)

User dropdown (Profile, Settings, Logout)

5) PageHeader

Props:

title: string

description?: string

actions?: ReactNode (misalnya tombol “Tambah Lamaran”)

Gaya:

Title text-2xl font-semibold, desc text-muted-foreground

Container: mb-5 flex items-center justify-between gap-3

6) Theme (Dark/Light)

ThemeToggle.tsx:

Menggunakan pattern class pada <html> + simpan preferensi ke localStorage (jobmate_theme = "dark"|"light").

Default: follow system → fallback ke light.

7) Motion & Feedback

Gunakan framer-motion untuk:

Fade-in konten halaman

Hover lift pada Card (sedang)

Gunakan Toast shadcn untuk feedback (success/error)

Gunakan Skeleton untuk loading awal halaman

8) Aksesibilitas & UX

Fokus ring jelas (focus-visible:outline-2).

ARIA label di ikon-only button (ThemeToggle, menu collapse).

Size target minimal 40px untuk tombol-tombol penting.

Kontras teks sesuai WCAG.

9) Warna & Gaya Visual

Aksen merek:

brand.DEFAULT = #14B8A6 (teal)

brand.dark = #0F766E

brand.light = #2DD4BF

Card:

rounded-2xl shadow-card border

Button:

Default solid brand; variant outline & ghost tersedia.

Spasi:

Gunakan gap-4/gap-6 pada grid/cards.

Ikon:

Ukuran standar 18–20px, konsisten.

10) Acceptance Criteria (UI Foundation)

 Sidebar (desktop & mobile drawer) berfungsi + state collapse tersimpan.

 Topbar tampil dengan ThemeToggle & user dropdown.

 PageHeader reusable di halaman protected.

 Dark/Light mode bekerja & persist.

 Komponen shadcn terpasang dan siap dipakai tools.

 Layout responsif & aksesibel (keyboard/focus).

11) Tindak Lanjut (Hook Up Layout ke Routes)

Gunakan layout segment untuk protected routes:

app/(protected)/layout.tsx → bungkus halaman dengan <AppShell>.

Public (ajukan-akun, auth) memakai layout minimal tanpa Sidebar.

12) Langkah Manual Singkat

Jalankan perintah instalasi & shadcn add (di atas).

Buat file komponen layout (Sidebar, Topbar, PageHeader, ThemeToggle, AppShell).

Terapkan AppShell pada app/(protected)/layout.tsx.

Uji dark/light, responsif mobile, toasts, skeleton.

▶️ Next Step

Jika UI foundation ini selesai dan stabil, lanjutkan ke:

# Next step:
05-dashboard.md
