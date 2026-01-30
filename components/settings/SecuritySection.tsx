"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
import { changePassword, signOutAll } from "@/actions/settings";
import { toast } from "sonner";
import { Lock, LogOut, Loader2, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Password saat ini wajib diisi"),
  newPassword: z.string()
    .min(8, "Password minimal 8 karakter")
    .regex(/[a-z]/, "Harus ada huruf kecil")
    .regex(/[A-Z]/, "Harus ada huruf besar")
    .regex(/[0-9]/, "Harus ada angka"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

export function SecuritySection() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: PasswordFormData) => {
    setIsSubmitting(true);
    try {
      await changePassword(data.currentPassword, data.newPassword);
      toast.success("Password berhasil diubah!");
      form.reset();
    } catch (error: any) {
      toast.error(error.message || "Gagal mengubah password");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOutAll = async () => {
    setIsSigningOut(true);
    try {
      await signOutAll();
      toast.success("Berhasil logout dari semua perangkat");
      router.push("/login");
    } catch (error) {
      toast.error("Gagal logout dari semua perangkat");
      console.error(error);
      setIsSigningOut(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Password Change */}
      <Card className="border-0 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            <CardTitle>Ubah Password</CardTitle>
          </div>
          <CardDescription>
            Pastikan password Anda kuat dan unik
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">
                Password Saat Ini <span className="text-red-500">*</span>
              </Label>
              <Input
                id="currentPassword"
                type="password"
                {...form.register("currentPassword")}
                placeholder="••••••••"
              />
              {form.formState.errors.currentPassword && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">
                Password Baru <span className="text-red-500">*</span>
              </Label>
              <Input
                id="newPassword"
                type="password"
                {...form.register("newPassword")}
                placeholder="••••••••"
              />
              <p className="text-xs text-muted-foreground">
                Minimal 8 karakter, huruf besar, kecil, dan angka
              </p>
              {form.formState.errors.newPassword && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                Konfirmasi Password Baru <span className="text-red-500">*</span>
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                {...form.register("confirmPassword")}
                placeholder="••••••••"
              />
              {form.formState.errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mengubah Password...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Update Password
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Session Management */}
      <Card className="border-0 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10">
        <CardHeader>
          <div className="flex items-center gap-2">
            <LogOut className="h-5 w-5" />
            <CardTitle>Kelola Sesi</CardTitle>
          </div>
          <CardDescription>
            Logout dari semua perangkat yang sedang login
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" disabled={isSigningOut}>
                {isSigningOut ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging out...
                  </>
                ) : (
                  <>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout Semua Perangkat
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Logout dari semua perangkat?</AlertDialogTitle>
                <AlertDialogDescription>
                  Anda akan logout dari semua perangkat yang sedang login. Anda perlu login ulang untuk mengakses akun Anda.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={handleSignOutAll}>
                  Ya, Logout Semua
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
