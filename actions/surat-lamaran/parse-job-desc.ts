"use server";

import { generateText } from "@/lib/openai";

interface ParsedJobDescription {
  position?: string;
  company?: string;
  requiredSkills: string[];
  responsibilities: string[];
  requirements: string[];
  keywords: string[];
  salary?: string;
  location?: string;
}

export async function parseJobDescription(jobDescText: string): Promise<{
  data?: ParsedJobDescription;
  error?: string;
}> {
  try {
    if (!jobDescText || jobDescText.trim().length < 50) {
      return {
        error: "Job description terlalu pendek. Minimal 50 karakter.",
      };
    }

    const prompt = `Ekstrak informasi penting dari job description berikut dan return dalam format JSON:

JOB DESCRIPTION:
${jobDescText}

TUGAS:
1. Identifikasi position/job title
2. Identifikasi nama perusahaan (jika disebutkan)
3. Extract required skills (maksimal 8 skills paling penting)
4. Extract main responsibilities (maksimal 5)
5. Extract requirements/qualifications (maksimal 5)
6. Extract keywords penting untuk ATS (maksimal 10)
7. Extract salary range (jika disebutkan)
8. Extract lokasi kerja (jika disebutkan)

FORMAT OUTPUT (JSON):
{
  "position": "Job Title",
  "company": "Company Name atau null jika tidak disebutkan",
  "requiredSkills": ["skill1", "skill2", ...],
  "responsibilities": ["responsibility1", "responsibility2", ...],
  "requirements": ["requirement1", "requirement2", ...],
  "keywords": ["keyword1", "keyword2", ...],
  "salary": "salary range atau null",
  "location": "lokasi atau null"
}

PENTING: Return HANYA valid JSON, tidak ada teks tambahan.`;

    const result = await generateText(prompt, {
      model: "gpt-4o-mini",
      temperature: 0.3, // Lower temperature untuk lebih akurat
      maxTokens: 800,
    });

    // Clean result (remove markdown code blocks if any)
    let cleanResult = result.trim();
    if (cleanResult.startsWith("```json")) {
      cleanResult = cleanResult.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (cleanResult.startsWith("```")) {
      cleanResult = cleanResult.replace(/```\n?/g, "");
    }

    // Parse JSON
    const parsed = JSON.parse(cleanResult) as ParsedJobDescription;

    return { data: parsed };
  } catch (error: any) {
    console.error("[Parse Job Desc Error]", error);

    // User-friendly error messages
    if (error.message?.includes("rate limit")) {
      return {
        error: "Server AI sedang sibuk. Mohon tunggu sebentar dan coba lagi.",
      };
    } else if (error.message?.includes("JSON")) {
      return {
        error: "Gagal memproses job description. Mohon coba lagi.",
      };
    }

    return {
      error: "Terjadi kesalahan saat memproses job description.",
    };
  }
}
