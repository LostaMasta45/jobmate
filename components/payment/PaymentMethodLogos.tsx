"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { Zap, Shield, Clock } from "lucide-react";

interface PaymentMethodLogosProps {
  gatewayName?: string;
  variant?: "full" | "compact" | "minimal";
}

export function PaymentMethodLogos({
  gatewayName = "Midtrans",
  variant = "full"
}: PaymentMethodLogosProps) {
  const paymentMethods = [
    { name: "QRIS", logo: "/payment-logos/qris.png" },
    { name: "DANA", logo: "/payment-logos/dana.png" },
    { name: "OVO", logo: "/payment-logos/ovo.png" },
    { name: "GoPay", logo: "/payment-logos/gopay.png" },
    { name: "BCA", logo: "/payment-logos/bca.png" },
    { name: "Mandiri", logo: "/payment-logos/mandiri.png" },
    { name: "BNI", logo: "/payment-logos/bni.png" },
    { name: "BRI", logo: "/payment-logos/bri.png" },
  ];

  const features = [
    { icon: Zap, label: "Instan", color: "text-amber-500" },
    { icon: Shield, label: "Aman", color: "text-emerald-500" },
    { icon: Clock, label: "24/7", color: "text-blue-500" },
  ];

  // Minimal variant - just logos in a row
  if (variant === "minimal") {
    return (
      <div className="flex flex-wrap items-center justify-center gap-2">
        {paymentMethods.slice(0, 6).map((method) => (
          <PaymentLogo key={method.name} method={method} size="sm" />
        ))}
        <span className="text-xs text-slate-400 ml-1">+lainnya</span>
      </div>
    );
  }

  // Compact variant - smaller grid without header
  if (variant === "compact") {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-4 gap-2">
          {paymentMethods.map((method, index) => (
            <PaymentLogo key={method.name} method={method} size="md" index={index} />
          ))}
        </div>
        <p className="text-xs text-center text-slate-400">
          + metode pembayaran lainnya via {gatewayName}
        </p>
      </div>
    );
  }

  // Full variant - with header and features
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="text-center space-y-1.5">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
          Metode Pembayaran
        </span>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          Pilih Metode Favorit Anda
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Pembayaran diproses via {gatewayName}
        </p>
      </div>

      {/* Payment Methods Grid */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {paymentMethods.map((method, index) => (
          <PaymentLogo key={method.name} method={method} size="lg" index={index} />
        ))}
      </div>

      {/* Features Strip */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 pt-3 border-t border-slate-100 dark:border-slate-800">
        {features.map((feature, index) => (
          <motion.div
            key={feature.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="flex items-center gap-1.5"
          >
            <feature.icon className={`w-3.5 h-3.5 ${feature.color}`} />
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              {feature.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* More Methods Note */}
      <p className="text-[11px] text-center text-slate-400 dark:text-slate-500">
        Dan masih banyak metode pembayaran lainnya
      </p>
    </motion.div>
  );
}

// PaymentLogo component with uniform sizing
interface PaymentLogoProps {
  method: { name: string; logo: string };
  size: "sm" | "md" | "lg";
  index?: number;
}

function PaymentLogo({ method, size, index = 0 }: PaymentLogoProps) {
  const [imageError, setImageError] = useState(false);

  // Fixed uniform container sizes
  const containerSize = {
    sm: "w-10 h-10",
    md: "w-16 h-16 sm:w-[72px] sm:h-[72px]",
    lg: "w-[72px] h-[72px] sm:w-20 sm:h-20",
  };

  // Logo size inside the container (with padding)
  const logoSize = {
    sm: 28,
    md: 40,
    lg: 48,
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.05 + index * 0.02, duration: 0.3 }}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="flex flex-col items-center gap-1"
    >
      {/* Uniform Square Card */}
      <div
        className={`
          ${containerSize[size]}
          bg-white
          rounded-xl
          border border-slate-200
          shadow-md
          transition-all duration-200
          flex items-center justify-center
          cursor-pointer
          group
        `}
      >
        {!imageError ? (
          <div className="w-full h-full p-2 flex items-center justify-center">
            <Image
              src={method.logo}
              alt={method.name}
              width={logoSize[size]}
              height={logoSize[size]}
              className="w-auto h-auto max-w-full max-h-full object-contain transition-transform duration-200 group-hover:scale-110"
              onError={() => setImageError(true)}
              priority={index < 4}
            />
          </div>
        ) : (
          <span className="text-2xl">💳</span>
        )}
      </div>

      {/* Label below card */}
      {size !== "sm" && (
        <span className="text-[10px] sm:text-xs font-medium text-slate-600 dark:text-slate-400 text-center">
          {method.name}
        </span>
      )}
    </motion.div>
  );
}
