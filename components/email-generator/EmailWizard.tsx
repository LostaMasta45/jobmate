"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, X, Eye } from "lucide-react";
import { StepEmailType } from "./StepEmailType";
import { StepBasicInfo } from "./StepBasicInfo";
import { StepToneStyle } from "./StepToneStyle";
import { StepContent } from "./StepContent";
import { StepPreview } from "./StepPreview";
import { EmailWizardToolbar } from "./EmailWizardToolbar";
import { LivePreview } from "./LivePreview";
import { motion, AnimatePresence } from "framer-motion";
import { generateEmailWithAI } from "@/actions/email/generate";
import { toast } from "sonner";
import { EmailFormData } from "./types";

const STEPS = [
  { id: 1, title: "Jenis Email", icon: "📧" },
  { id: 2, title: "Info Dasar", icon: "📋" },
  { id: 3, title: "Tone & Style", icon: "🎨" },
  { id: 4, title: "Konten", icon: "📝" },
  { id: 5, title: "Preview", icon: "👁️" },
];

const INITIAL_DATA: EmailFormData = {
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
};

export function EmailWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<EmailFormData>(INITIAL_DATA);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("email_wizard_data");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Merge with initial data to ensure all fields exist
        setFormData(prev => ({ ...INITIAL_DATA, ...parsed }));
      } catch (e) {
        console.error("Failed to parse saved email data", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!isLoaded) return; // Don't save before loading
    const timeoutId = setTimeout(() => {
        localStorage.setItem("email_wizard_data", JSON.stringify(formData));
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [formData, isLoaded]);

  // Handle "Generate" action when moving from Step 4 to Step 5
  const handleGenerate = async () => {
    if (currentStep === 4) {
      setIsGenerating(true);
      try {
        const result = await generateEmailWithAI({
            language: 'id', // Default to ID
            emailType: formData.emailType,
            position: formData.position,
            companyName: formData.companyName,
            hrdName: formData.hrdName,
            hrdTitle: formData.hrdTitle,
            jobSource: formData.jobSource,
            referralName: formData.referralName,
            hasAttachment: formData.hasAttachment,
            yourName: formData.yourName,
            currentRole: formData.currentRole,
            yearsExperience: formData.yearsExperience,
            toneStyle: formData.toneStyle,
            personality: formData.personality,
            lengthType: formData.lengthType,
            highlightSkills: formData.highlightSkills,
            achievements: formData.achievements,
            includeWhyCompany: formData.includeWhyCompany,
            includeWhyYou: formData.includeWhyYou,
            callToAction: formData.callToAction,
        });

        if (result.error) {
          toast.error("Gagal generate email: " + result.error);
          setIsGenerating(false);
          return; // Don't proceed
        }

        setFormData(prev => ({
          ...prev,
          subjectLine: result.subject,
          bodyContent: result.body,
        }));
        toast.success("Email berhasil dibuat!");
      } catch (error) {
        console.error(error);
        toast.error("Terjadi kesalahan saat generate email");
        setIsGenerating(false);
        return;
      } finally {
        setIsGenerating(false);
      }
    }
    
    // Proceed to next step
    setDirection(1);
    setCurrentStep(prev => prev + 1);
  };

  const updateFormData = (data: Partial<EmailFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return !!formData.emailType;
      case 2:
        return !!(formData.position && formData.companyName && formData.yourName);
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (!canProceedToNext()) {
        toast.error("Mohon lengkapi data yang diperlukan.");
        return;
    }

    if (currentStep === 4) {
        handleGenerate();
    } else if (currentStep < STEPS.length) {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepEmailType formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <StepBasicInfo formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <StepToneStyle formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <StepContent formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <StepPreview formData={formData} updateFormData={updateFormData} />;
      default:
        return null;
    }
  };

  // If not loaded yet, maybe show a spinner or just render (useEffect handles hydration mismatch essentially by being client side only logic for storage)
  // But to be safe with hydration, we usually just render. 

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-background flex-col lg:flex-row">
        
        {/* LEFT PANEL: Wizard Form */}
        <div className="flex-1 flex flex-col min-w-0 lg:border-r relative">
            
            {/* MOBILE HEADER: Segmented Progress */}
            <div className="flex-shrink-0 bg-background pt-2 lg:hidden px-4 pb-2 border-b z-10">
                <div className="flex gap-1 mb-2">
                    {STEPS.map((s) => (
                        <div 
                        key={s.id} 
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            s.id <= currentStep 
                            ? "bg-blue-600" 
                            : "bg-slate-200 dark:bg-slate-800"
                        }`}
                        />
                    ))}
                </div>
                <div className="flex justify-between items-center">
                     <h2 className="font-bold text-lg flex items-center gap-2">
                        {STEPS[currentStep-1].icon} {STEPS[currentStep-1].title}
                     </h2>
                     <span className="text-xs text-muted-foreground">{currentStep}/{STEPS.length}</span>
                </div>
            </div>

             {/* DESKTOP HEADER */}
             <div className="hidden lg:block p-6 border-b">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-blue-600" />
                    Email Generator
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Step {currentStep} of {STEPS.length}: <span className="font-medium text-foreground">{STEPS[currentStep-1].title}</span>
                </p>

                {/* Desktop Progress Bar */}
                <div className="mt-4 flex gap-2">
                    {STEPS.map((s) => (
                         <div 
                            key={s.id}
                            className={`h-1.5 flex-1 rounded-full transition-all ${
                                s.id === currentStep ? "bg-blue-600" :
                                s.id < currentStep ? "bg-blue-600/50" : "bg-slate-100 dark:bg-slate-800"
                            }`}
                         />
                    ))}
                </div>
             </div>

            {/* SCROLLABLE CONTENT */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 bg-slate-50/50 dark:bg-slate-950/50">
                 <AnimatePresence mode="wait" custom={direction} initial={false}>
                    <motion.div
                        key={currentStep}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="max-w-2xl mx-auto"
                    >
                         {renderStep()}
                    </motion.div>
                 </AnimatePresence>
            </div>

            {/* TOOLBAR (Fixed Bottom) */}
            <EmailWizardToolbar
                currentStep={currentStep}
                totalSteps={STEPS.length}
                onNext={nextStep}
                onPrevious={prevStep}
                canProceed={canProceedToNext()} // Pass true if you want to allow click and validate inside nextStep, but standard is disabling
                isGenerating={isGenerating}
            />
        </div>

        {/* RIGHT PANEL: Live Preview (Desktop Only) */}
        <div className="hidden lg:flex w-1/2 xl:w-[45%] p-6 bg-slate-50 dark:bg-slate-950 border-l flex-col justify-center">
             <LivePreview formData={formData} isGenerating={isGenerating} />
        </div>

        {/* MOBILE PREVIEW BUTTON (Floating) */}
        <div className="lg:hidden fixed bottom-20 right-4 z-20">
            {currentStep < 5 && (
                 <Button 
                    size="icon" 
                    className="h-12 w-12 rounded-full shadow-xl bg-slate-900 text-white"
                    onClick={() => setShowPreview(true)}
                >
                    <Eye className="h-5 w-5" />
                 </Button>
            )}
        </div>

        {/* MOBILE PREVIEW OVERLAY */}
        <AnimatePresence>
            {showPreview && (
                 <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed inset-0 z-50 flex flex-col bg-background lg:hidden"
                 >
                    <div className="p-4 border-b flex items-center justify-between bg-background">
                        <h3 className="font-bold">Live Preview</h3>
                        <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                    <div className="flex-1 p-4 bg-slate-50 dark:bg-slate-900 overflow-y-auto">
                        <LivePreview formData={formData} isGenerating={isGenerating} />
                    </div>
                 </motion.div>
            )}
        </AnimatePresence>

    </div>
  );
}
