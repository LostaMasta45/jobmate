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
    activeColor: "text-[#8e68fd] dark:text-[#8e68fd]",
    gradientFrom: "from-[#8e68fd]",
    gradientTo: "to-[#5547d0]"
  },
  { 
    icon: Wrench, 
    label: "Tools", 
    href: "/tools",
    activeColor: "text-[#3977d3] dark:text-[#3977d3]",
    gradientFrom: "from-[#3977d3]",
    gradientTo: "to-[#00acc7]"
  },
  { 
    icon: Search, 
    label: "Cari Loker", 
    href: "/vip/loker",
    activeColor: "text-[#00d1dc] dark:text-[#00bed1]",
    gradientFrom: "from-[#00d1dc]",
    gradientTo: "to-[#00acc7]",
    isCenter: true // Special center floating button
  },
  { 
    icon: History, 
    label: "History", 
    href: "/vip/history",
    activeColor: "text-[#00acc7] dark:text-[#00bed1]",
    gradientFrom: "from-[#00acc7]",
    gradientTo: "to-[#00d1dc]"
  },
  { 
    icon: Building2, 
    label: "Perusahaan", 
    href: "/vip/perusahaan",
    activeColor: "text-[#5547d0] dark:text-[#8e68fd]",
    gradientFrom: "from-[#5547d0]",
    gradientTo: "to-[#3977d3]"
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
        
        {/* Glassmorphism Container with Curved Top - PURPLE/CYAN THEME */}
        <div className="relative mx-4 rounded-[28px] bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl border border-[#8e68fd]/30 dark:border-[#5547d0]/50 shadow-[0_-8px_40px_rgba(142,104,253,0.15)] dark:shadow-[0_-8px_40px_rgba(85,71,208,0.5)]">
          
          {/* Gradient Overlay for Extra Depth - PURPLE/CYAN */}
          <div className="absolute inset-0 rounded-[28px] bg-gradient-to-t from-[#8e68fd]/10 to-transparent dark:from-[#5547d0]/30 pointer-events-none" />
          
          {/* Navigation Items Container */}
          <div className="relative flex items-center justify-around h-[72px] px-2 safe-area-inset-bottom">
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
                      {/* Outer Glow Ring with Rotation - CYAN/PURPLE */}
                      <motion.div 
                        className={cn(
                          "absolute -inset-3 rounded-[26px]",
                          "bg-gradient-to-br from-[#00d1dc]/30 to-[#00acc7]/30 blur-2xl",
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
                      
                      {/* Inner Glow - CYAN/PURPLE */}
                      <motion.div 
                        className={cn(
                          "absolute -inset-1 rounded-[25px]",
                          "bg-gradient-to-br from-[#00d1dc]/60 to-[#00acc7]/60 blur-md",
                        )}
                        animate={isActive ? { opacity: 0.8 } : { opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      
                      {/* Main Button with Interactive Animations - CYAN GRADIENT */}
                      <motion.div 
                        className={cn(
                          "relative flex items-center justify-center",
                          "w-[70px] h-[70px] rounded-[24px]",
                          "bg-gradient-to-br from-[#00d1dc] via-[#00bed1] to-[#00acc7]",
                          "shadow-[0_12px_48px_rgba(0,209,220,0.5)] dark:shadow-[0_12px_48px_rgba(0,190,209,0.7)]",
                          "border-[4px] border-white dark:border-gray-900",
                        )}
                        whileHover={{ 
                          scale: 1.1,
                          rotate: -3,
                          boxShadow: "0 20px 64px rgba(0,209,220,0.65)",
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
                          boxShadow: "0 16px 56px rgba(0,209,220,0.6)"
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
                        <div className="absolute inset-[4px] rounded-[20px] bg-gradient-to-t from-transparent to-white/20" />
                        
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
                          <Icon className="w-8 h-8 text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)] relative z-10" strokeWidth={2.5} />
                        </motion.div>
                      </motion.div>
                    </Link>
                    
                    {/* Center Label with Background - CYAN */}
                    <div className={cn(
                      "px-3 py-1 rounded-full transition-all duration-300 shadow-sm",
                      isActive 
                        ? "bg-[#00d1dc]/15 dark:bg-[#00bed1]/25 ring-1 ring-[#00d1dc]/20"
                        : "bg-white/60 dark:bg-gray-800/60"
                    )}>
                      <span className={cn(
                        "text-xs font-bold transition-all duration-300 whitespace-nowrap",
                        isActive 
                          ? "text-[#00acc7] dark:text-[#00d1dc] scale-105"
                          : "text-gray-600 dark:text-gray-400"
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
                  className="relative flex flex-col items-center justify-center flex-1 h-full gap-1 group"
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
                        "w-11 h-11 rounded-xl",
                        isActive ? [
                          "bg-gradient-to-br",
                          item.gradientFrom,
                          item.gradientTo,
                          "shadow-md shadow-current/20"
                        ] : [
                          "bg-transparent",
                        ]
                      )}
                      whileHover={{
                        scale: 1.08,
                        backgroundColor: isActive ? undefined : "rgba(107, 114, 128, 0.1)",
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{
                        scale: 0.95,
                        transition: { duration: 0.1 }
                      }}
                      animate={isActive ? {
                        scale: 1.03
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
                            "w-5.5 h-5.5",
                            isActive 
                              ? "text-white"
                              : "text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                          )} 
                          strokeWidth={isActive ? 2.5 : 2.2}
                        />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                  
                  {/* Label */}
                  <motion.span 
                    className={cn(
                      "text-xs font-semibold whitespace-nowrap",
                      isActive 
                        ? [item.activeColor, "font-bold"]
                        : "text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
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
