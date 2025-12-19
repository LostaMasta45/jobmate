"use client";

import { motion } from 'framer-motion';
import { PencilRuler, Type, Image as ImageIcon, Layers } from 'lucide-react';

const features = [
    { icon: PencilRuler, title: 'Frame Custom', desc: 'Desain bingkai foto dan overlay video 100% mengikuti tema acara Anda.' },
    { icon: Type, title: 'Teks Personal', desc: 'Tambahkan nama pengantin, tanggal, atau hashtag acara di setiap hasil.' },
    { icon: ImageIcon, title: 'Integrasi Logo', desc: 'Tampilkan logo perusahaan atau monogram wedding Anda dengan elegan.' },
];

export default function USPSection() {
    return (
        <section id="usp" className="py-24 bg-[#0A0A0A] relative overflow-hidden">

            {/* Background Decorative Blob */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-komukuna-purple/20 blur-[100px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div>
                            <h4 className="text-komukuna-pink font-semibold tracking-wider uppercase mb-2">Unique Selling Point</h4>
                            {/* Updated Headlines per Copywriting Plan */}
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                Bukan Sekadar Tempel Logo.
                            </h2>
                            <h3 className="text-2xl text-gray-300 font-medium mb-6">
                                Kami Desain Template Eksklusif Sesuai Tema Acara Anda.
                            </h3>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                Kami tidak hanya mencetak foto; kami menciptakan souvenir bermerek.
                                Template Komukuna bukan template pasaran. Setiap print dan video menjadi cerminan unik dari identitas acara Anda.
                            </p>
                        </div>

                        <div className="grid gap-6">
                            {features.map((f, i) => (
                                <div key={i} className="flex gap-4 items-start">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 text-komukuna-purple border border-white/10">
                                        <f.icon size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg">{f.title}</h4>
                                        <p className="text-gray-500 text-sm">{f.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right: Visual Showcase */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                            {/* Mockup UI */}
                            <div className="absolute inset-0 flex items-center justify-center text-gray-600 font-mono text-sm group-hover:bg-black/40 transition-colors">
                                <div className="text-center group-hover:scale-105 transition-transform duration-500">
                                    <Layers size={48} className="mx-auto mb-4 text-komukuna-pink/50" />
                                    <p className="text-gray-400 font-bold mb-1">Preview Template Editor</p>
                                    <span className="text-xs opacity-50 px-8 block">Gambaran bagaimana layout foto bisa berbeda-beda</span>
                                </div>
                            </div>

                            {/* Floating Elements Animation */}
                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-10 right-10 bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10 w-40 shadow-xl"
                            >
                                <div className="flex gap-2 mb-3">
                                    <div className="w-3 h-3 rounded-full bg-red-400/20" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400/20" />
                                    <div className="w-3 h-3 rounded-full bg-green-400/20" />
                                </div>
                                <div className="space-y-2">
                                    <div className="h-2 w-full bg-komukuna-pink rounded opacity-80" />
                                    <div className="h-2 w-2/3 bg-gray-600 rounded opacity-50" />
                                </div>
                            </motion.div>

                            {/* Second Floating Element */}
                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute bottom-10 left-10 bg-komukuna-purple/90 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 shadow-xl text-xs text-white"
                            >
                                ✨ Text Layer: "Ryan & Maya"
                            </motion.div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
