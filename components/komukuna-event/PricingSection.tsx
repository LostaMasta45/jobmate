"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Star, ShieldCheck, Camera, Aperture } from 'lucide-react';
import { Button } from './ui/Button';
import Link from 'next/link';

const photoboothTiers = [
    {
        name: 'SILVER',
        price: 'Rp 1.250.000',
        description: 'Paket hemat untuk keseruan instan.',
        features: [
            'Durasi Sewa Selama 2 Jam',
            '4x Sesi Foto',
            'Free 1x Cetak 4R / 1x Photostrip per Sesi',
            'Tersedia 8 Template Photostrip',
            'Free Fun Property',
            'Free All Soft File Foto',
            'Free Request Background Banner'
        ],
        cta: 'Booking Silver Photobooth',
        isPopular: false,
        theme: 'silver',
    },
    {
        name: 'GOLD',
        price: 'Rp 1.750.000',
        description: 'Paket lengkap dengan opsi cetak lebih banyak & kostum.',
        features: [
            'Durasi Sewa Selama 3 Jam',
            '4x Sesi Foto',
            'Free 1x Cetak 4R / 1x Photostrip / 3x Cetak 2R per Sesi',
            'Tersedia 16 Template Photostrip',
            'Special Property + 3 Kostum Karakter',
            'Free All Soft File Foto',
            'Free Request Background Warna/Banner'
        ],
        cta: 'Booking Gold Photobooth',
        isPopular: true,
        theme: 'gold',
    },
];

const videoboothTiers = [
    {
        name: 'SILVER',
        price: 'Rp 1.250.000',
        description: 'Video 360 standard dengan template ready-to-use.',
        features: [
            'Durasi Sewa Selama 2 Jam',
            'Lighting 4 Spot',
            'Lighting RGB 2 Spot',
            'File Video Sharing / QR Code',
            'Desain Template & Lagu Sudah Disediakan',
            'Fun Property'
        ],
        cta: 'Booking Silver 360',
        isPopular: false,
        theme: 'silver',
    },
    {
        name: 'GOLD',
        price: 'Rp 1.500.000',
        description: 'Video 360 premium dengan template & lagu custom.',
        features: [
            'Durasi Sewa Selama 3 Jam',
            'Lighting 4 Spot',
            'Lighting RGB 2 Spot',
            'File Video Sharing / QR Code',
            'Desain Template & Lagu Bisa Request',
            'Fun Property'
        ],
        cta: 'Booking Gold 360',
        isPopular: true,
        theme: 'gold',
    },
];

export default function PricingSection() {
    const [activeTab, setActiveTab] = useState<'photobooth' | 'videobooth'>('photobooth');

    const currentTiers = activeTab === 'photobooth' ? photoboothTiers : videoboothTiers;

    return (
        <section id="pricing" className="py-24 bg-komukuna-dark relative overflow-hidden">

            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-gradient-to-r from-komukuna-pink/10 to-komukuna-purple/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">

                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Pricelist Spesial</h2>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                        Paket Unlimited yang transparan dan bersahabat. Pilih layanan favoritmu.
                    </p>

                    {/* Toggle Switch */}
                    <div className="inline-flex bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md">
                        <button
                            onClick={() => setActiveTab('photobooth')}
                            className={`relative px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${activeTab === 'photobooth' ? 'bg-komukuna-pink text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Camera size={16} /> Photobooth
                        </button>
                        <button
                            onClick={() => setActiveTab('videobooth')}
                            className={`relative px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${activeTab === 'videobooth' ? 'bg-komukuna-purple text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Aperture size={16} /> Video Booth 360
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto min-h-[600px]">
                    <AnimatePresence mode="wait">
                        {currentTiers.map((tier, index) => (
                            <motion.div
                                key={`${activeTab}-${tier.name}`}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className={`relative rounded-[2rem] p-8 md:p-10 border flex flex-col transition-all duration-300 group
                    ${tier.isPopular
                                        ? 'bg-gradient-to-b from-white/10 to-white/5 border-komukuna-pink/50 shadow-[0_0_50px_rgba(232,92,144,0.15)] ring-1 ring-komukuna-pink/30'
                                        : 'bg-white/5 border-white/10 hover:border-white/20'
                                    }
                  `}
                            >
                                {tier.isPopular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-komukuna-pink to-komukuna-purple rounded-full text-white text-[10px] font-bold uppercase tracking-widest shadow-xl flex items-center gap-1.5 z-20">
                                        <Star size={12} fill="currentColor" /> Best Seller
                                    </div>
                                )}

                                <div className="mb-8 text-center md:text-left">
                                    <h3 className={`text-xl font-bold mb-2 tracking-wide ${tier.isPopular ? 'text-komukuna-pink' : 'text-gray-300'}`}>{tier.name}</h3>
                                    <div className="text-4xl font-extrabold text-white mb-3">{tier.price}</div>
                                    <p className="text-gray-400 text-sm leading-relaxed">{tier.description}</p>
                                </div>

                                <div className="flex-1 mb-8">
                                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />
                                    <ul className="space-y-4">
                                        {tier.features.map((feature, i) => (
                                            <li key={i} className="flex items-start text-sm text-gray-300 group-hover:text-white transition-colors">
                                                <div className={`mt-0.5 mr-3 p-0.5 rounded-full shrink-0 ${tier.isPopular ? 'bg-komukuna-pink/20 text-komukuna-pink' : 'bg-gray-700 text-gray-400'}`}>
                                                    <Check size={12} strokeWidth={3} />
                                                </div>
                                                <span className="leading-snug">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <Button
                                    variant={tier.isPopular ? 'gradient' : 'outline'}
                                    className="w-full h-14 text-base font-bold tracking-wide shadow-lg"
                                    asChild
                                >
                                    <Link
                                        href={`https://wa.me/6289676111118?text=Halo Komukuna, saya mau booking paket *${tier.name} ${activeTab === 'photobooth' ? 'Photobooth' : 'Video 360'}*.`}
                                        target="_blank"
                                    >
                                        {tier.cta}
                                    </Link>
                                </Button>

                                {tier.isPopular && (
                                    <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-komukuna-pink/80 font-medium opacity-80">
                                        <ShieldCheck size={12} /> Unlimited Session Guaranteed
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <p className="text-center text-gray-500 text-sm mt-12 bg-white/5 inline-block px-6 py-3 rounded-full mx-auto backdrop-blur-sm border border-white/5 mx-4">
                    💡 <span className="text-gray-300 font-medium">Butuh Paket Custom?</span> Hubungi kami di 0896-7611-1118
                </p>

            </div>
        </section>
    );
}
