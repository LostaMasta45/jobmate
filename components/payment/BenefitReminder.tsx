"use client";

import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, Sparkles, FileText, Mail, Trophy, Users, MessageSquare, BarChart3, Zap, Crown } from "lucide-react";

interface BenefitReminderProps {
  plan: 'basic' | 'premium';
}

export function BenefitReminder({ plan }: BenefitReminderProps) {
  const basicBenefits = [
    { icon: Users, text: "Akses Grup WhatsApp Career VIP InfoLokerJombang" },
    { icon: Zap, text: "Web Job Portal VIP dengan filter advanced" },
    { icon: FileText, text: "Bonus 5+ Template CV ATS-friendly" },
    { icon: BarChart3, text: "Update lowongan kerja harian" },
    { icon: CheckCircle2, text: "Info verified & terpercaya dari HRD langsung" },
  ];

  const premiumBenefits = [
    { icon: Crown, text: "Semua fitur VIP Basic" },
    { icon: FileText, text: "CV ATS Generator dengan AI (unlimited)" },
    { icon: Mail, text: "Template Surat Lamaran & Email Lamaran" },
    { icon: BarChart3, text: "Job Application Tracker (Kanban Board)" },
    { icon: Trophy, text: "Interview Checklist & Panduan Jawab Pertanyaan HRD" },
    { icon: Sparkles, text: "Skill-Based Resume Generator" },
    { icon: MessageSquare, text: "WhatsApp Message Generator untuk follow-up" },
    { icon: FileText, text: "Merge & Convert PDF Tools (unlimited)" },
    { icon: Users, text: "Profile Builder & Portfolio Generator" },
    { icon: Zap, text: "Akses Seumur Hidup (Lifetime Access)" },
  ];

  const benefits = plan === 'premium' ? premiumBenefits : basicBenefits;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="benefits" className="border-2 border-amber-300/50 dark:border-amber-700/50 rounded-2xl px-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <span className="font-bold text-lg">
                Yang Anda Dapatkan ({benefits.length}+ Benefit)
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 pb-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="flex items-start gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <benefit.icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-sm leading-relaxed text-foreground">
                    {benefit.text}
                  </p>
                </motion.div>
              ))}
            </div>
            
            {plan === 'premium' && (
              <div className="mt-4 p-4 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-lg border-2 border-amber-300 dark:border-amber-700">
                <p className="text-sm font-bold text-center text-foreground">
                  🔥 Bonus: Akses semua update & fitur baru di masa depan!
                </p>
                <p className="text-xs text-center text-muted-foreground mt-1">
                  Lifetime access = investasi 1x, benefit selamanya
                </p>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  );
}
