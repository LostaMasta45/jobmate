import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Sparkles, Download, CheckCircle2, Zap, ArrowRight, Save } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CV ATS Generator — Wizard 6 Langkah | JobMate",
  description: "Buat CV profesional ATS-friendly dengan wizard interaktif 6 langkah. Autosave, export PDF & DOCX. Format clean tanpa template warna.",
  keywords: ["cv ats generator", "buat cv online", "cv ats friendly", "cv generator indonesia", "cv wizard"],
};

export default function CVATSDetailPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center space-y-6">
            <Badge variant="secondary" className="mb-2">
              <Zap className="h-3 w-3 mr-1" />
              Wizard Interaktif 6 Langkah
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              CV ATS Generator
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Buat CV profesional ATS-friendly dengan wizard step-by-step. 
              Format clean, autosave otomatis, langsung export PDF & DOCX.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/tools/cv-ats">
                <Button size="lg" className="gap-2">
                  <FileText className="h-5 w-5" />
                  Buat CV Sekarang
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

      {/* Key Features */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Fitur Unggulan</h2>
            <p className="text-muted-foreground text-lg">
              Wizard interaktif dengan autosave & export instant
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2">
                    <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Wizard 6 Langkah</h3>
                </div>
                <p className="text-muted-foreground pl-11">
                  Step-by-step guided: Basics → Summary → Experience → Education → Skills → Review & Export.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Format ATS-Friendly</h3>
                </div>
                <p className="text-muted-foreground pl-11">
                  Format clean text tanpa warna berlebihan. Pure structure yang mudah dibaca sistem ATS.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-green-100 dark:bg-green-900 p-2">
                    <Save className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Autosave Setiap 3 Detik</h3>
                </div>
                <p className="text-muted-foreground pl-11">
                  Tidak perlu khawatir kehilangan data. Draft tersimpan otomatis di localStorage.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-2">
                    <Download className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Export PDF & DOCX</h3>
                </div>
                <p className="text-muted-foreground pl-11">
                  Download langsung dalam format PDF (siap kirim) atau DOCX (editable di Word).
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-amber-100 dark:bg-amber-900 p-2">
                    <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Preview Real-Time</h3>
                </div>
                <p className="text-muted-foreground pl-11">
                  Lihat hasil CV Anda di preview pane yang update otomatis saat Anda ketik.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-red-100 dark:bg-red-900 p-2">
                    <CheckCircle2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Edit & Re-Download</h3>
                </div>
                <p className="text-muted-foreground pl-11">
                  CV tersimpan di history. Bisa edit kapan saja & download ulang tanpa batas.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Wizard Steps */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">6 Langkah Mudah</h2>
            <p className="text-muted-foreground text-lg">
              Wizard guided yang memandu Anda dari awal sampai akhir
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="p-6 border-2">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-blue-600 text-white w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Basics</h3>
                  <p className="text-sm text-muted-foreground">
                    Nama, kontak, LinkedIn, portfolio. Data dasar yang wajib ada di CV.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-2">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-purple-600 text-white w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Summary</h3>
                  <p className="text-sm text-muted-foreground">
                    Professional summary singkat tentang background & objective karir Anda.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-2">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-green-600 text-white w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Experience</h3>
                  <p className="text-sm text-muted-foreground">
                    Daftar pengalaman kerja: posisi, perusahaan, durasi, responsibilities & achievements.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-2">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-amber-600 text-white w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Education</h3>
                  <p className="text-sm text-muted-foreground">
                    Riwayat pendidikan: universitas, jurusan, IPK, tahun lulus.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-2">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-red-600 text-white w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                  5
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Skills</h3>
                  <p className="text-sm text-muted-foreground">
                    Technical skills, tools, languages, certifications yang relevan.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-2">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-teal-600 text-white w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                  6
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Review & Export</h3>
                  <p className="text-sm text-muted-foreground">
                    Preview full CV, edit jika perlu, lalu download PDF atau DOCX.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-muted/30">
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
                    <h3 className="font-semibold text-lg mb-1">Mulai Wizard</h3>
                    <p className="text-muted-foreground">
                      Klik "Buat CV Baru" → Wizard akan memandu Anda step-by-step dari Step 1 sampai 6.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="rounded-full bg-primary text-primary-foreground w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">Isi Form Setiap Step</h3>
                    <p className="text-muted-foreground">
                      Lengkapi form di setiap step. Autosave akan menyimpan progress Anda setiap 3 detik.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="rounded-full bg-primary text-primary-foreground w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">Preview Real-Time</h3>
                    <p className="text-muted-foreground">
                      Lihat preview CV Anda di panel kanan yang update otomatis saat Anda ketik.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="rounded-full bg-primary text-primary-foreground w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    4
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">Export PDF atau DOCX</h3>
                    <p className="text-muted-foreground">
                      Setelah step 6, klik "Download PDF" (siap kirim) atau "Download DOCX" (editable).
                    </p>
                  </div>
                </li>
              </ol>

              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200">
                <p className="text-sm flex items-start gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Pro Tip:</strong> CV tersimpan otomatis ke history. Anda bisa edit & download ulang kapan saja tanpa batas.
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
              Siap Buat CV Profesional?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Wizard 6 langkah, autosave otomatis, export PDF & DOCX instant. 
              Buat sekarang dalam 10 menit!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tools/cv-ats">
                <Button size="lg" className="gap-2">
                  <Sparkles className="h-5 w-5" />
                  Buat CV Sekarang
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
