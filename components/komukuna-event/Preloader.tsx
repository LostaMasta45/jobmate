"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulasi loading time 2 detik
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
                    exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
                >
                    <div className="relative flex flex-col items-center">
                        {/* Logo Animation */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="relative w-32 h-32 md:w-48 md:h-48 mb-6"
                        >
                            <Image
                                src="/komukuna-event/logo-badge.png"
                                alt="Komukuna Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </motion.div>

                        {/* Text Reveal */}
                        <div className="overflow-hidden">
                            <motion.h1
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                transition={{ delay: 0.5, duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                                className="text-2xl md:text-3xl font-bold text-white tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-komukuna-pink to-komukuna-purple"
                            >
                                Komukuna Studio
                            </motion.h1>
                        </div>

                        {/* Loading Bar */}
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "150px" }}
                            transition={{ delay: 0.2, duration: 2, ease: "easeInOut" }}
                            className="mt-6 h-1 bg-white/20 rounded-full overflow-hidden"
                        >
                            <motion.div
                                className="h-full bg-komukuna-pink"
                                layoutId="loader"
                            />
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
