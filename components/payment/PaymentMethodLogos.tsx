"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

export function PaymentMethodLogos() {
  const paymentMethods = [
    {
      name: "QRIS",
      logo: "https://seeklogo.com/images/Q/quick-response-code-indonesian-standard-qris-logo-F300D5EB32-seeklogo.com.png",
      bg: "from-white to-gray-50 dark:from-slate-800 dark:to-slate-900",
      border: "border-gray-200 dark:border-gray-700",
    },
    {
      name: "DANA",
      logo: "https://seeklogo.com/images/D/dana-logo-3E5BAAE5BE-seeklogo.com.png",
      bg: "from-blue-50 to-cyan-50 dark:from-blue-950/40 dark:to-cyan-950/40",
      border: "border-blue-200 dark:border-blue-700",
    },
    {
      name: "OVO",
      logo: "https://seeklogo.com/images/O/ovo-logo-4229017539-seeklogo.com.png",
      bg: "from-purple-50 to-violet-50 dark:from-purple-950/40 dark:to-violet-950/40",
      border: "border-purple-200 dark:border-purple-700",
    },
    {
      name: "GoPay",
      logo: "https://seeklogo.com/images/G/gopay-logo-96D8DCBE1B-seeklogo.com.png",
      bg: "from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40",
      border: "border-green-200 dark:border-green-700",
    },
    {
      name: "BCA",
      logo: "https://seeklogo.com/images/B/bca-bank-central-asia-logo-F5B12BAC9E-seeklogo.com.png",
      bg: "from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40",
      border: "border-blue-200 dark:border-blue-700",
    },
    {
      name: "Mandiri",
      logo: "https://seeklogo.com/images/B/bank-mandiri-logo-875499888A-seeklogo.com.png",
      bg: "from-yellow-50 to-orange-50 dark:from-yellow-950/40 dark:to-orange-950/40",
      border: "border-yellow-200 dark:border-yellow-700",
    },
    {
      name: "BNI",
      logo: "https://seeklogo.com/images/B/bni-bank-negara-indonesia-logo-DCFE1B0C7E-seeklogo.com.png",
      bg: "from-orange-50 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/40",
      border: "border-orange-200 dark:border-orange-700",
    },
    {
      name: "BRI",
      logo: "https://seeklogo.com/images/B/bri-bank-rakyat-indonesia-logo-093D96D178-seeklogo.com.png",
      bg: "from-blue-50 to-sky-50 dark:from-blue-950/40 dark:to-sky-950/40",
      border: "border-blue-200 dark:border-blue-700",
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
        {paymentMethods.map((method, index) => {
          const [imageError, setImageError] = useState(false);
          
          return (
            <motion.div
              key={method.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1 + index * 0.05 }}
              whileHover={{ scale: 1.08, y: -3 }}
              className={`relative bg-gradient-to-br ${method.bg} rounded-xl p-3 sm:p-4 border-2 ${method.border} shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer overflow-hidden`}
            >
              {/* Logo */}
              <div className="flex flex-col items-center justify-center gap-1.5 sm:gap-2 h-full">
                {!imageError ? (
                  <>
                    <div className="relative w-full h-12 sm:h-16 flex items-center justify-center">
                      <Image
                        src={method.logo}
                        alt={method.name}
                        fill
                        className="object-contain group-hover:scale-110 transition-transform duration-300"
                        onError={() => setImageError(true)}
                        unoptimized
                      />
                    </div>
                    {/* Method Name Below Logo */}
                    <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 text-center leading-tight">
                      {method.name}
                    </span>
                  </>
                ) : (
                  // Fallback to text if image fails
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="text-3xl sm:text-4xl">💳</div>
                    <span className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 text-center">
                      {method.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Checkmark Badge on Hover */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileHover={{ opacity: 1, scale: 1 }}
                className="absolute -top-1.5 -right-1.5 bg-emerald-500 rounded-full p-1 shadow-lg z-10"
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
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-xl pointer-events-none"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
            </motion.div>
          );
        })}
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
