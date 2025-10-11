# 05 — Dashboard

Tujuan: Halaman ringkasan yang informatif + cepat dipakai untuk aksi utama.  
Rute: `/dashboard` (protected, pakai `(protected)/layout.tsx` + `<AppShell>`).

---

## 1) Struktur UI (wireframe)

PageHeader
- title: "Halo, {nama} 👋"
- description: "Ringkasan progres lamaran dan alat bantu karier."
- actions: [Tambah Lamaran] [Buat Resume]

Grid konten (desktop 12-col, gap-6):
- Row 1 (12):
  - **Stat Cards (4 col x 3)**: Total, Dalam Proses, Diterima, Ditolak
- Row 2 (12):
  - **Pipeline Snapshot (6)** — mini-kanban/stacked counts
  - **Upcoming & Reminders (6)** — interview terdekat & next actions
- Row 3 (12):
  - **Lamaran Terbaru (7)** — table 5 entri, kolom: Perusahaan, Posisi, Status, Tanggal
  - **Resume Health (5)** — skor ATS resume default + tips ringkas
- Row 4 (12):
  - **Tools Grid (12)** — 2 baris kartu (Cover Letter, CV ATS, CV Profile, Email, Tracker, PDF, WA)
- Footer kecil: versi app + tautan (Privacy, Terms)

Mobile: stack cards (kolom 1), Tools Grid 2 kolom.

---

## 2) Data Sumber

- `profiles` → name, role
- `applications` → status, created_at, next_action_at, role, company
- `application_events` → timeline (occurred_at, type, note)
- `interviews` → scheduled_at, application_id
- `resumes` → default resume + `ats_score`

> Semua query dilakukan via **Server Actions** (`/actions/dashboard/*`) agar aman (RLS).  
> Tampilkan **Skeleton** saat loading, dan **Empty State** saat data kosong.

---

## 3) Server Actions (kontrak)

Buat folder: `/actions/dashboard/`

