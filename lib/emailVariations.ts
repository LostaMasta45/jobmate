// A/B Email Variation Generator - Phase 4
// Generate multiple email variations with different approaches

import { generateEmailWithAI } from '@/actions/email/generate';

export interface EmailVariation {
  id: string;
  name: string;
  nameId: string;
  description: string;
  descriptionId: string;
  icon: string;
  approach: string;
  subject?: string;
  body?: string;
  isGenerating?: boolean;
  error?: string;
}

export const VARIATION_TYPES: Omit<EmailVariation, 'subject' | 'body' | 'isGenerating' | 'error'>[] = [
  {
    id: 'data_driven',
    name: 'Professional & Data-Driven',
    nameId: 'Profesional & Berbasis Data',
    description: 'Focus on metrics, numbers, and quantifiable achievements',
    descriptionId: 'Fokus pada metrik, angka, dan pencapaian terukur',
    icon: '📊',
    approach: `CRITICAL INSTRUCTIONS FOR THIS VARIATION:
- Lead with NUMBERS and METRICS in every paragraph
- Every claim must have a quantifiable proof (%, $, time saved, etc.)
- Use data-driven language: "increased by X%", "reduced Y by Z hours"
- Structure like a business case: problem → solution → measurable result
- Avoid emotional language, focus on logical reasoning
- Include specific timeframes for achievements
- End with a data-backed call-to-action`
  },
  {
    id: 'story_driven',
    name: 'Story-Driven & Personal',
    nameId: 'Berbasis Cerita & Personal',
    description: 'Engaging narrative that makes you memorable',
    descriptionId: 'Narasi yang engaging dan membuat memorable',
    icon: '📖',
    approach: `CRITICAL INSTRUCTIONS FOR THIS VARIATION:
- Open with a compelling mini-story or anecdote
- Create emotional connection through personal journey
- Use "I remember when..." or "The moment I..." type openings
- Include challenges you overcame and lessons learned
- Make it conversational, like telling a friend
- Show personality and authenticity
- End with how your story aligns with their mission`
  },
  {
    id: 'value_proposition',
    name: 'Value Proposition Focus',
    nameId: 'Fokus Nilai yang Ditawarkan',
    description: 'Emphasize what you bring to solve their problems',
    descriptionId: 'Tekankan solusi yang bisa kamu berikan',
    icon: '💎',
    approach: `CRITICAL INSTRUCTIONS FOR THIS VARIATION:
- Focus entirely on VALUE you bring to THEM
- Frame everything as solving their problems
- Use "You will get..." and "This means for your team..."
- Research-based: mention specific company challenges you can address
- Future-oriented: paint picture of success with you on board
- Be bold about your unique value proposition
- End with specific offer: "I can help you achieve X by doing Y"`
  }
];

export interface GenerateVariationsParams {
  emailType: string;
  position: string;
  companyName: string;
  yourName: string;
  hrdName?: string;
  hrdTitle?: string;
  jobSource?: string;
  referralName?: string;
  hasAttachment: boolean;
  currentRole?: string;
  yearsExperience?: number;
  toneStyle: string;
  personality: string;
  lengthType: string;
  highlightSkills?: string[];
  achievements?: string;
  includeWhyCompany: boolean;
  includeWhyYou: boolean;
  callToAction?: string;
  personalStory?: string;
  openingStyle?: string;
  toneSettings?: {
    formality: number;
    confidence: number;
    enthusiasm: number;
  };
  language?: 'id' | 'en';
}

// Generate a single variation
export async function generateSingleVariation(
  params: GenerateVariationsParams,
  variation: typeof VARIATION_TYPES[0]
): Promise<{ subject: string; body: string } | { error: string }> {
  try {
    const result = await generateEmailWithAI({
      ...params,
      emailType: params.emailType as any,
      toneStyle: params.toneStyle as any,
      personality: params.personality as any,
      lengthType: params.lengthType as any,
      callToAction: params.callToAction as any,
      openingStyle: params.openingStyle as any,
      language: params.language || 'id',
      // Add variation-specific instructions via achievements field
      achievements: params.achievements 
        ? `${params.achievements}\n\n[VARIATION STYLE: ${variation.approach}]`
        : `[VARIATION STYLE: ${variation.approach}]`,
    });

    if (result.error) {
      return { error: result.error };
    }

    return {
      subject: result.subject || '',
      body: result.body || '',
    };
  } catch (error: any) {
    return { error: error.message || 'Failed to generate variation' };
  }
}

// Generate all variations (can be called in parallel or sequentially)
export async function generateAllVariations(
  params: GenerateVariationsParams
): Promise<EmailVariation[]> {
  const results = await Promise.all(
    VARIATION_TYPES.map(async (variation) => {
      const result = await generateSingleVariation(params, variation);
      
      if ('error' in result) {
        return {
          ...variation,
          error: result.error,
        };
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

// Utility to compare variations
export function compareVariations(variations: EmailVariation[]): {
  longestBody: string;
  shortestBody: string;
  avgWordCount: number;
  recommendations: string[];
} {
  const validVariations = variations.filter(v => v.body && !v.error);
  
  if (validVariations.length === 0) {
    return {
      longestBody: '',
      shortestBody: '',
      avgWordCount: 0,
      recommendations: ['Tidak ada variasi yang berhasil di-generate']
    };
  }

  const wordCounts = validVariations.map(v => v.body!.split(/\s+/).length);
  const avgWordCount = Math.round(wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length);
  
  const sorted = [...validVariations].sort((a, b) => 
    (a.body?.length || 0) - (b.body?.length || 0)
  );

  const recommendations: string[] = [];
  
  // Check for variation with best data
  const dataVariation = validVariations.find(v => v.id === 'data_driven');
  if (dataVariation?.body) {
    const hasNumbers = /\d+%|\$\d+|\d+ tahun|\d+ bulan/.test(dataVariation.body);
    if (hasNumbers) {
      recommendations.push('📊 Variasi "Data-Driven" memiliki angka konkret - bagus untuk perusahaan korporat');
    }
  }

  // Check story variation
  const storyVariation = validVariations.find(v => v.id === 'story_driven');
  if (storyVariation?.body && storyVariation.body.length > 300) {
    recommendations.push('📖 Variasi "Story-Driven" cocok untuk startup atau perusahaan dengan culture yang personal');
  }

  // Check value prop variation
  const valueVariation = validVariations.find(v => v.id === 'value_proposition');
  if (valueVariation?.body) {
    const focusOnThem = (valueVariation.body.match(/anda|Anda|kamu|tim|perusahaan|you|your/gi) || []).length;
    if (focusOnThem > 3) {
      recommendations.push('💎 Variasi "Value Proposition" sangat fokus ke recruiter - efektif untuk menonjol');
    }
  }

  if (recommendations.length === 0) {
    recommendations.push('💡 Pilih variasi yang paling sesuai dengan culture perusahaan target');
  }

  return {
    longestBody: sorted[sorted.length - 1].id,
    shortestBody: sorted[0].id,
    avgWordCount,
    recommendations
  };
}
