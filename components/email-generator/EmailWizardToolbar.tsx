"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Wand2, Loader2, Check, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface EmailWizardToolbarProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  canProceed: boolean;
  isGenerating?: boolean;
  nextStepLabel?: string;
}

export function EmailWizardToolbar({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  canProceed,
  isGenerating = false,
  nextStepLabel,
}: EmailWizardToolbarProps) {
  
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full px-4 py-4 md:px-8 md:py-5 relative group">
      {/* Progress Bar Line at Top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-900">
        <motion.div 
            className="h-full bg-[#5547d0]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      <div className="flex items-center justify-between w-full max-w-5xl mx-auto">
        
        {/* Left Side: Back Button & Progress Text */}
        <div className="flex items-center gap-4">
            <Button
                variant="ghost"
                onClick={onPrevious}
                disabled={currentStep === 1 || isGenerating}
                className="gap-2 pl-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-all text-sm h-10 px-4 rounded-full"
            >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">Kembali</span>
            </Button>
            
            <div className="hidden md:flex flex-col">
                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Langkah {currentStep} dari {totalSteps}</span>
            </div>
        </div>

        {/* Right Side: Action Button */}
        <div className="flex items-center gap-4">
            {/* Next Step Hint (Desktop) */}
            {nextStepLabel && currentStep < totalSteps && !isGenerating && (
                <div className="hidden md:flex flex-col items-end mr-2 animate-in fade-in slide-in-from-right-4 duration-500">
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Selanjutnya</span>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{nextStepLabel}</span>
                </div>
            )}

            {currentStep !== totalSteps && (
                <Button
                    onClick={onNext}
                    disabled={!canProceed || isGenerating}
                    size="lg"
                    className={`
                        relative overflow-hidden group/btn gap-2 shadow-lg transition-all duration-300 h-11 md:h-12 rounded-full px-6 md:px-8
                        ${isGenerating 
                            ? "bg-slate-100 text-slate-500 shadow-none cursor-wait"
                            : !canProceed
                                ? "bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed shadow-none" 
                                : currentStep === totalSteps - 1
                                    ? "bg-gradient-to-r from-[#5547d0] to-[#7c6bf2] hover:shadow-[#5547d0]/25 hover:shadow-xl hover:scale-[1.02] text-white border-0"
                                    : "bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 hover:shadow-lg hover:scale-[1.02] text-white"
                        }
                    `}
                >
                    <div className="relative z-10 flex items-center gap-2">
                        {isGenerating ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Menulis Email...</span>
                            </>
                        ) : currentStep === totalSteps - 1 ? (
                            <>
                                <Wand2 className="h-4 w-4" />
                                <span className="font-semibold">Generate with AI</span>
                            </>
                        ) : (
                            <>
                                <span className="font-semibold">Lanjut</span>
                                <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                            </>
                        )}
                    </div>
                </Button>
            )}
        </div>
      </div>
    </div>
  );
}
