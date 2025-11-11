"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Wrench, Search, History, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
  { 
    icon: Home, 
    label: "Home", 
    href: "/vip",
    activeColor: "text-emerald-500 dark:text-emerald-400",
    gradientFrom: "from-emerald-500",
    gradientTo: "to-emerald-600"
  },
  { 
    icon: Wrench, 
    label: "Tools", 
    href: "/tools",
    activeColor: "text-amber-500 dark:text-amber-400",
    gradientFrom: "from-amber-500",
    gradientTo: "to-amber-600"
  },
  { 
    icon: Search, 
    label: "Cari Loker", 
    href: "/vip/loker",
    activeColor: "text-emerald-600 dark:text-emerald-500",
    gradientFrom: "from-emerald-500",
    gradientTo: "to-teal-600",
    isCenter: true // Special center floating button
  },
  { 
    icon: History, 
    label: "History", 
    href: "/vip/history",
    activeColor: "text-cyan-500 dark:text-cyan-400",
    gradientFrom: "from-cyan-500",
    gradientTo: "to-cyan-600"
  },
  { 
    icon: Building2, 
    label: "Perusahaan", 
    href: "/vip/perusahaan",
    activeColor: "text-teal-500 dark:text-teal-400",
    gradientFrom: "from-teal-500",
    gradientTo: "to-teal-600"
  }
];

