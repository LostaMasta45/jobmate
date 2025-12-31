"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { RocketLoader } from "@/components/auth/RocketLoader";
import { createClient } from "@/lib/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { PWAInstallPopup } from "@/components/pwa";
import {
  Eye, EyeOff, AlertCircle, Mail, KeyRound,
  ArrowLeft, Shield, Briefcase, User, CheckCircle2, Search, ArrowRight, Lock
} from "lucide-react";

// --- ANIMATION VARIANTS ---
// Smooth iOS/Android-like page transition
const pageVariants = {
  initial: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.98,
  }),
  animate: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "tween",
      duration: 0.4,
      ease: [0.32, 0.72, 0, 1], // iOS-like easing curve
    }
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.98,
    transition: {
      type: "tween",
      duration: 0.35,
      ease: [0.32, 0.72, 0, 1],
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

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay,
      type: "spring",
      stiffness: 200,
      damping: 20
    }
  })
};

// --- MAIN COMPONENT ---
export default function MobileSignInView() {
  const [view, setView] = React.useState<'welcome' | 'login'>('welcome');
  const [direction, setDirection] = React.useState(0);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [loadingStatus, setLoadingStatus] = React.useState<'loading' | 'success' | 'error' | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [capsLock, setCapsLock] = React.useState(false);

  const emailInputRef = React.useRef<HTMLInputElement>(null);

  // Load saved email from localStorage on mount
  React.useEffect(() => {
    const savedEmail = localStorage.getItem('jobmate_remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

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
    setLoadingStatus('loading');
    setError(null);

    try {
      const supabase = createClient();

      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError("Email atau kata sandi salah.");
        setLoading(false);
        setLoadingStatus(null);
        return;
      }

      if (!authData.user) {
        setError("Gagal masuk. Silakan coba lagi.");
        setLoading(false);
        setLoadingStatus(null);
        return;
      }

      // Handle Remember Me - save or remove email from localStorage
      if (rememberMe) {
        localStorage.setItem('jobmate_remembered_email', email);
      } else {
        localStorage.removeItem('jobmate_remembered_email');
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

      // Success state trigger
      setLoadingStatus('success');

      // WAIT for animation to complete (3 seconds) before redirecting
      setTimeout(() => {
        window.location.replace(redirectPath);
      }, 3500); // 3.5s allows the success animation to play fully

    } catch (err) {
      console.error("Login error:", err);
      setError("Terjadi kesalahan sistem.");
      setLoading(false);
      setLoadingStatus(null);
    }
  };

  const checkCapsLock = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (e.getModifierState("CapsLock")) {
      setCapsLock(true);
    } else {
      setCapsLock(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {loadingStatus && (
          <RocketLoader
            status={loadingStatus === 'loading' || loadingStatus === 'success' ? loadingStatus : 'error'}
          />
        )}
      </AnimatePresence>

      <div className="fixed inset-0 w-full h-full bg-white overflow-hidden font-sans text-slate-900 selection:bg-[#00acc7] selection:text-white">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">

          {/* === PAGE 1: WELCOME SCREEN === */}
          {view === 'welcome' && (
            <motion.div
              key="welcome"
              custom={direction}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute inset-0 flex flex-col bg-white will-change-transform transform-gpu"
              style={{ backfaceVisibility: 'hidden' }}
            >
              {/* Background with Brand Gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#6e52e0] via-[#5547d0] to-[#3d2fa8] z-0">
                {/* Subtle Pattern Overlay */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('/grid.svg')] bg-center" />

                {/* Soft Glow Effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#8e68fd] rounded-full blur-[150px] opacity-30" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#00acc7] rounded-full blur-[120px] opacity-20" />
              </div>

              {/* Main Content */}
              <div className="flex-1 relative z-10 flex flex-col px-6 pt-12 pb-8 h-full">

                {/* Logo Section */}
                <motion.div
                  variants={logoVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex justify-center -mt-8 -mb-8"
                >
                  <img
                    src="/Logo/x.png"
                    alt="JobMate"
                    className="w-64 h-64 object-contain drop-shadow-2xl"
                  />
                </motion.div>

                {/* Hero Illustration - Simplified & Elegant */}
                <div className="flex-1 flex flex-col items-center justify-center">
                  <motion.div
                    variants={floatAnimation}
                    animate="animate"
                    className="relative w-56 h-56 mb-6"
                  >
                    {/* Outer Ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-white/10" />
                    <div className="absolute inset-3 rounded-full border border-white/5" />

                    {/* Central Card */}
                    <div className="absolute inset-6 flex items-center justify-center">
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                        className="w-28 h-36 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transform -rotate-3"
                      >
                        {/* Card Header */}
                        <div className="h-12 bg-gradient-to-r from-[#6e52e0] to-[#00acc7] flex items-end justify-center pb-1">
                          <div className="w-10 h-10 bg-white rounded-full border-2 border-white shadow-md flex items-center justify-center translate-y-4">
                            <User className="w-5 h-5 text-[#6e52e0]" />
                          </div>
                        </div>
                        {/* Card Body */}
                        <div className="flex-1 pt-6 px-3 space-y-1.5">
                          <div className="h-1.5 w-14 bg-slate-200 rounded-full mx-auto" />
                          <div className="h-1.5 w-18 bg-slate-100 rounded-full mx-auto" />
                          <div className="h-1.5 w-12 bg-slate-100 rounded-full mx-auto" />
                        </div>
                        {/* Verified Badge */}
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.7, type: "spring" }}
                          className="absolute bottom-2 right-2"
                        >
                          <CheckCircle2 className="w-5 h-5 text-[#00acc7] fill-white" />
                        </motion.div>
                      </motion.div>
                    </div>

                    {/* Floating Icons */}
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -top-2 right-4 bg-white p-2.5 rounded-xl shadow-lg"
                    >
                      <Search className="w-5 h-5 text-[#00acc7]" />
                    </motion.div>

                    <motion.div
                      animate={{ y: [0, 8, 0] }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute bottom-4 -left-2 bg-white p-2.5 rounded-xl shadow-lg"
                    >
                      <Briefcase className="w-5 h-5 text-[#6e52e0]" />
                    </motion.div>

                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                      className="absolute top-1/2 -right-3 bg-white p-2 rounded-lg shadow-lg"
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </motion.div>
                  </motion.div>

                  {/* Headlines - Clean & Impactful */}
                  <div className="text-center space-y-4 px-4">
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-3xl font-bold text-white leading-tight"
                    >
                      Raih Karir Impianmu
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-white/70 text-sm leading-relaxed max-w-[260px] mx-auto"
                    >
                      Buat CV profesional, temukan lowongan terbaik, dan persiapkan interview dengan AI.
                    </motion.p>
                  </div>
                </div>

                {/* Bottom Actions - Clean Layout */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-4 mt-auto"
                >
                  <Button
                    onClick={goToLogin}
                    className="w-full h-14 rounded-2xl bg-white text-[#5547d0] font-semibold text-base shadow-xl active:scale-[0.98] transition-transform"
                  >
                    Masuk ke Akun
                  </Button>

                  <div className="flex items-center justify-center gap-1 text-sm">
                    <span className="text-white/60">Belum punya akun?</span>
                    <Link
                      href="/ajukan-akun"
                      className="text-white font-semibold hover:underline"
                    >
                      Daftar Sekarang
                    </Link>
                  </div>

                  <Link
                    href="/cek-status-pengajuan"
                    className="flex items-center justify-center gap-1.5 text-sm text-white/50 hover:text-white/80 transition-colors"
                  >
                    <span>Cek status pengajuan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </motion.div>
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
              className="absolute inset-0 flex flex-col bg-white text-slate-900 overflow-hidden will-change-transform transform-gpu"
              style={{ backfaceVisibility: 'hidden' }}
            >
              {/* Background with Brand Gradient (Same as Page 1) */}
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
                {/* Navigation */}
                <div className="w-full flex items-center justify-between mb-6 relative h-10">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={backToWelcome}
                    className="relative z-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-sm hover:bg-white/20 text-white"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>

                  {/* Top Logo - Perfectly Centered & Larger */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {/* Increased size to 2x (w-64 h-64) */}
                      <img src="/Logo/x.png" alt="JobMate" className="w-64 h-64 object-contain drop-shadow-2xl" />
                    </motion.div>
                  </div>

                  {/* Placeholder to maintain spacing balance (optional with absolute center but good for flex structure) */}
                  <div className="w-10" />
                </div>

                {/* Cool Illustration - Floating Lock/Security Concept */}
                <div className="w-full flex justify-center items-center mb-6 mt-4">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", duration: 0.8 }}
                    className="relative w-[280px] h-[200px] flex items-center justify-center mx-auto"
                  >
                    {/* Main Illustration Container */}
                    <div className="relative w-full h-full flex items-center justify-center">
                      {/* Background Glow */}
                      <div className="absolute w-48 h-48 bg-white/5 rounded-full blur-[60px]" />

                      {/* Floating Central Element */}
                      <motion.div
                        animate={{ y: [-10, 10, -10] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="relative z-20"
                      >
                        <div className="w-32 h-32 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-2xl flex items-center justify-center transform -rotate-6 relative overflow-hidden group">
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <div className="w-20 h-20 bg-gradient-to-tr from-[#00acc7] to-[#00d1dc] rounded-2xl flex items-center justify-center shadow-inner shadow-white/20">
                            <Lock className="w-10 h-10 text-white drop-shadow-md" />
                          </div>
                          {/* Decorative lines */}
                          <div className="absolute top-4 right-4 w-2 h-2 bg-white/40 rounded-full" />
                          <div className="absolute bottom-4 left-4 w-16 h-1.5 bg-white/10 rounded-full" />
                        </div>
                      </motion.div>

                      {/* Orbiting Elements - Simplified and Centered */}
                      <motion.div
                        className="absolute inset-0"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                      >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                          <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                            className="w-12 h-12 bg-[#8e68fd] rounded-2xl flex items-center justify-center shadow-lg border border-white/20 backdrop-blur-md"
                          >
                            <KeyRound className="w-6 h-6 text-white" />
                          </motion.div>
                        </div>
                      </motion.div>

                      <motion.div
                        className="absolute inset-0 w-full h-full"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      >
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="w-10 h-10 bg-[#00acc7] rounded-full flex items-center justify-center shadow-lg border border-white/20 backdrop-blur-md"
                          >
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          </motion.div>
                        </div>
                      </motion.div>

                      {/* Orbit Rings */}
                      <div className="absolute inset-0 border border-white/5 rounded-full scale-[1.2]" />
                      <div className="absolute inset-0 border border-white/5 rounded-full scale-[0.8]" />
                    </div>
                  </motion.div>
                </div>

                {/* Welcome Text */}
                <div className="text-center mb-4">
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-bold text-white"
                  >
                    Selamat Datang!
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-white/80 text-sm mt-1 max-w-[240px]"
                  >
                    Masuk ke akun JobMate Anda
                  </motion.p>
                </div>
              </div>

              {/* Form Section */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  type: "tween",
                  duration: 0.5,
                  ease: [0.32, 0.72, 0, 1],
                  delay: 0.15
                }}
                className="flex-1 bg-white rounded-t-[2.5rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] relative z-20 flex flex-col overflow-hidden will-change-transform"
              >
                {/* Scrollable Form Area */}
                <div className="flex-1 overflow-y-auto px-8 pt-8 pb-4 scrollbar-hide">
                  <form onSubmit={handleSignIn} className="space-y-6">

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
                          onBlur={() => setEmail(prev => prev.trim())}
                          placeholder="nama@email.com"
                          className="h-14 pl-12 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white focus:border-[#00acc7] focus:ring-4 focus:ring-[#00acc7]/10 transition-all font-medium text-base"
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center px-1">
                        <Label className="text-xs font-semibold text-slate-600">Password</Label>
                        <Link href="/reset" className="text-xs font-bold text-[#00acc7] hover:text-[#8e68fd] transition-colors">
                          Lupa Password?
                        </Link>
                      </div>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00acc7] transition-colors">
                          <KeyRound className="w-5 h-5" />
                        </div>
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => { setPassword(e.target.value); setError(null); }}
                          onKeyDown={checkCapsLock}
                          onBlur={() => setCapsLock(false)}
                          placeholder="••••••••"
                          className="h-14 pl-12 pr-12 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white focus:border-[#00acc7] focus:ring-4 focus:ring-[#00acc7]/10 transition-all font-medium text-base"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <AnimatePresence>
                        {capsLock && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex items-center gap-2 text-xs text-yellow-600 mt-1 font-medium ml-1"
                          >
                            <AlertCircle className="h-3 w-3" />
                            Caps Lock aktif
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center space-x-3 px-1">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(c) => setRememberMe(!!c)}
                        className="border-slate-300 data-[state=checked]:bg-[#00acc7] data-[state=checked]:border-[#00acc7] w-5 h-5 rounded-md"
                      />
                      <label
                        htmlFor="remember"
                        className="text-sm text-slate-500 font-medium leading-none cursor-pointer select-none"
                      >
                        Ingat saya masuk
                      </label>
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
                            <span>Verifikasi...</span>
                          </div>
                        ) : (
                          "Masuk Sekarang"
                        )}
                      </Button>
                    </div>
                  </form>

                  {/* Register Link */}
                  <div className="mt-6 text-center pb-4">
                    <p className="text-sm text-slate-500">
                      Belum punya akun?{" "}
                      <Link href="/ajukan-akun" className="text-[#00acc7] font-bold hover:text-[#8e68fd] transition-colors">
                        Daftar Disini
                      </Link>
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* PWA Install Popup - Mobile Only */}
      <PWAInstallPopup />
    </>
  );
}
