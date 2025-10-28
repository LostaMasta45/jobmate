"use client";

import * as React from "react";
import { Resume } from "@/lib/schemas/cv-ats";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { generateAISummary } from "@/actions/cv-ats";

interface StepSummaryProps {
  data: Resume;
  onChange: (data: Resume) => void;
}

export function StepSummary({ data, onChange }: StepSummaryProps) {
  const [generating, setGenerating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleChange = (value: string) => {
    onChange({ ...data, summary: value });
  };

  const handleAIGenerate = async () => {
    setGenerating(true);
    setError(null);

    try {
      // Validate required fields
      if (!data.basics.firstName || !data.basics.headline) {
        throw new Error("Lengkapi informasi dasar terlebih dahulu (Step 1)");
      }

      const summary = await generateAISummary({
        firstName: data.basics.firstName,
        lastName: data.basics.lastName,
        headline: data.basics.headline,
        skills: data.skills,
        experiences: data.experiences,
      });

      onChange({ ...data, summary });
    } catch (error) {
      console.error("AI generate error:", error);
      setError(error instanceof Error ? error.message : "Gagal generate ringkasan");
    } finally {
      setGenerating(false);
    }
  };

  const charCount = data.summary?.length || 0;
  const charLimit = 600;
  const charPercentage = (charCount / charLimit) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Ringkasan Profil</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Tuliskan ringkasan profesional yang menyoroti keahlian dan pencapaian Anda
        </p>
      </div>

      <Card className="p-4">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="summary">Ringkasan Profesional</Label>
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
              value={data.summary || ""}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Contoh: Frontend Developer dengan 5+ tahun pengalaman membangun aplikasi web modern menggunakan React, TypeScript, dan Next.js. Terbukti meningkatkan performa aplikasi hingga 40% dan mengurangi bug produksi sebesar 60%. Passionate dalam menciptakan user experience yang optimal dan code quality yang tinggi."
              className="mt-1.5 min-h-[200px]"
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

          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button
            onClick={handleAIGenerate}
            disabled={generating}
            className="w-full"
            variant="outline"
          >
            {generating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Bantu dengan AI
              </>
            )}
          </Button>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="mb-3 font-semibold">📝 Contoh Ringkasan Profesional</h3>
        <div className="space-y-3 text-sm">
          <div className="rounded-lg bg-muted p-3">
            <p className="font-medium text-foreground">✅ Baik (Spesifik & Terukur):</p>
            <p className="mt-1 text-muted-foreground italic">
              "Senior Backend Engineer dengan 7+ tahun pengalaman membangun sistem
              scalable untuk 10M+ users. Expert dalam microservices, Kubernetes, dan
              cloud architecture. Berhasil mengurangi latency API hingga 70% dan
              menghemat infrastruktur cost $200K/tahun."
            </p>
          </div>

          <div className="rounded-lg bg-destructive/5 p-3">
            <p className="font-medium text-destructive">❌ Kurang Baik (Generik):</p>
            <p className="mt-1 text-muted-foreground italic">
              "Saya adalah programmer yang berpengalaman dan memiliki skill yang baik.
              Saya bisa bekerja dalam tim dan individual. Saya passionate dengan
              teknologi."
            </p>
          </div>
        </div>
      </Card>

      <div className="rounded-lg bg-muted p-4 text-sm">
        <p className="font-medium">💡 Tips Ringkasan ATS-Friendly:</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
          <li>Mulai dengan role/title dan tahun pengalaman spesifik</li>
          <li>Sertakan teknologi/tools utama yang Anda kuasai</li>
          <li>Gunakan angka dan metrik untuk kuantifikasi pencapaian</li>
          <li>Hindari kata-kata klise seperti "hardworking", "passionate" tanpa bukti</li>
          <li>Fokus pada value yang bisa Anda berikan untuk perusahaan</li>
          <li>Maksimal 3-4 kalimat (150-200 kata optimal untuk ATS)</li>
        </ul>
      </div>
    </div>
  );
}
