"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Star, ArrowRight, Lock, Zap } from "lucide-react";
import Link from "next/link";

interface UpgradeBannerProps {
  currentTier: "free" | "vip_basic" | "vip_premium";
  targetFeature?: string;
  showInline?: boolean;
}

export function UpgradeBanner({ 
  currentTier, 
  targetFeature = "fitur premium",
  showInline = false 
}: UpgradeBannerProps) {
  // VIP Premium users don't need upgrade banner
  if (currentTier === "vip_premium") {
    return null;
  }

  // VIP Basic → Premium upgrade
  if (currentTier === "vip_basic") {
    if (showInline) {
      return (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {targetFeature} hanya untuk VIP Premium
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Upgrade ke VIP Premium untuk akses penuh ke semua tools JobMate
                </p>
              </div>
            </div>
            <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 flex-shrink-0">
              <a 
                href="https://t.me/jobmate_support"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Star className="w-4 h-4 mr-2" />
                Upgrade Premium
              </a>
            </Button>
          </div>
        </Card>
      );
    }

    return (
      <div className="max-w-4xl mx-auto my-8">
        <Card className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-orange-950/20 border-2 border-purple-200 dark:border-purple-800 p-8">
          <div className="text-center space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Star className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Badge */}
            <div className="flex justify-center">
              <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-4 py-1">
                <Crown className="w-4 h-4 mr-1" />
                Anda VIP Basic
              </Badge>
            </div>

            {/* Title */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Upgrade ke VIP Premium! ✨
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Akses penuh ke semua tools JobMate untuk maksimalkan pencarian kerja
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start gap-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <Zap className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">CV Generator</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Buat CV profesional dengan berbagai template
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <Zap className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">Cover Letter</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Generate surat lamaran otomatis dengan AI
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <Zap className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">Email Generator</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Buat email follow-up yang profesional
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <Zap className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">Application Tracker</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Kelola semua lamaran kerja dalam satu tempat
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                asChild 
                size="lg" 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                <a 
                  href="https://t.me/jobmate_support"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Star className="w-5 h-5 mr-2" />
                  Upgrade ke Premium Sekarang
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/vip">
                  Kembali ke VIP Career
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Free → VIP Basic/Premium
  return (
    <div className="max-w-4xl mx-auto my-8">
      <Card className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20 border-2 border-blue-200 dark:border-blue-800 p-8">
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center">
              <Crown className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Title */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Bergabung dengan VIP Career! 🚀
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Pilih paket yang sesuai dengan kebutuhan Anda
            </p>
          </div>

          {/* Features Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* VIP Basic */}
            <Card className="p-6 border-2 border-blue-200 dark:border-blue-800">
              <div className="space-y-4">
                <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                  <Crown className="w-4 h-4 mr-1" />
                  VIP Basic
                </Badge>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Loker VIP Only
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Akses eksklusif ke lowongan kerja VIP
                  </p>
                </div>
                <ul className="space-y-2 text-left text-sm">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Database loker VIP eksklusif</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Info perusahaan lengkap</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Update loker terbaru</span>
                  </li>
                </ul>
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <a 
                    href="https://t.me/jobmate_support"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Pilih VIP Basic
                  </a>
                </Button>
              </div>
            </Card>

            {/* VIP Premium */}
            <Card className="p-6 border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
              <div className="space-y-4">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                  <Star className="w-4 h-4 mr-1" />
                  VIP Premium
                </Badge>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Full Access
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Semua fitur VIP + JobMate Tools
                  </p>
                </div>
                <ul className="space-y-2 text-left text-sm">
                  <li className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Semua fitur VIP Basic</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>CV Generator + ATS Optimizer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>Cover Letter + Email Generator</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>Application Tracker + Follow-up</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>WA Generator + PDF Tools</span>
                  </li>
                </ul>
                <Button asChild className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <a 
                    href="https://t.me/jobmate_support"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Pilih VIP Premium ⭐
                  </a>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
}
