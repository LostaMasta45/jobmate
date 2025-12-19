"use client";

import { motion } from 'framer-motion';

const brands = [
    "Pertamina", "Mandiri", "BCA", "Shopee", "Tokopedia", "Telkomsel"
];

export default function TrustBar() {
    return (
        <section className="py-8 bg-black border-b border-white/5 overflow-hidden">
            <div className="container mx-auto px-4">
                <p className="text-center text-gray-500 text-sm mb-6 tracking-widest uppercase">Dipercaya oleh Brand & Event Organizer di Jakarta</p>

                <div className="relative flex overflow-x-hidden group">
                    <motion.div
                        className="flex gap-16 items-center whitespace-nowrap"
                        animate={{ x: [0, -1000] }}
                        transition={{
                            duration: 40,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    >
                        {[...brands, ...brands, ...brands].map((brand, i) => (
                            <span key={i} className="text-xl md:text-2xl font-bold text-gray-700 hover:text-gray-500 transition-colors uppercase select-none">
                                {brand}
                            </span>
                        ))}
                    </motion.div>

                    <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black to-transparent pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black to-transparent pointer-events-none" />
                </div>
            </div>
        </section>
    );
}
