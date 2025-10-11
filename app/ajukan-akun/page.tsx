"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AjukanAkunPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    fullName: "",
    username: "",
    email: "",
    whatsapp: "",
    password: "",
  });
  const [proofFile, setProofFile] = React.useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

      // Redirect to thank you page
      router.push(`/ajukan-akun/terima-kasih?code=${result.telegramLinkCode}`);
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
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand text-white">
            <span className="text-2xl font-bold">JM</span>
          </div>
          <CardTitle className="text-2xl">Ajukan Akun JobMate</CardTitle>
          <CardDescription>
            Isi formulir di bawah ini untuk mengajukan akun. Admin akan meninjau dalam
            1x24 jam.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

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
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  required
                />
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">Nomor WhatsApp *</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder="08123456789"
                  value={formData.whatsapp}
                  onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
                minLength={6}
              />
              <p className="text-xs text-muted-foreground">Minimal 6 karakter</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="proof">Bukti Transfer *</Label>
              <Input
                id="proof"
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Upload bukti transfer pembayaran (JPG, PNG, atau PDF, max 2MB)
              </p>
            </div>

            <div className="rounded-lg bg-muted p-4 text-sm">
              <p className="font-medium">Catatan Penting:</p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                <li>Pengajuan akan ditinjau maksimal 1x24 jam</li>
                <li>Anda akan mendapat notifikasi melalui Telegram atau email</li>
                <li>Pastikan semua data yang diisi sudah benar</li>
              </ul>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Mengirim..." : "Kirim Pengajuan"}
            </Button>
          </form>

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
