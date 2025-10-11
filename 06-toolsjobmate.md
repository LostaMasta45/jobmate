# 06 — Tools JobMate (AI Generators + Tracker + PDF Tools)

Tujuan: membangun semua fitur tools yang tersedia di JobMate, lengkap dengan AI integration (OpenAI API) dan PDF tools (iLovePDF).

---

## 🧠 Tools Utama

| Tool | Fungsi Utama | API/Integrasi |
|------|---------------|---------------|
| Cover Letter | Generate surat lamaran otomatis | OpenAI |
| CV ATS | Buat CV dengan skor ATS & tips | OpenAI + Supabase |
| CV Profile | Buat ringkasan profil profesional | OpenAI |
| Email Template | Generate email lamaran profesional | OpenAI |
| WA Generator | Buat pesan HRD otomatis (spintax + AI) | OpenAI |
| Job Tracker | Catat & pantau lamaran kerja | Supabase |
| PDF Tools | Gabung, pisah, kompres, ubah PDF | iLovePDF |

---

## ⚙️ Rute Tools

/tools
├─ cover-letter/
├─ cv-ats/
├─ cv-profile/
├─ email-template/
├─ tracker/
├─ pdf-tools/
└─ wa-generator/

yaml
Salin kode

Semua rute berada di dalam `(protected)` dan otomatis memakai `<AppShell>`.

---

## 1️⃣ Cover Letter Generator

**Path:** `/tools/cover-letter`

Form:
- Nama Lengkap  
- Posisi yang Dilamar  
- Nama Perusahaan  
- Skill Utama  
- Pengalaman Singkat  
- Alasan Melamar  
- Nada Bahasa (Formal / Semi-formal / Santai)

Tombol: [Generate Surat] → Panggil OpenAI API → tampilkan hasil di panel kanan.  
Fitur: Copy / Simpan / Export PDF.  
Hasil disimpan ke tabel `templates` (`type='cover_letter'`).

Prompt internal contoh:
> “Buat surat lamaran kerja profesional dalam Bahasa Indonesia untuk posisi {posisi} di {perusahaan}. Gunakan gaya {tone}. Sertakan kekuatan {skills} dan pengalaman {experience}.”

---

## 2️⃣ CV ATS Generator

**Path:** `/tools/cv-ats`

Fungsi:
- Buat CV profesional dengan struktur ATS-friendly.
- Hitung skor ATS terhadap job description.
- Simpan ke tabel `resumes` dengan field `ats_score`.

Form:
- Judul Resume  
- Job Description (opsional)  
- Pendidikan, Pengalaman, Skill (editable table)
- Tombol [Analisa ATS]

Gunakan OpenAI API untuk menghasilkan:
- Bullet point pengalaman relevan  
- ATS score & feedback (“Kurangi kata pasif”, “Tambahkan keyword Python”)

Hasil:
- Bisa disimpan ke Supabase  
- Tombol [Export PDF] → iLovePDF (convert HTML ke PDF)

---

## 3️⃣ CV Profile Generator

**Path:** `/tools/cv-profile`

Form:
- Nama, Pendidikan, Skill, Target Pekerjaan, Gaya Bahasa  
Tombol: [Generate Profil]  
Output: paragraf “Tentang Saya” dalam Bahasa Indonesia profesional.  
Bisa langsung tersimpan ke resume aktif (`profiles` atau `resumes.profile_summary`).

Prompt:
> “Buat ringkasan profil profesional singkat untuk {nama}, berdasarkan skill {skills} dan target pekerjaan {target}. Gunakan gaya {tone}.”

---

## 4️⃣ Email Template Generator

**Path:** `/tools/email-template`

Form:
- Nama, Posisi, Nama Perusahaan, Sumber Lowongan, Skill Utama, Gaya Bahasa, Checkbox “Melampirkan CV”  
Output: email siap kirim (subject + body)  
AI: OpenAI, hasil disimpan di `templates` (`type='email'`).  
Tombol: Copy, Save, Export PDF.

