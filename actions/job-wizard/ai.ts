"use server";

import { openai } from "@/lib/openai";

// ─── AI Career Coach Chat ──────────────────────────────────────────
export async function askAICoach(
    question: string,
    context: {
        currentDay: number;
        companyName?: string;
        position?: string;
        profileData?: Record<string, any>;
    }
): Promise<{ answer: string; error?: string }> {
    try {
        const systemPrompt = `Kamu adalah AI Career Coach di platform JobMate. Kamu membantu jobseeker Indonesia (termasuk pemula) melamar kerja.

KONTEKS:
- User sedang di Hari ${context.currentDay} dari program "10 Hari Dapat Kerjaan"
${context.companyName ? `- Target saat ini: ${context.companyName} — ${context.position}` : ''}
${context.profileData?.skills ? `- Skills user: ${context.profileData.skills.join(', ')}` : ''}
${context.profileData?.experience ? `- Pengalaman: ${context.profileData.experience}` : ''}

ATURAN:
1. Jawab dalam Bahasa Indonesia yang ramah dan supportive
2. Berikan saran yang PRAKTIS dan ACTIONABLE
3. Jika user pemula, jelaskan dari dasar tapi tetap ringkas
4. Gunakan contoh spesifik jika memungkinkan
5. Maksimal 200 kata per jawaban
6. Selalu motivate dan encourage user`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: question },
            ],
            temperature: 0.7,
            max_tokens: 500,
        });

        return { answer: response.choices[0]?.message?.content || "Maaf, tidak bisa menjawab saat ini." };
    } catch (error: any) {
        return { answer: "", error: error.message };
    }
}

// ─── AI Self Assessment ────────────────────────────────────────────
export async function runSelfAssessment(profileData: {
    skills: string[];
    experience: string;
    education: string;
    interests?: string;
}): Promise<{ assessment: Record<string, any>; error?: string }> {
    try {
        const prompt = `Analisis profil jobseeker Indonesia berikut dan berikan rekomendasi karir:

PROFIL:
- Keahlian: ${profileData.skills.join(', ')}
- Pengalaman: ${profileData.experience || 'Fresh graduate / belum ada'}
- Pendidikan: ${profileData.education}
${profileData.interests ? `- Minat: ${profileData.interests}` : ''}

Berikan dalam format JSON (tanpa markdown code block):
{
  "recommended_positions": ["posisi 1", "posisi 2", "posisi 3", "posisi 4", "posisi 5"],
  "strengths": ["kekuatan 1", "kekuatan 2", "kekuatan 3"],
  "gaps": ["hal yang perlu ditingkatkan 1", "hal yang perlu ditingkatkan 2"],
  "summary": "ringkasan singkat 2-3 kalimat tentang profil dan potensi karir"
}

Jawab HANYA JSON, tanpa teks lain.`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.6,
            max_tokens: 600,
        });

        const text = response.choices[0]?.message?.content || "{}";
        // Clean up potential markdown code block
        const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const assessment = JSON.parse(cleaned);
        return { assessment };
    } catch (error: any) {
        return { assessment: {}, error: error.message };
    }
}

// ─── AI Target Advisor ─────────────────────────────────────────────
export async function getTargetAdvice(
    companyName: string,
    position: string,
    profileData?: Record<string, any>
): Promise<{ advice: string; error?: string }> {
    try {
        const prompt = `Kamu adalah career advisor. User ingin melamar ke ${companyName} untuk posisi ${position}.

${profileData?.skills ? `Skills user: ${profileData.skills.join(', ')}` : ''}
${profileData?.experience ? `Pengalaman: ${profileData.experience}` : 'Fresh graduate'}

Berikan saran singkat (maks 100 kata) dalam Bahasa Indonesia:
1. Poin apa yang harus ditonjolkan di surat lamaran
2. Hal yang perlu diperhatikan untuk perusahaan ini
3. Tips spesifik untuk posisi ini`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 300,
        });

        return { advice: response.choices[0]?.message?.content || "" };
    } catch (error: any) {
        return { advice: "", error: error.message };
    }
}
