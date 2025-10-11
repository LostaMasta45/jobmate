export type WizardStep = 1 | 2 | 3 | 4 | 5 | 6;

export interface ATSAnalysis {
  score: number;
  missingKeywords: string[];
  issues: string[];
  suggestions: string[];
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
