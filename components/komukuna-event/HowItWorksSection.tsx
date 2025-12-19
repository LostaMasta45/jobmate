"use client";

import { motion } from 'framer-motion';
import { MessageCircle, FileCheck, Palette, Camera } from 'lucide-react';

const steps = [
    {
        icon: MessageCircle,
        title: '1. Chat & Cek Tanggal',
        desc: 'Hubungi admin via WhatsApp untuk memastikan tanggal acara Anda masih tersedia.'
    },
    {
        icon: FileCheck,
        title: '2. Booking & DP',
        desc: 'Amankan jadwal dengan DP ringan. Sisa pembayaran bisa dilunasi saat Hari H.'
    },
    {
        icon: Palette,
        title: '3. Diskusi Desain',
        desc: 'Tim desain kami akan membuatkan template frame sesuai tema/undangan Anda.'
    },
    {
        icon: Camera,
        title: '4. Hari H Acara',
        desc: 'Crew stand by 60 menit sebelum acara. Pemasangan alat rapi & siap beraksi!'
    }
];

export default function HowItWorksSection() {
    return (
        <section className="py-20 bg-[#0F0F0F] relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">

                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Cara Booking Mudah</h2>
                    <p className="text-gray-400">4 Langkah sederhana menuju momen tak terlupakan.</p>
                </div>

                <div className="grid md:grid-cols-4 gap-8">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            className="relative flex flex-col items-center text-center group"
                        >
                            {/* Connector Line (Desktop) */}
                            {i !== steps.length - 1 && (
                                <div className="hidden md:block absolute top-8 left-1/2 w-full h-[2px] bg-gradient-to-r from-komukuna-pink/50 to-transparent -z-10" />
                            )}

                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 group-hover:border-komukuna-pink/50">
                                <step.icon className="text-komukuna-pink w-8 h-8" />
                            </div>

                            <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed max-w-[200px]">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
