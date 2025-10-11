"use client";

import * as React from "react";
import { Resume, resumeSchema } from "@/lib/schemas/cv-ats";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Copy,
  FileDown,
  FileText,
  Save,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles,
} from "lucide-react";
import { analyzeATSScore, saveResumeToDatabase } from "@/actions/cv-ats";
import { ATSAnalysis } from "@/types/cv-ats";
import { downloadResumeAsPDF, downloadResumeAsWord } from "@/lib/cv-download";

interface StepReviewProps {
  resume: Resume;
  setResume: (resume: Resume) => void;
  onSaveSuccess?: () => void;
}

export function StepReview({ resume, setResume, onSaveSuccess }: StepReviewProps) {
  const [validationErrors, setValidationErrors] = React.useState<string[]>([]);
  const [atsAnalysis, setAtsAnalysis] = React.useState<ATSAnalysis | null>(null);
  const [analyzingATS, setAnalyzingATS] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [exporting, setExporting] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [jobDescription, setJobDescription] = React.useState("");

  // Validate resume
  React.useEffect(() => {
    const errors: string[] = [];

    // Validate using Zod
    const result = resumeSchema.safeParse(resume);
    if (!result.success) {
      result.error.errors.forEach((err) => {
        errors.push(`${err.path.join(" → ")}: ${err.message}`);
      });
    }

    // Additional validations
    if (resume.experiences.length === 0 && resume.education.length === 0) {
      errors.push("Minimal harus ada 1 pengalaman atau 1 pendidikan");
    }

    resume.experiences.forEach((exp, idx) => {
      if (exp.bullets.length === 0 || exp.bullets.every((b) => !b.trim())) {
        errors.push(`Pengalaman #${idx + 1}: Minimal 1 bullet point wajib diisi`);
      }
      if (exp.bullets.some((b) => b.split(" ").length > 30)) {
        errors.push(
          `Pengalaman #${idx + 1}: Ada bullet point > 30 kata (terlalu panjang untuk ATS)`
        );
      }
    });

    if (resume.skills.length === 0) {
      errors.push("Minimal 1 skill wajib ditambahkan");
    }

    setValidationErrors(errors);
  }, [resume]);

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

  const handleCopyText = async () => {
    try {
      const text = generatePlainText(resume);
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      alert("Gagal copy: " + (error as Error).message);
    }
  };

  const handleSave = async () => {
    if (validationErrors.length > 0) {
      alert("Perbaiki error validasi terlebih dahulu");
      return;
    }

    setSaving(true);
    try {
      console.log("Attempting to save resume...");
      const result = await saveResumeToDatabase(resume);
      console.log("Save result:", result);
      
      alert("✅ CV berhasil disimpan! Kembali ke history...");
      
      // Auto-close wizard after 1 second
      setTimeout(() => {
        if (onSaveSuccess) {
          onSaveSuccess();
        }
      }, 1000);
    } catch (error: any) {
      console.error("Save error in component:", error);
      const errorMsg = error?.message || "Gagal simpan CV";
      alert("❌ Gagal simpan: " + errorMsg + "\n\nCek console untuk detail error.");
    } finally {
      setSaving(false);
    }
  };

  const handleExportPDF = () => {
    if (validationErrors.length > 0) {
      alert("Perbaiki error validasi terlebih dahulu");
      return;
    }

    setExporting("ats");
    try {
      downloadResumeAsPDF(resume);
      alert(`✅ PDF berhasil diunduh`);
    } catch (error) {
      alert("Gagal export PDF: " + (error as Error).message);
    } finally {
      setExporting(null);
    }
  };

  const handleExportWord = async () => {
    if (validationErrors.length > 0) {
      alert("Perbaiki error validasi terlebih dahulu");
      return;
    }

    setExporting("word");
    try {
      await downloadResumeAsWord(resume);
      alert(`✅ Word berhasil diunduh`);
    } catch (error) {
      alert("Gagal export Word: " + (error as Error).message);
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
        <h2 className="text-2xl font-bold">Tinjau & Ekspor</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Validasi CV, hitung ATS score, dan export dalam berbagai format
        </p>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-destructive">
                Error Validasi ({validationErrors.length})
              </h3>
              <p className="mt-1 text-sm text-destructive/80">
                Perbaiki error berikut sebelum export:
              </p>
              <ul className="mt-2 space-y-1 text-sm">
                {validationErrors.map((error, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-destructive">•</span>
                    <span className="text-destructive/90">{error}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {validationErrors.length === 0 && (
        <Card className="border-green-500/50 bg-green-50 p-4 dark:bg-green-950">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            <div>
              <h3 className="font-semibold text-green-900 dark:text-green-100">
                ✅ Validasi Berhasil
              </h3>
              <p className="text-sm text-green-800 dark:text-green-200">
                CV Anda sudah siap untuk di-export!
              </p>
            </div>
          </div>
        </Card>
      )}

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
            disabled={analyzingATS || validationErrors.length > 0}
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

      {/* Export Actions */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Export & Simpan</h3>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            variant="outline"
            onClick={handleCopyText}
            disabled={validationErrors.length > 0}
          >
            {copied ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Tersalin!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Salin sebagai Teks
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={handleExportPDF}
            disabled={validationErrors.length > 0 || exporting === "ats"}
          >
            {exporting === "ats" ? (
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
            onClick={handleExportWord}
            disabled={validationErrors.length > 0 || exporting === "word"}
          >
            {exporting === "word" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Unduh Word
              </>
            )}
          </Button>

          <Button
            onClick={handleSave}
            disabled={validationErrors.length > 0 || saving}
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
        </div>

        <div className="mt-4 space-y-2 text-xs text-muted-foreground">
          <p>• <strong>Salin sebagai Teks:</strong> Copy ke clipboard untuk paste manual</p>
          <p>• <strong>Unduh PDF:</strong> Format PDF ATS-friendly dengan professional styling</p>
          <p>• <strong>Unduh Word:</strong> Format .docx yang bisa diedit di Microsoft Word</p>
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
            <p className="font-medium text-muted-foreground">Pengalaman:</p>
            <p className="mt-1">{resume.experiences.length} posisi</p>
          </div>
          <div>
            <p className="font-medium text-muted-foreground">Pendidikan:</p>
            <p className="mt-1">{resume.education.length} institusi</p>
          </div>
          <div>
            <p className="font-medium text-muted-foreground">Skills:</p>
            <p className="mt-1">{resume.skills.length} skills</p>
          </div>
          <div>
            <p className="font-medium text-muted-foreground">ATS Score:</p>
            <p className="mt-1">
              {resume.ats_score ? `${resume.ats_score}/100` : "Belum dihitung"}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Helper function to generate plain text version
function generatePlainText(resume: Resume): string {
  let text = "";

  // Header
  text += `${resume.basics.firstName} ${resume.basics.lastName}\n`;
  text += `${resume.basics.headline}\n\n`;
  
  // Contact
  text += `Email: ${resume.basics.email}\n`;
  if (resume.basics.phone) text += `Phone: ${resume.basics.phone}\n`;
  if (resume.basics.city) text += `Location: ${resume.basics.city}\n`;
  if (resume.basics.website) text += `Website: ${resume.basics.website}\n`;
  if (resume.basics.linkedin) text += `LinkedIn: ${resume.basics.linkedin}\n`;
  text += "\n";

  // Summary
  if (resume.summary) {
    text += "SUMMARY\n";
    text += `${resume.summary}\n\n`;
  }

  // Experience
  if (resume.experiences.length > 0) {
    text += "PROFESSIONAL EXPERIENCE\n\n";
    resume.experiences.forEach((exp) => {
      text += `${exp.title} | ${exp.company}\n`;
      text += `${exp.startDate} - ${exp.isCurrent ? "Present" : exp.endDate}\n`;
      exp.bullets.forEach((bullet) => {
        text += `• ${bullet}\n`;
      });
      text += "\n";
    });
  }

  // Education
  if (resume.education.length > 0) {
    text += "EDUCATION\n\n";
    resume.education.forEach((edu) => {
      text += `${edu.school}\n`;
      if (edu.degree || edu.field) {
        text += `${edu.degree} ${edu.field}\n`;
      }
      if (edu.startDate || edu.endDate) {
        text += `${edu.startDate} - ${edu.endDate}\n`;
      }
      if (edu.description) {
        text += `${edu.description}\n`;
      }
      text += "\n";
    });
  }

  // Skills
  if (resume.skills.length > 0) {
    text += "SKILLS\n";
    text += resume.skills.join(", ") + "\n\n";
  }

  // Custom Sections
  resume.customSections.forEach((section) => {
    text += `${section.title.toUpperCase()}\n\n`;
    section.items.forEach((item) => {
      text += `${item.label}\n`;
      if (item.description) {
        text += `${item.description}\n`;
      }
      text += "\n";
    });
  });

  return text;
}
