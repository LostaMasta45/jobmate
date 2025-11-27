"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { createClient } from "@/lib/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Eye, EyeOff, AlertCircle, Mail, KeyRound, 
  ArrowLeft, Shield, Briefcase, User, CheckCircle2, Search 
} from "lucide-react";

// --- ANIMATION VARIANTS ---
const pageVariants = {
  initial: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0
  }),
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      mass: 0.8
    }
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      mass: 0.8
    }
  })
};

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

// --- MAIN COMPONENT ---
export default function MobileSignInPage() {
  const [view, setView] = React.useState<'welcome' | 'login'>('welcome');
  const [direction, setDirection] = React.useState(0);
  
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = React.useState(false);
  
  const emailInputRef = React.useRef<HTMLInputElement>(null);

  // Auto-focus logic
  React.useEffect(() => {
    if (view === 'login') {
      const timer = setTimeout(() => emailInputRef.current?.focus(), 500);
      return () => clearTimeout(timer);
    }
  }, [view]);

  const goToLogin = () => {
    setDirection(1);
    setView('login');
  };

  const backToWelcome = () => {
    setDirection(-1);
    setView('welcome');
    setError(null);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Mohon isi email dan kata sandi.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      
      if (rememberMe) {
        await supabase.auth.updateUser({
          data: { remember_me: true }
        });
      }

      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError("Email atau kata sandi salah.");
        setLoading(false);
        return;
      }

      if (!authData.user) {
        setError("Gagal masuk. Silakan coba lagi.");
        setLoading(false);
        return;
      }

      // Check profile for redirection
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, membership")
        .eq("id", authData.user.id)
        .maybeSingle();

      let redirectPath = "/";
      if (profile?.role === "admin") redirectPath = "/admin/dashboard";
      else if (["vip_premium", "premium"].includes(profile?.membership)) redirectPath = "/dashboard";
      else if (["vip_basic", "basic"].includes(profile?.membership)) redirectPath = "/vip";

      setShowLoadingScreen(true);
      setTimeout(() => window.location.replace(redirectPath), 2000);
      
    } catch (err) {
      console.error("Login error:", err);
      setError("Terjadi kesalahan sistem.");
      setLoading(false);
    }
  };

  return (
    <>
      {showLoadingScreen && <LoadingScreen message="Sedang masuk..." />}
      
      <div className="fixed inset-0 w-full h-full bg-white overflow-hidden font-sans text-slate-900 selection:bg-[#00acc7] selection:text-white">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          
          {/* === PAGE 1: WELCOME SCREEN === */}
          {view === 'welcome' && (
            <motion.div
              key="welcome"
              custom={direction}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute inset-0 flex flex-col bg-white"
            >
              {/* Background with Brand Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#8e68fd] via-[#6e52e0] to-[#00acc7] z-0">
                <div className="absolute inset-0 opacity-20 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
                
                {/* Animated Background Orbs */}
                <motion.div 
                  animate={{ y: [0, -30, 0], opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 8, repeat: Infinity }}
                  className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-[#00d1dc] rounded-full blur-[80px] opacity-40 mix-blend-overlay"
                />
                <motion.div 
                  animate={{ y: [0, 30, 0], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 10, repeat: Infinity }}
                  className="absolute bottom-[-10%] left-[-20%] w-96 h-96 bg-[#5547d0] rounded-full blur-[100px] opacity-40 mix-blend-multiply"
                />
              </div>

              {/* Fixed Logo at Top */}
               <motion.div 
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    delay: 0.2
                  }}
                  className="absolute -top-20 left-0 right-0 z-0 flex justify-center pointer-events-none"
               >
                  <div className="relative">
                    <motion.div
                      className="absolute inset-0 bg-white/20 rounded-full blur-xl"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.3, 0.5] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <img src="/Logo/x.png" alt="JobMate" className="w-64 h-64 object-contain relative z-10 drop-shadow-2xl opacity-90" />
                  </div>
               </motion.div>

              {/* Main Content Area */}
              <div className="flex-1 relative z-10 flex flex-col items-center justify-center px-8 pt-48">
                
                {/* JOB SEEKER ILLUSTRATION */}
                <motion.div 
                  variants={floatAnimation}
                  animate="animate"
                  className="relative w-64 h-64 mb-8"
                >
                  {/* Central Circle (The World/Market) */}
                  <div className="absolute inset-4 bg-gradient-to-tr from-white/10 to-white/5 rounded-full backdrop-blur-sm border border-white/10 shadow-2xl flex items-center justify-center">
                    
                    {/* Resume Card */}
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="w-32 h-44 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden relative z-20 transform -rotate-6"
                    >
                      {/* Card Header */}
                      <div className="h-16 bg-gradient-to-r from-[#8e68fd] to-[#00acc7] p-3 flex items-end justify-center">
                        <div className="w-12 h-12 bg-white rounded-full border-4 border-white shadow-sm flex items-center justify-center -mb-6">
                          <User className="w-6 h-6 text-[#8e68fd]" />
                        </div>
                      </div>
                      {/* Card Lines */}
                      <div className="flex-1 p-4 pt-8 space-y-2">
                        <div className="h-2 w-20 bg-slate-100 rounded-full mx-auto" />
                        <div className="h-1.5 w-24 bg-slate-50 rounded-full mx-auto" />
                        <div className="flex gap-1 justify-center mt-3 opacity-50">
                          <div className="w-1 h-1 rounded-full bg-slate-300" />
                          <div className="w-1 h-1 rounded-full bg-slate-300" />
                          <div className="w-1 h-1 rounded-full bg-slate-300" />
                        </div>
                      </div>
                      {/* Verified Badge */}
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.8, type: "spring" }}
                        className="absolute bottom-2 right-2"
                      >
                        <CheckCircle2 className="w-6 h-6 text-[#00acc7] fill-white" />
                      </motion.div>
                    </motion.div>

                    {/* Floating Elements */}
                    <motion.div 
                      animate={{ x: [0, 10, 0], y: [0, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="absolute top-0 right-0 bg-white p-3 rounded-2xl shadow-lg z-30"
                    >
                      <Search className="w-6 h-6 text-[#00acc7]" />
                    </motion.div>

                    <motion.div 
                      animate={{ x: [0, -10, 0], y: [0, 5, 0] }}
                      transition={{ duration: 5, repeat: Infinity }}
                      className="absolute bottom-8 left-0 bg-white p-3 rounded-2xl shadow-lg z-30"
                    >
                      <Briefcase className="w-6 h-6 text-[#8e68fd]" />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Headlines */}
                <div className="text-center space-y-3">
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-4xl font-extrabold text-white leading-tight drop-shadow-md"
                  >
                    Jemput Masa Depan <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d1dc] to-white">
                      Cemerlang
                    </span>
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-white/80 text-base leading-relaxed max-w-[280px] mx-auto font-medium tracking-wide"
                  >
                    Platform karir modern yang menghubungkan potensimu dengan perusahaan impian.
                  </motion.p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-8 pb-12 relative z-20 space-y-4">
                <Button 
                  onClick={goToLogin}
                  className="w-full h-14 rounded-full bg-white text-[#5547d0] font-bold text-lg shadow-[0_8px_25px_rgba(0,0,0,0.2)] hover:bg-slate-50 hover:shadow-[0_12px_35px_rgba(0,0,0,0.25)] active:scale-[0.98] transition-all duration-300 hover:-translate-y-1"
                >
                  Masuk
                </Button>
                
                <Link href="/ajukan-akun" className="block w-full">
                  <Button 
                    variant="outline"
                    className="w-full h-14 rounded-full border border-white/40 bg-white/10 backdrop-blur-md text-white font-semibold text-base hover:bg-white/20 hover:border-white/60 transition-all duration-300 shadow-lg"
                  >
                    Ajukan Akun (Jika belum punya)
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}

          {/* === PAGE 2: LOGIN FORM === */}
          {view === 'login' && (
            <motion.div
              key="login"
              custom={direction}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute inset-0 flex flex-col bg-white text-slate-900"
            >
              {/* Header Bar */}
              <div className="pt-6 px-6 pb-4 flex items-center relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={backToWelcome}
                  className="rounded-full hover:bg-slate-100 text-slate-600 relative z-10"
                >
                  <ArrowLeft className="w-6 h-6" />
                </Button>
                
                {/* Centered Logo for Page 2 */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                   <img src="/Logo/x.png" alt="JobMate" className="w-64 h-64 object-contain drop-shadow-xl opacity-20" />
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-8">
                <div className="space-y-2 mb-8 mt-2">
                  <motion.h2 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-3xl font-bold text-slate-900"
                  >
                    Selamat Datang!
                  </motion.h2>
                  <motion.p 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-slate-500 text-base"
                  >
                    Silakan masuk untuk melanjutkan.
                  </motion.p>
                </div>

                <form onSubmit={handleSignIn} className="space-y-6">
                  <div className="space-y-5">
                    {/* Email Input */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-slate-700 ml-1">Email</Label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00acc7] transition-colors">
                          <Mail className="w-5 h-5" />
                        </div>
                        <Input
                          ref={emailInputRef}
                          type="email"
                          value={email}
                          onChange={(e) => { setEmail(e.target.value); setError(null); }}
                          placeholder="contoh@email.com"
                          className="h-14 pl-12 rounded-2xl bg-slate-50 border-slate-200 focus:bg-white focus:border-[#00acc7] focus:ring-[#00acc7]/20 transition-all font-medium"
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-slate-700 ml-1">Kata Sandi</Label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00acc7] transition-colors">
                          <KeyRound className="w-5 h-5" />
                        </div>
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => { setPassword(e.target.value); setError(null); }}
                          placeholder="••••••••"
                          className="h-14 pl-12 pr-12 rounded-2xl bg-slate-50 border-slate-200 focus:bg-white focus:border-[#00acc7] focus:ring-[#00acc7]/20 transition-all font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Checkbox & Forgot Password */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="remember" 
                          checked={rememberMe} 
                          onCheckedChange={(c) => setRememberMe(!!c)}
                          className="border-slate-300 data-[state=checked]:bg-[#00acc7] data-[state=checked]:border-[#00acc7] rounded-[6px]"
                        />
                        <label
                          htmlFor="remember"
                          className="text-sm font-medium text-slate-600 cursor-pointer select-none"
                        >
                          Ingat saya
                        </label>
                      </div>
                      <Link href="/reset" className="text-sm font-bold text-[#00acc7] hover:text-[#009eb5]">
                        Lupa Password?
                      </Link>
                    </div>
                  </div>

                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10, height: 0 }} 
                        animate={{ opacity: 1, y: 0, height: 'auto' }} 
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-3 flex items-center gap-3 text-sm font-medium"
                      >
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Login Button */}
                  <div className="pt-4">
                    <Button 
                      type="submit"
                      disabled={loading}
                      className="w-full h-14 rounded-full text-lg font-bold text-white bg-gradient-to-r from-[#00acc7] to-[#009eb5] hover:from-[#00bed1] hover:to-[#00acc7] shadow-[0_8px_25px_rgba(0,172,199,0.3)] hover:shadow-[0_12px_35px_rgba(0,172,199,0.4)] active:scale-[0.98] transition-all duration-300 hover:-translate-y-1"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Memproses...</span>
                        </div>
                      ) : (
                        "Masuk"
                      )}
                    </Button>
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="p-6 text-center bg-white">
                <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
                  <Shield className="w-3 h-3 text-[#00acc7]" />
                  <span>Aman & Terenkripsi oleh JobMate</span>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </>
  );
}
