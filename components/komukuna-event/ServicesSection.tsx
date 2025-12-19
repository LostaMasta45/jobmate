"use client";

import { motion } from 'framer-motion';
import { Camera, Aperture, Check } from 'lucide-react';

export default function ServicesSection() {
    return (
        <section id="services" className="py-24 bg-komukuna-dark relative">
            <div className="container mx-auto px-4 md:px-6">

                {/* Intro: Problem & Solution (Updated per Plan) */}
                <div className="text-center mb-24 space-y-6 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            Pernah Datang ke Acara yang <span className="text-gray-500 line-through decoration-komukuna-pink/50">Membosankan</span>?
                        </h2>
                        <p className="text-xl text-gray-400">
                            Tamu hanya duduk, makan, lalu pulang? <br />
                            <span className="text-white font-semibold">Komukuna Event</span> mengubah "waktu tunggu" menjadi "waktu seru". Kami menghadirkan studio foto mini dan panggung red carpet ke dalam venue Anda.
                        </p>
                    </motion.div>
                </div>

                <div className="space-y-32">

                    {/* SERVICE 1: PHOTOBOOTH */}
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="order-2 lg:order-1"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 text-sm font-medium mb-6">
                                <Camera size={16} /> Photobooth
                            </div>
                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                Cetak 15 Detik. Kualitas Studio. Wajah Glowing.
                            </h3>
                            <p className="text-gray-400 text-lg leading-relaxed mb-8">
                                Biarkan tamu Anda membawa pulang souvenir terbaik berupa foto cetak berkualitas studio.
                                Dilengkapi dengan properti seru dan pencahayaan profesional, dijamin setiap senyum terlihat glowing.
                            </p>
                            <ul className="space-y-4 mb-8">
                                {[
                                    'Kamera DSLR & Lighting Studio Professional',
                                    'Cetak 4R High-Quality dalam 15 Detik',
                                    'Unlimited Session & Print',
                                    'Softcopy Full via Google Drive'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start text-gray-300">
                                        <Check className="w-5 h-5 text-komukuna-pink mr-3 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="order-1 lg:order-2 relative"
                        >
                            <div className="relative aspect-[4/3] bg-gray-800 rounded-2xl overflow-hidden border border-white/10 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-gray-500">
                                    <div className="text-center">
                                        <Camera size={48} className="mx-auto mb-2 opacity-50" />
                                        <span className="text-sm">Contoh Hasil Foto (Landscape/4R)</span>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -bottom-6 -left-6 w-2/3 h-2/3 bg-gray-800 rounded-2xl border border-white/10 shadow-xl -rotate-6 hover:-rotate-3 transition-transform duration-500 z-[-1]">
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-gray-600">
                                    <span className="text-xs">Foto 2</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* SERVICE 2: 360 VIDEOBOOTH */}
                    <div className="grid lg:grid-cols-2 gap-12 items-center">

                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="flex justify-center"
                        >
                            <div className="relative w-[300px] h-[600px] bg-gray-900 rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden ring-1 ring-white/10">
                                <div className="absolute inset-0 bg-black flex items-center justify-center">
                                    <div className="text-center text-gray-500">
                                        <Aperture size={48} className="mx-auto mb-4 animate-spin-slow opacity-50 text-komukuna-purple" />
                                        <p className="text-sm px-8">Video 360 Vertical (9:16)</p>
                                        <p className="text-xs mt-2 opacity-50">Video akan dimuat disini</p>
                                    </div>
                                </div>
                                <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                                        <div className="w-4 h-4 rounded bg-red-500 animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-sm font-medium mb-6">
                                <Aperture size={16} /> 360 Videobooth
                            </div>
                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                Video Slow-Mo. Musik Custom. Langsung Share.
                            </h3>
                            <p className="text-gray-400 text-lg leading-relaxed mb-8">
                                Tingkatkan level acara Anda dengan video slow-motion 360 derajat ala selebriti red carpet.
                                Hasil video bisa langsung diunduh tamu via QR Code tepat setelah mereka turun dari panggung.
                            </p>
                            <ul className="space-y-4 mb-8">
                                {[
                                    'Hasil Video High Resolution & Smooth Slow-Mo',
                                    'Overlay Musik & Efek Visual Custom',
                                    'Sharing Instan via QR Code & AirDrop',
                                    'Lighting RGB Ring Light Besar'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start text-gray-300">
                                        <Check className="w-5 h-5 text-komukuna-purple mr-3 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                    </div>

                </div>

            </div>
        </section>
    );
}
