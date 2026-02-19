"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles, MessageSquare, Mail, CheckCircle2, Shield, Zap,
    Briefcase, Star, FileText, LayoutDashboard, Award, FileEdit,
    FolderOpen, User, MessageCircle, Check, Plus, Minus,
} from "lucide-react";
import { WaitlistForm } from "./WaitlistForm";

/* ── HERO ─────────────────────────────────────────────── */
const HeroSection = () => (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-24 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_-20%,rgba(120,119,198,0.3),transparent)]" />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]" />
        <div className="max-w-6xl mx-auto px-4 relative z-10 w-full">
            <div className="text-center space-y-6 max-w-3xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 backdrop-blur-md">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-semibold text-amber-200">🚀 SEGERA HADIR — Batch Pertama Terbatas!</span>
                </motion.div>

                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
                    JANGAN KETINGGALAN <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-purple-500">INFO LOKER VALID</span> <br />
                    <span className="text-2xl sm:text-3xl md:text-4xl font-medium text-neutral-300">LANGSUNG KE WA-MU!</span>
                </motion.h1>

                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-neutral-400 max-w-xl mx-auto leading-relaxed">
                    Daftar sekarang jadi <strong className="text-white">orang pertama</strong> yang dapat akses Grup WA Career VIP — update lowongan valid setiap hari. <strong className="text-amber-400">GRATIS!</strong>
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <WaitlistForm id="hero-form" />
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex items-center justify-center gap-6 text-sm text-neutral-500 flex-wrap">
                    {["✅ Info Valid", "⚡ Update Harian", "🔒 Data Aman"].map((b, i) => <span key={i}>{b}</span>)}
                </motion.div>
            </div>
        </div>
    </section>
);

