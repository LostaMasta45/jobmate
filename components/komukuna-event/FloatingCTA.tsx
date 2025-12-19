"use client";

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function FloatingCTA() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
            className="fixed z-50 bottom-6 inset-x-4 md:inset-x-auto md:right-8 md:bottom-8 flex justify-center md:block"
        >
            <Link href="https://wa.me/6289676111118?text=Halo Komukuna, saya mau tanya-tanya dulu dong." target="_blank" className="w-full md:w-auto">
                <div className="relative group w-full md:w-auto">

                    {/* Mobile: Wide Button */}
                    <button className="md:hidden relative w-full bg-[#25D366] text-white py-3.5 px-6 rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.4)] active:scale-95 transition-transform flex items-center justify-center gap-3 font-bold text-base">
                        <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse z-0" />
                        <MessageCircle size={24} fill="white" className="z-10" />
                        <span className="z-10">Tanya Jadwal & Pricelist</span>
                    </button>

                    {/* Desktop: Circular Button + Tooltip */}
                    <div className="hidden md:block">
                        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
                        <button className="relative bg-[#25D366] text-white p-4 rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:bg-[#20b857] hover:scale-110 transition-all flex items-center justify-center">
                            <MessageCircle size={32} fill="white" className="text-white" />
                        </button>

                        {/* Tooltip */}
                        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-gray-800 px-4 py-2 rounded-xl text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Chat Fast Response ⚡
                            <div className="absolute top-1/2 -right-2 -translate-y-1/2 border-8 border-transparent border-l-white" />
                        </div>
                    </div>

                </div>
            </Link>
        </motion.div>
    );
}
