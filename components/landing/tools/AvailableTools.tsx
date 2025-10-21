"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { 
  FileText, 
  Mail, 
  LayoutDashboard, 
  FileEdit, 
  MessageSquare, 
  FolderOpen,
  Clock,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const availableTools = [
  {
    id: "cv-ats",
    icon: FileText,
    title: "CV ATS Generator",
    gradient: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    features: [
      "10+ template ATS-friendly",
      "AI suggestions untuk skill matching",
      "Export PDF & DOCX",
      "Preview real-time"
    ],
    useCase: "Dina bikin CV 5 menit, 2 hari dapat interview dari startup tech",
    timeSaved: "2-3 jam per CV",
    route: "/toolsjobmate/cv-ats"
  },
  {
    id: "email-generator",
    icon: Mail,
    title: "Email Lamaran Generator",
    gradient: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    features: [
      "Template otomatis profesional",
      "Personalisasi nama & posisi",
      "Subject line suggestions",
      "Auto-attach CV"
    ],
    useCase: "Andi generate email professional dalam 5 menit, HR reply H+1",
    timeSaved: "30-60 menit per email",
    route: "/toolsjobmate/email-generator"
  },
  {
    id: "job-tracker",
    icon: LayoutDashboard,
    title: "Job Application Tracker",
    gradient: "from-emerald-500 to-green-500",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    features: [
      "Kanban board drag & drop",
      "Reminder otomatis follow-up",
      "Statistics & analytics",
      "Status tracking real-time"
    ],
    useCase: "Rini track 25 aplikasi tanpa chaos, tahu kapan harus follow-up",
    timeSaved: "5-10 jam per bulan",
    route: "/toolsjobmate/job-tracker"
  },
  {
    id: "surat-lamaran",
    icon: FileEdit,
    title: "Surat Lamaran Generator",
    gradient: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    features: [
      "Template formal Indonesia",
      "Auto-fill data personal",
      "Format BUMN & swasta",
      "Download Word & PDF"
    ],
    useCase: "Budi bikin surat lamaran BUMN dalam 10 menit, format perfect",
    timeSaved: "1-2 jam per surat",
    route: "/toolsjobmate/surat-lamaran"
  },
  {
    id: "wa-generator",
    icon: MessageSquare,
    title: "WhatsApp Generator",
    gradient: "from-green-500 to-emerald-500",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    features: [
      "Follow-up messages template",
      "Thank you notes",
      "Spintax preview (variasi text)",
      "Copy to clipboard"
    ],
    useCase: "Andi kirim thank you message professional, HRD appreciate effort",
    timeSaved: "15-30 menit per message",
    route: "/toolsjobmate/wa-generator"
  },
  {
    id: "pdf-tools",
    icon: FolderOpen,
    title: "PDF Tools Suite",
    gradient: "from-slate-500 to-gray-500",
    bgColor: "bg-slate-100 dark:bg-slate-900/30",
    features: [
      "Merge multiple PDFs",
      "Convert to PDF (Word, Excel)",
      "Compress PDF size",
      "Batch processing"
    ],
    useCase: "Rina merge CV + ijazah + sertifikat jadi 1 file, kirim mudah",
    timeSaved: "20-40 menit per batch",
    route: "/toolsjobmate/pdf-tools"
  },
];

export function AvailableTools() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="tools" ref={ref} className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 mb-6">
            ✅ Available Now
          </Badge>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            6 Core Tools <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">Premium</span>
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Semua yang kamu butuh untuk <strong className="text-foreground">siap kerja</strong> — dari buat CV, kirim lamaran, sampai track progress interview
          </p>
        </motion.div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto mb-12">
          {availableTools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-card rounded-2xl p-6 lg:p-8 shadow-lg border hover:border-emerald-200 dark:hover:border-emerald-800 transition-all hover:-translate-y-1"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-xl ${tool.bgColor} flex items-center justify-center`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <Badge className={`bg-gradient-to-r ${tool.gradient} text-white`}>
                    Available
                  </Badge>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-3">{tool.title}</h3>

                {/* Features */}
                <ul className="space-y-2 mb-4">
                  {tool.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Use Case */}
                <div className="bg-muted/50 rounded-xl p-4 mb-4">
                  <p className="text-sm italic text-muted-foreground">
                    💡 <strong className="text-foreground">Use case:</strong> {tool.useCase}
                  </p>
                </div>

                {/* Time Saved */}
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-600">
                    Hemat: {tool.timeSaved}
                  </span>
                </div>

                {/* CTA */}
                <Button asChild className="w-full" variant="outline">
                  <a href={tool.route}>Lihat Detail →</a>
                </Button>
              </motion.div>
            );
          })}
        </div>

        {/* Total Time Saved */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl sm:rounded-3xl p-8 lg:p-12 text-center text-white shadow-2xl max-w-4xl mx-auto"
        >
          <h3 className="text-2xl sm:text-3xl font-bold mb-4">
            Total Waktu yang Bisa Dihemat
          </h3>
          <div className="text-5xl sm:text-6xl font-bold mb-4">
            10-15 Jam/Minggu
          </div>
          <p className="text-lg text-blue-100 mb-6">
            = <strong>~500 jam per tahun</strong> | Nilai waktu <strong>Rp 25 JUTA</strong> (jika dihargai Rp 50K/jam)
          </p>
          <Button asChild size="lg" className="bg-white text-emerald-600 hover:bg-blue-50 font-semibold">
            <a href="#pricing">Mulai Hemat Waktu Sekarang →</a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
