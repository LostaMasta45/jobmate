"use server";

import { generateText } from "@/lib/openai";

export async function generateMotivation(data: {
  position: string;
  companyName: string;
  motivationPosition: string;
  motivationCompany: string;
  motivationValue: string;
  motivationFit?: string;
  templateType: "fresh_graduate" | "experienced";
}): Promise<{
  data?: string;
  error?: string;
}> {
  try {
    // Validation
    if (!data.motivationPosition || !data.motivationCompany || !data.motivationValue) {
      return {
        error: "Mohon isi minimal 3 pertanyaan guided untuk hasil terbaik.",
      };
    }

    const prompt = `Anda adalah career coach expert yang membantu jobseeker menulis surat lamaran yang meyakinkan HRD.

TUGAS: Buatkan 2-3 paragraf MOTIVASI yang KUAT, PERSONAL, dan MEYAKINKAN untuk surat lamaran kerja.

DATA PELAMAR:
- Posisi yang Dilamar: ${data.position}
- Perusahaan: ${data.companyName}
- Status: ${data.templateType === "fresh_graduate" ? "Fresh Graduate" : "Berpengalaman"}

JAWABAN PELAMAR (GUIDED QUESTIONS):
1. Kenapa tertarik dengan posisi ${data.position}:
   ${data.motivationPosition}

2. Yang diketahui tentang ${data.companyName}:
   ${data.motivationCompany}

3. Value/kontribusi yang bisa dibawa:
   ${data.motivationValue}

${data.motivationFit ? `4. Kenapa cocok untuk posisi ini:\n   ${data.motivationFit}` : ""}

ATURAN PENULISAN (PENTING!):
1. Buat 2-3 paragraf yang mengalir natural dan coherent
2. Paragraf 1: Alasan tertarik + knowledge tentang perusahaan (tunjukkan RESEARCH)
3. Paragraf 2: Value proposition + skills/experience yang relevan + kenapa cocok
4. Paragraf 3 (optional): Closing statement tentang kontribusi masa depan yang confident
5. Gunakan bahasa Indonesia formal tapi NOT kaku - harus terasa natural dan genuine
6. JANGAN gunakan kalimat pembuka seperti "Dengan hormat", "Perkenalkan nama saya" (itu bukan bagian motivasi)
7. Fokus pada VALUE yang bisa dibawa, BUKAN "saya ingin belajar" atau "butuh pengalaman"
8. WAJIB mention spesifik tentang perusahaan (produk, values, achievement) - tunjukkan kandidat research
9. Tone: Confident tapi TIDAK arrogant, enthusiastic tapi TIDAK desperate
10. Buat HRD yakin bahwa kandidat ini SERIOUS dan WELL-PREPARED
11. JANGAN bullet points atau numbering
12. Total 120-180 kata (concise tapi powerful)
13. Tulis dari sudut pandang PELAMAR (gunakan "Saya", first person)

CONTOH OUTPUT YANG BAIK:

"Ketertarikan saya pada posisi Frontend Developer di Tokopedia berawal dari kekaguman terhadap komitmen perusahaan dalam membangun ekosistem digital yang memberdayakan UMKM Indonesia. Sebagai pengguna aktif Tokopedia, saya melihat langsung bagaimana platform ini terus berinovasi dengan fitur-fitur seperti TokoPoints dan Bebas Ongkir yang meningkatkan customer engagement. Kesempatan untuk berkontribusi dalam tim yang berdampak pada jutaan seller dan buyer di Indonesia sangat sejalan dengan passion saya di bidang web development.

Dengan pengalaman membangun 5 web aplikasi menggunakan React dan Next.js yang telah digunakan 10.000+ users, saya memiliki pemahaman mendalam tentang component architecture, state management, dan performance optimization. Kemampuan saya dalam problem-solving dan kolaborasi dalam agile team, yang terasah selama magang di startup e-commerce, memungkinkan saya untuk langsung berkontribusi dalam sprint development tim Tokopedia.

Saya yakin bahwa kombinasi technical skills dan user-centric mindset saya dapat membantu Tokopedia terus menghadirkan web experience yang fast, intuitive, dan accessible bagi seluruh pengguna di Indonesia."

FORMAT OUTPUT:
Tulis langsung 2-3 paragraf motivasi. Pisahkan paragraf dengan 1 baris kosong.
JANGAN beri label "Paragraf 1, 2, 3" atau penjelasan apapun.
Langsung paragraf motivasi saja.`;

    const result = await generateText(prompt, {
      model: "gpt-4o-mini",
      temperature: 0.8, // Higher untuk lebih creative & personal
      maxTokens: 600,
    });

    return { data: result.trim() };
  } catch (error: any) {
    console.error("[Generate Motivation Error]", error);

    if (error.message?.includes("rate limit")) {
      return {
        error: "Server AI sedang sibuk. Mohon tunggu sebentar dan coba lagi.",
      };
    }

    return {
      error: "Gagal generate paragraf motivasi dengan AI. Mohon coba lagi.",
    };
  }
}
