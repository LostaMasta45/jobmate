"use client";

import { motion } from "framer-motion";
import { 
  FileText, 
  Mail, 
  ClipboardList, 
  MessageSquare, 
  FileCheck,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function ToolsPreview() {
  const tools = [
    {
      icon: FileText,
      name: "CV ATS Generator",
      description: "Buat CV ATS-friendly dalam 5 menit",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Mail,
      name: "Email Lamaran",
      description: "Generate email profesional otomatis",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: ClipboardList,
      name: "Application Tracker",
      description: "Pantau semua lamaranmu dalam 1 dashboard",
      color: "from-emerald-500 to-green-500",
    },
    {
      icon: MessageSquare,
      name: "WA Generator",
      description: "Buat pesan follow-up yang efektif",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: FileCheck,
      name: "Surat Lamaran",
      description: "Template surat lamaran siap pakai",
      color: "from-rose-500 to-red-500",
    },
    {
      icon: Sparkles,
      name: "5+ Tools Lainnya",
      description: "PDF Tools, Interview Guide, dan lainnya",
      color: "from-indigo-500 to-violet-500",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-block bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            🎁 Bonus Eksklusif VIP Premium
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            <span className="text-foreground">10+ Tools JobMate</span>
            <br />
            <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
              Bikin Kamu Siap Kerja 24/7
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Gak cuma dapat info loker, tapi juga tools lengkap buat bantu kamu dari bikin CV sampai
            interview. <strong className="text-foreground">Eksklusif buat member Premium!</strong>
          </p>
        </motion.div>

        {/* Tools Grid - Visual Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {tools.map((tool, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Gradient Background on Hover */}
              <div
                className={`absolute inset-0 rounded-xl bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />

              {/* Icon */}
              <div
                className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 shadow-lg`}
              >
                <tool.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="relative text-lg font-bold mb-2 text-foreground group-hover:text-emerald-600 transition-colors">
                {tool.name}
              </h3>
              <p className="relative text-sm text-muted-foreground">{tool.description}</p>

              {/* Hover Indicator */}
              <div className="relative mt-4 flex items-center text-sm font-semibold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Lihat Demo →
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-6 sm:p-8 text-white text-center"
        >
          <h3 className="text-xl sm:text-2xl font-bold mb-3">
            Unlock Semua Tools dengan Premium
          </h3>
          <p className="text-base opacity-90 mb-6 max-w-2xl mx-auto">
            Member Basic hanya dapat 1 template CV. Member Premium dapat{" "}
            <strong>SEMUA tools ini + update fitur baru</strong> selamanya!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-emerald-700 hover:bg-slate-100 font-bold shadow-lg"
            >
              <a href="#pricing">Lihat Paket Premium →</a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 font-semibold"
            >
              <a href="/dashboard" target="_blank">
                Preview Dashboard
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
