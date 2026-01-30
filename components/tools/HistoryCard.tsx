"use client";

import { motion } from "framer-motion";
import { ArrowRight, LucideIcon } from "lucide-react";
import { MagicCard } from "@/components/ui/magic-card";

interface HistoryCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    onClick: () => void;
    buttonText?: string;
    gradientFrom?: string;
    gradientTo?: string;
}

export function HistoryCard({
    title,
    description,
    icon: Icon,
    onClick,
    buttonText = "Buka Riwayat",
    gradientFrom = "#3b82f6", // Default blue-500
    gradientTo = "#1d4ed8",   // Default blue-700
}: HistoryCardProps) {
    return (
        <div className="w-full group cursor-pointer" onClick={onClick}>
            <div className="relative overflow-hidden rounded-3xl bg-[#0A0A0A] border border-white/5 p-1">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative bg-[#0A0A0A] rounded-[22px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
                    {/* Background Glow */}
                    <div
                        className="absolute top-1/2 left-0 -translate-y-1/2 w-32 h-32 blur-[80px] opacity-20 transition-opacity duration-500 group-hover:opacity-40"
                        style={{ backgroundColor: gradientFrom }}
                    />

                    <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
                        <div className="relative shrink-0">
                            <div className="absolute inset-0 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" style={{ backgroundColor: gradientFrom }} />
                            <div className="relative h-16 w-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                <Icon className="h-7 w-7 text-white" />
                            </div>
                        </div>

                        <div className="flex-1">
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-400 transition-all">
                                {title}
                            </h3>
                            <p className="text-zinc-500 text-sm md:text-base max-w-lg font-medium leading-relaxed group-hover:text-zinc-400 transition-colors">
                                {description}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 relative z-10 w-full md:w-auto">
                        <div className="px-6 py-3 rounded-xl bg-zinc-900 border border-white/5 text-sm font-semibold text-zinc-300 group-hover:bg-white group-hover:text-black transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] w-full md:w-auto">
                            {buttonText}
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
