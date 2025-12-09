"use server";

import OpenAI from "openai";

// OpenAI client using Sumapod
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
    baseURL: process.env.OPENAI_BASE_URL || "https://api.sumapod.com/v1",
});

interface JobPosterAnalysis {
    companyName?: string;
    position?: string;
    requirements?: string[];
    qualifications?: string[];
    benefits?: string[];
    deadline?: string;
    location?: string;
    salary?: string;
    rawDescription?: string;
}

export async function analyzeJobPoster(imageBase64: string): Promise<{ data?: JobPosterAnalysis; error?: string }> {
    try {
        console.log("[JobPoster] Analyzing job poster image...");

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `Kamu adalah asisten yang membantu menganalisis poster lowongan kerja.
Extract informasi dari poster lowongan dan kembalikan dalam format JSON.

Format output yang diharapkan:
{
    "companyName": "nama perusahaan",
    "position": "posisi yang dibuka",
    "requirements": ["requirement 1", "requirement 2"],
    "qualifications": ["kualifikasi 1", "kualifikasi 2"],
    "benefits": ["benefit 1", "benefit 2"],
    "deadline": "tanggal deadline jika ada",
    "location": "lokasi kerja",
    "salary": "range gaji jika disebutkan",
    "rawDescription": "deskripsi lengkap pekerjaan jika ada"
}

Catatan:
- Jika informasi tidak tersedia, gunakan null
- Extract sebanyak mungkin informasi yang relevan
- Requirements bisa berupa skill, pengalaman, pendidikan
- Tulis dalam Bahasa Indonesia`
                },
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Analisis poster lowongan kerja ini dan extract semua informasi yang relevan dalam format JSON:"
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`,
                                detail: "high"
                            }
                        }
                    ]
                }
            ],
            max_tokens: 1500,
            temperature: 0.3,
        });

        const responseText = completion.choices[0]?.message?.content || '';

        // Try to parse JSON from response
        let analysis: JobPosterAnalysis;
        try {
            // Find JSON in response (it might be wrapped in markdown code block)
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                analysis = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error("No JSON found in response");
            }
        } catch (parseError) {
            console.warn("[JobPoster] Failed to parse JSON, using raw response");
            analysis = {
                rawDescription: responseText
            };
        }

        console.log("[JobPoster] Analysis complete:", analysis);
        return { data: analysis };

    } catch (error: any) {
        console.error("[JobPoster] Error analyzing poster:", error);
        return { error: error.message || "Gagal menganalisis poster. Silakan coba lagi." };
    }
}
