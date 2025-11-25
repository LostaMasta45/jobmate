import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Sparkles, Download, CheckCircle2, Zap, ArrowRight, Save, Clock } from "lucide-react";
import Link from "next/link";
import { NavbarDynamic } from "@/components/landing-v2/NavbarDynamic";
import { SimpleFooter } from "@/components/landing-v2/SimpleFooter";

export const metadata: Metadata = {
  title: "CV ATS Generator — Wizard 6 Langkah | JobMate",
  description: "Buat CV profesional ATS-friendly dengan wizard interaktif 6 langkah. Autosave, export PDF & DOCX. Format clean tanpa template warna.",
  keywords: ["cv ats generator", "buat cv online", "cv ats friendly", "cv generator indonesia", "cv wizard"],
};

export default function CVATSDetailPage() {
  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-brand selection:text-white">
      <NavbarDynamic />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="bg-brand/10 text-brand border-brand/20 mb-4 px-4 py-1.5">
              <Zap className="h-3 w-3 mr-2" />
              Wizard Interaktif 6 Langkah
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              CV ATS Generator <span className="text-brand">Premium</span>
            </h1>
            
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              Buat CV profesional ATS-friendly dengan wizard step-by-step. 
              Format clean, autosave otomatis, langsung export PDF & DOCX.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/tools/cv-ats">
                <Button size="lg" className="bg-brand hover:bg-brand-600 text-white rounded-full px-8 h-12 gap-2 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                  <FileText className="h-5 w-5" />
                  Buat CV Sekarang
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button size="lg" variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-full px-8 h-12 gap-2">
                  Lihat Demo
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
              Wizard interaktif dengan autosave & export instant
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: Zap,
                title: "Wizard 6 Langkah",
                desc: "Step-by-step guided: Basics → Summary → Experience → Education → Skills → Review & Export.",
                color: "text-blue-400",
                bg: "bg-blue-500/10"
              },
              {
                icon: FileText,
                title: "Format ATS-Friendly",
                desc: "Format clean text tanpa warna berlebihan. Pure structure yang mudah dibaca sistem ATS.",
                color: "text-brand",
                bg: "bg-brand/10"
              },
              {
                icon: Save,
                title: "Autosave",
                desc: "Tidak perlu khawatir kehilangan data. Draft tersimpan otomatis di localStorage.",
                color: "text-green-400",
                bg: "bg-green-500/10"
              },
              {
                icon: Download,
                title: "Export PDF & DOCX",
                desc: "Download langsung dalam format PDF (siap kirim) atau DOCX (editable di Word).",
                color: "text-purple-400",
                bg: "bg-purple-500/10"
              },
              {
                icon: Sparkles,
                title: "Preview Real-Time",
                desc: "Lihat hasil CV Anda di preview pane yang update otomatis saat Anda ketik.",
                color: "text-amber-400",
                bg: "bg-amber-500/10"
              },
              {
                icon: CheckCircle2,
                title: "Edit & Re-Download",
                desc: "CV tersimpan di history. Bisa edit kapan saja & download ulang tanpa batas.",
                color: "text-red-400",
                bg: "bg-red-500/10"
              }
            ].map((feature, i) => (
              <Card key={i} className="p-6 bg-neutral-900/50 border-white/5 hover:border-brand/30 transition-colors">
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

      {/* Wizard Steps */}
      <section className="py-20 bg-black relative">
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">6 Langkah Mudah</h2>
            <p className="text-neutral-400 text-lg">
              Wizard guided yang memandu Anda dari awal sampai akhir
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { step: 1, title: "Basics", desc: "Nama, kontak, LinkedIn, portfolio." },
              { step: 2, title: "Summary", desc: "Professional summary singkat." },
              { step: 3, title: "Experience", desc: "Posisi, perusahaan, durasi, achievements." },
              { step: 4, title: "Education", desc: "Universitas, jurusan, IPK, tahun." },
              { step: 5, title: "Skills", desc: "Technical skills, tools, languages." },
              { step: 6, title: "Review", desc: "Preview full CV & download." }
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl border border-white/10 bg-neutral-900/30 backdrop-blur-sm hover:bg-neutral-900/50 transition-all">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-brand text-white w-10 h-10 flex items-center justify-center font-bold flex-shrink-0 shadow-lg shadow-brand/20">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-neutral-400">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand/5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto p-8 md:p-12 text-center rounded-3xl bg-gradient-to-br from-neutral-900 to-black border border-white/10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Siap Buat CV Profesional?
            </h2>
            <p className="text-lg text-neutral-400 mb-8 max-w-2xl mx-auto">
              Wizard 6 langkah, autosave otomatis, export PDF & DOCX instant. 
              Buat sekarang dalam 10 menit!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tools/cv-ats">
                <Button size="lg" className="bg-brand hover:bg-brand-600 text-white rounded-full px-8 h-12 gap-2 shadow-lg shadow-brand/20">
                  <Sparkles className="h-5 w-5" />
                  Buat CV Sekarang
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