/* ── PAIN POINTS + APA ITU VIP (MERGED) ──────────────── */
const ProblemSolutionSection = () => (
    <section className="py-20 bg-neutral-950 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 relative z-10">
            {/* Pain Points - Compact */}
            <div className="text-center mb-12">
                <span className="inline-block px-4 py-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-300 text-sm font-medium mb-4">⚠️ Masalah Pencari Kerja</span>
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Kamu Pasti Pernah <span className="text-rose-500">Merasakan Ini...</span></h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-16">
                {[
                    { emoji: "😩", title: "Info Gak Jelas" },
                    { emoji: "😕", title: "Loker Expired" },
                    { emoji: "😴", title: "Notif Numpuk" },
                    { emoji: "😔", title: "Hasil Nihil" },
                    { emoji: "😓", title: "Ribet Multi-Platform" },
                ].map((c, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                        className="bg-neutral-900/60 border border-white/10 p-5 rounded-2xl text-center hover:border-white/20 transition-colors group">
                        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{c.emoji}</div>
                        <p className="text-sm font-medium text-neutral-300">{c.title}</p>
                    </motion.div>
                ))}
            </div>

            {/* Divider hook */}
            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="max-w-2xl mx-auto text-center bg-gradient-to-r from-brand/10 to-purple-900/10 border border-brand/20 rounded-2xl p-6 mb-16 backdrop-blur-sm">
                <p className="text-lg font-bold">💡 Solusinya? <span className="text-brand">JOMBANG CAREER VIP</span></p>
            </motion.div>

            {/* Apa Itu VIP - 4 Benefit Cards Compact */}
            <div className="text-center mb-8">
                <h2 className="text-3xl md:text-5xl font-bold">Grup WhatsApp <span className="text-brand">&quot;Career VIP&quot;</span></h2>
                <p className="text-neutral-400 mt-3 max-w-2xl mx-auto">Akses ke <strong className="text-white">ratusan lowongan kerja valid</strong> di Jombang & sekitarnya, langsung ke WA-mu setiap hari.</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { emoji: "🚫", title: "Stop Capek Scroll", desc: "Info langsung ke WA-mu" },
                    { emoji: "✅", title: "100% Terverifikasi", desc: "Loker valid dari tim kami" },
                    { emoji: "📱", title: "Satu Tempat", desc: "Semua di satu grup WA" },
                    { emoji: "🔔", title: "Update Harian", desc: "Peluang baru setiap hari" },
                ].map((f, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                        className="bg-neutral-900/50 border border-white/10 p-6 rounded-2xl hover:border-brand/40 transition-colors group">
                        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{f.emoji}</div>
                        <h4 className="font-bold text-white mb-1">{f.title}</h4>
                        <p className="text-sm text-neutral-400">{f.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

/* ── KENAPA VIP + STATS (COMPACT) ────────────────────── */
const WhyVIPSection = () => (
    <section className="py-20 bg-gradient-to-b from-neutral-950 to-black relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-brand/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                    <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-green-500 mb-4">
                        <MessageCircle className="w-4 h-4 fill-green-500" /><span className="text-sm font-medium">Komunitas Karir Terbesar</span>
                    </motion.div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">Bukan Sekadar Tools. <br /><span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">Akses Info Loker Valid.</span></h2>
                    <div className="space-y-3 mt-6">
                        {[
                            { icon: Zap, text: "Update puluhan loker valid setiap hari", color: "text-yellow-400" },
                            { icon: Shield, text: "Bebas penipuan, scam & iklan", color: "text-green-400" },
                            { icon: Briefcase, text: "Filter sesuai kualifikasi & gaji", color: "text-blue-400" },
                            { icon: Star, text: "Prioritas info sebelum publik", color: "text-purple-400" },
                        ].map((b, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                                <div className={`p-1.5 bg-white/5 rounded-lg ${b.color}`}><b.icon className="w-4 h-4" /></div>
                                <p className="text-sm text-neutral-300 font-medium">{b.text}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { value: "203K+", label: "Follower", gradient: "from-brand/20 to-blue-600/20", border: "border-brand/30" },
                        { value: "50+", label: "Loker / Hari", gradient: "from-purple-500/20 to-pink-600/20", border: "border-purple-500/30" },
                        { value: "1.5K+", label: "Member VIP", gradient: "from-emerald-500/20 to-teal-600/20", border: "border-emerald-500/30" },
                        { value: "100%", label: "Verified", gradient: "from-amber-500/20 to-orange-600/20", border: "border-amber-500/30" },
                    ].map((s, i) => (
                        <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                            className={`bg-gradient-to-br ${s.gradient} border ${s.border} rounded-2xl p-6 text-center hover:scale-105 transition-transform`}>
                            <p className="text-3xl md:text-4xl font-extrabold text-white mb-1">{s.value}</p>
                            <p className="text-sm text-neutral-400">{s.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    </section>
);

/* ── COMPARISON TABLE (COMPACT) ──────────────────────── */
const ComparisonSection = () => (
    <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
                Jangan Biarkan Karirmu <span className="text-red-500 line-through decoration-2">Stuck</span>
            </h2>
            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                <div className="min-w-[500px] bg-neutral-900/30 border border-white/10 rounded-2xl overflow-hidden">
                    <div className="grid grid-cols-12 gap-2 py-3 px-4 bg-white/5 border-b border-white/10 text-sm font-bold">
                        <div className="col-span-4 text-neutral-400">Fitur</div>
                        <div className="col-span-4 text-center text-neutral-500">Manual</div>
                        <div className="col-span-4 text-center text-brand">VIP ✨</div>
                    </div>
                    {[
                        ["Info Loker", "Scroll IG/FB", "Langsung WA"],
                        ["Kualitas", "Banyak Hoax", "100% Valid"],
                        ["CV Template", "Cari Sendiri", "ATS Generator"],
                        ["Surat Lamaran", "Manual", "Auto Generator"],
                        ["Job Tracker", "❌ Tidak Ada", "Kanban Board"],
                        ["Interview Guide", "Cari Sendiri", "Checklist HRD"],
                        ["Biaya", "Buang Waktu", "Terjangkau"],
                    ].map(([label, old, now], i) => (
                        <div key={i} className="grid grid-cols-12 gap-2 py-3 px-4 border-b border-white/5 last:border-none text-sm hover:bg-white/5 transition-colors">
                            <div className="col-span-4 text-white font-medium">{label}</div>
                            <div className="col-span-4 text-center text-neutral-500">{old}</div>
                            <div className="col-span-4 text-center text-brand font-semibold flex items-center justify-center gap-1">
                                <Check className="w-3 h-3 hidden md:block" />{now}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
);

/* ── TOOLS JOBMATE (COMPACT GRID) ────────────────────── */
const ToolsSection = () => (
    <section className="py-16 bg-neutral-950 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 relative z-10">
            <div className="text-center mb-10">
                <span className="inline-block text-sm text-brand mb-2">🚀 Eksklusif VIP Premium</span>
                <h2 className="text-3xl md:text-4xl font-bold">Tools <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-purple-500">JobMate</span></h2>
                <p className="text-neutral-400 mt-2 text-sm">Semua yang kamu butuh untuk <strong className="text-white">siap kerja</strong></p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { icon: FileText, title: "CV ATS Generator", color: "text-blue-400" },
                    { icon: Mail, title: "Surat Lamaran", color: "text-purple-400" },
                    { icon: LayoutDashboard, title: "Job Tracker", color: "text-emerald-400" },
                    { icon: MessageSquare, title: "WA Generator", color: "text-green-400" },
                    { icon: Award, title: "Skill Resume", color: "text-amber-400" },
                    { icon: FileEdit, title: "Interview Guide", color: "text-pink-400" },
                    { icon: FolderOpen, title: "PDF Tools", color: "text-red-400" },
                    { icon: User, title: "Profile Builder", color: "text-indigo-400" },
                ].map((t, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                        className="bg-neutral-900/50 border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-all group flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform border border-white/5">
                            <t.icon className={`w-4 h-4 ${t.color}`} />
                        </div>
                        <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">{t.title}</span>
                    </motion.div>
                ))}
            </div>
            <p className="text-center text-xs text-neutral-600 mt-4 italic">* Tersedia saat Career VIP resmi diluncurkan</p>
        </div>
    </section>
);

/* ── MOTIVASI (COMPACT 2-COLUMN) ─────────────────────── */
const MotivationSection = () => (
    <section className="py-16 bg-black">
        <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
                Sekarang Kamu Punya <span className="text-brand">2 Pilihan:</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                <div className="bg-neutral-900 border border-white/10 p-6 rounded-2xl group hover:border-white/20 transition-colors">
                    <div className="text-4xl mb-3 grayscale group-hover:grayscale-0 transition-all">😔</div>
                    <p className="text-neutral-300"><span className="font-bold text-white mr-1">1️⃣</span> Cara lama yang bikin kamu <span className="text-rose-500 font-semibold">jalan di tempat</span>.</p>
                </div>
                <div className="bg-gradient-to-br from-brand/10 to-purple-900/10 border border-brand/50 p-6 rounded-2xl shadow-[0_0_20px_rgba(0,172,199,0.1)] hover:shadow-[0_0_40px_rgba(0,172,199,0.2)] transition-all">
                    <div className="absolute top-3 right-3 bg-brand text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse hidden md:block">Recommended</div>
                    <div className="text-4xl mb-3">🚀</div>
                    <p className="text-white"><span className="font-bold mr-1">2️⃣</span> Jadi <span className="text-brand font-bold">orang pertama</span> yang dapet akses loker <span className="text-brand font-black">VALID</span>!</p>
                </div>
            </div>
        </div>
    </section>
);

/* ── FAQ (COMPACT) ───────────────────────────────────── */
const FAQSection = () => {
    const [active, setActive] = useState<number | null>(null);
    const faqs = [
        { q: "Apakah benar gratis?", a: "Ya! Daftar waitlist 100% gratis. Isi nama & no WA untuk jadi yang pertama tahu saat launching." },
        { q: "Kapan Career VIP diluncurkan?", a: "Dalam waktu dekat! Yang sudah daftar akan mendapat notifikasi pertama + bonus eksklusif saat launching." },
        { q: "Data saya aman?", a: "100% aman. Data hanya digunakan untuk menghubungi kamu saat launching & memberikan link grup WA." },
        { q: "Apa yang saya dapat?", a: "Link Grup WA Eksklusif Waitlist untuk update perkembangan + info bonus pre-launch." },
        { q: "Cocok untuk freshgraduate?", a: "Sangat cocok! Banyak member kami freshgraduate. Tools JobMate punya fitur khusus untuk tanpa pengalaman." },
    ];
    return (
        <section className="py-16 bg-neutral-950">
            <div className="max-w-2xl mx-auto px-4">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Sering Ditanyakan</h2>
                <div className="space-y-2">
                    {faqs.map((faq, i) => (
                        <div key={i} className="border border-white/5 rounded-xl overflow-hidden bg-neutral-900/30">
                            <button onClick={() => setActive(active === i ? null : i)} className="w-full py-4 px-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors">
                                <span className="text-sm font-medium text-neutral-200">{faq.q}</span>
                                <span className="ml-3 flex-shrink-0">{active === i ? <Minus className="w-4 h-4 text-brand" /> : <Plus className="w-4 h-4 text-neutral-500" />}</span>
                            </button>
                            <AnimatePresence>
                                {active === i && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                                        <p className="px-5 pb-4 text-sm text-neutral-400 leading-relaxed">{faq.a}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

/* ── FINAL CTA ───────────────────────────────────────── */
const FinalCTASection = () => (
    <section className="py-20 bg-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand/15 blur-[100px] rounded-full pointer-events-none" />
        <div className="max-w-xl mx-auto px-4 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" /><span>🔥 Kuota Terbatas</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Siap Jadi <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-purple-500">Yang Pertama?</span></h2>
            <p className="text-neutral-400 mb-8">Daftar sekarang & dapatkan akses eksklusif saat Career VIP resmi diluncurkan.</p>
            <WaitlistForm id="cta-form" />
            <p className="mt-5 text-xs text-neutral-600">Garansi data aman • Join 203K+ komunitas</p>
        </div>
    </section>
);

/* ── MAIN ────────────────────────────────────────────── */
export default function WaitlistContent() {
    return (
        <main className="min-h-screen bg-black text-white overflow-x-hidden selection:bg-brand selection:text-white font-sans">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand to-purple-600 flex items-center justify-center">
                            <span className="font-bold text-white text-[10px]">JM</span>
                        </div>
                        <span className="font-bold text-white">InfoLokerJombang <span className="text-brand">VIP</span></span>
                    </div>
                    <a href="#cta-form" className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-brand text-white font-semibold text-sm hover:bg-brand/90 transition-colors shadow-[0_0_15px_rgba(0,172,199,0.3)]">
                        Daftar Waitlist
                    </a>
                </div>
            </nav>

            {/* Background */}
            <div className="fixed inset-0 z-[-1] bg-black pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.12),transparent)]" />
            </div>

            <HeroSection />
            <ProblemSolutionSection />
            <WhyVIPSection />
            <ComparisonSection />
            <ToolsSection />
            <MotivationSection />
            <FAQSection />
            <FinalCTASection />

            {/* Footer */}
            <footer className="py-6 bg-neutral-950 border-t border-white/5 text-center">
                <p className="text-xs text-neutral-600">© 2026 InfoLokerJombang Career VIP. All rights reserved.</p>
            </footer>
        </main>
    );
}
