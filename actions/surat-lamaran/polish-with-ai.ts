"use server";

import { generateText } from "@/lib/openai";
import { generateCoverLetter } from "@/lib/coverLetterGenerator";
import { generateModernCoverLetter } from "@/lib/modernCoverLetterGenerator";

export async function polishCoverLetterWithAI(formData: any): Promise<{
  data?: string;
  error?: string;
}> {
  try {
    // Detect if using modern template (T1-T5) or ATS (T0)
    const isModernTemplate = formData.templateType && formData.templateType !== "T0";
    
    // Generate standard version first
    const standardContent = isModernTemplate 
      ? generateModernCoverLetter({ templateId: formData.templateType, ...formData })
      : generateCoverLetter(formData);

    const context = {
      position: formData.position,
      company: formData.companyName,
      isFreshGrad: formData.experienceType === "fresh_graduate",
      hasMotivation: !!formData.finalMotivation,
      jobKeywords: formData.parsedJobDescription?.keywords || [],
    };

    const prompt = `Anda adalah expert HR writer yang akan memoles surat lamaran kerja menjadi SEMPURNA dan ATS-friendly.

SURAT LAMARAN DRAFT (VERSI STANDAR):
${standardContent}

${
  formData.finalMotivation
    ? `
PARAGRAF MOTIVASI KHUSUS (harus di-integrate dengan smooth):
${formData.finalMotivation}
`
    : ""
}

${
  formData.generatedExperienceStory
    ? `
NARASI PENGALAMAN KHUSUS (harus di-integrate):
${formData.generatedExperienceStory}
`
    : ""
}

KONTEKS:
- Posisi: ${context.position}
- Perusahaan: ${context.company}
- Status: ${context.isFreshGrad ? "Fresh Graduate" : "Berpengalaman"}
${context.jobKeywords.length > 0 ? `- Keywords ATS: ${context.jobKeywords.join(", ")}` : ""}

TUGAS ANDA:
1. Polish struktur kalimat agar lebih natural, smooth, dan engaging
2. Integrate paragraf motivasi khusus dan narasi pengalaman dengan seamless
3. Ensure flow yang coherent antar paragraf - tidak terasa copy-paste
4. Optimize untuk ATS dengan sprinkle keywords secara natural (jangan forced)
5. Maintain format surat resmi Indonesia yang benar:
   - Header: Kota, Tanggal (di kanan)
   - Lampiran & Perihal
   - Kepada Yth + nama + perusahaan
   - Salam "Dengan hormat,"
   - Isi 3-4 paragraf yang mengalir
   - Penutup dengan harapan interview
   - "Hormat saya,"
   - Tanda tangan (3 baris kosong)
   - Nama

6. JANGAN ubah data factual (nama, tanggal, alamat, KTP, dll)
7. JANGAN terlalu flowery atau over-promising
8. Keep tone professional, confident, tapi tetap humble dan respectful
9. Ensure total panjang MUAT dalam 1 halaman A4 (maksimal 600 kata)
10. Polish pembukaan agar immediately grab attention
11. Polish penutupan agar leave strong impression
12. Gunakan transisi yang smooth antar paragraf
13. Variasi struktur kalimat (jangan semua kalimat mulai dengan "Saya...")

PENTING:
- ONE PAGE maksimal (600 kata)
- Natural language - hindari bahasa robot
- ATS-friendly tapi tetap human-readable
- Show personality tapi tetap professional
- Confident tapi tidak arrogant

FORMAT OUTPUT:
Tulis surat lamaran final yang sudah dipoles, lengkap dengan format:

[Kota], [Tanggal]

Lampiran : [...]
Perihal  : [...]

Kepada Yth.
[Nama HRD]
[Nama Perusahaan]
[Alamat jika ada]

Dengan hormat,

[PARAGRAF 1: Pembukaan - mention posisi, sumber lowongan, ketertarikan awal]

[PARAGRAF 2: Data diri singkat dalam format inline - bukan bullet]

[PARAGRAF 3: Background pendidikan/pengalaman yang RELEVAN]

[PARAGRAF 4: Motivasi & value proposition yang KUAT]

[PARAGRAF 5 (optional): Closing statements tambahan jika ada]

[PARAGRAF PENUTUP: Harapan untuk interview + terima kasih]

Hormat saya,


[Nama Lengkap]

Output langsung surat lengkap, TANPA penjelasan atau komentar tambahan.`;

    // Untuk modern templates (T1-T5), kembalikan HTML yang sudah di-generate
    // karena template sudah styled dan structured dengan baik
    if (isModernTemplate) {
      return { data: standardContent };
    }
    
    // Untuk ATS template (T0), polish dengan AI
    const result = await generateText(prompt, {
      model: "gpt-4o-mini",
      temperature: 0.7,
      maxTokens: 1500,
    });

    return { data: result.trim() };
  } catch (error: any) {
    console.error("[Polish Cover Letter Error]", error);

    if (error.message?.includes("rate limit")) {
      return {
        error: "Server AI sedang sibuk. Mohon tunggu sebentar dan coba lagi.",
      };
    }

    return {
      error: "Gagal memoles surat lamaran dengan AI. Mohon coba lagi.",
    };
  }
}
