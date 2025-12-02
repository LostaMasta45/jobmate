// OpenAI Prompt Templates for CV ATS Generator

export function generateAISummaryPrompt(data: {
  firstName: string;
  lastName: string;
  headline: string;
  skills: string[];
  experiences: any[];
  // Enhanced fields
  targetPosition?: string;
  yearsExperience?: string;
  topAchievements?: string;
  targetIndustry?: string;
  careerGoal?: string;
  summaryTone?: "professional" | "confident" | "friendly";
}): string {
  const { 
    firstName, 
    lastName, 
    headline, 
    skills, 
    experiences,
    targetPosition,
    yearsExperience,
    topAchievements,
    targetIndustry,
    careerGoal,
    summaryTone = "professional"
  } = data;

  // Get highlights from experiences
  const expHighlights = experiences
    .slice(0, 2)
    .map((exp: any) => {
      const bullets = exp.bullets?.filter((b: string) => b.trim()).slice(0, 2).join("; ") || "";
      return `${exp.title} di ${exp.company}: ${bullets}`;
    })
    .filter(Boolean)
    .join(" | ");

  const skillsText = skills.slice(0, 10).join(", ");

  // Map years experience to readable format
  const yearsMap: Record<string, string> = {
    fresh: "Fresh Graduate dengan kurang dari 1 tahun",
    junior: "1-3 tahun",
    mid: "3-5 tahun",
    senior: "5-8 tahun",
    lead: "8-10 tahun",
    expert: "lebih dari 10 tahun",
  };
  const yearsText = yearsExperience ? yearsMap[yearsExperience] || yearsExperience : "";

  // Map tone to writing style
  const toneGuide: Record<string, string> = {
    professional: "Gunakan bahasa formal, profesional, dan objektif. Fokus pada fakta dan pencapaian terukur.",
    confident: "Gunakan bahasa yang percaya diri dan impactful. Tonjolkan achievement secara bold tanpa arogan. Gunakan kata-kata power seperti 'berhasil', 'terbukti', 'sukses'.",
    friendly: "Gunakan bahasa yang ramah namun tetap profesional. Tunjukkan personality dan enthusiasm, tetap gunakan angka untuk kredibilitas.",
  };

  return `Anda adalah **Senior HR Consultant & CV Expert** dengan pengalaman 15+ tahun membantu kandidat membuat ringkasan profil yang langsung menarik perhatian HRD dalam 6 detik pertama.

**=== PROFIL KANDIDAT ===**
- Nama: ${firstName} ${lastName}
- Target Posisi: ${targetPosition || headline}
- Headline Saat Ini: ${headline}
- Total Pengalaman: ${yearsText || "Tidak disebutkan"}
- Skill Utama: ${skillsText || "Tidak disebutkan"}
- Target Industri: ${targetIndustry || "Tidak spesifik"}

**=== PENCAPAIAN TERBAIK (INPUT USER) ===**
${topAchievements || "Tidak disebutkan - generate estimasi realistis berdasarkan role"}

**=== HIGHLIGHT PENGALAMAN ===**
${expHighlights || "Fresh graduate / belum ada pengalaman formal"}

**=== TUJUAN KARIR ===**
${careerGoal || "Tidak disebutkan"}

**=== GAYA PENULISAN: ${summaryTone.toUpperCase()} ===**
${toneGuide[summaryTone]}

**=== FORMULA RINGKASAN YANG DISUKAI HRD ===**
Gunakan struktur 4 bagian ini dalam 3-4 kalimat (150-200 kata):

1. **IDENTITAS** (Kalimat 1): "Saya adalah [Role/Title] dengan [X tahun] pengalaman di bidang [spesialisasi]..."
   - WAJIB ada angka tahun pengalaman yang spesifik
   - Sebutkan bidang keahlian utama

2. **KEAHLIAN TEKNIS** (Kalimat 2): "Expert dalam [3-5 skills/tools utama]..."
   - Pilih skills paling relevan dengan target posisi
   - Gunakan istilah yang familiar di industri

3. **PENCAPAIAN TERUKUR** (Kalimat 3): "Berhasil [achievement dengan angka: %, Rp, jumlah, waktu]..."
   - WAJIB ada minimal 2 angka/metrik konkret
   - Fokus pada IMPACT bukan task
   - Gunakan formula: Action + Result + Quantification

4. **VALUE PROPOSITION** (Kalimat 4): "Siap berkontribusi dalam [nilai yang bisa diberikan]..."
   - Tunjukkan apa yang bisa kandidat berikan ke perusahaan
   - Bisa mention tujuan karir jika relevan

**=== ATURAN KETAT ===**
1. WAJIB gunakan kata ganti "Saya" di awal (bukan nama atau orang ketiga)
2. WAJIB ada minimal 3 angka/metrik dalam ringkasan (%, Rp, tahun, jumlah)
3. DILARANG gunakan kata klise tanpa bukti: "hardworking", "passionate", "motivated", "fast learner"
4. DILARANG terlalu panjang - maksimal 4 kalimat, 150-200 kata
5. Gunakan kata kerja aktif yang kuat: meningkatkan, membangun, memimpin, mengoptimalkan, mengurangi, menghasilkan
6. Sesuaikan dengan level pengalaman:
   - Fresh Grad: fokus pada potensi, project, organisasi, magang
   - Junior: fokus pada skill teknis dan pembelajaran cepat
   - Mid: fokus pada pencapaian dan kemampuan kolaborasi
   - Senior/Lead: fokus pada leadership dan strategic impact
7. JIKA tidak ada data achievements dari user, buat estimasi REALISTIS berdasarkan role dan level

**=== CONTOH OUTPUT EXCELLENT ===**
"Saya adalah Senior Software Engineer dengan 6 tahun pengalaman membangun sistem backend scalable untuk aplikasi dengan 5+ juta pengguna aktif. Expert dalam Node.js, Python, PostgreSQL, dan microservices architecture dengan Kubernetes. Berhasil meningkatkan throughput API sebesar 300% dan mengurangi biaya infrastruktur Rp 800 juta/tahun melalui optimisasi arsitektur cloud. Siap berkontribusi dalam membangun produk teknologi yang berdampak besar bagi jutaan pengguna Indonesia."

**=== OUTPUT ===**
Tuliskan HANYA ringkasan profil, tanpa markup, penjelasan, atau komentar. Langsung text saja.`;
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

**Instruksi Penting (WAJIB DIIKUTI):**
1. Gunakan kata kerja aktif KUAT di awal: Membangun, Meningkatkan, Mengoptimalkan, Mengurangi, Memimpin, Mengembangkan, Merancang, Meluncurkan
2. WAJIB sisipkan angka/metrik achievement dalam SETIAP bullet (%, Rp, X%, waktu, jumlah user/tim/project)
   - Jika tidak ada angka di input, buat estimasi REALISTIS berdasarkan role level (junior: 10-30%, senior: 30-60%, lead: 50-100%+)
   - Contoh angka bagus: "meningkatkan 45%", "mengelola tim 8 orang", "handling 10K+ users", "reduce cost Rp 50jt/bulan"
3. Hindari kata ganti "saya", "kami", "kita" - LANGSUNG ACTION VERB
4. Panjang: 15-22 kata per bullet (tidak terlalu pendek, tidak terlalu panjang)
5. Format WAJIB: [Action Verb] + [What/Object] + [Result/Impact dengan angka]
6. Urutkan by impact - yang paling WOW & impressive di urutan atas
7. Gunakan formula CAR: Context + Action + Result (harus ada hasil terukur!)
8. Fokus pada achievement & impact, bukan task rutin
9. Setiap bullet harus punya VALUE PROPOSITION yang jelas

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

  return `Anda adalah analis ATS (Applicant Tracking System) expert dengan pengalaman 10+ tahun membantu kandidat lolos screening ATS dan diterima HRD. Analisa CV ini secara mendalam dan berikan feedback yang SANGAT ACTIONABLE.

**Resume:**
\`\`\`json
${resumeJson}
\`\`\`

${jobDesc ? `**Job Description Target:**\n${jobDesc}\n` : "**Mode:** Analisa umum tanpa JD spesifik - fokus pada best practices ATS universal.\n"}

**KRITERIA SCORING (Total 100 poin):**

1. **Header & Contact Info (10 poin)**
   - Email profesional (bukan alay), phone valid, location jelas
   - Headline spesifik dan relevan dengan target role
   - LinkedIn/portfolio jika ada

2. **Keyword Match (40 poin)** ${jobDesc ? "- Match dengan JD" : "- Berdasarkan role di headline"}
   - Hard skills (tools, teknologi, bahasa pemrograman)
   - Soft skills yang relevan
   - Industry-specific terms
   - Sertifikasi/metodologi

3. **Pengalaman & Achievement (20 poin)**
   - SETIAP bullet pakai ACTION VERB kuat di awal
   - Kuantifikasi dengan angka (%, Rp, jumlah, waktu)
   - Menunjukkan IMPACT bukan hanya task
   - Formula CAR: Context-Action-Result

4. **Format ATS-Friendly (10 poin)**
   - Bullet points 15-25 kata (tidak terlalu panjang/pendek)
   - Struktur jelas dengan section standard
   - Tidak ada karakter aneh atau formatting kompleks

5. **Kuantifikasi & Impact (10 poin)**
   - Minimal 70% bullet punya angka/metrik
   - Angka spesifik (bukan "beberapa" atau "banyak")
   - Impact terukur dan impressive

6. **Konsistensi & Completeness (10 poin)**
   - Tanggal konsisten dan valid
   - Tidak ada typo atau inkonsistensi
   - Semua section terisi lengkap

**OUTPUT JSON (WAJIB IKUTI FORMAT INI PERSIS):**
{
  "score": <number 0-100>,
  "scoreBreakdown": {
    "header": <0-10>,
    "keywords": <0-40>,
    "experience": <0-20>,
    "format": <0-10>,
    "quantification": <0-10>,
    "consistency": <0-10>
  },
  "missingKeywords": ["keyword1", "keyword2", ...max 10 yang PALING PENTING],
  "matchedKeywords": ["keyword1", "keyword2", ...yang sudah ada di CV],
  "keywordMatchPercent": <0-100>,
  "issues": ["issue singkat 1", "issue singkat 2", ...max 5],
  "strengths": ["kelebihan CV 1", "kelebihan 2", ...hal positif yang sudah bagus],
  "quickWins": [
    "Perbaikan CEPAT yang bisa langsung dilakukan dalam 5 menit",
    "Quick win 2",
    ...max 3 yang paling impactful
  ],
  "suggestions": [
    {
      "priority": "high|medium|low",
      "section": "header|summary|experience|education|skills|general",
      "issue": "Masalah spesifik yang ditemukan",
      "suggestion": "Saran perbaikan yang KONKRIT dan ACTIONABLE",
      "example": {
        "before": "Text asli dari CV (jika ada)",
        "after": "Contoh text yang sudah diperbaiki - WAJIB berikan contoh konkrit!"
      }
    }
  ]
}

**ATURAN PENTING:**
1. Suggestions WAJIB punya contoh before/after yang KONKRIT dari CV user
2. Prioritas "high" = yang paling mempengaruhi kelulusan ATS
3. Quick wins = hal kecil tapi berdampak besar, bisa dilakukan < 5 menit
4. Strengths = apresiasi hal yang sudah bagus (motivasi user)
5. Bahasa Indonesia yang mudah dipahami
6. JANGAN berikan saran generic - harus SPESIFIK ke CV ini

**JANGAN SARANKAN HAL-HAL BERIKUT (sudah di-handle template):**
- Format tanggal (YYYY-MM sudah di-render jadi "Februari 2020" dll di template)
- Format nomor telepon
- Kapitalisasi nama/judul (template sudah handle)
- Formatting visual (font, spacing, margin)
- Struktur section (sudah fixed di template)
- Urutan section
- Format email/URL

**FOKUS SARAN PADA:**
- Isi/konten yang bisa diedit user: summary, bullets, skills, headline
- Kuantifikasi achievement (tambah angka/metrik)
- Action verbs di bullet points
- Keyword yang hilang
- Informasi yang kurang lengkap (bukan format)

Hanya return JSON valid, tanpa markdown code block atau text lain.`;
}
