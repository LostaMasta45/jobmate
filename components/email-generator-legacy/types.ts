export interface EmailFormData {
  // Step 1: What & Who
  emailType: 'application' | 'follow_up' | 'thank_you' | 'inquiry' | '';
  position: string;
  companyName: string;
  yourName: string;
  hrdName?: string;
  hasAttachment: boolean;
  
  // Conditional fields (shown based on emailType)
  interviewDate?: string; // For thank_you
  applicationDate?: string; // For follow_up
  interviewTopics?: string; // For thank_you - what was discussed
  
  // Step 2: How & What
  toneStyle: 'formal' | 'professional' | 'casual';
  highlightSkills: string[];
  achievements?: string;
  personalStory?: string;
  includeWhyCompany: boolean;
  includeWhyYou: boolean;
  
  // Generated (Step 3)
  subjectLine?: string;
  bodyContent?: string;
  
  // Legacy fields (kept for backward compatibility with generate action)
  hrdTitle?: string;
  jobSource?: string;
  referralName?: string;
  currentRole?: string;
  yearsExperience?: number;
  specificTopics?: string;
  personality?: 'confident' | 'humble' | 'enthusiastic' | 'balanced';
  lengthType?: 'concise' | 'medium' | 'detailed';
  callToAction?: 'interview' | 'meeting' | 'discussion' | 'portfolio_review';
  openingStyle?: 'achievement' | 'story' | 'connection' | 'question' | 'direct';
  toneSettings?: {
    formality: number;
    confidence: number;
    enthusiasm: number;
  };
}

// Detected company type for smart suggestions
export type CompanyType = 'startup' | 'corporate' | 'bank' | 'government' | 'agency' | 'multinational' | 'unknown';

// Preview skeleton for live preview
export interface PreviewSkeleton {
  subject: string;
  greeting: string;
  paragraphs: { text: string; isPlaceholder: boolean }[];
  closing: string;
  wordCount: number;
  completeness: number;
}
