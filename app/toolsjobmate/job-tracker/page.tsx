import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Kanban, Sparkles, BarChart3, CheckCircle2, Calendar, ArrowRight, Zap, ListTodo } from "lucide-react";
import Link from "next/link";
import { NavbarDynamic } from "@/components/landing-v2/NavbarDynamic";
import { SimpleFooter } from "@/components/landing-v2/SimpleFooter";

export const metadata: Metadata = {
  title: "Job Application Tracker — Kanban Board | JobMate",
  description: "Track semua lamaran kerja dengan Kanban board drag & drop. Organize status, follow-up reminder, statistik aplikasi. Never miss opportunity!",
  keywords: ["job tracker", "application tracker", "kanban board", "job hunt organizer", "lamaran kerja tracker"],
};

export default function JobTrackerDetailPage() {
  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-brand selection:text-white">
      <NavbarDynamic />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-emerald-600/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 mb-4 px-4 py-1.5">
              <Kanban className="h-3 w-3 mr-2" />
              Kanban Board Interactive
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Job Application Tracker
            </h1>
            
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              Track semua lamaran kerja dengan Kanban board drag & drop. 
              Organize status, set follow-up reminder, lihat statistik. Never miss any opportunity!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/tools/tracker">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 h-12 gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  <Kanban className="h-5 w-5" />
                  Buka Tracker
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
              Kanban board interaktif dengan statistik & reminder system
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: Kanban,
                title: "Drag & Drop Kanban",
                desc: "Columns: Applied → Interview → Offer → Accepted. Drag & drop untuk update status.",
                color: "text-blue-400",
                bg: "bg-blue-500/10"
              },
              {
                icon: CheckCircle2,
                title: "Complete Data",
                desc: "Save posisi, perusahaan, tanggal, salary range, job source, notes, dan link.",
                color: "text-emerald-400",
                bg: "bg-emerald-500/10"
              },
              {
                icon: Calendar,
                title: "Follow-Up Reminder",
                desc: "Set reminder untuk follow-up lamaran setelah 1-2 minggu. Notifikasi otomatis.",
                color: "text-purple-400",
                bg: "bg-purple-500/10"
              },
              {
                icon: BarChart3,
                title: "Statistics",
                desc: "Lihat total aplikasi, response rate, success rate dalam grafik visual.",
                color: "text-amber-400",
                bg: "bg-amber-500/10"
              },
              {
                icon: ListTodo,
                title: "Priority Tags",
                desc: "Set priority (High, Medium, Low) dan custom tags untuk filter aplikasi.",
                color: "text-red-400",
                bg: "bg-red-500/10"
              },
              {
                icon: Zap,
                title: "Real-Time Sync",
                desc: "Data sync otomatis ke database. Akses dari device mana saja, selalu up-to-date.",
                color: "text-teal-400",
                bg: "bg-teal-500/10"
              }
            ].map((feature, i) => (
              <Card key={i} className="p-6 bg-neutral-900/50 border-white/5 hover:border-emerald-500/30 transition-colors">
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

      {/* Kanban Columns */}
      <section className="py-20 bg-black relative">
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Kanban Workflow</h2>
            <p className="text-neutral-400 text-lg">
              Visualisasi progress lamaran dari apply sampai accepted
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: "📝", title: "Applied", desc: "Lamaran dikirim, menunggu response.", color: "border-blue-500/30" },
              { icon: "💼", title: "Interview", desc: "Dapat panggilan interview.", color: "border-purple-500/30" },
              { icon: "🎯", title: "Offer", desc: "Dapat job offer, nego salary.", color: "border-amber-500/30" },
              { icon: "✅", title: "Accepted", desc: "Offer accepted, onboarding.", color: "border-emerald-500/30" }
            ].map((item, i) => (
              <div key={i} className={`p-6 rounded-2xl border bg-neutral-900/30 backdrop-blur-sm ${item.color} text-center`}>
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-neutral-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-600/5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto p-8 md:p-12 text-center rounded-3xl bg-gradient-to-br from-neutral-900 to-black border border-white/10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Siap Organize Job Hunt Anda?
            </h2>
            <p className="text-lg text-neutral-400 mb-8 max-w-2xl mx-auto">
              Kanban board drag & drop, follow-up reminder, statistik dashboard. 
              Never miss opportunity lagi!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tools/tracker">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 h-12 gap-2 shadow-lg shadow-emerald-600/20">
                  <Sparkles className="h-5 w-5" />
                  Buka Tracker Sekarang
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
