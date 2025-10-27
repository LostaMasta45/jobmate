"use client";

import * as React from "react";
import Link from "next/link";
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
  Sparkles
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
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            application.status !== "pending" ? "bg-green-500" : "bg-muted"
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-brand/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Search Card */}
        <Card className="mb-6 backdrop-blur-sm bg-card/95 border-border/50 shadow-2xl animate-in fade-in-50 slide-in-from-bottom-4">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-dark text-white shadow-lg shadow-brand/20">
              <Search className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl font-bold">Cek Status Pengajuan</CardTitle>
            <CardDescription className="text-base">
              Masukkan email yang Anda gunakan saat mengajukan akun untuk melihat status pengajuan
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  className="transition-all duration-200"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]" 
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mencari...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Cek Status
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
              Belum punya akun?{" "}
              <Link href="/ajukan-akun" className="text-brand hover:underline font-medium transition-colors">
                Ajukan Akun Baru
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {hasSearched && renderStatusResult()}

        {/* Info Box */}
        {!hasSearched && (
          <Card className="border-brand/20 bg-brand/5 animate-in fade-in-50 slide-in-from-bottom-4 delay-100">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-lg bg-brand/10 flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-brand" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-sm">Catatan Penting</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Proses review memakan waktu maksimal 1x24 jam</li>
                    <li>• Pastikan email yang dimasukkan sesuai dengan email saat pengajuan</li>
                    <li>• Jika status disetujui, Anda dapat langsung login</li>
                    <li>• Hubungi admin jika ada kendala</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
