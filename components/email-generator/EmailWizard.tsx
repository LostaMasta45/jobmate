"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { StepEmailType } from "./StepEmailType";
import { StepBasicInfo } from "./StepBasicInfo";
import { StepToneStyle } from "./StepToneStyle";
import { StepContent } from "./StepContent";
import { StepPreview } from "./StepPreview";

export interface EmailFormData {
  // Basic Info
  emailType: 'application' | 'follow_up' | 'thank_you' | 'inquiry';
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

const STEPS = [
  { id: 1, title: "Jenis Email", icon: "📧" },
  { id: 2, title: "Info Dasar", icon: "📋" },
  { id: 3, title: "Tone & Style", icon: "🎨" },
  { id: 4, title: "Konten", icon: "📝" },
  { id: 5, title: "Preview", icon: "👁️" },
];

export function EmailWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<EmailFormData>({
    emailType: 'application',
    position: '',
    companyName: '',
    hasAttachment: true,
    yourName: '',
    toneStyle: 'semi-formal',
    personality: 'balanced',
    lengthType: 'medium',
    highlightSkills: [],
    includeWhyCompany: true,
    includeWhyYou: true,
  });

  const updateFormData = (data: Partial<EmailFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return formData.emailType; // Step 1: Email type must be selected
      case 2:
        return formData.position && formData.companyName && formData.yourName;
      case 3:
        return true; // Always can proceed from step 3
      case 4:
        return true; // Always can proceed from step 4
      default:
        return false;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-3 shadow-lg">
          <Sparkles className="h-7 w-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Email Generator</h1>
          <p className="text-muted-foreground">
            Buat email lamaran profesional dengan bantuan AI
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step Item */}
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2 transition-all ${
                    currentStep === step.id
                      ? "bg-primary text-primary-foreground scale-110 shadow-lg"
                      : currentStep > step.id
                      ? "bg-green-100 text-green-700"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step.icon}
                </div>
                <div className="text-center">
                  <p
                    className={`text-sm font-medium ${
                      currentStep === step.id
                        ? "text-primary"
                        : currentStep > step.id
                        ? "text-green-700"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              {index < STEPS.length - 1 && (
                <div className="flex-1 h-1 mx-2 -mt-8">
                  <div
                    className={`h-full rounded transition-all ${
                      currentStep > step.id ? "bg-green-500" : "bg-muted"
                    }`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {currentStep === 1 && (
            <StepEmailType formData={formData} updateFormData={updateFormData} />
          )}
          {currentStep === 2 && (
            <StepBasicInfo formData={formData} updateFormData={updateFormData} />
          )}
          {currentStep === 3 && (
            <StepToneStyle formData={formData} updateFormData={updateFormData} />
          )}
          {currentStep === 4 && (
            <StepContent formData={formData} updateFormData={updateFormData} />
          )}
          {currentStep === 5 && (
            <StepPreview formData={formData} updateFormData={updateFormData} />
          )}
        </div>

        {/* Navigation Buttons */}
        {currentStep < 5 && (
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>

            <Button
              onClick={nextStep}
              disabled={!canProceedToNext()}
              className="gap-2"
            >
              {currentStep === 4 ? "Generate Email" : "Lanjut"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
