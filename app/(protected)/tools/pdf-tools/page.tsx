"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Scissors, Minimize2, RefreshCw, Image, RotateCw } from "lucide-react";

export default function PDFToolsPage() {
  const [selectedTool, setSelectedTool] = React.useState<string | null>(null);
  const [files, setFiles] = React.useState<FileList | null>(null);
  const [loading, setLoading] = React.useState(false);

  const tools = [
    {
      id: "merge",
      title: "Gabung PDF",
      description: "Gabungkan beberapa file PDF menjadi satu",
      icon: FileText,
    },
    {
      id: "split",
      title: "Pisah PDF",
      description: "Pisahkan halaman PDF menjadi file terpisah",
      icon: Scissors,
    },
    {
      id: "compress",
      title: "Kompres PDF",
      description: "Kurangi ukuran file PDF tanpa kehilangan kualitas",
      icon: Minimize2,
    },
    {
      id: "convert",
      title: "Convert ke PDF",
      description: "Convert Word, Excel, atau PowerPoint ke PDF",
      icon: RefreshCw,
    },
    {
      id: "image-to-pdf",
      title: "Image ke PDF",
      description: "Convert gambar (JPG, PNG) menjadi PDF",
      icon: Image,
    },
    {
      id: "rotate",
      title: "Rotasi PDF",
      description: "Putar halaman PDF 90°, 180°, atau 270°",
      icon: RotateCw,
    },
  ];

  const handleProcess = async () => {
    if (!files || !selectedTool) return;

    setLoading(true);
    try {
      // TODO: Implement iLovePDF API integration
      alert("Fitur ini akan segera tersedia dengan integrasi iLovePDF API");
    } catch (error) {
      alert("Gagal: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="PDF Tools"
        description="Alat lengkap untuk manipulasi file PDF"
      />

      <div className="space-y-6">
        {!selectedTool ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <Card
                key={tool.id}
                className="cursor-pointer transition-all hover:shadow-md"
                onClick={() => setSelectedTool(tool.id)}
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand/10">
                    <tool.icon className="h-6 w-6 text-brand" />
                  </div>
                  <h3 className="mb-2 font-semibold">{tool.title}</h3>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedTool(null);
                setFiles(null);
              }}
            >
              ← Kembali
            </Button>

            <Card>
              <CardHeader>
                <CardTitle>
                  {tools.find((t) => t.id === selectedTool)?.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="files">Upload File(s)</Label>
                  <Input
                    id="files"
                    type="file"
                    multiple={selectedTool === "merge"}
                    accept={
                      selectedTool === "image-to-pdf"
                        ? "image/*"
                        : selectedTool === "convert"
                        ? ".doc,.docx,.xls,.xlsx,.ppt,.pptx"
                        : "application/pdf"
                    }
                    onChange={(e) => setFiles(e.target.files)}
                  />
                  <p className="text-xs text-muted-foreground">
                    {selectedTool === "merge"
                      ? "Pilih 2 atau lebih file PDF"
                      : selectedTool === "image-to-pdf"
                      ? "Pilih file gambar (JPG, PNG, dll)"
                      : selectedTool === "convert"
                      ? "Pilih file Word, Excel, atau PowerPoint"
                      : "Pilih 1 file PDF"}
                  </p>
                </div>

                {selectedTool === "rotate" && (
                  <div className="space-y-2">
                    <Label>Sudut Rotasi</Label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        90°
                      </Button>
                      <Button variant="outline" size="sm">
                        180°
                      </Button>
                      <Button variant="outline" size="sm">
                        270°
                      </Button>
                    </div>
                  </div>
                )}

                {selectedTool === "split" && (
                  <div className="space-y-2">
                    <Label htmlFor="pages">Halaman yang Ingin Dipisah</Label>
                    <Input
                      id="pages"
                      placeholder="Contoh: 1-3, 5, 7-9"
                    />
                    <p className="text-xs text-muted-foreground">
                      Gunakan format: 1-3 (range) atau 1,2,3 (individual)
                    </p>
                  </div>
                )}

                {files && (
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm font-medium">File yang dipilih:</p>
                    <ul className="mt-2 space-y-1">
                      {Array.from(files).map((file, i) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          • {file.name} ({(file.size / 1024).toFixed(2)} KB)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button
                  onClick={handleProcess}
                  disabled={!files || loading}
                  className="w-full"
                >
                  {loading ? "Memproses..." : "Proses PDF"}
                </Button>

                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-950">
                  <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                    🔒 Keamanan & Privacy
                  </p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-yellow-800 dark:text-yellow-200">
                    <li>File diproses dengan enkripsi SSL</li>
                    <li>File otomatis dihapus setelah 1 jam</li>
                    <li>Tidak ada penyimpanan permanen</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  );
}
