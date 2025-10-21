import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Sparkles, Download, CheckCircle2, Globe2, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Email Generator — AI-Powered Bilingual | JobMate",
  description: "Generate email lamaran profesional dengan AI. Support Bahasa Indonesia & English. Professional template, export instant, history tersimpan.",
  keywords: ["email generator", "email lamaran", "job application email", "ai email generator", "professional email"],
};

export default function EmailGeneratorDetailPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center space-y-6">
            <Badge variant="secondary" className="mb-2">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered Bilingual
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Email Generator
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Buat email lamaran profesional dengan AI dalam Bahasa Indonesia & English. 
              Professional template, instant generate, history auto-save.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/tools/email-generator">
                <Button size="lg" className="gap-2">
                  <Mail className="h-5 w-5" />
                  Generate Email Sekarang
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button size="lg" variant="outline" className="gap-2">
                  Lihat Contoh
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
              AI smart dengan support bilingual & template profesional
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2">
                    <Globe2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Bilingual Support</h3>
                </div>
                <p className="text-muted-foreground pl-11">
                  Generate email dalam Bahasa Indonesia atau English. Sesuaikan dengan target perusahaan.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">AI-Powered Generation</h3>
                </div>
                <p className="text-muted-foreground pl-11">
                  AI smart yang generate email profesional berdasarkan posisi, skill, dan background Anda.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-green-100 dark:bg-green-900 p-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Professional Templates</h3>
                </div>
                <p className="text-muted-foreground pl-11">
                  Template formal, semi-formal, dan casual. Pilih sesuai tone yang diinginkan.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-2">
                    <Mail className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Customizable Content</h3>
                </div>
                <p className="text-muted-foreground pl-11">
                  Edit langsung subject line, body, signature. Preview real-time sebelum kirim.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-amber-100 dark:bg-amber-900 p-2">
                    <Download className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Copy & Export</h3>
                </div>
                <p className="text-muted-foreground pl-11">
                  Copy to clipboard instant atau export ke .txt file untuk backup.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-red-100 dark:bg-red-900 p-2">
                    <Zap className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-xl font-semibold">History Auto-Save</h3>
                </div>
                <p className="text-muted-foreground pl-11">
                  Semua email generated tersimpan otomatis. Akses ulang kapan saja dari history.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Kapan Pakai Email Generator?</h2>
            <p className="text-muted-foreground text-lg">
              Support berbagai kebutuhan email profesional
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">📧</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">Initial Application Email</h3>
                  <p className="text-sm text-muted-foreground">
                    Email lamaran pertama ke HRD. Formal, professional, langsung to the point.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🔄</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">Follow-Up Email</h3>
                  <p className="text-sm text-muted-foreground">
                    Follow up status lamaran setelah 1-2 minggu. Polite reminder tanpa pushy.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🙏</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">Thank You Email</h3>
                  <p className="text-sm text-muted-foreground">
                    Email terima kasih setelah interview. Show appreciation & reaffirm interest.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">✅</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">Interview Confirmation</h3>
                  <p className="text-sm text-muted-foreground">
                    Konfirmasi kehadiran interview dengan professional & on-time.
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
                    <h3 className="font-semibold text-lg mb-1">Pilih Bahasa & Tone</h3>
                    <p className="text-muted-foreground">
                      Pilih Bahasa Indonesia atau English. Tentukan tone: Formal, Semi-Formal, atau Casual.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="rounded-full bg-primary text-primary-foreground w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">Isi Data Lamaran</h3>
                    <p className="text-muted-foreground">
                      Nama, posisi yang dilamar, perusahaan target, skills utama, dan background singkat.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="rounded-full bg-primary text-primary-foreground w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">AI Generate Email</h3>
                    <p className="text-muted-foreground">
                      Klik "Generate" → AI akan membuat email profesional dengan subject line, body, dan signature.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="rounded-full bg-primary text-primary-foreground w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    4
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">Edit & Copy</h3>
                    <p className="text-muted-foreground">
                      Edit jika perlu, lalu copy to clipboard atau export ke .txt. Email auto-saved ke history.
                    </p>
                  </div>
                </li>
              </ol>

              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200">
                <p className="text-sm flex items-start gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Pro Tip:</strong> Generate multiple versions dengan tone berbeda, lalu pilih yang paling sesuai dengan kultur perusahaan.
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
              Siap Generate Email Profesional?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              AI-powered bilingual generator. Bahasa Indonesia & English support. 
              Professional templates & history auto-save!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tools/email-generator">
                <Button size="lg" className="gap-2">
                  <Sparkles className="h-5 w-5" />
                  Generate Email Sekarang
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
