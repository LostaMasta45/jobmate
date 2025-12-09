"use client";

import * as React from "react";
import { Resume } from "@/lib/schemas/cv-ats";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Loader2, ChevronDown, ChevronUp, HelpCircle, Target, Trophy, Briefcase } from "lucide-react";
import { generateAISummary } from "@/actions/cv-ats";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StepSummaryProps {
  resume: Resume;
  setResume: (resume: Resume) => void;
}

export function StepSummary({ resume, setResume }: StepSummaryProps) {
  const [generating, setGenerating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = React.useState(true);
  
  // Additional fields for better AI generation
  const [targetPosition, setTargetPosition] = React.useState("");
  const [yearsExperience, setYearsExperience] = React.useState("");
  const [topAchievements, setTopAchievements] = React.useState("");
  const [targetIndustry, setTargetIndustry] = React.useState("");
  const [careerGoal, setCareerGoal] = React.useState("");
  const [summaryTone, setSummaryTone] = React.useState<"professional" | "confident" | "friendly">("professional");

  const handleChange = (value: string) => {
    setResume({ ...resume, summary: value });
  };

  const handleAIGenerate = async () => {
    setGenerating(true);
    setError(null);

    try {
      // Validate required fields
      if (!resume.basics.firstName || !resume.basics.headline) {
        throw new Error("Lengkapi informasi dasar terlebih dahulu (Step 1)");
      }

      const summary = await generateAISummary({
        firstName: resume.basics.firstName,
        lastName: resume.basics.lastName,
        headline: resume.basics.headline,
        skills: resume.skills,
        experiences: resume.experiences,
        // Enhanced fields for better AI generation
        targetPosition: targetPosition || resume.basics.headline,
        yearsExperience: yearsExperience,
        topAchievements: topAchievements,
        targetIndustry: targetIndustry,
        careerGoal: careerGoal,
        summaryTone: summaryTone,
      });

      setResume({ ...resume, summary });
    } catch (error) {
      console.error("AI generate error:", error);
      setError(error instanceof Error ? error.message : "Gagal generate ringkasan");
    } finally {
      setGenerating(false);
    }
  };

  const charCount = resume.summary?.length || 0;
  const charLimit = 600;
  const charPercentage = (charCount / charLimit) * 100;

  // Calculate completion percentage for AI input fields
  const aiInputsFilledCount = [
    targetPosition,
    yearsExperience,
    topAchievements,
    targetIndustry,
  ].filter(Boolean).length;
  const aiInputsTotal = 4;
  const aiReadinessPercent = Math.round((aiInputsFilledCount / aiInputsTotal) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Ringkasan Profil</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ringkasan yang menarik meningkatkan peluang CV Anda dibaca HRD hingga 40%
        </p>
      </div>

      {/* AI Input Enhancement Card */}
      <Card className="p-4 sm:p-6 border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/30 dark:to-pink-950/30">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex w-full items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-base">🚀 AI Summary Generator</h3>
              <p className="text-xs text-muted-foreground">
                Isi form untuk hasil ringkasan yang lebih powerful
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
              <div className="h-2 w-20 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                  style={{ width: `${aiReadinessPercent}%` }}
                />
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                {aiReadinessPercent}%
              </span>
            </div>
            {showAdvanced ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </button>

        {showAdvanced && (
          <div className="mt-4 space-y-4 border-t pt-4">
            {/* Row 1: Target Position & Years Experience */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm">
                  <Target className="h-4 w-4 text-purple-500" />
                  Posisi yang Dituju
                  <span title="Posisi spesifik yang Anda lamar, misal: Senior Frontend Developer, Product Manager" className="cursor-help">
                    <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                  </span>
                </Label>
                <Input
                  placeholder="misal: Senior Software Engineer"
                  value={targetPosition}
                  onChange={(e) => setTargetPosition(e.target.value)}
                  className="text-base sm:text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-blue-500" />
                  Total Pengalaman
                </Label>
                <Select value={yearsExperience} onValueChange={setYearsExperience}>
                  <SelectTrigger className="text-base sm:text-sm">
                    <SelectValue placeholder="Pilih rentang pengalaman" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fresh">Fresh Graduate (0-1 tahun)</SelectItem>
                    <SelectItem value="junior">Junior (1-3 tahun)</SelectItem>
                    <SelectItem value="mid">Mid-Level (3-5 tahun)</SelectItem>
                    <SelectItem value="senior">Senior (5-8 tahun)</SelectItem>
                    <SelectItem value="lead">Lead/Manager (8-10 tahun)</SelectItem>
                    <SelectItem value="expert">Expert/Director (10+ tahun)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 2: Top Achievements */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm">
                <Trophy className="h-4 w-4 text-yellow-500" />
                Pencapaian Terbaik (3 Teratas)
                <span title="Gunakan angka dan metrik! Contoh: Meningkatkan revenue 30%, Memimpin tim 10 orang, Mengelola budget Rp 500jt" className="cursor-help">
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </span>
              </Label>
              <Textarea
                placeholder="1. Meningkatkan efisiensi sistem 40%&#10;2. Memimpin tim 8 engineer untuk deliver project on-time&#10;3. Mengurangi bug rate hingga 60%"
                value={topAchievements}
                onChange={(e) => setTopAchievements(e.target.value)}
                className="min-h-[80px] text-base sm:text-sm"
              />
            </div>

            {/* Row 3: Target Industry & Career Goal */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm">Target Industri (Opsional)</Label>
                <Input
                  placeholder="misal: Fintech, E-commerce, Healthcare"
                  value={targetIndustry}
                  onChange={(e) => setTargetIndustry(e.target.value)}
                  className="text-base sm:text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Gaya Penulisan</Label>
                <Select value={summaryTone} onValueChange={(v) => setSummaryTone(v as typeof summaryTone)}>
                  <SelectTrigger className="text-base sm:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">🎯 Profesional & Formal</SelectItem>
                    <SelectItem value="confident">💪 Percaya Diri & Impactful</SelectItem>
                    <SelectItem value="friendly">😊 Ramah & Approachable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 4: Career Goal */}
            <div className="space-y-2">
              <Label className="text-sm">Tujuan Karir (Opsional)</Label>
              <Input
                placeholder="misal: Ingin berkontribusi dalam transformasi digital perbankan Indonesia"
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value)}
                className="text-base sm:text-sm"
              />
            </div>

            {/* AI Readiness Indicator */}
            <div className="flex items-center gap-3 rounded-lg bg-white/50 dark:bg-slate-900/50 p-3">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">Kesiapan Input AI</span>
                  <span className={`text-xs font-bold ${
                    aiReadinessPercent >= 75 ? "text-green-600" : 
                    aiReadinessPercent >= 50 ? "text-yellow-600" : "text-red-500"
                  }`}>
                    {aiReadinessPercent >= 75 ? "🔥 Excellent!" : 
                     aiReadinessPercent >= 50 ? "👍 Good" : "📝 Isi lebih banyak"}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      aiReadinessPercent >= 75 ? "bg-gradient-to-r from-green-400 to-green-600" : 
                      aiReadinessPercent >= 50 ? "bg-gradient-to-r from-yellow-400 to-yellow-600" : 
                      "bg-gradient-to-r from-red-400 to-red-600"
                    }`}
                    style={{ width: `${aiReadinessPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleAIGenerate}
              disabled={generating}
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
            >
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Ringkasan...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Ringkasan dengan AI
                </>
              )}
            </Button>

            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Result / Manual Input Card */}
      <Card className="p-4 sm:p-6">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="summary" className="text-base sm:text-sm font-semibold">
                Hasil Ringkasan Profil
              </Label>
              <span
                className={`text-xs ${
                  charCount > charLimit
                    ? "text-destructive font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {charCount}/{charLimit} karakter
              </span>
            </div>
            <Textarea
              id="summary"
              value={resume.summary || ""}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Klik 'Generate Ringkasan dengan AI' di atas, atau tulis manual di sini...

Contoh: Saya adalah Frontend Developer dengan 5+ tahun pengalaman membangun aplikasi web modern menggunakan React, TypeScript, dan Next.js. Berhasil meningkatkan performa aplikasi hingga 40% dan mengurangi bug produksi sebesar 60%. Fokus pada user experience optimal dan code quality tinggi yang dapat memberikan nilai tambah bagi perusahaan."
              className="mt-1.5 min-h-[180px] text-base sm:text-sm"
              maxLength={charLimit}
            />
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full transition-all ${
                  charPercentage > 100
                    ? "bg-destructive"
                    : charPercentage > 80
                    ? "bg-yellow-500"
                    : "bg-primary"
                }`}
                style={{ width: `${Math.min(charPercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Examples Card */}
      <Card className="p-4 sm:p-6">
        <h3 className="mb-3 font-semibold text-lg">📝 Contoh Ringkasan yang Disukai HRD</h3>
        <div className="space-y-3 text-sm">
          <div className="rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-3">
            <p className="font-medium text-green-700 dark:text-green-300">✅ Excellent (Spesifik, Terukur, Value-Driven):</p>
            <p className="mt-1 text-muted-foreground italic">
              "Saya adalah Senior Backend Engineer dengan 7+ tahun pengalaman membangun sistem
              scalable untuk 10M+ pengguna aktif. Expert dalam microservices architecture, Kubernetes, dan
              cloud infrastructure (AWS/GCP). Berhasil mengurangi latency API hingga 70% dan
              menghemat biaya infrastruktur Rp 3 miliar/tahun di perusahaan sebelumnya. Siap berkontribusi dalam membangun sistem yang reliable dan scalable."
            </p>
          </div>

          <div className="rounded-lg bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 p-3">
            <p className="font-medium text-yellow-700 dark:text-yellow-300">🆗 Good (Ada angka, tapi kurang spesifik):</p>
            <p className="mt-1 text-muted-foreground italic">
              "Frontend Developer dengan 4 tahun pengalaman di React dan JavaScript. Pernah 
              bekerja di 3 perusahaan dan menangani beberapa project besar. Familiar dengan 
              agile methodology dan bisa bekerja dalam tim."
            </p>
          </div>

          <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-3">
            <p className="font-medium text-red-600 dark:text-red-400">❌ Poor (Generik, No Numbers, Klise):</p>
            <p className="mt-1 text-muted-foreground italic">
              "Saya adalah programmer yang berpengalaman dan memiliki skill yang baik.
              Saya bisa bekerja dalam tim dan individual. Saya passionate dengan
              teknologi dan selalu ingin belajar hal baru."
            </p>
          </div>
        </div>
      </Card>

      {/* Tips Card */}
      <div className="rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200 dark:border-blue-800 p-4 text-sm">
        <p className="font-semibold text-blue-700 dark:text-blue-300">💡 Formula Ringkasan ATS-Friendly yang Disukai HRD:</p>
        <div className="mt-3 space-y-2">
          <div className="flex items-start gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white text-xs font-bold">1</span>
            <p className="text-muted-foreground"><strong>Identitas:</strong> "[Role] dengan [X tahun] pengalaman di [industri/bidang]"</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white text-xs font-bold">2</span>
            <p className="text-muted-foreground"><strong>Keahlian:</strong> "Expert/Specialist dalam [3-5 skills utama]"</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white text-xs font-bold">3</span>
            <p className="text-muted-foreground"><strong>Pencapaian:</strong> "Berhasil [achievement dengan angka: %, Rp, jumlah]"</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white text-xs font-bold">4</span>
            <p className="text-muted-foreground"><strong>Value Proposition:</strong> "Siap berkontribusi dalam [apa yang bisa Anda berikan]"</p>
          </div>
        </div>
      </div>
    </div>
  );
}
