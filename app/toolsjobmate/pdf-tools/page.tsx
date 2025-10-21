import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Minimize2, FileImage, Sparkles, CheckCircle2, Shield, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PDF Tools — Merge, Compress, Convert | JobMate",
  description: "3 tools PDF essential: Merge (gabung CV+Portfolio), Compress (meet job portal limit), Convert (Word/Image to PDF). Auto-delete after 7 days.",
  keywords: ["pdf tools", "merge pdf", "compress pdf", "convert to pdf", "pdf job seeker", "gabung pdf online"],
};

export default function PDFToolsDetailPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center space-y-6">
            <Badge variant="secondary" className="mb-2">
              <Zap className="h-3 w-3 mr-1" />
              3 Tools in 1
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              PDF Tools
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              3 tools PDF essential untuk job seeker: Merge (gabung CV+Portfolio), 
              Compress (meet job portal limit), Convert (Word/Image to PDF). File aman, auto-delete 7 hari.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/tools/pdf-tools">
                <Button size="lg" className="gap-2">
                  <FileText className="h-5 w-5" />
                  Gunakan PDF Tools
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button size="lg" variant="outline" className="gap-2">
                  Lihat Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Main Tools */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">3 Tools Essential</h2>
            <p className="text-muted-foreground text-lg">
              Solve semua kebutuhan PDF untuk job application
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="p-6 border-2 border-blue-200 dark:border-blue-800">
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-4">
                    <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Merge PDF</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Gabung multiple PDFs jadi 1 file profesional
                  </p>
                  <Badge variant="secondary">Most Used</Badge>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Gabung CV + Portfolio + Sertifikat</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Unlimited files, drag & drop order</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Jadi 1 PDF profesional siap kirim</span>
                  </li>
                </ul>
              </div>
            </Card>

            <Card className="p-6 border-2 border-purple-200 dark:border-purple-800">
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-4">
                    <Minimize2 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Compress PDF</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Kompres file untuk meet job portal limit
                  </p>
                  <Badge variant="secondary">Max 2MB</Badge>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Reduce size 50-80% tanpa quality loss</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Perfect untuk job portal limit 2MB</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Tetap readable & professional</span>
                  </li>
                </ul>
              </div>
            </Card>

            <Card className="p-6 border-2 border-amber-200 dark:border-amber-800">
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="rounded-full bg-amber-100 dark:bg-amber-900 p-4">
                    <FileImage className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Convert to PDF</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Convert Word/Image ke PDF format
                  </p>
                  <Badge variant="secondary">Universal</Badge>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Word/DOCX to PDF conversion</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Image (JPG/PNG) to PDF</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Best quality, formatting preserved</span>
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Perfect Untuk Job Seeker</h2>
            <p className="text-muted-foreground text-lg">
              Real scenarios yang sering dialami saat apply kerja
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">📁</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">Scenario 1: Gabung Dokumen</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    HRD minta: "Kirim 1 PDF yang berisi CV, portfolio, dan sertifikat"
                  </p>
                  <div className="text-xs bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                    <strong>Solution:</strong> Use Merge PDF → Upload semua file → Drag & drop urutan → Download 1 PDF complete!
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">⚡</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">Scenario 2: File Terlalu Besar</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Job portal limit 2MB, tapi CV+Portfolio Anda 5MB
                  </p>
                  <div className="text-xs bg-purple-50 dark:bg-purple-950/20 p-3 rounded-lg">
                    <strong>Solution:</strong> Use Compress PDF → Upload file 5MB → Kompres 70% → Jadi 1.5MB (under limit)!
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🔄</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">Scenario 3: Format Salah</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Portal hanya accept PDF, tapi CV Anda .docx atau .jpg
                  </p>
                  <div className="text-xs bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg">
                    <strong>Solution:</strong> Use Convert to PDF → Upload Word/Image → Instant convert → Download PDF professional!
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🎯</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">Scenario 4: Paket Lengkap</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Apply startup, kirim 1 PDF: CV (Word) + 3 project screenshot (JPG) + sertifikat (PDF)
                  </p>
                  <div className="text-xs bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
                    <strong>Solution:</strong> Convert all to PDF → Merge jadi 1 → Compress jika {'>'} 2MB → Perfect submission!
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features & Security */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Fitur & Keamanan</h2>
            <p className="text-muted-foreground text-lg">
              Fast, secure, dan user-friendly
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2">
                    <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Instant Processing</h3>
                </div>
                <p className="text-muted-foreground pl-11">
                  Merge, compress, convert dalam hitungan detik. Tidak perlu waiting time lama.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-green-100 dark:bg-green-900 p-2">
                    <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Auto-Delete 7 Hari</h3>
                </div>
                <p className="text-muted-foreground pl-11">
                  File Anda aman & privacy terjaga. Auto-delete dari server setelah 7 hari.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-2">
                    <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Best Quality</h3>
                </div>
                <p className="text-muted-foreground pl-11">
                  Compression smart yang balance antara size reduction & quality preservation.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-amber-100 dark:bg-amber-900 p-2">
                    <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Unlimited Usage</h3>
                </div>
                <p className="text-muted-foreground pl-11">
                  Merge, compress, convert sebanyak yang Anda mau. Tidak ada limit harian.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-red-100 dark:bg-red-900 p-2">
                    <Sparkles className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-xl font-semibold">History Tersimpan</h3>
                </div>
                <p className="text-muted-foreground pl-11">
                  Semua operasi tersimpan di history. Re-download file kapan saja dalam 7 hari.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-teal-100 dark:bg-teal-900 p-2">
                    <FileImage className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Multiple Formats</h3>
                </div>
                <p className="text-muted-foreground pl-11">
                  Support: PDF, DOCX, DOC, JPG, JPEG, PNG, GIF. Cover semua kebutuhan.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Cara Menggunakan
            </h2>

            <Card className="p-8">
              <ol className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="rounded-full bg-primary text-primary-foreground w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">Pilih Tool</h3>
                    <p className="text-muted-foreground">
                      Pilih tab: Merge PDF (gabung), Compress (kompres), atau Convert (ubah format).
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="rounded-full bg-primary text-primary-foreground w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">Upload File</h3>
                    <p className="text-muted-foreground">
                      Drag & drop file atau click to browse. Multiple files OK untuk Merge.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="rounded-full bg-primary text-primary-foreground w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">Process & Preview</h3>
                    <p className="text-muted-foreground">
                      Tool akan process instant. Preview result sebelum download.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="rounded-full bg-primary text-primary-foreground w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    4
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">Download Result</h3>
                    <p className="text-muted-foreground">
                      Download PDF hasil. File tersimpan di history (auto-delete after 7 days).
                    </p>
                  </div>
                </li>
              </ol>

              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200">
                <p className="text-sm flex items-start gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Pro Tip:</strong> Combine tools! Convert Word to PDF → Merge dengan portfolio PDFs → Compress jika {'>'} 2MB. Perfect submission!
                  </span>
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto p-8 md:p-12 text-center bg-gradient-to-br from-primary/5 via-background to-primary/5 border-2">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Siap Manage PDF Dokumen?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              3 tools in 1: Merge, Compress, Convert. 
              Fast, secure, unlimited usage. Auto-delete 7 hari!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tools/pdf-tools">
                <Button size="lg" className="gap-2">
                  <Sparkles className="h-5 w-5" />
                  Gunakan PDF Tools
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button size="lg" variant="outline">
                  Login untuk Mulai
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
