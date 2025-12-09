"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Sparkles, Zap, Phone, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function WAGeneratorHeader() {
  return (
    <div className="w-full mb-6">
      {/* Desktop & Mobile Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative overflow-hidden rounded-2xl"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 via-emerald-600/10 to-teal-600/10 dark:from-green-500/10 dark:to-teal-500/10 z-0" />
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <Card className="relative p-6 md:p-8 border-2 border-green-100 dark:border-green-900/50 bg-white/50 dark:bg-black/20 backdrop-blur-sm overflow-hidden z-10">
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] animate-[shimmer_3s_infinite]" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Left Content */}
            <div className="flex items-center gap-4 md:gap-6">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-4 shadow-lg shadow-green-500/20 shrink-0"
              >
                <MessageCircle className="h-8 w-8 md:h-10 md:w-10 text-white" />
              </motion.div>
              
              <div className="space-y-2">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-wrap items-center gap-2 md:gap-3"
                >
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    WhatsApp Generator
                  </h1>
                  <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 px-2 py-0.5 text-xs">
                    <Sparkles className="h-3 w-3 mr-1 animate-pulse text-yellow-500" />
                    AI Powered
                  </Badge>
                </motion.div>
                
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm md:text-base text-muted-foreground max-w-xl"
                >
                  Buat pesan WA profesional dalam hitungan detik. Pilih tipe, atur gaya, dan kirim langsung ke HRD.
                </motion.p>
              </div>
            </div>
            
            {/* Right Stats */}
            <div className="flex w-full md:w-auto gap-3 md:gap-4">
              {[
                { val: "7+", label: "Tipe Pesan", icon: Phone, color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20" },
                { val: "Auto", label: "Spintax", icon: Zap, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + (i * 0.1) }}
                  whileHover={{ y: -2 }}
                  className={`flex-1 md:flex-none flex flex-col items-center justify-center p-3 md:p-4 rounded-xl border border-transparent hover:border-muted ${stat.bg} transition-all duration-300 min-w-[100px]`}
                >
                  <div className={`text-xl md:text-2xl font-bold ${stat.color} flex items-center gap-1`}>
                    {stat.val}
                    <stat.icon className="h-4 w-4 opacity-50" />
                  </div>
                  <div className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
