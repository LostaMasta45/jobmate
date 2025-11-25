"use client";

import React from "react";
import { motion } from "framer-motion";
import { Spotlight } from "./Spotlight";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

export function LandingHeroV2() {
  return (
    <div className="h-screen w-full flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      
      <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            
            {/* Left Content: Text */}
            <div className="flex-1 text-left space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-6">
                        <Sparkles className="w-4 h-4 text-brand-400" />
                        <span className="text-sm text-neutral-300">Platform Karir #1 di Indonesia</span>
                    </div>

                    <h1 className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 leading-tight">
                        Siap Kerja <br />
                        <span className="text-brand">Lebih Cepat</span>
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mt-4 font-normal text-base text-neutral-300 max-w-lg"
                >
                    Bantu kamu lolos sistem ATS, latihan interview, dan dapat kerja impian. 
                    Gabung komunitas VIP dan akses tools premium JobMate.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <Button 
                        size="lg" 
                        className="bg-brand hover:bg-brand-600 text-white rounded-full px-8 h-12 text-lg shadow-[0_0_20px_rgba(0,172,199,0.3)] hover:shadow-[0_0_30px_rgba(0,172,199,0.5)] transition-all duration-300"
                    >
                        Gabung VIP Sekarang
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                    <Button 
                        variant="outline" 
                        size="lg" 
                        className="rounded-full px-8 h-12 text-lg border-white/10 text-white hover:bg-white/5 hover:text-white"
                    >
                        Lihat Demo
                    </Button>
                </motion.div>

                <motion.div
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     transition={{ duration: 0.5, delay: 0.4 }}
                     className="pt-4 flex items-center gap-6 text-sm text-neutral-400"
                >
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-brand" />
                        <span>Review CV Sepuasnya</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-brand" />
                        <span>Akses Seumur Hidup</span>
                    </div>
                </motion.div>
            </div>

            {/* Right Content: Visual / Mockup */}
            <div className="flex-1 w-full relative perspective-1000">
                <motion.div
                    initial={{ opacity: 0, rotateX: 20, rotateY: -20, y: 50 }}
                    animate={{ opacity: 1, rotateX: 0, rotateY: 0, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative z-20"
                >
                    {/* Abstract Glass Card */}
                    <div className="relative w-full aspect-[4/3] rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 p-6 shadow-2xl overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
                        
                        {/* Inner UI Mockup */}
                        <div className="absolute inset-0 bg-grid-white/[0.05]" />
                        
                        {/* Header Mockup */}
                        <div className="flex items-center gap-4 mb-8 relative z-10">
                            <div className="w-12 h-12 rounded-full bg-brand/20 flex items-center justify-center">
                                <span className="text-brand font-bold">JM</span>
                            </div>
                            <div>
                                <div className="h-3 w-32 bg-white/20 rounded mb-2" />
                                <div className="h-2 w-20 bg-white/10 rounded" />
                            </div>
                        </div>

                        {/* Content Mockup */}
                        <div className="space-y-4 relative z-10">
                            <div className="h-24 w-full bg-white/5 rounded-xl border border-white/5 p-4 flex items-center gap-4">
                                <div className="w-12 h-12 bg-purple-500/20 rounded-lg" />
                                <div className="flex-1">
                                    <div className="h-3 w-3/4 bg-white/20 rounded mb-2" />
                                    <div className="h-2 w-1/2 bg-white/10 rounded" />
                                </div>
                                <div className="px-3 py-1 bg-brand/20 text-brand text-xs rounded-full">
                                    Lolos ATS
                                </div>
                            </div>

                             <div className="h-24 w-full bg-white/5 rounded-xl border border-white/5 p-4 flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-500/20 rounded-lg" />
                                <div className="flex-1">
                                    <div className="h-3 w-3/4 bg-white/20 rounded mb-2" />
                                    <div className="h-2 w-1/2 bg-white/10 rounded" />
                                </div>
                                <div className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                                    Interview
                                </div>
                            </div>
                        </div>

                        {/* Floating Elements */}
                        <motion.div 
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            className="absolute bottom-8 right-8 bg-brand text-white px-4 py-2 rounded-lg shadow-lg z-20 text-sm font-bold"
                        >
                            90% Match!
                        </motion.div>

                         <motion.div 
                            animate={{ y: [0, 15, 0] }}
                            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                            className="absolute -top-4 -right-4 w-24 h-24 bg-purple-500/30 rounded-full blur-2xl z-0"
                        />
                    </div>

                    {/* Glow Effect Behind */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-brand to-purple-600 rounded-xl blur-3xl opacity-20 -z-10" />
                </motion.div>
            </div>
        </div>
      </div>
    </div>
  );
}
