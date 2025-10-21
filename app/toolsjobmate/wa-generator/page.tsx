import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Sparkles, Zap, CheckCircle2, Copy, ArrowRight, RefreshCw } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "WhatsApp Generator — AI + Spintax Variations | JobMate",
  description: "Generate pesan WA profesional dengan AI. 7 tipe pesan, 4-6 variasi spintax, customizable tone. Perfect untuk follow-up & networking!",
  keywords: ["whatsapp generator", "wa lamaran", "pesan professional", "whatsapp follow up", "ai message generator"],
};

export default function WAGeneratorDetailPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center space-y-6">
            <Badge variant="secondary" className="mb-2">
              <Sparkles className="h-3 w-3 mr-1" />
              AI + Spintax Smart
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              WhatsApp Generator
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Generate pesan WA profesional dengan AI. 7 tipe pesan, 4-6 variasi spintax otomatis, 
              customizable tone & personality. Perfect untuk follow-up & networking!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/tools/wa-generator">
                <Button size="lg" className="gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Generate Pesan Sekarang
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

      {/* Key Stats */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">7</div>
              <p className="text-sm text-muted-foreground">Tipe Pesan</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">4-6</div>
              <p className="text-sm text-muted-foreground">Variasi Spintax</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">3</div>
              <p className="text-sm text-muted-foreground">Tone Style</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-amber-600 mb-1">∞</div>
              <p className="text-sm text-muted-foreground">Generate Unlimited</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Fitur Unggulan</h2>
            <p className="text-muted-foreground text-lg">
              AI smart dengan multiple variations & customizable tone
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-green-100 dark:bg-green-900 p-2">
                    <MessageCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold">7 Tipe Pesan</h3>
                </div>
                <p className="text-muted-foreground pl-11">
                  Initial Application, Follow-Up, Interview Confirmation, Thank You, Status Inquiry, Re-Application, Referral Request.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <RefreshCw className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">4-6 Variasi Spintax</h3>
                </div>
                <p className="text-muted-foreground pl-11">
                  AI generate 4-6 variasi berbeda untuk SATU pesan. Tidak monoton, lebih natural!
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-2">
                    <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Customizable Tone</h3>
                </div>
                <p className="text-muted-foreground pl-11">
                  Pilih tone: Formal, Semi-Formal, Casual. Personality: Professional, Friendly, Balanced.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold">AI Context-Aware</h3>
                </div>
                <p className="text-muted-foreground pl-11">
                  AI understand context: posisi, perusahaan, previous interaction, untuk generate pesan yang relevan.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-amber-100 dark:bg-amber-900 p-2">
                    <Copy className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-xl font-semibold">One-Click Copy</h3>
                </div>
                <p className="text-muted-foreground pl-11">
                  Copy to clipboard instant. Paste langsung ke WhatsApp Web atau mobile.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-red-100 dark:bg-red-900 p-2">
                    <Zap className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-xl font-semibold">History & Re-Generate</h3>
                </div>
                <p className="text-muted-foreground pl-11">
                  Semua pesan tersimpan di history. Re-generate variasi baru kapan saja.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Message Types */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">7 Tipe Pesan Profesional</h2>
            <p className="text-muted-foreground text-lg">
              Cover semua kebutuhan komunikasi job seeker
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">📝</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">1. Initial Application</h3>
                  <p className="text-sm text-muted-foreground">
                    Melamar pertama kali via WA. Formal introduction, lampirkan CV/portfolio.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🔄</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">2. Follow-Up</h3>
                  <p className="text-sm text-muted-foreground">
                    Tanya status lamaran setelah 1-2 minggu. Polite reminder tanpa pushy.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">✅</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">3. Interview Confirmation</h3>
                  <p className="text-sm text-muted-foreground">
                    Konfirmasi kehadiran interview + tanya detail (waktu, lokasi, dresscode).
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🙏</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">4. Thank You</h3>
                  <p className="text-sm text-muted-foreground">
                    Terima kasih pasca interview. Show appreciation & reaffirm interest.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">❓</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">5. Status Inquiry</h3>
                  <p className="text-sm text-muted-foreground">
                    Tanya hasil interview atau proses selanjutnya setelah menunggu reasonable time.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🔁</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">6. Re-Application</h3>
                  <p className="text-sm text-muted-foreground">
                    Apply ulang setelah rejected/expired. Reference previous application dengan growth story.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 col-span-full">
              <div className="flex items-start gap-4">
                <div className="text-3xl">👥</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">7. Referral Request</h3>
                  <p className="text-sm text-muted-foreground">
                    Minta referral ke employee atau koneksi. Professional networking message.
                  </p>
                </div>
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
                    <h3 className="font-semibold text-lg mb-1">Pilih Tipe Pesan</h3>
                    <p className="text-muted-foreground">
                      Pilih dari 7 tipe: Initial Application, Follow-Up, Interview Confirmation, dll.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="rounded-full bg-primary text-primary-foreground w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">Isi Context Data</h3>
                    <p className="text-muted-foreground">
                      Nama, posisi, perusahaan, HRD name, skills, previous interaction, dll. Semakin lengkap = semakin personal.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="rounded-full bg-primary text-primary-foreground w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">Customize Tone & Style</h3>
                    <p className="text-muted-foreground">
                      Pilih tone (Formal/Semi-Formal/Casual) dan personality (Professional/Friendly/Balanced).
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="rounded-full bg-primary text-primary-foreground w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    4
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">Generate & Pick Variation</h3>
                    <p className="text-muted-foreground">
                      AI generate 4-6 variasi. Pilih yang paling cocok, edit jika perlu, lalu copy to clipboard!
                    </p>
                  </div>
                </li>
              </ol>

              <div className="mt-8 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200">
                <p className="text-sm flex items-start gap-2">
                  <Sparkles className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Pro Tip:</strong> Generate multiple versions dan save ke history. Pakai variasi berbeda untuk setiap follow-up agar tidak terkesan copy-paste.
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
              Siap Generate Pesan WA Profesional?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              7 tipe pesan, 4-6 variasi spintax, customizable tone. 
              Perfect untuk follow-up & networking yang efektif!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tools/wa-generator">
                <Button size="lg" className="gap-2">
                  <Sparkles className="h-5 w-5" />
                  Generate Sekarang
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
