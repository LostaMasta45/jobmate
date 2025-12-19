"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { StepWhatWho } from "./StepWhatWho";
import { StepHowWhat } from "./StepHowWhat";
import { StepReview } from "./StepReview";
import { EmailWizardToolbar } from "./EmailWizardToolbar";
import { motion, AnimatePresence } from "framer-motion";
import { generateEmailWithAI } from "@/actions/email/generate";
import { toast } from "sonner";
import { EmailFormData } from "./types";

// New 3-step wizard structure
const STEPS = [
  { id: 1, title: "Info Dasar", icon: "📧" },
  { id: 2, title: "Gaya & Konten", icon: "🎨" },
  { id: 3, title: "Review", icon: "✨" },
];

const INITIAL_DATA: EmailFormData = {
  emailType: '',
  position: '',
  companyName: '',
  yourName: '',
  hasAttachment: true,
  toneStyle: 'professional',
  highlightSkills: [],
  includeWhyCompany: true,
  includeWhyYou: true,
  personalStory: '',
};

export function EmailWizard({ initialData }: { initialData?: EmailFormData | null }) {
  const [currentStep, setCurrentStep] = useState(initialData ? 3 : 1);
  const [direction, setDirection] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<EmailFormData>(INITIAL_DATA);
  const [isLoaded, setIsLoaded] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Load from localStorage or initialData on mount
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
      setIsLoaded(true);
      return;
    }

    const savedData = localStorage.getItem("email_wizard_data_v2");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(prev => ({ ...INITIAL_DATA, ...parsed }));
      } catch (e) {
        console.error("Failed to parse saved email data", e);
      }
    }
    setIsLoaded(true);
  }, [initialData]);

  // Save to localStorage on change
  useEffect(() => {
    if (!isLoaded) return;
    const timeoutId = setTimeout(() => {
      localStorage.setItem("email_wizard_data_v2", JSON.stringify(formData));
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [formData, isLoaded]);

  // Scroll to top helper
  const scrollToTop = () => {
    setTimeout(() => {
      if (topRef.current) {
        topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        const contentContainer = document.getElementById('wizard-content');
        if (contentContainer) {
          contentContainer.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    }, 100);
  };

  // Generate is now handled inside StepReview, we just navigate
  const handleGenerate = async () => {
    // In the new 3-step flow, generation happens automatically in Step 3
    // This function now just handles navigation to Step 3
    setDirection(1);
    setCurrentStep(prev => prev + 1);
    scrollToTop();
  };

  const updateFormData = (data: Partial<EmailFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  // Reset form to initial state for new email
  const resetForm = () => {
    setFormData(INITIAL_DATA);
    setCurrentStep(1);
    localStorage.removeItem("email_wizard_data_v2");
    toast.success("Form direset. Siap buat email baru!");
  };

  // Navigate to history page when done
  const handleComplete = () => {
    localStorage.removeItem("email_wizard_data_v2");
    router.push("/tools/email-generator/history");
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        // Step 1: Need email type, position, company, and name
        return !!(formData.emailType && formData.position && formData.companyName && formData.yourName);
      case 2:
        // Step 2: Tone is always set by default, so always true
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

    if (currentStep < STEPS.length) {
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
        return <StepWhatWho formData={formData} updateFormData={updateFormData} onNext={nextStep} />;
      case 2:
        return <StepHowWhat formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <StepReview formData={formData} updateFormData={updateFormData} />;
      default:
        return null;
    }
  };

  // If not loaded yet, maybe show a spinner or just render (useEffect handles hydration mismatch essentially by being client side only logic for storage)
  // But to be safe with hydration, we usually just render. 

  return (
    <div className="flex flex-col h-[calc(100dvh-70px)] sm:h-[calc(100dvh-120px)] md:h-[750px] md:max-h-[calc(100dvh-100px)] bg-background border-0 md:border rounded-none md:rounded-xl shadow-none md:shadow-sm max-w-6xl mx-auto my-0 lg:my-4 overflow-hidden relative">

      {/* HEADER SECTION - Fixed at top */}
      <div className="flex-none bg-white dark:bg-slate-950 border-b z-20 relative">
        <div ref={topRef} className="absolute top-0 h-1 w-1 opacity-0 pointer-events-none" />

        {/* MOBILE HEADER: Compact Progress */}
        <div className="block lg:hidden pt-3 px-4 sm:px-6 pb-3">
          <div className="flex gap-1.5 mb-2.5">
            {STEPS.map((s) => (
              <div
                key={s.id}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${s.id <= currentStep
                  ? "bg-[#5547d0]"
                  : "bg-slate-100 dark:bg-slate-800"
                  }`}
              />
            ))}
          </div>
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-lg flex items-center gap-2 text-slate-900 dark:text-white">
              <span className="text-base">{STEPS[currentStep - 1].icon}</span> {STEPS[currentStep - 1].title}
            </h2>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
              {currentStep}/{STEPS.length}
            </span>
          </div>
        </div>

        {/* DESKTOP HEADER */}
        <div className="hidden lg:block p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-800 dark:text-slate-100">
                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#5547d0]/10 text-[#5547d0] text-lg">
                  {STEPS[currentStep - 1].icon}
                </span>
                {STEPS[currentStep - 1].title}
              </h2>
              <p className="text-muted-foreground text-sm ml-[52px] mt-1">
                Lengkapi data untuk hasil terbaik
              </p>
            </div>
            {isGenerating && (
              <div className="flex items-center gap-2 text-sm text-[#5547d0] bg-[#5547d0]/5 px-3 py-1.5 rounded-full animate-pulse border border-[#5547d0]/20">
                <Sparkles className="h-4 w-4" />
                <span>AI sedang menulis...</span>
              </div>
            )}
          </div>

          {/* Desktop Progress Bar */}
          <div className="flex gap-3">
            {STEPS.map((s) => (
              <div
                key={s.id}
                className={`h-2.5 flex-1 rounded-full transition-all duration-500 relative overflow-hidden ${s.id === currentStep ? "bg-[#5547d0]" :
                  s.id < currentStep ? "bg-[#5547d0]/40" : "bg-slate-200 dark:bg-slate-800"
                  }`}
              >
                {s.id === currentStep && (
                  <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT AREA - Scrollable */}
      <div id="wizard-content" className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50/30 dark:bg-slate-950/30 scroll-smooth">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full max-w-5xl mx-auto min-h-[400px]"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Spacer to ensure content isn't hidden behind potential overlays, though flex layout handles it */}
        <div className="h-6"></div>
      </div>

      {/* TOOLBAR - Fixed at bottom of container */}
      <div className="flex-none border-t bg-white/90 dark:bg-slate-950/90 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20">
        <EmailWizardToolbar
          currentStep={currentStep}
          totalSteps={STEPS.length}
          onNext={nextStep}
          onPrevious={prevStep}
          canProceed={canProceedToNext()}
          isGenerating={isGenerating}
          nextStepLabel={currentStep < STEPS.length ? STEPS[currentStep].title : undefined}
          onReset={resetForm}
          onComplete={handleComplete}
        />
      </div>
    </div>
  );
}
