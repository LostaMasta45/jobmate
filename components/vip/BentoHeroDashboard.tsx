'use client'

import { TrendingUp, Briefcase, Building2, BookmarkCheck, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface BentoHeroDashboardProps {
  stats: {
    totalLoker: number
    newToday: number
    saved: number
    applied: number
  }
  memberName: string
  memberTier: 'basic' | 'premium'
}

export function BentoHeroDashboard({ stats, memberName, memberTier }: BentoHeroDashboardProps) {
  const isPremium = memberTier === 'premium'

  return (
    <div className="space-y-6">
      {/* Hero Greeting */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500 via-teal-500 to-emerald-500 p-8 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                {isPremium ? (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Premium Member
                  </>
                ) : (
                  <>
                    ⭐ Basic Member
                  </>
                )}
              </div>
              <h1 className="text-4xl font-bold mb-2">
                Halo, {memberName}! 👋
              </h1>
              <p className="text-white/90 text-lg">
                Siap menemukan pekerjaan impianmu?
              </p>
            </div>

            {/* Quick Action */}
            <Button
              asChild
              size="lg"
              className="bg-white text-cyan-600 hover:bg-white/90 hover:scale-105 transition-all shadow-xl"
            >
              <Link href="/vip/loker" className="gap-2">
                <Sparkles className="w-5 h-5" />
                Cari Loker
              </Link>
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Total Loker */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
                <Briefcase className="w-4 h-4" />
                Total Loker
              </div>
              <div className="text-3xl font-bold">{stats.totalLoker}</div>
            </div>

            {/* New Today */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
                <TrendingUp className="w-4 h-4" />
                Baru Hari Ini
              </div>
              <div className="text-3xl font-bold text-yellow-300">{stats.newToday}</div>
            </div>

            {/* Saved */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
                <BookmarkCheck className="w-4 h-4" />
                Tersimpan
              </div>
              <div className="text-3xl font-bold">{stats.saved}</div>
            </div>

            {/* Applied */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
                <Building2 className="w-4 h-4" />
                Dilamar
              </div>
              <div className="text-3xl font-bold">{stats.applied}</div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
      </div>

      {/* Bento Grid - Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Featured Card - Large */}
        <div className="md:col-span-2 bg-white dark:bg-card rounded-3xl p-6 border border-gray-200 dark:border-gray-800 hover:shadow-xl hover:scale-[1.02] transition-all group cursor-pointer">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold mb-2">🔥 Loker Trending</h3>
              <p className="text-muted-foreground">
                Paling banyak dilihat minggu ini
              </p>
            </div>
            <Button variant="ghost" size="icon" className="group-hover:bg-cyan-50 dark:group-hover:bg-cyan-950">
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Preview List */}
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center text-white font-bold">
                  {i}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">UI/UX Designer</div>
                  <div className="text-sm text-muted-foreground">PT Digital Creative</div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {Math.floor(Math.random() * 100) + 50} views
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Small Cards */}
        <div className="space-y-4">
          {/* Saved */}
          <Link
            href="/vip/saved"
            className="block bg-orange-50 dark:bg-orange-950/20 rounded-3xl p-6 border-2 border-orange-200 dark:border-orange-900 hover:shadow-xl hover:scale-105 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center">
                <BookmarkCheck className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-orange-600 dark:text-orange-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="text-2xl font-bold mb-1">{stats.saved}</div>
            <div className="text-sm text-muted-foreground">Loker Tersimpan</div>
          </Link>

          {/* Premium Upgrade */}
          {!isPremium && (
            <Link
              href="/vip/upgrade"
              className="block bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-6 text-white hover:shadow-2xl hover:scale-105 transition-all group relative overflow-hidden"
            >
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

              <div className="relative z-10">
                <Sparkles className="w-8 h-8 mb-3" />
                <div className="font-bold text-lg mb-1">Upgrade Premium</div>
                <div className="text-sm text-white/80">
                  Akses unlimited & fitur eksklusif
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
