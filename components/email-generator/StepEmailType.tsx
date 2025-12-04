"use client";

import { Card } from "@/components/ui/card";
import { Mail, Send, ThumbsUp, Search, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import { EmailFormData } from "./types";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StepEmailTypeProps {
  formData: EmailFormData;
  updateFormData: (data: Partial<EmailFormData>) => void;
  onNext?: () => void;
}

const EMAIL_TYPES = [
  {
    value: 'application',
    icon: Mail,
    label: 'Lamaran Kerja',
    shortDesc: 'Apply Job',
    description: 'Kirim lamaran dengan CV & Portfolio untuk posisi impianmu.',
    features: ['Formal & Profesional', 'Struktur Standar HR', 'Support Attachments'],
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-600',
    bgGradient: 'from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40',
    borderColor: 'border-blue-200 dark:border-blue-800',
    selectedBorder: 'border-blue-600 dark:border-blue-500',
    shadow: 'shadow-blue-500/20',
    popular: true,
    textColor: 'text-blue-700 dark:text-blue-400'
  },
  {
    value: 'follow_up',
    icon: Send,
    label: 'Follow Up',
    shortDesc: 'Cek Status',
    description: 'Tanyakan kabar lamaranmu yang belum ada respon dari HR.',
    features: ['Sopan & Tidak Pushy', 'Ingatkan HR', 'Tunjukkan Antusiasme'],
    color: 'purple',
    gradient: 'from-purple-500 to-pink-600',
    bgGradient: 'from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40',
    borderColor: 'border-purple-200 dark:border-purple-800',
    selectedBorder: 'border-purple-600 dark:border-purple-500',
    shadow: 'shadow-purple-500/20',
    popular: false,
    textColor: 'text-purple-700 dark:text-purple-400'
  },
  {
    value: 'thank_you',
    icon: ThumbsUp,
    label: 'Thank You',
    shortDesc: 'Habis Interview',
    description: 'Ucapkan terima kasih setelah selesai sesi interview dengan HR/User.',
    features: ['Bangun Hubungan', 'Kesan Profesional', 'Rekap Poin Penting'],
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-600',
    bgGradient: 'from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    selectedBorder: 'border-emerald-600 dark:border-emerald-500',
    shadow: 'shadow-emerald-500/20',
    popular: false,
    textColor: 'text-emerald-700 dark:text-emerald-400'
  },
  {
    value: 'inquiry',
    icon: Search,
    label: 'Job Inquiry',
    shortDesc: 'Tanya Lowongan',
    description: 'Kirim pesan ke HR/Koneksi untuk menanyakan peluang kerja.',
    features: ['Fokus Networking', 'Inisiatif Tinggi', 'Cari Hidden Gems'],
    color: 'amber',
    gradient: 'from-amber-500 to-orange-600',
    bgGradient: 'from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40',
    borderColor: 'border-amber-200 dark:border-amber-800',
    selectedBorder: 'border-amber-600 dark:border-amber-500',
    shadow: 'shadow-amber-500/20',
    popular: false,
    textColor: 'text-amber-700 dark:text-amber-400'
  },
];

export function StepEmailType({ formData, updateFormData, onNext }: StepEmailTypeProps) {
  
  const handleSelect = (value: string) => {
    updateFormData({ emailType: value as any });
    // Auto-advance on mobile/small screens after a short delay
    if (window.innerWidth < 768 && onNext) {
        setTimeout(() => {
            onNext();
        }, 400);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      
      {/* Header Section */}
      <div className="text-center space-y-4 pt-2">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
        >
            <Sparkles className="w-3 h-3" />
            <span>Langkah 1: Pilih Tujuan</span>
        </motion.div>
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Apa tujuan emailmu hari ini?
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto leading-relaxed px-4">
            Pilih jenis email yang ingin kamu buat. AI kami akan menyesuaikan struktur dan nada bicara yang tepat untukmu.
          </p>
        </div>
      </div>

      {/* Cards Grid - Improved Responsiveness */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-1">
        {EMAIL_TYPES.map((type, index) => {
          const Icon = type.icon;
          const isSelected = formData.emailType === type.value;
          
          return (
            <motion.div
              key={type.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative h-full"
            >
              <div
                onClick={() => handleSelect(type.value)}
                className={cn(
                    "group relative w-full h-full cursor-pointer rounded-2xl outline-none transition-all duration-300",
                    isSelected ? "scale-[1.02]" : "hover:scale-[1.02]"
                )}
              >
                <Card className={cn(
                    "h-full w-full overflow-hidden border-2 transition-all duration-300 relative flex flex-col",
                    isSelected 
                        ? cn(type.selectedBorder, type.bgGradient, "shadow-xl ring-1 ring-offset-2 ring-primary/60 dark:ring-offset-slate-900") 
                        : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg"
                )}>
                  
                  {/* Popular Badge */}
                  {type.popular && (
                    <div className="absolute top-0 right-0 z-20">
                        <div className="bg-gradient-to-r from-[#ff4e50] to-[#f9d423] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-sm flex items-center gap-1">
                            <Sparkles className="w-3 h-3 fill-current" />
                            POPULAR
                        </div>
                    </div>
                  )}

                  {/* Content Container */}
                  <div className="p-5 flex flex-col h-full relative z-10">
                    
                    {/* Icon Header */}
                    <div className="flex justify-between items-start mb-4">
                        <div className={cn(
                            "p-3 rounded-xl shadow-sm transition-all duration-300 group-hover:scale-110",
                            isSelected 
                                ? cn("bg-gradient-to-br text-white shadow-md ring-1 ring-white/20", type.gradient) 
                                : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700"
                        )}>
                            <Icon className="w-6 h-6" />
                        </div>
                        
                        <div className={cn(
                            "rounded-full p-1 transition-all duration-300",
                            isSelected 
                                ? cn("bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm opacity-100 scale-100", type.textColor) 
                                : "opacity-0 scale-75 group-hover:opacity-100 text-slate-300 dark:text-slate-600"
                        )}>
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="space-y-2 mb-4 flex-grow">
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider opacity-70 bg-slate-100 dark:bg-slate-800 inline-block px-2 py-0.5 rounded-md">
                            {type.shortDesc}
                        </div>
                        <h3 className={cn(
                            "font-bold text-lg transition-colors line-clamp-1",
                            isSelected ? type.textColor : "text-slate-900 dark:text-slate-100"
                        )}>
                            {type.label}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                            {type.description}
                        </p>
                    </div>

                    {/* Features (Bullet points) */}
                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/50 space-y-2">
                        {type.features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                                <div className={cn("w-1.5 h-1.5 rounded-full bg-gradient-to-br shrink-0", type.gradient)} />
                                <span className="truncate">{feature}</span>
                            </div>
                        ))}
                    </div>
                  </div>

                  {/* Hover Effect Gradient Overlay */}
                  <div className={cn(
                      "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none",
                      type.gradient
                  )} />
                </Card>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Help Banner */}
      <div className="px-1">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 max-w-3xl mx-auto hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
        >
            <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-blue-500 shrink-0 border border-slate-100 dark:border-slate-700">
                <Search className="w-5 h-5" />
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                <span className="font-bold text-slate-900 dark:text-slate-200 block sm:inline mb-1 sm:mb-0 mr-1">
                    Bingung pilih yang mana? 
                </span>
                Pilih <span className="font-semibold text-blue-600 dark:text-blue-400">"Lamaran Kerja"</span> untuk melamar pekerjaan resmi. Gunakan <span className="font-semibold text-amber-600 dark:text-amber-400">"Job Inquiry"</span> untuk networking.
            </div>
        </motion.div>
      </div>

    </div>
  );
}
