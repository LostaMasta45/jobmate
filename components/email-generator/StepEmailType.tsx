"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Send, ThumbsUp, Search, ArrowRight, CheckCircle2 } from "lucide-react";
import { EmailFormData } from "./types";
import { motion } from "framer-motion";

interface StepEmailTypeProps {
  formData: EmailFormData;
  updateFormData: (data: Partial<EmailFormData>) => void;
  onNext?: () => void;
}

const EMAIL_TYPES = [
  {
    value: 'application',
    icon: Mail,
    emoji: '📧',
    label: 'Email Lamaran',
    description: 'Apply untuk posisi baru',
    longDesc: 'Email formal untuk melamar pekerjaan dengan melampirkan CV dan portfolio',
    features: ['Detail skills & experience', 'Attachments CV/Portfolio', 'Professional tone'],
    recommendedLength: 'Medium (250-300 kata)',
    gradient: 'from-blue-500 to-blue-600',
    bgGradient: 'from-blue-50 to-blue-100',
    popular: true,
  },
  {
    value: 'follow_up',
    icon: Send,
    emoji: '📬',
    label: 'Follow-up Email',
    description: 'Tindak lanjut lamaran sebelumnya',
    longDesc: 'Email untuk menanyakan status lamaran yang sudah dikirim sebelumnya',
    features: ['Reference email sebelumnya', 'Polite & not pushy', 'Request update'],
    recommendedLength: 'Short (150-200 kata)',
    gradient: 'from-purple-500 to-purple-600',
    bgGradient: 'from-purple-50 to-purple-100',
    popular: false,
  },
  {
    value: 'thank_you',
    icon: ThumbsUp,
    emoji: '🙏',
    label: 'Thank You Email',
    description: 'Ucapan terima kasih setelah interview',
    longDesc: 'Email berterima kasih dan reinforce interest setelah wawancara',
    features: ['Mention specific topics', 'Show gratitude', 'Reinforce interest'],
    recommendedLength: 'Short (150-200 kata)',
    gradient: 'from-green-500 to-green-600',
    bgGradient: 'from-green-50 to-green-100',
    popular: true,
  },
  {
    value: 'inquiry',
    icon: Search,
    emoji: '❓',
    label: 'Job Inquiry',
    description: 'Tanya peluang kerja tersedia',
    longDesc: 'Email untuk menanyakan peluang kerja tanpa apply ke posisi spesifik',
    features: ['No specific position', 'Networking focus', 'Request information'],
    recommendedLength: 'Short (150-200 kata)',
    gradient: 'from-amber-500 to-amber-600',
    bgGradient: 'from-amber-50 to-amber-100',
    popular: false,
  },
];

