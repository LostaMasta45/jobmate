"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Crown, Star, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface GamificationBadgeProps {
  planType: string;
  memberNumber?: number;
}

export function GamificationBadge({ planType, memberNumber = 10234 }: GamificationBadgeProps) {
  const isPremium = planType === 'premium';
  const progress = isPremium ? 100 : 30; // Premium = 100%, Basic = 30% to premium

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.9, type: "spring" }}
    >
      <Card className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 dark:from-amber-950/30 dark:via-orange-950/30 dark:to-amber-950/30 border-2 border-amber-300 dark:border-amber-700">
        <CardContent className="pt-6 space-y-6">
          {/* Achievement Badge */}
          <div className="text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 1.0
              }}
              className="inline-block"
            >
              <div className="relative">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-2xl">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
                {/* Glowing effect */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0, 0.5]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 rounded-full bg-amber-400 blur-xl -z-10"
                />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="mt-4 space-y-2"
            >
              <h3 className="text-2xl font-bold text-foreground">
                🎉 Achievement Unlocked!
              </h3>
              <p className="text-sm text-muted-foreground">
                Selamat! Anda sekarang adalah
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-bold shadow-lg">
                {isPremium ? (
                  <>
                    <Crown className="w-5 h-5" />
                    VIP Premium Member
                  </>
                ) : (
                  <>
                    <Star className="w-5 h-5" />
                    VIP Basic Member
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Member #{memberNumber.toLocaleString('id-ID')}
              </p>
            </motion.div>
          </div>

          {/* Progress to next tier (for Basic users) */}
          {!isPremium && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="space-y-3 p-4 bg-white dark:bg-slate-800 rounded-lg border-2 border-amber-300 dark:border-amber-700"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-500" />
                  VIP Basic
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Crown className="w-4 h-4" />
                  VIP Premium
                </span>
              </div>
              
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-center text-muted-foreground">
                  Gunakan 5 tools lagi untuk unlock VIP Premium gratis! 🎁
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <Zap className="w-4 h-4 mx-auto mb-1 text-emerald-500" />
                  <p className="font-semibold">3/8</p>
                  <p className="text-muted-foreground">Tools Used</p>
                </div>
                <div>
                  <Trophy className="w-4 h-4 mx-auto mb-1 text-blue-500" />
                  <p className="font-semibold">0/5</p>
                  <p className="text-muted-foreground">Applications</p>
                </div>
                <div>
                  <Crown className="w-4 h-4 mx-auto mb-1 text-amber-500" />
                  <p className="font-semibold">30%</p>
                  <p className="text-muted-foreground">Complete</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Premium benefits highlight */}
          {isPremium && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="p-4 bg-white dark:bg-slate-800 rounded-lg border-2 border-amber-300 dark:border-amber-700 text-center"
            >
              <p className="text-sm font-semibold mb-2">✨ Akses Lifetime Aktif!</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Nikmati semua fitur premium selamanya + update gratis di masa depan
              </p>
              <div className="flex justify-center gap-2 mt-3">
                <div className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  ∞ Unlimited
                </div>
                <div className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full text-xs font-semibold text-purple-700 dark:text-purple-400">
                  🎁 All Updates Free
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
