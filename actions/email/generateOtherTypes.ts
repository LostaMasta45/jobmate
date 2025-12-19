"use server";

import OpenAI from "openai";
import { logToolUsageWithNotification } from "@/lib/telegram-monitoring";
import type { FollowUpFormData } from "@/components/email-generator/FollowUpForm";
import type { ThankYouFormData } from "@/components/email-generator/ThankYouForm";
import type { InquiryFormData } from "@/components/email-generator/InquiryForm";

// OpenAI client using Sumapod
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
    baseURL: process.env.OPENAI_BASE_URL || "https://api.sumapod.com/v1",
});

// Map tone to description
const TONE_DESCRIPTIONS: Record<string, string> = {
    formal: "sangat formal dan sopan, menggunakan bahasa baku Indonesia",
    semi_formal: "semi-formal dan profesional, sopan tapi tidak kaku",
    casual: "santai dan friendly, tapi tetap sopan dan menghormati",
};

// Parse OpenAI response
function parseResponse(response: string): { subject: string; body: string } {
    const lines = response.trim().split('\n');
    let subject = '';
    let body = '';
    let inBody = false;

    for (const line of lines) {
        if (line.startsWith('SUBJECT:')) {
            subject = line.replace('SUBJECT:', '').trim();
        } else if (line.startsWith('BODY:')) {
            inBody = true;
        } else if (inBody) {
            body += line + '\n';
        }
    }

    if (!subject) {
        subject = `Email`;
    }
    if (!body) {
        body = response;
    }

    return { subject: subject.trim(), body: body.trim() };
}

// ========== FOLLOW UP EMAIL ==========

function buildFollowUpPrompt(data: FollowUpFormData): string {
    const toneDesc = TONE_DESCRIPTIONS[data.emailTone] || TONE_DESCRIPTIONS.semi_formal;
    const hrdAddress = data.hrdName || "Bapak/Ibu HRD";

    const stageLabels: Record<string, string> = {
        'sent_application': 'mengirimkan lamaran',
        'test': 'mengikuti tes/assessment',
        'interview': 'melakukan interview',
    };
    const lastStageLabel = stageLabels[data.lastStage] || data.lastStage;

    let prompt = `Buatkan email follow-up dalam Bahasa Indonesia yang sopan dan natural.

INFORMASI:
- Nama: ${data.fullName}
- Posisi yang dilamar: ${data.position}
- Perusahaan: ${data.companyName}
- Nama HRD: ${hrdAddress}
- Tahapan terakhir: ${lastStageLabel}
- Tanggal terakhir interaksi: ${data.lastInteractionDate}`;

    if (data.promisedFollowUp) {
        prompt += `\n- Yang dijanjikan: ${data.promisedFollowUp}`;
    }
    if (data.phoneNumber) {
        prompt += `\n- Nomor HP: ${data.phoneNumber}`;
    }

    prompt += `\n\nGAYA EMAIL:
- Tone: ${toneDesc}

ATURAN PENTING:
1. Email harus sopan, tidak mendesak, tapi menunjukkan antusiasme
2. Sebutkan tanggal terakhir interaksi
3. Tanyakan status proses seleksi dengan sopan
4. Jika ada yang dijanjikan, referensikan dengan halus
5. Jika ada nomor HP, cantumkan sebagai alternatif kontak
6. Tutup dengan harapan mendapat kabar baik

FORMAT OUTPUT (hanya ini, tanpa tambahan):
SUBJECT: [subject line: Follow-up Lamaran ${data.position} - ${data.fullName}]

BODY:
[isi email lengkap]`;

    return prompt;
}

export async function generateFollowUpEmail(data: FollowUpFormData) {
    try {
        console.log("[FollowUp] Generating email for:", data.fullName, data.position, data.companyName);

        const prompt = buildFollowUpPrompt(data);

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `Kamu adalah asisten yang membantu menulis email follow-up lamaran kerja dalam Bahasa Indonesia.
Tulis email yang natural, sopan, tidak mendesak, tapi menunjukkan antusiasme genuine.
Jangan terdengar desperate atau memaksa.`
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 1000,
        });

        const responseText = completion.choices[0]?.message?.content || '';
        const { subject, body } = parseResponse(responseText);

        // Log to Telegram
        logToolUsageWithNotification(
            "Email Generator V2 - Follow Up",
            `${data.position} @ ${data.companyName}`,
            { name: data.fullName, lastStage: data.lastStage }
        ).catch((err) => console.warn("[Telegram] Failed to notify:", err));

        return { subject, body };

    } catch (error: any) {
        console.error("[FollowUp] Error generating email:", error);
        return { error: error.message || "Gagal generate email. Silakan coba lagi." };
    }
}

// ========== THANK YOU EMAIL ==========

