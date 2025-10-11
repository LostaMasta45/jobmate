"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { WizardStep } from "@/types/cv-ats";

interface WizardToolbarProps {
  currentStep: WizardStep;
  onNext: () => void;
  onPrevious: () => void;
  onSave: () => void;
}

export function WizardToolbar({
  currentStep,
  onNext,
  onPrevious,
  onSave,
}: WizardToolbarProps) {
  const stepNames: Record<WizardStep, string> = {
    1: "Informasi Dasar",
    2: "Ringkasan",
    3: "Pengalaman",
    4: "Pendidikan",
    5: "Keterampilan",
    6: "Tinjau & Ekspor",
  };

  return (
    <div className="border-t bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrevious}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Sebelumnya
          </Button>
          <span className="text-sm text-muted-foreground hidden sm:inline">
            {currentStep}. {stepNames[currentStep]}
          </span>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onSave}>
            <Save className="h-4 w-4 mr-1" />
            Simpan
          </Button>
          {currentStep < 6 ? (
            <Button size="sm" onClick={onNext}>
              Selanjutnya
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button size="sm" onClick={onSave}>
              Selesai
            </Button>
          )}
        </div>
      </div>
      <div className="mt-2 text-xs text-muted-foreground text-center sm:hidden">
        {currentStep}. {stepNames[currentStep]}
      </div>
    </div>
  );
}
