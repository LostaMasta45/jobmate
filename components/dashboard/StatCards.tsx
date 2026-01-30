"use client";

import { motion } from "framer-motion";
import { Briefcase, Clock, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

type StatCardsProps = {
  data: {
    total: number;
    inProcess: number;
    accepted: number;
    rejected: number;
  };
};

// Animated counter component
function AnimatedCounter({ value, duration = 1000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      setCount(Math.floor(progress * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration]);

  return <>{count}</>;
}

export function StatCards({ data }: StatCardsProps) {
  const items = [
    {
      label: "Total",
      value: data.total,
      icon: Briefcase,
      gradient: "from-[#8e68fd] via-[#7557e8] to-[#5547d0]",
      glowColor: "rgba(142, 104, 253, 0.4)",
      iconBg: "bg-white/20 dark:bg-white/10 backdrop-blur-xl",
      iconColor: "text-white",
      borderGlow: "shadow-[0_0_20px_rgba(142,104,253,0.3)] dark:shadow-[0_0_30px_rgba(142,104,253,0.5)]",
    },
    {
      label: "Proses",
      value: data.inProcess,
      icon: Clock,
      gradient: "from-[#3977d3] via-[#2c8ec5] to-[#00acc7]",
      glowColor: "rgba(57, 119, 211, 0.4)",
      iconBg: "bg-white/20 dark:bg-white/10 backdrop-blur-xl",
      iconColor: "text-white",
      borderGlow: "shadow-[0_0_20px_rgba(57,119,211,0.3)] dark:shadow-[0_0_30px_rgba(57,119,211,0.5)]",
    },
    {
      label: "Diterima",
      value: data.accepted,
      icon: CheckCircle,
      gradient: "from-[#00d1dc] via-[#00c5cf] to-[#00bed1]",
      glowColor: "rgba(0, 209, 220, 0.4)",
      iconBg: "bg-white/20 dark:bg-white/10 backdrop-blur-xl",
      iconColor: "text-white",
      borderGlow: "shadow-[0_0_20px_rgba(0,209,220,0.3)] dark:shadow-[0_0_30px_rgba(0,209,220,0.5)]",
    },
    {
      label: "Ditolak",
      value: data.rejected,
      icon: XCircle,
      gradient: "from-[#5547d0] via-[#6d58d8] to-[#8e68fd]",
      glowColor: "rgba(85, 71, 208, 0.4)",
      iconBg: "bg-white/20 dark:bg-white/10 backdrop-blur-xl",
      iconColor: "text-white",
      borderGlow: "shadow-[0_0_20px_rgba(85,71,208,0.3)] dark:shadow-[0_0_30px_rgba(85,71,208,0.5)]",
    },
  ];

  return (
    <div className="grid gap-4 sm:gap-5 grid-cols-2 lg:grid-cols-4">
      {items.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.4,
            delay: index * 0.1,
            type: "spring",
            stiffness: 100
          }}
        >
          <motion.div
            whileHover={{
              scale: 1.05,
              y: -5,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={`
                relative overflow-hidden border-0 
                bg-gradient-to-br ${item.gradient}
                hover:${item.borderGlow}
                transition-all duration-300
                group cursor-pointer
              `}
            >
              {/* Glassmorphism overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5" />

              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 -left-4 w-24 h-24 bg-white rounded-full mix-blend-overlay filter blur-xl animate-pulse" />
                <div className="absolute bottom-0 -right-4 w-32 h-32 bg-white rounded-full mix-blend-overlay filter blur-xl animate-pulse delay-700" />
              </div>

              <CardContent className="relative p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <motion.p
                      className="text-xs sm:text-sm font-semibold text-white/90 truncate mb-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      {item.label}
                    </motion.p>
                    <motion.p
                      className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: index * 0.1 + 0.3,
                        type: "spring",
                        stiffness: 200
                      }}
                    >
                      <AnimatedCounter value={item.value} duration={1200} />
                    </motion.p>
                  </div>

                  {/* Icon with glassmorphism */}
                  <motion.div
                    className={`
                      ${item.iconBg}
                      p-3 sm:p-3.5 rounded-2xl
                      flex-shrink-0 ml-3
                      border border-white/20
                      group-hover:scale-110 group-hover:rotate-12
                      transition-all duration-300
                    `}
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{
                      delay: index * 0.1 + 0.4,
                      type: "spring",
                      stiffness: 200
                    }}
                  >
                    <item.icon className={`h-6 w-6 sm:h-7 sm:w-7 ${item.iconColor} drop-shadow-lg`} />
                  </motion.div>
                </div>

                {/* Bottom accent line */}
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-white/30"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    delay: index * 0.1 + 0.5,
                    duration: 0.6,
                    ease: "easeOut"
                  }}
                />
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
