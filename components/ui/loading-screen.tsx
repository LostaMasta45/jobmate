"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Send, Briefcase, CheckCircle, Sparkles, UserCheck, Building2 } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = "Memuat dashboard..." }: LoadingScreenProps) {
  const [step, setStep] = React.useState(0);

  // Cycle through animation steps
  React.useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 4);
    }, 800);
    return () => clearInterval(timer);
  }, []);

  const steps = [
    {
      icon: FileText,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      text: "Menyiapkan dokumen...",
      subtext: "Memeriksa kelengkapan data"
    },
    {
      icon: Send,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      text: "Mengirim lamaran...",
      subtext: "Menghubungkan ke server"
    },
    {
      icon: Building2,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
      text: "Menunggu review...",
      subtext: "Verifikasi kredensial"
    },
    {
      icon: Briefcase,
      color: "text-green-500",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
      text: "Siap bekerja!",
      subtext: "Membuka dashboard"
    },
  ];

  const currentStep = steps[step];
  const IconComponent = currentStep.icon;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-lg">
      <div className="flex flex-col items-center gap-8 p-8 max-w-sm w-full">
        
        {/* Main Animation Container */}
        <div className="relative group">
          {/* Pulse Rings */}
          <motion.div
            className={`absolute inset-0 rounded-full ${currentStep.bg}`}
            animate={{ 
              scale: [1, 1.6, 1], 
              opacity: [0.5, 0, 0.5] 
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
          <motion.div
            className={`absolute inset-0 rounded-full ${currentStep.bg}`}
            animate={{ 
              scale: [1, 1.3, 1], 
              opacity: [0.8, 0.2, 0.8] 
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut", 
              delay: 0.5 
            }}
          />

          {/* Central Icon Circle */}
          <div className={`relative flex h-28 w-28 items-center justify-center rounded-full border-4 ${currentStep.border} bg-background/50 backdrop-blur-xl shadow-2xl transition-colors duration-500`}>
             <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ y: 15, opacity: 0, scale: 0.8, rotateX: -45 }}
                  animate={{ y: 0, opacity: 1, scale: 1, rotateX: 0 }}
                  exit={{ y: -15, opacity: 0, scale: 0.8, rotateX: 45 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <IconComponent className={`h-12 w-12 ${currentStep.color} transition-colors duration-500`} />
                </motion.div>
             </AnimatePresence>
             
             {/* Orbiting Particle */}
             <motion.div
               className="absolute inset-0"
               animate={{ rotate: 360 }}
               transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
             >
                <div className={`absolute -top-1.5 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full ${currentStep.color.replace('text-', 'bg-')} shadow-[0_0_15px_currentColor]`} />
             </motion.div>

             {/* Counter-Orbiting Particle */}
             <motion.div
               className="absolute inset-4"
               animate={{ rotate: -360 }}
               transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
             >
                <div className={`absolute -bottom-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full ${currentStep.color.replace('text-', 'bg-')} opacity-70`} />
             </motion.div>
          </div>
        </div>

        {/* Text & Progress */}
        <div className="flex flex-col items-center gap-4 text-center w-full">
          <div className="space-y-1 h-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  {currentStep.text}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {currentStep.subtext}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress Bar */}
          <div className="w-full space-y-2">
             <div className="h-2 w-full overflow-hidden rounded-full bg-muted/30 border border-border/50">
              <motion.div
                className={`h-full ${currentStep.color.replace('text-', 'bg-')} shadow-[0_0_10px_currentColor]`}
                initial={{ width: "0%" }}
                animate={{ width: `${((step + 1) / 4) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground/50 font-mono">
              <span>STEP {step + 1}/4</span>
              <span className="animate-pulse">{Math.round(((step + 1) / 4) * 100)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
