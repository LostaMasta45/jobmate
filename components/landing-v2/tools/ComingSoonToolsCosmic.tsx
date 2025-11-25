"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { 
  CheckCircle2, 
  Target, 
  User, 
  FileText, 
  DollarSign,
  Lock,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const comingSoonTools = [
  {
    id: "interview-checklist",
    icon: CheckCircle2,
    title: "Interview Guide",
    gradient: "from-red-500 to-rose-500",
    bgColor: "bg-red-500/20",
    coming: "Q1 2026",
    description: "Panduan persiapan interview, script jawaban, dan checklist dokumen.",
    features: [
      "200+ pertanyaan interview",
      "Script jawaban professional",
      "Checklist dokumen H-Day",
      "Tips body language"
    ]
  },
  {
    id: "skill-resume",
    icon: Target,
    title: "Skill-Based Resume",
    gradient: "from-indigo-500 to-violet-500",
    bgColor: "bg-indigo-500/20",
    coming: "Q1 2026",
    description: "Template CV fokus skills untuk fresh grad tanpa pengalaman.",
    features: [
      "Highlight skills & project",
      "Template fresh grad",
      "Portfolio showcase",
      "Soft skills visual"
    ]
  },
  {
    id: "profile-builder",
    icon: User,
    title: "Profile Builder",
    gradient: "from-cyan-500 to-blue-500",
    bgColor: "bg-cyan-500/20",
    coming: "Q2 2026",
    description: "Satu kali input data, auto-fill ke semua tools JobMate.",
    features: [
      "Central data repository",
      "Auto-fill all tools",
      "Version history",
      "Import LinkedIn"
    ]
  },
  {
    id: "cover-letter-english",
    icon: FileText,
    title: "Cover Letter (EN)",
    gradient: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-500/20",
    coming: "Q2 2026",
    description: "Generate cover letter bahasa Inggris untuk perusahaan multinasional.",
    features: [
      "AI writing assistant",
      "Industry templates",
      "Grammar checker",
      "Export Word & PDF"
    ]
  },
  {
    id: "salary-negotiation",
    icon: DollarSign,
    title: "Salary Guide",
    gradient: "from-yellow-500 to-amber-500",
    bgColor: "bg-yellow-500/20",
    coming: "Q2 2026",
    description: "Data gaji pasar + script negosiasi gaji yang terbukti ampuh.",
    features: [
      "Salary benchmark",
      "Negotiation scripts",
      "Benefits comparison",
      "Counter offer tips"
    ]
  },
];

export const ComingSoonToolsCosmic = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 bg-neutral-950 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-amber-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 mb-4">
            🔜 Roadmap 2026
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            5 Tools Baru <span className="text-amber-500">Coming Soon</span>
          </h2>
          <p className="text-neutral-400 text-lg max-w-3xl mx-auto">
            Gabung Premium sekarang = Akses Lifetime ke tools ini saat rilis nanti. Tanpa biaya tambahan.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {comingSoonTools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative bg-neutral-900/40 border border-white/5 rounded-3xl p-6 overflow-hidden group hover:border-amber-500/30 transition-colors"
              >
                {/* Lock Icon */}
                <div className="absolute top-4 right-4 bg-neutral-800 p-2 rounded-full z-20">
                  <Lock className="w-4 h-4 text-neutral-400" />
                </div>

                {/* Gradient bg */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />

                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-xl ${tool.bgColor} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                     <h3 className="text-lg font-bold text-white">{tool.title}</h3>
                     <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white/70 border border-white/5">{tool.coming}</span>
                  </div>
                  
                  <p className="text-neutral-400 text-sm mb-4 leading-relaxed">{tool.description}</p>

                  <ul className="space-y-2">
                    {tool.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-neutral-500">
                        <Sparkles className="w-3 h-3 text-amber-500 flex-shrink-0 mt-1" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-500/20 rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto backdrop-blur-md"
        >
           <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 mb-4">
               <Sparkles className="w-8 h-8 text-amber-500" />
           </div>
           <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
               Beli Sekali, Untung Berkali-kali
           </h3>
           <p className="text-neutral-300 mb-8 max-w-xl mx-auto">
               Dengan membership <strong className="text-amber-400">VIP Premium Lifetime</strong>, kamu otomatis mendapatkan semua tools baru di atas secara GRATIS saat rilis.
           </p>
           <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-full px-8">
               <a href="#pricing">Amankan Akses Lifetime Sekarang</a>
           </Button>
        </motion.div>
      </div>
    </section>
  );
};
