"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Wand2, Loader2, Check } from "lucide-react";
import { motion } from "framer-motion";

interface EmailWizardToolbarProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  canProceed: boolean;
  isGenerating?: boolean;
}

export function EmailWizardToolbar({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  canProceed,
  isGenerating = false,
}: EmailWizardToolbarProps) {
  return (
    <div className="border-t bg-white/90 dark:bg-slate-950/90 backdrop-blur-md p-4 md:p-6 lg:px-10 shadow-[0_-5px_20px_-10px_rgba(0,0,0,0.1)] relative z-50 safe-area-bottom shrink-0 border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between w-full gap-3 md:gap-4 max-w-2xl mx-auto lg:max-w-none">
        <Button
          variant="ghost"
          onClick={onPrevious}
          disabled={currentStep === 1 || isGenerating}
          className="gap-1 md:gap-2 pl-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors text-sm h-10 md:h-11 rounded-full md:rounded-md px-4"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="font-medium">Kembali</span>
        </Button>

        {/* Progress Dots Mobile - Hidden on very small screens if needed, or adjusted */}
        <div className="flex gap-1.5 sm:hidden">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                i + 1 === currentStep ? "bg-[#5547d0]" : "bg-slate-200 dark:bg-slate-800"
              }`} 
            />
          ))}
        </div>

        <Button
          onClick={onNext}
          disabled={!canProceed || isGenerating}
          className={`gap-2 min-w-[120px] md:min-w-[130px] shadow-lg transition-all duration-300 h-11 text-sm md:text-base rounded-full md:rounded-md ${
            isGenerating 
             ? "bg-slate-100 text-slate-500"
             : currentStep === totalSteps
               ? "bg-[#28c840] hover:bg-[#22aa36] text-white shadow-[#28c840]/20"
               : "bg-gradient-to-r from-[#5547d0] to-[#00acc7] hover:shadow-[#5547d0]/25 text-white"
          }`}
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Menulis...</span>
            </>
          ) : currentStep === totalSteps - 1 ? ( // Step before preview is "Generate"
            <>
              <Wand2 className="h-4 w-4" />
              <span>Generate AI</span>
            </>
          ) : currentStep === totalSteps ? (
            <>
              <Check className="h-4 w-4" />
              <span>Selesai</span>
            </>
          ) : (
            <>
              <span>Lanjut</span>
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
