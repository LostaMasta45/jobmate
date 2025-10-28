"use client";

import * as React from "react";
import { Resume, emptyResume } from "@/lib/schemas/cv-ats";
import { WizardStep, AutosaveStatus } from "@/types/cv-ats";
import { StepBasics } from "./steps/StepBasics";
import { StepSummary } from "./steps/StepSummary";
import { StepExperience } from "./steps/StepExperience";
import { StepEducation } from "./steps/StepEducation";
import { StepSkills } from "./steps/StepSkills";
import { StepReview } from "./steps/StepReview";
import { CVPreview } from "./CVPreview";
import { WizardToolbar } from "./WizardToolbar";
import { Button } from "@/components/ui/button";
import { X, Save } from "lucide-react";

interface CVWizardProps {
  initialResume?: Resume | null;
  onClose?: () => void;
}

export function CVWizard({ initialResume, onClose }: CVWizardProps) {
  const [currentStep, setCurrentStep] = React.useState<WizardStep>(1);
  
  // Migrate old resumes without title field
  const migratedResume = React.useMemo(() => {
    if (!initialResume) return emptyResume;
    
    return {
      ...initialResume,
      title: initialResume.title || `CV ${initialResume.basics?.firstName || "Saya"}`,
    };
  }, [initialResume]);
  
  const [resume, setResume] = React.useState<Resume>(migratedResume);
  const [autosaveStatus, setAutosaveStatus] = React.useState<AutosaveStatus>({
    saved: false,
    timestamp: null,
    saving: false,
  });

  // Autosave to localStorage every 3 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem("cv-ats-draft", JSON.stringify(resume));
        setAutosaveStatus({
          saved: true,
          timestamp: new Date().toLocaleTimeString("id-ID"),
          saving: false,
        });
      } catch (error) {
        console.error("Autosave error:", error);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [resume]);

  // Load from localStorage on mount (only if not editing)
  React.useEffect(() => {
    if (!initialResume) {
      try {
        const saved = localStorage.getItem("cv-ats-draft");
        if (saved) {
          setResume(JSON.parse(saved));
        }
      } catch (error) {
        console.error("Load draft error:", error);
      }
    }
  }, [initialResume]);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep, resume]);

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep((prev) => (prev + 1) as WizardStep);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as WizardStep);
    }
  };

  const handleStepClick = (step: WizardStep) => {
    setCurrentStep(step);
  };

  const handleSave = async () => {
    setAutosaveStatus({ ...autosaveStatus, saving: true });
    // TODO: Save to database
    setTimeout(() => {
      setAutosaveStatus({
        saved: true,
        timestamp: new Date().toLocaleTimeString("id-ID"),
        saving: false,
      });
    }, 500);
  };

  const handleClose = () => {
    if (confirm("Tutup wizard? Perubahan tersimpan otomatis.")) {
      // Clear localStorage draft when closing
      try {
        localStorage.removeItem("cv-ats-draft");
      } catch (error) {
        console.error("Clear draft error:", error);
      }
      
      if (onClose) {
        onClose();
      }
    }
  };

  const handleSaveSuccess = () => {
    // Clear draft on successful save
    try {
      localStorage.removeItem("cv-ats-draft");
    } catch (error) {
      console.error("Clear draft error:", error);
    }
    
    // Close wizard and return to history
    if (onClose) {
      onClose();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepBasics resume={resume} setResume={setResume} />;
      case 2:
        return <StepSummary resume={resume} setResume={setResume} />;
      case 3:
        return <StepExperience resume={resume} setResume={setResume} />;
      case 4:
        return <StepEducation resume={resume} setResume={setResume} />;
      case 5:
        return <StepSkills resume={resume} setResume={setResume} />;
      case 6:
        return <StepReview resume={resume} setResume={setResume} onSaveSuccess={handleSaveSuccess} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Left Panel - Wizard */}
      <div className="flex w-full flex-col lg:w-1/2 lg:border-r">
        {/* Header */}
        <div className="border-b p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold sm:text-2xl">CV ATS Generator</h1>
              <p className="text-xs text-muted-foreground sm:text-sm">
                {autosaveStatus.saved && autosaveStatus.timestamp && (
                  <span>Tersimpan • {autosaveStatus.timestamp}</span>
                )}
                {autosaveStatus.saving && <span>Menyimpan...</span>}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Save className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mt-4 flex gap-1">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <button
                key={step}
                onClick={() => handleStepClick(step as WizardStep)}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  step === currentStep
                    ? "bg-primary"
                    : step < currentStep
                    ? "bg-primary/50"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {renderStep()}
        </div>

        {/* Toolbar */}
        <WizardToolbar
          currentStep={currentStep}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSave={handleSave}
        />
      </div>

      {/* Right Panel - Preview (hidden on mobile) */}
      <div className="hidden w-1/2 overflow-y-auto bg-muted/30 lg:block">
        <div className="sticky top-0 p-6">
          <CVPreview resume={resume} />
        </div>
      </div>
    </div>
  );
}
