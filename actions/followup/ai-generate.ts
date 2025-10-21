"use server";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

export type FollowUpLanguage = 
  | 'id' // Indonesian
  | 'id-formal' // Indonesian Formal
  | 'en' // English
  | 'en-formal'; // English Formal

export interface GenerateFollowUpMessageParams {
  // Application data
  company: string;
  position: string;
  appliedDate: string;
  
  // Follow-up details
  reminderType: 'first_followup' | 'second_followup' | 'third_followup' | 'post_interview_thankyou' | 'post_interview_followup';
  channel: 'email' | 'whatsapp';
  language: FollowUpLanguage;
  
  // Optional context
  userAchievements?: string;
  interviewDate?: string;
  specificTopics?: string;
}

const LANGUAGE_NAMES: Record<FollowUpLanguage, string> = {
  'id': 'Bahasa Indonesia (Casual)',
  'id-formal': 'Bahasa Indonesia (Formal)',
  'en': 'English (Casual)',
  'en-formal': 'English (Professional)'
};

const REMINDER_TYPE_LABELS: Record<string, string> = {
  'first_followup': 'First Follow-up (Day 3)',
  'second_followup': 'Second Follow-up (Day 7)',
  'third_followup': 'Final Follow-up (Day 14)',
  'post_interview_thankyou': 'Thank You Note (After Interview)',
  'post_interview_followup': 'Post-Interview Follow-up'
};

/**
 * Generate AI-powered follow-up message
 */
