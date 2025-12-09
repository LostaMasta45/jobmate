"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WAGenerationData } from "@/lib/ai/whatsapp";
import { ChevronRight, ChevronLeft, Zap, Check } from "lucide-react";
import { StepTypeTarget } from "./wizard/StepTypeTarget";
import { StepPersonalDetails } from "./wizard/StepPersonalDetails";
import { StepCustomization } from "./wizard/StepCustomization";
import { StepReview } from "./wizard/StepReview";
import { cn } from "@/lib/utils";

interface WAGeneratorWizardProps {
  formData: Partial<WAGenerationData>;
  updateFormData: (updates: Partial<WAGenerationData>) => void;
  onGenerate: () => void;
  loading: boolean;
}

const STEPS = [
  { id: 1, title: "Target", component: StepTypeTarget },
  { id: 2, title: "Details", component: StepPersonalDetails },
  { id: 3, title: "Style", component: StepCustomization },
  { id: 4, title: "Review", component: StepReview },
];

export function WAGeneratorWizard({ formData, updateFormData, onGenerate, loading }: WAGeneratorWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentComponent = STEPS[currentStep - 1].component;
  const isLastStep = currentStep === STEPS.length;
  const canProceed = () => {
    if (currentStep === 1) return formData.companyName && formData.position;
    if (currentStep === 2) return formData.yourName;
    return true;
  };

  return (
    <Card className="border-2 border-muted/40 shadow-lg flex flex-col h-full min-h-[500px]">
      <CardHeader className="pb-4 border-b bg-muted/10">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-lg font-bold">
            Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].title}
          </CardTitle>
          <div className="flex gap-1 w-1/2 sm:w-auto justify-end">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className={cn(
                  "h-2 w-8 sm:w-12 rounded-full transition-all duration-300",
                  currentStep >= step.id ? "bg-green-600" : "bg-muted"
                )}
              />
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 pt-6 overflow-y-auto max-h-[calc(100vh-300px)]">
        <CurrentComponent formData={formData} updateFormData={updateFormData} />
      </CardContent>

      <div className="p-4 border-t bg-muted/5 flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={currentStep === 1}
          className={cn(currentStep === 1 && "invisible")}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {isLastStep ? (
          <Button
            onClick={onGenerate}
            disabled={loading}
            size="lg"
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-md text-white px-8"
          >
            {loading ? (
              <>
                <Zap className="mr-2 h-5 w-5 animate-pulse" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-5 w-5" />
                Generate Now
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-primary"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </Card>
  );
}
