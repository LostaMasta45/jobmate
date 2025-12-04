"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { StepEmailType } from "./StepEmailType";
import { StepBasicInfo } from "./StepBasicInfo";
import { StepToneStyle } from "./StepToneStyle";
import { StepContent } from "./StepContent";
import { StepPreview } from "./StepPreview";
import { EmailWizardToolbar } from "./EmailWizardToolbar";
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
    emailType: '',
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
    // Phase 1 additions
    personalStory: '',
    openingStyle: undefined,
    // Phase 3 additions
    toneSettings: { formality: 5, confidence: 5, enthusiasm: 5 },
};

export function EmailWizard({ initialData }: { initialData?: EmailFormData | null }) {
  const [currentStep, setCurrentStep] = useState(initialData ? 5 : 1);
  const [direction, setDirection] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<EmailFormData>(INITIAL_DATA);
  const [isLoaded, setIsLoaded] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  // Load from localStorage or initialData on mount
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
      setIsLoaded(true);
      return;
    }

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
  }, [initialData]);

  // Save to localStorage on change
  useEffect(() => {
    if (!isLoaded) return; // Don't save before loading
    const timeoutId = setTimeout(() => {
        localStorage.setItem("email_wizard_data", JSON.stringify(formData));
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [formData, isLoaded]);

  // Scroll to top helper
  const scrollToTop = () => {
    // Small timeout ensures DOM update happens first
    setTimeout(() => {
        if (topRef.current) {
            topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            // Fallback if ref is not attached yet or something else
             const contentContainer = document.getElementById('wizard-content');
             if (contentContainer) {
                contentContainer.scrollTo({ top: 0, behavior: 'smooth' });
             } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
             }
        }
    }, 100);
  };

  // Handle "Generate" action when moving from Step 4 to Step 5
  const handleGenerate = async () => {
    if (currentStep === 4) {
      setIsGenerating(true);
      try {
        const result = await generateEmailWithAI({
            language: 'id', // Default to ID
            emailType: formData.emailType as "application" | "follow_up" | "thank_you" | "inquiry",
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
            // Phase 1 additions
            personalStory: formData.personalStory,
            openingStyle: formData.openingStyle,
            // Phase 3 additions
            toneSettings: formData.toneSettings,
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
    scrollToTop();
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
      scrollToTop();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
      scrollToTop();
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
        return <StepEmailType formData={formData} updateFormData={updateFormData} onNext={nextStep} />;
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
    <div className="flex flex-col min-h-[500px] bg-background border-0 md:border rounded-none md:rounded-xl shadow-none md:shadow-sm max-w-6xl mx-auto my-0 lg:my-4 relative">
        
        {/* MAIN PANEL: Wizard Form */}
        <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-950">
            <div ref={topRef} className="absolute top-0 h-1 w-1 opacity-0 pointer-events-none" />

            {/* MOBILE HEADER: Segmented Progress */}
            <div className="flex-shrink-0 bg-background pt-4 lg:hidden px-6 pb-2 border-b z-10">
                <div className="flex gap-1 mb-3">
                    {STEPS.map((s) => (
                        <div 
                        key={s.id} 
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                            s.id <= currentStep 
                            ? "bg-[#5547d0]" 
                            : "bg-slate-100 dark:bg-slate-800"
                        }`}
                        />
                    ))}
                </div>
                <div className="flex justify-between items-center">
                     <h2 className="font-bold text-xl flex items-center gap-2 text-slate-900 dark:text-white">
                        {STEPS[currentStep-1].icon} {STEPS[currentStep-1].title}
                     </h2>
                     <span className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                        {currentStep}/{STEPS.length}
                     </span>
                </div>
            </div>

             {/* DESKTOP HEADER */}
             <div className="hidden lg:block p-6 border-b bg-slate-50/50 dark:bg-slate-900/20">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#5547d0]/10 text-[#5547d0]">
                                {STEPS[currentStep-1].icon}
                            </span>
                            {STEPS[currentStep-1].title}
                        </h2>
                        <p className="text-muted-foreground text-sm ml-10">
                            Step {currentStep} of {STEPS.length}
                        </p>
                    </div>
                    {isGenerating && (
                         <div className="flex items-center gap-2 text-sm text-[#5547d0] animate-pulse">
                            <Sparkles className="h-4 w-4" />
                            <span>AI Writing...</span>
                         </div>
                    )}
                </div>

                {/* Desktop Progress Bar */}
                <div className="flex gap-2">
                    {STEPS.map((s) => (
                         <div 
                            key={s.id}
                            className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                                s.id === currentStep ? "bg-[#5547d0]" :
                                s.id < currentStep ? "bg-[#5547d0]/40" : "bg-slate-200 dark:bg-slate-800"
                            }`}
                         />
                    ))}
                </div>
             </div>

            {/* SCROLLABLE CONTENT */}
            <div id="wizard-content" className="p-4 sm:p-6 lg:p-8 bg-slate-50/50 dark:bg-slate-950/50 pb-32 md:pb-40">
                 <AnimatePresence mode="wait" custom={direction} initial={false}>
                    <motion.div
                        key={currentStep}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="w-full max-w-5xl mx-auto"
                    >
                         {renderStep()}
                    </motion.div>
                 </AnimatePresence>
            </div>

            {/* TOOLBAR (Sticky Bottom) */}
            <div className="sticky bottom-0 border-t bg-white/95 dark:bg-slate-950/95 backdrop-blur flex-shrink-0 w-full shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50">
                <EmailWizardToolbar
                    currentStep={currentStep}
                    totalSteps={STEPS.length}
                    onNext={nextStep}
                    onPrevious={prevStep}
                    canProceed={canProceedToNext()} 
                    isGenerating={isGenerating}
                    nextStepLabel={currentStep < STEPS.length ? STEPS[currentStep].title : undefined}
                />
            </div>
        </div>
    
    </div>
  );
    }
