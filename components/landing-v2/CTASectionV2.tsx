"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const CTASectionV2 = () => {
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand/10 pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
         <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
         >
             Siap Dapat Kerja <br />
             <span className="text-brand">Dalam 30 Hari?</span>
         </motion.h2>
         
         <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-neutral-400 mb-10 max-w-2xl mx-auto"
         >
             Jangan buang waktu lagi dengan cara lama. Gabung sekarang dan rasakan bedanya.
         </motion.p>

         <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
         >
             <Button size="lg" className="bg-brand hover:bg-brand-600 text-white h-14 px-8 text-lg rounded-full shadow-[0_0_30px_-5px_rgba(0,172,199,0.6)] hover:shadow-[0_0_50px_-5px_rgba(0,172,199,0.8)] transition-all">
                 Gabung VIP Sekarang <ArrowRight className="ml-2 w-5 h-5" />
             </Button>
         </motion.div>
         
         <p className="mt-6 text-sm text-neutral-500">
             Garansi 7 hari uang kembali jika tidak puas.
         </p>
      </div>
    </section>
  );
};