1. `getDashboardStats()` → return:
   ```ts
   type DashboardStats = {
     total: number
     in_progress: number   // Applied+Screening+Interview+Offer
     accepted: number      // Hired
     rejected: number      // Rejected
   }

getPipelineSnapshot() → return count per status:

 type PipelineSnapshot = Record<"Applied"|"Screening"|"Interview"|"Offer"|"Hired"|"Rejected", number>


getUpcoming() → return 5 terdekat gabungan:

 type Upcoming = Array<{
  type: "interview"|"followup"
  date: string // ISO
  company: string
  role: string
  link?: string // optional
}>


getRecentApplications(limit=5) → table data ringkas


getResumeHealth() → resume default (jika ada): { title, ats_score, last_updated, tips: string[] }


Gunakan Supabase server client; pastikan hanya mengakses row milik auth.uid() (RLS enforce).

4) Kartu & Komponen
A. Stat Cards
Komponen: <StatCard icon title value subtitle>


4 kartu:


Total Lamaran


Dalam Proses (Applied+Screening+Interview+Offer)


Diterima (Hired)


Ditolak (Rejected)


Gaya: Card shadcn, ikon lucide, angka besar text-3xl font-semibold, trend badge opsional.


B. Pipeline Snapshot
Komponen: <PipelineBar data={PipelineSnapshot}>


Tampilan: horizontal stacked bar (progress) + legenda mini


Tooltip sederhana: status + jumlah


Empty State: “Belum ada lamaran. Mulai dari tombol ‘Tambah Lamaran’.”


C. Upcoming & Reminders
Komponen: <UpcomingList items={Upcoming}>


Item: ikon (calendar/clock), tanggal format lokal, judul: Interview di {company}, sub: {role}


CTA sekunder: “Lihat Semua” → /tools/tracker atau /tools/interview


Jika kosong: card dengan CTA “Jadwalkan Interview” (link ke interview form).


D. Lamaran Terbaru (Table)
Komponen: <DataTable columns data> (reuse shadcn table)


Kolom: Perusahaan, Posisi, Status (badge warna), Tanggal (created_at)


Row action: “Lihat” → /tools/tracker/[id]


Skeleton 5 baris saat loading.


E. Resume Health
Menampilkan:


Judul resume default


ATS Score (0–100) dengan <Progress />


2–3 tips singkat (bullets)


CTA: “Buka CV ATS” → /tools/cv-ats


Empty State: “Belum ada resume. Buat sekarang.”


F. Tools Grid
7 kartu (shadcn Card + ikon + deskripsi pendek + CTA):


Cover Letter → /tools/cover-letter


CV ATS → /tools/cv-ats


CV Profile → /tools/cv-profile


Email Template → /tools/email-template


Tracker → /tools/tracker


PDF Tools → /tools/pdf-tools


WA Generator → /tools/wa-generator


Desain kartu:
Hover: subtle lift (framer-motion)


Ikon di kiri atas, judul tebal, deskripsi 1 baris, tombol size-sm.



5) Query Logika (ringkas)
Status Map
In-Progress = Applied | Screening | Interview | Offer


Accepted = Hired


Rejected = Rejected


Contoh SQL (panduan di Server Actions)
-- Stats
select
  count(*) as total,
  count(*) filter (where status in ('Applied','Screening','Interview','Offer')) as in_progress,
  count(*) filter (where status = 'Hired') as accepted,
  count(*) filter (where status = 'Rejected') as rejected
from applications
where user_id = auth.uid();

-- Pipeline snapshot
select status, count(*) from applications
where user_id = auth.uid()
group by status;

-- Recent 5
select id, company, role, status, created_at
from applications
where user_id = auth.uid()
order by created_at desc
limit 5;

-- Upcoming (interviews + next_action_at)
-- interviews
select i.scheduled_at as date, a.company, a.role
from interviews i
join applications a on a.id = i.application_id
where a.user_id = auth.uid() and i.scheduled_at >= now()
order by i.scheduled_at asc
limit 5;

-- next actions (fallback)
select next_action_at as date, company, role
from applications
where user_id = auth.uid() and next_action_at is not null and next_action_at >= now()
order by next_action_at asc
limit 5;


6) Empty State & Skeleton Rules
Stat Cards: tetap render, value 0.


Pipeline: kalau semua 0 → tampilkan ilustrasi ringan + CTA “Tambah Lamaran”.


Table: kalau kosong → row kosong + teks “Belum ada data”.


Resume Health: jika tidak ada resume default → card empty dengan tombol “Buat Resume”.


Skeleton:
Stat: shimmer bar 4 kotak


Table: 5 baris skeleton


Pipeline: skeleton bar panjang


Resume Health: progress skeleton + 2 bullet skeleton



7) Aksi Cepat (Quick Actions)
Di PageHeader (kanan):
Tambah Lamaran → open Dialog form ringkas (company, role, status, apply_date)


Buat Resume → link ke /tools/cv-ats?new=1


Dialog Tambah Lamaran:
RHF + zod


On success: revalidate dashboard (server action) + toast sukses



8) AI Insight (opsional)
Card kecil “Saran AI”:
Tampilkan 1–2 saran kontekstual, contoh:


“Ada 2 lamaran tanpa follow-up >7 hari. Kirim follow-up sekarang.”


“Kata kunci ‘TypeScript’ rendah pada resume default vs job market.”


Data dummy dulu; hook ke OpenAI nanti (fase tools).



9) Acceptance Criteria
Route /dashboard hanya untuk user login & verified


Stat cards menampilkan angka akurat (in-progress/accepted/rejected)


Pipeline snapshot sesuai agregasi status


Upcoming menampilkan kombinasi interview & next actions (max 5)


Tabel menampilkan 5 lamaran terbaru + action view


Resume Health menampilkan ATS score atau empty state


Tools grid lengkap & navigasi berfungsi


Loading skeleton & empty states konsisten


Responsif mobile (tanpa overflow) + dark/light ok



10) Langkah Manajemen Error
Jika server action gagal (supabase error), tampilkan toast error ramah.


Log ringan ke analytics_events (event: dashboard_load_error, props: code/message).


Pastikan tidak ada bocor data antar user (RLS enforced).


# Next step:
06-toolsjobmate.md