'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { User, CheckCircle, ChevronRight, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface CompleteProfileBannerProps {
    completionPercentage?: number;
}

export function CompleteProfileBanner({ completionPercentage = 45 }: CompleteProfileBannerProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 p-1 shadow-xl"
        >
            {/* Glossy Border Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-50 pointer-events-none" />

            <div className="relative bg-gray-900/40 backdrop-blur-xl rounded-[22px] p-6 sm:p-8 overflow-hidden">
                {/* Background Decorative Elements */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8">

                    {/* Left: Icon & Progress Circle Visual */}
                    <div className="relative flex-shrink-0">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center shadow-inner backdrop-blur-sm">
                            <User className="w-10 h-10 text-white/90" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg border-2 border-gray-900">
                            {completionPercentage}%
                        </div>
                    </div>

                    {/* Middle: Content */}
                    <div className="flex-1 text-center md:text-left space-y-3">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-1">
                                Lengkapi Profilmu, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">Raih Peluang!</span>
                            </h3>
                            <p className="text-blue-100/80 text-sm max-w-lg mx-auto md:mx-0 leading-relaxed">
                                Profil yang lengkap meningkatkan peluang dilirik rekruter hingga <span className="font-bold text-white">3x lipat</span>. Yuk, update sekarang!
                            </p>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full max-w-md mx-auto md:mx-0 space-y-1.5">
                            <div className="flex justify-between text-xs font-semibold text-blue-200/70">
                                <span>Kelengkapan Profil</span>
                                <span>{completionPercentage}%</span>
                            </div>
                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${completionPercentage}%` }}
                                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right: CTA Button */}
                    <div className="flex-shrink-0">
                        <Link href="/vip/profile/edit">
                            <Button
                                size="lg"
                                className="bg-white text-indigo-900 hover:bg-blue-50 hover:scale-105 transition-all font-bold shadow-lg group rounded-xl px-8"
                            >
                                Edit Profil
                                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>

                </div>
            </div>
        </motion.div>
    );
}
