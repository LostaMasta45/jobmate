import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Sparkles, Download, CheckCircle2, Palette, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Surat Lamaran Generator — 7+ Template Profesional | JobMate",
  description: "Buat surat lamaran kerja dengan 7+ template warna profesional. Format Indonesia, ATS-friendly, include foto. Export PDF & Word instant.",
  keywords: ["surat lamaran", "cover letter generator", "template surat lamaran", "surat lamaran indonesia", "template warna"],
};

export default function SuratLamaranDetailPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center space-y-6">
            <Badge variant="secondary" className="mb-2">
              <Palette className="h-3 w-3 mr-1" />
              7+ Template Warna Premium
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Surat Lamaran Generator
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Buat surat lamaran kerja format Indonesia dengan 7+ template warna profesional. 
              Include foto, ATS-friendly, langsung export PDF & Word.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/surat-lamaran">
                <Button size="lg" className="gap-2">
                  <FileText className="h-5 w-5" />
                  Buat Surat Lamaran
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button size="lg" variant="outline" className="gap-2">
                  Lihat Contoh Template
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
              Template premium dengan warna profesional & layout modern
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2">
                    <Palette className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold">7+ Template Warna</h3>
                </div>
                <p className="text-muted-foreground pl-11">
                  Royal Blue, Sunset Brown, Forest Green, Crimson Professional, Teal Modern, Deep Purple, dan ATS Standard (tanpa warna).
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Format Indonesia</h3>
                </div>
                <p className="text-muted-foreground pl-11">
                  Layout khusus format Indonesia dengan foto, header formal, dan struktur standar perusahaan lokal.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-green-100 dark:bg-green-900 p-2">
                    <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Include Foto Profil</h3>
                </div>
                <p className="text-muted-foreground pl-11">
                  Semua template mendukung foto profil profesional - sesuai standar lamaran Indonesia.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-2">
                    <Download className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Export PDF & Word</h3>
                </div>
                <p className="text-muted-foreground pl-11">
                  Download langsung dalam format PDF (siap kirim) atau DOCX (editable).
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-amber-100 dark:bg-amber-900 p-2">
                    <Zap className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Wizard Lengkap</h3>
                </div>
                <p className="text-muted-foreground pl-11">
                  Step-by-step: Data Pribadi → Pendidikan → Pengalaman → Info Perusahaan → Preview & Export.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-red-100 dark:bg-red-900 p-2">
                    <CheckCircle2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-xl font-semibold">ATS-Friendly</h3>
                </div>
                <p className="text-muted-foreground pl-11">
                  Struktur clean yang mudah dibaca sistem ATS. Plus template khusus ATS tanpa warna.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Template Showcase */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">7 Template Premium</h2>
            <p className="text-muted-foreground text-lg">
              Pilih template sesuai industri & preferensi warna Anda
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <Card className="p-6 border-2 border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🔵</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">T1: Royal Blue Classic</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Theme biru profesional dengan header tebal. Cocok untuk korporat, finance, consulting.
                  </p>
                  <Badge variant="secondary">Most Popular</Badge>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-2 border-orange-200 dark:border-orange-800">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🟤</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">T2: Sunset Brown Minimalist</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Tone hangat coklat dengan layout minimalis. Cocok untuk creative, marketing, design.
                  </p>
                  <Badge variant="outline">Creative</Badge>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-2 border-green-200 dark:border-green-800">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🟢</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">T3: Forest Green Fresh</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Hijau segar profesional. Cocok untuk sustainability, health, education.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-2 border-red-200 dark:border-red-800">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🔴</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">T4: Crimson Professional</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Merah profesional bold. Cocok untuk sales, leadership, executive roles.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-2 border-teal-200 dark:border-teal-800">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🔷</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">T5: Teal Modern Sleek</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Teal modern elegan. Cocok untuk tech, startup, digital industry.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-2 border-purple-200 dark:border-purple-800">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🟣</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">T6: Deep Purple Elegant</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Ungu dalam elegan. Cocok untuk luxury, hospitality, premium brands.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-2 col-span-full bg-muted/50">
              <div className="flex items-start gap-4">
                <div className="text-4xl">📄</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">T0: ATS Standard (Original)</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Format hitam-putih tanpa warna. Pure text ATS-friendly untuk sistem digital.
                  </p>
                  <Badge>ATS Optimized</Badge>
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
                    <h3 className="font-semibold text-lg mb-1">Pilih Template Warna</h3>
                    <p className="text-muted-foreground">
                      Pilih dari 7 template premium: Royal Blue, Sunset Brown, Forest Green, Crimson, Teal, Purple, atau ATS Standard.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="rounded-full bg-primary text-primary-foreground w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">Isi Form Wizard</h3>
                    <p className="text-muted-foreground">
                      Complete form step-by-step: Data Pribadi (include foto) → Pendidikan → Pengalaman → Info Perusahaan target.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="rounded-full bg-primary text-primary-foreground w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">Preview & Customize</h3>
                    <p className="text-muted-foreground">
                      Lihat preview real-time dengan template warna pilihan Anda. Edit sampai sempurna.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="rounded-full bg-primary text-primary-foreground w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    4
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">Download PDF atau Word</h3>
                    <p className="text-muted-foreground">
                      Export langsung ke PDF (siap kirim via email/portal) atau DOCX (bisa edit lagi di Word).
                    </p>
                  </div>
                </li>
              </ol>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto p-8 md:p-12 text-center bg-gradient-to-br from-primary/5 via-background to-primary/5 border-2">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Siap Buat Surat Lamaran Profesional?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              7+ template warna premium, format Indonesia dengan foto, langsung export PDF & Word. 
              Buat sekarang dalam 5 menit!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/surat-lamaran">
                <Button size="lg" className="gap-2">
                  <Sparkles className="h-5 w-5" />
                  Buat Surat Lamaran Sekarang
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
