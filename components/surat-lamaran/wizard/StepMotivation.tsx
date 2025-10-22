"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Heart, Sparkles, Loader2, Info, RefreshCw, Edit, CheckCircle } from "lucide-react";
import { generateMotivation } from "@/actions/surat-lamaran/generate-motivation";
import { useToast } from "@/hooks/use-toast";

interface StepMotivationProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export function StepMotivation({ formData, updateFormData }: StepMotivationProps) {
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const canGenerate =
    formData.motivationPosition &&
    formData.motivationCompany &&
    formData.motivationValue;

  const handleGenerate = async () => {
    if (!canGenerate) {
      toast({
        title: "Form belum lengkap",
        description: "Mohon isi minimal 3 pertanyaan untuk hasil terbaik.",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);

    try {
      const result = await generateMotivation({
        position: formData.position,
        companyName: formData.companyName,
        motivationPosition: formData.motivationPosition,
        motivationCompany: formData.motivationCompany,
        motivationValue: formData.motivationValue,
        motivationFit: formData.motivationFit,
        templateType: formData.experienceType || "fresh_graduate",
      });

      if (result.error) {
        toast({
          title: "Gagal generate",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      if (result.data) {
        updateFormData({
          generatedMotivation: result.data,
          finalMotivation: result.data,
        });

        toast({
          title: "✨ Berhasil!",
          description: "Paragraf motivasi telah di-generate dengan AI.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat generate motivasi.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleRegenerate = () => {
    updateFormData({
      generatedMotivation: null,
      finalMotivation: null,
    });
  };

  const handleUseGenerated = () => {
    updateFormData({ finalMotivation: formData.generatedMotivation });
    setEditMode(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Heart className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Motivasi & Alasan Melamar</h2>
          <p className="text-sm text-muted-foreground">
            Bagian ini yang membedakan Anda dari kandidat lain
          </p>
        </div>
      </div>

      {/* Info Alert */}
      <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertTitle className="text-blue-900 dark:text-blue-100">
          💡 Tips: Jawab dengan Jujur dan Spesifik
        </AlertTitle>
        <AlertDescription className="text-blue-800 dark:text-blue-200">
          Semakin detail dan personal jawaban Anda, semakin kuat hasil yang
          dihasilkan AI. AI akan transform jawaban Anda menjadi paragraf yang
          meyakinkan.
        </AlertDescription>
      </Alert>

      {/* Simple & Quick Form - EASIER TO FILL */}
      <div className="space-y-4">
        {/* Question 1 - Simplified */}
        <div className="space-y-2">
          <Label htmlFor="motivationPosition" className="text-base font-semibold">
            1. Kenapa Anda tertarik dengan posisi {formData.position || "ini"}?{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="motivationPosition"
            placeholder="Contoh singkat: Saya tertarik karena posisi ini sesuai dengan skill React saya dan ingin berkembang di industri teknologi..."
            rows={2}
            value={formData.motivationPosition || ""}
            onChange={(e) =>
              updateFormData({ motivationPosition: e.target.value })
            }
            className="resize-none"
          />
        </div>

        {/* Question 2 - Simplified */}
        <div className="space-y-2">
          <Label htmlFor="motivationCompany" className="text-base font-semibold">
            2. Apa yang Anda tahu tentang {formData.companyName || "perusahaan ini"}?{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="motivationCompany"
            placeholder="Contoh singkat: {formData.companyName} adalah perusahaan terkemuka di bidang teknologi dengan reputasi yang baik..."
            rows={2}
            value={formData.motivationCompany || ""}
            onChange={(e) =>
              updateFormData({ motivationCompany: e.target.value })
            }
            className="resize-none"
          />
        </div>

        {/* Question 3 - Simplified */}
        <div className="space-y-2">
          <Label htmlFor="motivationValue" className="text-base font-semibold">
            3. Apa yang bisa Anda kontribusikan?{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="motivationValue"
            placeholder="Contoh singkat: Saya bisa berkontribusi dengan skill programming dan pengalaman saya dalam menyelesaikan project..."
            rows={2}
            value={formData.motivationValue || ""}
            onChange={(e) =>
              updateFormData({ motivationValue: e.target.value })
            }
            className="resize-none"
          />
        </div>
        
        <Alert className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
          <Info className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            ✨ <strong>Cukup 3 jawaban singkat!</strong> AI akan mengembangkan jawaban Anda menjadi paragraf motivasi yang meyakinkan dan profesional. Tidak perlu detail panjang.
          </AlertDescription>
        </Alert>
      </div>

      {/* Generate Button */}
      {!formData.generatedMotivation && (
        <Button
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
          size="lg"
          onClick={handleGenerate}
          disabled={!canGenerate || generating}
        >
          {generating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              AI sedang membuat paragraf motivasi...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Generate Paragraf Motivasi dengan AI
            </>
          )}
        </Button>
      )}

      {/* AI Result */}
      {formData.generatedMotivation && !editMode && (
        <Card className="p-6 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 border-purple-200 dark:from-purple-950 dark:via-blue-950 dark:to-pink-950 dark:border-purple-800">
          <div className="flex items-start gap-3">
            <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400 mt-1 flex-shrink-0" />
            <div className="flex-1 space-y-4">
              <div>
                <h4 className="font-semibold text-lg mb-3 text-purple-900 dark:text-purple-100 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  ✨ Paragraf Motivasi Anda:
                </h4>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-line leading-relaxed text-gray-800 dark:text-gray-200 text-justify">
                    {formData.generatedMotivation}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleUseGenerated}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Gunakan Ini
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRegenerate}
                  disabled={generating}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Generate Lagi
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditMode(true)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Manual
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Manual Edit Mode */}
      {editMode && (
        <div className="space-y-3">
          <Label htmlFor="finalMotivation" className="text-base font-semibold">
            Edit Paragraf Motivasi
          </Label>
          <Textarea
            id="finalMotivation"
            rows={8}
            value={formData.finalMotivation || formData.generatedMotivation}
            onChange={(e) => updateFormData({ finalMotivation: e.target.value })}
            className="font-serif"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={() => setEditMode(false)}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Simpan Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                updateFormData({
                  finalMotivation: formData.generatedMotivation,
                });
                setEditMode(false);
              }}
            >
              Batal
            </Button>
          </div>
        </div>
      )}

      {/* Progress Indicator */}
      {formData.finalMotivation && !editMode && (
        <Alert className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            Paragraf motivasi sudah siap! Anda bisa lanjut ke langkah
            berikutnya.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
