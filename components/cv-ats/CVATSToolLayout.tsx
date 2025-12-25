"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackgroundPattern } from "@/components/ui/background-pattern";

interface CVATSToolLayoutProps {
    title: string;
    description: string;
    icon?: React.ElementType;
    color?: string; // e.g., "text-purple-500"
    theme?: 'green' | 'blue' | 'red' | 'purple';
    children: React.ReactNode;
    onBack?: () => void;
}

export function CVATSToolLayout({
    title,
    description,
    icon: Icon,
    color,
    theme = 'purple',
    children,
    onBack
}: CVATSToolLayoutProps) {
    return (
        <div className="h-full w-full bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white font-sans selection:bg-purple-500/30 relative transition-colors duration-500 flex flex-col overflow-hidden">
            {/* Ambient Background Effects */}
            <div className={`absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-${theme}-600/10 dark:bg-${theme}-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen opacity-50 dark:opacity-100 fixed`} />
            <div className={`absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 dark:bg-blue-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-screen opacity-50 dark:opacity-100 fixed`} />
            <BackgroundPattern theme={theme as any} />

            <div className="w-full h-full px-4 md:px-8 py-4 md:py-8 relative z-10 flex flex-col max-h-screen">
                {/* Header - Fixed Height */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-none flex flex-col md:flex-row items-center md:items-start justify-between mb-4 md:mb-6 gap-4"
                >
                    <div className="flex items-center gap-4 text-center md:text-left">
                        {onBack && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onBack}
                                className="hidden md:flex rounded-full h-10 w-10 bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/20"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        )}
                        <div>
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                                {Icon && (
                                    <div className={`p-2 rounded-xl bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 ${color}`}>
                                        <Icon className="h-5 w-5 md:h-6 md:w-6" />
                                    </div>
                                )}
                                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                                    {title}
                                </h1>
                            </div>
                            <p className="text-slate-500 dark:text-zinc-400 max-w-2xl font-light text-sm md:text-base line-clamp-1">
                                {description}
                            </p>
                        </div>
                    </div>

                    {/* Mobile Back Button */}
                    {onBack && (
                        <Button
                            variant="ghost"
                            onClick={onBack}
                            className="md:hidden w-full rounded-xl bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali ke Menu
                        </Button>
                    )}
                </motion.div>

                {/* Main Content Card with Glassmorphism - Flex Grow & Scrollable */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex-1 w-full rounded-3xl bg-white/60 dark:bg-zinc-900/40 border border-slate-200/60 dark:border-white/5 backdrop-blur-xl shadow-sm dark:shadow-2xl overflow-hidden flex flex-col min-h-0"
                >
                    <div className="h-full overflow-y-auto p-4 md:p-8 scrollbar-hide">
                        {children}
                    </div>
                </motion.div>

                {/* Footer - Fixed Height */}
                <div className="flex-none flex justify-center mt-4 opacity-50 hover:opacity-100 transition-opacity">
                    <p className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-zinc-600 cursor-default">
                        <Zap className="h-3 w-3 fill-slate-300 dark:fill-white/10" />
                        JobMate CV Engine v3.0
                    </p>
                </div>
            </div>
        </div>
    );
}
