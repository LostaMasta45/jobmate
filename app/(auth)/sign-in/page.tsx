"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { AnimatedBackground } from "@/components/auth/AnimatedBackground";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Lock, CheckCircle2, AlertCircle, Mail, KeyRound, Sparkles, TrendingUp, Shield } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

const logoVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
    },
  },
};

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [passwordError, setPasswordError] = React.useState<string | null>(null);
  const [loginAttempts, setLoginAttempts] = React.useState(0);
  const [isRateLimited, setIsRateLimited] = React.useState(false);
  const [rateLimitTimer, setRateLimitTimer] = React.useState(0);
  const [isFocused, setIsFocused] = React.useState<string | null>(null);
  const emailInputRef = React.useRef<HTMLInputElement>(null);

  // Auto-focus email field on mount
  React.useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  // Rate limit timer
  React.useEffect(() => {
    if (rateLimitTimer > 0) {
      const timer = setTimeout(() => setRateLimitTimer(rateLimitTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (rateLimitTimer === 0 && isRateLimited) {
      setIsRateLimited(false);
      setLoginAttempts(0);
    }
  }, [rateLimitTimer, isRateLimited]);

  // Real-time email validation
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

  // Real-time password validation
  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError(null);
      return false;
    }
    if (value.length < 6) {
      setPasswordError("Password minimal 6 karakter");
      return false;
    }
    setPasswordError(null);
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check rate limiting
    if (isRateLimited) {
      setError(`Terlalu banyak percobaan login. Coba lagi dalam ${rateLimitTimer} detik atau reset password.`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("🔐 Starting login process...");
      console.log("📧 Email:", email);
      console.log("🌐 Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
      
      const supabase = createClient();
      
      // Set session persistence based on remember me
      if (rememberMe) {
        console.log("💾 Setting remember me...");
        await supabase.auth.updateUser({
          data: { remember_me: true }
        });
      }

      console.log("🔑 Attempting sign in with password...");
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error("❌ Sign in error:", signInError);
      } else {
        console.log("✅ Sign in successful:", {
          userId: authData?.user?.id,
          sessionExists: !!authData?.session,
        });
      }

      if (signInError) {
        // Increment login attempts
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);

        // Rate limit after 5 failed attempts
        if (newAttempts >= 5) {
          setIsRateLimited(true);
          setRateLimitTimer(300); // 5 minutes
          setError("Terlalu banyak percobaan login gagal. Akun Anda diblokir sementara selama 5 menit untuk keamanan.");
          setLoading(false);
          return;
        }

        // Improved error messages
        let errorMessage = "Email atau password salah. ";
        if (signInError.message.includes("Invalid login credentials")) {
          errorMessage += `Silakan coba lagi (${5 - newAttempts} percobaan tersisa) atau `;
        }
        errorMessage += "reset password jika lupa.";
        
        setError(errorMessage);
        setLoading(false);
        return;
      }

      if (!authData.user) {
        setError("Login gagal. Silakan coba lagi.");
        setLoading(false);
        return;
      }

      // Reset login attempts on success
      setLoginAttempts(0);

      console.log("✅ Login successful, user ID:", authData.user.id);
      console.log("🍪 Session:", {
        hasAccessToken: !!authData.session?.access_token,
        hasRefreshToken: !!authData.session?.refresh_token,
        expiresAt: authData.session?.expires_at,
      });
      
      // Determine redirect based on role & membership
      console.log("📊 Fetching user profile...");
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, membership")
        .eq("id", authData.user.id)
        .maybeSingle(); // Use maybeSingle instead of single to handle missing profile

      if (profileError) {
        console.error("❌ Profile fetch error:", profileError);
        console.error("Error details:", JSON.stringify(profileError, null, 2));
      }

      console.log("📋 Profile loaded:", { 
        exists: !!profile,
        role: profile?.role, 
        membership: profile?.membership,
        userId: authData.user.id
      });

      let redirectPath = "/";
      
      // If no profile found (new user), redirect to landing page
      if (!profile) {
        console.log("⚠️ No profile found for user, redirecting to landing page");
        redirectPath = "/";
      } else if (profile.role === "admin") {
        redirectPath = "/admin/dashboard";
      } else if (profile.membership === "vip_premium" || profile.membership === "premium") {
        // Handle both 'vip_premium' and 'premium' for backward compatibility
        redirectPath = "/dashboard"; // JobMate Premium Tools
        console.log("✅ VIP Premium user, redirecting to dashboard");
      } else if (profile.membership === "vip_basic" || profile.membership === "basic") {
        // Handle both 'vip_basic' and 'basic' for backward compatibility
        redirectPath = "/vip"; // VIP Career Portal
        console.log("✅ VIP Basic user, redirecting to VIP portal");
      } else {
        // User with no VIP membership (free or null)
        // Don't redirect to protected routes to avoid infinite loop
        redirectPath = "/"; // Redirect to landing page
        console.log("⚠️ User has no VIP membership, redirecting to landing page");
        console.log("⚠️ Membership value:", profile.membership);
      }

      console.log("🔄 Redirecting to:", redirectPath);

      // Show beautiful loading screen
      setShowLoadingScreen(true);

      // Small delay for smooth transition
      await new Promise(resolve => setTimeout(resolve, 500));

      // CRITICAL: Use window.location.replace for reliable one-click login
      // This forces full page reload with new session cookies
      window.location.replace(redirectPath);
      
    } catch (err) {
      console.error("Login error:", err);
      setError("Terjadi kesalahan saat login. Silakan coba lagi.");
      setLoading(false);
      setShowLoadingScreen(false);
    }
  };

  return (
    <>
      {showLoadingScreen && <LoadingScreen message="Memuat dashboard..." />}
      
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Main Content */}
      <div className="flex min-h-screen items-center justify-center p-4 relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          {/* Glassmorphism card with animated border */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Card className="relative backdrop-blur-xl bg-card/80 border-border/50 shadow-2xl overflow-hidden">
              {/* Animated gradient border */}
              <motion.div
                className="absolute inset-0 rounded-lg opacity-50"
                style={{
                  background: "linear-gradient(45deg, hsl(var(--brand)), hsl(220 100% 60%), hsl(280 100% 70%))",
                  backgroundSize: "300% 300%",
                }}
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              
              {/* Inner card content */}
              <div className="relative bg-card/95 backdrop-blur-xl m-[1px] rounded-[calc(0.5rem-1px)]">
                <CardHeader className="space-y-1 text-center pb-6">
                  {/* Animated Logo */}
                  <motion.div
                    variants={logoVariants}
                    className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-blue-600 text-white shadow-lg shadow-brand/30 relative overflow-hidden"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"
                      animate={{
                        x: ["-100%", "200%"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <Sparkles className="h-8 w-8 relative z-10" />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-brand via-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Welcome Back
                    </CardTitle>
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <CardDescription className="text-base">
                      Masuk ke akun JobMate Anda
                    </CardDescription>
                  </motion.div>

                  {/* Security indicator with animation */}
                  <motion.div 
                    variants={itemVariants}
                    className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-3"
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Shield className="h-3.5 w-3.5 text-green-500" />
                    </motion.div>
                    <span>Koneksi Aman | 256-bit SSL Encryption</span>
                  </motion.div>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleSignIn} className="space-y-5">
                    {/* Enhanced error display with animation */}
                    <AnimatePresence mode="wait">
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: "auto" }}
                          exit={{ opacity: 0, y: -10, height: 0 }}
                          className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive flex items-start gap-2"
                        >
                          <motion.div
                            animate={{ rotate: [0, -10, 10, 0] }}
                            transition={{ duration: 0.5 }}
                          >
                            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          </motion.div>
                          <span>{error}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Email field with enhanced animations */}
                    <motion.div variants={itemVariants} className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        Email
                        <AnimatePresence>
                          {email && !emailError && (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              exit={{ scale: 0, rotate: 180 }}
                            >
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Label>
                      <motion.div
                        animate={isFocused === "email" ? { scale: 1.02 } : { scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Input
                          ref={emailInputRef}
                          id="email"
                          type="email"
                          placeholder="nama@email.com"
                          value={email}
                          onChange={handleEmailChange}
                          onFocus={() => setIsFocused("email")}
                          onBlur={() => setIsFocused(null)}
                          className={`transition-all duration-200 ${
                            emailError 
                              ? 'border-destructive focus-visible:ring-destructive' 
                              : email && !emailError 
                                ? 'border-green-500/50 focus-visible:ring-green-500/20'
                                : ''
                          }`}
                          required
                        />
                      </motion.div>
                      <AnimatePresence>
                        {emailError && (
                          <motion.p
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="text-xs text-destructive flex items-center gap-1"
                          >
                            <AlertCircle className="h-3 w-3" />
                            {emailError}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Password field with enhanced animations */}
                    <motion.div variants={itemVariants} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
                          <KeyRound className="h-4 w-4 text-muted-foreground" />
                          Password
                          <AnimatePresence>
                            {password && !passwordError && (
                              <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: 180 }}
                              >
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </Label>
                        <Link
                          href="/auth/reset"
                          className="text-sm text-brand hover:underline transition-colors"
                        >
                          Lupa password?
                        </Link>
                      </div>
                      <motion.div
                        animate={isFocused === "password" ? { scale: 1.02 } : { scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className="relative"
                      >
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={handlePasswordChange}
                          onFocus={() => setIsFocused("password")}
                          onBlur={() => setIsFocused(null)}
                          className={`pr-10 transition-all duration-200 ${
                            passwordError 
                              ? 'border-destructive focus-visible:ring-destructive' 
                              : password && !passwordError 
                                ? 'border-green-500/50 focus-visible:ring-green-500/20'
                                : ''
                          }`}
                          required
                        />
                        <motion.button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </motion.button>
                      </motion.div>
                      <AnimatePresence>
                        {passwordError && (
                          <motion.p
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="text-xs text-destructive flex items-center gap-1"
                          >
                            <AlertCircle className="h-3 w-3" />
                            {passwordError}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Remember me checkbox with animation */}
                    <motion.div variants={itemVariants} className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      />
                      <label
                        htmlFor="remember"
                        className="text-sm font-medium leading-none cursor-pointer select-none"
                      >
                        Ingat saya selama 30 hari
                      </label>
                    </motion.div>

                    {/* Enhanced submit button with animations */}
                    <motion.div 
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-brand to-blue-600 hover:from-brand/90 hover:to-blue-600/90 shadow-lg shadow-brand/20 transition-all duration-200"
                        disabled={loading || isRateLimited || !!emailError || !!passwordError}
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <motion.div
                              className="h-4 w-4 rounded-full border-2 border-current border-t-transparent"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            Masuk...
                          </span>
                        ) : isRateLimited ? (
                          `Diblokir (${rateLimitTimer}s)`
                        ) : (
                          "Masuk"
                        )}
                      </Button>
                    </motion.div>
                  </form>

                  {/* Account request status with animations */}
                  <motion.div variants={itemVariants} className="mt-6 space-y-3">
                    <div className="text-center text-sm text-muted-foreground">
                      Belum punya akun?{" "}
                      <Link href="/ajukan-akun" className="text-brand hover:underline font-medium transition-colors">
                        Ajukan akun baru
                      </Link>
                    </div>
                    
                    <div className="text-center">
                      <Link 
                        href="/cek-status-pengajuan" 
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5 group"
                      >
                        <span>Sudah ajukan akun?</span>
                        <motion.span 
                          className="text-brand group-hover:underline"
                          whileHover={{ x: 5 }}
                        >
                          Cek Status Pengajuan →
                        </motion.span>
                      </Link>
                    </div>
                  </motion.div>

                  {/* Social proof with animation */}
                  <motion.div 
                    variants={itemVariants}
                    className="mt-6 pt-6 border-t"
                  >
                    <motion.div
                      className="flex items-center justify-center gap-2 text-sm"
                      whileHover={{ scale: 1.05 }}
                    >
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      </motion.div>
                      <p className="text-muted-foreground">
                        <span className="font-semibold text-foreground">3,247 orang</span> berhasil dapat kerja bulan ini
                      </p>
                    </motion.div>
                  </motion.div>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