export function VIPBottomBar() {
  const pathname = usePathname();
  
  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden pb-4">
        {/* Extra space for floating button */}
        <div className="h-14" />
        
        {/* Glassmorphism Container with Curved Top - EMERALD THEME */}
        <div className="relative mx-4 rounded-[28px] bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl border border-emerald-200/50 dark:border-emerald-700/50 shadow-[0_-8px_40px_rgba(16,185,129,0.12)] dark:shadow-[0_-8px_40px_rgba(16,185,129,0.5)]">
          
          {/* Gradient Overlay for Extra Depth - EMERALD */}
          <div className="absolute inset-0 rounded-[28px] bg-gradient-to-t from-emerald-50/40 to-transparent dark:from-emerald-900/40 pointer-events-none" />
          
          {/* Navigation Items Container */}
          <div className="relative flex items-center justify-around h-20 px-3 safe-area-inset-bottom">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/vip' && pathname.startsWith(item.href));
              
              // CENTER FLOATING BUTTON (Cari Loker) - Enhanced Design with Framer Motion
              if (item.isCenter) {
                return (
                  <motion.div 
                    key={item.href} 
                    className="relative flex flex-col items-center justify-start flex-1 -mt-16"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.1
                    }}
                  >
                    <Link
                      href={item.href}
                      className="group relative mb-2"
                    >
                      {/* Outer Glow Ring with Rotation - EMERALD */}
                      <motion.div 
                        className={cn(
                          "absolute -inset-3 rounded-[26px]",
                          "bg-gradient-to-br from-emerald-500/30 to-teal-600/30 blur-2xl",
                        )}
                        style={{ 
                          opacity: isActive ? 0.6 : 0,
                        }}
                        animate={{
                          rotate: 360,
                          opacity: isActive ? [0.6, 1, 0.6] : 0,
                          scale: isActive ? [1, 1.1, 1] : 1
                        }}
                        transition={{
                          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                          opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                        }}
                        whileHover={{ opacity: 1, scale: 1.1 }}
                      />
                      
                      {/* Inner Glow - EMERALD */}
                      <motion.div 
                        className={cn(
                          "absolute -inset-1 rounded-[25px]",
                          "bg-gradient-to-br from-emerald-500/60 to-teal-600/60 blur-md",
                        )}
                        animate={isActive ? { opacity: 0.8 } : { opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      
                      {/* Main Button with Interactive Animations - EMERALD */}
                      <motion.div 
                        className={cn(
                          "relative flex items-center justify-center",
                          "w-[76px] h-[76px] rounded-[26px]",
                          "bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600",
                          "shadow-[0_12px_48px_rgba(16,185,129,0.5)] dark:shadow-[0_12px_48px_rgba(16,185,129,0.7)]",
                          "border-[4.5px] border-white dark:border-gray-900",
                        )}
                        whileHover={{ 
                          scale: 1.1,
                          rotate: -3,
                          boxShadow: "0 20px 64px rgba(16,185,129,0.65)",
                          transition: { duration: 0.3 }
                        }}
                        whileTap={{ 
                          scale: 0.95,
                          rotate: 0,
                          transition: { duration: 0.1 }
                        }}
                        animate={isActive ? {
                          scale: 1.05,
                          rotate: -2,
                          boxShadow: "0 16px 56px rgba(16,185,129,0.6)"
                        } : {
                          scale: 1,
                          rotate: 0
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20
                        }}
                      >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 rounded-[22px] overflow-hidden">
                          <motion.div 
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                            initial={{ x: "-100%" }}
                            animate={isActive ? {
                              x: "100%"
                            } : { x: "-100%" }}
                            transition={{
                              duration: 2,
                              repeat: isActive ? Infinity : 0,
                              ease: "linear"
                            }}
                          />
                        </div>
                        
                        {/* Inner Highlight */}
                        <div className="absolute inset-[4.5px] rounded-[21px] bg-gradient-to-t from-transparent to-white/20" />
                        
                        {/* Icon with Continuous Rotation */}
                        <motion.div 
                          className="relative"
                          animate={isActive ? { rotate: 360 } : { rotate: 0 }}
                          transition={{
                            duration: 8,
                            repeat: isActive ? Infinity : 0,
                            ease: "linear"
                          }}
                        >
                          <Icon className="w-9 h-9 text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)] relative z-10" strokeWidth={2.5} />
                        </motion.div>
                      </motion.div>
                    </Link>
                    
                    {/* Center Label with Background - EMERALD */}
                    <div className={cn(
                      "px-3 py-0.5 rounded-full transition-all duration-300",
                      isActive 
                        ? "bg-emerald-500/10 dark:bg-emerald-500/20"
                        : "bg-transparent"
                    )}>
                      <span className={cn(
                        "text-[11px] font-bold transition-all duration-300",
                        isActive 
                          ? "text-emerald-600 dark:text-emerald-400 scale-105"
                          : "text-gray-500 dark:text-gray-400"
                      )}>
                        {item.label}
                      </span>
                    </div>
                  </motion.div>
                );
              }

              // REGULAR BUTTONS - Modern Minimal Design with Framer Motion
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative flex flex-col items-center justify-center flex-1 h-full gap-1.5 group"
                >
                  {/* Icon Container with Hover Effect */}
                  <motion.div 
                    className="relative"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: item.href === "/vip" ? 0.2 : 
                             item.href === "/tools" ? 0.25 :
                             item.href === "/vip/history" ? 0.3 : 0.35
                    }}
                  >
                    {/* Active Gradient Background */}
                    <motion.div 
                      className={cn(
                        "absolute inset-0 -m-2 rounded-2xl blur-xl",
                        "bg-gradient-to-br",
                        item.gradientFrom,
                        item.gradientTo,
                      )}
                      initial={{ opacity: 0, scale: 1 }}
                      animate={isActive ? {
                        opacity: [0.4, 0.7, 0.4],
                        scale: [1, 1.1, 1]
                      } : {
                        opacity: 0,
                        scale: 1
                      }}
                      transition={{
                        opacity: { duration: 2, repeat: isActive ? Infinity : 0, ease: "easeInOut" },
                        scale: { duration: 2, repeat: isActive ? Infinity : 0, ease: "easeInOut" }
                      }}
                    />
                    
                    {/* Icon Background Circle */}
                    <motion.div 
                      className={cn(
                        "relative flex items-center justify-center",
                        "w-12 h-12 rounded-2xl",
                        isActive ? [
                          "bg-gradient-to-br",
                          item.gradientFrom,
                          item.gradientTo,
                          "shadow-lg shadow-current/30"
                        ] : [
                          "bg-transparent",
                        ]
                      )}
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: isActive ? undefined : "rgba(107, 114, 128, 0.1)",
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{
                        scale: 0.95,
                        transition: { duration: 0.1 }
                      }}
                      animate={isActive ? {
                        scale: 1.05
                      } : {}}
                    >
                      <motion.div
                        animate={isActive ? {
                          rotate: [0, 5, -5, 5, 0]
                        } : { rotate: 0 }}
                        transition={{
                          duration: 0.6,
                          repeat: isActive ? Infinity : 0,
                          repeatDelay: 3,
                          ease: "easeInOut"
                        }}
                      >
                        <Icon 
                          className={cn(
                            "w-6 h-6",
                            isActive 
                              ? "text-white"
                              : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                          )} 
                          strokeWidth={isActive ? 2.5 : 2}
                        />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                  
                  {/* Label */}
                  <motion.span 
                    className={cn(
                      "text-[11px] font-medium",
                      isActive 
                        ? [item.activeColor, "font-bold"]
                        : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                    )}
                    animate={isActive ? {
                      scale: [1, 1.05, 1]
                    } : {}}
                    transition={{
                      duration: 0.3,
                      repeat: Infinity,
                      repeatDelay: 2
                    }}
                  >
                    {item.label}
                  </motion.span>
                  
                  {/* Active Indicator Dot */}
                  {isActive && (
                    <motion.div 
                      className={cn(
                        "absolute -bottom-0.5 w-1 h-1 rounded-full",
                        "bg-gradient-to-r",
                        item.gradientFrom,
                        item.gradientTo,
                      )}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
      
      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .safe-area-inset-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }
        
        /* Smooth backdrop blur performance */}
        @supports (backdrop-filter: blur(20px)) {
          .backdrop-blur-2xl {
            backdrop-filter: blur(20px);
          }
        }
      `}</style>
    </>
  );
}
