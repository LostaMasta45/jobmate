"use server";

import OpenAI from "openai";
import { getVariationsByType, type EmailVariationV2, type EmailType } from "@/lib/emailVariationsV2";

// OpenAI client using Sumapod
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
    baseURL: process.env.OPENAI_BASE_URL || "https://api.sumapod.com/v1",
});

// Generic form data that covers all email types
// Using Record<string, any> compatible interface
interface GenericFormData {
    fullName?: string;
    position?: string;
    companyName?: string;
    hrdName?: string;
    phoneNumber?: string;
    emailTone?: string;
    // Application specific
    jobSource?: string;
    reasonForInterest?: string;
    availability?: string;
    experienceLevel?: string;
    educationType?: string;
    schoolName?: string;
    schoolMajor?: string;
    major?: string;
    university?: string;
    ipk?: string;
    organizationExp?: string;
    achievements?: string;
    projectThesis?: string;
    courses?: string;
    skills?: string;
    lastPosition?: string;
    lastCompany?: string;
    yearsExperience?: string;
    workAchievements?: string;
    attachments?: string[];
    // Follow-up specific
    lastStage?: string;
    lastInteractionDate?: string;
    promisedFollowUp?: string;
    // Thank you specific
    interviewerName?: string;
    interviewType?: string;
    interviewDate?: string;
    topicsDiscussed?: string;
    impression?: string;
    additionalInfo?: string;
    // Inquiry specific
    interestedFields?: string;
    whyInterested?: string;
    briefExperience?: string;
    attachCV?: boolean;
    [key: string]: any; // Allow additional properties
}

type VariationType = {
    id: string;
    name: string;
    approach: string;
    [key: string]: any;
};

// Build prompt based on email type
function buildPrompt(
    emailType: EmailType,
    data: GenericFormData,
    variation: VariationType
): string {
    const name = data.fullName;
    const company = data.companyName;
    const position = data.position || '';

    switch (emailType) {
        case 'application':
            return buildApplicationPrompt(data, variation);
        case 'follow_up':
            return buildFollowUpPrompt(data, variation);
        case 'thank_you':
            return buildThankYouPrompt(data, variation);
        case 'inquiry':
            return buildInquiryPrompt(data, variation);
        default:
            return buildApplicationPrompt(data, variation);
    }
}

function buildApplicationPrompt(data: GenericFormData, variation: VariationType): string {
    let profileInfo = "";
    if (data.experienceLevel === 'fresh_graduate') {
        profileInfo = `Fresh Graduate dari ${data.university || data.schoolName || 'universitas'}`;
        if (data.major) profileInfo += ` jurusan ${data.major}`;
        if (data.ipk) profileInfo += ` (IPK ${data.ipk})`;
        if (data.organizationExp) profileInfo += `\n- Pengalaman: ${data.organizationExp}`;
        if (data.skills) profileInfo += `\n- Skills: ${data.skills}`;
    } else if (data.experienceLevel === 'experienced') {
        profileInfo = `Berpengalaman sebagai ${data.lastPosition} (${data.yearsExperience})`;
        if (data.skills) profileInfo += `\n- Skills: ${data.skills}`;
    } else {
        profileInfo = data.skills ? `Skills: ${data.skills}` : 'Kandidat yang tertarik';
    }

    return `Buatkan email lamaran kerja dengan gaya: ${variation.name}

${variation.approach}

DATA:
- Nama: ${data.fullName}
- Posisi: ${data.position} di ${data.companyName}
- Kepada: ${data.hrdName || 'Bapak/Ibu HRD'}
- Profil: ${profileInfo}
${data.phoneNumber ? `- No HP: ${data.phoneNumber}` : ''}

FORMAT:
SUBJECT: Lamaran ${data.position} - ${data.fullName}

BODY:
[isi email]`;
}

function buildFollowUpPrompt(data: GenericFormData, variation: VariationType): string {
    const stageLabels: Record<string, string> = {
        'sent_application': 'mengirim lamaran',
        'test': 'mengikuti tes',
        'interview': 'interview'
    };
    const stage = stageLabels[data.lastStage || ''] || 'mengirim lamaran';

    return `Buatkan email follow-up lamaran dengan gaya: ${variation.name}

${variation.approach}

DATA:
- Nama: ${data.fullName}
- Posisi: ${data.position} di ${data.companyName}
- Kepada: ${data.hrdName || 'Bapak/Ibu HRD'}
- Tahap terakhir: ${stage}
${data.lastInteractionDate ? `- Tanggal interaksi terakhir: ${data.lastInteractionDate}` : ''}
${data.promisedFollowUp ? `- Follow-up yang dijanjikan: ${data.promisedFollowUp}` : ''}
${data.phoneNumber ? `- No HP: ${data.phoneNumber}` : ''}

FORMAT:
SUBJECT: Follow Up Lamaran ${data.position} - ${data.fullName}

BODY:
[isi email]`;
}