Prompt contoh:
> “Tulis email lamaran profesional Bahasa Indonesia untuk posisi {posisi} di {perusahaan}, dengan gaya {tone}. Sertakan kalimat sopan penutup dan tanda tangan {nama}.”

---

## 5️⃣ WA Message Generator

**Path:** `/tools/wa-generator`

Form:
- Nama, Posisi, Nama Perusahaan, Gaya Bahasa (Formal/Ramah)  
Output: pesan siap kirim ke HRD.  
AI + random spintax agar tidak terdeteksi auto.  
Contoh output:
{Assalamu’alaikum|Halo|Selamat siang}, saya {nama}, ingin melamar posisi {posisi} di {perusahaan}. Apakah lowongan ini masih tersedia?

yaml
Salin kode

Integrasi: tombol [Copy Pesan], [Kirim ke WhatsApp].

---

## 6️⃣ Job Application Tracker

**Path:** `/tools/tracker`

Form:
- Nama Perusahaan  
- Posisi  
- Tanggal Apply  
- Media (JobStreet, IG, LinkedIn, dsb)  
- Gaji  
- HRD Contact (WA/email)  
- Status (Terkirim / Proses / Interview / Diterima / Ditolak)  
- Catatan  
- Upload poster (opsional, Storage `applications/`)

Tampilan:
- Table (shadcn)  
- Filter by status  
- Progress Timeline  
- Statistik atas: Total, Proses, Diterima, Ditolak

Tersimpan ke tabel `applications`:
| Field | Type |
|--------|------|
| id | uuid |
| user_id | uuid (fk auth.uid) |
| company | text |
| position | text |
| status | text |
| salary | numeric |
| contact | text |
| source | text |
| apply_date | date |
| notes | text |
| poster_path | text |
| created_at | timestamptz |
| updated_at | timestamptz |

---

## 7️⃣ PDF Tools

**Path:** `/tools/pdf-tools`

Integrasi: **iLovePDF API**

Fitur:
- Gabungkan PDF
- Pisahkan Halaman
- Kompres PDF
- Konversi Word → PDF
- Konversi Gambar → PDF
- Rotasi PDF
- Extract Pages

Gunakan endpoint iLovePDF:
POST https://api.ilovepdf.com/v1/start/{task}
Authorization: Bearer {ILOVE_SECRET_KEY}

php
Salin kode

Tombol UI:
- [Upload File(s)]
- [Pilih Aksi]
- [Proses]
- [Download Hasil]

---

## 8️⃣ Integrasi AI

**Koneksi OpenAI (lib/openaiClient.ts):**
```ts
import OpenAI from "openai"

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function generateText(prompt: string) {
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  })
  return res.choices[0]?.message?.content ?? ""
}
Semua tools AI gunakan helper ini.

9️⃣ Integrasi iLovePDF
lib/pdfClient.ts

ts
Salin kode
export async function processPDF(task, files) {
  const token = process.env.ILOVE_SECRET_KEY
  const formData = new FormData()
  formData.append("task", task)
  files.forEach(f => formData.append("files", f))
  const res = await fetch(`https://api.ilovepdf.com/v1/start/${task}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
  return res.json()
}
🔐 Akses & RLS
Semua tools menulis data ke tabel sesuai user:

Gunakan kolom user_id = auth.uid()

Terapkan enable row level security

create policy "Users manage own data" di tiap tabel (mirip profiles)

✅ Definition of Done (DoD)
 Semua route tools tersedia & dapat diakses dari Sidebar

 Setiap generator (Cover Letter, CV ATS, dll) bisa generate teks via OpenAI

 Tracker menyimpan data ke Supabase & tampil di table

 PDF tools berfungsi lewat iLovePDF

 Semua output bisa di-copy, simpan, atau export PDF

 UI konsisten, responsif, dark/light mode stabil

 Data tersimpan per user (RLS aktif)

▶️ Next Step
Jika semua tools sudah aktif & UI-nya jalan, lanjut ke:

bash
Salin kode
# Next step:
07-pdf-tools.md
