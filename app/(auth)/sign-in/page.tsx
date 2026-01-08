"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { createClient } from "@/lib/supabase/client";
import {
  Eye, EyeOff, AlertCircle, Mail, KeyRound,
  Shield, CheckCircle2, Star, Briefcase, Users, TrendingUp, ArrowRight, Rocket, ArrowLeft
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useIsMobile } from "@/hooks/use-is-mobile";
import MobileSignInView from "@/components/auth/MobileSignInView";
import { useSavedAccounts } from "@/hooks/useSavedAccounts";
import { SavedAccountCard, AddAccountCard } from "@/components/auth/SavedAccountCard";
import { SaveLoginPrompt } from "@/components/auth/SaveLoginPrompt";
import { SavedAccount } from "@/types/saved-account";

export default function SignInPage() {
  const isMobile = useIsMobile();
  const router = useRouter();

  // State
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);

  // Saved Accounts State
  const { accounts: savedAccounts, saveAccount, removeAccount, isLoaded: savedAccountsLoaded, isAccountSaved } = useSavedAccounts();
  const [selectedAccount, setSelectedAccount] = React.useState<SavedAccount | null>(null);
  const [showSavePrompt, setShowSavePrompt] = React.useState(false);
  const [pendingRedirect, setPendingRedirect] = React.useState<{ path: string; userData: { id: string; email: string; name: string; avatar_url?: string } } | null>(null);

  // Validation State
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [passwordError, setPasswordError] = React.useState<string | null>(null);
  const [isFocused, setIsFocused] = React.useState<string | null>(null);

  // Rate Limiting
  const [loginAttempts, setLoginAttempts] = React.useState(0);
  const [isRateLimited, setIsRateLimited] = React.useState(false);
  const [rateLimitTimer, setRateLimitTimer] = React.useState(0);
  const [capsLock, setCapsLock] = React.useState(false);

  const emailInputRef = React.useRef<HTMLInputElement>(null);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // When selecting a saved account, pre-fill email
  React.useEffect(() => {
    if (selectedAccount) {
      setEmail(selectedAccount.email);
      setPassword("");
      setError(null);
    }
  }, [selectedAccount]);

  // Auto-focus
  React.useEffect(() => {
    if (!isMobile && isMounted) {
      emailInputRef.current?.focus();
    }
  }, [isMobile, isMounted]);

  // Timer Logic
  React.useEffect(() => {
    if (rateLimitTimer > 0) {
      const timer = setTimeout(() => setRateLimitTimer(rateLimitTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (rateLimitTimer === 0 && isRateLimited) {
      setIsRateLimited(false);
      setLoginAttempts(0);
    }
  }, [rateLimitTimer, isRateLimited]);

  // ... existing validation functions ...

  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError(null);
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
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

  const checkCapsLock = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (e.getModifierState("CapsLock")) {
      setCapsLock(true);
    } else {
      setCapsLock(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isRateLimited) {
      setError(`Terlalu banyak percobaan. Tunggu ${rateLimitTimer} detik.`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);

        if (newAttempts >= 5) {
          setIsRateLimited(true);
          setRateLimitTimer(300);
          setError("Akun diblokir sementara selama 5 menit demi keamanan.");
          setLoading(false);
          return;
        }

        setError("Email atau password salah. Silakan coba lagi.");
        setLoading(false);
        return;
      }

      if (!authData.user) {
        setError("Login gagal. Silakan coba lagi.");
        setLoading(false);
        return;
      }

      setLoginAttempts(0);

      // Fetch full profile for saved accounts feature
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, membership, full_name, avatar_url")
        .eq("id", authData.user.id)
        .maybeSingle();

      let redirectPath = "/";
      if (profile?.role === "admin") redirectPath = "/admin/dashboard";
      else if (["vip_premium", "premium"].includes(profile?.membership)) redirectPath = "/dashboard";
      else if (["vip_basic", "basic"].includes(profile?.membership)) redirectPath = "/vip";

      // Check if account is already saved - if so, skip prompt
      const alreadySaved = isAccountSaved(authData.user.id);

      if (alreadySaved) {
        // Account already saved, proceed directly
        setShowLoadingScreen(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        window.location.replace(redirectPath);
      } else {
        // Show save prompt for new accounts
        setLoading(false);
        setPendingRedirect({
          path: redirectPath,
          userData: {
            id: authData.user.id,
            email: authData.user.email || email,
            name: profile?.full_name || email.split('@')[0],
            avatar_url: profile?.avatar_url,
          }
        });
        setShowSavePrompt(true);
      }

    } catch (err) {
      console.error("Login error:", err);
      setError("Terjadi kesalahan sistem.");
      setLoading(false);
      setShowLoadingScreen(false);
    }
  };

  // Handle save prompt actions
  const handleSaveAccount = () => {
    if (pendingRedirect) {
      saveAccount({
        id: pendingRedirect.userData.id,
        email: pendingRedirect.userData.email,
        name: pendingRedirect.userData.name,
        avatar_url: pendingRedirect.userData.avatar_url,
        savedAt: Date.now(),
      });
      setShowSavePrompt(false);
      setShowLoadingScreen(true);
      setTimeout(() => {
        window.location.replace(pendingRedirect.path);
      }, 1500);
    }
  };

  const handleSkipSave = () => {
    if (pendingRedirect) {
      setShowSavePrompt(false);
      setShowLoadingScreen(true);
      setTimeout(() => {
        window.location.replace(pendingRedirect.path);
      }, 1500);
    }
  };

  // Handle selecting a saved account
  const handleSelectAccount = (account: SavedAccount) => {
    setSelectedAccount(account);
  };

  // Handle going back to account list
  const handleBackToAccountList = () => {
    setSelectedAccount(null);
    setEmail("");
    setPassword("");
    setError(null);
  };

  // Show loading skeleton during hydration to prevent blank page flash
  if (!isMounted || isMobile === undefined) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          {/* Logo */}
          <div className="relative h-24 w-24 animate-pulse">
            <Image
              src="/Logo/x.png"
              alt="JobMate Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          {/* Loading dots */}
          <div className="flex gap-1.5">
            <div className="h-2 w-2 rounded-full bg-brand animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="h-2 w-2 rounded-full bg-brand animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="h-2 w-2 rounded-full bg-brand animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  // Mobile View
  if (isMobile) {
    return <MobileSignInView />;
  }

  // Desktop Split Layout
  return (
    <>
      {showLoadingScreen && <LoadingScreen message="Memuat dashboard..." />}

      {/* Save Login Prompt */}
      <SaveLoginPrompt
        isOpen={showSavePrompt}
        userName={pendingRedirect?.userData.name || ""}
        onSave={handleSaveAccount}
        onSkip={handleSkipSave}
        variant="default"
      />

      <div className="flex min-h-screen w-full overflow-hidden bg-background">

        {/* === LEFT SIDE: FORM === */}
        <div className="relative flex w-full flex-col justify-center px-8 sm:px-12 lg:w-[50%] xl:w-[40%] h-screen border-r border-border/40 shadow-xl z-20 bg-background/80 backdrop-blur-md overflow-y-auto scrollbar-hide">

          {/* Brand Logo */}
          <div className="absolute top-8 left-8 sm:left-12 z-50">
            <Link href="/" className="block group">
              <div className="relative h-24 w-24 sm:h-32 sm:w-32 transition-transform group-hover:scale-105">
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

          <div className="mx-auto w-full max-w-sm space-y-8 py-12">
            {/* Header - Changes based on saved accounts state */}
            <div className="space-y-2">
              {savedAccounts.length > 0 && !selectedAccount ? (
                <>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold tracking-tight sm:text-4xl"
                  >
                    Pilih Akun
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground"
                  >
                    Ketuk akun untuk login cepat
                  </motion.p>
                </>
              ) : selectedAccount ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleBackToAccountList}
                      className="h-8 w-8 rounded-full hover:bg-muted"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">Kembali</span>
                  </motion.div>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-bold tracking-tight"
                  >
                    Masuk sebagai
                  </motion.h1>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/50"
                  >
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand to-brand/70 flex items-center justify-center text-white font-semibold">
                      {selectedAccount.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold">{selectedAccount.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedAccount.email}</p>
                    </div>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold tracking-tight sm:text-4xl"
                  >
                    Welcome Back
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground"
                  >
                    Masuk untuk mengakses dashboard karir Anda
                  </motion.p>
                </>
              )}
            </div>

            {/* Saved Accounts List */}
            {savedAccountsLoaded && savedAccounts.length > 0 && !selectedAccount && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-3"
              >
                <AnimatePresence mode="popLayout">
                  {savedAccounts.map((account) => (
                    <SavedAccountCard
                      key={account.id}
                      account={account}
                      onSelect={handleSelectAccount}
                      onRemove={removeAccount}
                      variant="default"
                    />
                  ))}
                </AnimatePresence>
                <AddAccountCard
                  onClick={() => setSelectedAccount({ id: '', email: '', name: '', savedAt: 0 } as SavedAccount)}
                  variant="default"
                />
              </motion.div>
            )}

            {/* Login Form - Show when no saved accounts or account is selected */}
            {(savedAccounts.length === 0 || selectedAccount) && (
              <form onSubmit={handleSignIn} className="space-y-5">
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
                  {/* Email - Hide when selecting from a saved account */}
                  {(!selectedAccount || !selectedAccount.id) && (
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
                            validateEmail(e.target.value);
                          }}
                          onFocus={() => setIsFocused("email")}
                          onBlur={handleEmailBlur}
                          className={`pl-10 h-11 transition-all ${emailError ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:border-brand focus-visible:ring-brand/20'}`}
                          required
                        />
                        <AnimatePresence>
                          {email && !emailError && (
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
                  )}

                  {/* Password */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        href="/reset"
                        className="text-xs font-medium text-brand hover:text-brand/80 hover:underline"
                      >
                        Lupa password?
                      </Link>
                    </div>
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand">
                        <KeyRound className="h-4 w-4" />
                      </div>
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={checkCapsLock}
                        onFocus={() => setIsFocused("password")}
                        onBlur={() => {
                          setIsFocused(null);
                          setCapsLock(false);
                        }}
                        className="pl-10 pr-10 h-11 transition-all focus-visible:border-brand focus-visible:ring-brand/20"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <AnimatePresence>
                      {capsLock && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center gap-2 text-xs text-yellow-600 mt-1 font-medium"
                        >
                          <AlertCircle className="h-3 w-3" />
                          Caps Lock aktif
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(c) => setRememberMe(!!c)}
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Ingat saya di perangkat ini
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={loading || isRateLimited}
                  className="w-full h-11 bg-brand hover:bg-brand/90 text-base shadow-lg shadow-brand/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Masuk...</span>
                    </div>
                  ) : (
                    "Masuk Sekarang"
                  )}
                </Button>
              </form>
            )}

            {/* Footer Links */}
            <div className="space-y-4 text-center text-sm">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Belum punya akun?
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Link href="/ajukan-akun">
                  <Button variant="outline" className="w-full h-11 border-dashed hover:border-brand hover:text-brand hover:bg-brand/5 transition-colors">
                    Ajukan Pembuatan Akun
                  </Button>
                </Link>
                <Link
                  href="/cek-status-pengajuan"
                  className="inline-flex items-center justify-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>Sudah mengajukan?</span>
                  <span className="font-medium text-brand flex items-center gap-0.5">
                    Cek Status <ArrowRight className="h-3 w-3" />
                  </span>
                </Link>
              </div>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/60 pt-4">
              <Shield className="h-3 w-3" />
              <span>Enkripsi SSL 256-bit • Data Anda Aman</span>
            </div>
          </div>
        </div>

        {/* === RIGHT SIDE: VISUAL === */}
        <div className="relative hidden w-0 flex-1 lg:flex h-screen overflow-hidden bg-[#0a0a0a]">

          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Mesh Gradients */}
            <div className="absolute -top-[20%] -right-[10%] h-[800px] w-[800px] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse duration-[8000ms]" />
            <div className="absolute top-[40%] -left-[20%] h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[100px] animate-pulse duration-[10000ms]" />
            <div className="absolute bottom-[-10%] right-[10%] h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[120px] animate-pulse duration-[6000ms]" />

            {/* Digital Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 flex h-full w-full flex-col justify-between p-12 xl:p-16 text-white max-w-[1920px] mx-auto">

            {/* Top Badge */}
            <div className="flex justify-end">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 backdrop-blur-xl border border-white/10 shadow-2xl"
              >
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse delay-75" />
                  <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse delay-150" />
                </div>
                <span className="text-xs font-medium text-white/80">AI-Powered Career Growth</span>
              </motion.div>
            </div>

            {/* Main Visual: Holographic Career Hub */}
            <div className="flex flex-1 items-center justify-center relative perspective-1000 min-h-[500px]">

              {/* Central Glowing Core */}
              <div className="relative z-20">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-r from-brand to-blue-500 rounded-full blur-3xl opacity-50"
                />
                <div className="relative h-24 w-24 xl:h-32 xl:w-32 bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center shadow-[0_0_50px_-12px_rgba(255,255,255,0.3)] z-10">
                  <Rocket className="h-10 w-10 xl:h-12 xl:w-12 text-white" />
                </div>

                {/* Orbiting Rings */}
                <div className="absolute inset-[-40px] xl:inset-[-50px] border border-white/5 rounded-full animate-spin-slow" style={{ animationDuration: '20s' }} />
                <div className="absolute inset-[-80px] xl:inset-[-100px] border border-dashed border-white/10 rounded-full animate-spin-reverse-slow" style={{ animationDuration: '30s' }} />
              </div>

              {/* Floating Success Cards - positioned relatively to container for better responsiveness */}
              {/* Card 1: Job Offer - Top Right */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1, y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", delay: 0.2 }}
                className="absolute right-[-20px] lg:right-[-40px] xl:right-0 top-[15%] w-56 lg:w-60 xl:w-64 bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-2xl z-30 scale-90 xl:scale-100"
              >
                <div className="flex items-start gap-3 xl:gap-4">
                  <div className="h-8 w-8 xl:h-10 xl:w-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-4 w-4 xl:h-5 xl:w-5 text-green-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Job Offer Received</h4>
                    <p className="text-xs text-white/60 mt-0.5">Senior UX Designer</p>
                    <div className="mt-2 inline-block px-2 py-0.5 rounded bg-green-500/20 text-[10px] text-green-400 font-medium">
                      +35% Salary Increase
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Card 2: Interview Schedule - Left Center/Bottom */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1, y: [0, 15, 0] }}
                transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
                className="absolute left-[-40px] lg:left-[-60px] xl:left-[-20px] bottom-[25%] xl:bottom-[30%] w-52 xl:w-56 bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-2xl z-20 scale-90 xl:scale-100"
              >
                <div className="flex items-center gap-2 xl:gap-3 mb-3">
                  <div className="h-2 w-2 rounded-full bg-orange-500" />
                  <span className="text-xs font-medium text-white/80">Upcoming Interview</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-white/10" />
                  <div>
                    <div className="h-2 w-20 xl:w-24 bg-white/20 rounded-full mb-1.5" />
                    <div className="h-2 w-12 xl:w-16 bg-white/10 rounded-full" />
                  </div>
                </div>
              </motion.div>

              {/* Card 3: Profile Views - Bottom Right */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1, x: [0, 10, 0] }}
                transition={{ duration: 7, repeat: Infinity, repeatType: "reverse", delay: 0.8 }}
                className="absolute bottom-5 right-[10%] xl:right-1/4 bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-4 z-20 scale-90 xl:scale-100"
              >
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-6 w-6 xl:h-8 xl:w-8 rounded-full border-2 border-black bg-gradient-to-br from-indigo-400 to-purple-400" />
                  ))}
                </div>
                <div>
                  <p className="text-[10px] xl:text-xs text-white/60">Recruiters viewed</p>
                  <p className="text-base xl:text-lg font-bold">+127 <span className="text-xs font-normal text-green-400">this week</span></p>
                </div>
              </motion.div>

            </div>

            {/* Bottom Quote - Encouraging Copywriting */}
            <div className="max-w-md">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="relative"
              >
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Wujudkan Karir Impianmu
                  </h3>
                  <div className="h-1 w-16 bg-gradient-to-r from-brand to-blue-500 rounded-full"></div>
                </div>

                <blockquote className="text-lg font-light leading-relaxed text-white/90 relative z-10">
                  "Jangan menunggu peluang datang, tapi ciptakanlah. Setiap lamaran adalah langkah menuju masa depan yang lebih cerah."
                </blockquote>

                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <div className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-white/80">
                    #PejuangKarir
                  </div>
                  <div className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-white/80">
                    #SuksesBersamaJobMate
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
