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
import { X, Save, Eye, Edit3, Loader2, ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { saveResumeToDatabase } from "@/actions/cv-ats";

import { ATSTemplateId, ATS_TEMPLATES } from "@/lib/ats-templates";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutTemplate } from "lucide-react";

import { StepTemplate } from "./steps/StepTemplate";
import { motion, AnimatePresence } from "framer-motion";

interface CVWizardProps {
  initialResume?: Resume | null;
  onClose?: () => void;
}

export function CVWizard({ initialResume, onClose }: CVWizardProps) {
  const [currentStep, setCurrentStep] = React.useState<WizardStep>(1);
  const [showMobilePreview, setShowMobilePreview] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [direction, setDirection] = React.useState(0);
  
  // Track if this is editing an existing resume
  const isEditing = !!initialResume?.id;
  
  // Migrate old resumes without title field
  const migratedResume = React.useMemo(() => {
    if (!initialResume) return emptyResume;
    
    return {
      ...initialResume,
      title: initialResume.title || `CV ${initialResume.basics?.firstName || "Saya"}`,
      templateId: initialResume.templateId || "classic", // Ensure templateId exists
    };
  }, [initialResume]);
  
  const [resume, setResume] = React.useState<Resume>(migratedResume);
  const [templateId, setTemplateId] = React.useState<ATSTemplateId>((resume.templateId as ATSTemplateId) || "classic");

  // Sync templateId change to resume object
  React.useEffect(() => {
    setResume(prev => ({ ...prev, templateId }));
  }, [templateId]);

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
        handleSaveToDatabase();
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
    if (currentStep < 7) {
      setDirection(1);
      setCurrentStep((prev) => (prev + 1) as WizardStep);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep((prev) => (prev - 1) as WizardStep);
    }
  };

  const handleStepClick = (step: WizardStep) => {
    setDirection(step > currentStep ? 1 : -1);
    setCurrentStep(step);
  };

  // Save to database (for the header button)
  const handleSaveToDatabase = async () => {
    if (saving) return;
    
    // Validate basic info before saving
    if (!resume.basics?.firstName || !resume.title) {
      alert("Mohon lengkapi data dasar (Nama & Judul CV) sebelum menyimpan.");
      return;
    }

    setSaving(true);
    setAutosaveStatus({ ...autosaveStatus, saving: true });
    
    try {
      await saveResumeToDatabase(resume);
      
      // Clear draft on successful save
      try {
        localStorage.removeItem("cv-ats-draft");
      } catch (e) {
        console.error("Clear draft error:", e);
      }
      
      setAutosaveStatus({
        saved: true,
        timestamp: new Date().toLocaleTimeString("id-ID"),
        saving: false,
      });
      
      alert(isEditing ? "CV berhasil diupdate!" : "CV berhasil disimpan!");
      
      // Close wizard and return to history
      if (onClose) {
        onClose();
      }
    } catch (error: any) {
      console.error("Save error:", error);
      alert("Gagal simpan: " + (error?.message || "Terjadi kesalahan"));
      setAutosaveStatus({ ...autosaveStatus, saving: false });
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (confirm("Tutup wizard? Perubahan tersimpan otomatis ke draft lokal.")) {
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
        return <StepTemplate resume={resume} templateId={templateId} setTemplateId={setTemplateId} />;
      case 7:
        return <StepReview resume={resume} setResume={setResume} onSaveSuccess={handleSaveSuccess} />;
      default:
        return null;
    }
  };

  const steps = [
    { num: 1, label: "Informasi Dasar" },
    { num: 2, label: "Ringkasan" },
    { num: 3, label: "Pengalaman" },
    { num: 4, label: "Pendidikan" },
    { num: 5, label: "Keterampilan" },
    { num: 6, label: "Pilih Template" },
    { num: 7, label: "Tinjau & Ekspor" },
  ] as const;

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
                  ? "bg-blue-600"
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
      <div className={`flex w-full flex-col overflow-hidden lg:w-1/2 lg:border-r relative ${showMobilePreview ? 'hidden lg:flex' : 'flex'}`}>
        
        {/* Desktop Header (Hidden on Mobile) */}
        <div className="hidden border-b p-4 sm:p-6 lg:block relative">
           {/* Back to Dashboard Link (Top Left Absolute) */}
           <Button 
            variant="link" 
            size="sm" 
            onClick={handleClose}
            className="absolute top-0 left-4 sm:left-6 px-0 text-xs text-muted-foreground hover:text-primary h-auto py-2"
          >
            ← Back to Dashboard
          </Button>

          <div className="flex items-center justify-between mt-4">
            <div>
              <h1 className="text-xl font-bold sm:text-2xl">
                {isEditing ? "Edit CV" : "CV ATS Generator"}
              </h1>
              <p className="text-xs text-muted-foreground sm:text-sm">
                {autosaveStatus.saved && autosaveStatus.timestamp && (
                  <span>Draft tersimpan • {autosaveStatus.timestamp}</span>
                )}
                {autosaveStatus.saving && <span>Menyimpan draft...</span>}
              </p>
            </div>
            <div className="flex gap-2">
               <Button
                variant="default"
                size="sm"
                onClick={handleSaveToDatabase}
                disabled={saving}
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span className="ml-2 hidden sm:inline">
                  {isEditing ? "Update" : "Simpan"}
                </span>
              </Button>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mt-4 flex gap-1">
            {steps.map((s) => (
              <button
                key={s.num}
                onClick={() => handleStepClick(s.num as WizardStep)}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  s.num === currentStep
                    ? "bg-blue-600"
                    : s.num < currentStep
                    ? "bg-blue-600/50"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50 dark:bg-slate-950 lg:bg-white lg:dark:bg-slate-950">
           <div className="min-h-full p-4 pb-32 sm:p-6 lg:pb-6">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full"
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
           </div>
        </div>

        {/* Desktop Toolbar */}
        <div className="hidden lg:block">
          <WizardToolbar
            currentStep={currentStep}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSave={handleSaveToDatabase}
            onPreview={() => setShowMobilePreview(true)}
            saving={saving}
            isEditing={isEditing}
          />
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
              onClick={() => setShowMobilePreview(true)}
              className="flex-1 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>

            {/* Next / Finish Button (Right) */}
            {currentStep < 7 ? (
              <Button 
                onClick={handleNext} 
                className="h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
              >
                <ArrowRight className="h-6 w-6 text-white" />
              </Button>
            ) : (
              <Button 
                onClick={handleSaveToDatabase}
                disabled={saving}
                className="h-12 px-6 rounded-xl bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20"
              >
                {saving ? <Loader2 className="h-6 w-6 animate-spin" /> : <Check className="h-6 w-6" />}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel - Preview (hidden on mobile) */}
      <div className="hidden w-1/2 overflow-y-auto bg-background lg:block border-l">
        <div className="p-6 h-full flex flex-col">
          <div className="mb-4 flex items-center justify-between shrink-0">
            <h2 className="text-lg font-semibold">Preview CV (A4)</h2>
            <Button
              variant="default"
              size="sm"
              onClick={handleSaveToDatabase}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {isEditing ? "Update CV" : "Simpan CV"}
            </Button>
          </div>
          <div className="flex-1 relative">
             <CVPreview resume={resume} templateId={templateId} onTemplateChange={setTemplateId} />
          </div>
        </div>
      </div>

      {/* MOBILE PREVIEW OVERLAY */}
      <AnimatePresence>
        {showMobilePreview && (
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
              <Button variant="ghost" size="sm" onClick={() => setShowMobilePreview(false)}>
                <X className="mr-2 h-4 w-4" />
                Close
              </Button>
            </div>
            
            {/* Preview Content */}
            <div className="flex-1 overflow-hidden relative bg-gray-100/90">
              <CVPreview resume={resume} templateId={templateId} onTemplateChange={setTemplateId} />
              
              {/* Floating Edit Button */}
              <div className="absolute bottom-6 right-6 z-50">
                <Button 
                  onClick={() => setShowMobilePreview(false)}
                  className="h-14 w-14 rounded-full shadow-xl bg-blue-600 hover:bg-blue-700 text-white p-0 flex items-center justify-center"
                >
                   <Edit3 className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
