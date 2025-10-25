"use client";

import { motion } from "framer-motion";
import { Users, Star, ThumbsUp, TrendingUp } from "lucide-react";

export function TrustBanner() {
  const stats = [
    { 
      icon: Users, 
      value: "10,000+", 
      label: "Pengguna Aktif",
      color: "text-blue-600"
    },
    { 
      icon: Star, 
      value: "4.9/5.0", 
      label: "Rating",
      color: "text-amber-600",
      stars: true
    },
    { 
      icon: ThumbsUp, 
      value: "98%", 
      label: "Puas & Berhasil",
      color: "text-emerald-600"
    },
    { 
      icon: TrendingUp, 
      value: "5,000+", 
      label: "Berhasil Diterima",
      color: "text-purple-600"
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border-2 border-amber-200/50 dark:border-amber-900/50 p-6 mb-6"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
            className="text-center"
          >
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${stat.color} bg-opacity-10 mb-3`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">
              {stat.value}
            </p>
            {stat.stars && (
              <div className="flex justify-center gap-0.5 mb-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="w-3 h-3 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
            )}
            <p className="text-xs sm:text-sm text-muted-foreground">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
      
      {/* Trust badges */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-center text-sm text-muted-foreground mb-3">
          Dipercaya oleh pencari kerja di seluruh Indonesia
        </p>
        <div className="flex flex-wrap justify-center gap-4 items-center">
          <div className="text-xs px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full font-semibold">
            ✓ Verified Platform
          </div>
          <div className="text-xs px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full font-semibold">
            🔒 Secure Payment
          </div>
          <div className="text-xs px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full font-semibold">
            ⚡ Instant Access
          </div>
        </div>
      </div>
    </motion.div>
  );
}
