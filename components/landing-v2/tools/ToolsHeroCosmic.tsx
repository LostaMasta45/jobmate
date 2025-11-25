"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Users, Clock, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ToolsHeroCosmic = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden min-h-[80vh] flex items-center justify-center">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-black z-0" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-brand/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand/30 bg-brand/10 backdrop-blur-md text-brand-300 text-sm mb-8"
        >
          <Bot className="w-4 h-4" />
          <span>AI Powered Career Tools</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6"
        >
          Autopilot Mode <br />
          <span className="bg-gradient-to-r from-brand to-purple-500 bg-clip-text text-transparent">
            Cari Kerja
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Hemat <strong className="text-white">10-15 jam setiap minggu</strong> dengan 6 tools essential yang bikin proses lamaranmu lebih cepat, rapi, dan profesional.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-brand to-blue-600 hover:from-brand-600 hover:to-blue-700 text-white border-0 rounded-full px-8 h-12 shadow-[0_0_20px_rgba(59,130,246,0.4)]"
            asChild
          >
            <a href="#tools">
              Lihat Semua Tools <ArrowRight className="ml-2 w-4 h-4" />
            </a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-full px-8 h-12 backdrop-blur-sm"
            asChild
          >
            <a href="#pricing">Upgrade Premium</a>
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-3 gap-4 md:gap-12 max-w-3xl mx-auto border-t border-white/10 pt-8"
        >
            <div className="space-y-1">
                <div className="text-3xl md:text-4xl font-bold text-white flex items-center justify-center gap-2">
                    1.2K+
                </div>
                <p className="text-xs md:text-sm text-neutral-500 uppercase tracking-wider">Active Users</p>
            </div>
            <div className="space-y-1">
                <div className="text-3xl md:text-4xl font-bold text-white flex items-center justify-center gap-2">
                    6
                </div>
                <p className="text-xs md:text-sm text-neutral-500 uppercase tracking-wider">Core Tools</p>
            </div>
            <div className="space-y-1">
                <div className="text-3xl md:text-4xl font-bold text-brand flex items-center justify-center gap-2">
                    15h
                </div>
                <p className="text-xs md:text-sm text-neutral-500 uppercase tracking-wider">Saved / Week</p>
            </div>
        </motion.div>
      </div>
    </section>
  );
};
