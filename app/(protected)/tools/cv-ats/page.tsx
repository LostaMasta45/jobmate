"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { CVHistoryList } from "@/components/cv-ats/CVHistoryList";
import { CVWizard } from "@/components/cv-ats/CVWizard";
import { getAllResumes } from "@/actions/cv-ats";
import { Resume } from "@/lib/schemas/cv-ats";

export default function CVATSPage() {
  const [resumes, setResumes] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showWizard, setShowWizard] = React.useState(false);
  const [editingResume, setEditingResume] = React.useState<Resume | null>(null);

  const loadResumes = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllResumes();
      setResumes(data);
    } catch (error) {
      console.error("Failed to load resumes:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadResumes();
  }, [loadResumes]);

  const handleCreateNew = () => {
    setEditingResume(null);
    setShowWizard(true);
  };

  const handleEdit = (resume: Resume) => {
    setEditingResume(resume);
    setShowWizard(true);
  };

  const handleWizardClose = () => {
    setShowWizard(false);
    setEditingResume(null);
    loadResumes(); // Refresh list after wizard closes
  };

  // If wizard is open, show wizard fullscreen
  if (showWizard) {
    return <CVWizard initialResume={editingResume} onClose={handleWizardClose} />;
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="CV ATS Generator"
          description="Buat CV yang ATS-friendly dengan wizard 6-langkah dan AI-powered features"
        />

        {/* Create New Button */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">History CV Anda</h2>
            <p className="text-sm text-muted-foreground">
              {resumes.length} CV tersimpan
            </p>
          </div>
          <Button onClick={handleCreateNew} size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Buat CV Baru
          </Button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* History List */}
        {!loading && (
          <CVHistoryList
            resumes={resumes}
            onEdit={handleEdit}
            onRefresh={loadResumes}
          />
        )}
      </div>
    </AppShell>
  );
}

// OLD IMPLEMENTATION - REPLACED WITH WIZARD
/*
import * as React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { analyzeCV } from "@/actions/tools";

function CVATSPageOld() {
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<{
    ats_score: number;
    feedback: string[];
    suggestions: string[];
  } | null>(null);
  const [formData, setFormData] = React.useState({
    title: "",
    job_description: "",
    education: "",
    experience: "",
    skills: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const analysis = await analyzeCV(formData);
      setResult(analysis);
    } catch (error) {
      alert("Gagal: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <AppShell>
      <PageHeader
        title="CV ATS Optimizer"
        description="Analisa dan optimize resume Anda untuk ATS dengan AI"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Form Input</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Judul Resume *</Label>
                <Input
                  id="title"
                  placeholder="Contoh: Frontend Developer Resume"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="job_description">Job Description (Opsional)</Label>
                <textarea
                  id="job_description"
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Paste job description yang ingin Anda apply"
                  value={formData.job_description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, job_description: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">Pendidikan *</Label>
                <Input
                  id="education"
                  placeholder="Contoh: S1 Teknik Informatika"
                  value={formData.education}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, education: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Pengalaman Kerja *</Label>
                <textarea
                  id="experience"
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Frontend Developer di PT ABC (2020-2023)&#10;- Membangun aplikasi web dengan React&#10;- Meningkatkan performa aplikasi 40%"
                  value={formData.experience}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, experience: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills *</Label>
                <Input
                  id="skills"
                  placeholder="Contoh: JavaScript, React, TypeScript, Node.js"
                  value={formData.skills}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, skills: e.target.value }))
                  }
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Menganalisa..." : "Analisa ATS Score"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hasil Analisa</CardTitle>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">ATS Score</p>
                  <p className={`text-6xl font-bold ${getScoreColor(result.ats_score)}`}>
                    {result.ats_score}
                  </p>
                  <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full ${
                        result.ats_score >= 80
                          ? "bg-green-600"
                          : result.ats_score >= 60
                          ? "bg-yellow-600"
                          : "bg-red-600"
                      }`}
                      style={{ width: `${result.ats_score}%` }}
                    />
                  </div>
                </div>

                <div>
                  <p className="mb-3 font-semibold">Feedback & Saran:</p>
                  <ul className="space-y-2">
                    {result.feedback.map((item, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span className="text-brand">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg bg-muted p-4 text-sm">
                  <p className="font-medium">Tips:</p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                    <li>Gunakan kata kunci dari job description</li>
                    <li>Hindari tabel dan grafik kompleks</li>
                    <li>Format sederhana dengan bullet points</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex h-96 items-center justify-center text-muted-foreground">
                Hasil analisa akan muncul di sini
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
*/
