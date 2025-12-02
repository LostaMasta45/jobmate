"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Save, Eye, Loader2 } from "lucide-react";
import { WizardStep } from "@/types/cv-ats";

interface WizardToolbarProps {
  currentStep: WizardStep;
  onNext: () => void;
  onPrevious: () => void;
  onSave: () => void;
  onPreview?: () => void;
  saving?: boolean;
  isEditing?: boolean;
}

export function WizardToolbar({
  currentStep,
  onNext,
  onPrevious,
  onSave,
  onPreview,
  saving = false,
  isEditing = false,
}: WizardToolbarProps) {
  const stepNames: Record<WizardStep, string> = {
    1: "Informasi Dasar",
    2: "Ringkasan",
    3: "Pengalaman",
    4: "Pendidikan",
    5: "Keterampilan",
    6: "Pilih Template",
    7: "Tinjau & Ekspor",
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
            <span className="hidden xs:inline">Sebelumnya</span>
          </Button>
          <span className="text-sm text-muted-foreground hidden sm:inline">
            {currentStep}. {stepNames[currentStep]}
          </span>
        </div>

        <div className="flex gap-2">
          {/* Mobile Preview Button */}
          {onPreview && (
            <Button
              variant="outline"
              size="sm"
              onClick={onPreview}
              className="lg:hidden"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onSave}
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-1" />
            )}
            <span className="hidden sm:inline">
              {isEditing ? "Update" : "Simpan"}
            </span>
          </Button>
          
          {currentStep < 7 ? (
            <Button size="sm" onClick={onNext}>
              <span className="hidden xs:inline">Selanjutnya</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button size="sm" onClick={onSave} disabled={saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : null}
              {isEditing ? "Update CV" : "Selesai"}
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
