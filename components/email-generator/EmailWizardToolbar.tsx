"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Wand2, Loader2, Sparkles, RefreshCw, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface EmailWizardToolbarProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  canProceed: boolean;
  isGenerating?: boolean;
  nextStepLabel?: string;
  onReset?: () => void;
  onComplete?: () => void; // Navigate to history when done
}

export function EmailWizardToolbar({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  canProceed,
  isGenerating = false,
  nextStepLabel,
  onReset,
  onComplete,
}: EmailWizardToolbarProps) {

  const progress = (currentStep / totalSteps) * 100;

  // In 3-step wizard, step 2 is the last before Review
  const isLastBeforeReview = currentStep === totalSteps - 1;
  const isOnReviewStep = currentStep === totalSteps;

  return (
    <div className="w-full px-3 py-2.5 sm:px-4 sm:py-3 md:px-8 md:py-4 relative">
      {/* Progress Bar Line at Top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-900">
        <motion.div
          className="h-full bg-[#5547d0]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      <div className="flex items-center justify-between w-full max-w-5xl mx-auto gap-2">

        {/* Left Side: Back Button + Step Counter (Mobile) */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Button
            variant="ghost"
            onClick={onPrevious}
            disabled={currentStep === 1 || isGenerating}
            className="gap-1 sm:gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 h-8 sm:h-9 px-2 sm:px-3 rounded-full text-xs sm:text-sm flex-shrink-0"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden xs:inline sm:inline font-medium">Kembali</span>
          </Button>

          {/* Step counter - visible on all screens */}
          <span className="text-[10px] sm:text-xs text-slate-400 font-medium whitespace-nowrap">
            {currentStep}/{totalSteps}
          </span>
        </div>

        {/* Right Side: Action Button */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Next Step Hint (Large Desktop only, not on review step) */}
          {nextStepLabel && !isOnReviewStep && !isGenerating && (
            <div className="hidden lg:flex flex-col items-end mr-1">
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Next</span>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{nextStepLabel}</span>
            </div>
          )}

          {/* Hide button on Review step - actions are in the step itself */}
          {!isOnReviewStep && (
            <Button
              onClick={onNext}
              disabled={!canProceed || isGenerating}
              size="default"
              className={`
                relative overflow-hidden group/btn gap-1.5 sm:gap-2 transition-all duration-300 h-9 sm:h-10 md:h-11 rounded-full px-4 sm:px-5 md:px-6 font-semibold text-sm sm:text-base
                ${isGenerating
                  ? "bg-slate-100 text-slate-500 shadow-none cursor-wait"
                  : !canProceed
                    ? "bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed shadow-none"
                    : isLastBeforeReview
                      ? "bg-gradient-to-r from-[#5547d0] to-[#7c6bf2] hover:shadow-lg hover:shadow-[#5547d0]/20 hover:scale-[1.02] text-white shadow-md"
                      : "bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 hover:shadow-md text-white"
                }
              `}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="hidden sm:inline">Processing...</span>
                </>
              ) : isLastBeforeReview ? (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span className="hidden xs:inline">Generate</span>
                  <span className="xs:hidden">Go</span>
                </>
              ) : (
                <>
                  <span>Lanjut</span>
                  <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform" />
                </>
              )}
            </Button>
          )}

          {/* Show "New Email" and "Selesai" buttons on Review step */}
          {isOnReviewStep && (
            <div className="flex items-center gap-2">
              {onReset && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onReset}
                  className="gap-1.5 h-9 rounded-full px-3 sm:px-4 text-sm font-medium"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Email Baru</span>
                  <span className="sm:hidden">Baru</span>
                </Button>
              )}
              {onComplete && (
                <Button
                  size="sm"
                  onClick={onComplete}
                  className="gap-1.5 h-9 rounded-full px-4 sm:px-5 text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md hover:shadow-lg"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Selesai</span>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
