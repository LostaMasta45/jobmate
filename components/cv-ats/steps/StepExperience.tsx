"use client";

import * as React from "react";
import { Resume, Experience } from "@/lib/schemas/cv-ats";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, Sparkles, Loader2, GripVertical } from "lucide-react";
import { nanoid } from "nanoid";
import { rewriteBulletsWithAI } from "@/actions/cv-ats";

interface StepExperienceProps {
  resume: Resume;
  setResume: (resume: Resume) => void;
}

export function StepExperience({ resume, setResume }: StepExperienceProps) {
  const [rewritingId, setRewritingId] = React.useState<string | null>(null);

  const addExperience = () => {
    const newExp: Experience = {
      id: nanoid(),
      title: "",
      company: "",
      city: "",
      region: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      bullets: [""],
    };
    setResume({
      ...resume,
      experiences: [...resume.experiences, newExp],
    });
  };

  const removeExperience = (id: string) => {
    if (confirm("Hapus pengalaman ini?")) {
      setResume({
        ...resume,
        experiences: resume.experiences.filter((exp) => exp.id !== id),
      });
    }
  };

  const updateExperience = (id: string, field: string, value: any) => {
    setResume({
      ...resume,
      experiences: resume.experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const addBullet = (expId: string) => {
    setResume({
      ...resume,
      experiences: resume.experiences.map((exp) =>
        exp.id === expId ? { ...exp, bullets: [...exp.bullets, ""] } : exp
      ),
    });
  };

  const removeBullet = (expId: string, bulletIdx: number) => {
    setResume({
      ...resume,
      experiences: resume.experiences.map((exp) =>
        exp.id === expId
          ? { ...exp, bullets: exp.bullets.filter((_, i) => i !== bulletIdx) }
          : exp
      ),
    });
  };

  const updateBullet = (expId: string, bulletIdx: number, value: string) => {
    setResume({
      ...resume,
      experiences: resume.experiences.map((exp) =>
        exp.id === expId
          ? {
              ...exp,
              bullets: exp.bullets.map((b, i) => (i === bulletIdx ? value : b)),
            }
          : exp
      ),
    });
  };

  const handleAIRewrite = async (expId: string) => {
    setRewritingId(expId);
    try {
      const experience = resume.experiences.find((exp) => exp.id === expId);
      if (!experience) return;

      const rewrittenBullets = await rewriteBulletsWithAI({
        title: experience.title,
        company: experience.company,
        bullets: experience.bullets,
      });

      setResume({
        ...resume,
        experiences: resume.experiences.map((exp) =>
          exp.id === expId ? { ...exp, bullets: rewrittenBullets } : exp
        ),
      });
    } catch (error) {
      alert("Gagal rewrite: " + (error as Error).message);
    } finally {
      setRewritingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Pengalaman Profesional</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Tambahkan pengalaman kerja Anda (urutkan dari yang terbaru)
          </p>
        </div>
        <Button onClick={addExperience} size="sm">
          <Plus className="mr-1 h-4 w-4" />
          Tambah
        </Button>
      </div>

      {resume.experiences.length === 0 && (
        <Card className="border-dashed p-12">
          <div className="text-center">
            <p className="text-muted-foreground">Belum ada pengalaman profesional</p>
            <Button onClick={addExperience} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Pengalaman Pertama
            </Button>
          </div>
        </Card>
      )}

      {resume.experiences.map((exp, idx) => (
        <Card key={exp.id} className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Pengalaman #{idx + 1}</h3>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeExperience(exp.id!)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Basic Info */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor={`title-${exp.id}`}>
                  Posisi <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={`title-${exp.id}`}
                  value={exp.title}
                  onChange={(e) => updateExperience(exp.id!, "title", e.target.value)}
                  placeholder="Frontend Developer"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor={`company-${exp.id}`}>
                  Perusahaan <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={`company-${exp.id}`}
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id!, "company", e.target.value)}
                  placeholder="PT. Teknologi Indonesia"
                  className="mt-1.5"
                />
              </div>
            </div>

            {/* Location */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor={`city-${exp.id}`}>Kota</Label>
                <Input
                  id={`city-${exp.id}`}
                  value={exp.city || ""}
                  onChange={(e) => updateExperience(exp.id!, "city", e.target.value)}
                  placeholder="Jakarta"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor={`region-${exp.id}`}>Provinsi/Negara</Label>
                <Input
                  id={`region-${exp.id}`}
                  value={exp.region || ""}
                  onChange={(e) => updateExperience(exp.id!, "region", e.target.value)}
                  placeholder="DKI Jakarta, Indonesia"
                  className="mt-1.5"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor={`startDate-${exp.id}`}>
                  Tanggal Mulai <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={`startDate-${exp.id}`}
                  type="month"
                  value={exp.startDate}
                  onChange={(e) =>
                    updateExperience(exp.id!, "startDate", e.target.value)
                  }
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor={`endDate-${exp.id}`}>Tanggal Selesai</Label>
                <Input
                  id={`endDate-${exp.id}`}
                  type="month"
                  value={exp.endDate || ""}
                  onChange={(e) => updateExperience(exp.id!, "endDate", e.target.value)}
                  disabled={exp.isCurrent}
                  className="mt-1.5"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={exp.isCurrent}
                    onChange={(e) =>
                      updateExperience(exp.id!, "isCurrent", e.target.checked)
                    }
                    className="h-4 w-4"
                  />
                  Posisi saat ini
                </label>
              </div>
            </div>

            {/* Bullets */}
            <div>
              <div className="flex items-center justify-between">
                <Label>
                  Tanggung Jawab & Pencapaian{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addBullet(exp.id!)}
                  className="text-xs"
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Tambah Poin
                </Button>
              </div>

              <div className="mt-2 space-y-2">
                {exp.bullets.map((bullet, bidx) => (
                  <div key={bidx} className="flex gap-2">
                    <Textarea
                      value={bullet}
                      onChange={(e) => updateBullet(exp.id!, bidx, e.target.value)}
                      placeholder="• Membangun fitur X yang meningkatkan conversion rate 25%"
                      className="min-h-[80px] resize-none"
                      rows={3}
                    />
                    {exp.bullets.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBullet(exp.id!, bidx)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* AI Rewrite Button */}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleAIRewrite(exp.id!)}
              disabled={rewritingId === exp.id || !exp.title || !exp.company}
            >
              {rewritingId === exp.id ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rewriting...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Tulis Ulang dengan AI
                </>
              )}
            </Button>
          </div>
        </Card>
      ))}

      {/* Tips */}
      <div className="rounded-lg bg-muted p-4 text-sm">
        <p className="font-medium">💡 Tips Bullet Points ATS-Friendly:</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
          <li>
            <strong>Gunakan formula STAR:</strong> Situation, Task, Action, Result
          </li>
          <li>
            <strong>Mulai dengan kata kerja aktif:</strong> Membangun, Meningkatkan,
            Mengoptimalkan, Mengurangi
          </li>
          <li>
            <strong>Kuantifikasi hasil:</strong> "Meningkatkan performa 40%" lebih baik
            dari "Meningkatkan performa"
          </li>
          <li>
            <strong>Maksimal 25 kata per bullet:</strong> ATS lebih suka bullet point
            yang concise
          </li>
          <li>
            <strong>Hindari kata ganti:</strong> Jangan gunakan "saya", "kami" - langsung
            ke action
          </li>
          <li>
            <strong>Urutkan by impact:</strong> Pencapaian paling impressive di atas
          </li>
        </ul>
      </div>

      {/* Examples */}
      <Card className="p-4">
        <h3 className="mb-3 font-semibold">📝 Contoh Bullet Points</h3>
        <div className="space-y-3 text-sm">
          <div className="rounded-lg bg-green-50 p-3 dark:bg-green-950">
            <p className="font-medium text-green-900 dark:text-green-100">
              ✅ Baik (Spesifik, Terukur, Aktif):
            </p>
            <ul className="mt-2 space-y-1 text-green-800 dark:text-green-200">
              <li>
                • Membangun microservices architecture yang menangani 5M requests/hari
                dengan 99.9% uptime
              </li>
              <li>
                • Mengoptimalkan database queries yang mengurangi load time dari 3.2s
                menjadi 0.8s (75% improvement)
              </li>
              <li>
                • Memimpin tim 4 engineers untuk deliver MVP dalam 3 bulan, 2 minggu
                lebih cepat dari timeline
              </li>
            </ul>
          </div>

          <div className="rounded-lg bg-red-50 p-3 dark:bg-red-950">
            <p className="font-medium text-red-900 dark:text-red-100">
              ❌ Kurang Baik (Generik, Tidak Terukur):
            </p>
            <ul className="mt-2 space-y-1 text-red-800 dark:text-red-200">
              <li>• Bertanggung jawab untuk mengembangkan aplikasi</li>
              <li>• Bekerja sama dengan tim untuk menyelesaikan project</li>
              <li>• Membantu perusahaan mencapai tujuan bisnis</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
