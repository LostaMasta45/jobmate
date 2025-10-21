/**
 * AI-powered WhatsApp Message Generator using OpenAI GPT-4o-mini via SumoPod
 */

import { openai } from "@/lib/openai";

export interface WAGenerationData {
  messageType: 'application' | 'follow_up' | 'interview_confirmation' | 'thank_you' | 'status_inquiry' | 're_application' | 'referral';
  yourName: string;
  position: string;
  companyName: string;
  
  // Optional Context
  hrdName?: string;
  hrdTitle?: string;
  hrdPhone?: string;
  jobSource?: string;
  referralName?: string;
  previousInteraction?: string;
  
  // Your Info
  currentRole?: string;
  yearsExperience?: number;
  topSkills?: string[];
  
  // Tone & Style
  toneStyle: 'formal' | 'semi-formal' | 'friendly' | 'enthusiastic';
  personality: 'confident' | 'humble' | 'balanced';
  
  // Preferences
  includeGreeting: boolean;
  includeIntro: boolean;
  includeCallToAction: boolean;
  attachmentMention: boolean;
  specificReason?: string;
  recentAchievement?: string;
  availability?: string;
  
  // Message Control
  useEmoji: boolean;
  messageLength: 'short' | 'medium' | 'long';
}

export interface WAGenerationResult {
  content: string;
  wordCount: number;
  charCount: number;
  error?: string;
}

export async function generateWAMessage(data: WAGenerationData): Promise<WAGenerationResult> {
  try {
    const prompt = buildWAPrompt(data);
    
    console.log('Generating WhatsApp message with AI...');
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: getSystemPrompt()
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8, // Higher for more creative variations
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content?.trim() || '';
    
    if (!content) {
      throw new Error('No content generated from AI');
    }

    // Analyze the generated message
    const analysis = analyzeMessage(content);

    return {
      content,
      ...analysis
    };
  } catch (error: any) {
    console.error('Error generating WA message:', error);
    return {
      content: '',
      wordCount: 0,
      charCount: 0,
      error: error.message || 'Failed to generate message'
    };
  }
}

function getSystemPrompt(): string {
  return `You are an expert career coach and professional communicator specializing in WhatsApp job application messages for the Indonesian market. You understand Indonesian workplace culture, formal/informal communication balance, and how to write messages that feel personal, not automated.

Your goal: Create WhatsApp messages that are:
1. Natural and conversational (not stiff/robotic)
2. Professional yet approachable
3. Concise and respectful of HRD's time
4. Personalized and genuine (feels human-written, not templated)
5. Culturally appropriate for Indonesian business communication
6. Mobile-friendly (short paragraphs, easy to read on phones)
7. Unique and creative in wording (different every time)

IMPORTANT: Generate a clean, ready-to-send message. NO placeholders, NO spintax, NO brackets.`;
}

