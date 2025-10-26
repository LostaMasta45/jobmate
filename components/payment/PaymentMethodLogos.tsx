"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function PaymentMethodLogos() {
  const paymentMethods = [
    {
      name: "QRIS",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/QRIS_logo.svg/512px-QRIS_logo.svg.png",
      bg: "from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30",
      border: "border-red-200 dark:border-red-800",
    },
    {
      name: "DANA",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Logo_dana_blue.svg/512px-Logo_dana_blue.svg.png",
      bg: "from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30",
      border: "border-blue-200 dark:border-blue-800",
    },
    {
      name: "OVO",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Logo_ovo_purple.svg/512px-Logo_ovo_purple.svg.png",
      bg: "from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30",
      border: "border-purple-200 dark:border-purple-800",
    },
    {
      name: "GoPay",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Gopay_logo.svg/512px-Gopay_logo.svg.png",
      bg: "from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30",
      border: "border-green-200 dark:border-green-800",
    },
    {
      name: "BCA",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia.svg/512px-Bank_Central_Asia.svg.png",
      bg: "from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30",
      border: "border-blue-200 dark:border-blue-800",
    },
    {
      name: "Mandiri",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Bank_Mandiri_logo_2016.svg/512px-Bank_Mandiri_logo_2016.svg.png",
      bg: "from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30",
      border: "border-yellow-200 dark:border-yellow-800",
    },
    {
      name: "BNI",
      logo: "https://upload.wikimedia.org/wikipedia/id/thumb/5/55/BNI_logo.svg/512px-BNI_logo.svg.png",
      bg: "from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30",
      border: "border-orange-200 dark:border-orange-800",
    },
    {
      name: "BRI",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/BRI_2020.svg/512px-BRI_2020.svg.png",
      bg: "from-blue-50 to-sky-50 dark:from-blue-950/30 dark:to-sky-950/30",
      border: "border-blue-200 dark:border-blue-800",
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
            whileHover={{ scale: 1.05, y: -2 }}
            className={`relative bg-gradient-to-br ${method.bg} rounded-xl p-3 sm:p-4 border ${method.border} shadow-sm hover:shadow-md transition-all duration-300 group`}
          >
            {/* Logo Container */}
            <div className="relative aspect-square w-full flex items-center justify-center">
              <Image
                src={method.logo}
                alt={method.name}
                width={100}
                height={100}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  // Fallback to text if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<span class="text-xs font-bold text-center">${method.name}</span>`;
                  }
                }}
              />
            </div>

            {/* Checkmark Badge on Hover */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileHover={{ opacity: 1, scale: 1 }}
              className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-1"
            >
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.div>
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
