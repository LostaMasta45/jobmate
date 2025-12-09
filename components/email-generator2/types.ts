// Email Generator V2 - Type Definitions

export type EmailType = 'application' | 'follow_up' | 'thank_you' | 'inquiry';

export interface FollowUpFormData {
    fullName: string;
    position: string;
    companyName: string;
    hrdName: string;
    lastStage: 'sent_application' | 'test' | 'interview';
    lastInteractionDate: string;
    promisedFollowUp: string;
    phoneNumber: string;
    emailTone: 'formal' | 'semi_formal' | 'casual';
}

export interface ThankYouFormData {
    fullName: string;
    position: string;
    companyName: string;
    interviewerName: string;
    interviewType: 'hr' | 'user' | 'final';
    interviewDate: string;
    topicsDiscussed: string;
    impression: string;
    additionalInfo: string;
    emailTone: 'formal' | 'semi_formal' | 'casual';
}

export interface InquiryFormData {
    fullName: string;
    companyName: string;
    interestedFields: string;
    whyInterested: string;
    briefExperience: string;
    skills: string;
    phoneNumber: string;
    attachCV: boolean;
    emailTone: 'formal' | 'semi_formal' | 'casual';
}