function buildWAPrompt(data: WAGenerationData): string {
  const lengthGuide = {
    short: '50-80 words (very concise)',
    medium: '80-120 words (balanced)',
    long: '120-150 words (detailed but not too long)'
  };

  let prompt = `Generate a WhatsApp message for ${data.messageType.toUpperCase().replace('_', ' ')} with these requirements:

CONTEXT:
- Applicant: ${data.yourName}
- Position: ${data.position}
- Company: ${data.companyName}`;

  if (data.hrdName) prompt += `\n- Recipient: ${data.hrdName}${data.hrdTitle ? ` (${data.hrdTitle})` : ''}`;
  if (data.jobSource) prompt += `\n- Job Found: ${data.jobSource}`;
  if (data.referralName) prompt += `\n- Referred by: ${data.referralName}`;
  if (data.previousInteraction) prompt += `\n- Context: ${data.previousInteraction}`;

  if (data.currentRole || data.yearsExperience || (data.topSkills && data.topSkills.length > 0)) {
    prompt += `\n\nAPPLICANT BACKGROUND:`;
    if (data.currentRole) prompt += `\n- Current Role: ${data.currentRole}`;
    if (data.yearsExperience) prompt += `\n- Experience: ${data.yearsExperience} years`;
    if (data.topSkills && data.topSkills.length > 0) prompt += `\n- Key Skills: ${data.topSkills.join(', ')}`;
  }

  prompt += `\n\nTONE & STYLE:
- Style: ${data.toneStyle} (${getToneDescription(data.toneStyle)})
- Personality: ${data.personality}
- Length: ${data.messageLength} (${lengthGuide[data.messageLength]})
- Emoji: ${data.useEmoji ? 'Use 1-2 professional emojis (🙏, ✨, 📄)' : 'No emoji'}

MESSAGE STRUCTURE:
1. ${data.includeGreeting ? 'Salam pembuka natural (contoh: Assalamu\'alaikum, Selamat pagi, Halo)' : 'Skip greeting, start direct'}`;

  if (data.messageType === 'application') {
    prompt += `\n2. ${data.includeIntro ? 'Brief self-intro (1-2 sentences about relevant experience/skills)' : 'Direct to purpose'}
3. State purpose: applying for the position
4. ${data.specificReason ? `Mention why interested: ${data.specificReason}` : 'Show genuine interest'}
5. ${data.attachmentMention ? 'Mention CV/portfolio attachment' : 'No mention of attachment'}
6. ${data.includeCallToAction ? 'Polite CTA: ask if position is still available' : 'Express hope to hear back'}`;
  } else if (data.messageType === 'follow_up') {
    prompt += `\n2. Mention previous application (${data.previousInteraction || 'a few days ago'})
3. Politely inquire about status
4. ${data.includeCallToAction ? 'Offer to provide additional information' : 'Just checking in'}`;
  } else if (data.messageType === 'interview_confirmation') {
    prompt += `\n2. Confirm attendance
3. ${data.availability ? `Mention availability: ${data.availability}` : 'Express readiness'}
4. Show enthusiasm`;
  } else if (data.messageType === 'thank_you') {
    prompt += `\n2. Thank for the interview opportunity
3. ${data.specificReason ? `Mention specific takeaway: ${data.specificReason}` : 'Express continued interest'}
4. Express eagerness for next steps`;
  } else if (data.messageType === 'status_inquiry') {
    prompt += `\n2. Reference previous interview (${data.previousInteraction || '1-2 weeks ago'})
3. Politely ask for update
4. Reaffirm interest`;
  } else if (data.messageType === 're_application') {
    prompt += `\n2. Reference previous application (${data.previousInteraction || 'a few months ago'})
3. Mention new skills/experience gained since then
4. Express continued interest with fresh value proposition`;
  } else if (data.messageType === 'referral') {
    prompt += `\n2. Mention referral person: ${data.referralName || '[referral name]'}
3. Brief introduction of skills/experience
4. Express interest in potential opportunities`;
  }

  prompt += `\n7. Close with polite gratitude

IMPORTANT RULES:
1. Write in BAHASA INDONESIA (natural, bukan terjemahan kaku)
2. Keep it mobile-friendly (short paragraphs, max 3-4 lines per paragraph)
3. NO CLICHE phrases like "Perkenalkan nama saya..." - be creative and varied!
4. Make it sound PERSONAL and UNIQUE, not like a template
5. Respectful of recipient's time (concise but complete)
6. Include line breaks between paragraphs (use \\n\\n for double line break)
7. Natural flow - like you're texting a professional contact
8. Avoid overly formal language that sounds outdated
9. Match the tone to the company culture
10. Be creative with wording - each generation should feel different

OUTPUT FORMAT:
Return ONLY the final WhatsApp message text. Clean and ready to send. No placeholders, no explanations, no subject line.`;

  return prompt;
}

function getToneDescription(tone: string): string {
  const descriptions = {
    formal: 'Sangat sopan dan profesional, gunakan bahasa baku',
    'semi-formal': 'Profesional tapi ramah, tidak terlalu kaku',
    friendly: 'Santai tapi tetap sopan, seperti teman profesional',
    enthusiastic: 'Excited dan energetic, tunjukkan antusiasme tinggi'
  };
  return descriptions[tone as keyof typeof descriptions] || descriptions['semi-formal'];
}

