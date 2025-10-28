"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, ChevronLeft, ChevronRight, Save } from "lucide-react";
import { TemplateGallery } from "./TemplateGallery";
import { PhotoUploader } from "./PhotoUploader";
import { ColorPicker } from "./ColorPicker";
import { ModernGradient } from "./templates/ModernGradient";
import { StepBasics } from "@/components/cv-ats/steps/StepBasics";
import { StepSummary } from "@/components/cv-ats/steps/StepSummary";
import { StepExperience } from "@/components/cv-ats/steps/StepExperience";
import { StepEducation } from "@/components/cv-ats/steps/StepEducation";
import { StepSkills } from "@/components/cv-ats/steps/StepSkills";
import { CreativeCV, TemplateId, defaultColorScheme, defaultPhotoOptions } from "@/lib/schemas/cv-creative";
import { emptyResume } from "@/lib/schemas/cv-ats";
import { saveCreativeCV } from "@/actions/cv-creative";

interface CVCreativeWizardProps {
  initialCV?: Partial<CreativeCV> | null;
  onClose?: () => void;
}

export function CVCreativeWizard({ initialCV, onClose }: CVCreativeWizardProps) {
  const [step, setStep] = React.useState(1);
  const [saving, setSaving] = React.useState(false);
  
  const [cv, setCV] = React.useState<Partial<CreativeCV>>({
    id: initialCV?.id || crypto.randomUUID(),
    userId: initialCV?.userId || "",
    title: initialCV?.title || "Creative CV",
    templateId: initialCV?.templateId || "modern-gradient",
    colorScheme: initialCV?.colorScheme || defaultColorScheme,
    photoUrl: initialCV?.photoUrl || null,
    photoOptions: initialCV?.photoOptions || defaultPhotoOptions,
    content: initialCV?.content || emptyResume,
    atsScore: initialCV?.atsScore || null,
    isDefault: initialCV?.isDefault || false,
  });

  const steps = [
    { num: 1, label: "Template", shortLabel: "Temp" },
    { num: 2, label: "Photo", shortLabel: "Photo" },
    { num: 3, label: "Basics", shortLabel: "Info" },
    { num: 4, label: "Summary", shortLabel: "Sum" },
    { num: 5, label: "Experience", shortLabel: "Exp" },
    { num: 6, label: "Education", shortLabel: "Edu" },
    { num: 7, label: "Skills", shortLabel: "Skills" },
    { num: 8, label: "Design", shortLabel: "Design" },
  ];

  const handleNext = () => {
    if (step < 8) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveCreativeCV(cv);
      alert("CV berhasil disimpan!");
      if (onClose) onClose();
    } catch (error) {
      alert("Gagal menyimpan CV");
    } finally {
      setSaving(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <TemplateGallery
            selectedTemplate={cv.templateId}
            onSelect={(templateId) => {
              setCV({ ...cv, templateId });
              handleNext();
            }}
          />
        );

      case 2:
        return (
          <PhotoUploader
            value={cv.photoUrl}
            options={cv.photoOptions!}
            onChange={(url, options) => setCV({ ...cv, photoUrl: url, photoOptions: options })}
            onSkip={handleNext}
          />
        );

      case 3:
        return (
          <StepBasics
            data={cv.content!}
            onChange={(data) => setCV({ ...cv, content: data })}
          />
        );

      case 4:
        return (
          <StepSummary
            data={cv.content!}
            onChange={(data) => setCV({ ...cv, content: data })}
          />
        );

      case 5:
        return (
          <StepExperience
            data={cv.content!}
            onChange={(data) => setCV({ ...cv, content: data })}
          />
        );

      case 6:
        return (
          <StepEducation
            data={cv.content!}
            onChange={(data) => setCV({ ...cv, content: data })}
          />
        );

      case 7:
        return (
          <StepSkills
            data={cv.content!}
            onChange={(data) => setCV({ ...cv, content: data })}
          />
        );

      case 8:
        return (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left: Color Picker */}
            <div className="space-y-6">
              <div>
                <h2 className="mb-1 text-xl font-bold">Customize Design</h2>
                <p className="text-sm text-muted-foreground">
                  Pilih skema warna yang sesuai dengan kepribadian Anda
                </p>
              </div>
              
              <ColorPicker
                value={cv.colorScheme!}
                onChange={(colors) => setCV({ ...cv, colorScheme: colors })}
              />

              <div className="rounded-lg border bg-muted/50 p-4">
                <h3 className="mb-2 text-sm font-semibold">Tips:</h3>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li>• Pilih warna yang cocok dengan industri target</li>
                  <li>• Blue/Navy untuk Corporate/Tech</li>
                  <li>• Purple/Orange untuk Creative</li>
                  <li>• Green untuk Healthcare/Sustainability</li>
                </ul>
              </div>
            </div>

            {/* Right: Live Preview */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">Live Preview</h3>
              <div className="max-h-[600px] overflow-auto rounded-lg border bg-gray-50 p-4">
                <div className="scale-50 origin-top-left transform" style={{ width: "200%" }}>
                  <ModernGradient cv={cv} />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Header - Responsive */}
      <div className="border-b bg-white">
        <div className="container flex items-center justify-between py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <h1 className="text-base font-bold sm:text-xl">CV Creative</h1>
            <span className="text-xs text-muted-foreground sm:text-sm">
              {step}/{steps.length}
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
        <Progress value={(step / steps.length) * 100} className="h-1 rounded-none" />
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-6xl px-3 py-4 sm:px-6 sm:py-8">
        {/* Step Indicators - Responsive */}
        <div className="mb-4 sm:mb-6">
          <div className="mb-3 flex justify-center gap-1.5 sm:gap-2">
            {steps.map((s) => (
              <div
                key={s.num}
                className={`group relative flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all sm:h-10 sm:w-10 sm:text-sm ${
                  s.num === step
                    ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
                    : s.num < step
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {s.num}
                {/* Tooltip on hover - desktop only */}
                <span className="absolute -bottom-6 hidden whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 sm:block">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
          {/* Current step label - always visible */}
          <p className="text-center text-sm font-medium text-muted-foreground sm:text-base">
            {steps[step - 1].label}
          </p>
        </div>

        <div className="mb-8">{renderStep()}</div>

        {/* Navigation - Responsive */}
        <div className="flex items-center justify-between gap-2">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={step === 1}
            size="sm"
            className="sm:size-default"
          >
            <ChevronLeft className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Previous</span>
          </Button>

          <div className="flex gap-2">
            {step === 8 ? (
              <Button 
                onClick={handleSave} 
                disabled={saving} 
                size="sm"
                className="sm:size-lg"
              >
                <Save className="h-4 w-4 sm:mr-2" />
                <span>{saving ? "Saving..." : "Save CV"}</span>
              </Button>
            ) : (
              <Button 
                onClick={handleNext}
                size="sm"
                className="sm:size-default"
              >
                <span className="hidden sm:inline">Next</span>
                <span className="sm:hidden">Next</span>
                <ChevronRight className="h-4 w-4 sm:ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
