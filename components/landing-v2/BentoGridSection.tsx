"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { FileText, Mail, CheckSquare, MessageSquare, Download, Sparkles } from "lucide-react";

const features = [
  {
    title: "CV ATS Friendly",
    description: "Buat CV yang lolos sistem seleksi otomatis. Template teruji dan mudah diedit.",
    Icon: FileText,
    iconColor: "text-brand",
    className: "md:col-span-2 md:row-span-2",
    background: (
      <div className="absolute right-0 bottom-0 h-full w-1/2 bg-gradient-to-l from-brand/10 to-transparent pointer-events-none" />
    ),
  },
  {
    title: "Auto Email Lamaran",
    description: "Generate body email lamaran profesional dalam hitungan detik.",
    Icon: Mail,
    iconColor: "text-purple-500",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Job Tracker",
    description: "Pantau status lamaranmu. Jangan sampai lupa follow-up!",
    Icon: CheckSquare,
    iconColor: "text-green-500",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Interview Guide",
    description: "Panduan lengkap menjawab pertanyaan interview tersulit.",
    Icon: MessageSquare,
    iconColor: "text-yellow-500",
    className: "md:col-span-3 md:row-span-1",
    background: (
      <div className="absolute right-4 top-4 p-2 bg-yellow-500/10 rounded-full">
        <Sparkles className="w-4 h-4 text-yellow-500" />
      </div>
    ),
  },
];

export const BentoGridSection = () => {
  return (
    <section className="py-24 bg-black text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl bg-brand/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Semua Tools dalam <span className="text-brand">Satu Platform</span>
            </h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
                Tinggalkan cara lama. Gunakan tools modern untuk mempercepat karirmu.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[minmax(180px,auto)]">
            <BentoItem
                title="CV ATS Friendly"
                description="Buat CV yang lolos sistem seleksi otomatis. Template teruji dan mudah diedit."
                Icon={FileText}
                iconColor="text-brand"
                className="md:col-span-2 md:row-span-2"
                background={
                  <div className="absolute right-0 bottom-0 h-full w-1/2 bg-gradient-to-l from-brand/10 to-transparent pointer-events-none" />
                }
            />
            <BentoItem
                title="Auto Email Lamaran"
                description="Generate body email lamaran profesional dalam hitungan detik."
                Icon={Mail}
                iconColor="text-purple-500"
                className="md:col-span-1 md:row-span-1"
            />
            <BentoItem
                title="Job Tracker"
                description="Pantau status lamaranmu. Jangan sampai lupa follow-up!"
                Icon={CheckSquare}
                iconColor="text-green-500"
                className="md:col-span-1 md:row-span-1"
            />
            <BentoItem
                title="Interview Guide"
                description="Panduan lengkap menjawab pertanyaan interview tersulit."
                Icon={MessageSquare}
                iconColor="text-yellow-500"
                className="md:col-span-3 md:row-span-1"
                background={
                  <div className="absolute right-4 top-4 p-2 bg-yellow-500/10 rounded-full">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                  </div>
                }
            />
        </div>
      </div>
    </section>
  );
};

const BentoItem = ({
  title,
  description,
  Icon,
  iconColor,
  className,
  background,
}: {
  title: string;
  description: string;
  Icon: React.ElementType;
  iconColor?: string;
  className?: string;
  background?: React.ReactNode;
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-brand/50 transition-colors group flex flex-col justify-between",
        className
      )}
    >
      {background}
      
      <div className="relative z-10 mb-4">
        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
            <Icon className={cn("w-6 h-6", iconColor)} />
        </div>
      </div>

      <div className="relative z-10">
        <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-brand transition-colors">
            {title}
        </h3>
        <p className="text-sm text-neutral-400">
            {description}
        </p>
      </div>
    </motion.div>
  );
};
