"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Briefcase, LayoutGrid, Bell, User } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { shouldHideBottomBar } from "@/lib/navigation-config";

const navItems = [
  { 
    icon: Home, 
    label: "Home", 
    href: "/dashboard",
    isCenter: false
  },
  { 
    icon: Briefcase, 
    label: "Jobs", 
    href: "/vip",
    isCenter: false
  },
  { 
    icon: LayoutGrid, 
    label: "Tools", 
    href: "/tools",
    isCenter: true
  },
  { 
    icon: Bell, 
    label: "Activity", 
    href: "/tools/tracker",
    isCenter: false
  },
  { 
    icon: User, 
    label: "Profile", 
    href: "/settings",
    isCenter: false
  }
];

export function BottomBar() {
  const pathname = usePathname();
  
  if (shouldHideBottomBar(pathname)) {
    return null;
  }
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      {/* Main Bar Background */}
      <div className="relative bg-white dark:bg-[#1A1A1A] border-t border-gray-100 dark:border-gray-800 pb-safe-area-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
        <div className="flex items-end justify-between px-2 h-[80px] pb-3">
        
        {navItems.map((item, index) => {
          const isActive = pathname.startsWith(item.href) && item.href !== '/';
          const Icon = item.icon;

          // CENTER FLOATING BUTTON
          if (item.isCenter) {
            return (
              <div key={index} className="relative -top-8 px-1 flex flex-col items-center justify-end h-full z-10">
                <Link href={item.href} className="flex flex-col items-center gap-1">
                  <motion.div
                    className="relative flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Shadow/Glow for the floating button */}
                    <div className={cn(
                      "absolute inset-2 rounded-full blur-md transition-all duration-300",
                      isActive 
                        ? "bg-[#8e68fd]/60 scale-110" 
                        : "bg-gray-300/50 dark:bg-black/50"
                    )} />

                    {/* Main Button Circle */}
                    <div className={cn(
                      "relative flex items-center justify-center w-[64px] h-[64px] rounded-full transition-all duration-300",
                      isActive 
                        ? "bg-gradient-to-br from-[#8e68fd] to-[#5547d0]" 
                        : "bg-white dark:bg-[#1A1A1A]",
                      "border-[4px] border-white dark:border-[#1A1A1A]", // Matches background to look integrated
                      "shadow-lg"
                    )}>
                      
                      {/* Icon with Rotation */}
                      <motion.div
                        animate={{ rotate: isActive ? 360 : 0 }}
                        transition={isActive ? { duration: 4, repeat: Infinity, ease: "linear" } : { duration: 0.3 }}
                        className="flex items-center justify-center"
                      >
                        <Icon 
                          className={cn(
                            "w-7 h-7 transition-colors duration-300",
                            isActive 
                              ? "text-white" 
                              : "text-gray-400 dark:text-gray-400"
                          )} 
                          strokeWidth={2}
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                  
                  {/* Label */}
                  <span className={cn(
                    "text-[10px] font-medium transition-all duration-300",
                    isActive 
                      ? "text-[#8e68fd] dark:text-[#8e68fd] font-bold" 
                      : "text-gray-400 dark:text-gray-500"
                  )}>
                    {item.label}
                  </span>
                </Link>
              </div>
            );
          }

          // STANDARD BUTTONS
          return (
            <Link
              key={index}
              href={item.href}
              className="flex-1 relative flex flex-col items-center justify-center h-[56px] group"
            >
              <div className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300",
                isActive ? "-translate-y-0.5" : "translate-y-0"
              )}>
                <Icon 
                  className={cn(
                    "w-[22px] h-[22px] transition-colors duration-300",
                    isActive 
                      ? "text-[#8e68fd] dark:text-[#8e68fd]" 
                      : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                  )} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className={cn(
                  "text-[10px] font-medium transition-colors duration-300",
                   isActive 
                     ? "text-[#8e68fd] dark:text-[#8e68fd] font-bold" 
                     : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                )}>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
      </div>
      
      <style jsx global>{`
        .pb-safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom, 20px);
        }
      `}</style>
    </div>
  );
}
