"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { createClient } from "@/lib/supabase/client";
import { 
  AlertCircle, Mail, CheckCircle2, Shield, ArrowLeft, Lock, KeyRound
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-is-mobile";
import MobileResetView from "@/components/auth/MobileResetView";
import MobileResetPasswordView from "@/components/auth/MobileResetPasswordView";
import { EmailSentAnimation } from "@/components/auth/EmailSentAnimation";

export default function ResetPasswordPage() {
  const isMobile = useIsMobile();
  
  // State
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  
  // Validation State
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [isFocused, setIsFocused] = React.useState<string | null>(null);
  
  const emailInputRef = React.useRef<HTMLInputElement>(null);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-focus
  React.useEffect(() => {
    if (!isMobile && isMounted && !success) {
      emailInputRef.current?.focus();
    }
  }, [isMobile, isMounted, success]);

  // Pure validation function (no state updates)
  const isValidEmail = (value: string) => {
    if (!value) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  // Validation with state updates (for onBlur and form submit)
  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError(null);
      return false;
    }
    if (!isValidEmail(value)) {
      setEmailError("Format email tidak valid");
      return false;
    }
    setEmailError(null);
    return true;
  };

  const handleEmailBlur = () => {
    if (email) {
      const trimmed = email.trim();
      if (trimmed !== email) {
        setEmail(trimmed);
        validateEmail(trimmed);
      }
    }
    setIsFocused(null);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      // Redirect URL should be the full path to the verify page
      const redirectUrl = `${window.location.origin}/auth/verify?type=recovery`;
      
      console.log('🔍 Debug Info:');
      console.log('  Email:', email);
      console.log('  Redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        console.error('❌ Reset failed:', error);
        setError(error.message);
        setLoading(false);
        return;
      }

      console.log('✅ Reset request successful! Check email (and spam folder)');
      setSuccess(true);
      setLoading(false);
    } catch (err) {
      console.error("Reset error:", err);
      setError("Terjadi kesalahan sistem.");
      setLoading(false);
    }
  };

  // Prevent Hydration Mismatch
  if (!isMounted) {
    return null;
  }

  // Mobile View
  if (isMobile) {
    return <MobileResetPasswordView />;
  }

  // Desktop Split Layout
  return (
    <>
      <div className="flex min-h-screen w-full overflow-hidden bg-background">
        
        {/* === LEFT SIDE: FORM === */}
        <div className="relative flex w-full flex-col justify-center px-8 sm:px-12 lg:w-[45%] xl:w-[40%] h-screen border-r border-border/40 shadow-xl z-20 bg-background/80 backdrop-blur-md">
          
          {/* Brand Logo */}
          <div className="absolute top-8 left-8 sm:left-12 z-50">
             <Link href="/" className="block group">
               <div className="relative h-32 w-32 transition-transform group-hover:scale-105">
                  <Image 
                    src="/Logo/x.png" 
                    alt="JobMate Logo" 
                    fill 
                    className="object-contain object-left" 
                    priority 
                  />
               </div>
             </Link>
          </div>

          <div className="mx-auto w-full max-w-sm space-y-8">
            
            <AnimatePresence mode="wait">
              {success ? (
                // SUCCESS STATE
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <EmailSentAnimation />
                  
                  <div className="space-y-2 text-center sm:text-left">
                    <h2 className="text-3xl font-bold tracking-tight">Email Terkirim!</h2>
                    <p className="text-muted-foreground">
                      Kami telah mengirimkan tautan untuk mereset kata sandi ke <strong className="text-foreground">{email}</strong>.
                    </p>
                  </div>

                  <div className="rounded-lg bg-muted/50 p-4 text-sm text-left border border-border/50">
                    <p className="font-medium mb-2 text-foreground">Langkah selanjutnya:</p>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-brand mt-1.5 shrink-0" />
                        <span>Cek kotak masuk (atau folder spam)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-brand mt-1.5 shrink-0" />
                        <span>Klik tautan yang diberikan</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-brand mt-1.5 shrink-0" />
                        <span>Buat password baru yang aman</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-4 space-y-3">
                    <Link href="/sign-in">
                      <Button className="w-full h-11 bg-brand hover:bg-brand/90 text-base shadow-lg shadow-brand/20 transition-all hover:-translate-y-0.5 active:translate-y-0">
                        Kembali ke Halaman Masuk
                      </Button>
                    </Link>
                    <div className="text-center">
                      <button 
                        onClick={() => setSuccess(false)}
                        className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
                      >
                        Belum menerima email? Kirim ulang
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                // FORM STATE
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="space-y-2 mb-8">
                    <Link href="/sign-in" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
                      <ArrowLeft className="w-4 h-4 mr-1" /> Kembali
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                      Lupa Password?
                    </h1>
                    <p className="text-muted-foreground">
                      Jangan khawatir. Masukkan email Anda dan kami akan mengirimkan petunjuk reset password.
                    </p>
                  </div>

                  <form onSubmit={handleResetPassword} className="space-y-5">
                    <AnimatePresence mode="wait">
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
                        >
                          <AlertCircle className="h-4 w-4" />
                          <p>{error}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="space-y-4">
                      {/* Email */}
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative group">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand">
                            <Mail className="h-4 w-4" />
                          </div>
                          <Input
                            ref={emailInputRef}
                            id="email"
                            type="email"
                            placeholder="nama@email.com"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              setError(null);
                            }}
                            onFocus={() => setIsFocused("email")}
                            onBlur={handleEmailBlur}
                            className={`pl-10 h-11 transition-all ${emailError ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:border-brand focus-visible:ring-brand/20'}`}
                            required
                          />
                          <AnimatePresence>
                            {email && !emailError && isValidEmail(email) && (
                              <motion.div 
                                initial={{ scale: 0 }} 
                                animate={{ scale: 1 }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        {emailError && <p className="text-xs text-destructive">{emailError}</p>}
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="w-full h-11 bg-brand hover:bg-brand/90 text-base shadow-lg shadow-brand/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {loading ? (
                         <div className="flex items-center gap-2">
                           <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                           <span>Mengirim...</span>
                         </div>
                      ) : (
                        "Kirim Link Reset"
                      )}
                    </Button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/60 pt-8 border-t border-border/40 mt-8">
              <Shield className="h-3 w-3" />
              <span>Akses Akun Aman & Terenkripsi</span>
            </div>
          </div>
        </div>

        {/* === RIGHT SIDE: VISUAL === */}
        <div className="relative hidden w-0 flex-1 lg:flex h-screen overflow-hidden bg-[#0a0a0a]">
          
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Mesh Gradients - Different colors for security theme (more blue/cyan) */}
            <div className="absolute -top-[20%] -right-[10%] h-[800px] w-[800px] rounded-full bg-blue-600/20 blur-[120px] animate-pulse duration-[8000ms]" />
            <div className="absolute top-[40%] -left-[20%] h-[600px] w-[600px] rounded-full bg-cyan-600/10 blur-[100px] animate-pulse duration-[10000ms]" />
            <div className="absolute bottom-[-10%] right-[10%] h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse duration-[6000ms]" />
            
            {/* Digital Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 flex h-full w-full flex-col justify-between p-16 text-white">
            
            {/* Top Badge */}
            <div className="flex justify-end">
               <motion.div 
                 initial={{ opacity: 0, y: -20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.5 }}
                 className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 backdrop-blur-xl border border-white/10 shadow-2xl"
               >
                  <div className="flex gap-1">
                     <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
                     <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse delay-75" />
                  </div>
                  <span className="text-xs font-medium text-white/80">Secure Account Recovery</span>
               </motion.div>
            </div>

            {/* Main Visual: Security Hub */}
            <div className="flex flex-1 items-center justify-center relative perspective-1000">
               
               {/* Central Glowing Core */}
               <div className="relative">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur-3xl opacity-50"
                  />
                  <div className="relative h-32 w-32 bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center shadow-[0_0_50px_-12px_rgba(255,255,255,0.3)] z-10">
                     <Lock className="h-12 w-12 text-cyan-400" />
                  </div>

                  {/* Orbiting Rings */}
                  <div className="absolute inset-[-50px] border border-white/5 rounded-full animate-spin-slow" style={{ animationDuration: '20s' }} />
                  <div className="absolute inset-[-100px] border border-dashed border-white/10 rounded-full animate-spin-reverse-slow" style={{ animationDuration: '30s' }} />
               </div>

               {/* Floating Cards */}
               {/* Card 1: Security Check */}
               <motion.div 
                 initial={{ x: 50, opacity: 0 }}
                 animate={{ x: 0, opacity: 1, y: [0, -10, 0] }}
                 transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", delay: 0.2 }}
                 className="absolute right-0 top-1/4 w-64 bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-2xl"
               >
                  <div className="flex items-start gap-4">
                     <div className="h-10 w-10 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
                        <Shield className="h-5 w-5 text-cyan-400" />
                     </div>
                     <div>
                        <h4 className="text-sm font-semibold text-white">Account Protected</h4>
                        <p className="text-xs text-white/60 mt-1">Data encryption enabled</p>
                     </div>
                  </div>
               </motion.div>

               {/* Card 2: Recovery Status */}
               <motion.div 
                 initial={{ x: -50, opacity: 0 }}
                 animate={{ x: 0, opacity: 1, y: [0, 15, 0] }}
                 transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
                 className="absolute left-[-20px] bottom-1/3 w-56 bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-2xl"
               >
                  <div className="flex items-center gap-3 mb-3">
                     <div className="h-2 w-2 rounded-full bg-green-500" />
                     <span className="text-xs font-medium text-white/80">Recovery Active</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center">
                        <Mail className="h-4 w-4 text-white/70" />
                     </div>
                     <div>
                        <div className="h-2 w-24 bg-white/20 rounded-full mb-1.5" />
                        <div className="h-2 w-16 bg-white/10 rounded-full" />
                     </div>
                  </div>
               </motion.div>

            </div>

            {/* Bottom Text */}
            <div className="max-w-md">
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.8 }}
                 className="relative"
               >
                 <div className="mb-4">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Pemulihan Akun Cepat
                    </h3>
                    <div className="h-1 w-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
                 </div>
                 
                 <p className="text-lg font-light leading-relaxed text-white/90 relative z-10">
                   Kembali akses peluang karirmu dengan mudah dan aman. Kami menjaga kerahasiaan data akun Anda.
                 </p>
               </motion.div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
