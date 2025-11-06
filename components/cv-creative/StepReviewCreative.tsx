"use client";

import * as React from "react";
import { Resume } from "@/lib/schemas/cv-ats";
import { CreativeCV, ColorScheme, PhotoOptions, TemplateId } from "@/lib/schemas/cv-creative";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  FileDown,
  Image,
  Save,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles,
  Palette,
} from "lucide-react";
import { analyzeATSScore } from "@/actions/cv-ats";
import { saveCreativeCV } from "@/actions/cv-creative";
import { ATSAnalysis } from "@/types/cv-ats";
import { exportToPDF, exportToPNG, exportToJPG, exportToWord } from "@/lib/export-utils";

interface StepReviewCreativeProps {
  cv: Partial<CreativeCV>;
  resume: Resume;
  setResume: (resume: Resume) => void;
  templateId: TemplateId;
  colorScheme: ColorScheme;
  photoUrl: string | null;
  photoOptions: PhotoOptions;
  onSaveSuccess?: () => void;
}

export function StepReviewCreative({
  cv,
  resume,
  setResume,
  templateId,
  colorScheme,
  photoUrl,
  photoOptions,
  onSaveSuccess,
}: StepReviewCreativeProps) {
  const [atsAnalysis, setAtsAnalysis] = React.useState<ATSAnalysis | null>(null);
  const [analyzingATS, setAnalyzingATS] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [exporting, setExporting] = React.useState<string | null>(null);
  const [jobDescription, setJobDescription] = React.useState("");

  const handleAnalyzeATS = async () => {
    setAnalyzingATS(true);
    try {
      const analysis = await analyzeATSScore(resume, jobDescription || undefined);
      setAtsAnalysis(analysis);
      setResume({ ...resume, ats_score: analysis.score });
    } catch (error) {
      alert("Gagal analisa ATS: " + (error as Error).message);
    } finally {
      setAnalyzingATS(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const cvToSave = {
        id: cv.id || crypto.randomUUID(),
        userId: cv.userId || "",
        title: resume.title || "Creative CV",
        templateId,
        colorScheme,
        photoUrl,
        photoOptions,
        content: resume,
        atsScore: resume.ats_score || null,
        isDefault: cv.isDefault || false,
      };
      
      await saveCreativeCV(cvToSave);
      alert("✅ CV berhasil disimpan! Kembali ke history...");
      
      setTimeout(() => {
        if (onSaveSuccess) {
          onSaveSuccess();
        }
      }, 1000);
    } catch (error: any) {
      console.error("Save error:", error);
      alert("❌ Gagal simpan: " + (error?.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async (format: "pdf" | "png" | "jpg" | "word") => {
    setExporting(format);
    try {
      const element = document.getElementById("cv-preview-content");
      if (!element) throw new Error("Preview not found");

      switch (format) {
        case "pdf":
          await exportToPDF(element, `${cv.title || "CV"}.pdf`);
          alert("✅ PDF berhasil diunduh");
          break;
        case "png":
          await exportToPNG(element, `${cv.title || "CV"}.png`);
          alert("✅ PNG berhasil diunduh");
          break;
        case "jpg":
          await exportToJPG(element, `${cv.title || "CV"}.jpg`);
          alert("✅ JPG berhasil diunduh");
          break;
        case "word":
          await exportToWord(cv, `${cv.title || "CV"}.docx`);
          alert("✅ Word berhasil diunduh");
          break;
      }
    } catch (error) {
      console.error("Export error:", error);
      alert("Gagal export: " + (error as Error).message);
    } finally {
      setExporting(null);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent - ATS Ready! 🎉";
    if (score >= 60) return "Good - Butuh sedikit improvement";
    return "Needs Work - Perbaiki beberapa area";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Review & Export CV Creative</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Analisa ATS score, validasi, dan export dalam berbagai format
        </p>
      </div>

      {/* Design Summary */}
      <Card className="border-purple-500/50 bg-gradient-to-br from-purple-50 to-pink-50 p-4 dark:from-purple-950 dark:to-pink-950">
        <div className="flex items-start gap-3">
          <Palette className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-purple-900 dark:text-purple-100">
              🎨 Design Summary
            </h3>
            <div className="mt-2 space-y-1 text-sm">
              <p><strong>Template:</strong> {templateId}</p>
              <p><strong>Colors:</strong> {colorScheme.primary} • {colorScheme.secondary}</p>
              <p><strong>Photo:</strong> {photoUrl ? "✓ Uploaded" : "✗ No photo"}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* ATS Score Analysis */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Analisa ATS Score</h3>

        <div className="space-y-4">
          <div>
            <Label htmlFor="job-description">Job Description (Opsional)</Label>
            <Textarea
              id="job-description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job description untuk analisa keyword match..."
              className="mt-1.5 min-h-[100px]"
              rows={4}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              JD akan digunakan untuk analisa keyword match dan saran improvement
            </p>
          </div>

          <Button
            onClick={handleAnalyzeATS}
            disabled={analyzingATS}
            className="w-full"
          >
            {analyzingATS ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menganalisa...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Hitung ATS Score
              </>
            )}
          </Button>

          {atsAnalysis && (
            <div className="space-y-4 rounded-lg border p-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">ATS Score</p>
                <p className={`text-6xl font-bold ${getScoreColor(atsAnalysis.score)}`}>
                  {atsAnalysis.score}
                </p>
                <p className="mt-2 text-sm font-medium">
                  {getScoreLabel(atsAnalysis.score)}
                </p>
                <Progress
                  value={atsAnalysis.score}
                  className="mt-4 h-3"
                />
              </div>

              {atsAnalysis.missingKeywords.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-semibold">
                    🔑 Keyword yang Hilang:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {atsAnalysis.missingKeywords.map((keyword, idx) => (
                      <span
                        key={idx}
                        className="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {atsAnalysis.issues.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-semibold">⚠️ Masalah Ditemukan:</p>
                  <ul className="space-y-1 text-sm">
                    {atsAnalysis.issues.map((issue, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-destructive">•</span>
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {atsAnalysis.suggestions.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-semibold">💡 Saran Perbaikan:</p>
                  <ul className="space-y-1 text-sm">
                    {atsAnalysis.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-primary">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Export & Save */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Export & Simpan</h3>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            variant="outline"
            onClick={() => handleExport("pdf")}
            disabled={exporting === "pdf"}
          >
            {exporting === "pdf" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <FileDown className="mr-2 h-4 w-4" />
                Unduh PDF
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={() => handleExport("png")}
            disabled={exporting === "png"}
          >
            {exporting === "png" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Image className="mr-2 h-4 w-4" />
                Unduh PNG
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={() => handleExport("jpg")}
            disabled={exporting === "jpg"}
          >
            {exporting === "jpg" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Image className="mr-2 h-4 w-4" />
                Unduh JPG
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={() => handleExport("word")}
            disabled={exporting === "word"}
          >
            {exporting === "word" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <FileDown className="mr-2 h-4 w-4" />
                Unduh Word
              </>
            )}
          </Button>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="mt-3 w-full"
          size="lg"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Simpan CV
            </>
          )}
        </Button>

        <div className="mt-4 space-y-2 text-xs text-muted-foreground">
          <p>• <strong>PDF:</strong> Format universal, cocok untuk email & upload</p>
          <p>• <strong>PNG/JPG:</strong> Format gambar untuk social media</p>
          <p>• <strong>Word:</strong> Format .docx yang bisa diedit</p>
          <p>• <strong>Simpan CV:</strong> Simpan ke database untuk digunakan nanti</p>
        </div>
      </Card>

      {/* Summary Card */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">📊 Ringkasan CV</h3>
        <div className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <p className="font-medium text-muted-foreground">Judul:</p>
            <p className="mt-1">{resume.title || "-"}</p>
          </div>
          <div>
            <p className="font-medium text-muted-foreground">Nama:</p>
            <p className="mt-1">
              {resume.basics.firstName} {resume.basics.lastName}
            </p>
          </div>
          <div>
            <p className="font-medium text-muted-foreground">Headline:</p>
            <p className="mt-1">{resume.basics.headline || "-"}</p>
          </div>
          <div>
            <p className="font-medium text-muted-foreground">Email:</p>
            <p className="mt-1">{resume.basics.email}</p>
          </div>
          <div>
            <p className="font-medium text-muted-foreground">Template:</p>
            <p className="mt-1">{templateId}</p>
          </div>
          <div>
            <p className="font-medium text-muted-foreground">ATS Score:</p>
            <p className="mt-1">
              {resume.ats_score ? `${resume.ats_score}/100` : "Belum dihitung"}
            </p>
          </div>
          <div>
            <p className="font-medium text-muted-foreground">Pengalaman:</p>
            <p className="mt-1">{resume.experiences.length} posisi</p>
          </div>
          <div>
            <p className="font-medium text-muted-foreground">Pendidikan:</p>
            <p className="mt-1">{resume.education.length} institusi</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
