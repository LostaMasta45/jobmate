"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Shield, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

interface PaymentProcessingOverlayProps {
  isOpen: boolean;
}

export function PaymentProcessingOverlay({ isOpen }: PaymentProcessingOverlayProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setProgress(0);
      // Animate progress bar over 3 seconds
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2; // Increment by 2% every 60ms (100% in 3 seconds)
        });
      }, 60);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 max-w-md w-[90%] border-2 border-emerald-200 dark:border-emerald-800"
          >
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-green-50/30 to-teal-50/50 dark:from-emerald-950/30 dark:via-green-950/20 dark:to-teal-950/30 rounded-2xl animate-pulse" />

            {/* Content */}
            <div className="relative z-10 space-y-6">
              {/* Shield Icon with Pulse Animation */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="flex justify-center"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-400 blur-2xl opacity-50 rounded-full" />
                  <Shield className="w-20 h-20 text-emerald-600 dark:text-emerald-400 relative z-10" />
                </div>
              </motion.div>

              {/* Title */}
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                  Menghubungkan ke Xendit
                </h3>
                <p className="text-sm text-muted-foreground">
                  Secure Payment Gateway
                </p>
              </div>

              {/* Animated Loading Dots */}
              <div className="flex justify-center gap-2">
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: index * 0.2,
                    }}
                    className="w-3 h-3 bg-emerald-500 rounded-full"
                  />
                ))}
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Memproses...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500"
                  />
                </div>
              </div>

              {/* Security Features */}
              <div className="space-y-2">
                {[
                  { icon: "🔐", text: "Enkripsi SSL 256-bit", done: progress > 30 },
                  { icon: "✅", text: "Verifikasi data pembayaran", done: progress > 60 },
                  { icon: "🚀", text: "Redirect ke halaman Xendit", done: progress > 90 },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.3 }}
                    className="flex items-center gap-3 text-sm"
                  >
                    <motion.div
                      animate={{
                        scale: item.done ? [1, 1.2, 1] : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {item.done ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                      )}
                    </motion.div>
                    <span className={item.done ? "text-emerald-700 dark:text-emerald-400 font-semibold" : "text-muted-foreground"}>
                      {item.icon} {item.text}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Xendit Badge */}
              <div className="flex items-center justify-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  Powered by Xendit
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
