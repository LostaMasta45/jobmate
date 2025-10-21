"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export default function SignInPage() {
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

      // Fetch user role & membership to determine redirect
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, membership")
        .eq("id", authData.user.id)
        .single();

      // CRITICAL: Wait for session to fully sync before redirect
      // This prevents double login issue where middleware hasn't detected session yet
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Force refresh session on client
      await supabase.auth.getSession();
      
      // Redirect based on role & membership
      if (profile?.role === "admin") {
        // Admin → redirect to admin dashboard
        window.location.href = "/admin/dashboard";
      } else if (profile?.membership === "vip_premium") {
        // VIP Premium → redirect to JobMate dashboard (full access)
        window.location.href = "/dashboard";
      } else if (profile?.membership === "vip_basic") {
        // VIP Basic → redirect to VIP Career dashboard
        window.location.href = "/vip";
      } else {
        // Free user → redirect to regular dashboard
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand text-white">
            <span className="text-2xl font-bold">JM</span>
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Masuk ke akun JobMate Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/auth/reset"
                  className="text-sm text-brand hover:underline"
                >
                  Lupa password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Masuk..." : "Masuk"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Belum punya akun?{" "}
            <Link href="/ajukan-akun" className="text-brand hover:underline">
              Ajukan akun baru
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
