import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Sparkles, Download, CheckCircle2, Globe2, ArrowRight, Zap, Copy, Edit3 } from "lucide-react";
import Link from "next/link";
import { NavbarDynamic } from "@/components/landing-v2/NavbarDynamic";
import { SimpleFooter } from "@/components/landing-v2/SimpleFooter";

export const metadata: Metadata = {
  title: "Email Generator — AI-Powered Bilingual | JobMate",
  description: "Generate email lamaran profesional dengan AI. Support Bahasa Indonesia & English. Professional template, export instant, history tersimpan.",
  keywords: ["email generator", "email lamaran", "job application email", "ai email generator", "professional email"],
};

export default function EmailGeneratorDetailPage() {
  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-brand selection:text-white">
      <NavbarDynamic />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 mb-4 px-4 py-1.5">
              <Sparkles className="h-3 w-3 mr-2" />
              AI-Powered Bilingual
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Email Generator <span className="text-purple-500">AI</span>
            </h1>
            
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              Buat email lamaran profesional dengan AI dalam Bahasa Indonesia & English. 
              Professional template, instant generate, history auto-save.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/tools/email-generator">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-8 h-12 gap-2 shadow-[0_0_20px_rgba(147,51,234,0.3)]">
                  <Mail className="h-5 w-5" />
                  Generate Email
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button size="lg" variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-full px-8 h-12 gap-2">
                  Lihat Contoh
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-neutral-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Fitur Unggulan</h2>
            <p className="text-neutral-400 text-lg">
              AI smart dengan support bilingual & template profesional
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: Globe2,
                title: "Bilingual Support",
                desc: "Generate email dalam Bahasa Indonesia atau English. Sesuaikan dengan target perusahaan.",
                color: "text-blue-400",
                bg: "bg-blue-500/10"
              },
              {
                icon: Sparkles,
                title: "AI-Powered",
                desc: "AI smart yang generate email profesional berdasarkan posisi, skill, dan background Anda.",
                color: "text-purple-400",
                bg: "bg-purple-500/10"
              },
              {
                icon: CheckCircle2,
                title: "Pro Templates",
                desc: "Template formal, semi-formal, dan casual. Pilih sesuai tone yang diinginkan.",
                color: "text-green-400",
                bg: "bg-green-500/10"
              },
              {
                icon: Edit3,
                title: "Customizable",
                desc: "Edit langsung subject line, body, signature. Preview real-time sebelum kirim.",
                color: "text-amber-400",
                bg: "bg-amber-500/10"
              },
              {
                icon: Copy,
                title: "Instant Copy",
                desc: "Copy to clipboard instant atau export ke .txt file untuk backup.",
                color: "text-red-400",
                bg: "bg-red-500/10"
              },
              {
                icon: Zap,
                title: "Auto-Save",
                desc: "Semua email generated tersimpan otomatis. Akses ulang kapan saja dari history.",
                color: "text-teal-400",
                bg: "bg-teal-500/10"
              }
            ].map((feature, i) => (
              <Card key={i} className="p-6 bg-neutral-900/50 border-white/5 hover:border-purple-500/30 transition-colors">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-full p-2 ${feature.bg}`}>
                      <feature.icon className={`h-5 w-5 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                  </div>
                  <p className="text-neutral-400 leading-relaxed pl-11">
                    {feature.desc}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-black relative">
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Kapan Pakai Email Generator?</h2>
            <p className="text-neutral-400 text-lg">
              Cover semua kebutuhan komunikasi profesionalmu
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              { icon: "📧", title: "Initial Application", desc: "Email lamaran pertama ke HRD. Formal & to the point." },
              { icon: "🔄", title: "Follow-Up Email", desc: "Follow up status lamaran setelah 1-2 minggu." },
              { icon: "🙏", title: "Thank You Email", desc: "Email terima kasih setelah interview selesai." },
              { icon: "✅", title: "Interview Confirmation", desc: "Konfirmasi kehadiran interview dengan professional." }
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl border border-white/10 bg-neutral-900/30 backdrop-blur-sm hover:bg-neutral-900/50 transition-all flex items-start gap-4">
                <div className="text-3xl">{item.icon}</div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-neutral-400">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-purple-600/5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto p-8 md:p-12 text-center rounded-3xl bg-gradient-to-br from-neutral-900 to-black border border-white/10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Siap Generate Email Profesional?
            </h2>
            <p className="text-lg text-neutral-400 mb-8 max-w-2xl mx-auto">
              AI-powered bilingual generator. Bahasa Indonesia & English support. 
              Professional templates & history auto-save!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tools/email-generator">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-8 h-12 gap-2 shadow-lg shadow-purple-600/20">
                  <Sparkles className="h-5 w-5" />
                  Generate Email Sekarang
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <SimpleFooter />
    </main>
  );
}
