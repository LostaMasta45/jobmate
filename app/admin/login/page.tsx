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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      
      // Sign in
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      if (!authData.user) {
        setError("Login gagal. Silakan coba lagi.");
        return;
      }

      // Wait a bit for session to be established
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check if user is admin using user ID (more reliable)
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authData.user.id)
        .single();

      console.log("Profile check:", { profile, profileError });

      if (profileError) {
        console.error("Profile error:", profileError);
        setError(`Error: ${profileError.message}`);
        await supabase.auth.signOut();
        return;
      }

      if (!profile || profile.role !== "admin") {
        setError("Akses ditolak. Halaman ini hanya untuk admin.");
        await supabase.auth.signOut();
        return;
      }

      // Success - redirect to admin dashboard
      console.log("Admin login success! Redirecting...");
      window.location.href = "/admin/applications"; // Force full page reload
    } catch (err: any) {
      setError(`Terjadi kesalahan: ${err.message || "Unknown error"}`);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-600 text-white">
            <ShieldCheck className="h-6 w-6" />
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
                {error}
              </div>
            )}

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
              />
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
              />
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
