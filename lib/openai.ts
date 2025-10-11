import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function generateText(
  prompt: string,
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: options?.model || "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: options?.temperature || 0.7,
      max_tokens: options?.maxTokens || 1500,
    });

    return response.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new Error("Failed to generate text with AI");
  }
}

export async function generateCoverLetter(data: {
  full_name: string;
  position: string;
  company: string;
  skills: string;
  experience: string;
  reason: string;
  tone: string;
}): Promise<string> {
  const toneStyle = 
    data.tone === "formal" 
      ? "sangat formal dan profesional, gunakan bahasa baku" 
      : data.tone === "semi-formal" 
      ? "semi-formal, profesional namun tidak terlalu kaku"
      : "profesional tapi santai dan ramah, tetap sopan";

  const prompt = `Anda adalah expert HR dan career coach profesional. Buatlah surat lamaran kerja (cover letter) yang SEMPURNA dalam Bahasa Indonesia dengan detail berikut:

INFORMASI PELAMAR:
- Nama Lengkap: ${data.full_name}
- Posisi yang Dilamar: ${data.position}
- Perusahaan Target: ${data.company}
- Keahlian/Skills: ${data.skills}
- Pengalaman: ${data.experience}
- Motivasi/Alasan: ${data.reason}
- Gaya Bahasa: ${toneStyle}

INSTRUKSI KHUSUS:
1. Buat surat lamaran LENGKAP dengan format surat resmi Indonesia
2. Gunakan struktur: Kepala Surat (alamat & tanggal), Perihal, Lampiran, Salam Pembuka, Isi (3-4 paragraf), Penutup, Hormat, Tanda Tangan
3. Paragraf 1: Pembukaan - perkenalan diri dan posisi yang dilamar
4. Paragraf 2: Keahlian dan pengalaman yang RELEVAN dengan posisi
5. Paragraf 3: Motivasi kuat kenapa ingin bergabung di perusahaan ini
6. Paragraf 4: Penutup dengan call-to-action untuk interview
7. Sesuaikan tone bahasa dengan ${data.tone}
8. Gunakan data yang diberikan secara kreatif dan natural
9. Buat surat yang MENARIK PERHATIAN HRD dan menonjolkan value proposition
10. Hindari klise, buat unik dan personal

FORMAT OUTPUT:
Buat dalam format surat lengkap siap pakai, termasuk tanggal (hari ini), alamat pelamar (bisa template), perihal, lampiran, dan signature block.`;

  return await generateText(prompt, {
    model: "gpt-4o-mini",
    temperature: 0.8,
    maxTokens: 2000,
  });
}

export async function generateCVProfile(data: {
  full_name: string;
  education: string;
  skills: string;
  target_job: string;
  tone: string;
}): Promise<string> {
  const prompt = `Buat ringkasan profil profesional dalam Bahasa Indonesia untuk CV:

Nama: ${data.full_name}
Pendidikan: ${data.education}
Keahlian: ${data.skills}
Target Pekerjaan: ${data.target_job}
Gaya: ${data.tone === "formal" ? "Formal dan profesional" : "Santai namun profesional"}

Buat paragraf "Tentang Saya" yang menarik, maksimal 3-4 kalimat, yang menyoroti keunggulan dan cocok untuk ${data.target_job}.`;

  return await generateText(prompt);
}

export async function generateEmailTemplate(data: {
  full_name: string;
  position: string;
  company: string;
  source: string;
  skills: string;
  tone: string;
  attach_cv: boolean;
}): Promise<{ subject: string; body: string }> {
  const prompt = `Buat email lamaran kerja profesional dalam Bahasa Indonesia:

Nama: ${data.full_name}
Posisi: ${data.position}
Perusahaan: ${data.company}
Sumber Lowongan: ${data.source}
Keahlian: ${data.skills}
Gaya: ${data.tone === "formal" ? "Formal" : "Semi-formal"}
${data.attach_cv ? "Melampirkan CV dan dokumen pendukung" : ""}

Format output:
SUBJECT: [tulis subject email]
BODY: [tulis isi email lengkap dengan pembuka, isi, dan penutup]`;

  const response = await generateText(prompt);
  
  const subjectMatch = response.match(/SUBJECT:\s*(.+)/);
  const bodyMatch = response.match(/BODY:\s*([\s\S]+)/);
  
  return {
    subject: subjectMatch?.[1]?.trim() || `Lamaran ${data.position} - ${data.full_name}`,
    body: bodyMatch?.[1]?.trim() || response,
  };
}

export async function generateWAMessage(data: {
  full_name: string;
  position: string;
  company: string;
  tone: string;
}): Promise<string> {
  const prompt = `Buat pesan WhatsApp singkat untuk melamar pekerjaan dengan spintax (variasi kata):

Nama: ${data.full_name}
Posisi: ${data.position}
Perusahaan: ${data.company}
Gaya: ${data.tone === "formal" ? "Formal dan sopan" : "Ramah namun profesional"}

Gunakan spintax seperti {Halo|Selamat pagi|Assalamu'alaikum} untuk membuat variasi.
Maksimal 3-4 kalimat, langsung ke inti, dan tanyakan apakah lowongan masih tersedia.`;

  return await generateText(prompt);
}

export async function analyzeCVATS(data: {
  title: string;
  job_description: string;
  education: string;
  experience: string;
  skills: string;
}): Promise<{ ats_score: number; feedback: string[]; suggestions: string[] }> {
  const resumeText = `
Education: ${data.education}
Experience: ${data.experience}
Skills: ${data.skills}
`;
  const prompt = `Analisis CV berikut untuk ATS (Applicant Tracking System):

CV:
${resumeText}

${data.job_description ? `Job Description:\n${data.job_description}\n` : ""}

Berikan:
1. Skor ATS (0-100)
2. 5 feedback spesifik untuk meningkatkan skor (dalam Bahasa Indonesia)

Format:
SCORE: [angka]
FEEDBACK:
- [feedback 1]
- [feedback 2]
- [feedback 3]
- [feedback 4]
- [feedback 5]`;

  const response = await generateText(prompt, { maxTokens: 800 });
  
  const scoreMatch = response.match(/SCORE:\s*(\d+)/);
  const score = scoreMatch ? parseInt(scoreMatch[1]) : 70;
  
  const feedbackMatches = response.match(/FEEDBACK:\s*([\s\S]+)/);
  const feedbackText = feedbackMatches?.[1] || "";
  const feedback = feedbackText
    .split("\n")
    .filter(line => line.trim().startsWith("-"))
    .map(line => line.replace(/^-\s*/, "").trim())
    .slice(0, 5);
  
  return { ats_score: score, feedback, suggestions: feedback };
}
