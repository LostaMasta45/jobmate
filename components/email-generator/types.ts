export interface EmailFormData {
  // Basic Info
  emailType: 'application' | 'follow_up' | 'thank_you' | 'inquiry' | '';
  position: string;
  companyName: string;
  hrdName?: string;
  hrdTitle?: string;
  jobSource?: string;
  referralName?: string;
  hasAttachment: boolean;
  yourName: string;
  currentRole?: string;
  yearsExperience?: number;
  
  // Conditional fields
  interviewDate?: string; // For thank_you
  applicationDate?: string; // For follow_up
  specificTopics?: string; // For thank_you
  
  // Tone & Style
  toneStyle: 'formal' | 'semi-formal' | 'casual' | 'creative';
  personality: 'confident' | 'humble' | 'enthusiastic' | 'balanced';
  lengthType: 'concise' | 'medium' | 'detailed';
  
  // Content
  highlightSkills: string[];
  achievements?: string;
  includeWhyCompany: boolean;
  includeWhyYou: boolean;
  callToAction?: 'interview' | 'meeting' | 'discussion' | 'portfolio_review';
  
  // Generated
  subjectLine?: string;
  bodyContent?: string;
}