function analyzeMessage(content: string): {
  wordCount: number;
  charCount: number;
} {
  // Count words (Indonesian/English)
  const words = content.trim().split(/\s+/).length;
  
  // Count characters (excluding whitespace)
  const chars = content.replace(/\s/g, '').length;
  
  return {
    wordCount: words,
    charCount: chars
  };
}

/**
 * Generate multiple variations with different tones
 */
export async function generateWAVariations(
  data: WAGenerationData,
  count: number = 3
): Promise<Array<WAGenerationResult & { variation: string }>> {
  const variations: Array<WAGenerationResult & { variation: string }> = [];
  
  const tones: Array<WAGenerationData['toneStyle']> = ['formal', 'semi-formal', 'friendly'];
  
  for (let i = 0; i < Math.min(count, 3); i++) {
    const variantData = {
      ...data,
      toneStyle: tones[i]
    };
    
    const result = await generateWAMessage(variantData);
    if (!result.error && result.content) {
      variations.push({
        ...result,
        variation: tones[i]
      });
    }
  }
  
  return variations;
}

/**
 * Analyze message quality
 */
export interface MessageQuality {
  score: number; // 0-100
  feedback: {
    tone: { score: number; message: string };
    length: { score: number; message: string };
    personalization: { score: number; message: string };
    mobileReadability: { score: number; message: string };
  };
}

export function analyzeMessageQuality(
  content: string,
  data: WAGenerationData
): MessageQuality {
  const { wordCount, charCount } = analyzeMessage(content);
  
  // Tone Score (check if matches desired tone)
  const toneScore = 80; // Placeholder - could use sentiment analysis
  
  // Length Score (optimal ranges)
  let lengthScore = 100;
  if (data.messageLength === 'short' && (wordCount < 40 || wordCount > 90)) {
    lengthScore = 70;
  } else if (data.messageLength === 'medium' && (wordCount < 70 || wordCount > 130)) {
    lengthScore = 70;
  } else if (data.messageLength === 'long' && (wordCount < 110 || wordCount > 160)) {
    lengthScore = 70;
  }
  
  // Personalization Score (check for context provided)
  let personalizationScore = 100;
  if (!data.hrdName) personalizationScore -= 10;
  if (!data.specificReason && data.messageType === 'application') personalizationScore -= 15;
  if (!data.topSkills || data.topSkills.length === 0) personalizationScore -= 10;
  
  // Mobile Readability (check paragraph length)
  const paragraphs = content.split('\n\n');
  let mobileReadabilityScore = 100;
  paragraphs.forEach(para => {
    if (para.length > 250) mobileReadabilityScore -= 10; // Too long for mobile
  });
  
  // Overall Score
  const overallScore = Math.round(
    (toneScore + lengthScore + personalizationScore + mobileReadabilityScore) / 4
  );
  
  return {
    score: overallScore,
    feedback: {
      tone: {
        score: toneScore,
        message: toneScore >= 80 ? 'Tone sesuai dengan preferensi' : 'Tone kurang sesuai'
      },
      length: {
        score: lengthScore,
        message: lengthScore >= 90 ? 'Panjang optimal' : lengthScore >= 70 ? 'Sedikit terlalu panjang/pendek' : 'Terlalu panjang/pendek'
      },
      personalization: {
        score: personalizationScore,
        message: personalizationScore >= 90 ? 'Sangat personal' : personalizationScore >= 70 ? 'Cukup personal' : 'Kurang personal, tambahkan detail spesifik'
      },
      mobileReadability: {
        score: mobileReadabilityScore,
        message: mobileReadabilityScore >= 90 ? 'Mudah dibaca di mobile' : 'Paragraf terlalu panjang untuk mobile'
      }
    }
  };
}