function buildThankYouPrompt(data: ThankYouFormData): string {
    const toneDesc = TONE_DESCRIPTIONS[data.emailTone] || TONE_DESCRIPTIONS.semi_formal;

    const typeLabels: Record<string, string> = {
        'hr': 'HR Interview',
        'user': 'User Interview',
        'final': 'Final Interview',
    };
    const interviewTypeLabel = typeLabels[data.interviewType] || data.interviewType;

    let prompt = `Buatkan email ucapan terima kasih setelah interview dalam Bahasa Indonesia yang sopan dan warm.

INFORMASI:
- Nama: ${data.fullName}
- Posisi yang dilamar: ${data.position}
- Perusahaan: ${data.companyName}
- Nama Interviewer: ${data.interviewerName}
- Jenis Interview: ${interviewTypeLabel}
- Tanggal Interview: ${data.interviewDate}`;

    if (data.topicsDiscussed) {
        prompt += `\n- Topik menarik yang dibahas: ${data.topicsDiscussed}`;
    }
    if (data.impression) {
        prompt += `\n- Kesan selama interview: ${data.impression}`;
    }
    if (data.additionalInfo) {
        prompt += `\n- Info tambahan yang ingin disampaikan: ${data.additionalInfo}`;
    }

    prompt += `\n\nGAYA EMAIL:
- Tone: ${toneDesc}

ATURAN PENTING:
1. Ucapkan terima kasih atas kesempatan interview
2. Jika ada topik menarik yang dibahas, referensikan untuk membuat email personal
3. Jika ada kesan positif, sampaikan dengan natural
4. Jika ada info tambahan yang ingin disampaikan, masukkan dengan halus
5. Tegaskan kembali ketertarikan terhadap posisi
6. Tutup dengan harapan untuk langkah selanjutnya

FORMAT OUTPUT (hanya ini, tanpa tambahan):
SUBJECT: [subject line: Terima Kasih atas Kesempatan Interview - ${data.fullName}]

BODY:
[isi email lengkap]`;

    return prompt;
}

export async function generateThankYouEmail(data: ThankYouFormData) {
    try {
        console.log("[ThankYou] Generating email for:", data.fullName, data.position, data.companyName);

        const prompt = buildThankYouPrompt(data);

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `Kamu adalah asisten yang membantu menulis email ucapan terima kasih setelah interview dalam Bahasa Indonesia.
Tulis email yang warm, genuine, dan profesional.
Email harus terasa personal dan tidak seperti template.`
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 1000,
        });

        const responseText = completion.choices[0]?.message?.content || '';
        const { subject, body } = parseResponse(responseText);

        // Log to Telegram
        logToolUsageWithNotification(
            "Email Generator V2 - Thank You",
            `${data.position} @ ${data.companyName}`,
            { name: data.fullName, interviewType: data.interviewType }
        ).catch((err) => console.warn("[Telegram] Failed to notify:", err));

        return { subject, body };

    } catch (error: any) {
        console.error("[ThankYou] Error generating email:", error);
        return { error: error.message || "Gagal generate email. Silakan coba lagi." };
    }
}

// ========== INQUIRY EMAIL ==========

function buildInquiryPrompt(data: InquiryFormData): string {
    const toneDesc = TONE_DESCRIPTIONS[data.emailTone] || TONE_DESCRIPTIONS.semi_formal;

    let prompt = `Buatkan email inquiry untuk menanyakan lowongan kerja dalam Bahasa Indonesia yang sopan dan profesional.

INFORMASI:
- Nama: ${data.fullName}
- Perusahaan yang dituju: ${data.companyName}
- Bidang/posisi yang diminati: ${data.interestedFields}
- Alasan tertarik dengan perusahaan: ${data.whyInterested}`;

    if (data.briefExperience) {
        prompt += `\n- Pengalaman singkat: ${data.briefExperience}`;
    }
    if (data.skills) {
        prompt += `\n- Skill utama: ${data.skills}`;
    }
    if (data.phoneNumber) {
        prompt += `\n- Nomor HP: ${data.phoneNumber}`;
    }

    prompt += `\n- CV dilampirkan: ${data.attachCV ? 'Ya' : 'Tidak'}`;

    prompt += `\n\nGAYA EMAIL:
- Tone: ${toneDesc}

ATURAN PENTING:
1. Perkenalkan diri dengan singkat
2. Sampaikan ketertarikan terhadap perusahaan dengan genuine
3. Tanyakan apakah ada lowongan di bidang yang diminati
4. Jika ada pengalaman/skill, sebutkan sebagai nilai tambah
5. Sebutkan bahwa CV dilampirkan jika memang dilampirkan
6. Jika ada nomor HP, cantumkan sebagai alternatif kontak
7. Tutup dengan harapan mendapat respons

FORMAT OUTPUT (hanya ini, tanpa tambahan):
SUBJECT: [subject line: Pertanyaan Lowongan di Bidang ${data.interestedFields.split(',')[0].trim()} - ${data.fullName}]

BODY:
[isi email lengkap]`;

    return prompt;
}

export async function generateInquiryEmail(data: InquiryFormData) {
    try {
        console.log("[Inquiry] Generating email for:", data.fullName, data.companyName);

        const prompt = buildInquiryPrompt(data);

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `Kamu adalah asisten yang membantu menulis email inquiry/pertanyaan lowongan kerja dalam Bahasa Indonesia.
Tulis email yang sopan, profesional, dan menunjukkan ketertarikan genuine terhadap perusahaan.
Jangan terdengar seperti spam atau template massal.`
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 1000,
        });

        const responseText = completion.choices[0]?.message?.content || '';
        const { subject, body } = parseResponse(responseText);

        // Log to Telegram
        logToolUsageWithNotification(
            "Email Generator V2 - Inquiry",
            `${data.interestedFields} @ ${data.companyName}`,
            { name: data.fullName, attachCV: data.attachCV }
        ).catch((err) => console.warn("[Telegram] Failed to notify:", err));

        return { subject, body };

    } catch (error: any) {
        console.error("[Inquiry] Error generating email:", error);
        return { error: error.message || "Gagal generate email. Silakan coba lagi." };
    }
}
