"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

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
      
      // Set session persistence based on remember me
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

      // Reset login attempts on success
      setLoginAttempts(0);

      console.log("✅ Login successful, user ID:", authData.user.id);
      
      // Determine redirect based on role & membership
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, membership")
        .eq("id", authData.user.id)
        .single();

      console.log("📋 Profile loaded:", { role: profile?.role, membership: profile?.membership });

      let redirectPath = "/dashboard";
      if (profile?.role === "admin") {
        redirectPath = "/admin/dashboard";
      } else if (profile?.membership === "vip_premium") {
        redirectPath = "/dashboard";
      } else if (profile?.membership === "vip_basic") {
        redirectPath = "/vip";
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
      
      {/* Enhanced background with gradient */}
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4 relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-brand/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Glassmorphism card */}
        <Card className="w-full max-w-md relative backdrop-blur-sm bg-card/95 border-border/50 shadow-2xl transition-all duration-300 hover:shadow-brand/5 animate-in fade-in-50 slide-in-from-bottom-4">
          <CardHeader className="space-y-1 text-center">
            {/* Logo with animation */}
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand text-white shadow-lg shadow-brand/20 transition-transform duration-300 hover:scale-110">
              <span className="text-2xl font-bold">JM</span>
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Welcome Back
            </CardTitle>
            <CardDescription>
              Masuk ke akun JobMate Anda
            </CardDescription>

            {/* Security indicator */}
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
              <Lock className="h-3 w-3" />
              <span>Koneksi Aman | 256-bit SSL Encryption</span>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              {/* Enhanced error display */}
              {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive flex items-start gap-2 animate-in slide-in-from-top-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Email field with validation */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  Email
                  {email && !emailError && (
                    <CheckCircle2 className="h-4 w-4 text-green-500 animate-in zoom-in-50" />
                  )}
                </Label>
                <Input
                  ref={emailInputRef}
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={handleEmailChange}
                  className={`transition-all duration-200 ${
                    emailError 
                      ? 'border-destructive focus-visible:ring-destructive' 
                      : email && !emailError 
                        ? 'border-green-500/50 focus-visible:ring-green-500/20'
                        : ''
                  }`}
                  required
                  aria-label="Alamat Email"
                  aria-required="true"
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? "email-error" : undefined}
                />
                {emailError && (
                  <p id="email-error" className="text-xs text-destructive flex items-center gap-1 animate-in slide-in-from-top-1">
                    <AlertCircle className="h-3 w-3" />
                    {emailError}
                  </p>
                )}
              </div>

              {/* Password field with toggle visibility */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    Password
                    {password && !passwordError && (
                      <CheckCircle2 className="h-4 w-4 text-green-500 animate-in zoom-in-50" />
                    )}
                  </Label>
                  <Link
                    href="/auth/reset"
                    className="text-sm text-brand hover:underline transition-colors"
                  >
                    Lupa password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    className={`pr-10 transition-all duration-200 ${
                      passwordError 
                        ? 'border-destructive focus-visible:ring-destructive' 
                        : password && !passwordError 
                          ? 'border-green-500/50 focus-visible:ring-green-500/20'
                          : ''
                    }`}
                    required
                    aria-label="Password"
                    aria-required="true"
                    aria-invalid={!!passwordError}
                    aria-describedby={passwordError ? "password-error" : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {passwordError && (
                  <p id="password-error" className="text-xs text-destructive flex items-center gap-1 animate-in slide-in-from-top-1">
                    <AlertCircle className="h-3 w-3" />
                    {passwordError}
                  </p>
                )}
              </div>

              {/* Remember me checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Ingat saya selama 30 hari
                </label>
              </div>

              {/* Enhanced submit button */}
              <Button 
                type="submit" 
                className="w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:scale-100" 
                disabled={loading || isRateLimited || !!emailError || !!passwordError}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Masuk...
                  </span>
                ) : isRateLimited ? (
                  `Diblokir (${rateLimitTimer}s)`
                ) : (
                  "Masuk"
                )}
              </Button>
            </form>

            {/* Account request status */}
            <div className="mt-6 space-y-3">
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
                  <span className="text-brand group-hover:underline">Cek Status Pengajuan →</span>
                </Link>
              </div>
            </div>

            {/* Social proof */}
            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-xs text-muted-foreground">
                🎯 <span className="font-semibold text-foreground">3,247 orang</span> berhasil dapat kerja bulan ini
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
