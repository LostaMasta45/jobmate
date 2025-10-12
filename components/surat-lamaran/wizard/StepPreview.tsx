"use client";

import { Card } from "@/components/ui/card";
import { Eye, Sparkles } from "lucide-react";
import { generateCoverLetter } from "@/lib/coverLetterGenerator";

interface StepPreviewProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export function StepPreview({ formData, updateFormData }: StepPreviewProps) {
  // Generate cover letter content
  const generatedContent = generateCoverLetter(formData);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Eye className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Preview Surat Lamaran</h2>
          <p className="text-sm text-muted-foreground">
            Periksa surat lamaran Anda sebelum disimpan
          </p>
        </div>
      </div>

      <Card className="p-8 bg-white text-black" style={{ fontFamily: "'Times New Roman', serif" }}>
        <div 
          className="prose prose-sm max-w-none"
          style={{ 
            lineHeight: "1.6",
            fontSize: "12pt"
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: generatedContent }} />
        </div>
      </Card>

      <Card className="p-4 bg-primary/5 border-primary/20">
        <div className="flex gap-3">
          <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium">Tips:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Periksa ejaan nama perusahaan dan posisi dengan teliti</li>
              <li>• Pastikan semua data diri sudah benar</li>
              <li>• Surat ini akan tersimpan sebagai draft yang bisa diedit nanti</li>
              <li>• Anda bisa download dalam format PDF setelah menyimpan</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
