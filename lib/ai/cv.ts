// OpenAI Prompt Templates for CV ATS Generator

export function generateAISummaryPrompt(data: {
  firstName: string;
  lastName: string;
  headline: string;
  skills: string[];
  experiences: any[];
}): string {
  const { firstName, lastName, headline, skills, experiences } = data;

  // Get highlights from first experience
  const firstExpBullets =
    experiences.length > 0
      ? experiences[0].bullets
          .filter((b: string) => b.trim())
          .slice(0, 3)
          .join("; ")
      : "";

  const skillsText = skills.slice(0, 10).join(", ");

  return `Anda adalah asisten karier yang menulis profil CV singkat, Indonesia, profesional, 3–4 kalimat, berorientasi hasil.

**Informasi Kandidat:**
- Nama: ${firstName} ${lastName}
- Headline: ${headline}
- Skill utama: ${skillsText || "Tidak disebutkan"}
- Highlight pengalaman: ${firstExpBullets || "Tidak ada pengalaman"}

**Instruksi:**
1. Tulis ringkasan profesional dalam Bahasa Indonesia formal
2. Maksimal 4 kalimat (150-200 kata ideal)
3. Mulai dengan role/title dan tahun pengalaman (estimasi dari data)
4. Sertakan teknologi/tools utama dari skill
5. Gunakan angka dan metrik jika ada di pengalaman (%, Rp, qty)
6. Hindari kata ganti "saya/kami" - gunakan format orang ketiga atau deskriptif
7. Fokus pada value yang bisa diberikan untuk perusahaan
8. Hindari kata klise tanpa bukti ("hardworking", "passionate")

**Output:**
Tuliskan hanya ringkasan profil, tanpa markup atau penjelasan tambahan. Langsung text saja.`;
}

export function generateAIRewriteBulletsPrompt(data: {
  title: string;
  company: string;
  bullets: string[];
  jobDesc?: string;
}): string {
  const { title, company, bullets, jobDesc } = data;

  const bulletsText = bullets
    .filter((b) => b.trim())
    .map((b, i) => `${i + 1}. ${b}`)
    .join("\n");

  return `Anda merewrite bullet point pengalaman kerja agar kuat, aktif, terukur, dan ATS-friendly. Bahasa Indonesia formal, maksimal 6 bullet.

**Posisi:**
- Judul: ${title}
- Perusahaan: ${company}

**Tanggung jawab saat ini:**
${bulletsText || "Tidak ada bullet"}

${jobDesc ? `**Job Description Target (opsional):**\n${jobDesc}\n` : ""}

**Instruksi Penting:**
1. Gunakan kata kerja aktif di awal (Membangun, Meningkatkan, Mengoptimalkan, Mengurangi, Memimpin)
2. Sisipkan angka/metrik jika mungkin (%, Rp, waktu, jumlah user)
   - Jika tidak ada angka di input, estimasi wajar berdasarkan role (contoh: "20%", "5M users", "30 hari")
3. Hindari kata ganti "saya", "kami", "kita" - langsung action
4. Maksimal 25 kata per bullet (ideal 15-20 kata)
5. Format: Action + Object + Result/Impact
6. Urutkan by impact - yang paling impressive di atas
7. Gunakan formula STAR jika memungkinkan: Situation, Task, Action, Result

**Output Format:**
Kembalikan sebagai JSON array string. Contoh:
[
  "Membangun microservices architecture yang menangani 5M requests/hari dengan 99.9% uptime",
  "Mengoptimalkan database queries, mengurangi load time dari 3.2s menjadi 0.8s (75% improvement)",
  "Memimpin tim 4 engineers untuk deliver MVP dalam 3 bulan, 2 minggu lebih cepat dari timeline"
]

Hanya return JSON array, tanpa teks lain.`;
}

export function generateATSAnalysisPrompt(resume: any, jobDesc?: string): string {
  const resumeJson = JSON.stringify(resume, null, 2);

  return `Anda adalah analis ATS (Applicant Tracking System). Analisa CV ini dan berikan scoring + saran.

**Resume:**
\`\`\`json
${resumeJson}
\`\`\`

${jobDesc ? `**Job Description:**\n${jobDesc}\n` : ""}

**Kriteria Scoring (Total 100 poin):**

1. **Header & Contact Info (10 poin)**
   - Email, phone, location valid
   - Headline/target role jelas
   - Format standard

2. **Keyword Match (40 poin)**
   - Hard skills match dengan JD${jobDesc ? "" : " (estimasi untuk role umum)"}
   - Soft skills relevan
   - Teknologi/tools match

3. **Pengalaman Relevan (20 poin)**
   - Bullet points menggunakan action verbs
   - Ada kuantifikasi (angka, %, metrik)
   - Relevansi dengan target role

4. **Format ATS-Friendly (10 poin)**
   - Bullet points < 25 kata
   - Tidak ada tabel/gambar
   - Font dan struktur sederhana

5. **Kuantifikasi & Impact (10 poin)**
   - Seberapa banyak bullet punya angka
   - Jelas menunjukkan impact/hasil

6. **Konsistensi & Validitas (10 poin)**
   - Tanggal valid (start ≤ end)
   - Tidak ada gap besar yang tidak explained
   - Info lengkap dan konsisten

**Output JSON:**
{
  "score": <number 0-100>,
  "missingKeywords": [<array of keywords yang kurang>],
  "issues": [<masalah yang ditemukan>],
  "suggestions": [<saran perbaikan konkrit dan actionable>]
}

Hanya return JSON, tanpa markdown atau text lain.`;
}
