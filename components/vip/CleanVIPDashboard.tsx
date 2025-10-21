'use client'

import Link from 'next/link'
import { Briefcase, TrendingUp, BookmarkCheck, ArrowRight, Sparkles, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ModernLokerCard } from './ModernLokerCard'
import type { Loker } from '@/types/vip'

interface CleanVIPDashboardProps {
  memberName: string
  memberTier: 'basic' | 'premium'
  stats: {
    totalLoker: number
    newToday: number
    saved: number
  }
  trendingLoker: Loker[]
}

export function CleanVIPDashboard({
  memberName,
  memberTier,
  stats,
  trendingLoker,
}: CleanVIPDashboardProps) {
  const isPremium = memberTier === 'premium'

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-950/30 dark:to-teal-950/30 rounded-3xl p-8 border-2 border-cyan-200 dark:border-cyan-900">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Badge className={`${
                isPremium
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                  : 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white'
              } border-0 px-4 py-1.5`}>
                {isPremium ? (
                  <>
                    <Crown className="w-4 h-4 mr-1" />
                    Premium Member
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-1" />
                    Basic Member
                  </>
                )}
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              Halo, {memberName}! 👋
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Ada <span className="font-bold text-cyan-600 dark:text-cyan-400">{stats.newToday}</span> lowongan baru hari ini
            </p>
          </div>

          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white border-0 shadow-lg hover:shadow-xl transition-all rounded-2xl px-8"
          >
            <Link href="/vip/loker" className="gap-2">
              <Briefcase className="w-5 h-5" />
              Cari Loker
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold">{stats.totalLoker}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Loker</div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.newToday}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Baru Hari Ini</div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <BookmarkCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.saved}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Tersimpan</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Loker Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">🔥 Loker Trending</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Paling banyak dilihat minggu ini
            </p>
          </div>
          <Button 
            asChild 
            variant="ghost" 
            className="gap-2 hover:bg-cyan-50 dark:hover:bg-cyan-950"
          >
            <Link href="/vip/loker">
              Lihat Semua
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* Trending Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingLoker.slice(0, 6).map((loker) => (
            <ModernLokerCard key={loker.id} loker={loker} />
          ))}
        </div>

        {trendingLoker.length === 0 && (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-3xl">
            <p className="text-gray-500">Belum ada loker trending</p>
          </div>
        )}
      </div>

      {/* Upgrade Premium CTA (for Basic members) */}
      {!isPremium && (
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-3xl p-8 text-white">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '32px 32px'
            }} />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Crown className="w-8 h-8" />
                <h3 className="text-2xl font-bold">Upgrade ke Premium</h3>
              </div>
              <p className="text-white/90 mb-4">
                Dapatkan akses unlimited, prioritas support, dan fitur eksklusif lainnya
              </p>
              <ul className="space-y-2">
                {[
                  'Akses unlimited loker',
                  'AI job matching',
                  'Priority support',
                  'Notifikasi real-time',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <Button
              asChild
              size="lg"
              className="bg-white text-purple-600 hover:bg-white/90 hover:scale-105 transition-all shadow-2xl rounded-2xl px-8"
            >
              <Link href="/vip/upgrade" className="gap-2">
                <Crown className="w-5 h-5" />
                Upgrade Sekarang
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
