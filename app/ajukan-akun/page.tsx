"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  Shield
} from "lucide-react";

export default function AjukanAkunPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [formData, setFormData] = React.useState({
    fullName: "",
    username: "",
    email: "",
    whatsapp: "",
    password: "",
  });
  const [proofFile, setProofFile] = React.useState<File | null>(null);

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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand/5 via-background to-brand/5 p-4 py-12">
      <Card className="w-full max-w-3xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand/80 text-white shadow-lg">
            <span className="text-3xl font-bold">JM</span>
          </div>
          <CardTitle className="text-3xl font-bold">Ajukan Akun Member VIP</CardTitle>
          <CardDescription className="text-base">
            <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Lifetime Access
              </span>
              <span className="flex items-center gap-1">
                <Shield className="h-4 w-4 text-emerald-500" />
                All Features
              </span>
              <span className="flex items-center gap-1">
                <AlertCircle className="h-4 w-4 text-blue-500" />
                Aktivasi 1x24 Jam
              </span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {error && (
              <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Info Box */}
            <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950 dark:to-blue-900/50 dark:border-blue-900 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500 text-white">
                  <Info className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground">
                    📝 Lengkapi Data Akun Anda
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Isi formulir di bawah untuk melengkapi data akun VIP Anda. Admin akan meninjau dan mengaktifkan akun dalam 1x24 jam.
                  </p>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nama Lengkap *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">
                  Username *{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    (huruf kecil, angka, underscore)
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
                />
                {formData.username && !isValidUsername(formData.username) && (
                  <p className="text-xs text-destructive">
                    Username harus 3-20 karakter (huruf kecil, angka, atau underscore)
                  </p>
                )}
                {formData.username && isValidUsername(formData.username) && (
                  <p className="text-xs text-emerald-600">✓ Username valid</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email Aktif *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
                {formData.email && !isValidEmail(formData.email) && (
                  <p className="text-xs text-destructive">Format email tidak valid</p>
                )}
                {formData.email && isValidEmail(formData.email) && (
                  <p className="text-xs text-emerald-600">✓ Email valid</p>
                )}
                <p className="text-xs text-muted-foreground">
                  📧 Notifikasi akan dikirim ke email ini
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">Nomor WhatsApp *</Label>
                <div className="flex gap-2">
                  <div className="flex h-10 w-16 shrink-0 items-center justify-center rounded-md border bg-muted text-sm font-medium">
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
                  />
                </div>
                {formData.whatsapp && !isValidWhatsApp(formData.whatsapp) && (
                  <p className="text-xs text-destructive">
                    Nomor harus dimulai dengan 8 (contoh: 812345678)
                  </p>
                )}
                {formData.whatsapp && isValidWhatsApp(formData.whatsapp) && (
                  <p className="text-xs text-emerald-600">✓ Nomor valid</p>
                )}
                <p className="text-xs text-muted-foreground">
                  💬 Admin akan menghubungi via WhatsApp
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                  minLength={6}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              <PasswordStrengthMeter password={formData.password} />
              <p className="text-xs text-muted-foreground">Minimal 6 karakter</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="proof">Bukti Pembayaran *</Label>
              <FileUploadPreview
                file={proofFile}
                onFileChange={setProofFile}
                accept="image/*,.pdf"
                maxSize={2}
                label="Klik untuk upload bukti pembayaran"
                description="atau drag & drop file di sini"
                required
              />
              <p className="text-xs text-muted-foreground">
                💡 Screenshot/foto invoice dari Xendit atau bukti pembayaran lainnya
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="font-medium text-blue-800 dark:text-blue-200">
                    📋 Catatan Penting
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-blue-700 dark:text-blue-300">
                    <li>💳 Pastikan Anda sudah melakukan pembayaran via Xendit</li>
                    <li>✅ Pengajuan akan ditinjau maksimal 1x24 jam (hari kerja)</li>
                    <li>📧 Anda akan menerima email konfirmasi setelah submit</li>
                    <li>📱 Admin akan menghubungi via WhatsApp jika diperlukan</li>
                    <li>🔑 Akun aktif setelah pengajuan disetujui admin</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* FAQ Accordion */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>❓ Apakah harus bayar dulu sebelum ajukan akun?</AccordionTrigger>
                <AccordionContent>
                  Ya, Anda harus melakukan pembayaran terlebih dahulu di halaman /payment. 
                  Setelah pembayaran berhasil, gunakan form ini untuk melengkapi data akun Anda.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>📸 Bukti pembayaran apa yang harus di-upload?</AccordionTrigger>
                <AccordionContent>
                  Screenshot invoice dari Xendit, bukti pembayaran dari e-wallet (OVO, GoPay, DANA), 
                  atau bukti transfer dari bank. Pastikan nominal dan tanggal pembayaran terlihat jelas.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>🕐 Berapa lama proses aktivasi?</AccordionTrigger>
                <AccordionContent>
                  Maksimal 1x24 jam pada hari kerja (Senin-Jumat). Pada hari libur, 
                  pengajuan akan diproses pada hari kerja berikutnya.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>📧 Apa yang dikirim ke email saya?</AccordionTrigger>
                <AccordionContent>
                  Anda akan menerima: (1) Konfirmasi pengajuan diterima, (2) Notifikasi 
                  saat pengajuan disetujui/ditolak, (3) Petunjuk login jika disetujui.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>🔍 Bagaimana cara cek status pengajuan?</AccordionTrigger>
                <AccordionContent>
                  Setelah submit, Anda akan mendapat kode referensi. Simpan kode ini dan 
                  gunakan di halaman &quot;Cek Status Pengajuan&quot; untuk tracking.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Submit Button with Confirmation Dialog */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  type="button" 
                  className="w-full" 
                  size="lg"
                  disabled={!isFormValid || loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Mengirim Pengajuan...
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

                <div className="space-y-2 rounded-lg bg-muted p-4 text-sm">
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
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Bukti Pembayaran:</span>
                    <span className="font-medium text-right break-all">{proofFile?.name}</span>
                  </div>
                </div>

                <AlertDialogFooter>
                  <AlertDialogCancel>Batal, Cek Lagi</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSubmit} disabled={loading}>
                    {loading ? "Mengirim..." : "Ya, Kirim Pengajuan"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <Link href="/auth/sign-in" className="text-brand hover:underline">
              Masuk di sini
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
