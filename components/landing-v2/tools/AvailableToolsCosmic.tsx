"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { 
  FileText, 
  Mail, 
  LayoutDashboard, 
  FileEdit, 
  MessageSquare, 
  FolderOpen,
  Clock,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const availableTools = [
  {
    id: "cv-ats",
    icon: FileText,
    title: "CV ATS Generator",
    gradient: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/20",
    iconColor: "text-blue-400",
    features: [
      "10+ template ATS-friendly",
      "AI suggestions skill matching",
      "Export PDF & DOCX",
      "Preview real-time"
    ],
    useCase: "Dina bikin CV 5 menit, 2 hari dapat interview.",
    timeSaved: "2-3 jam / CV",
    route: "/toolsjobmate/cv-ats"
  },
  {
    id: "email-generator",
    icon: Mail,
    title: "Email Lamaran Generator",
    gradient: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/20",
    iconColor: "text-purple-400",
    features: [
      "Template otomatis profesional",
      "Personalisasi nama & posisi",
      "Subject line suggestions",
      "Auto-attach CV"
    ],
    useCase: "Andi generate email pro dalam 5 menit, HR reply H+1.",
    timeSaved: "30 menit / email",
    route: "/toolsjobmate/email-generator"
  },
  {
    id: "job-tracker",
    icon: LayoutDashboard,
    title: "Job Application Tracker",
    gradient: "from-emerald-500 to-green-500",
    bgColor: "bg-emerald-500/20",
    iconColor: "text-emerald-400",
    features: [
      "Kanban board drag & drop",
      "Reminder otomatis follow-up",
      "Statistics & analytics",
      "Status tracking real-time"
    ],
    useCase: "Rini track 25 aplikasi tanpa chaos.",
    timeSaved: "5 jam / bulan",
    route: "/toolsjobmate/job-tracker"
  },
  {
    id: "surat-lamaran",
    icon: FileEdit,
    title: "Surat Lamaran Generator",
    gradient: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-500/20",
    iconColor: "text-amber-400",
    features: [
      "Template formal Indonesia",
      "Auto-fill data personal",
      "Format BUMN & swasta",
      "Download Word & PDF"
    ],
    useCase: "Budi bikin surat lamaran BUMN dalam 10 menit.",
    timeSaved: "1 jam / surat",
    route: "/toolsjobmate/surat-lamaran"
  },
  {
    id: "wa-generator",
    icon: MessageSquare,
    title: "WhatsApp Generator",
    gradient: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/20",
    iconColor: "text-green-400",
    features: [
      "Follow-up messages template",
      "Thank you notes",
      "Spintax preview (variasi)",
      "Copy to clipboard"
    ],
    useCase: "Andi kirim thank you note, HRD appreciate.",
    timeSaved: "15 menit / chat",
    route: "/toolsjobmate/wa-generator"
  },
  {
    id: "pdf-tools",
    icon: FolderOpen,
    title: "PDF Tools Suite",
    gradient: "from-slate-500 to-gray-500",
    bgColor: "bg-slate-500/20",
    iconColor: "text-slate-400",
    features: [
      "Merge multiple PDFs",
      "Convert to PDF (Word)",
      "Compress PDF size",
      "Batch processing"
    ],
    useCase: "Rina merge CV + Ijazah jadi 1 file mudah.",
    timeSaved: "20 menit / batch",
    route: "/toolsjobmate/pdf-tools"
  },
];

export const AvailableToolsCosmic = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="tools" ref={ref} className="py-24 bg-black relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={isInView ? { opacity: 1, scale: 1 } : {}}
             className="inline-block mb-4"
          >
             <Badge className="bg-brand/10 text-brand border-brand/20 px-4 py-1">
                ✅ Available Now
             </Badge>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="text-3xl md:text-5xl font-bold text-white mb-6"
          >
            6 Core Tools <span className="text-brand">Premium</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-neutral-400 text-lg max-w-3xl mx-auto"
          >
            Semua senjata rahasia yang kamu butuhkan untuk menaklukkan pasar kerja.
          </motion.p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableTools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative bg-neutral-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                {/* Hover Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                {/* Header */}
                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div className={`w-12 h-12 rounded-2xl ${tool.bgColor} flex items-center justify-center border border-white/5`}>
                    <Icon className={`w-6 h-6 ${tool.iconColor}`} />
                  </div>
                  <div className="px-3 py-1 rounded-full bg-white/5 text-xs font-medium text-white border border-white/10">
                    Available
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-brand transition-colors">{tool.title}</h3>
                    
                    <ul className="space-y-3 mb-6">
                    {tool.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-neutral-400">
                        <CheckCircle2 className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                        </li>
                    ))}
                    </ul>

                    <div className="bg-black/40 rounded-xl p-3 mb-6 border border-white/5">
                        <div className="flex items-center gap-2 text-sm text-brand font-medium mb-1">
                            <Clock className="w-3 h-3" />
                            <span>Hemat {tool.timeSaved}</span>
                        </div>
                        <p className="text-xs text-neutral-500 italic">"{tool.useCase}"</p>
                    </div>

                    <Button asChild className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 justify-between group-hover:border-brand/30 transition-all">
                    <a href={tool.route}>
                        Lihat Detail 
                        <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
                    </a>
                    </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
