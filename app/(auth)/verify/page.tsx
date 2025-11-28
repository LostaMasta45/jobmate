"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { Suspense } from "react";
import { 
  AlertCircle, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Shield,
  KeyRound,
  ArrowRight
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-is-mobile";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const isMobile = useIsMobile();
  
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  
  const passwordInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-focus password field
  React.useEffect(() => {
    if (!isMobile && isMounted && type === "recovery") {
      setTimeout(() => passwordInputRef.current?.focus(), 500);
    }
  }, [isMobile, isMounted, type]);

  // Password strength calculator
  const calculatePasswordStrength = (pass: string) => {
    if (!pass) return { strength: 0, label: "", color: "" };
    
    let strength = 0;
    if (pass.length >= 8) strength += 25;
    if (pass.length >= 12) strength += 10;
    if (/[a-z]/.test(pass)) strength += 15;
    if (/[A-Z]/.test(pass)) strength += 15;
    if (/[0-9]/.test(pass)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(pass)) strength += 20;
    
    if (strength < 40) return { strength, label: "Lemah", color: "bg-red-500" };
    if (strength < 70) return { strength, label: "Sedang", color: "bg-yellow-500" };
    return { strength, label: "Kuat", color: "bg-green-500" };
  };

  const passwordStrength = calculatePasswordStrength(password);
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Password tidak sama");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      
      console.log('🔐 Updating password...');
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        console.error('❌ Update failed:', error);
        setError(error.message);
        setLoading(false);
        return;
      }

      console.log('✅ Password updated successfully!');
      setSuccess(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 2000);
    } catch (err) {
      console.error("💥 Unexpected error:", err);
      setError("Terjadi kesalahan. Silakan coba lagi.");
      setLoading(false);
    }
  };

  if (!isMounted || type !== "recovery") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Mobile View
  if (isMobile) {
    return (
      <div className="fixed inset-0 w-full h-full bg-white overflow-hidden font-sans text-slate-900">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#8e68fd] via-[#6e52e0] to-[#00acc7] z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(142,104,253,0.5),transparent_50%)] mix-blend-overlay" />
          <motion.div 
            animate={{ y: [0, -30, 0], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-[#00d1dc] rounded-full blur-[100px] opacity-40"
          />
        </div>

        {/* Header */}
        <div className="relative z-10 pt-6 px-6 flex flex-col items-center h-[40%]">
          {/* Top Logo - Absolute like MobileSignInView */}
          <div className="absolute -top-20 left-0 right-0 z-50 flex justify-center pointer-events-none">
             <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse" />
                <div className="relative h-64 w-64">
                  <Image 
                    src="/Logo/x.png" 
                    alt="JobMate Logo" 
                    fill 
                    className="object-contain drop-shadow-2xl" 
                    priority 
                  />
                </div>
             </div>
          </div>
          
          {/* Spacer for the absolute logo */}
          <div className="h-16 w-full" />

          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-[120px] h-[120px] flex items-center justify-center mt-2 mb-2 z-10"
          >
            <div className="absolute w-24 h-24 bg-white/5 rounded-full blur-[30px]" />
            <motion.div 
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="relative z-20 w-20 h-20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-full shadow-2xl flex items-center justify-center"
            >
              <div className="w-14 h-14 bg-gradient-to-tr from-[#00acc7] to-[#009eb5] rounded-full flex items-center justify-center">
                <KeyRound className="w-7 h-7 text-white drop-shadow-md" />
              </div>
            </motion.div>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-white text-center"
          >
            Buat Password Baru
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/80 text-sm mt-1 text-center max-w-[260px]"
          >
            Pastikan password Anda kuat
          </motion.p>
        </div>

        {/* Form Section */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-20 h-[60%] overflow-hidden"
        >
          <div className="h-full overflow-y-auto px-8 pt-8 pb-20 scrollbar-hide">
            {success ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center justify-center h-full text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Password Berhasil Diubah!</h3>
                <p className="text-slate-600 text-sm">Redirect ke dashboard...</p>
              </motion.div>
            ) : (
              <form onSubmit={handleUpdatePassword} className="space-y-5">
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-3 flex items-center gap-3 text-sm"
                    >
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <span className="font-medium">{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-600 ml-1">Password Baru</Label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <Input
                      ref={passwordInputRef}
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      className="h-14 pl-12 pr-12 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  {/* Password Strength */}
                  {password && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">Kekuatan Password:</span>
                        <span className={`font-bold ${
                          passwordStrength.strength < 40 ? 'text-red-600' :
                          passwordStrength.strength < 70 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${passwordStrength.strength}%` }}
                          className={`h-full ${passwordStrength.color} transition-colors`}
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-600 ml-1">Konfirmasi Password</Label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <Input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ketik ulang password"
                      className="h-14 pl-12 pr-12 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  {/* Match Indicator */}
                  {confirmPassword && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-xs">
                      {passwordsMatch ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span className="text-green-600 font-medium">Password cocok</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-red-600" />
                          <span className="text-red-600 font-medium">Password tidak cocok</span>
                        </>
                      )}
                    </motion.div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading || !passwordsMatch}
                  className="w-full h-14 rounded-2xl text-lg font-bold bg-gradient-to-r from-[#00acc7] to-[#009eb5] hover:from-[#00bed1] hover:to-[#00acc7] shadow-lg mb-8"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Menyimpan...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>Update Password</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </Button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // Desktop View
  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-background">
      {/* LEFT: Form */}
      <div className="relative flex w-full flex-col justify-center px-8 sm:px-12 lg:w-[45%] xl:w-[40%] h-screen border-r border-border/40 shadow-xl z-20 bg-background/80 backdrop-blur-md">
        
        {/* Logo */}
        <div className="absolute top-8 left-8 sm:left-12 z-50">
          <Link href="/" className="block group">
            <div className="relative h-24 w-24 transition-transform group-hover:scale-105">
              <Image 
                src="/Logo/x.png" 
                alt="JobMate Logo" 
                fill 
                className="object-contain" 
                priority 
              />
            </div>
          </Link>
        </div>

        <div className="mx-auto w-full max-w-sm space-y-8">
          <AnimatePresence mode="wait">
            {success ? (
              // Success State
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 text-center"
              >
                <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Password Berhasil Diubah!</h2>
                  <p className="text-muted-foreground mt-2">Redirect ke dashboard...</p>
                </div>
              </motion.div>
            ) : (
              // Form State
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="space-y-2 mb-8">
                  <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Buat Password Baru
                  </h1>
                  <p className="text-muted-foreground">
                    Pilih password yang kuat untuk melindungi akun Anda
                  </p>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-5">
                  <AnimatePresence>
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

                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Password Baru</Label>
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Lock className="h-4 w-4" />
                      </div>
                      <Input
                        ref={passwordInputRef}
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimal 6 karakter"
                        className="pl-10 pr-10 h-11"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>

                    {/* Password Strength */}
                    {password && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Kekuatan password:</span>
                          <span className={`font-semibold ${
                            passwordStrength.strength < 40 ? 'text-red-600' :
                            passwordStrength.strength < 70 ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {passwordStrength.label}
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${passwordStrength.strength}%` }}
                            transition={{ duration: 0.3 }}
                            className={`h-full ${passwordStrength.color}`}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Gunakan kombinasi huruf besar, kecil, angka, dan simbol
                        </p>
                      </motion.div>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Lock className="h-4 w-4" />
                      </div>
                      <Input
                        id="confirmPassword"
                        type={showConfirm ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Ketik ulang password"
                        className="pl-10 pr-10 h-11"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>

                    {/* Match Indicator */}
                    <AnimatePresence>
                      {confirmPassword && (
                        <motion.div 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }}
                          className="flex items-center gap-2 text-xs"
                        >
                          {passwordsMatch ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              <span className="text-green-600 font-medium">Password cocok</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-4 w-4 text-destructive" />
                              <span className="text-destructive font-medium">Password tidak cocok</span>
                            </>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading || !passwordsMatch}
                    className="w-full h-11 bg-brand hover:bg-brand/90 text-base shadow-lg shadow-brand/20 transition-all"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Menyimpan...</span>
                      </div>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/60 pt-8 border-t border-border/40 mt-8">
            <Shield className="h-3 w-3" />
            <span>Koneksi Aman & Terenkripsi</span>
          </div>
        </div>
      </div>

      {/* RIGHT: Visual */}
      <div className="relative hidden w-0 flex-1 lg:flex h-screen overflow-hidden bg-[#0a0a0a]">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute -top-[20%] -right-[10%] h-[800px] w-[800px] rounded-full bg-blue-600/20 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute top-[40%] -left-[20%] h-[600px] w-[600px] rounded-full bg-cyan-600/10 blur-[100px] animate-pulse" style={{ animationDuration: '10s' }} />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex h-full w-full flex-col justify-between p-16 text-white">
          {/* Top Badge */}
          <div className="flex justify-end">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 backdrop-blur-xl border border-white/10"
            >
              <div className="flex gap-1">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: '75ms' }} />
              </div>
              <span className="text-xs font-medium text-white/80">Secure Password Update</span>
            </motion.div>
          </div>

          {/* Central Visual */}
          <div className="flex flex-1 items-center justify-center">
            <div className="relative">
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-600 rounded-full blur-3xl opacity-50"
              />
              <div className="relative h-32 w-32 bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center shadow-[0_0_50px_-12px_rgba(255,255,255,0.3)]">
                <KeyRound className="h-12 w-12 text-cyan-400" />
              </div>
              <div className="absolute inset-[-50px] border border-white/5 rounded-full animate-spin-slow" style={{ animationDuration: '20s' }} />
              <div className="absolute inset-[-100px] border border-dashed border-white/10 rounded-full animate-spin-reverse-slow" style={{ animationDuration: '30s' }} />
            </div>
          </div>

          {/* Bottom Text */}
          <div className="max-w-md">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-white mb-2">Password Baru, Keamanan Baru</h3>
                <div className="h-1 w-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
              </div>
              <p className="text-lg font-light leading-relaxed text-white/90">
                Lindungi akun Anda dengan password yang kuat. Akses aman ke ribuan peluang karir menanti.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
