"use client";

import { motion } from "framer-motion";
import { CreditCard, Wallet, Building2, QrCode } from "lucide-react";

export function PaymentMethodLogos() {
  const paymentMethods = [
    {
      name: "QRIS",
      icon: "📱",
      bg: "from-red-100 to-pink-100 dark:from-red-900/40 dark:to-pink-900/40",
      border: "border-red-300 dark:border-red-700",
      textColor: "text-red-700 dark:text-red-400",
    },
    {
      name: "DANA",
      icon: "💙",
      bg: "from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40",
      border: "border-blue-300 dark:border-blue-700",
      textColor: "text-blue-700 dark:text-blue-400",
    },
    {
      name: "OVO",
      icon: "💜",
      bg: "from-purple-100 to-violet-100 dark:from-purple-900/40 dark:to-violet-900/40",
      border: "border-purple-300 dark:border-purple-700",
      textColor: "text-purple-700 dark:text-purple-400",
    },
    {
      name: "GoPay",
      icon: "💚",
      bg: "from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40",
      border: "border-green-300 dark:border-green-700",
      textColor: "text-green-700 dark:text-green-400",
    },
    {
      name: "BCA",
      icon: "🏦",
      bg: "from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40",
      border: "border-blue-300 dark:border-blue-700",
      textColor: "text-blue-700 dark:text-blue-400",
    },
    {
      name: "Mandiri",
      icon: "🟡",
      bg: "from-yellow-100 to-orange-100 dark:from-yellow-900/40 dark:to-orange-900/40",
      border: "border-yellow-300 dark:border-yellow-700",
      textColor: "text-yellow-700 dark:text-yellow-400",
    },
    {
      name: "BNI",
      icon: "🟠",
      bg: "from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40",
      border: "border-orange-300 dark:border-orange-700",
      textColor: "text-orange-700 dark:text-orange-400",
    },
    {
      name: "BRI",
      icon: "🔷",
      bg: "from-blue-100 to-sky-100 dark:from-blue-900/40 dark:to-sky-900/40",
      border: "border-blue-300 dark:border-blue-700",
      textColor: "text-blue-700 dark:text-blue-400",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0 }}
      className="space-y-4"
    >
      <div className="text-center space-y-2">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Metode Pembayaran Tersedia
        </h3>
        <p className="text-sm text-muted-foreground">
          Pilih metode pembayaran favorit Anda di halaman Xendit
        </p>
      </div>

      {/* Payment Method Logos Grid */}
      <div className="grid grid-cols-4 gap-3 sm:gap-4">
        {paymentMethods.map((method, index) => (
          <motion.div
            key={method.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1 + index * 0.05 }}
            whileHover={{ scale: 1.08, y: -3 }}
            className={`relative bg-gradient-to-br ${method.bg} rounded-xl p-3 sm:p-4 border-2 ${method.border} shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer`}
          >
            {/* Icon + Name */}
            <div className="flex flex-col items-center justify-center gap-1.5 sm:gap-2">
              {/* Emoji Icon */}
              <motion.div
                className="text-3xl sm:text-4xl"
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.2 }}
                transition={{ duration: 0.5 }}
              >
                {method.icon}
              </motion.div>
              
              {/* Method Name */}
              <span className={`text-xs sm:text-sm font-bold ${method.textColor} text-center leading-tight`}>
                {method.name}
              </span>
            </div>

            {/* Checkmark Badge on Hover */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileHover={{ opacity: 1, scale: 1 }}
              className="absolute -top-1.5 -right-1.5 bg-emerald-500 rounded-full p-1 shadow-lg"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.div>

            {/* Shine effect on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-xl"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
            />
          </motion.div>
        ))}
      </div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="flex flex-col items-center gap-2 pt-4 border-t border-dashed border-slate-200 dark:border-slate-700"
      >
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="text-emerald-600">✓</span> Instant
          </span>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <span className="flex items-center gap-1">
            <span className="text-emerald-600">✓</span> Secure
          </span>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <span className="flex items-center gap-1">
            <span className="text-emerald-600">✓</span> 24/7
          </span>
        </div>
        <p className="text-xs text-center text-muted-foreground">
          Dan masih banyak metode pembayaran lainnya
        </p>
      </motion.div>
    </motion.div>
  );
}
