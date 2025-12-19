"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { createClient } from "@/lib/supabase/client";
import {
  Clock, AlertTriangle, LogOut, Crown, Sparkles, Shield, CheckCircle2, Star, Rocket, ArrowRight
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-is-mobile";
import MobileExpiredView from "@/components/auth/MobileExpiredView";

export default function ExpiredPage() {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/sign-in");
  };

  const handleExtend = () => {
    router.push("/payment?plan=premium");
  };

  // Show loading skeleton during hydration to prevent blank page flash
  if (!isMounted || isMobile === undefined) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-24 w-24 animate-pulse">
            <Image
              src="/Logo/x.png"
              alt="JobMate Logo"
              fill
              className="object-contain"
              priority
            />
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

  // Mobile View
  if (isMobile) {
    return <MobileExpiredView />;
  }

  // Desktop Split Layout
  return (
    <>
      {loading && <LoadingScreen message="Sedang keluar..." />}

      <div className="flex min-h-screen w-full overflow-hidden bg-background">

        {/* === LEFT SIDE: CONTENT === */}
        <div className="relative flex w-full flex-col justify-center px-8 sm:px-12 lg:w-[45%] xl:w-[40%] h-screen border-r border-border/40 shadow-xl z-20 bg-background/80 backdrop-blur-md">

          {/* Brand Logo */}
          <div className="absolute top-8 left-8 sm:left-12 z-50">
            <Link href="/" className="block group">
              <div className="relative h-32 w-32 transition-transform group-hover:scale-105">
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

          <div className="mx-auto w-full max-w-sm space-y-8">
            {/* Header */}
            <div className="space-y-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-600 mb-2"
              >
                <Clock className="h-3.5 w-3.5" />
                <span>Membership Expired</span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold tracking-tight sm:text-4xl text-slate-900"
              >
                Masa Aktif Berakhir
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground leading-relaxed"
              >
                Akses membership Anda telah kedaluwarsa. Perpanjang sekarang untuk terus menikmati fitur eksklusif JobMate.
              </motion.p>
            </div>

            {/* Info Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl border border-orange-200 bg-orange-50/50 p-4 shadow-sm"
            >
              <div className="flex gap-3">
                <div className="rounded-full bg-orange-100 p-2 h-fit">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-orange-900">Akses Terbatas</h4>
                  <p className="text-xs text-orange-700/80 leading-relaxed">
                    Saat ini akun Anda dibatasi ke mode gratis. Fitur seperti Auto-Apply, AI Resume Builder, dan Tracking Analytics tidak dapat diakses.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <div className="space-y-4 pt-2">
              <Button
                onClick={handleExtend}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0 text-base font-bold group"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-yellow-200" />
                  Perpanjang Membership
                  <ArrowRight className="h-4 w-4 ml-1 opacity-70 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>

              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full h-12 rounded-xl text-muted-foreground hover:text-foreground hover:bg-slate-100 transition-colors"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Keluar dari Akun
              </Button>
            </div>

            {/* Footer */}
            <div className="space-y-4 text-center pt-4">
              <p className="text-xs text-muted-foreground">
                Butuh bantuan? <a href="#" className="text-brand hover:underline font-medium">Hubungi Support</a>
              </p>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/60 pt-4 border-t border-dashed border-slate-200 mt-4">
              <Shield className="h-3 w-3" />
              <span>Pembayaran Aman & Terenkripsi</span>
            </div>
          </div>
        </div>

        {/* === RIGHT SIDE: VISUAL === */}
        <div className="relative hidden w-0 flex-1 lg:flex h-screen overflow-hidden bg-[#0a0a0a]">

          {/* Animated Background Elements - Warm/Urgent Theme */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Mesh Gradients */}
            <div className="absolute -top-[20%] -right-[10%] h-[800px] w-[800px] rounded-full bg-orange-600/20 blur-[120px] animate-pulse duration-[8000ms]" />
            <div className="absolute top-[40%] -left-[20%] h-[600px] w-[600px] rounded-full bg-red-600/10 blur-[100px] animate-pulse duration-[10000ms]" />
            <div className="absolute bottom-[-10%] right-[10%] h-[500px] w-[500px] rounded-full bg-amber-600/20 blur-[120px] animate-pulse duration-[6000ms]" />

            {/* Digital Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 flex h-full w-full flex-col justify-between p-16 text-white">

            {/* Top Badge */}
            <div className="flex justify-end">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 backdrop-blur-xl border border-white/10 shadow-2xl"
              >
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                  <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse delay-75" />
                </div>
                <span className="text-xs font-medium text-white/80">Premium Features Paused</span>
              </motion.div>
            </div>

            {/* Main Visual: Time/Renewal Concept */}
            <div className="flex flex-1 items-center justify-center relative perspective-1000">

              {/* Central Glowing Core */}
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 rounded-full blur-3xl opacity-40"
                />
                <div className="relative h-40 w-40 bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center shadow-[0_0_50px_-12px_rgba(255,100,50,0.3)] z-10">
                  <Crown className="h-16 w-16 text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
                </div>

                {/* Orbiting Rings */}
                <div className="absolute inset-[-60px] border border-orange-500/20 rounded-full animate-spin-slow" style={{ animationDuration: '25s' }} />
                <div className="absolute inset-[-110px] border border-dashed border-red-500/10 rounded-full animate-spin-reverse-slow" style={{ animationDuration: '35s' }} />
              </div>

              {/* Floating Feature Cards (Disabled/Paused) */}

              {/* Card 1: AI Resume */}
              <motion.div
                initial={{ x: 60, opacity: 0 }}
                animate={{ x: 0, opacity: 1, y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", delay: 0.2 }}
                className="absolute right-[-20px] top-1/3 w-60 bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-2xl opacity-80 grayscale-[0.5]"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center border border-white/5">
                    <Rocket className="h-5 w-5 text-white/50" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white/90">AI Resume Builder</h4>
                    <p className="text-[10px] text-orange-400 mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Paused
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Card 2: Priority Support */}
              <motion.div
                initial={{ x: -60, opacity: 0 }}
                animate={{ x: 0, opacity: 1, y: [0, 10, 0] }}
                transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
                className="absolute left-[-20px] bottom-1/4 w-52 bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-2xl opacity-80 grayscale-[0.5]"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center border border-white/5">
                    <Star className="h-5 w-5 text-white/50" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white/90">Priority Support</h4>
                    <p className="text-[10px] text-orange-400 mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Paused
                    </p>
                  </div>
                </div>
              </motion.div>

            </div>

            {/* Bottom Quote */}
            <div className="max-w-md">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="relative"
              >
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Jangan Berhenti Sekarang
                  </h3>
                  <div className="h-1 w-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full"></div>
                </div>

                <blockquote className="text-lg font-light leading-relaxed text-white/90 relative z-10">
                  "Investasi terbaik adalah investasi pada diri sendiri. Lanjutkan perjalanan karirmu bersama JobMate Premium."
                </blockquote>

                <div className="mt-6 flex items-center gap-2">
                  <div className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-white/80">
                    #UpgradeYourCareer
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
