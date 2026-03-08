"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PasswordStrengthMeter } from "@/components/ui/password-strength-meter";
import { FileUploadPreview } from "@/components/ui/file-upload-preview";
import {
  Info,
  AlertCircle,
  Eye,
  EyeOff,
  Send,
  Loader2,
  Sparkles,
  Shield,
  Rocket,
  CheckCircle2,
  Crown
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-is-mobile";
import MobileAjukanAkunView from "@/components/auth/MobileAjukanAkunView";

export default function AjukanAkunPage() {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const [formData, setFormData] = React.useState({
    fullName: "",
    username: "",
    email: "",
    whatsapp: "",
    password: "",
  });
  const [proofFile, setProofFile] = React.useState<File | null>(null);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Show loading skeleton during hydration to prevent blank page flash
  if (!isMounted || isMobile === undefined) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-brand/5 via-background to-brand/5">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand/80 text-white shadow-lg animate-pulse">
            <span className="text-2xl font-bold">JM</span>
          </div>
          <div className="flex gap-1.5">
            <div className="h-2 w-2 rounded-full bg-brand animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="h-2 w-2 rounded-full bg-brand animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="h-2 w-2 rounded-full bg-brand animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  // If mobile, render the mobile view
  if (isMobile) {
    return <MobileAjukanAkunView />;
  }

  // Validation helpers
  const isValidEmail = (email: string) => {
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    return emailRegex.test(email);
  };

  const isValidUsername = (username: string) => {
    const usernameRegex = /^[a-z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  };

  const isValidWhatsApp = (phone: string) => {
    const phoneRegex = /^8[0-9]{8,11}$/;
    return phoneRegex.test(phone);
  };

  const isFormValid =
    formData.fullName.length > 0 &&
    isValidUsername(formData.username) &&
    isValidEmail(formData.email) &&
    isValidWhatsApp(formData.whatsapp) &&
    formData.password.length >= 6 &&
    proofFile !== null;

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!proofFile) {
        setError("Bukti transfer harus di-upload");
        setLoading(false);
        return;
      }

      // Prepare form data
      const apiFormData = new FormData();
      apiFormData.append("fullName", formData.fullName);
      apiFormData.append("username", formData.username);
      apiFormData.append("email", formData.email);
      apiFormData.append("whatsapp", formData.whatsapp);
      apiFormData.append("password", formData.password);
      apiFormData.append("proofFile", proofFile);

      // Call API route
      const response = await fetch("/api/ajukan-akun", {
        method: "POST",
        body: apiFormData,
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Terjadi kesalahan. Silakan coba lagi.");
        return;
      }

      // Redirect to thank you page with email
      router.push(`/ajukan-akun/terima-kasih?code=${result.telegramLinkCode}&email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-background">
      {/* === LEFT SIDE: FORM === */}
      <div className="relative flex w-full flex-col px-8 sm:px-12 lg:w-[50%] xl:w-[45%] h-screen border-r border-border/40 shadow-xl z-20 bg-background/80 backdrop-blur-md overflow-y-auto scrollbar-hide">

        {/* Brand Logo - Native Flow */}
        <div className="pt-8 pb-4 z-50 flex-shrink-0">
          <Link href="/" className="block group">
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 transition-transform group-hover:scale-105">
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

        <div className="mx-auto w-full max-w-xl pb-12 flex-1 flex flex-col pt-4">
          <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Ajukan Akun VIP</h1>
            <p className="text-muted-foreground">
              Lengkapi formulir di bawah ini. Kami memprosesnya maks 1x24 jam.
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm font-medium">
              <span className="flex items-center gap-1.5 text-amber-500">
                <Sparkles className="h-4 w-4" /> Lifetime
              </span>
              <span className="flex items-center gap-1.5 text-emerald-500">
                <Shield className="h-4 w-4" /> All Features
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {error && (
              <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form Section */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="font-semibold text-slate-700 dark:text-slate-300">Nama Lengkap *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  required
                  className="h-12 bg-slate-50/50 border-slate-200 dark:bg-slate-900/50 dark:border-slate-800 focus-visible:ring-brand/30 transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="font-semibold text-slate-700 dark:text-slate-300">
                  Username *{" "}
                  <span className="text-xs font-normal text-muted-foreground block sm:inline">
                    (a-z, 0-9, _)
                  </span>
                </Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => {
                    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "");
                    handleInputChange("username", value);
                  }}
                  minLength={3}
                  maxLength={20}
                  required
                  className="h-12 bg-slate-50/50 border-slate-200 dark:bg-slate-900/50 dark:border-slate-800 focus-visible:ring-brand/30 transition-all duration-200"
                />
                {formData.username && !isValidUsername(formData.username) && (
                  <p className="text-xs text-destructive font-medium mt-1">
                    3-20 karakter valid.
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-semibold text-slate-700 dark:text-slate-300">Email Aktif *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  className="h-12 bg-slate-50/50 border-slate-200 dark:bg-slate-900/50 dark:border-slate-800 focus-visible:ring-brand/30 transition-all duration-200"
                />
                {formData.email && !isValidEmail(formData.email) && (
                  <p className="text-xs text-destructive font-medium mt-1">Format tidak valid</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp" className="font-semibold text-slate-700 dark:text-slate-300">Nomor WhatsApp *</Label>
                <div className="flex gap-2">
                  <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-md border border-slate-200 dark:border-slate-800 bg-muted/50 text-sm font-semibold">
                    +62
                  </div>
                  <Input
                    id="whatsapp"
                    type="tel"
                    placeholder="812345678"
                    value={formData.whatsapp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      handleInputChange("whatsapp", value);
                    }}
                    maxLength={12}
                    required
                    className="h-12 bg-slate-50/50 border-slate-200 dark:bg-slate-900/50 dark:border-slate-800 focus-visible:ring-brand/30 transition-all duration-200"
                  />
                </div>
                {formData.whatsapp && !isValidWhatsApp(formData.whatsapp) && (
                  <p className="text-xs text-destructive font-medium mt-1">
                    Penerapan nomor salah
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-semibold text-slate-700 dark:text-slate-300">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                  minLength={6}
                  className="pr-10 h-12 bg-slate-50/50 border-slate-200 dark:bg-slate-900/50 dark:border-slate-800 focus-visible:ring-brand/30 transition-all duration-200"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <PasswordStrengthMeter password={formData.password} />
            </div>

            <div className="space-y-2 pt-2">
              <Label htmlFor="proof">Upload Bukti Pembayaran *</Label>
              <FileUploadPreview
                file={proofFile}
                onFileChange={setProofFile}
                accept="image/*,.pdf"
                maxSize={2}
                label="Klik untuk upload bukti pembayaran"
                description="atau drag & drop file di sini (img/pdf)"
                required
              />
            </div>

            {/* Info Box */}
            <div className="rounded-xl border border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-900/50 p-4 mt-2">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <p className="font-semibold">Catatan Penting:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-blue-700/90 dark:text-blue-300">
                    <li>Mohon pastikan Anda sudah bayar sebelum submit.</li>
                    <li>Sistem memvalidasi manual (maks 24 jam).</li>
                    <li>Notifikasi akan masuk ke Email dan WA Anda.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button with Confirmation Dialog */}
            <div className="pt-4 pb-6 border-b border-border/50">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    className="w-full h-12 text-base font-semibold shadow-md active:scale-[0.99] transition-all bg-brand hover:bg-brand/90"
                    size="lg"
                    disabled={!isFormValid || loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Kirim Pengajuan Sekarang
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Konfirmasi Pengajuan</AlertDialogTitle>
                    <AlertDialogDescription>
                      Pastikan semua data sudah benar sebelum mengirim pengajuan:
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <div className="space-y-2 rounded-lg bg-muted p-4 text-sm mt-4">
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Nama:</span>
                      <span className="font-medium text-right">{formData.fullName}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Username:</span>
                      <span className="font-medium text-right">{formData.username}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium text-right break-all">{formData.email}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">WhatsApp:</span>
                      <span className="font-medium text-right">+62{formData.whatsapp}</span>
                    </div>
                  </div>

                  <AlertDialogFooter className="mt-6">
                    <AlertDialogCancel>Batal, Cek Lagi</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSubmit} disabled={loading} className="bg-brand hover:bg-brand/90">
                      {loading ? "Mengirim..." : "Ya, Kirim Pengajuan"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div className="text-center text-sm text-muted-foreground space-y-3">
              <p>
                Sudah punya akun?{" "}
                <Link href="/sign-in" className="text-brand font-medium hover:underline">
                  Masuk di sini
                </Link>
              </p>
              <p>
                Sudah pernah mengajukan?{" "}
                <Link href="/cek-status-pengajuan" className="text-brand font-medium hover:underline">
                  Cek statusnya
                </Link>
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* === RIGHT SIDE: VISUAL === */}
      <div className="relative hidden w-0 flex-1 lg:flex h-screen overflow-hidden bg-[#0a0a0a]">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[20%] -right-[10%] h-[800px] w-[800px] rounded-full bg-emerald-600/20 blur-[120px] animate-pulse duration-[8000ms]" />
          <div className="absolute top-[40%] -left-[20%] h-[600px] w-[600px] rounded-full bg-brand/10 blur-[100px] animate-pulse duration-[10000ms]" />
          <div className="absolute bottom-[-10%] right-[10%] h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse duration-[6000ms]" />
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
                <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                <div className="h-2 w-2 rounded-full bg-brand animate-pulse delay-75" />
              </div>
              <span className="text-xs font-medium text-white/80">Premium Access Application</span>
            </motion.div>
          </div>

          {/* Main Visual */}
          <div className="flex flex-1 items-center justify-center relative perspective-1000 min-h-[500px]">

            {/* The Floating VIP Card */}
            <motion.div
              initial={{ rotateY: -20, rotateX: 10, y: 20, opacity: 0 }}
              animate={{ rotateY: [-5, 5, -5], rotateX: [5, -5, 5], y: [0, -15, 0], opacity: 1 }}
              transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
              className="relative z-30 w-[320px] h-[200px] xl:w-[400px] xl:h-[250px] rounded-2xl bg-gradient-to-br from-gray-900/90 via-black to-emerald-950/80 border border-white/20 p-6 flex flex-col justify-between shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_-10px_rgba(16,185,129,0.3)] backdrop-blur-xl overflow-hidden preserve-3d"
            >
              {/* Card Inner Reflections and patterns */}
              <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.05)_40%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0)_60%)] bg-[length:200%_100%] animate-shimmer" />
              <div className="absolute top-0 right-0 -m-8 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 -m-8 w-24 h-24 bg-brand/20 rounded-full blur-2xl" />

              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <div className="text-xs font-semibold text-white/50 tracking-widest uppercase mb-1">JobMate Official</div>
                  <div className="font-bold text-lg xl:text-xl text-white flex items-center gap-2">
                    VIP MEMBER <Crown className="h-4 w-4 text-amber-400" />
                  </div>
                </div>
                {/* Chip Icon */}
                <div className="w-10 h-8 xl:w-12 xl:h-10 rounded bg-gradient-to-br from-amber-200/50 to-amber-500/30 border border-amber-300/30 flex items-center justify-center flex-col gap-0.5 opacity-80 overflow-hidden">
                  <div className="w-full border-b border-amber-900/40" />
                  <div className="w-full flex justify-between gap-1 px-1 h-3">
                    <div className="w-px h-full bg-amber-900/40" />
                    <div className="w-px h-full bg-amber-900/40" />
                  </div>
                  <div className="w-full border-t border-amber-900/40" />
                </div>
              </div>

              <div className="relative z-10 flex justify-between items-end mt-4">
                <div className="space-y-1 xl:space-y-2">
                  <div className="opacity-70 text-sm xl:text-base font-mono tracking-[0.2em] text-white">
                    xxxx xxxx xxxx 2026
                  </div>
                  <div className="flex items-center gap-1.5 text-xs xl:text-sm font-medium text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Lifetime Validity
                  </div>
                </div>
                <div className="h-8 w-8 xl:h-10 xl:w-10 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <span className="font-bold text-white text-sm xl:text-base">JM</span>
                </div>
              </div>
            </motion.div>

            {/* Background Glows for the card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/20 rounded-full blur-[80px] -z-10 animate-pulse" />

            {/* Orbiting Rings */}
            <div className="absolute inset-[-40px] xl:inset-[-50px] border border-white/5 rounded-full animate-spin-slow" style={{ animationDuration: '20s' }} />
            <div className="absolute inset-[-80px] xl:inset-[-100px] border border-dashed border-white/10 rounded-full animate-spin-reverse-slow" style={{ animationDuration: '30s' }} />

            {/* Floating Badges */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1, y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", delay: 0.2 }}
              className="absolute right-[-10px] lg:right-[-30px] xl:right-[0%] top-[15%] w-48 xl:w-56 bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl p-3 xl:p-4 rounded-xl xl:rounded-2xl border border-white/10 shadow-2xl z-40 scale-90 xl:scale-100"
            >
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 xl:h-10 xl:w-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <Shield className="h-4 w-4 xl:h-5 xl:w-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Full Access Granted</h4>
                  <p className="text-[11px] xl:text-xs text-white/60 mt-0.5">Automated Tools & AI</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1, y: [0, 15, 0] }}
              transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
              className="absolute left-[-20px] lg:left-[-40px] xl:left-[0%] bottom-[20%] w-48 xl:w-56 bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl p-3 xl:p-4 rounded-xl xl:rounded-2xl border border-white/10 shadow-2xl z-40 scale-90 xl:scale-100"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 xl:h-10 xl:w-10 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
                  <Rocket className="h-4 w-4 xl:h-5 xl:w-5 text-amber-500" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Priority Support</h4>
                  <p className="text-[11px] xl:text-xs text-white/60 mt-0.5">24/7 Assistance</p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="max-w-md">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="relative">
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-white mb-2">Exclusive VIP Benefits</h3>
                <div className="h-1 w-16 bg-gradient-to-r from-emerald-500 to-brand rounded-full"></div>
              </div>
              <blockquote className="text-lg font-light leading-relaxed text-white/90 relative z-10">
                "Dapatkan keunggulan kompetitif. Akses seluruh tools pendukung karir mulai dari Review CV hingga Simulasi Interview AI."
              </blockquote>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
