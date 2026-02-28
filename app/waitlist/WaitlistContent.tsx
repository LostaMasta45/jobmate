"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import {
    Sparkles, ShieldCheck, Zap, Bot,
    Briefcase, Plus, Minus, CheckCircle2, Star
} from "lucide-react";
import { WaitlistForm } from "./WaitlistForm";

const CompanyLogoMarquee = dynamic(
    () => import("@/components/landing-v2/CompanyLogoMarquee").then(mod => ({ default: mod.CompanyLogoMarquee })),
    { ssr: false }
);

/* ── HERO ─────────────────────────────────────────────── */
const HeroSection = () => (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-20 pb-16">
        {/* Ambient Lights */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-[-10%] w-[400px] h-[400px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 relative z-10 w-full mt-12 sm:mt-0">
            <div className="flex flex-col items-center text-center space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand/30 bg-brand/10 backdrop-blur-md shadow-[0_0_20px_rgba(0,172,199,0.2)]"
                >
                    <Sparkles className="w-4 h-4 text-brand" />
                    <span className="text-xs font-semibold text-brand tracking-wide uppercase">Batch 1 • Segera Hadir</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] text-white"
                >
                    Akses Eksklusif. <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-brand to-purple-500">
                        Peluang Karir Valid.
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed"
                >
                    Tinggalkan cara lama mencari kerja. Bergabung bersama <strong className="text-white">InfoLokerJombang VIP</strong> dan dapatkan akses prioritas ke ratusan lowongan terverifikasi, langsung via WhatsApp.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <WaitlistForm id="hero-form" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm font-medium text-neutral-500 mt-6"
                >
                    {[
                        { icon: ShieldCheck, text: "100% Terverifikasi" },
                        { icon: Zap, text: "Update Harian" },
                        { icon: CheckCircle2, text: "Bebas Penipuan" }
                    ].map((badge, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                            <badge.icon className="w-4 h-4 text-emerald-500" />
                            <span>{badge.text}</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    </section>
);

/* ── VIP FEATURES LIST (FROM SCREENSHOT) ─────────────── */
const VIPFeaturesList = () => {
    const features = [
        { icon: Zap, text: "Update puluhan loker valid setiap hari di Grup WA VIP", color: "text-yellow-400" },
        { icon: ShieldCheck, text: "Bebas penipuan, scam, dan iklan tidak jelas", color: "text-green-500" },
        { icon: Briefcase, text: "Filter loker sesuai kualifikasi & gaji yang layak", color: "text-blue-400" },
        { icon: Star, text: "Prioritas info untuk member VIP sebelum publik", color: "text-purple-400" },
    ];

    return (
        <section className="py-6 bg-black relative z-10 w-full max-w-3xl mx-auto px-4 -mt-12 mb-12">
            <div className="space-y-3">
                {features.map((f, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        key={i}
                        className="flex items-center gap-5 p-5 rounded-2xl bg-neutral-900/60 border border-white/5 hover:border-white/10 hover:bg-neutral-900/80 transition-all backdrop-blur-sm shadow-lg shadow-black/50"
                    >
                        <div className="p-2.5 rounded-full bg-white/5 border border-white/5 shadow-inner">
                            <f.icon className={`w-5 h-5 ${f.color}`} strokeWidth={2} />
                        </div>
                        <p className="text-[15px] sm:text-base font-medium text-neutral-200">{f.text}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

/* ── BENEFITS (BENTO GRID) ───────────────────────────── */
const BenefitsSection = () => (
    <section className="py-24 bg-neutral-950 relative overflow-hidden">
        {/* Separator line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="max-w-5xl mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="text-3xl md:text-5xl font-bold mb-4"
                >
                    Kenapa <span className="text-brand">InfoLokerJombang VIP?</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: 0.1 }}
                    className="text-neutral-400 text-lg max-w-2xl mx-auto"
                >
                    Dirancang eksklusif untuk menghindari loker palsu dan memaksimalkan peluangmu.
                </motion.p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                {/* Large Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="md:col-span-2 relative group rounded-3xl overflow-hidden bg-neutral-900/80 backdrop-blur-sm border border-white/10 p-8 hover:border-brand/40 transition-colors"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand/10 blur-[80px] rounded-full group-hover:bg-brand/20 transition-all duration-700 pointer-events-none" />
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center mb-6 shadow-inner shadow-white/5">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-3">Kurasi Loker Ketat & Valid</h3>
                            <p className="text-neutral-400 leading-relaxed text-sm sm:text-base">
                                Tidak ada lagi loker palsu atau penipuan berkedok rekrutmen. Tim kami memverifikasi setiap informasi lowongan kerja di Jombang & sekitarnya secara manual sebelum dikirimkan kepadamu.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Small Card 1 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="relative group rounded-3xl overflow-hidden bg-neutral-900/80 backdrop-blur-sm border border-white/10 p-8 hover:border-purple-500/40 transition-colors"
                >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 blur-[50px] rounded-full group-hover:bg-purple-500/20 transition-all duration-700 pointer-events-none" />
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-6 shadow-inner shadow-white/5">
                            <Zap className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Via WhatsApp</h3>
                            <p className="text-sm text-neutral-400 leading-relaxed">
                                Info loker terbaru masuk langsung ke genggamanmu tanpa perlu scroll social media.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Small Card 2 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="relative group rounded-3xl overflow-hidden bg-neutral-900/80 backdrop-blur-sm border border-white/10 p-8 hover:border-emerald-500/40 transition-colors"
                >
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-500/10 blur-[50px] rounded-full group-hover:bg-emerald-500/20 transition-all duration-700 pointer-events-none" />
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6 shadow-inner shadow-white/5">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Update Harian</h3>
                            <p className="text-sm text-neutral-400 leading-relaxed">
                                Peluang selalu ada setiap hari, jadilah orang pertama yang mengirimkan lamaran.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Wide Card (Tools) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="md:col-span-3 relative group rounded-3xl overflow-hidden bg-gradient-to-br from-neutral-900/80 to-black border border-white/10 p-8 hover:border-white/20 transition-colors backdrop-blur-sm mt-4"
                >
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                    <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-brand/20 bg-brand/10 mb-5 text-xs font-semibold text-brand tracking-wide">
                                <Bot className="w-3.5 h-3.5" /> Premium Tools
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Ekosistem <span className="text-brand">JobMate</span></h3>
                            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed max-w-lg mb-6">
                                Member <strong className="text-white">InfoLokerJombang VIP</strong> mendapatkan akses penuh ke 8 smart tools eksklusif kami yang dirancang khusus mempermudah proses melamar kerjamu.
                            </p>
                            <div className="flex flex-wrap gap-2 text-xs font-semibold">
                                <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300">CV ATS Generator</span>
                                <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300">Surat Lamaran</span>
                                <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300">Job Tracker</span>
                                <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300">WA Generator</span>
                                <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300">Skill Resume</span>
                                <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300">Interview Guide</span>
                                <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300">PDF Tools</span>
                                <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300">Profile Builder</span>
                            </div>
                        </div>
                        <div className="relative w-full md:w-1/2 flex justify-center group-hover:scale-105 transition-transform duration-700">
                            <div className="w-full h-48 md:h-64 rounded-xl border border-white/10 bg-gradient-to-br from-neutral-900 to-black overflow-hidden flex items-center justify-center p-6 relative">
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent z-10" />

                                {/* Abstract UI Representation */}
                                <div className="w-full space-y-3 opacity-60">
                                    <div className="h-6 w-1/3 bg-brand/20 rounded-md animate-pulse" />
                                    <div className="h-4 w-full bg-white/5 rounded-md" />
                                    <div className="h-4 w-5/6 bg-white/5 rounded-md" />
                                    <div className="h-4 w-4/6 bg-white/5 rounded-md" />

                                    <div className="grid grid-cols-2 gap-3 mt-6">
                                        <div className="h-12 w-full bg-purple-500/10 border border-purple-500/20 rounded-lg" />
                                        <div className="h-12 w-full bg-emerald-500/10 border border-emerald-500/20 rounded-lg" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    </section>
);

/* ── FAQ ─────────────────────────────────────────────── */
const FAQSection = () => {
    const [active, setActive] = useState<number | null>(null);
    const faqs = [
        { q: "Apakah pendaftaran waitlist ini gratis?", a: "Ya! Pendaftaran waitlist ini 100% gratis. Cukup isikan nama dan nomor WhatsApp aktif Anda, lalu bergabung di grup yang disediakan." },
        { q: "Kapan grup VIP ini akan resmi dibuka?", a: "Akan diluncurkan dalam waktu dekat! Member yang mendaftar waitlist akan mendapatkan notifikasi perdana dan bonus eksklusif saat launching." },
        { q: "Bagaimana jaminan keamanan lokernya?", a: "Setiap informasi lowongan akan dikurasi dan diverifikasi secara ketat oleh tim kami untuk memastikan loker tersebut bebas dari penipuan. Anda lebih aman melamar kerja." },
    ];

    return (
        <section className="py-24 bg-black relative">
            <div className="max-w-3xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold">Tanya Jawab</h2>
                </div>
                <div className="space-y-3">
                    {faqs.map((faq, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            key={i}
                            className="border border-white/10 rounded-2xl overflow-hidden bg-neutral-900/40 hover:bg-neutral-900/70 transition-colors backdrop-blur-sm"
                        >
                            <button
                                onClick={() => setActive(active === i ? null : i)}
                                className="w-full py-5 px-6 flex items-center justify-between text-left focus:outline-none"
                            >
                                <span className="text-sm sm:text-base font-semibold text-neutral-200">{faq.q}</span>
                                <span className="ml-4 flex-shrink-0 text-brand">
                                    {active === i ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                </span>
                            </button>
                            <AnimatePresence>
                                {active === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <p className="px-6 pb-6 text-sm sm:text-base text-neutral-400 leading-relaxed border-t border-white/5 pt-4 mt-1">{faq.a}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

/* ── FINAL CTA ───────────────────────────────────────── */
const FinalCTASection = () => (
    <section className="py-24 bg-neutral-950 relative overflow-hidden border-t border-white/10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand/5 blur-[200px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        <div className="max-w-2xl mx-auto px-4 text-center relative z-10">
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-bold mb-6 text-white"
            >
                Amankan <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-purple-500">Posisi Anda</span>
            </motion.h2>
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-base sm:text-lg text-neutral-400 mb-10 leading-relaxed"
            >
                Jadilah bagian dari gelombang pertama yang menikmati terobosan karir eksklusif bersama InfoLokerJombang VIP.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
            >
                <WaitlistForm id="cta-form" />
            </motion.div>
        </div>
    </section>
);

/* ── MAIN ────────────────────────────────────────────── */
export default function WaitlistContent() {
    return (
        <main className="min-h-screen bg-black text-white overflow-x-hidden selection:bg-brand selection:text-white font-sans">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/5 transition-all">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand to-purple-600 flex items-center justify-center shadow-lg shadow-brand/20">
                            <span className="font-extrabold text-white text-[11px] tracking-wider">VIP</span>
                        </div>
                        <span className="font-bold text-lg tracking-tight text-white hidden sm:block">
                            InfoLokerJombang VIP
                        </span>
                    </div>
                </div>
            </header>

            <HeroSection />
            <VIPFeaturesList />
            <BenefitsSection />
            <CompanyLogoMarquee />
            <FAQSection />
            <FinalCTASection />

            {/* Footer */}
            <footer className="py-8 bg-black border-t border-white/5 text-center px-4">
                <p className="text-sm text-neutral-500 tracking-wide font-medium">
                    © {new Date().getFullYear()} InfoLokerJombang VIP. All rights reserved.
                </p>
            </footer>
        </main>
    );
}
