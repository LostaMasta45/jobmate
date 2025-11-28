'use client'

import { OptimizedPosterImage } from '@/components/vip/OptimizedPosterImage'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Briefcase, 
  TrendingUp, 
  BookmarkCheck, 
  Clock,
  Crown,
  Sparkles,
  MapPin,
  DollarSign,
  Eye,
  Calendar,
  Building2,
  Bell,
  Target,
  Trophy,
  Bookmark,
  ChevronRight,
  Zap,
  Heart,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Loker } from '@/types/vip'
import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

interface VIPDashboardCompleteProps {
  memberName: string
  memberEmail: string
  memberAvatar?: string | null
  memberTier: string
  membershipExpiry: string | null
  stats: {
    totalLoker: number
    totalPerusahaan: number
    saved: number
    viewedLast7Days: number
  }
  lokerList: Loker[]
  recentlyViewedLoker?: Loker[]
}

const CATEGORIES = ['Semua', 'IT', 'Marketing', 'Sales', 'F&B', 'Retail', 'Administrasi']

export function VIPDashboardComplete({
  memberName,
  memberEmail,
  memberAvatar,
  memberTier,
  membershipExpiry,
  stats,
  lokerList,
  recentlyViewedLoker = [],
}: VIPDashboardCompleteProps) {
  const [selectedCategory, setSelectedCategory] = useState('Semua')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid') // Mobile: list, Desktop: grid
  // Support both 'premium' and 'vip_premium'
  const isPremium = memberTier === 'premium' || memberTier === 'vip_premium'

  const formatSalary = (gaji_text?: string, gaji_min?: number, gaji_max?: number) => {
    if (gaji_text) return gaji_text
    if (gaji_min && gaji_max) {
      return `Rp ${(gaji_min / 1000000).toFixed(1)}-${(gaji_max / 1000000).toFixed(1)} jt`
    }
    if (gaji_min) {
      return `Rp ${(gaji_min / 1000000).toFixed(1)} jt+`
    }
    return 'Nego'
  }

  const getTimeAgo = (date?: string) => {
    if (!date) return ''
    try {
      return formatDistanceToNow(new Date(date), { 
        addSuffix: true,
        locale: idLocale 
      })
    } catch {
      return ''
    }
  }

  // Filter loker by category
  const filteredLoker = lokerList.filter((loker) => {
    if (selectedCategory === 'Semua') return true
    return loker.kategori?.includes(selectedCategory)
  })

  // Get recommended loker (high views or featured)
  const recommendedLoker = lokerList
    .filter(l => l.is_featured || (l.view_count || 0) > 30)
    .slice(0, 6)

  // Get new loker (posted in last 24 hours)
  const newLoker = lokerList
    .filter(l => {
      if (!l.published_at && !l.created_at) return false
      const date = new Date(l.published_at || l.created_at || 0)
      const hoursSincePublished = (Date.now() - date.getTime()) / (1000 * 60 * 60)
      return hoursSincePublished < 24
    })
    .sort((a, b) => {
      const dateA = new Date(a.published_at || a.created_at || 0).getTime()
      const dateB = new Date(b.published_at || b.created_at || 0).getTime()
      return dateB - dateA // newest first
    })
    // REMOVED SLICE LIMIT TO SHOW ALL NEW JOBS FOR COUNT

  // Get today's loker (posted today - same day)
  const todayLoker = lokerList
    .filter(l => {
      const dateStr = l.published_at || l.created_at
      if (!dateStr) return false
      const postDate = new Date(dateStr)
      const today = new Date()
      return (
        postDate.getDate() === today.getDate() &&
        postDate.getMonth() === today.getMonth() &&
        postDate.getFullYear() === today.getFullYear()
      )
    })
    .sort((a, b) => {
      const dateA = new Date(a.published_at || a.created_at || 0).getTime()
      const dateB = new Date(b.published_at || b.created_at || 0).getTime()
      return dateB - dateA // newest first
    })
    // REMOVED SLICE LIMIT TO SHOW ALL TODAY'S JOBS

  return (
    <div className="min-h-screen space-y-4 lg:space-y-6">
      {/* Upgrade Banner for VIP Basic - Mobile Optimized */}
      {!isPremium && (
        <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-2xl lg:rounded-3xl p-4 lg:p-6 text-white shadow-2xl animate-in fade-in duration-500">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0 animate-pulse">
                <Crown className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg sm:text-xl lg:text-2xl mb-1 sm:mb-2 flex items-center gap-2">
                  Upgrade ke VIP Premium! ✨
                </h3>
                <p className="text-xs sm:text-sm text-white/90 mb-2 sm:mb-3">
                  Dapatkan akses penuh ke semua tools JobMate untuk maksimalkan pencarian kerja
                </p>
                <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
                  <div className="flex items-center gap-1.5 bg-white/20 rounded-lg px-2 sm:px-3 py-1">
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="font-medium">CV Generator ATS</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/20 rounded-lg px-2 sm:px-3 py-1">
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="font-medium">Cover Letter AI</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/20 rounded-lg px-2 sm:px-3 py-1">
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="font-medium">Application Tracker</span>
                  </div>
                </div>
              </div>
            </div>
            <Button
              asChild
              size="lg"
              className="bg-white text-purple-600 hover:bg-white/95 rounded-xl font-bold shadow-xl hover:scale-105 transition-all whitespace-nowrap w-full sm:w-auto"
            >
              <a 
                href="https://t.me/jobmate_support"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Crown className="w-5 h-5 mr-2" />
                Upgrade Sekarang
                <ChevronRight className="w-5 h-5 ml-1" />
              </a>
            </Button>
          </div>
        </div>
      )}

      {/* Quick Stats - Mobile: 2 cols, Desktop: 4 cols */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {/* Total Loker */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-xl lg:rounded-2xl border-2 border-blue-200 dark:border-blue-900/30 p-3 lg:p-5 shadow-sm hover:shadow-md transition-shadow active:scale-95">
          <div className="flex items-start justify-between mb-2 lg:mb-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-blue-500 flex items-center justify-center shadow-lg">
              <Briefcase className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">Total Loker</div>
          <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{stats.totalLoker}</div>
        </div>

        {/* Perusahaan */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl lg:rounded-2xl border-2 border-purple-200 dark:border-purple-900/30 p-3 lg:p-5 shadow-sm hover:shadow-md transition-shadow active:scale-95">
          <div className="flex items-start justify-between mb-2 lg:mb-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-purple-500 flex items-center justify-center shadow-lg">
              <Building2 className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">Perusahaan</div>
          <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{stats.totalPerusahaan}</div>
        </div>

        {/* Tersimpan */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-xl lg:rounded-2xl border-2 border-yellow-200 dark:border-yellow-900/30 p-3 lg:p-5 shadow-sm hover:shadow-md transition-shadow active:scale-95">
          <div className="flex items-start justify-between mb-2 lg:mb-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-yellow-500 flex items-center justify-center shadow-lg">
              <BookmarkCheck className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">Tersimpan</div>
          <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{stats.saved}</div>
        </div>

        {/* Dilihat 7 Hari */}
        <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/20 dark:to-teal-950/20 rounded-xl lg:rounded-2xl border-2 border-green-200 dark:border-green-900/30 p-3 lg:p-5 shadow-sm hover:shadow-md transition-shadow active:scale-95">
          <div className="flex items-start justify-between mb-2 lg:mb-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-green-500 flex items-center justify-center shadow-lg">
              <Eye className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">Dilihat (7 Hari)</div>
          <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{stats.viewedLast7Days}</div>
        </div>
      </div>

      {/* New Jobs Alert Banner - Full Width */}
      {newLoker.length > 0 && (
        <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-3xl p-6 text-white shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center animate-pulse flex-shrink-0">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-poppins font-bold text-lg">Loker Baru Hari Ini! 🔥</h3>
                <p className="text-sm text-white/90">{newLoker.length} lowongan baru ditambahkan</p>
              </div>
            </div>
            <Button
              asChild
              size="sm"
              className="bg-white text-orange-600 hover:bg-white/95 rounded-xl font-semibold shadow-lg whitespace-nowrap"
            >
              <Link href="/vip/loker?sort=terbaru">
                Lihat Sekarang
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* Main Content - Full Width */}
      <div className="space-y-6">
          {/* Recently Viewed Section */}
          {recentlyViewedLoker.length > 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-3xl border-2 border-gray-200 dark:border-gray-800 p-6 lg:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-poppins font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center shadow-lg">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  Terakhir Kali Dilihat
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentlyViewedLoker.slice(0, 6).map((loker) => (
                  <LokerCardCompact key={loker.id} loker={loker} />
                ))}
              </div>
            </div>
          )}

          {/* Recommended Section */}
          {recommendedLoker.length > 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl border-2 border-gray-200 dark:border-gray-800 p-4 sm:p-6 lg:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-2xl font-poppins font-bold text-gray-900 dark:text-white flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg">
                    <Target className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <span className="truncate">Rekomendasi Untukmu</span>
                </h2>
                <Button
                  asChild
                  variant="ghost"
                  className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
                >
                  <Link href="/vip/loker?featured=true">
                    <span className="hidden sm:inline">Lihat Semua</span>
                    <span className="sm:hidden">Semua</span>
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-0.5 sm:ml-1" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {recommendedLoker.slice(0, 6).map((loker) => (
                  <LokerCardCompact key={loker.id} loker={loker} />
                ))}
              </div>
            </div>
          )}

          {/* Browse by Category */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border-2 border-gray-200 dark:border-gray-800 p-6 lg:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-poppins font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                Jelajah Loker
              </h2>
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-2 mb-6">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Loker List */}
            <div className="space-y-4">
              {filteredLoker.slice(0, 8).map((loker) => (
                <LokerCardHorizontal key={loker.id} loker={loker} />
              ))}
            </div>

            {filteredLoker.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Briefcase className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  Tidak ada loker dalam kategori ini
                </p>
              </div>
            )}

            {filteredLoker.length > 8 && (
              <div className="mt-6 text-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-semibold shadow-lg"
                >
                  <Link href={`/vip/loker?kategori=${selectedCategory}`}>
                    Lihat Semua {filteredLoker.length} Loker
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Today's Jobs - Lowongan Hari Ini */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border-2 border-gray-200 dark:border-gray-800 p-6 lg:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-poppins font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg animate-pulse">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="flex items-center gap-2">
                  Lowongan Hari Ini
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                    {todayLoker.length}
                  </Badge>
                </span>
              </h2>
              {todayLoker.length > 6 && (
                <Button
                  asChild
                  variant="ghost"
                  className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-xl font-semibold"
                >
                  <Link href="/vip/loker?sort=terbaru">
                    Lihat Semua
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              )}
            </div>

            {todayLoker.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {todayLoker.slice(0, 12).map((loker) => (
                  <div
                    key={loker.id}
                    className="group relative bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-2xl p-5 hover:shadow-xl transition-all duration-300 border-2 border-orange-200 dark:border-orange-900/30"
                  >
                    <Link href={`/vip/loker/${loker.id}`} className="block">
                      {/* NEW Badge */}
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg animate-pulse">
                          BARU!
                        </Badge>
                      </div>

                      {/* Company */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
                          {loker.perusahaan_name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            {loker.perusahaan_name}
                          </div>
                          <h3 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                            {loker.title}
                          </h3>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{loker.lokasi}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{formatSalary(loker.gaji_text, loker.gaji_min, loker.gaji_max)}</span>
                        </div>
                        {loker.kategori && loker.kategori.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {loker.kategori.slice(0, 2).map((cat, idx) => (
                              <Badge 
                                key={idx} 
                                variant="secondary" 
                                className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                              >
                                {cat}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Time */}
                      <div className="mt-3 pt-3 border-t border-orange-200 dark:border-orange-900/30">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {getTimeAgo(loker.published_at || loker.created_at)}
                          </span>
                          {loker.view_count && loker.view_count > 0 && (
                            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {loker.view_count}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-950/30 dark:to-red-950/30 flex items-center justify-center">
                  <Calendar className="w-10 h-10 text-orange-500" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium mb-2">
                  Belum ada lowongan baru hari ini
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Cek lagi nanti atau lihat lowongan terbaru lainnya
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="mt-4 border-orange-300 text-orange-600 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-950/30"
                >
                  <Link href="/vip/loker?sort=terbaru">
                    Lihat Lowongan Terbaru
                  </Link>
                </Button>
              </div>
            )}
          </div>
      </div>
    </div>
  )
}

// Compact Loker Card for Recommendations
function LokerCardCompact({ loker }: { loker: Loker }) {
  const [isBookmarked, setIsBookmarked] = useState(loker.is_bookmarked || false)
  
  const formatSalary = (gaji_text?: string, gaji_min?: number, gaji_max?: number) => {
    if (gaji_text) {
      // Truncate long salary text
      if (gaji_text.length > 25) {
        return gaji_text.substring(0, 22) + '...'
      }
      return gaji_text
    }
    if (gaji_min && gaji_max) {
      return `Rp ${(gaji_min / 1000000).toFixed(1)}-${(gaji_max / 1000000).toFixed(1)}jt`
    }
    if (gaji_min) {
      return `Rp ${(gaji_min / 1000000).toFixed(1)}jt+`
    }
    return 'Nego'
  }

  return (
    <Link
      href={`/vip/loker/${loker.id}`}
      className="group relative block bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
    >
      {/* Poster Thumbnail - Optimized */}
      {loker.poster_url && (
        <div className="relative w-full h-32 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
          <OptimizedPosterImage
            src={loker.poster_url}
            alt={loker.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Badges on Poster */}
          {loker.is_featured && (
            <div className="absolute top-2 right-2 z-10">
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 text-[10px] px-2 py-0.5 shadow-md backdrop-blur-sm">
                ⭐ Featured
              </Badge>
            </div>
          )}
          
          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
            <h3 className="font-bold text-sm line-clamp-1 drop-shadow-lg">
              {loker.title}
            </h3>
            <p className="text-xs opacity-90 drop-shadow-md truncate">
              {loker.perusahaan_name}
            </p>
          </div>
        </div>
      )}

      {/* Badges - Top Right (when NO poster) */}
      {!loker.poster_url && loker.is_featured && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 text-[10px] sm:text-xs px-2 py-0.5 shadow-md">
            ⭐ Featured
          </Badge>
        </div>
      )}

      {/* Content */}
      <div className="p-4 sm:p-5 space-y-3 pr-20">
        {/* Title & Company (only if NO poster) */}
        {!loker.poster_url && (
          <div>
            <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
              {loker.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
              {loker.perusahaan_name}
            </p>
          </div>
        )}
        
        <button
          onClick={(e) => {
            e.preventDefault()
            setIsBookmarked(!isBookmarked)
          }}
          className={`absolute bottom-4 right-4 w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-all shadow-sm ${
            isBookmarked 
              ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
              : 'bg-gray-100 dark:bg-gray-600 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-500'
          }`}
        >
          <Heart className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3 text-xs">
        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 min-w-0">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{loker.lokasi}</span>
        </div>
        <div className="flex items-center gap-1 font-semibold text-green-600 dark:text-green-400 min-w-0">
          <DollarSign className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{formatSalary(loker.gaji_text, loker.gaji_min, loker.gaji_max)}</span>
        </div>
      </div>

      {loker.kategori && loker.kategori.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {loker.kategori.slice(0, 2).map((kat) => (
            <Badge
              key={kat}
              variant="outline"
              className="text-[10px] sm:text-xs px-2 py-0.5 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30"
            >
              {kat}
            </Badge>
          ))}
        </div>
      )}
    </Link>
  )
}

// Horizontal Loker Card
function LokerCardHorizontal({ loker }: { loker: Loker }) {
  const formatSalary = (gaji_text?: string, gaji_min?: number, gaji_max?: number) => {
    if (gaji_text) return gaji_text
    if (gaji_min && gaji_max) {
      return `${(gaji_min / 1000000).toFixed(1)}-${(gaji_max / 1000000).toFixed(1)}jt`
    }
    if (gaji_min) {
      return `${(gaji_min / 1000000).toFixed(1)}jt+`
    }
    return 'Nego'
  }

  const getTimeAgo = (date?: string) => {
    if (!date) return ''
    try {
      return formatDistanceToNow(new Date(date), { 
        addSuffix: true,
        locale: idLocale 
      })
    } catch {
      return ''
    }
  }

  const isNew = loker.published_at && 
    (Date.now() - new Date(loker.published_at).getTime()) < 24 * 60 * 60 * 1000

  return (
    <Link
      href={`/vip/loker/${loker.id}`}
      className="group relative flex gap-4 p-5 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      {/* Badges - Top Right - Clean Positioning */}
      {(loker.is_featured || isNew) && (
        <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
          {loker.is_featured && (
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 text-xs shadow-md backdrop-blur-sm">
              ⭐
            </Badge>
          )}
          {isNew && (
            <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0 text-xs animate-pulse shadow-md backdrop-blur-sm">
              <Zap className="w-3 h-3 mr-1" />
              Baru
            </Badge>
          )}
        </div>
      )}

      {/* Poster or Logo */}
      <div className="flex-shrink-0">
        {loker.poster_url ? (
          <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-600 group-hover:scale-110 transition-transform relative">
            <OptimizedPosterImage
              src={loker.poster_url}
              alt={loker.title}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
        ) : loker.perusahaan?.logo_url ? (
          <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-600 group-hover:scale-110 group-hover:rotate-3 transition-transform">
            <Image
              src={loker.perusahaan.logo_url}
              alt={loker.perusahaan_name}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform">
            <Briefcase className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        )}
      </div>

      {/* Content - Add right padding to avoid badge overlap */}
      <div className="flex-1 min-w-0 pr-20">
        <div className="mb-2">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
            {loker.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
            <Building2 className="w-4 h-4" />
            {loker.perusahaan_name}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm mb-2">
          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4" />
            {loker.lokasi}
          </div>
          <div className="flex items-center gap-1.5 font-bold text-green-600 dark:text-green-400">
            <DollarSign className="w-4 h-4" />
            Rp {formatSalary(loker.gaji_text, loker.gaji_min, loker.gaji_max)}
          </div>
          {loker.published_at && (
            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs">
              <Clock className="w-3.5 h-3.5" />
              {getTimeAgo(loker.published_at)}
            </div>
          )}
        </div>

        {loker.kategori && loker.kategori.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {loker.kategori.slice(0, 3).map((kat) => (
              <Badge
                key={kat}
                variant="outline"
                className="text-xs border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30"
              >
                {kat}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Arrow */}
      <div className="flex-shrink-0 flex items-center">
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  )
}
