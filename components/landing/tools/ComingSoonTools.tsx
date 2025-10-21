"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
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
    title: "Interview Checklist & Guide",
    gradient: "from-red-500 to-rose-500",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    coming: "Q1 2026",
    description: "Panduan persiapan interview H-7 sampai H-Day, tips menjawab pertanyaan HRD, dan checklist dokumen",
    features: [
      "200+ pertanyaan interview umum",
      "Script jawaban professional",
      "Checklist dokumen H-Day",
      "Tips body language & etika"
    ]
  },
  {
    id: "skill-resume",
    icon: Target,
    title: "Skill-Based Resume Builder",
    gradient: "from-indigo-500 to-violet-500",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    coming: "Q1 2026",
    description: "Template CV fokus skills untuk fresh graduate yang belum punya pengalaman kerja formal",
    features: [
      "Highlight skills & achievements",
      "Template khusus fresh grad",
      "Project portfolio showcase",
      "Soft skills visualization"
    ]
  },
  {
    id: "profile-builder",
    icon: User,
    title: "Profile Builder",
    gradient: "from-cyan-500 to-blue-500",
    bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
    coming: "Q2 2026",
    description: "One-time data entry, auto-fill semua tools. Simpan data pendidikan, skill, dan pengalaman sekali saja",
    features: [
      "Central data repository",
      "Auto-fill all tools",
      "Version history",
      "Import from LinkedIn"
    ]
  },
  {
    id: "cover-letter-english",
    icon: FileText,
    title: "Cover Letter Generator (English)",
    gradient: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-100 dark:bg-pink-900/30",
    coming: "Q2 2026",
    description: "Generate cover letter bahasa Inggris untuk startup & perusahaan multinasional",
    features: [
      "AI-powered writing assistant",
      "Industry-specific templates",
      "Grammar & tone checker",
      "Export Word & PDF"
    ]
  },
  {
    id: "salary-negotiation",
    icon: DollarSign,
    title: "Salary Negotiation Guide",
    gradient: "from-yellow-500 to-amber-500",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    coming: "Q2 2026",
    description: "Market salary data + negotiation scripts untuk fresh grad sampai senior level",
    features: [
      "Salary benchmark by position",
      "Negotiation scripts & tips",
      "Benefits comparison",
      "Counter offer templates"
    ]
  },
];

export function ComingSoonTools() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section ref={ref} className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 mb-6">
            🔜 Segera Hadir
          </Badge>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            5 Tools Baru <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Coming Soon</span>
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Investasi Premium sekarang, dapat <strong className="text-foreground">akses lifetime</strong> ke semua tools baru tanpa bayar lagi!
          </p>
        </motion.div>

        {/* Coming Soon Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {comingSoonTools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative bg-card rounded-2xl p-6 shadow-lg border hover:border-amber-200 dark:hover:border-amber-800 transition-all"
              >
                {/* Lock Overlay */}
                <div className="absolute top-4 right-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-amber-600" />
                  </div>
                </div>

                {/* Header */}
                <div className="mb-4">
                  <div className={`w-12 h-12 rounded-xl ${tool.bgColor} flex items-center justify-center mb-3`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <Badge className={`bg-gradient-to-r ${tool.gradient} text-white mb-2`}>
                    {tool.coming}
                  </Badge>
                  <h3 className="text-lg font-bold mb-2">{tool.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-4">
                  {tool.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button className="w-full" variant="outline" disabled>
                  <Lock className="w-4 h-4 mr-2" />
                  Coming Soon
                </Button>
              </motion.div>
            );
          })}
        </div>

        {/* Value Proposition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-2xl p-8 lg:p-12 max-w-4xl mx-auto border border-amber-200 dark:border-amber-800"
        >
          <div className="text-center">
            <Sparkles className="w-12 h-12 text-amber-600 mx-auto mb-4" />
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              Beli Sekarang, Dapat Tools Baru <span className="text-amber-600">GRATIS</span>
            </h3>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Dengan membership <strong className="text-foreground">VIP Premium Lifetime</strong>, kamu otomatis dapat akses ke 5 tools baru ini saat launch — tanpa bayar lagi!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700 text-white font-semibold">
                <a href="#pricing">Upgrade ke Premium Sekarang</a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#comparison">Lihat Perbandingan</a>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