export function StepEmailType({ formData, updateFormData, onNext }: StepEmailTypeProps) {
  
  const handleSelect = (value: string) => {
    updateFormData({ emailType: value as any });
    // Auto-advance on mobile/small screens after a short delay for visual feedback
    if (window.innerWidth < 768 && onNext) {
        setTimeout(() => {
            onNext();
        }, 400);
    }
  };

  return (
    <div className="space-y-6 pb-24 md:pb-0"> {/* Extra padding bottom for mobile fab/toolbar */}
      {/* Header */}
      <div className="text-center space-y-2 mb-6 md:mb-8">
        <h2 className="text-xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">Pilih Jenis Email</h2>
        <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto">
          Setiap jenis email memiliki struktur dan tone yang berbeda. Pilih yang paling sesuai.
        </p>
      </div>

      {/* Email Type Cards - Mobile Optimized Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {EMAIL_TYPES.map((type) => {
          const Icon = type.icon;
          const isSelected = formData.emailType === type.value;
          
          return (
            <motion.button
              key={type.value}
              onClick={() => handleSelect(type.value)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`group relative text-left transition-all duration-300 w-full outline-none rounded-xl`}
            >
              <Card className={`relative overflow-hidden h-full p-5 md:p-6 transition-all duration-300 ${
                isSelected
                  ? `border-2 border-[#5547d0] dark:border-[#5547d0] bg-white dark:bg-slate-900 shadow-xl ring-4 ring-[#5547d0]/10`
                  : 'border border-slate-200 dark:border-slate-800 hover:border-[#5547d0]/50 bg-white dark:bg-slate-900 hover:shadow-md'
              }`}>
                {/* Selected Background Gradient */}
                {isSelected && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${type.bgGradient} opacity-50 dark:opacity-10 transition-opacity`} />
                )}
                
                {/* Popular Badge */}
                {type.popular && (
                  <div className="absolute top-0 right-0 z-10">
                    <div className="bg-gradient-to-r from-[#5547d0] to-[#00acc7] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-sm">
                      POPULAR
                    </div>
                  </div>
                )}

                {/* Selected Checkmark Overlay */}
                {isSelected && (
                  <div className="absolute top-3 right-3 z-20 animate-in fade-in zoom-in duration-300">
                    <div className="bg-[#5547d0] text-white rounded-full p-1 shadow-lg">
                      <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                  </div>
                )}

                <div className="relative flex flex-col h-full z-10">
                  {/* Icon & Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 md:p-3.5 rounded-2xl transition-all shrink-0 shadow-sm ${
                      isSelected
                        ? `bg-gradient-to-br ${type.gradient} text-white shadow-[#5547d0]/25`
                        : `bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:text-[#5547d0] group-hover:bg-[#5547d0]/10`
                    }`}>
                      <Icon className={`h-6 w-6 md:h-7 md:w-7 transition-transform duration-300 ${isSelected ? 'scale-110' : ''}`} />
                    </div>
                    <div className="min-w-0 flex-1 pt-1">
                       <h3 className={`font-bold text-lg md:text-xl leading-tight ${isSelected ? 'text-[#5547d0]' : 'text-slate-900 dark:text-slate-100'}`}>
                         {type.label}
                       </h3>
                       <p className="text-xs md:text-sm text-muted-foreground line-clamp-1 mt-1">
                         {type.description}
                       </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className={`text-xs md:text-sm leading-relaxed mb-5 flex-1 ${
                    isSelected ? 'text-slate-700 dark:text-slate-300 font-medium' : 'text-muted-foreground'
                  }`}>
                    {type.longDesc}
                  </p>
                  
                  {/* Mobile "Tap to select" hint */}
                  <div className="md:hidden flex items-center gap-1 text-xs text-[#5547d0] font-medium mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Tap to select</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>

                  {/* Features List (Hidden on mobile to save space/clean look) */}
                  <div className="space-y-2 mb-4 hidden sm:block bg-slate-50/50 dark:bg-slate-950/30 p-3 rounded-lg border border-slate-100 dark:border-slate-800/50">
                    {type.features.slice(0, 2).map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${type.gradient}`} />
                        <span className="text-slate-600 dark:text-slate-400 truncate">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Selection Indicator */}
                   <div className={`w-full mt-auto pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-60'}`}>
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1">
                           <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                           Length
                        </span>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                           {type.recommendedLength.split(' ')[0]}
                        </span>
                   </div>
                </div>
              </Card>
            </motion.button>
          );
        })}
      </div>

      {/* Helper Info */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-100 dark:border-blue-800/50 rounded-xl p-5 flex gap-4 items-start shadow-sm"
      >
         <div className="shrink-0 mt-1 p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full">
            <Search className="h-4 w-4 text-blue-600 dark:text-blue-400" />
         </div>
         <div className="text-sm text-blue-900 dark:text-blue-100">
            <p className="font-bold mb-1 text-blue-700 dark:text-blue-300">Bingung pilih yang mana?</p>
            <p className="opacity-90 leading-relaxed">
              Pilih <span className="font-bold text-blue-700 dark:text-blue-300">Email Lamaran</span> jika kamu baru melamar kerja. 
            </p>
         </div>
      </motion.div>
    </div>
  );
}
