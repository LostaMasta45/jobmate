"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { MobileToolHeader } from "@/components/tools/MobileToolHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCoverLetter, getTemplates } from "@/actions/tools";
import { Loader2, Copy, Download, Sparkles, CheckCircle2, FileDown } from "lucide-react";
import { HistoryList } from "@/components/cover-letter/HistoryList";
import { generateCoverLetterPDF } from "@/lib/pdf";

export default function CoverLetterPage() {
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [templates, setTemplates] = React.useState<any[]>([]);
  const [formData, setFormData] = React.useState({
    full_name: "",
    position: "",
    company: "",
    skills: "",
    experience: "",
    reason: "",
    tone: "formal",
  });

  // Load templates on mount
  React.useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await getTemplates("cover_letter");
      setTemplates(data);
    } catch (error) {
      console.error("Failed to load templates:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const { content } = await createCoverLetter(formData);

      if (!content || content.trim() === "") {
        throw new Error("Tidak ada hasil yang dihasilkan. Silakan coba lagi.");
      }
      setResult(content);

      // Refresh templates after successful generation
      setTimeout(() => {
        loadTemplates();
      }, 1000);
    } catch (error) {
      console.error("Error generating cover letter:", error);
      const errorMessage = error instanceof Error ? error.message : "Gagal generate cover letter. Silakan coba lagi.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (result) {
      try {
        await navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);

        // Track copy usage via API
        try {
          await fetch('/api/notifications/track-usage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ toolName: "Cover Letter Copy", documentTitle: `${formData.position} at ${formData.company}` })
          });
        } catch (e) { console.error("[Tracking] Failed:", e); }
      } catch (err) {
        alert("Gagal menyalin. Silakan copy manual.");
      }
    }
  };

  const handleDownloadText = async () => {
    if (result) {
      const blob = new Blob([result], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Cover_Letter_${formData.position}_${formData.company}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Track download usage via API
      try {
        await fetch('/api/notifications/track-usage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ toolName: "Cover Letter Download TXT", documentTitle: `${formData.position} at ${formData.company}` })
        });
      } catch (e) { console.error("[Tracking] Failed:", e); }
    }
  };

  const handleDownloadPDF = async () => {
    if (result) {
      try {
        const filename = `Cover_Letter_${formData.position}_${formData.company}.pdf`;
        generateCoverLetterPDF(result, filename);

        // Track PDF download usage via API
        try {
          await fetch('/api/notifications/track-usage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ toolName: "Cover Letter Download PDF", documentTitle: `${formData.position} at ${formData.company}` })
          });
        } catch (e) { console.error("[Tracking] Failed:", e); }
      } catch (error) {
        alert("Gagal download PDF: " + (error as Error).message);
      }
    }
  };

  const handleLoadTemplate = (content: string) => {
    setResult(content);
    // Scroll to result
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AppShell>
      {/* Mobile Tool Header */}
      <MobileToolHeader
        title="Cover Letter"
        description="Generator cover letter"
      />

      <PageHeader
        title="Cover Letter Generator"
        description="Buat surat lamaran profesional dengan AI dalam Bahasa Indonesia"
        hideOnMobile
      />

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary shrink-0" />
                <CardTitle className="text-lg sm:text-xl">Form Input</CardTitle>
              </div>
              <CardDescription className="text-xs sm:text-sm">
                Isi data dengan lengkap untuk hasil terbaik
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Nama Lengkap *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, full_name: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Posisi yang Dilamar *</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, position: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Nama Perusahaan *</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, company: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skill Utama *</Label>
                <Input
                  id="skills"
                  placeholder="Contoh: JavaScript, React, Node.js"
                  value={formData.skills}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, skills: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Pengalaman Singkat *</Label>
                <Input
                  id="experience"
                  placeholder="Contoh: 3 tahun sebagai Frontend Developer"
                  value={formData.experience}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, experience: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Alasan Melamar *</Label>
                <Input
                  id="reason"
                  placeholder="Contoh: Tertarik dengan kultur perusahaan"
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, reason: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tone">Nada Bahasa</Label>
                <select
                  id="tone"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.tone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, tone: e.target.value }))
                  }
                >
                  <option value="formal">Formal</option>
                  <option value="semi-formal">Semi-formal</option>
                  <option value="santai">Santai</option>
                </select>
              </div>

              <Button
                type="submit"
                className="w-full gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Generate Surat Lamaran</span>
                  </>
                )}
              </Button>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
                  <p className="font-medium">❌ Error:</p>
                  <p className="mt-1">{error}</p>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1 flex-1">
                <CardTitle className="text-lg sm:text-xl">Hasil Surat Lamaran</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Surat siap pakai untuk dikirim ke HRD
                </CardDescription>
              </div>
              {result && (
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="gap-1.5 sm:gap-2"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span className="text-xs sm:text-sm hidden sm:inline">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 shrink-0" />
                        <span className="text-xs sm:text-sm hidden sm:inline">Salin</span>
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadText}
                    className="gap-1.5 sm:gap-2"
                  >
                    <Download className="h-4 w-4 shrink-0" />
                    <span className="text-xs sm:text-sm hidden sm:inline">TXT</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadPDF}
                    className="gap-1.5 sm:gap-2"
                  >
                    <FileDown className="h-4 w-4 shrink-0" />
                    <span className="text-xs sm:text-sm hidden sm:inline">PDF</span>
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center justify-center h-96 space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <div className="text-center space-y-2">
                  <p className="font-medium">Sedang membuat surat lamaran...</p>
                  <p className="text-sm text-muted-foreground">AI sedang menyusun surat terbaik untuk Anda</p>
                </div>
              </div>
            ) : result ? (
              <div className="space-y-3 sm:space-y-4">
                <div className="p-3 sm:p-4 rounded-lg bg-green-50 border border-green-200 text-green-800">
                  <p className="text-xs sm:text-sm font-medium flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>Surat lamaran berhasil dibuat!</span>
                  </p>
                </div>
                <div className="whitespace-pre-wrap rounded-lg bg-muted/50 p-3 sm:p-4 md:p-6 text-xs sm:text-sm leading-relaxed border max-h-[500px] sm:max-h-[600px] overflow-y-auto scrollbar-thin">
                  {result}
                </div>
                {/* Mobile: Sticky bottom buttons */}
                <div className="sticky bottom-0 sm:hidden flex gap-2 p-3 bg-card border-t -mx-6 -mb-6">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleCopy}
                    className="gap-1.5 flex-1"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-xs">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span className="text-xs">Salin</span>
                      </>
                    )}
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleDownloadText}
                    className="gap-1.5 flex-1"
                  >
                    <Download className="h-4 w-4" />
                    <span className="text-xs">TXT</span>
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleDownloadPDF}
                    className="gap-1.5 flex-1"
                  >
                    <FileDown className="h-4 w-4" />
                    <span className="text-xs">PDF</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 text-center space-y-3">
                <div className="p-4 rounded-full bg-muted/50">
                  <Sparkles className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-muted-foreground">Hasil akan muncul di sini</p>
                  <p className="text-sm text-muted-foreground">Isi form dan klik Generate untuk mulai</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* History Section */}
      <div className="mt-6">
        <HistoryList
          templates={templates}
          onRefresh={loadTemplates}
          onLoadTemplate={handleLoadTemplate}
        />
      </div>
    </AppShell>
  );
}
