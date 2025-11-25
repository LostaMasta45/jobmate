"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export const ComparisonV2 = () => {
  const [activeTab, setActiveTab] = useState<"old" | "new">("new");

  return (
    <section className="py-24 bg-black text-white relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
           <h2 className="text-3xl md:text-5xl font-bold mb-6">
             Cara Lama vs <span className="text-brand">Cara JobMate</span>
           </h2>
           
           <div className="flex justify-center">
             <div className="bg-white/10 p-1 rounded-full flex items-center relative">
                {/* Slider Background */}
                <motion.div 
                    className="absolute top-1 bottom-1 rounded-full bg-white/10"
                    layoutId="slider"
                    initial={false}
                    animate={{
                        left: activeTab === "old" ? "4px" : "50%",
                        width: "calc(50% - 4px)",
                        backgroundColor: activeTab === "old" ? "#ef4444" : "#00acc7" // Red vs Brand
                    }}
                />
                
                <button 
                    onClick={() => setActiveTab("old")}
                    className={cn("relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-colors w-32", activeTab === "old" ? "text-white" : "text-neutral-400")}
                >
                    Cara Lama
                </button>
                <button 
                    onClick={() => setActiveTab("new")}
                    className={cn("relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-colors w-32", activeTab === "new" ? "text-white" : "text-neutral-400")}
                >
                    JobMate VIP
                </button>
             </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side: The Problem/Solution Visualization */}
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                 <motion.div 
                    key={activeTab}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className={cn("absolute inset-0 flex items-center justify-center", activeTab === "old" ? "bg-red-950/20" : "bg-brand/10")}
                 >
                    {activeTab === "old" ? (
                        <div className="text-center p-8">
                            <div className="text-6xl mb-4">😩</div>
                            <h3 className="text-2xl font-bold text-red-400 mb-2">Frustrasi & Ditolak</h3>
                            <p className="text-neutral-400">Kirim 100 lamaran, 0 panggilan. Tidak tahu salahnya dimana.</p>
                        </div>
                    ) : (
                        <div className="text-center p-8">
                            <div className="text-6xl mb-4">🚀</div>
                            <h3 className="text-2xl font-bold text-brand mb-2">Dilirik HRD</h3>
                            <p className="text-neutral-400">CV lolos ATS, siap interview, dan lebih cepat dapat kerja.</p>
                        </div>
                    )}
                 </motion.div>
            </div>

            {/* Right Side: The List */}
            <div className="space-y-4">
                {comparisonItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5">
                        <span className="font-medium text-neutral-300">{item.label}</span>
                        <div className="flex items-center gap-8">
                             {/* Old Way Status */}
                             <div className={cn("transition-opacity duration-300 flex items-center gap-2", activeTab === "old" ? "opacity-100" : "opacity-20 blur-[1px]")}>
                                <X className="w-5 h-5 text-red-500" />
                                <span className="text-sm text-red-500 hidden md:inline">Gak Ada</span>
                             </div>
                             
                             {/* New Way Status */}
                             <div className={cn("transition-opacity duration-300 flex items-center gap-2", activeTab === "new" ? "opacity-100 scale-110" : "opacity-20 blur-[1px]")}>
                                <Check className="w-5 h-5 text-brand" />
                                <span className="text-sm text-brand font-bold hidden md:inline">Ada Dong</span>
                             </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
};

const comparisonItems = [
    { label: "CV ATS Friendly" },
    { label: "Auto Generate Cover Letter" },
    { label: "Job Application Tracker" },
    { label: "Interview Guide Lengkap" },
    { label: "Komunitas VIP Support" },
    { label: "Update Loker Harian Valid" }
];
