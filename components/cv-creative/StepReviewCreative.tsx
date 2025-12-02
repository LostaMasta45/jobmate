"use client";

import * as React from "react";
import { Resume } from "@/lib/schemas/cv-ats";
import { CreativeCV, ColorScheme, PhotoOptions, TemplateId } from "@/lib/schemas/cv-creative";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  FileDown,
  Image,
  Save,
  Loader2,
  Sparkles,
  Palette,
  FileText,
  FileSearch,
  ImageIcon,
  Upload,
  X,
} from "lucide-react";
import { analyzeATSScore, extractJobDescFromPoster } from "@/actions/cv-ats";
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

type ATSMode = "general" | "job-desc" | "poster";

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
  const [atsMode, setATSMode] = React.useState<ATSMode>("general");
  const [posterImage, setPosterImage] = React.useState<string | null>(null);
  const [posterFileName, setPosterFileName] = React.useState<string>("");
  const [extractingPoster, setExtractingPoster] = React.useState(false);
  const posterInputRef = React.useRef<HTMLInputElement>(null);

  const handlePosterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Hanya file gambar yang diperbolehkan (JPG, PNG, etc.)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Ukuran file maksimal 10MB");
      return;
    }

    setPosterFileName(file.name);

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
        jobDesc = undefined;
      } else if (atsMode === "job-desc") {
        jobDesc = jobDescription || undefined;
      } else if (atsMode === "poster") {
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
      <Card className="p-4 sm:p-6">
        <h3 className="mb-4 text-lg font-semibold">Analisa ATS Score</h3>

        <div className="space-y-5">
          {/* Mode Selection */}
          <div>
            <Label className="text-base sm:text-sm font-medium">Pilih Mode Analisa</Label>
            <RadioGroup
              value={atsMode}
              onValueChange={(value) => setATSMode(value as ATSMode)}
              className="mt-3 grid gap-3"
            >
              <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                <RadioGroupItem value="general" id="general" className="h-5 w-5" />
                <Label htmlFor="general" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <FileSearch className="h-5 w-5 text-blue-500" />
                    <span className="font-medium text-base sm:text-sm">ATS Score Umum</span>
                  </div>
                  <p className="text-sm sm:text-xs text-muted-foreground mt-1">
                    Hitung score berdasarkan best practices ATS tanpa lowongan spesifik
                  </p>
                </Label>
              </div>

              <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                <RadioGroupItem value="job-desc" id="job-desc" className="h-5 w-5" />
                <Label htmlFor="job-desc" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-500" />
                    <span className="font-medium text-base sm:text-sm">Dengan Job Description</span>
                  </div>
                  <p className="text-sm sm:text-xs text-muted-foreground mt-1">
                    Paste job description untuk analisa keyword match
                  </p>
                </Label>
              </div>

              <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                <RadioGroupItem value="poster" id="poster" className="h-5 w-5" />
                <Label htmlFor="poster" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-purple-500" />
                    <span className="font-medium text-base sm:text-sm">Upload Poster Lowongan</span>
                  </div>
                  <p className="text-sm sm:text-xs text-muted-foreground mt-1">
                    Upload gambar poster lowongan, AI akan ekstrak informasinya
                  </p>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Job Description Input */}
          {atsMode === "job-desc" && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
              <Label htmlFor="job-description" className="text-base sm:text-sm">Job Description</Label>
              <Textarea
                id="job-description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste job description untuk analisa keyword match..."
                className="mt-2 min-h-[150px] text-base sm:text-sm p-3"
                rows={6}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                JD akan digunakan untuk analisa keyword match dan saran improvement
              </p>
            </div>
          )}

          {/* Poster Upload */}
          {atsMode === "poster" && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200 space-y-4">
              <Label className="text-base sm:text-sm">Upload Poster Lowongan</Label>
              
              {!posterImage ? (
                <div
                  onClick={() => posterInputRef.current?.click()}
                  className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors"
                >
                  <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-base font-medium">Klik untuk upload poster</p>
                  <p className="text-sm text-muted-foreground mt-1">JPG, PNG (max 10MB)</p>
                  <Input
                    ref={posterInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePosterUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-xl border overflow-hidden bg-slate-50 dark:bg-slate-900">
                    <img
                      src={posterImage}
                      alt="Poster Lowongan"
                      className="w-full max-h-[300px] object-contain mx-auto"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-3 right-3 h-8 w-8 rounded-full shadow-md"
                      onClick={handleRemovePoster}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground truncate px-1">
                    📎 {posterFileName}
                  </p>

                  <Button
                    onClick={handleExtractFromPoster}
                    disabled={extractingPoster}
                    variant="secondary"
                    className="w-full h-12"
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

                  {jobDescription && (
                    <div className="animate-in fade-in duration-200">
                      <Label htmlFor="extracted-jd" className="text-base sm:text-sm">Hasil Ekstraksi</Label>
                      <Textarea
                        id="extracted-jd"
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        className="mt-2 min-h-[150px] text-base sm:text-sm p-3"
                        rows={6}
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
              (atsMode === "poster" && !jobDescription)
            }
            className="w-full h-12 text-base"
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
            <div className="space-y-6 rounded-xl border p-5 bg-slate-50/50 dark:bg-slate-900/50">
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
