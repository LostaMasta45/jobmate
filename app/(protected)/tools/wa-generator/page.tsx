"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createWAMessage } from "@/actions/tools";

export default function WAGeneratorPage() {
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    full_name: "",
    position: "",
    company: "",
    tone: "formal",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { content } = await createWAMessage(formData);
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

  const handleSendWA = () => {
    if (result) {
      const encodedMessage = encodeURIComponent(result);
      window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="WhatsApp Message Generator"
        description="Buat pesan WhatsApp untuk melamar kerja dengan spintax AI"
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
                  placeholder="Contoh: Frontend Developer"
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
                <Label htmlFor="tone">Gaya Bahasa</Label>
                <select
                  id="tone"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.tone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, tone: e.target.value }))
                  }
                >
                  <option value="formal">Formal & Sopan</option>
                  <option value="casual">Ramah & Profesional</option>
                </select>
              </div>

              <div className="rounded-lg bg-muted p-4 text-sm">
                <p className="font-medium">Apa itu Spintax?</p>
                <p className="mt-2 text-muted-foreground">
                  Spintax adalah variasi kata otomatis seperti {"{Halo|Selamat pagi|Assalamu'alaikum}"} 
                  untuk membuat pesan lebih natural dan tidak terdeteksi sebagai template.
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Generating..." : "Generate Pesan WA"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Hasil</CardTitle>
              {result && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    Copy
                  </Button>
                  <Button variant="default" size="sm" onClick={handleSendWA}>
                    Kirim via WA
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                <div className="whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm">
                  {result}
                </div>

                <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">
                    💡 Tips Mengirim WA:
                  </p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-green-800 dark:text-green-200">
                    <li>Kirim di jam kerja (09:00-16:00)</li>
                    <li>Tunggu balasan sebelum follow-up</li>
                    <li>Gunakan nomor pribadi, bukan nomor bisnis</li>
                    <li>Jangan spam ke banyak perusahaan sekaligus</li>
                  </ul>
                </div>

                <div className="text-xs text-muted-foreground">
                  <p className="font-medium">Cara menggunakan spintax:</p>
                  <p className="mt-1">
                    Pilih salah satu varian dari kurung kurawal, contoh:{" "}
                    {"{Halo|Selamat pagi}"} → pilih &quot;Halo&quot; atau &quot;Selamat pagi&quot;
                  </p>
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
