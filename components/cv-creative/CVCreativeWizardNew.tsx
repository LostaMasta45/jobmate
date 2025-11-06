"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, Save } from "lucide-react";
import { TemplateGallery } from "./TemplateGallery";
import { PhotoUploader } from "./PhotoUploader";
import { ColorPicker } from "./ColorPicker";
import { CVPreview } from "./CVPreview";
import { StepBasics } from "@/components/cv-ats/steps/StepBasics";
import { StepSummary } from "@/components/cv-ats/steps/StepSummary";
import { StepExperience } from "@/components/cv-ats/steps/StepExperience";
import { StepEducation } from "@/components/cv-ats/steps/StepEducation";
import { StepSkills } from "@/components/cv-ats/steps/StepSkills";
import { StepReviewCreative } from "./StepReviewCreative";
import { MobileTemplateSelector } from "./MobileTemplateSelector";
import { CreativeCV, TemplateId, defaultColorScheme, defaultPhotoOptions } from "@/lib/schemas/cv-creative";
import { emptyResume, Resume } from "@/lib/schemas/cv-ats";
import { CreativeWizardStep } from "@/types/cv-ats";

interface CVCreativeWizardProps {
  initialCV?: Partial<CreativeCV> | null;
  onClose?: () => void;
}

export function CVCreativeWizard({ initialCV, onClose }: CVCreativeWizardProps) {
  const [currentStep, setCurrentStep] = React.useState<CreativeWizardStep>(1);
  const [showPreview, setShowPreview] = React.useState(true); // Toggle for mobile
  const [zoomLevel, setZoomLevel] = React.useState(70); // Zoom percentage - Default 70% for better fit
  
  // Initialize resume from initialCV or use empty
  const migratedResume = React.useMemo(() => {
    if (!initialCV?.content) return emptyResume;
    return {
      ...initialCV.content,
      title: initialCV.content.title || initialCV.title || "Creative CV",
    };
  }, [initialCV]);
  
  const [resume, setResume] = React.useState<Resume>(migratedResume);
  const [templateId, setTemplateId] = React.useState<TemplateId>(
    initialCV?.templateId || "modern-gradient"
  );
  const [colorScheme, setColorScheme] = React.useState(
    initialCV?.colorScheme || defaultColorScheme
  );
  const [photoUrl, setPhotoUrl] = React.useState<string | null>(
    initialCV?.photoUrl || null
  );
  const [photoOptions, setPhotoOptions] = React.useState(
    initialCV?.photoOptions || defaultPhotoOptions
  );

  const steps = [
    { num: 1, label: "Basics", desc: "Info Dasar" },
    { num: 2, label: "Summary", desc: "Ringkasan" },
    { num: 3, label: "Experience", desc: "Pengalaman" },
    { num: 4, label: "Education", desc: "Pendidikan" },
    { num: 5, label: "Skills", desc: "Keahlian" },
    { num: 6, label: "Photo", desc: "Upload Foto" },
    { num: 7, label: "Design", desc: "Template & Warna" },
    { num: 8, label: "Review", desc: "Tinjau & Export" },
  ] as const;

  const handleNext = () => {
    if (currentStep < 8) {
      setCurrentStep((prev) => (prev + 1) as CreativeWizardStep);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as CreativeWizardStep);
    }
  };

  const handleStepClick = (step: CreativeWizardStep) => {
    setCurrentStep(step);
  };

  const handleClose = () => {
    if (confirm("Tutup wizard? Data akan tersimpan otomatis.")) {
      if (onClose) onClose();
    }
  };

  const handleSaveSuccess = () => {
    if (onClose) onClose();
  };

  // Create CV object for preview
  const cv: Partial<CreativeCV> = {
    id: initialCV?.id || crypto.randomUUID(),
    userId: initialCV?.userId || "",
    title: resume.title || "Creative CV",
    templateId,
    colorScheme,
    photoUrl: photoUrl || null,
    photoOptions,
    content: resume,
    atsScore: resume.ats_score || null,
    isDefault: initialCV?.isDefault || false,
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
        return (
          <PhotoUploader
            value={photoUrl}
            options={photoOptions}
            onChange={(url, options) => {
              setPhotoUrl(url);
              setPhotoOptions(options);
            }}
            onSkip={handleNext}
          />
        );
      case 7:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Design & Template</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Pilih template dan sesuaikan warna sesuai gaya Anda
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">Choose Template</h3>
              <TemplateGallery
                selectedTemplate={templateId}
                onSelect={setTemplateId}
              />
            </div>
            
            <div>
              <h3 className="mb-4 text-lg font-semibold">Customize Colors</h3>
              <ColorPicker
                value={colorScheme}
                onChange={setColorScheme}
              />
            </div>
          </div>
        );
      case 8:
        return (
          <StepReviewCreative
            cv={cv}
            resume={resume}
            setResume={setResume}
            templateId={templateId}
            colorScheme={colorScheme}
            photoUrl={photoUrl}
            photoOptions={photoOptions}
            onSaveSuccess={handleSaveSuccess}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen flex-col bg-background lg:flex-row">
      {/* Mobile Navigation Bar - Always visible on mobile */}
      <div className="flex-shrink-0 border-b bg-white p-3 shadow-sm lg:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant={showPreview ? "outline" : "default"}
              size="sm" 
              onClick={() => setShowPreview(!showPreview)}
              className="font-medium"
            >
              {showPreview ? "✏️ Edit" : "👁️ Preview"}
            </Button>
            <div className="rounded-md bg-purple-100 px-2.5 py-1">
              <span className="text-xs font-bold text-purple-700">
                Step {currentStep}/{steps.length}
              </span>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Left Panel - Wizard */}
      <div className={`flex w-full flex-col overflow-hidden lg:w-1/2 lg:border-r ${showPreview ? 'hidden lg:flex' : 'flex'}`}>
        {/* Desktop Header */}
        <div className="hidden border-b p-4 sm:p-6 lg:block">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold sm:text-2xl">CV Creative Generator</h1>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Step {currentStep} of {steps.length} • {steps[currentStep - 1]?.label}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress Indicator */}
          <div className="mt-4 flex gap-1">
            {steps.map((s) => (
              <button
                key={s.num}
                onClick={() => handleStepClick(s.num as CreativeWizardStep)}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  s.num === currentStep
                    ? "bg-gradient-to-r from-purple-500 to-pink-500"
                    : s.num < currentStep
                    ? "bg-gradient-to-r from-purple-500/50 to-pink-500/50"
                    : "bg-muted"
                }`}
                title={`${s.num}. ${s.label}`}
              />
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {renderStep()}
        </div>

        {/* Navigation Toolbar */}
        <div className="flex-shrink-0 border-t bg-background p-3 sm:p-4">
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex-1 sm:flex-initial"
              size="sm"
            >
              ← Prev
            </Button>
            
            <div className="text-xs text-muted-foreground">
              {currentStep} / {steps.length}
            </div>

            {currentStep < 8 ? (
              <Button onClick={handleNext} className="flex-1 sm:flex-initial" size="sm">
                Next →
              </Button>
            ) : (
              <span className="text-xs text-muted-foreground">✓ Review</span>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation - Always visible when editing */}
      {!showPreview && (
        <div className="flex-shrink-0 border-t bg-white p-3 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex-1 font-medium"
              size="default"
            >
              ← Back
            </Button>
            {currentStep < 8 ? (
              <Button onClick={handleNext} className="flex-1 font-medium shadow-md" size="default">
                Next →
              </Button>
            ) : (
              <Button onClick={() => setShowPreview(true)} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 font-medium shadow-md" size="default">
                Preview & Save
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Right Panel - Live Preview */}
      <div className={`flex w-full flex-col bg-gray-50 dark:from-purple-950 dark:to-pink-950 lg:w-1/2 lg:bg-gradient-to-br lg:from-purple-50 lg:to-pink-50 ${showPreview ? 'flex' : 'hidden lg:flex'}`}>
        {/* Mobile Template Selector - Only on Mobile Preview */}
        <div className="flex-shrink-0 bg-white p-3 shadow-sm lg:bg-transparent lg:shadow-none">
          <div className="lg:hidden">
            <MobileTemplateSelector
              selectedTemplate={templateId}
              onSelect={setTemplateId}
            />
          </div>
        </div>

        {/* Preview Header - Desktop Only */}
        <div className="hidden flex-shrink-0 border-b border-purple-200 bg-white/50 p-4 backdrop-blur-sm dark:border-purple-800 dark:bg-purple-950/50 lg:flex lg:items-center lg:justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold">Live Preview</h3>
            <div className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-purple-600 shadow-sm">
              {templateId}
            </div>
          </div>
          {/* Zoom Controls - Desktop - Enhanced Visibility */}
          <div className="flex items-center gap-2 rounded-lg border-2 border-purple-300 bg-white px-3 py-2 shadow-md">
            <button
              onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
              className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-100 text-lg font-bold text-purple-700 transition-all hover:bg-purple-200 disabled:cursor-not-allowed disabled:opacity-30"
              disabled={zoomLevel <= 50}
              title="Zoom Out"
            >
              −
            </button>
            <span className="min-w-[50px] text-center text-sm font-semibold text-purple-900">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))}
              className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-100 text-lg font-bold text-purple-700 transition-all hover:bg-purple-200 disabled:cursor-not-allowed disabled:opacity-30"
              disabled={zoomLevel >= 150}
              title="Zoom In"
            >
              +
            </button>
          </div>
        </div>

        {/* Preview Container - Scrollable with Mobile-Optimized Scaling */}
        <div className="flex-1 overflow-auto bg-gray-50">
          {/* Desktop: Use zoom controls */}
          <div className="hidden min-h-full items-start justify-center p-6 lg:flex">
            <div
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top center',
                transition: 'transform 0.2s ease-in-out',
              }}
            >
              <CVPreview cv={cv} />
            </div>
          </div>
          
          {/* Mobile/Tablet: Responsive A4 preview */}
          <div className="block p-4 lg:hidden">
            <div className="mx-auto" style={{ width: 'fit-content' }}>
              <div
                className="origin-top"
                style={{
                  transform: 'scale(0.48)',
                  transformOrigin: 'top center',
                }}
              >
                <CVPreview cv={cv} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
