"use server";

import { generateText } from "@/lib/openai";

export async function generateExperienceStory(data: {
  rawExperience: string;
  position: string;
  isFreshGrad: boolean;
}): Promise<{
  data?: string;
  error?: string;
}> {
  try {
    if (!data.rawExperience || data.rawExperience.trim().length < 10) {
      return {
        error: "Pengalaman terlalu pendek. Minimal 10 karakter.",
      };
    }

    const prompt = `Buatkan narasi pengalaman profesional yang menarik untuk surat lamaran kerja:

POSISI YANG DILAMAR: ${data.position}
STATUS: ${data.isFreshGrad ? "Fresh Graduate" : "Berpengalaman"}
PENGALAMAN RAW: ${data.rawExperience}

TUGAS:
1. Transform pengalaman raw menjadi storytelling yang menarik dan profesional
2. Highlight skills dan achievement yang RELEVAN dengan posisi ${data.position}
3. Gunakan action verbs dan quantifiable results (angka, persentase, hasil konkret)
4. Fokus pada VALUE yang bisa dibawa ke perusahaan
5. Buat 2-3 kalimat yang powerful dan impactful
6. Tunjukkan problem-solving, hasil kerja, atau kontribusi nyata

${
  data.isFreshGrad
    ? `
TIPS UNTUK FRESH GRADUATE:
- Jangan ragu mention magang, project kampus, organisasi, freelance
- Focus pada learning agility dan adaptability
- Highlight transferable skills
- Show enthusiasm untuk belajar
`
    : `
TIPS UNTUK EXPERIENCED:
- Quantify achievements dengan numbers
- Show progression dan growth
- Highlight impact to business
- Demonstrate leadership atau expertise
`
}

CONTOH TRANSFORMASI:

Input (Fresh Grad): "Magang di Tokopedia 3 bulan sebagai frontend developer"
Output: "Selama menjalani program magang di Tokopedia sebagai Frontend Developer, saya berkontribusi dalam pengembangan fitur checkout yang meningkatkan conversion rate sebesar 15%. Pengalaman ini membekali saya dengan kemampuan problem-solving dalam tim agile dan pemahaman mendalam tentang user experience pada e-commerce platform skala besar."

Input (Experienced): "Kerja di startup 2 tahun sebagai product manager"
Output: "Sebagai Product Manager di startup fintech selama 2 tahun, saya memimpin pengembangan 3 produk digital yang berhasil mengakuisisi 50.000+ users dalam 6 bulan pertama. Pengalaman mengelola cross-functional team dan data-driven decision making telah membekali saya dengan kemampuan untuk deliver products yang solve real user problems."

FORMAT OUTPUT:
Tulis langsung narasi pengalaman dalam 2-3 kalimat, tanpa bullet points atau numbering.
Bahasa Indonesia formal tapi engaging, bukan kaku.
Hindari kata klise seperti "saya bertanggung jawab untuk..." - fokus pada HASIL dan IMPACT.`;

    const result = await generateText(prompt, {
      model: "gpt-4o-mini",
      temperature: 0.8,
      maxTokens: 350,
    });

    return { data: result.trim() };
  } catch (error: any) {
    console.error("[Generate Experience Story Error]", error);

    if (error.message?.includes("rate limit")) {
      return {
        error: "Server AI sedang sibuk. Mohon tunggu sebentar.",
      };
    }

    return {
      error: "Gagal generate cerita pengalaman dengan AI.",
    };
  }
}
