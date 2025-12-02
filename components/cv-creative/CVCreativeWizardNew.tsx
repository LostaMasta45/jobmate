"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, Save, Eye, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { PhotoUploader } from "./PhotoUploader";
import { CVPreview } from "./CVPreview";
import { StepBasics } from "@/components/cv-ats/steps/StepBasics";
import { StepSummary } from "@/components/cv-ats/steps/StepSummary";
import { StepExperience } from "@/components/cv-ats/steps/StepExperience";
import { StepEducation } from "@/components/cv-ats/steps/StepEducation";
import { StepSkills } from "@/components/cv-ats/steps/StepSkills";
import { StepReviewCreative } from "./StepReviewCreative";
import { MobileTemplateSelector } from "./MobileTemplateSelector";
import { StepTemplateCreative } from "./StepTemplateCreative";
import { CreativeCV, TemplateId, defaultColorScheme, defaultPhotoOptions } from "@/lib/schemas/cv-creative";
import { emptyResume, Resume } from "@/lib/schemas/cv-ats";
import { CreativeWizardStep } from "@/types/cv-ats";
import { motion, AnimatePresence } from "framer-motion";

interface CVCreativeWizardProps {
  initialCV?: Partial<CreativeCV> | null;
  onClose?: () => void;
}

export function CVCreativeWizard({ initialCV, onClose }: CVCreativeWizardProps) {
  const [currentStep, setCurrentStep] = React.useState<CreativeWizardStep>(1);
  const [showPreview, setShowPreview] = React.useState(false); // Default false for mobile
  const [direction, setDirection] = React.useState(0);
  
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
      setDirection(1);
      setCurrentStep((prev) => (prev + 1) as CreativeWizardStep);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep((prev) => (prev - 1) as CreativeWizardStep);
    }
  };

  const handleStepClick = (step: CreativeWizardStep) => {
    setDirection(step > currentStep ? 1 : -1);
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
          <StepTemplateCreative
            cv={cv}
            templateId={templateId}
            setTemplateId={setTemplateId}
            colorScheme={colorScheme}
            setColorScheme={setColorScheme}
          />
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

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 20 : -20,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -20 : 20,
      opacity: 0,
    }),
  };

  return (
    <div className="flex h-[100dvh] flex-col bg-slate-50 dark:bg-slate-950 lg:flex-row lg:h-screen lg:overflow-hidden">
      
      {/* MOBILE HEADER: Segmented Progress & Top Bar */}
      <div className="flex-shrink-0 bg-white dark:bg-slate-900 pt-[env(safe-area-inset-top)] lg:hidden z-20">
        {/* Segmented Progress Bar */}
        <div className="flex gap-1 px-2 pt-2 pb-1">
          {steps.map((s) => (
            <div 
              key={s.num} 
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                s.num <= currentStep 
                  ? "bg-gradient-to-r from-purple-500 to-pink-500" 
                  : "bg-slate-200 dark:bg-slate-800"
              }`}
            />
          ))}
        </div>
        
        {/* Navbar Content */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Step {currentStep} of {steps.length}
            </span>
            <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
              {steps[currentStep - 1]?.label}
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={handleClose}>
              <X className="h-5 w-5 text-slate-500" />
            </Button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className={`flex w-full flex-col overflow-hidden lg:w-1/2 lg:border-r relative ${showPreview ? 'hidden lg:flex' : 'flex'}`}>
        
        {/* Desktop Header (Hidden on Mobile) */}
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

          {/* Desktop Progress */}
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

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50 dark:bg-slate-950 lg:bg-white lg:dark:bg-slate-950">
          <div className="min-h-full p-4 pb-32 sm:p-6 lg:pb-6"> {/* Added massive bottom padding for mobile floating bar */}
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full max-w-2xl mx-auto lg:max-w-none px-4 py-2 lg:p-0 bg-transparent lg:bg-transparent"
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* DESKTOP Navigation Toolbar (Bottom Fixed in Column) */}
        <div className="hidden lg:block flex-shrink-0 border-t bg-background p-4">
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              ← Prev
            </Button>
            
            <div className="text-xs text-muted-foreground">
              {currentStep} / {steps.length}
            </div>

            {currentStep < 8 ? (
              <Button onClick={handleNext}>
                Next →
              </Button>
            ) : (
              <span className="text-xs text-muted-foreground">✓ Review</span>
            )}
          </div>
        </div>

        {/* MOBILE FLOATING BOTTOM BAR */}
        <div className="lg:hidden fixed bottom-4 left-4 right-4 z-30">
          <div className="flex items-center gap-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 dark:border-slate-700/50">
             <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="h-12 w-12 rounded-xl flex-shrink-0 text-slate-500 disabled:opacity-30"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            
            {/* Preview Button (Middle) */}
            <Button
              variant="secondary"
              onClick={() => setShowPreview(true)}
              className="flex-1 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>

            {/* Next / Finish Button (Right) */}
            {currentStep < 8 ? (
              <Button 
                onClick={handleNext} 
                className="h-12 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/20"
              >
                <ArrowRight className="h-6 w-6 text-white" />
              </Button>
            ) : (
              <Button 
                onClick={() => setShowPreview(true)} 
                className="h-12 px-6 rounded-xl bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20"
              >
                <Check className="h-6 w-6" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* DESKTOP RIGHT PANEL - Live Preview */}
      <div className="hidden w-1/2 flex-col border-l border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 lg:flex">
        <div className="flex-shrink-0 border-b border-purple-200 dark:border-purple-800 bg-white/50 dark:bg-slate-800/50 p-4 backdrop-blur-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold">Live Preview</h3>
            <div className="rounded-full bg-white dark:bg-slate-700 px-2.5 py-1 text-xs font-medium text-purple-600 dark:text-purple-300 shadow-sm">
              {templateId}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Hover untuk zoom controls</p>
        </div>

        <div className="flex-1 overflow-hidden bg-gray-50 dark:bg-slate-900 relative">
          <CVPreview cv={cv} showControls />
        </div>
      </div>

      {/* MOBILE PREVIEW OVERLAY */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 flex flex-col bg-slate-100 dark:bg-slate-900 lg:hidden"
          >
            {/* Mobile Preview Header */}
            <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm z-10">
              <h3 className="font-bold text-lg">Preview</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
                <X className="mr-2 h-4 w-4" />
                Close
              </Button>
            </div>

            {/* Mobile Template Selector */}
            <div className="flex-shrink-0 bg-white dark:bg-slate-800 p-3 shadow-sm z-10">
              <MobileTemplateSelector
                selectedTemplate={templateId}
                onSelect={setTemplateId}
              />
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-hidden relative">
              <CVPreview cv={cv} showControls />
              
              {/* Floating Edit Button */}
              <div className="absolute bottom-6 right-6 z-50">
                <Button 
                  onClick={() => setShowPreview(false)}
                  className="h-14 w-14 rounded-full shadow-xl bg-purple-600 hover:bg-purple-700 text-white p-0 flex items-center justify-center"
                >
                  <span className="text-xs font-bold">Edit</span>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
