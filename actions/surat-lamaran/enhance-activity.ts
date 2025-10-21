"use server";

import { generateText } from "@/lib/openai";

export async function enhanceActivity(
  rawActivity: string,
  position?: string
): Promise<{
  data?: string;
  error?: string;
}> {
  try {
    if (!rawActivity || rawActivity.trim().length < 5) {
      return {
        error: "Aktivitas terlalu pendek. Minimal 5 karakter.",
      };
    }

    const prompt = `Ubah aktivitas organisasi/kampus ini menjadi kalimat yang lebih impressive dan profesional untuk surat lamaran:

INPUT AKTIVITAS:
"${rawActivity}"

${position ? `POSISI YANG DILAMAR: ${position}` : ""}

ATURAN:
1. Buat lebih spesifik dengan angka/achievement jika memungkinkan (boleh estimasi wajar)
2. Gunakan action verbs (mengelola, memimpin, mengkoordinasi, mengorganisir, dll)
3. Fokus pada IMPACT dan HASIL, bukan hanya tugas
4. Maksimal 2-3 kalimat yang powerful
5. Bahasa Indonesia formal tapi tidak kaku
6. Jika ada skills yang relevan dengan ${position || "pekerjaan"}, highlight
7. Tunjukkan leadership, teamwork, atau problem-solving

CONTOH TRANSFORMASI:
Input: "Ketua HMTI"
Output: "Menjabat sebagai Ketua Himpunan Mahasiswa Teknik Informatika periode 2023-2024, berhasil mengelola organisasi dengan 200+ anggota dan mengkoordinasi 5 event besar kampus dengan total peserta 500+ mahasiswa dan anggaran Rp 50 juta."

Input: "Panitia lomba coding"
Output: "Terlibat sebagai Koordinator Teknis dalam lomba coding tingkat nasional, bertanggung jawab atas sistem penilaian otomatis yang digunakan 100+ peserta dari 30 universitas."

OUTPUT:
Tulis hanya hasil enhanced activity dalam 2-3 kalimat, tanpa label atau penjelasan tambahan.`;

    const result = await generateText(prompt, {
      model: "gpt-4o-mini",
      temperature: 0.7,
      maxTokens: 250,
    });

    return { data: result.trim() };
  } catch (error: any) {
    console.error("[Enhance Activity Error]", error);

    if (error.message?.includes("rate limit")) {
      return {
        error: "Server AI sedang sibuk. Mohon tunggu sebentar.",
      };
    }

    return {
      error: "Gagal memperbaiki aktivitas dengan AI.",
    };
  }
}