export async function generateFollowUpMessage(params: GenerateFollowUpMessageParams) {
  try {
    const {
      company,
      position,
      appliedDate,
      reminderType,
      channel,
      language,
      userAchievements,
      interviewDate,
      specificTopics
    } = params;

    console.log("[AI Generate] Generating message:", { company, position, reminderType, channel, language });

    // Build system prompt based on language and channel
    const systemPrompt = buildSystemPrompt(language, channel, reminderType);
    
    // Build user prompt with context
    const userPrompt = buildUserPrompt({
      company,
      position,
      appliedDate,
      reminderType,
      userAchievements,
      interviewDate,
      specificTopics
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const generatedMessage = response.choices[0]?.message?.content?.trim();

    if (!generatedMessage) {
      return { error: "Failed to generate message" };
    }

    // Extract subject line for email (if present)
    let subject = "";
    let body = generatedMessage;

    if (channel === 'email' && generatedMessage.includes('\n')) {
      const lines = generatedMessage.split('\n');
      // Look for "Subject:" line
      const subjectLine = lines.find(line => 
        line.toLowerCase().startsWith('subject:') || 
        line.toLowerCase().startsWith('subjek:')
      );
      
      if (subjectLine) {
        subject = subjectLine.replace(/^(subject|subjek):\s*/i, '').trim();
        // Remove subject line from body
        body = lines
          .filter(line => line !== subjectLine)
          .join('\n')
          .trim();
      }
    }

    console.log("[AI Generate] Success! Generated message length:", body.length);

    return {
      success: true,
      data: {
        subject: channel === 'email' ? subject : undefined,
        body,
        language: LANGUAGE_NAMES[language],
        generatedAt: new Date().toISOString()
      }
    };

  } catch (error: any) {
    console.error("[AI Generate] Error:", error);
    return {
      error: error.message || "Failed to generate message"
    };
  }
}

/**
 * Build system prompt based on language and channel
 */
function buildSystemPrompt(
  language: FollowUpLanguage,
  channel: 'email' | 'whatsapp',
  reminderType: string
): string {
  const isEmail = channel === 'email';
  const isFormal = language.includes('formal');
  const isIndonesian = language.startsWith('id');

  if (isIndonesian) {
    return `Kamu adalah asisten profesional yang membantu jobseeker membuat pesan follow-up lamaran kerja.

TUGAS: Buat pesan follow-up ${REMINDER_TYPE_LABELS[reminderType]} untuk ${isEmail ? 'EMAIL' : 'WHATSAPP'}.

TONE: ${isFormal ? 'Formal, profesional, sopan' : 'Ramah, profesional, tidak terlalu kaku'}

STRUKTUR ${isEmail ? 'EMAIL' : 'WHATSAPP'}:
${isEmail ? `- Subject: (maksimal 10 kata, menarik perhatian)
- Salam pembuka (Dear/Halo)
- Perkenalan singkat & tujuan email (1-2 kalimat)
- Body: Jelaskan maksud follow-up, tunjukkan antusiasme, sebutkan value yang bisa diberikan
- Closing: Ucapan terima kasih & harapan mendengar kabar
- Tanda tangan (Hormat saya/Best regards)` : 
`- Greeting singkat
- Perkenalan & tujuan (2-3 kalimat)
- Tunjukkan antusiasme
- Call to action atau pertanyaan
- Closing dengan emoji yang sesuai (opsional)`}

PANJANG: ${isEmail ? '150-250 kata' : '50-100 kata (singkat untuk WhatsApp)'}

TIPS:
- Jangan terlalu desperate atau memohon
- Tunjukkan continued interest dan enthusiasm
- Sebutkan specific skills atau achievements jika relevan
- Professional tapi friendly
- Jangan gunakan template yang terlalu generic

${isEmail ? 'FORMAT OUTPUT:\nSubject: [subject line]\n\n[email body]\n\nTanda tangan akan ditambahkan otomatis oleh sistem.' : 'FORMAT OUTPUT:\n[whatsapp message]\n\nEmoji boleh digunakan dengan bijak (1-2 emoji maksimal).'}`;
  } else {
    return `You are a professional assistant helping jobseekers create follow-up messages for job applications.

TASK: Create a ${REMINDER_TYPE_LABELS[reminderType]} message for ${isEmail ? 'EMAIL' : 'WHATSAPP'}.

TONE: ${isFormal ? 'Formal, professional, polished' : 'Friendly, professional, approachable'}

${isEmail ? 'EMAIL' : 'WHATSAPP'} STRUCTURE:
${isEmail ? `- Subject: (max 10 words, attention-grabbing)
- Greeting (Dear/Hello)
- Brief introduction & purpose (1-2 sentences)
- Body: Explain follow-up intent, show enthusiasm, mention value you can provide
- Closing: Thank them & express hope to hear back
- Sign-off (Best regards/Sincerely)` :
`- Brief greeting
- Introduction & purpose (2-3 sentences)
- Show enthusiasm
- Call to action or question
- Closing with appropriate emoji (optional)`}

LENGTH: ${isEmail ? '150-250 words' : '50-100 words (keep it short for WhatsApp)'}

TIPS:
- Don't sound desperate or begging
- Show continued interest and enthusiasm
- Mention specific skills or achievements if relevant
- Professional yet friendly
- Avoid overly generic templates

${isEmail ? 'OUTPUT FORMAT:\nSubject: [subject line]\n\n[email body]\n\nSignature will be added automatically by the system.' : 'OUTPUT FORMAT:\n[whatsapp message]\n\nEmojis are acceptable but use sparingly (max 1-2).'}`;
  }
}

/**
 * Build user prompt with application context
 */
function buildUserPrompt(context: {
  company: string;
  position: string;
  appliedDate: string;
  reminderType: string;
  userAchievements?: string;
  interviewDate?: string;
  specificTopics?: string;
}): string {
  const {
    company,
    position,
    appliedDate,
    reminderType,
    userAchievements,
    interviewDate,
    specificTopics
  } = context;

  let prompt = `Generate a follow-up message with these details:

Company: ${company}
Position: ${position}
Applied Date: ${appliedDate}
Follow-up Type: ${REMINDER_TYPE_LABELS[reminderType]}`;

  if (userAchievements) {
    prompt += `\nRecent Achievements/Skills: ${userAchievements}`;
  }

  if (interviewDate && (reminderType.includes('interview'))) {
    prompt += `\nInterview Date: ${interviewDate}`;
  }

  if (specificTopics) {
    prompt += `\nTopics Discussed: ${specificTopics}`;
  }

  prompt += `\n\nGenerate a professional and personalized message.`;

  return prompt;
}

/**
 * Get available languages
 */
export async function getAvailableLanguages(): Promise<{ value: FollowUpLanguage; label: string }[]> {
  return Object.entries(LANGUAGE_NAMES).map(([value, label]) => ({
    value: value as FollowUpLanguage,
    label
  }));
}