function buildThankYouPrompt(data: GenericFormData, variation: VariationType): string {
    const typeLabels: Record<string, string> = {
        'hr': 'HR Interview',
        'user': 'User Interview',
        'final': 'Final Interview'
    };
    const interviewType = typeLabels[data.interviewType || ''] || 'Interview';

    return `Buatkan email ucapan terima kasih setelah interview dengan gaya: ${variation.name}

${variation.approach}

DATA:
- Nama: ${data.fullName}
- Posisi: ${data.position} di ${data.companyName}
- Interviewer: ${data.interviewerName || 'Interviewer'}
- Tipe interview: ${interviewType}
${data.interviewDate ? `- Tanggal interview: ${data.interviewDate}` : ''}
${data.topicsDiscussed ? `- Topik yang dibahas: ${data.topicsDiscussed}` : ''}
${data.impression ? `- Kesan: ${data.impression}` : ''}

FORMAT:
SUBJECT: Terima Kasih - ${interviewType} ${data.position} - ${data.fullName}

BODY:
[isi email]`;
}

function buildInquiryPrompt(data: GenericFormData, variation: VariationType): string {
    return `Buatkan email inquiry/pertanyaan lowongan dengan gaya: ${variation.name}

${variation.approach}

DATA:
- Nama: ${data.fullName}
- Perusahaan yang dituju: ${data.companyName}
${data.interestedFields ? `- Bidang yang diminati: ${data.interestedFields}` : ''}
${data.whyInterested ? `- Alasan tertarik: ${data.whyInterested}` : ''}
${data.briefExperience ? `- Background singkat: ${data.briefExperience}` : ''}
${data.skills ? `- Skills: ${data.skills}` : ''}
${data.phoneNumber ? `- No HP: ${data.phoneNumber}` : ''}
- Lampirkan CV: ${data.attachCV ? 'Ya' : 'Tidak'}

FORMAT:
SUBJECT: Inquiry Lowongan - ${data.fullName}

BODY:
[isi email]`;
}

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

    if (!subject) subject = `Email`;
    if (!body) body = response;

    return { subject: subject.trim(), body: body.trim() };
}

// Generate single variation for any email type
export async function generateEmailVariationV2(
    data: GenericFormData,
    variationId: string,
    emailType: EmailType = 'application'
): Promise<{ subject: string; body: string } | { error: string }> {
    try {
        const variations = getVariationsByType(emailType);
        const variation = variations.find(v => v.id === variationId);

        if (!variation) {
            return { error: "Variasi tidak ditemukan" };
        }

        const prompt = buildPrompt(emailType, data, variation);

        const systemPrompts: Record<EmailType, string> = {
            'application': 'Kamu adalah asisten yang ahli menulis email lamaran kerja dalam Bahasa Indonesia yang natural dan sopan.',
            'follow_up': 'Kamu adalah asisten yang ahli menulis email follow-up lamaran kerja dalam Bahasa Indonesia yang sopan dan tidak memaksa.',
            'thank_you': 'Kamu adalah asisten yang ahli menulis email ucapan terima kasih setelah interview dalam Bahasa Indonesia yang tulus dan profesional.',
            'inquiry': 'Kamu adalah asisten yang ahli menulis email pertanyaan lowongan kerja dalam Bahasa Indonesia yang sopan dan menunjukkan ketertarikan genuine.'
        };

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: systemPrompts[emailType] + '\nIkuti GAYA yang diminta. Jangan mengarang informasi.'
                },
                { role: "user", content: prompt }
            ],
            temperature: 0.8,
            max_tokens: 1200,
        });

        const responseText = completion.choices[0]?.message?.content || '';
        return parseResponse(responseText);

    } catch (error: any) {
        console.error("[VariationV2] Error:", error);
        return { error: error.message || "Gagal generate variasi" };
    }
}

// Generate all 3 variations for any email type
export async function generateAllVariationsV2(
    data: GenericFormData,
    emailType: EmailType = 'application'
): Promise<EmailVariationV2[]> {
    const variations = getVariationsByType(emailType);

    const results = await Promise.all(
        variations.map(async (variation) => {
            const result = await generateEmailVariationV2(data, variation.id, emailType);

            if ('error' in result) {
                return { ...variation, error: result.error };
            }

            return {
                ...variation,
                subject: result.subject,
                body: result.body,
            };
        })
    );

    return results;
}
