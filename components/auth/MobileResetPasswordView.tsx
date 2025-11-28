"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { createClient } from "@/lib/supabase/client";
import { 
  AlertCircle, Mail, ArrowLeft, CheckCircle2, Lock, KeyRound
} from "lucide-react";

// --- ANIMATION VARIANTS ---
const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.98
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  exit: {
    opacity: 0,
    scale: 0.98
  }
};

export default function MobileResetPasswordView() {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  
  const emailInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => emailInputRef.current?.focus(), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Mohon isi email anda.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      // Redirect URL should be the full path to the verify page
      const redirectUrl = `${window.location.origin}/auth/verify?type=recovery`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch (err) {
      console.error("Reset error:", err);
      setError("Terjadi kesalahan sistem.");
      setLoading(false);
    }
  };

// ... existing code ...

  if (success) {
    return (
      <div className="fixed inset-0 w-full h-full bg-white overflow-hidden font-sans text-slate-900">
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
        </div>

        {/* Header Section - Consistent with Form View */}
        <div className="relative z-10 pt-6 px-6 shrink-0 flex flex-col items-center w-full">
          <div className="w-full flex items-center justify-between mb-2 relative h-10">
            <Link href="/sign-in">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative z-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-sm hover:bg-white/20 text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            
            {/* Top Logo */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
               <img src="/Logo/x.png" alt="JobMate" className="w-64 h-64 object-contain drop-shadow-2xl" />
            </div>
            
            <div className="w-10" /> 
          </div>

           {/* Illustration - Success Icon */}
           <div className="w-full flex justify-center items-center mb-6 mt-2">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", duration: 0.8 }}
                className="relative w-[200px] h-[160px] flex items-center justify-center mx-auto"
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="absolute w-32 h-32 bg-white/5 rounded-full blur-[40px]" />
                  
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="relative z-20"
                  >
                    <div className="w-24 h-24 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-full shadow-2xl flex items-center justify-center">
                      <div className="w-16 h-16 bg-gradient-to-tr from-[#00acc7] to-[#009eb5] rounded-full flex items-center justify-center shadow-inner shadow-white/20">
                        <CheckCircle2 className="w-8 h-8 text-white drop-shadow-md" />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
          </div>

           {/* Text */}
           <div className="text-center mb-4">
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-white"
            >
              Email Terkirim!
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white/80 text-sm mt-1 max-w-[280px] mx-auto"
            >
              Kami telah mengirimkan tautan reset password ke email Anda.
            </motion.p>
          </div>
        </div>

        {/* Content Section - Bottom Sheet Style */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.1 }}
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-20 overflow-hidden h-[45%]"
        >
          <div className="flex flex-col h-full p-8">
            <div className="flex-1 flex flex-col justify-center space-y-6">
               <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <p className="font-semibold text-slate-700 mb-3 text-sm">Langkah selanjutnya:</p>
                  <ul className="space-y-2.5">
                    <li className="flex items-start gap-3 text-sm text-slate-600">
                      <div className="w-5 h-5 rounded-full bg-[#e0f7fa] flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold text-[#00acc7]">1</span>
                      </div>
                      <span>Cek inbox atau folder spam email Anda</span>
                    </li>
                     <li className="flex items-start gap-3 text-sm text-slate-600">
                      <div className="w-5 h-5 rounded-full bg-[#e0f7fa] flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold text-[#00acc7]">2</span>
                      </div>
                      <span>Klik tautan yang kami kirimkan</span>
                    </li>
                     <li className="flex items-start gap-3 text-sm text-slate-600">
                      <div className="w-5 h-5 rounded-full bg-[#e0f7fa] flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold text-[#00acc7]">3</span>
                      </div>
                      <span>Buat password baru yang aman</span>
                    </li>
                  </ul>
               </div>

               <Link href="/sign-in" className="block w-full">
                <Button className="w-full h-14 rounded-2xl bg-[#8e68fd] hover:bg-[#7b5ad9] text-white font-bold text-lg shadow-lg shadow-[#8e68fd]/25">
                  Kembali ke Halaman Masuk
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 w-full h-full bg-white overflow-hidden font-sans text-slate-900 selection:bg-[#00acc7] selection:text-white">
        <AnimatePresence initial={false}>
          
          <motion.div
            key="reset-form"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 flex flex-col bg-white text-slate-900 overflow-hidden"
          >
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
            </div>

            {/* Header Section */}
            <div className="relative z-10 pt-6 px-6 shrink-0 flex flex-col items-center w-full">
              {/* Top Logo */}
              <div className="absolute top-6 left-6">
                <Link href="/" className="block">
                  <div className="relative h-12 w-12">
                    <img src="/Logo/x.png" alt="JobMate" className="w-12 h-12 object-contain drop-shadow-lg" />
                  </div>
                </Link>
              </div>

              {/* Navigation */}
              <div className="w-full flex items-center justify-between mb-2 relative h-10">
                <Link href="/sign-in">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative z-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-sm hover:bg-white/20 text-white"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </Link>
                
                <div className="w-10" /> 
              </div>

              {/* Illustration */}
              <div className="w-full flex justify-center items-center mb-6 mt-2">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", duration: 0.8 }}
                    className="relative w-[200px] h-[160px] flex items-center justify-center mx-auto"
                  >
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div className="absolute w-32 h-32 bg-white/5 rounded-full blur-[40px]" />
                      
                      <motion.div 
                        animate={{ y: [-5, 5, -5] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="relative z-20"
                      >
                        <div className="w-24 h-24 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl flex items-center justify-center transform -rotate-3">
                          <div className="w-16 h-16 bg-gradient-to-tr from-[#8e68fd] to-[#6e52e0] rounded-xl flex items-center justify-center shadow-inner shadow-white/20">
                            <KeyRound className="w-8 h-8 text-white drop-shadow-md" />
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
              </div>

              {/* Text */}
              <div className="text-center mb-4">
                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold text-white"
                >
                  Lupa Password?
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-white/80 text-sm mt-1 max-w-[240px]"
                >
                  Masukkan email Anda untuk mereset kata sandi
                </motion.p>
              </div>
            </div>

            {/* Form Section */}
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.1 }}
              className="flex-1 bg-white rounded-t-[2.5rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] relative z-20 flex flex-col overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto px-8 pt-8 pb-4 scrollbar-hide">
                <form onSubmit={handleResetPassword} className="space-y-6">
                  
                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-600 ml-1">Email Address</Label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00acc7] transition-colors">
                        <Mail className="w-5 h-5" />
                      </div>
                      <Input
                        ref={emailInputRef}
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(null); }}
                        placeholder="nama@email.com"
                        className="h-14 pl-12 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white focus:border-[#00acc7] focus:ring-4 focus:ring-[#00acc7]/10 transition-all font-medium text-base"
                      />
                    </div>
                  </div>

                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }} 
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-red-50/80 border border-red-100 text-red-600 rounded-xl p-3 flex items-center gap-3 text-sm"
                      >
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <span className="font-medium">{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <Button 
                      type="submit"
                      disabled={loading}
                      className="w-full h-14 rounded-2xl text-lg font-bold text-white bg-gradient-to-r from-[#00acc7] to-[#009eb5] hover:from-[#00bed1] hover:to-[#00acc7] shadow-lg shadow-[#00acc7]/25 active:scale-[0.98] transition-all duration-300"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Mengirim...</span>
                        </div>
                      ) : (
                        "Kirim Link Reset"
                      )}
                    </Button>
                  </div>
                </form>

                {/* Back Link */}
                <div className="mt-6 text-center pb-4">
                  <p className="text-sm text-slate-500">
                    Ingat password Anda?{" "}
                    <Link href="/sign-in" className="text-[#00acc7] font-bold hover:text-[#8e68fd] transition-colors">
                      Masuk Disini
                    </Link>
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </AnimatePresence>
      </div>
    </>
  );
}
