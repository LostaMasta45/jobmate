"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { 
  FileText, 
  Mail, 
  LayoutDashboard, 
  MessageSquare, 
  Award, 
  FileEdit, 
  FolderOpen, 
  User 
} from "lucide-react";
import { Button } from "@/components/ui/button";

const tools = [
  {
    icon: FileText,
    title: "CV ATS Generator",
    description: "Buat CV otomatis yang lolos sistem HRD dengan format profesional dan kompatibel ATS.",
    color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
  },
  {
    icon: Mail,
    title: "Template Surat Lamaran & Email",
    description: "Pilih dari 20+ contoh surat lamaran kerja formal & kreatif, tinggal isi nama dan posisi.",
    color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30",
  },
  {
    icon: LayoutDashboard,
    title: "Job Application Tracker",
    description: "Pantau semua lamaranmu: Terkirim – Interview – Diterima – Ditolak, dalam dashboard pribadi.",
    color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    icon: MessageSquare,
    title: "WhatsApp Message Generator",
    description: "Bikin pesan WA profesional saat kirim lamaran — gak perlu mikir format lagi.",
    color: "text-green-600 bg-green-100 dark:bg-green-900/30",
  },
  {
    icon: Award,
    title: "Skill-Based Resume Generator",
    description: "Buat CV berbasis keahlian, bukan pengalaman, cocok untuk freshgraduate!",
    color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30",
  },
  {
    icon: FileEdit,
    title: "Interview Checklist",
    description: "Siap wawancara dengan daftar pertanyaan umum, tips, dan trik menjawab versi HRD.",
    color: "text-pink-600 bg-pink-100 dark:bg-pink-900/30",
  },
  {
    icon: FolderOpen,
    title: "Merge & Convert PDF Tools",
    description: "Gabungkan, ubah, dan kompres file lamaranmu langsung di browser — tanpa aplikasi tambahan.",
    color: "text-red-600 bg-red-100 dark:bg-red-900/30",
  },
  {
    icon: User,
    title: "Profile Builder",
    description: "Simpan semua data (pendidikan, skill, pengalaman) agar form lamaran bisa auto-generate kapanpun.",
    color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30",
  },
];

export function ToolsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="tools" ref={ref} className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            🚀 Eksklusif untuk VIP Premium
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            Apa Itu{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Tools JobMate
            </span>
            ?
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Semua yang kamu butuh untuk{" "}
            <strong className="text-foreground">siap kerja</strong> —
            dari buat CV, kirim lamaran, sampai track progress interview.
          </p>
        </motion.div>

        {/* Tools Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-card rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-lg border transition-all hover:-translate-y-1"
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${tool.color} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-semibold text-sm sm:text-base mb-2 leading-tight">{tool.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {tool.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 text-center text-white shadow-2xl"
        >
          <div className="max-w-3xl mx-auto">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 leading-tight">
              👉 Semua tools ini ada di Dashboard JobMate!
            </h3>
            <p className="text-sm sm:text-base lg:text-lg text-blue-100 mb-6 leading-relaxed">
              Dengan VIP Premium, kamu dapat <strong>akses selamanya</strong> ke semua tools ini.
              Hemat waktu, hemat biaya, dan tingkatkan peluang diterima kerja!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
              >
                <a href="#pricing">Coba Sekarang — Rp 39k Lifetime</a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10"
              >
                <a href="/dashboard">Lihat Demo Dashboard</a>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Benefits List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-12 grid sm:grid-cols-3 gap-6 text-center"
        >
          <div className="space-y-2">
            <div className="text-3xl">⚡</div>
            <h4 className="font-semibold">Hemat Waktu</h4>
            <p className="text-sm text-muted-foreground">
              Bikin CV & surat lamaran cuma 5 menit
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-3xl">🎯</div>
            <h4 className="font-semibold">Lebih Profesional</h4>
            <p className="text-sm text-muted-foreground">
              Tampil beda dengan aplikasi yang rapi
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-3xl">📈</div>
            <h4 className="font-semibold">Track Progress</h4>
            <p className="text-sm text-muted-foreground">
              Tahu status semua lamaranmu real-time
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
