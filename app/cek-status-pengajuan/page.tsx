"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  User,
  Calendar,
  ArrowRight,
  AlertCircle,
  Loader2,
  Crown,
  Star,
  Sparkles,
  Rocket
} from "lucide-react";

type ApplicationStatus = "pending" | "approved" | "rejected" | null;

interface MembershipInfo {
  membership: "vip_basic" | "vip_premium";
  membership_status: string;
  membership_expires_at?: string;
}

interface ApplicationData {
  id: string;
  full_name: string;
  username: string;
  email: string;
  whatsapp: string;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
  approved_at?: string;
  telegram_link_code?: string;
  membership_info?: MembershipInfo;
}

export default function CekStatusPengajuanPage() {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [application, setApplication] = React.useState<ApplicationData | null>(null);
  const [hasSearched, setHasSearched] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await fetch(`/api/check-account-status?email=${encodeURIComponent(email)}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Terjadi kesalahan. Silakan coba lagi.");
        setApplication(null);
        return;
      }

      setApplication(data.application);
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
      setApplication(null);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: ApplicationStatus) => {
    switch (status) {
      case "pending":
        return {
          icon: Clock,
          color: "text-yellow-500",
          bgColor: "bg-yellow-500/10",
          borderColor: "border-yellow-500/50",
          label: "Menunggu Review",
          description: "Pengajuan Anda sedang dalam proses review oleh admin. Mohon bersabar.",
        };
      case "approved":
        return {
          icon: CheckCircle2,
          color: "text-green-500",
          bgColor: "bg-green-500/10",
          borderColor: "border-green-500/50",
          label: "Disetujui",
          description: "Selamat! Akun Anda telah disetujui. Silakan login dengan email dan password yang Anda daftarkan.",
        };
      case "rejected":
        return {
          icon: XCircle,
          color: "text-red-500",
          bgColor: "bg-red-500/10",
          borderColor: "border-red-500/50",
          label: "Ditolak",
          description: "Maaf, pengajuan Anda tidak dapat disetujui. Silakan hubungi admin untuk informasi lebih lanjut.",
        };
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getVIPBadgeConfig = (membership: "vip_basic" | "vip_premium") => {
    if (membership === "vip_premium") {
      return {
        icon: Crown,
        label: "VIP PREMIUM",
        color: "text-purple-600",
        bgColor: "bg-gradient-to-r from-purple-500 to-pink-500",
        borderColor: "border-purple-500",
        glowColor: "shadow-purple-500/50",
        description: "Akses Premium dengan fitur lengkap",
      };
    }
    return {
      icon: Star,
      label: "VIP BASIC",
      color: "text-amber-600",
      bgColor: "bg-gradient-to-r from-amber-400 to-yellow-500",
      borderColor: "border-amber-400",
      glowColor: "shadow-amber-500/50",
      description: "Akses Basic dengan fitur standar",
    };
  };

  const renderStatusResult = () => {
    if (loading) {
      return (
        <Card className="animate-in fade-in-50 slide-in-from-bottom-4">
          <CardContent className="pt-6 flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-brand mb-4" />
            <p className="text-muted-foreground">Mencari pengajuan Anda...</p>
          </CardContent>
        </Card>
      );
    }

    if (error) {
      return (
        <Card className="border-destructive/50 bg-destructive/5 animate-in fade-in-50 slide-in-from-bottom-4">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center py-8">
              <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Pengajuan Tidak Ditemukan</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Tidak ada pengajuan yang ditemukan dengan email <strong>{email}</strong>.
                Pastikan email yang Anda masukkan sudah benar.
              </p>
              <Button asChild variant="outline">
                <Link href="/ajukan-akun">
                  <User className="h-4 w-4 mr-2" />
                  Ajukan Akun Baru
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (application) {
      const statusConfig = getStatusConfig(application.status);

      if (!statusConfig) return null;

      const Icon = statusConfig.icon;

      // Get VIP badge config if approved and has membership info
      const vipBadge = application.status === "approved" && application.membership_info
        ? getVIPBadgeConfig(application.membership_info.membership)
        : null;
      const VIPIcon = vipBadge?.icon;

      return (
        <div className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-4">
          {/* VIP Badge (if approved with membership) */}
          {vipBadge && (
            <Card className={`border-2 ${vipBadge.borderColor} overflow-hidden relative animate-in fade-in-50 zoom-in-95 delay-100`}>
              <div className={`absolute top-0 right-0 w-32 h-32 ${vipBadge.bgColor} opacity-10 rounded-full blur-3xl`} />
              <CardContent className="pt-6 relative">
                <div className="flex items-center gap-4">
                  {/* VIP Icon */}
                  <div className={`flex-shrink-0 h-16 w-16 rounded-2xl ${vipBadge.bgColor} ${vipBadge.glowColor} shadow-lg flex items-center justify-center animate-pulse`}>
                    {VIPIcon && <VIPIcon className="h-8 w-8 text-white" />}
                  </div>

                  {/* VIP Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`text-xl font-bold ${vipBadge.color}`}>
                        {vipBadge.label}
                      </h3>
                      <Sparkles className={`h-5 w-5 ${vipBadge.color} animate-pulse`} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {vipBadge.description}
                    </p>
                  </div>

                  {/* Badge Ribbon */}
                  <div className={`hidden md:block px-4 py-2 ${vipBadge.bgColor} text-white rounded-full text-sm font-semibold ${vipBadge.glowColor} shadow-lg`}>
                    ✨ ACTIVE
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Status Card */}
          <Card className={`border-2 ${statusConfig.borderColor} ${statusConfig.bgColor}`}>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                {/* Status Icon */}
                <div className={`flex-shrink-0 h-20 w-20 rounded-2xl ${statusConfig.bgColor} border-2 ${statusConfig.borderColor} flex items-center justify-center`}>
                  <Icon className={`h-10 w-10 ${statusConfig.color}`} />
                </div>

                {/* Status Info */}
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className={`text-2xl font-bold ${statusConfig.color} mb-1`}>
                      {statusConfig.label}
                    </h3>
                    <p className="text-muted-foreground">
                      {statusConfig.description}
                    </p>
                  </div>

                  {/* Timeline Progress */}
                  <div className="pt-4">
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Timeline Pengajuan</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 space-y-2">
                        {/* Step 1: Submitted */}
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Pengajuan Dikirim</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(application.created_at)}
                            </p>
                          </div>
                        </div>

                        {/* Connector */}
                        <div className="ml-4 h-6 w-0.5 bg-border" />

                        {/* Step 2: Review */}
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${application.status !== "pending" ? "bg-green-500" : "bg-muted"
                            }`}>
                            {application.status !== "pending" ? (
                              <CheckCircle2 className="h-4 w-4 text-white" />
                            ) : (
                              <Clock className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {application.status === "pending" ? "Sedang Direview" : "Review Selesai"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {application.status === "pending"
                                ? "Dalam proses..."
                                : formatDate(application.approved_at || application.updated_at)}
                            </p>
                          </div>
                        </div>

                        {/* Connector */}
                        {application.status === "approved" && (
                          <>
                            <div className="ml-4 h-6 w-0.5 bg-border" />

                            {/* Step 3: Approved */}
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                                <CheckCircle2 className="h-4 w-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-green-600">Akun Aktif</p>
                                <p className="text-xs text-muted-foreground">Siap digunakan</p>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detail Pengajuan</CardTitle>
              <CardDescription>Informasi pengajuan akun Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nama Lengkap</p>
                    <p className="font-medium">{application.full_name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Username</p>
                    <p className="font-medium">{application.username}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{application.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">WhatsApp</p>
                    <p className="font-medium">{application.whatsapp}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {application.status === "approved" && (
              <Button asChild className="flex-1" size="lg">
                <Link href="/sign-in">
                  Login Sekarang
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}

            {application.status === "pending" && (
              <Button asChild variant="outline" className="flex-1" size="lg">
                <Link href="/">
                  Kembali ke Beranda
                </Link>
              </Button>
            )}

            {application.status === "rejected" && (
              <Button asChild variant="outline" className="flex-1" size="lg">
                <Link href="/ajukan-akun">
                  Ajukan Lagi
                </Link>
              </Button>
            )}
          </div>
        </div>
      );
    }

    return null;
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

          <div className="space-y-3 mb-8">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-dark text-white shadow-lg shadow-brand/20 mb-2">
              <Search className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Cek Status Pengajuan</h1>
            <p className="text-muted-foreground">
              Masukkan email yang Anda gunakan saat mengajukan akun untuk melihat status pengajuan.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 mb-8">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-semibold text-slate-700 dark:text-slate-300">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 bg-slate-50/50 border-slate-200 dark:bg-slate-900/50 dark:border-slate-800 focus-visible:ring-brand/30 transition-all duration-200"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold transition-all duration-200 active:scale-[0.98] shadow-lg shadow-brand/20 bg-brand hover:bg-brand/90"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Mencari...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5" />
                  Cek Status
                </>
              )}
            </Button>
          </form>

          {/* Results */}
          <div className="flex-1 w-full">
            {hasSearched ? renderStatusResult() : (
              /* Info Box */
              <div className="rounded-xl border border-brand/20 bg-brand/5 p-5 animate-in fade-in-50 slide-in-from-bottom-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-lg bg-brand/10 flex items-center justify-center">
                      <AlertCircle className="h-5 w-5 text-brand" />
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-0.5">
                    <p className="font-semibold text-sm">Catatan Penting:</p>
                    <ul className="text-sm text-muted-foreground/90 space-y-1.5 list-disc list-inside">
                      <li>Proses review memakan waktu maksimal 1x24 jam</li>
                      <li>Pastikan email sesuai dengan saat pengajuan</li>
                      <li>Jika status disetujui, Anda dapat langsung login</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-border/50 text-center text-sm text-muted-foreground">
            Belum punya akun?{" "}
            <Link href="/ajukan-akun" className="text-brand hover:underline font-medium transition-colors">
              Ajukan Akun Baru
            </Link>
          </div>

        </div>
      </div>

      {/* === RIGHT SIDE: VISUAL === */}
      <div className="relative hidden w-0 flex-1 lg:flex h-screen overflow-hidden bg-[#0a0a0a]">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[20%] -right-[10%] h-[800px] w-[800px] rounded-full bg-blue-600/20 blur-[120px] animate-pulse duration-[8000ms]" />
          <div className="absolute top-[40%] -left-[20%] h-[600px] w-[600px] rounded-full bg-indigo-600/10 blur-[100px] animate-pulse duration-[10000ms]" />
          <div className="absolute bottom-[-10%] right-[10%] h-[500px] w-[500px] rounded-full bg-cyan-600/20 blur-[120px] animate-pulse duration-[6000ms]" />
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
                <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse delay-75" />
                <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse delay-150" />
              </div>
              <span className="text-xs font-medium text-white/80">Application Tracker</span>
            </motion.div>
          </div>

          {/* Main Visual */}
          <div className="flex flex-1 items-center justify-center relative perspective-1000 min-h-[500px]">

            {/* The Floating Tracker UI */}
            <motion.div
              initial={{ rotateY: -15, rotateX: 10, y: 30, opacity: 0 }}
              animate={{ rotateY: [-5, 5, -5], rotateX: [5, -5, 5], y: [0, -15, 0], opacity: 1 }}
              transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
              className="relative z-30 w-[300px] xl:w-[360px] rounded-2xl bg-gradient-to-br from-gray-900/95 via-black to-blue-950/80 border border-white/20 p-5 xl:p-6 flex flex-col shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_-10px_rgba(59,130,246,0.3)] backdrop-blur-xl preserve-3d"
            >
              {/* Card Inner Reflections */}
              <div className="absolute top-0 right-0 -m-8 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                </div>
                <span className="text-sm font-semibold text-white/90 tracking-wide">Live Tracking</span>
              </div>

              {/* Timeline Steps */}
              <div className="space-y-5 xl:space-y-6 relative z-10">
                {/* Step 1: Done */}
                <div className="flex items-start gap-4">
                  <div className="relative flex flex-col items-center">
                    <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)] z-10">
                      <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="absolute top-6 w-0.5 h-8 xl:h-10 bg-blue-500/50" />
                  </div>
                  <div className="pt-0.5">
                    <div className="text-sm xl:text-base font-bold text-white">Data Diterima</div>
                    <div className="text-xs text-white/60 mt-0.5">Sistem mencatat pengajuan Anda</div>
                  </div>
                </div>

                {/* Step 2: In Progress */}
                <div className="flex items-start gap-4">
                  <div className="relative flex flex-col items-center">
                    <div className="h-6 w-6 rounded-full bg-indigo-500 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)] z-10">
                      <Loader2 className="h-3.5 w-3.5 text-white animate-spin" />
                    </div>
                    <div className="absolute top-6 w-0.5 h-8 xl:h-10 bg-white/10" />
                  </div>
                  <div className="pt-0.5">
                    <div className="text-sm xl:text-base font-bold text-white">Sedang Direview</div>
                    <div className="text-xs text-indigo-200/80 mt-0.5">Admin memvalidasi pembayaran</div>
                  </div>
                </div>

                {/* Step 3: Pending */}
                <div className="flex items-start gap-4 opacity-50">
                  <div className="relative flex flex-col items-center">
                    <div className="h-6 w-6 rounded-full border border-white/20 bg-black/50 flex items-center justify-center z-10" />
                  </div>
                  <div className="pt-0.5">
                    <div className="text-sm xl:text-base font-bold text-white">Akun Aktif</div>
                    <div className="text-xs text-white/60 mt-0.5">Siap digunakan login</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Background Glows for the card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[80px] -z-10 animate-pulse" />

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
                <div className="h-8 w-8 xl:h-10 xl:w-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                  <Clock className="h-4 w-4 xl:h-5 xl:w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Status Timeline</h4>
                  <p className="text-[11px] xl:text-xs text-white/60 mt-0.5">Real-time Updates</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1, y: [0, 15, 0] }}
              transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
              className="absolute left-[-20px] lg:left-[-40px] xl:left-[0%] bottom-[15%] w-48 xl:w-56 bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl p-3 xl:p-4 rounded-xl xl:rounded-2xl border border-white/10 shadow-2xl z-40 scale-90 xl:scale-100"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 xl:h-10 xl:w-10 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-4 w-4 xl:h-5 xl:w-5 text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Fast Verif</h4>
                  <p className="text-[11px] xl:text-xs text-white/60 mt-0.5">Max 1x24 Hours</p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="max-w-md">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="relative">
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-white mb-2">Transparansi Proses</h3>
                <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              </div>
              <blockquote className="text-lg font-light leading-relaxed text-white/90 relative z-10">
                "Ketahui pasti status pengajuan akun VIP Anda. Semuanya terekam dengan jelas dan kami proses secepatnya."
              </blockquote>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
