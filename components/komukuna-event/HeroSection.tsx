"use client";

import { Button } from './ui/Button';
import Link from 'next/link';
import { ChevronRight, Play } from 'lucide-react';

export default function HeroSection() {
    return (
        <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden">

            {/* Background - Animated Gradient */}
            <div className="absolute inset-0 bg-komukuna-dark">
                <div className="absolute inset-0 bg-gradient-to-br from-komukuna-purple/20 via-komukuna-dark to-komukuna-pink/10 opacity-60" />
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-komukuna-purple/30 blur-[120px] animate-pulse-delayed" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-komukuna-pink/20 blur-[120px] animate-pulse-delayed" style={{ animationDelay: '2s' }} />
                <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
            </div>

            <div className="container relative z-10 px-4 text-center">
                <div className="space-y-8 max-w-5xl mx-auto">

                    {/* Tagline */}
                    <div className="flex justify-center">
                        <div className="px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-komukuna-pink opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-komukuna-pink"></span>
                            </span>
                            <span className="text-gray-300 text-xs md:text-sm font-medium tracking-wide uppercase">New Era of Event Souvenir</span>
                        </div>
                    </div>

                    {/* Mega Headline (Updated per Plan) */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-white">
                        <span className="block">
                            Tamu Pulang Membawa Kenangan,
                        </span>
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-komukuna-pink via-purple-400 to-komukuna-purple">
                            Bukan Sekadar Makanan.
                        </span>
                    </h1>

                    {/* Subheader (Updated per Plan - The "Gelas/Kipas" Hook) */}
                    <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        Lupakan souvenir gelas atau kipas yang ujungnya dibuang. Berikan pengalaman
                        <span className="text-white font-semibold"> Photobooth & Video 360°</span> yang mewah, personal, dan langsung tayang di Instagram Story tamu Anda.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                        <Button variant="gradient" size="lg" className="h-14 px-8 text-lg shadow-[0_0_40px_rgba(232,92,144,0.4)] hover:shadow-[0_0_60px_rgba(232,92,144,0.6)] transition-shadow duration-500" asChild>
                            <Link href="#pricing">
                                Cek Ketersediaan <ChevronRight className="ml-2 w-5 h-5" />
                            </Link>
                        </Button>

                        <div className="flex items-center gap-3 text-white group cursor-pointer">
                            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-colors">
                                <Play size={18} fill="white" className="ml-1" />
                            </div>
                            <span className="text-sm font-medium tracking-wide">Lihat Demo Video</span>
                        </div>
                    </div>

                </div>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-500 flex flex-col items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest opacity-50">Scroll</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-gray-500 to-transparent" />
            </div>
        </section>
    );
}
