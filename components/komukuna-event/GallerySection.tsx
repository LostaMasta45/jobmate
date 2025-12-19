"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Aperture, Play } from 'lucide-react';
import Image from 'next/image';

// Real Data for Photobooth
const photoItems = [
    { id: 1, title: 'Wedding Ryan & Maya', image: '/komukuna-event/portfolio/photo-1.png', ratio: 'aspect-[4/3] col-span-2' },
    { id: 2, title: 'Corporate Gathering', image: '/komukuna-event/portfolio/photo-2.png', ratio: 'aspect-[3/4]' },
    { id: 3, title: 'Sweet 17th Party', image: '/komukuna-event/portfolio/photo-2.png', ratio: 'aspect-[3/4]' }, // Reusing for layout balance
    { id: 4, title: 'Grand Launching', image: '/komukuna-event/portfolio/photo-1.png', ratio: 'aspect-[4/3] col-span-2' }, // Reusing
];

// Real Data for Videobooth
const videoItems = [
    { id: 1, title: 'Wedding Cinematic', image: '/komukuna-event/portfolio/video-1.png' },
    { id: 2, title: 'Fun Slowmo Party', image: '/komukuna-event/portfolio/video-2.png' },
    { id: 3, title: 'Glamour Night', image: '/komukuna-event/portfolio/video-1.png' },
    { id: 4, title: 'Corporate 360', image: '/komukuna-event/portfolio/video-2.png' },
];

export default function GallerySection() {
    const [activeTab, setActiveTab] = useState<'photobooth' | 'videobooth'>('photobooth');

    return (
        <section className="py-24 bg-[#0F0F0F] overflow-hidden">
            <div className="container mx-auto px-4">

                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Portfolio Terbaru</h2>
                    <p className="text-gray-400">Bukti kebahagiaan dari klien-klien kami.</p>

                    {/* Tabs Switcher */}
                    <div className="flex justify-center mt-8">
                        <div className="bg-white/5 p-1 rounded-full flex relative">
                            <motion.div
                                className="absolute top-1 bottom-1 bg-gradient-to-r from-komukuna-pink to-komukuna-purple rounded-full shadow-lg"
                                initial={false}
                                animate={{
                                    left: activeTab === 'photobooth' ? '4px' : '50%',
                                    width: 'calc(50% - 4px)',
                                    x: activeTab === 'videobooth' ? '0%' : '0'
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />

                            <button
                                onClick={() => setActiveTab('photobooth')}
                                className={`relative z-10 px-8 py-2 rounded-full text-sm font-bold transition-colors ${activeTab === 'photobooth' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                <span className="flex items-center gap-2"><Camera size={16} /> Photobooth</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('videobooth')}
                                className={`relative z-10 px-8 py-2 rounded-full text-sm font-bold transition-colors ${activeTab === 'videobooth' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                <span className="flex items-center gap-2"><Aperture size={16} /> Videobooth</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="min-h-[500px]">
                    <AnimatePresence mode="wait">
                        {activeTab === 'photobooth' ? (
                            <motion.div
                                key="photobooth"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                className="grid grid-cols-2 md:grid-cols-4 gap-4"
                            >
                                {photoItems.map((item, i) => (
                                    <div key={item.id} className={`group relative rounded-xl overflow-hidden bg-gray-900 ${item.ratio || 'aspect-square'} hover:scale-[1.02] transition-transform duration-300 border border-white/10`}>
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />

                                        {/* Overlay Info */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                            <p className="text-white text-xs font-bold tracking-wide">{item.title}</p>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="videobooth"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="flex gap-6 overflow-x-auto pb-8 snap-x justify-center md:justify-start"
                                style={{ WebkitOverflowScrolling: 'touch' }}
                            >
                                {videoItems.map((item, i) => (
                                    <div key={item.id} className="snap-center shrink-0 w-[240px] md:w-[280px]">
                                        {/* Phone Frame */}
                                        <div className="relative aspect-[9/16] bg-gray-900 rounded-[2rem] border-4 border-gray-800 overflow-hidden shadow-2xl group ring-1 ring-white/10">
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                            />

                                            {/* Play Button Overlay */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer">
                                                    <Play fill="white" className="text-white ml-1 w-6 h-6" />
                                                </div>
                                            </div>

                                            {/* Footer Overlay */}
                                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                                                <p className="text-white text-sm font-bold mb-1">{item.title}</p>
                                                <p className="text-xs text-komukuna-pink font-medium">Click to Play</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </section>
    );
}
