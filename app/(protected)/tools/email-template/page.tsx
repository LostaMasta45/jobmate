"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { MobileToolHeader } from "@/components/tools/MobileToolHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createEmailTemplate } from "@/actions/tools";

export default function EmailTemplatePage() {
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<{
    subject: string;
    body: string;
  } | null>(null);
  const [formData, setFormData] = React.useState({
    full_name: "",
    position: "",
    company: "",
    source: "",
    skills: "",
    tone: "formal",
    attach_cv: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await createEmailTemplate(formData);
      setResult(response);
    } catch (error) {
      alert("Gagal: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Berhasil disalin!");
  };

  return (
    <AppShell>
      <MobileToolHeader
        title="Email Template"
        description="Template email lamaran"
      />
      
      <div className="space-y-6">
        <PageHeader
          title="Email Template Generator"
          description="Buat email lamaran kerja profesional dengan AI"
          hideOnMobile
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
                <Label htmlFor="source">Sumber Lowongan *</Label>
                <Input
                  id="source"
                  placeholder="Contoh: LinkedIn, JobStreet, Website perusahaan"
                  value={formData.source}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, source: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Keahlian Utama *</Label>
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
                <Label htmlFor="tone">Gaya Bahasa</Label>
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
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="attach_cv"
                  checked={formData.attach_cv}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, attach_cv: e.target.checked }))
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="attach_cv" className="font-normal">
                  Melampirkan CV dan dokumen pendukung
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Generating..." : "Generate Email"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hasil</CardTitle>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <Label>Subject:</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(result.subject)}
                    >
                      Copy
                    </Button>
                  </div>
                  <div className="rounded-lg bg-muted p-3 text-sm font-medium">
                    {result.subject}
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <Label>Body:</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(result.body)}
                    >
                      Copy
                    </Button>
                  </div>
                  <div className="max-h-96 overflow-y-auto whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm">
                    {result.body}
                  </div>
                </div>

                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    💡 Tips:
                  </p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-blue-800 dark:text-blue-200">
                    <li>Kirim email di pagi hari (08:00-10:00)</li>
                    <li>Double-check nama HRD jika ada</li>
                    <li>Attachment CV dalam format PDF</li>
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
      </div>
    </AppShell>
  );
}
