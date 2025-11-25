import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Sparkles, Zap, CheckCircle2, Copy, ArrowRight, RefreshCw, Repeat } from "lucide-react";
import Link from "next/link";
import { NavbarDynamic } from "@/components/landing-v2/NavbarDynamic";
import { SimpleFooter } from "@/components/landing-v2/SimpleFooter";

export const metadata: Metadata = {
  title: "WhatsApp Generator — AI + Spintax Variations | JobMate",
  description: "Generate pesan WA profesional dengan AI. 7 tipe pesan, 4-6 variasi spintax, customizable tone. Perfect untuk follow-up & networking!",
  keywords: ["whatsapp generator", "wa lamaran", "pesan professional", "whatsapp follow up", "ai message generator"],
};

export default function WAGeneratorDetailPage() {
  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-brand selection:text-white">
      <NavbarDynamic />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-green-600/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="bg-green-500/10 text-green-400 border-green-500/20 mb-4 px-4 py-1.5">
              <Sparkles className="h-3 w-3 mr-2" />
              AI + Spintax Smart
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              WhatsApp Generator <span className="text-green-500">AI</span>
            </h1>
            
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              Generate pesan WA profesional dengan AI. 7 tipe pesan, 4-6 variasi spintax otomatis, 
              customizable tone & personality. Perfect untuk follow-up & networking!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/tools/wa-generator">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8 h-12 gap-2 shadow-[0_0_20px_rgba(22,163,74,0.3)]">
                  <MessageCircle className="h-5 w-5" />
                  Generate Pesan
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

      {/* Stats Grid */}
      <section className="py-12 border-y border-white/5 bg-white/[0.02]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            {[
              { val: "7", label: "Tipe Pesan", color: "text-green-500" },
              { val: "4-6", label: "Variasi Spintax", color: "text-purple-500" },
              { val: "3", label: "Tone Style", color: "text-blue-500" },
              { val: "∞", label: "Unlimited", color: "text-amber-500" }
            ].map((stat, i) => (
              <div key={i}>
                <div className={`text-4xl font-bold mb-2 ${stat.color}`}>{stat.val}</div>
                <p className="text-sm text-neutral-500 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-neutral-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Fitur Unggulan</h2>
            <p className="text-neutral-400 text-lg">
              AI smart dengan multiple variations & customizable tone
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: MessageCircle,
                title: "7 Tipe Pesan",
                desc: "Initial Application, Follow-Up, Interview Confirmation, Thank You, dll.",
                color: "text-green-400",
                bg: "bg-green-500/10"
              },
              {
                icon: Repeat,
                title: "Spintax Variations",
                desc: "AI generate 4-6 variasi berbeda untuk SATU pesan. Tidak monoton, lebih natural!",
                color: "text-purple-400",
                bg: "bg-purple-500/10"
              },
              {
                icon: Sparkles,
                title: "Custom Tone",
                desc: "Pilih tone: Formal, Semi-Formal, Casual. Personality: Professional, Friendly.",
                color: "text-blue-400",
                bg: "bg-blue-500/10"
              },
              {
                icon: CheckCircle2,
                title: "Context-Aware",
                desc: "AI understand context: posisi, perusahaan, untuk generate pesan yang relevan.",
                color: "text-amber-400",
                bg: "bg-amber-500/10"
              },
              {
                icon: Copy,
                title: "One-Click Copy",
                desc: "Copy to clipboard instant. Paste langsung ke WhatsApp Web atau mobile.",
                color: "text-red-400",
                bg: "bg-red-500/10"
              },
              {
                icon: RefreshCw,
                title: "History & Re-Gen",
                desc: "Semua pesan tersimpan di history. Re-generate variasi baru kapan saja.",
                color: "text-teal-400",
                bg: "bg-teal-500/10"
              }
            ].map((feature, i) => (
              <Card key={i} className="p-6 bg-neutral-900/50 border-white/5 hover:border-green-500/30 transition-colors">
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

      {/* Message Types */}
      <section className="py-20 bg-black relative">
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">7 Tipe Pesan Profesional</h2>
            <p className="text-neutral-400 text-lg">
              Cover semua kebutuhan komunikasi job seeker
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              { icon: "📝", title: "Initial Application", desc: "Melamar pertama kali via WA. Formal introduction." },
              { icon: "🔄", title: "Follow-Up", desc: "Tanya status lamaran setelah 1-2 minggu." },
              { icon: "✅", title: "Interview Confirmation", desc: "Konfirmasi kehadiran interview + tanya detail." },
              { icon: "🙏", title: "Thank You", desc: "Terima kasih pasca interview. Show appreciation." },
              { icon: "❓", title: "Status Inquiry", desc: "Tanya hasil interview setelah menunggu." },
              { icon: "🔁", title: "Re-Application", desc: "Apply ulang setelah rejected/expired." },
              { icon: "👥", title: "Referral Request", desc: "Minta referral ke koneksi. Networking." }
            ].map((item, i) => (
              <div key={i} className={`p-6 rounded-2xl border border-white/10 bg-neutral-900/30 backdrop-blur-sm hover:bg-neutral-900/50 transition-all flex items-start gap-4 ${i === 6 ? 'md:col-span-2' : ''}`}>
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
        <div className="absolute inset-0 bg-green-600/5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto p-8 md:p-12 text-center rounded-3xl bg-gradient-to-br from-neutral-900 to-black border border-white/10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Siap Generate Pesan WA?
            </h2>
            <p className="text-lg text-neutral-400 mb-8 max-w-2xl mx-auto">
              7 tipe pesan, 4-6 variasi spintax, customizable tone. 
              Perfect untuk follow-up & networking yang efektif!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tools/wa-generator">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8 h-12 gap-2 shadow-lg shadow-green-600/20">
                  <Sparkles className="h-5 w-5" />
                  Generate Sekarang
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
