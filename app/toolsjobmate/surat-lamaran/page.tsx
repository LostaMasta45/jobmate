import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Sparkles, Download, CheckCircle2, Palette, ArrowRight, Zap, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { NavbarDynamic } from "@/components/landing-v2/NavbarDynamic";
import { SimpleFooter } from "@/components/landing-v2/SimpleFooter";

export const metadata: Metadata = {
  title: "Surat Lamaran Generator — 7+ Template Profesional | JobMate",
  description: "Buat surat lamaran kerja dengan 7+ template warna profesional. Format Indonesia, ATS-friendly, include foto. Export PDF & Word instant.",
  keywords: ["surat lamaran", "cover letter generator", "template surat lamaran", "surat lamaran indonesia", "template warna"],
};

export default function SuratLamaranDetailPage() {
  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-brand selection:text-white">
      <NavbarDynamic />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-orange-600/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20 mb-4 px-4 py-1.5">
              <Palette className="h-3 w-3 mr-2" />
              7+ Template Warna Premium
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Surat Lamaran Generator
            </h1>
            
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              Buat surat lamaran kerja format Indonesia dengan 7+ template warna profesional. 
              Include foto, ATS-friendly, langsung export PDF & Word.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/surat-lamaran">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-8 h-12 gap-2 shadow-[0_0_20px_rgba(234,88,12,0.3)]">
                  <FileText className="h-5 w-5" />
                  Buat Surat Lamaran
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button size="lg" variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-full px-8 h-12 gap-2">
                  Lihat Template
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
              Template premium dengan warna profesional & layout modern
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: Palette,
                title: "7+ Template Warna",
                desc: "Royal Blue, Sunset Brown, Forest Green, Crimson, Teal, Purple, dan ATS Standard.",
                color: "text-blue-400",
                bg: "bg-blue-500/10"
              },
              {
                icon: FileText,
                title: "Format Indonesia",
                desc: "Layout khusus format Indonesia dengan header formal dan struktur standar lokal.",
                color: "text-orange-400",
                bg: "bg-orange-500/10"
              },
              {
                icon: ImageIcon,
                title: "Include Foto",
                desc: "Semua template mendukung foto profil profesional - sesuai standar lamaran Indonesia.",
                color: "text-green-400",
                bg: "bg-green-500/10"
              },
              {
                icon: Download,
                title: "Export PDF & Word",
                desc: "Download langsung dalam format PDF (siap kirim) atau DOCX (editable).",
                color: "text-purple-400",
                bg: "bg-purple-500/10"
              },
              {
                icon: Zap,
                title: "Wizard Lengkap",
                desc: "Step-by-step: Data Pribadi → Pendidikan → Pengalaman → Info Perusahaan → Export.",
                color: "text-amber-400",
                bg: "bg-amber-500/10"
              },
              {
                icon: CheckCircle2,
                title: "ATS-Friendly",
                desc: "Struktur clean yang mudah dibaca sistem ATS. Plus template khusus ATS tanpa warna.",
                color: "text-red-400",
                bg: "bg-red-500/10"
              }
            ].map((feature, i) => (
              <Card key={i} className="p-6 bg-neutral-900/50 border-white/5 hover:border-orange-500/30 transition-colors">
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

      {/* Template Showcase */}
      <section className="py-20 bg-black relative">
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">7 Template Premium</h2>
            <p className="text-neutral-400 text-lg">
              Pilih template sesuai industri & preferensi warna Anda
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              { icon: "🔵", title: "Royal Blue Classic", desc: "Profesional, korporat, finance.", tag: "Most Popular" },
              { icon: "🟤", title: "Sunset Brown", desc: "Minimalis, creative, warm tone.", tag: "Creative" },
              { icon: "🟢", title: "Forest Green", desc: "Segar, health, education, sustainability.", tag: "Fresh" },
              { icon: "🔴", title: "Crimson Red", desc: "Bold, sales, leadership, executive.", tag: "Bold" },
              { icon: "🔷", title: "Teal Modern", desc: "Modern, tech, startup, digital.", tag: "Modern" },
              { icon: "🟣", title: "Deep Purple", desc: "Elegant, luxury, hospitality.", tag: "Elegant" }
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl border border-white/10 bg-neutral-900/30 backdrop-blur-sm hover:bg-neutral-900/50 transition-all flex items-start gap-4">
                <div className="text-4xl">{item.icon}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                     <h3 className="text-lg font-bold text-white">{item.title}</h3>
                     <Badge variant="outline" className="text-xs border-white/20 text-neutral-400">{item.tag}</Badge>
                  </div>
                  <p className="text-sm text-neutral-400">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
            
            {/* ATS Special Card */}
            <div className="p-6 rounded-2xl border border-white/10 bg-neutral-800/30 backdrop-blur-sm col-span-full flex items-start gap-4">
                <div className="text-4xl">📄</div>
                <div className="flex-1">
                   <div className="flex justify-between items-center mb-1">
                     <h3 className="text-lg font-bold text-white">ATS Standard (Original)</h3>
                     <Badge className="bg-white text-black">ATS Optimized</Badge>
                   </div>
                   <p className="text-sm text-neutral-400">
                    Format hitam-putih tanpa warna. Pure text structure, sangat aman untuk sistem ATS.
                   </p>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-orange-600/5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto p-8 md:p-12 text-center rounded-3xl bg-gradient-to-br from-neutral-900 to-black border border-white/10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Siap Buat Surat Lamaran?
            </h2>
            <p className="text-lg text-neutral-400 mb-8 max-w-2xl mx-auto">
              7+ template warna premium, format Indonesia dengan foto, langsung export PDF & Word. 
              Buat sekarang dalam 5 menit!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/surat-lamaran">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-8 h-12 gap-2 shadow-lg shadow-orange-600/20">
                  <Sparkles className="h-5 w-5" />
                  Buat Surat Lamaran
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
