"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCVProfile } from "@/actions/tools";

export default function CVProfilePage() {
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    full_name: "",
    education: "",
    skills: "",
    target_job: "",
    tone: "formal",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { content } = await createCVProfile(formData);
      setResult(content);
    } catch (error) {
      alert("Gagal: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      alert("Berhasil disalin!");
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="CV Profile Generator"
        description="Buat ringkasan profil profesional untuk CV Anda"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Form Input</CardTitle>
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
                <Label htmlFor="education">Pendidikan *</Label>
                <Input
                  id="education"
                  placeholder="Contoh: S1 Teknik Informatika, Universitas ABC"
                  value={formData.education}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, education: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Keahlian Utama *</Label>
                <Input
                  id="skills"
                  placeholder="Contoh: Web Development, UI/UX Design, Project Management"
                  value={formData.skills}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, skills: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target_job">Target Pekerjaan *</Label>
                <Input
                  id="target_job"
                  placeholder="Contoh: Frontend Developer, Product Manager"
                  value={formData.target_job}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, target_job: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tone">Gaya Bahasa</Label>
                <select
                  id="tone"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.tone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, tone: e.target.value }))
                  }
                >
                  <option value="formal">Formal & Profesional</option>
                  <option value="casual">Santai namun Profesional</option>
                </select>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Generating..." : "Generate Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Hasil</CardTitle>
              {result && (
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  Copy
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                <div className="whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm">
                  {result}
                </div>
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    💡 Tips Penggunaan:
                  </p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-blue-800 dark:text-blue-200">
                    <li>Letakkan di bagian atas CV Anda</li>
                    <li>Sesuaikan dengan job description yang Anda apply</li>
                    <li>Jangan lebih dari 3-4 kalimat</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex h-96 items-center justify-center text-muted-foreground">
                Hasil akan muncul di sini
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
