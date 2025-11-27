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
import { Eye, EyeOff, AlertCircle, Mail, KeyRound, TrendingUp, Shield, CheckCircle2 } from "lucide-react";
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

export default function SignInPageV2() {
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

      setLoginAttempts(0);

      const { data: profile } = await supabase
        .from("profiles")
        .select("role, membership")
        .eq("id", authData.user.id)
        .maybeSingle();

      let redirectPath = "/";
      
      if (!profile) {
        redirectPath = "/";
      } else if (profile.role === "admin") {
        redirectPath = "/admin/dashboard";
      } else if (profile.membership === "vip_premium" || profile.membership === "premium") {
        redirectPath = "/dashboard";
      } else if (profile.membership === "vip_basic" || profile.membership === "basic") {
        redirectPath = "/vip";
      } else {
        redirectPath = "/";
      }

      setShowLoadingScreen(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
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
      
      <div className="fixed inset-0 overflow-hidden -z-10 bg-background/95 backdrop-blur-sm">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#8e68fd]/20 via-transparent to-transparent opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-[#00d1dc]/20 via-transparent to-transparent opacity-50" />
        <AnimatedBackground />
      </div>

      <div className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-[400px] z-10"
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.005 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="relative">
              {/* Floating Logo Container - Separated from card */}
              <div className="absolute -top-24 left-0 right-0 z-20 flex justify-center pointer-events-none">
                 <motion.div
                    variants={logoVariants}
                    className="relative w-48 h-48 filter drop-shadow-2xl"
                  >
                    <motion.div
                      className="absolute inset-4 bg-gradient-to-tr from-[#8e68fd] to-[#00acc7] rounded-full opacity-20 blur-2xl"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    />
                    <img 
                      src="/Logo/x.png" 
                      alt="JobMate Logo" 
                      className="w-full h-full object-contain relative z-10"
                    />
                  </motion.div>
              </div>

              {/* Glassmorphism Card */}
              <div className="relative bg-black/40 backdrop-blur-3xl backdrop-saturate-150 border border-white/10 rounded-[2.5rem] shadow-2xl shadow-black/40 overflow-hidden mt-10">
                 {/* Subtle Top Highlight */}
                 <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                
                <div className="px-8 pb-8 pt-20 relative z-10">
                  <CardHeader className="space-y-1 text-center p-0 mb-8">
                    <motion.div variants={itemVariants}>
                      <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
                        Welcome Back
                      </h1>
                      <p className="text-sm text-gray-400 font-light">
                        Gateway to your dream career
                      </p>
                    </motion.div>
                  </CardHeader>

                  <CardContent className="p-0">
                    <form onSubmit={handleSignIn} className="space-y-5">
                      <AnimatePresence mode="wait">
                        {error && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, scale: 0.95 }}
                            animate={{ opacity: 1, height: "auto", scale: 1 }}
                            exit={{ opacity: 0, height: 0, scale: 0.95 }}
                            className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400 flex items-start gap-2"
                          >
                            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span className="font-medium">{error}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="space-y-4">
                        <motion.div variants={itemVariants} className="space-y-1.5">
                          <Label htmlFor="email" className="text-xs font-medium ml-1 text-gray-400">Email Address</Label>
                          <div className="relative group">
                            <Input
                              ref={emailInputRef}
                              id="email"
                              type="email"
                              placeholder="name@example.com"
                              value={email}
                              onChange={handleEmailChange}
                              onFocus={() => setIsFocused("email")}
                              onBlur={() => setIsFocused(null)}
                              className={`pl-11 h-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 transition-all duration-200 ${
                                emailError 
                                  ? 'border-red-500/50 focus-visible:ring-red-500/30' 
                                  : 'focus-visible:border-[#00acc7] focus-visible:ring-0'
                              }`}
                              required
                            />
                            <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${isFocused === 'email' ? 'text-[#00acc7]' : 'text-gray-500'}`} />
                          </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-1.5">
                          <div className="flex items-center justify-between ml-1">
                            <Label htmlFor="password" className="text-xs font-medium text-gray-400">Password</Label>
                            <Link
                              href="/reset"
                              className="text-[10px] font-medium text-[#00acc7] hover:text-[#00bed1] transition-colors"
                            >
                              Forgot password?
                            </Link>
                          </div>
                          <div className="relative group">
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={handlePasswordChange}
                              onFocus={() => setIsFocused("password")}
                              onBlur={() => setIsFocused(null)}
                              className="pl-11 pr-11 h-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 transition-all duration-200 focus-visible:border-[#00acc7] focus-visible:ring-0"
                              required
                            />
                            <KeyRound className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${isFocused === 'password' ? 'text-[#00acc7]' : 'text-gray-500'}`} />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors p-1"
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </motion.div>
                      </div>

                      <motion.div 
                        variants={itemVariants}
                        className="pt-2"
                      >
                        <Button 
                          type="submit" 
                          className="w-full h-12 rounded-xl bg-[#00acc7] hover:bg-[#00bed1] text-white font-bold text-base shadow-lg shadow-[#00acc7]/20 transition-all duration-300"
                          disabled={loading || isRateLimited || !!emailError || !!passwordError}
                        >
                          {loading ? "Signing in..." : "Sign In"}
                        </Button>
                      </motion.div>
                    </form>

                    <motion.div variants={itemVariants} className="mt-8 pt-6 border-t border-white/5">
                      <div className="flex flex-col gap-3 text-center">
                        <p className="text-xs text-gray-500">Don't have an account yet?</p>
                        <Link href="/ajukan-akun">
                           <Button variant="outline" className="w-full h-10 rounded-xl border-white/10 bg-transparent hover:bg-white/5 text-white transition-all duration-300 text-xs font-medium">
                             Create New Account
                           </Button>
                        </Link>
                      </div>
                    </motion.div>

                     {/* Footer Info */}
                    <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-gray-600">
                      <Shield className="h-3 w-3" />
                      <span>Secured by JobMate Enterprise</span>
                    </div>
                  </CardContent>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
