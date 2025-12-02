"use client";

import * as React from "react";
import { Resume, resumeSchema } from "@/lib/schemas/cv-ats";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Copy,
  FileDown,
  FileText,
  Save,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles,
  Upload,
  ImageIcon,
  X,
  FileSearch,
} from "lucide-react";
import { analyzeATSScore, saveResumeToDatabase, extractJobDescFromPoster } from "@/actions/cv-ats";
import { ATSAnalysis } from "@/types/cv-ats";
import { downloadResumeAsPDF, downloadResumeAsWord } from "@/lib/cv-download";

interface StepReviewProps {
  resume: Resume;
  setResume: (resume: Resume) => void;
  onSaveSuccess?: () => void;
}

type ATSMode = "general" | "job-desc" | "poster";

export function StepReview({ resume, setResume, onSaveSuccess }: StepReviewProps) {
  const [validationErrors, setValidationErrors] = React.useState<string[]>([]);
  const [atsAnalysis, setAtsAnalysis] = React.useState<ATSAnalysis | null>(null);
  const [analyzingATS, setAnalyzingATS] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [exporting, setExporting] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [jobDescription, setJobDescription] = React.useState("");
  const [atsMode, setATSMode] = React.useState<ATSMode>("general");
  const [posterImage, setPosterImage] = React.useState<string | null>(null);
  const [posterFileName, setPosterFileName] = React.useState<string>("");
  const [extractingPoster, setExtractingPoster] = React.useState(false);
  const posterInputRef = React.useRef<HTMLInputElement>(null);

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

  const handlePosterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Hanya file gambar yang diperbolehkan (JPG, PNG, etc.)");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("Ukuran file maksimal 10MB");
      return;
    }

    setPosterFileName(file.name);

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setPosterImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleExtractFromPoster = async () => {
    if (!posterImage) return;

    setExtractingPoster(true);
    try {
      const extractedJobDesc = await extractJobDescFromPoster(posterImage);
      setJobDescription(extractedJobDesc);
      alert("✅ Job description berhasil diekstrak dari poster!");
    } catch (error) {
      alert("Gagal ekstrak: " + (error as Error).message);
    } finally {
      setExtractingPoster(false);
    }
  };

  const handleRemovePoster = () => {
    setPosterImage(null);
    setPosterFileName("");
    if (posterInputRef.current) {
      posterInputRef.current.value = "";
    }
  };

  const handleAnalyzeATS = async () => {
    setAnalyzingATS(true);
    try {
      let jobDesc: string | undefined;

      if (atsMode === "general") {
        // General ATS score without job description
        jobDesc = undefined;
      } else if (atsMode === "job-desc") {
        // Use manual job description
        jobDesc = jobDescription || undefined;
      } else if (atsMode === "poster") {
        // Use job description from poster (should already be extracted)
        jobDesc = jobDescription || undefined;
      }

      const analysis = await analyzeATSScore(resume, jobDesc);
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
          {/* Mode Selection */}
          <div>
            <Label className="text-sm font-medium">Pilih Mode Analisa</Label>
            <RadioGroup
              value={atsMode}
              onValueChange={(value) => setATSMode(value as ATSMode)}
              className="mt-2 grid gap-2"
            >
              <div className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="general" id="general" />
                <Label htmlFor="general" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <FileSearch className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">ATS Score Umum</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Hitung score berdasarkan best practices ATS tanpa lowongan spesifik
                  </p>
                </Label>
              </div>

              <div className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="job-desc" id="job-desc" />
                <Label htmlFor="job-desc" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Dengan Job Description</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Paste job description untuk analisa keyword match
                  </p>
                </Label>
              </div>

              <div className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="poster" id="poster" />
                <Label htmlFor="poster" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-purple-500" />
                    <span className="font-medium">Upload Poster Lowongan</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Upload gambar poster lowongan, AI akan ekstrak informasinya
                  </p>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Job Description Input (for job-desc mode) */}
          {atsMode === "job-desc" && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
              <Label htmlFor="job-description">Job Description</Label>
              <Textarea
                id="job-description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste job description untuk analisa keyword match..."
                className="mt-1.5 min-h-[120px]"
                rows={5}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                JD akan digunakan untuk analisa keyword match dan saran improvement
              </p>
            </div>
          )}

          {/* Poster Upload (for poster mode) */}
          {atsMode === "poster" && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200 space-y-3">
              <Label>Upload Poster Lowongan</Label>
              
              {!posterImage ? (
                <div
                  onClick={() => posterInputRef.current?.click()}
                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors"
                >
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm font-medium">Klik untuk upload poster</p>
                  <p className="text-xs text-muted-foreground">JPG, PNG (max 10MB)</p>
                  <Input
                    ref={posterInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePosterUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Preview */}
                  <div className="relative rounded-lg border overflow-hidden">
                    <img
                      src={posterImage}
                      alt="Poster Lowongan"
                      className="w-full max-h-[200px] object-contain bg-muted"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-7 w-7"
                      onClick={handleRemovePoster}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    📎 {posterFileName}
                  </p>

                  {/* Extract Button */}
                  <Button
                    onClick={handleExtractFromPoster}
                    disabled={extractingPoster}
                    variant="secondary"
                    className="w-full"
                  >
                    {extractingPoster ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Mengekstrak informasi...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Ekstrak Job Description dari Poster
                      </>
                    )}
                  </Button>

                  {/* Extracted Job Description */}
                  {jobDescription && (
                    <div className="animate-in fade-in duration-200">
                      <Label htmlFor="extracted-jd">Hasil Ekstraksi</Label>
                      <Textarea
                        id="extracted-jd"
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        className="mt-1.5 min-h-[120px] text-sm"
                        rows={5}
                      />
                      <p className="mt-1 text-xs text-muted-foreground">
                        Anda bisa mengedit hasil ekstraksi jika diperlukan
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <Button
            onClick={handleAnalyzeATS}
            disabled={
              analyzingATS || 
              validationErrors.length > 0 ||
              (atsMode === "poster" && !jobDescription)
            }
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
            <div className="space-y-5 rounded-lg border p-4">
              {/* Main Score */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">ATS Score</p>
                <p className={`text-6xl font-bold ${getScoreColor(atsAnalysis.score)}`}>
                  {atsAnalysis.score}
                </p>
                <p className="mt-2 text-sm font-medium">
                  {getScoreLabel(atsAnalysis.score)}
                </p>
                <Progress value={atsAnalysis.score} className="mt-4 h-3" />
              </div>

              {/* Score Breakdown */}
              {atsAnalysis.scoreBreakdown && (
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="mb-2 text-sm font-semibold">📊 Detail Score:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span>Header & Contact</span>
                      <span className="font-medium">{atsAnalysis.scoreBreakdown.header}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Keyword Match</span>
                      <span className="font-medium">{atsAnalysis.scoreBreakdown.keywords}/40</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Experience</span>
                      <span className="font-medium">{atsAnalysis.scoreBreakdown.experience}/20</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Format</span>
                      <span className="font-medium">{atsAnalysis.scoreBreakdown.format}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quantification</span>
                      <span className="font-medium">{atsAnalysis.scoreBreakdown.quantification}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Consistency</span>
                      <span className="font-medium">{atsAnalysis.scoreBreakdown.consistency}/10</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Strengths */}
              {atsAnalysis.strengths && atsAnalysis.strengths.length > 0 && (
                <div className="rounded-lg bg-green-50 p-3 dark:bg-green-950">
                  <p className="mb-2 text-sm font-semibold text-green-800 dark:text-green-200">
                    ✅ Yang Sudah Bagus:
                  </p>
                  <ul className="space-y-1 text-sm text-green-700 dark:text-green-300">
                    {atsAnalysis.strengths.map((strength, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span>•</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quick Wins */}
              {atsAnalysis.quickWins && atsAnalysis.quickWins.length > 0 && (
                <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-950">
                  <p className="mb-2 text-sm font-semibold text-blue-800 dark:text-blue-200">
                    ⚡ Quick Wins (Perbaikan Cepat):
                  </p>
                  <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                    {atsAnalysis.quickWins.map((win, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span>{idx + 1}.</span>
                        <span>{win}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Keyword Analysis */}
              {(atsAnalysis.matchedKeywords?.length > 0 || atsAnalysis.missingKeywords?.length > 0) && (
                <div>
                  <p className="mb-2 text-sm font-semibold">
                    🔑 Keyword Match: {atsAnalysis.keywordMatchPercent || 0}%
                  </p>
                  
                  {atsAnalysis.matchedKeywords && atsAnalysis.matchedKeywords.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs text-muted-foreground mb-1">Sudah ada:</p>
                      <div className="flex flex-wrap gap-1">
                        {atsAnalysis.matchedKeywords.map((keyword, idx) => (
                          <span
                            key={idx}
                            className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-800 dark:bg-green-900 dark:text-green-100"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {atsAnalysis.missingKeywords && atsAnalysis.missingKeywords.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Perlu ditambahkan:</p>
                      <div className="flex flex-wrap gap-1">
                        {atsAnalysis.missingKeywords.map((keyword, idx) => (
                          <span
                            key={idx}
                            className="rounded bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Issues */}
              {atsAnalysis.issues && atsAnalysis.issues.length > 0 && (
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

              {/* Detailed Suggestions */}
              {atsAnalysis.suggestions && atsAnalysis.suggestions.length > 0 && (
                <div>
                  <p className="mb-3 text-sm font-semibold">💡 Saran Perbaikan Detail:</p>
                  <div className="space-y-3">
                    {atsAnalysis.suggestions.map((suggestion, idx) => (
                      <div 
                        key={idx} 
                        className={`rounded-lg border p-3 ${
                          suggestion.priority === "high" 
                            ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950" 
                            : suggestion.priority === "medium"
                            ? "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950"
                            : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                            suggestion.priority === "high" 
                              ? "bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-100" 
                              : suggestion.priority === "medium"
                              ? "bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                              : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
                          }`}>
                            {suggestion.priority === "high" ? "HIGH" : suggestion.priority === "medium" ? "MEDIUM" : "LOW"}
                          </span>
                          <span className="text-xs text-muted-foreground capitalize">
                            {suggestion.section}
                          </span>
                        </div>
                        
                        <p className="text-sm font-medium mb-1">{suggestion.issue}</p>
                        <p className="text-sm text-muted-foreground">{suggestion.suggestion}</p>
                        
                        {suggestion.example && (
                          <div className="mt-2 text-xs space-y-1">
                            {suggestion.example.before && (
                              <div className="flex gap-2">
                                <span className="text-red-600 dark:text-red-400 font-medium shrink-0">❌ Before:</span>
                                <span className="text-muted-foreground line-through">{suggestion.example.before}</span>
                              </div>
                            )}
                            <div className="flex gap-2">
                              <span className="text-green-600 dark:text-green-400 font-medium shrink-0">✅ After:</span>
                              <span className="text-foreground font-medium">{suggestion.example.after}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
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
