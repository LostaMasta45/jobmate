"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
    {
        q: "Berapa kebutuhan listrik untuk Photobooth/Videobooth?",
        a: "Untuk keamanan alat, kami membutuhkan daya minimal 1500-2000 Watt. Pastikan venue menyediakan satu stopkontak khusus dekat area booth."
    },
    {
        q: "Apakah butuh space/ruangan yang luas?",
        a: "Idealnya kami membutuhkan area kosong ukuran 3x3 meter agar tamu leluasa bergaya dan antrian tetap rapi."
    },
    {
        q: "Apakah bisa request desain frame/overlay?",
        a: "Tentu! Harga paket sudah termasuk jasa desain custom. Anda bisa kirimkan file undangan atau tema acara sebagai referensi."
    },
    {
        q: "Bagaimana jika durasi acara lebih dari paket?",
        a: "Bisa extend (tambah jam) dengan biaya tambahan per jam. Sebaiknya info di awal atau minimal 1 jam sebelum durasi habis."
    },
    {
        q: "Apakah melayani acara di luar kota?",
        a: "Ya, kami melayani Jabodetabek dan sekitarnya. Untuk lokasi di luar jangkauan standar, akan ada biaya transportasi tambahan."
    }
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-20 bg-komukuna-dark border-t border-white/5">
            <div className="container mx-auto px-4 max-w-3xl">

                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-white mb-2">Pertanyaan Umum</h2>
                    <p className="text-gray-400 text-sm">Hal-hal teknis yang sering ditanyakan.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div key={i} className="border border-white/10 rounded-xl bg-white/[0.02] overflow-hidden">
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                            >
                                <span className={`font-medium ${openIndex === i ? 'text-komukuna-pink' : 'text-gray-200'}`}>
                                    {faq.q}
                                </span>
                                {openIndex === i ? <Minus size={18} className="text-komukuna-pink shrink-0" /> : <Plus size={18} className="text-gray-500 shrink-0" />}
                            </button>

                            <AnimatePresence>
                                {openIndex === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="p-5 pt-0 text-gray-400 text-sm leading-relaxed border-t border-dashed border-white/10 mt-2">
                                            {faq.a}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
