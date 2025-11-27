"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Grid, Search, Clock, User, Briefcase, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Project Color Palette from colorpallate.md
const COLORS = {
  heliotrope: "#8e68fd",      // Primary Purple
  robinsEggBlue: "#00d1dc",   // Cyan/Teal
  purpleHeart: "#5547d0",     // Darker Purple
  pacificBlue: "#00acc7",     // Blue
  alto: "#dfdfdf"             // Light Gray
};

const navItems = [
  { 
    icon: Home, 
    href: "/vip",
    label: "Home"
  },
  { 
    icon: LayoutGrid, 
    href: "/tools",
    label: "Tools"
  },
  { 
    icon: Search, 
    href: "/vip/loker", 
    isCenter: true,
    label: "Cari"
  },
  { 
    icon: Briefcase, 
    href: "/vip/history",
    label: "History"
  },
  { 
    icon: User, 
    href: "/vip/profile", 
    label: "Profile"
  }
];

export function VIPBottomBarV2() {
  const pathname = usePathname();

  // Helper to check active state
  const isActive = (href: string) => {
    if (href === '/vip' && pathname === '/vip2') return true;
    if (href === '/vip/loker' && pathname === '/vip2/loker2') return true;
    if (href === '/vip') return pathname === '/vip';
    return pathname.startsWith(href);
  };
  
  return (
    <>
      {/* Bottom Navigation Bar - Full Width Fixed */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        {/* Gradient Top Border Line for that 'Premium' feel */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#8e68fd] to-transparent opacity-50" />
        
        {/* Main Bar Background */}
        <div className="bg-white/95 dark:bg-[#0f0f0f]/95 backdrop-blur-xl pb-safe-area-bottom">
          <div className="flex items-end justify-between px-4 h-[70px] pb-2">
            {navItems.map((item, index) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              
              // CENTER BUTTON - High Premium Gradient Orb
              if (item.isCenter) {
                return (
                  <div key={index} className="relative -top-8 px-2 flex justify-center items-center">
                    
                    {/* RIPPLE EFFECT BACKGROUND (Only when active) */}
                    {active && (
                      <>
                        <motion.div
                          className="absolute rounded-full bg-[#8e68fd]/30"
                          style={{ width: '68px', height: '68px', zIndex: 0 }}
                          initial={{ scale: 1, opacity: 0.8 }}
                          animate={{ scale: 1.6, opacity: 0 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                        />
                        <motion.div
                          className="absolute rounded-full bg-[#8e68fd]/20"
                          style={{ width: '68px', height: '68px', zIndex: 0 }}
                          initial={{ scale: 1, opacity: 0.6 }}
                          animate={{ scale: 2, opacity: 0 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
                        />
                      </>
                    )}

                    <Link href="/vip/loker" className="relative z-10"> 
                       <motion.div
                        className={cn(
                          "flex items-center justify-center w-[68px] h-[68px] rounded-full", 
                          "text-white",
                          "shadow-[0_8px_25px_-5px_rgba(142,104,253,0.5)]", 
                          "border-[6px] border-white dark:border-[#0f0f0f]" 
                        )}
                        style={{
                          background: `linear-gradient(135deg, ${COLORS.heliotrope}, ${COLORS.purpleHeart})`
                        }}
                        whileTap={{ scale: 0.9 }}
                        // Breathing animation
                        animate={active ? {
                          boxShadow: [
                            `0 8px 25px -5px ${COLORS.heliotrope}80`,
                            `0 15px 35px -5px ${COLORS.heliotrope}60`,
                            `0 8px 25px -5px ${COLORS.heliotrope}80`
                          ],
                          scale: [1, 1.03, 1]
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        {/* ROTATING ICON (Radar Scan Effect) */}
                        <motion.div
                          animate={active ? { rotate: 360 } : { rotate: 0 }}
                          transition={active ? { duration: 4, repeat: Infinity, ease: "linear" } : { duration: 0.3 }}
                        >
                          <Icon className="w-7 h-7 relative z-10" strokeWidth={2.5} />
                        </motion.div>
                      </motion.div>
                    </Link>
                  </div>
                );
              }

              // STANDARD ICONS
              return (
                <Link
                  key={index}
                  href={item.href}
                  className="flex flex-1 flex-col items-center justify-end pb-2 h-full relative group"
                >
                  <div className="relative flex flex-col items-center gap-1">
                    <Icon 
                      className={cn(
                        "w-[22px] h-[22px] transition-all duration-300", // Slightly smaller icon to make room for text
                        active ? "text-[#8e68fd] -translate-y-0.5" : "text-gray-400 dark:text-gray-500"
                      )}
                      style={{ color: active ? COLORS.heliotrope : undefined }}
                      strokeWidth={active ? 2.5 : 2} 
                    />
                    
                    {/* Text Label */}
                    <span className={cn(
                      "text-[10px] font-medium tracking-tight transition-all duration-300",
                      active 
                        ? "text-[#8e68fd] font-semibold" 
                        : "text-gray-400 dark:text-gray-500"
                    )}
                    style={{ color: active ? COLORS.heliotrope : undefined }}
                    >
                      {item.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Safe Area Support */}
      <style jsx global>{`
        .pb-safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom, 20px);
        }
      `}</style>
    </>
  );
}
