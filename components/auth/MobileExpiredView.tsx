"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { createClient } from "@/lib/supabase/client";
import { 
  LogOut, Clock, AlertTriangle, ArrowRight, Crown, Sparkles, Shield
} from "lucide-react";

// --- ANIMATION VARIANTS ---
const floatAnimation = {
  animate: {
    y: [0, -12, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const logoVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
      delay: 0.2
    }
  }
};

export default function MobileExpiredView() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  
  const handleLogout = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/sign-in");
  };

  const handleExtend = () => {
    router.push("/payment?plan=premium");
  };

  return (
    <>
      {loading && <LoadingScreen message="Sedang keluar..." />}
      
      <div className="fixed inset-0 w-full h-full bg-white overflow-hidden font-sans text-slate-900 selection:bg-[#00acc7] selection:text-white">
        <div className="absolute inset-0 flex flex-col bg-white">
          
          {/* Background with Brand Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#8e68fd] via-[#6e52e0] to-[#00acc7] z-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(142,104,253,0.5),transparent_50%)] mix-blend-overlay" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(0,209,220,0.4),transparent_50%)] mix-blend-soft-light" />
            <div className="absolute inset-0 opacity-30 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            
            {/* Animated Background Orbs */}
            <motion.div 
              animate={{ y: [0, -30, 0], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-[#00d1dc] rounded-full blur-[100px] opacity-40 mix-blend-overlay"
            />
            <motion.div 
              animate={{ y: [0, 30, 0], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute bottom-[-10%] left-[-20%] w-96 h-96 bg-[#5547d0] rounded-full blur-[120px] opacity-40 mix-blend-multiply"
            />
          </div>

           {/* Fixed Logo at Top */}
           <motion.div 
              variants={logoVariants}
              initial="hidden"
              animate="visible"
              className="absolute -top-20 left-0 right-0 z-0 flex justify-center pointer-events-none"
           >
              <div className="relative">
                <motion.div
                  className="absolute inset-0 bg-white/20 rounded-full blur-xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.3, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <img src="/Logo/x.png" alt="JobMate" className="w-64 h-64 object-contain relative z-10 drop-shadow-2xl" />
              </div>
           </motion.div>

          {/* Main Content Area */}
          <div className="flex-1 relative z-10 flex flex-col items-center justify-center px-8 pt-48">
            
            {/* EXPIRED ILLUSTRATION */}
            <motion.div 
              variants={floatAnimation}
              animate="animate"
              className="relative w-64 h-64 mb-8"
            >
              {/* Central Circle */}
              <div className="absolute inset-4 bg-gradient-to-tr from-white/10 to-white/5 rounded-full backdrop-blur-sm border border-white/10 shadow-2xl flex items-center justify-center">
                
                {/* Warning Card */}
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-32 h-44 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden relative z-20 transform rotate-3"
                >
                  {/* Card Header */}
                  <div className="h-16 bg-gradient-to-r from-orange-400 to-red-500 p-3 flex items-end justify-center">
                    <div className="w-12 h-12 bg-white rounded-full border-4 border-white shadow-sm flex items-center justify-center -mb-6">
                      <Clock className="w-6 h-6 text-orange-500" />
                    </div>
                  </div>
                  {/* Card Lines */}
                  <div className="flex-1 p-4 pt-8 space-y-3 text-center">
                    <div className="h-2 w-20 bg-slate-100 rounded-full mx-auto" />
                    <p className="text-[10px] font-bold text-slate-400 mt-2">EXPIRED</p>
                    <div className="flex gap-1 justify-center mt-3 opacity-50">
                      <div className="w-1 h-1 rounded-full bg-red-300" />
                      <div className="w-1 h-1 rounded-full bg-red-300" />
                      <div className="w-1 h-1 rounded-full bg-red-300" />
                    </div>
                  </div>
                  {/* Alert Badge */}
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, type: "spring" }}
                    className="absolute top-2 right-2"
                  >
                    <AlertTriangle className="w-5 h-5 text-white fill-white/20" />
                  </motion.div>
                </motion.div>

                {/* Floating Elements */}
                <motion.div 
                  animate={{ x: [0, 10, 0], y: [0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute top-0 right-0 bg-white p-3 rounded-2xl shadow-lg z-30"
                >
                  <Crown className="w-6 h-6 text-amber-400" />
                </motion.div>

                <motion.div 
                  animate={{ x: [0, -10, 0], y: [0, 5, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute bottom-8 left-0 bg-white p-3 rounded-2xl shadow-lg z-30"
                >
                  <Shield className="w-6 h-6 text-[#8e68fd]" />
                </motion.div>
              </div>
            </motion.div>

            {/* Headlines */}
            <div className="text-center space-y-3">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl font-extrabold text-white leading-tight drop-shadow-md"
              >
                Masa Aktif <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-red-200">
                  Telah Berakhir
                </span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-white/90 text-sm leading-relaxed max-w-[280px] mx-auto font-medium tracking-wide"
              >
                Membership Anda telah kedaluwarsa. Perpanjang sekarang untuk kembali akses fitur premium.
              </motion.p>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="p-8 pb-12 relative z-20 space-y-4">
            <Button 
              onClick={handleExtend}
              className="w-full h-14 rounded-full bg-white text-[#5547d0] font-bold text-lg shadow-[0_8px_25px_rgba(0,0,0,0.2)] hover:bg-slate-50 hover:shadow-[0_12px_35px_rgba(0,0,0,0.25)] active:scale-[0.98] transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden"
            >
               <span className="relative z-10 flex items-center justify-center gap-2">
                 <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400" />
                 Perpanjang Sekarang
               </span>
               {/* Shimmer Effect */}
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />
            </Button>
            
            <Button
              variant="ghost"
              onClick={handleLogout} 
              className="w-full h-12 text-white/70 hover:text-white hover:bg-white/10 transition-colors font-medium"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Keluar dari Akun
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
