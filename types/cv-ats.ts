export type WizardStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

// CV Creative wizard has 8 steps
export type CreativeWizardStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface ATSSuggestion {
  priority: "high" | "medium" | "low";
  section: "header" | "summary" | "experience" | "education" | "skills" | "general";
  issue: string;
  suggestion: string;
  example?: {
    before?: string;
    after: string;
  };
}

export interface ATSScoreBreakdown {
  header: number;        // max 10
  keywords: number;      // max 40
  experience: number;    // max 20
  format: number;        // max 10
  quantification: number; // max 10
  consistency: number;   // max 10
}

export interface ATSAnalysis {
  score: number;
  scoreBreakdown: ATSScoreBreakdown;
  missingKeywords: string[];
  matchedKeywords: string[];
  keywordMatchPercent: number;
  issues: string[];
  suggestions: ATSSuggestion[];
  quickWins: string[];
  strengths: string[];
}

export interface ValidationError {
  field: string;
  message: string;
  step: WizardStep;
}

export interface AutosaveStatus {
  saved: boolean;
  timestamp: string | null;
  saving: boolean;
}
