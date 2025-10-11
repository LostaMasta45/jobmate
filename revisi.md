# 06A — Revisi Fitur: CV ATS Generator (Wizard, AI, Export)

## Tujuan
Bangun ulang **CV ATS Generator** sebagai **wizard multi-step** dengan **live preview** di kanan, **validasi ketat**, **AI assist** (rewrite & keyword match), **ATS scoring**, dan **export PDF**. Gunakan **Next.js (App Router, TS), shadcn/ui, react-hook-form + zod, framer-motion**.

---

## Rute & Struktur
- Route: `/tools/cv-ats`
- Folder:

/app/(protected)/tools/cv-ats/page.tsx
 /components/cv-ats/Wizard.tsx
 /components/cv-ats/Preview.tsx
 /components/cv-ats/Steps/*
 /actions/cv-ats/*
 /lib/ai/cv.ts // OpenAI helpers
 /lib/ats/score.ts // Scoring & keyword match

---

## UX — Wizard Steps (seperti screenshot referensi)
**Left panel**: form wizard 6 step, sticky, autosave  
**Right panel**: **Live Preview** template ATS (header + sections)

**Step 1 — Informasi Dasar**
- firstName, lastName, headline (target role), address/city, phone, email, website, linkedin
- tombol: “Simpan CV”
- Validasi: phone/email format, required basic fields

**Step 2 — Ringkasan**
- summary (≤ 600 chars)
- tombol **“Bantu dengan AI”** → generate ringkasan berbasis Step 1

**Step 3 — Pengalaman Profesional** (Dynamic list)
- items[]: { title, company, city, region, startDate, endDate|null, isCurrent, bullets[] }
- tombol **“Tulis ulang pakai AI”** untuk bullet → hasil kuat, aktif, kuantitatif
- Validasi tanggal (start ≤ end; jika current → end null)
- Tombol **+ Tambah Pengalaman** / **Hapus**

**Step 4 — Pendidikan** (Dynamic list)
- items[]: { school, degree, field, startDate, endDate, description? }
- Validasi tanggal

**Step 5 — Keterampilan & Bagian Kustom**
- skills (tag input, tekan Enter)
- customSections[]: { title, items: [{ label, description? }] }
- Tombol **+ Tambah Bagian** / **+ Tambah Item**

**Step 6 — Tinjau & Ekspor**
- Validasi global + list error (contoh: “Pengalaman #1 tanggal mulai tidak valid”)
- Tombol:
  - **Salin sebagai Teks**
  - **Unduh PDF (ATS/Text)** = template minimal
  - **Unduh PDF (Kecil)** = kompres
  - **Simpan CV** → Supabase `resumes`
  - **Hitung ATS Score** → tampil progress + saran perbaikan

**Global**
- **Autosave**: localStorage setiap 3 detik + “Tersimpan • hh:mm:ss”
- **Keyboard**: `Ctrl/Cmd + S` simpan, `Ctrl/Cmd + Enter` next step
- **Drag-to-reorder** (opsional): pengalaman/pendidikan via dnd-kit

---

## Data Model (di client & Supabase)
```ts
type Resume = {
  id?: string
  title: string
  basics: {
    firstName: string; lastName: string; headline: string;
    address?: string; phone?: string; email: string;
    website?: string; linkedin?: string;
  }
  summary?: string
  experiences: Array<{
    title: string; company: string; city?: string; region?: string;
    startDate: string; endDate?: string | null; isCurrent?: boolean;
    bullets: string[]
  }>
  education: Array<{
    school: string; degree?: string; field?: string;
    startDate?: string; endDate?: string; description?: string;
  }>
  skills: string[]
  customSections: Array<{
    title: string; items: Array<{ label: string; description?: string }>
  }>
  ats_score?: number
  updated_at?: string
}

Supabase table resumes:
id uuid pk, user_id uuid fk, title text, sections jsonb, ats_score int, is_default bool, created_at, updated_at
 RLS: user_id = auth.uid().



Komponen Utama
<Wizard />: mengatur step + state + autosave


<Preview />: render template ATS (server component, hydrated props)


<StepBasics/>, <StepSummary/>, <StepExperience/>, <StepEducation/>, <StepSkillsCustom/>, <StepReview/>


<Toolbar />: Next, Previous, Save, Close


Style:
Card rounded-2xl, border, shadow-card


Progress indicator (6 dots/segments)


Dark/light ready



Server Actions (kontrak)
/actions/cv-ats/*
saveResume(resume: Resume) → upsert ke resumes (sections=jsonb)


loadResume(id?) → get default/selected resume


exportPDF(resume, variant: "ats"|"small") → HTML→PDF (iLovePDF)


analyzeATS(resume, jobDesc?) → return { score, missingKeywords[], suggestions[] }


aiSummary(basics, experiences, skills, tone) → string


aiRewriteBullets(experience, jobDesc?) → string[] (maks 5 bullets)



OpenAI — Prompt Template (Wajib)
A. Ringkasan Profil
System: Anda adalah asisten karier yang menulis profil CV singkat, Indonesia, profesional, 3–4 kalimat, berorientasi hasil.
User:
Nama: {firstName} {lastName}
Headline: {headline}
Skill utama: {skills}
Highlight pengalaman: {first experience bullets ringkas}
Tulis ringkasan ≤ 600 karakter, hindari klise, fokus angka/kinerja.
Output polos tanpa markup.

B. Rewrite Bullet Pengalaman
System: Anda merewrite bullet pengalaman kerja agar kuat, aktif, dan terukur. Bahasa Indonesia formal, 1 baris per bullet, maksimal 6 bullet.
User:
Judul: {title}, Perusahaan: {company}
Tanggung jawab saat ini:
{bullets_joined}

Job Description (opsional):
{jobDesc}

Instruksi:
- Gunakan kata kerja aktif (Meningkatkan, Mengoptimalkan, Mengurangi).
- Sisipkan angka (%/Rp/qty) jika disebut/terlihat umum.
- Hindari kata ganti saya/kami.
- Kembalikan sebagai array JSON murni string, tanpa teks lain.

C. Analisa ATS Score
System: Anda adalah analis ATS. Kembalikan JSON.
User:
Resume:
{resume_json}

Job Description (opsional):
{jobDesc}

Skor 0–100 berdasarkan:
- Header lengkap (kontak, headline) [10]
- Kecocokan keyword hard/soft skills [40]
- Pengalaman relevan & kata kerja aktif [20]
- Kuantifikasi (angka %, waktu, uang) [10]
- Format bersih: panjang per bullet < 25 kata, hindari tabel/gambar [10]
- Konsistensi tanggal (valid) [10]

Output JSON:
{
 "score": number,
 "missingKeywords": string[],
 "issues": string[],        // masalah yang ditemukan
 "suggestions": string[]    // saran perbaikan konkrit
}


Analitik ATS (client-side tambahan)
/lib/ats/score.ts
Ekstrak keyword dari JD (lowercase, stemming ringan), bandingkan dengan skills + bullets + summary


Bobot: hardSkills 0.6, softSkills 0.4


Heuristik: penalti jika ada bullet > 25 kata, tanggal tidak valid, contact kosong



Validasi (Zod)
Email, phone (regex), URL opsional


Tanggal: YYYY-MM (gunakan date picker month)


Minimal satu pengalaman atau pendidikan


Step 6 menampilkan daftar error per seksi (bullet list) seperti screenshot



Export PDF
Variant ATS/Text: template minimal, font sans, tanpa kolom tabel


Variant Small: kompres via iLovePDF (reuse 07-pdf-tools.md helper)


Simpan file ke Storage documents/{user_id}/output/ + insert documents table



Fitur Tambahan (karena Next.js > HTML)
Template Selector (A/B): dua layout preview, tetap ATS-friendly


Reorder drag & drop untuk pengalaman/pendidikan


Auto keyword highlighter: highlight kata yang match JD di preview


Import dari PDF/Docx (opsional): upload → parse ringkas (tulis placeholder dulu)


Share link (read-only): generate signed URL (Storage) untuk HRD


Set as Default Resume: toggle di toolbar



Acceptance Criteria
Wizard 6 step sesuai deskripsi, autosave bekerja (timestamp tampak)


Live preview sinkron real-time


AI: ringkasan & bullet rewrite mengembalikan hasil rapi (tanpa markup) / array JSON


ATS score + list saran muncul; keyword match berfungsi


Validasi tanggal & form error seperti contoh screenshot (pesan jelas)


Export PDF (ATS & Small) sukses, tersimpan di Storage + entry documents


UI responsif, dark/light mode, animasi halus



Next Action
Generate komponen Wizard + Preview


Implement server actions (save, analyze, export)


Sambungkan tombol “Bantu dengan AI” & “Tulis ulang pakai AI”


Uji end-to-end dengan 1 resume contoh + 1 JD




