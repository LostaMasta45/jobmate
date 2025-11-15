"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Quick fill for development/testing
  const handleQuickFill = () => {
    setEmail("admin@jobmate.com");
    setPassword("Admin123456!");
    setError(null);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      
      // Trim and lowercase email for consistency
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedPassword = password.trim();

      console.log("Attempting login with:", trimmedEmail);
      
      // Sign in
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: trimmedPassword,
      });

      if (signInError) {
        console.error("Sign in error:", signInError);
        
        // Provide helpful error messages
        if (signInError.message === "Invalid login credentials") {
          setError(
            "❌ Email atau password salah.\n\n" +
            "Pastikan:\n" +
            "• Email: admin@jobmate.com\n" +
            "• Password: Admin123456!\n\n" +
            "Perhatikan huruf besar/kecil!"
          );
        } else if (signInError.message.includes("Email not confirmed")) {
          setError("Email belum dikonfirmasi. Hubungi administrator.");
        } else {
          setError(signInError.message);
        }
        return;
      }

      if (!authData.user) {
        setError("Login gagal. Silakan coba lagi.");
        return;
      }

      console.log("User signed in:", authData.user.email);

      // CRITICAL: Wait for session to fully sync before checking role
      // This prevents double login issue where middleware hasn't detected session yet
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Force refresh session on client
      await supabase.auth.getSession();

      // Check if user is admin - with retry logic
      let profile = null;
      let retries = 3;
      
      while (retries > 0 && !profile) {
        const { data, error: profileError } = await supabase
          .from("profiles")
          .select("role, full_name, email")
          .eq("id", authData.user.id)
          .maybeSingle(); // Use maybeSingle instead of single for null-safe fetch

        if (data) {
          profile = data;
          break;
        }

        if (profileError) {
          console.error("Profile check attempt failed:", profileError);
          retries--;
          if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        } else {
          break;
        }
      }

      if (!profile) {
        console.error("Profile not found after retries");
        setError("Tidak dapat memverifikasi profil admin. Silakan coba lagi.");
        await supabase.auth.signOut();
        return;
      }

      console.log("Profile loaded:", profile);

      if (profile.role !== "admin") {
        console.warn("User is not admin:", profile.role);
        setError("Akses ditolak. Halaman ini hanya untuk admin.");
        await supabase.auth.signOut();
        return;
      }

      // Success - redirect to new admin dashboard
      console.log("Admin verified, redirecting to dashboard...");
      window.location.href = "/admin/dashboard";
    } catch (err: any) {
      console.error("Login error:", err);
      setError(`Terjadi kesalahan: ${err.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white dark:bg-gray-800 shadow-[0_8px_24px_rgba(220,38,38,0.15)] dark:shadow-[0_8px_24px_rgba(220,38,38,0.25)] border-2 border-red-100 dark:border-red-900 p-2 relative">
            <img 
              src="/Logo/logokecil.png" 
              alt="JobMate Admin" 
              className="w-full h-full object-contain filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.15)]"
            />
            <ShieldCheck className="h-5 w-5 text-red-600 absolute -top-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-0.5 shadow-md" />
          </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription className="text-red-600 font-medium">
            ⚠️ Area terbatas - Hanya untuk administrator
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
                <pre className="whitespace-pre-wrap font-sans">{error}</pre>
              </div>
            )}

            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 p-3 text-xs border border-blue-200">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                    ℹ️ Kredensial Admin Default:
                  </p>
                  <p className="font-mono text-blue-700 dark:text-blue-300">Email: admin@jobmate.com</p>
                  <p className="font-mono text-blue-700 dark:text-blue-300">Password: Admin123456!</p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleQuickFill}
                  className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white text-xs"
                >
                  Isi Otomatis
                </Button>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                💡 Klik "Isi Otomatis" untuk mengisi form dengan kredensial default
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Admin</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@jobmate.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Gunakan huruf kecil semua untuk email
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Password case-sensitive (huruf besar/kecil berbeda)
              </p>
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
              {loading ? "Memverifikasi..." : "Masuk sebagai Admin"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Bukan admin?{" "}
            <Link href="/sign-in" className="text-brand hover:underline">
              Login sebagai user
            </Link>
          </div>

          <div className="mt-4 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
            <p className="font-medium mb-1">ℹ️ Catatan:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>Gunakan kredensial admin yang valid</li>
              <li>Akses akan ditolak jika bukan admin</li>
              <li>Jangan bagikan kredensial admin</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
