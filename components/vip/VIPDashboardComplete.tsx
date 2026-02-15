'use client'

import { OptimizedPosterImage } from '@/components/vip/OptimizedPosterImage'
import { CompleteProfileBanner } from '@/components/vip/CompleteProfileBanner'
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
  User,
  ExternalLink
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
  userSkills?: string[]
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
  userSkills = [],
}: VIPDashboardCompleteProps) {
  // Helper to calculate match score - enhanced to use title, kategori, kualifikasi, deskripsi
  const calculateMatchScore = (loker: Loker) => {
    if (!userSkills.length) return 0

    const userSkillsLower = userSkills.map(s => s.toLowerCase().trim())

    // 1. If loker has skills, use direct matching (best case)
    if (loker.skills && loker.skills.length > 0) {
      const matches = loker.skills.filter(skill =>
        userSkillsLower.some(us => us === skill.toLowerCase())
      )
      return Math.round((matches.length / loker.skills.length) * 100)
    }

    // 2. Fallback: match against title, kategori, kualifikasi, deskripsi
    let score = 0
    let maxScore = 0

    // Check title (high weight: 40)
    const titleLower = (loker.title || '').toLowerCase()
    const titleMatches = userSkillsLower.some(skill =>
      titleLower.includes(skill) || skill.includes(titleLower.split(' ')[0])
    )
    if (titleMatches) score += 40
    maxScore += 40

    // Check kategori (high weight: 30)
    const kategoriArr = loker.kategori || []
    const kategoriLower = kategoriArr.map(k => k.toLowerCase())
    const kategoriMatches = userSkillsLower.filter(skill =>
      kategoriLower.some(k => k.includes(skill) || skill.includes(k))
    ).length
    if (kategoriMatches > 0) score += 30
    maxScore += 30

    // Check kualifikasi (medium weight: 20)
    const kualifikasiText = (loker.kualifikasi || []).join(' ').toLowerCase()
    const kualifikasiMatches = userSkillsLower.filter(skill =>
      kualifikasiText.includes(skill)
    ).length
    if (kualifikasiMatches > 0) score += Math.min(20, kualifikasiMatches * 10)
    maxScore += 20

    // Check deskripsi (low weight: 10)
    const deskripsiLower = (loker.deskripsi || '').toLowerCase()
    const deskripsiMatches = userSkillsLower.filter(skill =>
      deskripsiLower.includes(skill)
    ).length
    if (deskripsiMatches > 0) score += Math.min(10, deskripsiMatches * 5)
    maxScore += 10

    return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0
  }
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

  // 1. Calculate scores for all loker first
  const lokerWithScores = lokerList.map(l => ({
    ...l,
    matchScore: calculateMatchScore(l)
  }))

  // 2. Filter loker by category
  const filteredLoker = lokerWithScores.filter((loker) => {
    if (selectedCategory === 'Semua') return true
    return loker.kategori?.includes(selectedCategory)
  })

  // 3. Get recommended loker (Sorted by Match Score, then Featured, then Views)
  const recommendedLoker = [...lokerWithScores]
    .sort((a, b) => {
      // Priority 1: Match Score (if > 0)
      if (a.matchScore !== b.matchScore) return b.matchScore - a.matchScore
      // Priority 2: Featured
      if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1
      // Priority 3: Views
      return (b.view_count || 0) - (a.view_count || 0)
    })
    .slice(0, 6)

  // 4. Get new loker (last 24h)
  const newLoker = lokerWithScores
    .filter(l => {
      if (!l.published_at && !l.created_at) return false
      const date = new Date(l.published_at || l.created_at || 0)
      const hoursSincePublished = (Date.now() - date.getTime()) / (1000 * 60 * 60)
      return hoursSincePublished < 24
    })
    .sort((a, b) => b.matchScore - a.matchScore)

  // 5. Get today's loker (posted today)
  const todayLoker = lokerWithScores
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
    .sort((a, b) => b.matchScore - a.matchScore)

  // 6. Recently Viewed with Scores
  const recentlyViewedWithScores = recentlyViewedLoker.map(l => ({
    ...l,
    matchScore: calculateMatchScore(l)
  }))

  return (
    <div className="min-h-screen space-y-6 sm:space-y-8 pb-10">
      {/* Upgrade Banner for VIP Basic */}
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
                  Akses penuh ke CV Generator ATS, Cover Letter AI, dan Match Score tanpa batas.
                </p>
                <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
                  <div className="flex items-center gap-1.5 bg-white/20 rounded-lg px-2 sm:px-3 py-1">
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="font-medium">Prioritas Lamaran</span>
                  </div>
                </div>
              </div>
            </div>
            <Button
              asChild
              size="lg"
              className="bg-white text-purple-600 hover:bg-white/95 rounded-xl font-bold shadow-xl hover:scale-105 transition-all whitespace-nowrap w-full sm:w-auto"
            >
              <a href="https://t.me/jobmate_support" target="_blank" rel="noopener noreferrer">
                <Crown className="w-5 h-5 mr-2" />
                Upgrade Sekarang
                <ChevronRight className="w-5 h-5 ml-1" />
              </a>
            </Button>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-xl lg:rounded-2xl border-2 border-blue-200 dark:border-blue-900/30 p-3 lg:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center shadow-lg"><Briefcase className="w-5 h-5 text-white" /></div>
            <span className="text-2xl font-bold">{stats.totalLoker}</span>
          </div>
          <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Loker</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl lg:rounded-2xl border-2 border-purple-200 dark:border-purple-900/30 p-3 lg:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center shadow-lg"><Building2 className="w-5 h-5 text-white" /></div>
            <span className="text-2xl font-bold">{stats.totalPerusahaan}</span>
          </div>
          <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Perusahaan</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-xl lg:rounded-2xl border-2 border-yellow-200 dark:border-yellow-900/30 p-3 lg:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-yellow-500 flex items-center justify-center shadow-lg"><BookmarkCheck className="w-5 h-5 text-white" /></div>
            <span className="text-2xl font-bold">{stats.saved}</span>
          </div>
          <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Tersimpan</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/20 dark:to-teal-950/20 rounded-xl lg:rounded-2xl border-2 border-green-200 dark:border-green-900/30 p-3 lg:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center shadow-lg"><Eye className="w-5 h-5 text-white" /></div>
            <span className="text-2xl font-bold">{stats.viewedLast7Days}</span>
          </div>
          <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Dilihat (7 Hari)</div>
        </div>
      </div>

      {/* HERO SECTION: Lowongan Hari Ini */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
              <Sparkles className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold font-poppins">Lowongan Hari Ini</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Update terbaru hari ini</p>
            </div>
          </div>
          {todayLoker.length > 0 && (
            <Badge className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 shadow-lg animate-bounce hidden sm:flex">
              {todayLoker.length} Baru
            </Badge>
          )}
        </div>

        {/* Content */}
        {todayLoker.length > 0 ? (
          /* Horizontal Carousel */
          <div className="flex overflow-x-auto pb-8 gap-4 px-1 snap-x scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 mask-linear-fade">
            {todayLoker.map((loker, idx) => (
              <div key={loker.id} className="min-w-[280px] sm:min-w-[320px] snap-center h-full">
                <LokerCardGlass loker={loker} matchScore={loker.matchScore} priority={idx < 2} />
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-8 sm:py-12 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
            <div className="w-16 h-16 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-orange-500 dark:text-orange-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">
              Belum ada lowongan baru
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto text-center px-4 leading-relaxed">
              Tim kami sedang mengumpulkan info lowongan terbaru untuk hari ini.
              <br className="hidden sm:block" /> Silakan cek rekomendasi atau kategori di bawah ya!
            </p>
          </div>
        )}
      </section>

      {/* NEW: Profile Completion Banner - Full Width */}
      <CompleteProfileBanner completionPercentage={userSkills?.length > 0 ? 85 : 45} />

      {/* SPLIT GRID LAYOUT */}
      <div className={`grid grid-cols-1 gap-8 ${recentlyViewedWithScores.length > 0 ? 'lg:grid-cols-4' : 'lg:grid-cols-1'}`}>

        {/* LEFT COLUMN: Main Feed (3 Cols) */}
        <div className={`space-y-10 ${recentlyViewedWithScores.length > 0 ? 'lg:col-span-3' : 'lg:col-span-1'}`}>

          {/* Recommended Section (Smart Match) */}
          {recommendedLoker.length > 0 && (
            <section className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                    <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold font-poppins">Rekomendasi Pintar</h2>
                    <p className="text-xs text-gray-500">Disortir berdasarkan kecocokan skill Anda</p>
                  </div>
                </div>
                <Link href="/vip/loker?sort=rekomendasi" className="text-sm font-semibold text-blue-600 hover:underline flex items-center">
                  Lihat Semua <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {recommendedLoker.map((loker, idx) => (
                  <LokerCardMatch key={loker.id} loker={loker} matchScore={loker.matchScore} priority={idx < 3} />
                ))}
              </div>
            </section>
          )}

          {/* Explore Section */}
          <section id="explore" className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 lg:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                  <Briefcase className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold font-poppins">Jelajah Kategori</h2>
              </div>

              {/* Category Filter Chips */}
              <div className="flex flex-wrap gap-2 mb-8">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedCategory === cat
                      ? 'bg-gray-900 text-white shadow-lg scale-105 dark:bg-white dark:text-gray-900'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* List */}
              <div className="space-y-4">
                {filteredLoker.slice(0, 10).map((loker, idx) => (
                  <LokerCardHorizontal key={loker.id} loker={loker} matchScore={loker.matchScore} priority={idx < 2} />
                ))}
              </div>

              {filteredLoker.length > 10 && (
                <div className="mt-8 text-center">
                  <Button asChild size="lg" variant="outline" className="rounded-xl">
                    <Link href={`/vip/loker?kategori=${selectedCategory}`}>
                      Lihat {filteredLoker.length - 10} Loker Lainnya
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Sidebar (1 Col - Sticky) */}
        {recentlyViewedWithScores.length > 0 && (
          <aside className="lg:col-span-1 space-y-6">
            <div className="sticky top-24 space-y-6">

              {/* Recently Viewed Widget */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4 border-b border-gray-100 dark:border-gray-800 pb-3">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <h3 className="font-bold text-gray-900 dark:text-white">Terakhir Dilihat</h3>
                </div>
                <div className="space-y-4">
                  {recentlyViewedWithScores.slice(0, 4).map(loker => (
                    <LokerCardStory key={loker.id} loker={loker} matchScore={loker.matchScore} />
                  ))}
                </div>
              </div>

            </div>
          </aside>
        )}

      </div>
    </div>
  )
}



// Compact Loker Card for Recommendations
function LokerCardCompact({ loker, priority = false, matchScore }: { loker: Loker; priority?: boolean; matchScore?: number }) {
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
            priority={priority}
          />

          {/* Match Badge */}
          {matchScore !== undefined && matchScore > 0 && (
            <div className={`absolute top-2 left-2 z-20 px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-lg backdrop-blur-md border border-white/20 ${matchScore >= 80 ? 'bg-green-500/90' : matchScore >= 50 ? 'bg-yellow-500/90' : 'bg-blue-500/90'
              }`}>
              {matchScore}% Match
            </div>
          )}

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
          className={`absolute bottom-4 right-4 w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-all shadow-sm ${isBookmarked
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

// Horizontal Loker Card - Redesigned V2
function LokerCardHorizontal({ loker, priority = false, matchScore }: { loker: Loker; priority?: boolean; matchScore?: number }) {
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
      className="group relative flex flex-row gap-3 sm:gap-5 p-3 sm:p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition-all duration-300 items-start active:scale-[0.99]"
    >
      {/* Poster or Logo - Left Side */}
      <div className="flex-shrink-0 relative">
        {loker.poster_url ? (
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 group-hover:shadow-md transition-all">
            <OptimizedPosterImage
              src={loker.poster_url}
              alt={loker.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="96px"
              priority={priority}
            />
          </div>
        ) : loker.perusahaan?.logo_url ? (
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 p-2 bg-white flex items-center justify-center group-hover:shadow-md transition-all">
            <Image
              src={loker.perusahaan.logo_url}
              alt={loker.perusahaan_name}
              width={80}
              height={80}
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center border border-blue-100 dark:border-blue-800">
            <Briefcase className="w-8 h-8 text-blue-500 dark:text-blue-400" />
          </div>
        )}

        {/* Featured Badge Overlay */}
        {loker.is_featured && (
          <div className="absolute -top-1.5 -left-1.5 z-10">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-1 rounded-full shadow-sm border-2 border-white dark:border-gray-800">
              <Crown className="w-3 h-3" />
            </div>
          </div>
        )}
      </div>

      {/* Content - Right Side */}
      <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
        <div>
          {/* Header Row: Title & Status */}
          <div className="flex items-start justify-between gap-3 mb-1">
            <h3 className="font-bold text-sm sm:text-lg text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {loker.title}
            </h3>

            {/* New Badge */}
            <div className="flex gap-1">
              {matchScore !== undefined && matchScore > 0 && (
                <Badge className={`border-0 text-[10px] px-2 py-0.5 flex-shrink-0 ${matchScore >= 80 ? 'bg-green-100 text-green-700' : matchScore >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                  {matchScore}% Match
                </Badge>
              )}
              {isNew && (
                <Badge className="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 border-blue-100 dark:border-blue-800 text-[10px] px-2 py-0.5 flex-shrink-0 animate-pulse hidden sm:flex">
                  BARU
                </Badge>
              )}
            </div>
          </div>

          {/* Company Name */}
          <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1.5 truncate">
            {loker.perusahaan_name}
          </p>
        </div>

        {/* Metadata Grid/Flex */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-auto">
          {/* Salary Highlight */}
          <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md self-start">
            <DollarSign className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>{formatSalary(loker.gaji_text, loker.gaji_min, loker.gaji_max)}</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            {/* Location */}
            <div className="flex items-center gap-1 truncate max-w-[120px]">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{loker.lokasi}</span>
            </div>

            {/* Time */}
            {loker.published_at && (
              <div className="flex items-center gap-1 flex-shrink-0">
                <Clock className="w-3 h-3" />
                <span>{getTimeAgo(loker.published_at)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Chevron (Right aligned) */}
      <div className="flex-shrink-0 self-center hidden sm:flex">
        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
      </div>
    </Link>
  )
}

// ==========================================
// NEW DESIGN COMPONENTS (User Selected)
// ==========================================

// 1. Lowongan Hari Ini - Variant 2 (Modern Glass / Full Poster)
function LokerCardGlass({ loker, priority = false, matchScore }: { loker: Loker; priority?: boolean; matchScore?: number }) {
  const [isBookmarked, setIsBookmarked] = useState(loker.is_bookmarked || false)

  return (
    <div className="relative h-[320px] w-full rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-all duration-300">
      <Link href={`/vip/loker/${loker.id}`} className="block w-full h-full">
        {/* Full Image Background */}
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800">
          {loker.poster_url ? (
            <OptimizedPosterImage
              src={loker.poster_url}
              alt={loker.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 640px) 280px, 320px"
              priority={priority}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
              <Briefcase className="w-12 h-12 text-blue-300 dark:text-blue-700" />
            </div>
          )}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
          {loker.kategori && loker.kategori[0] && (
            <Badge className="bg-white/20 backdrop-blur-md text-white border-0 text-[10px] shadow-sm hover:bg-white/30">
              {loker.kategori[0]}
            </Badge>
          )}
        </div>

        {/* Bottom Glass Panel Content */}
        <div className="absolute bottom-3 left-3 right-3 z-10">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 text-white shadow-lg group-hover:bg-white/15 transition-colors">
            <h3 className="font-bold text-base mb-1 leading-tight line-clamp-2 drop-shadow-sm">{loker.title}</h3>
            <p className="text-xs text-gray-200 mb-2 truncate font-medium opacity-90">{loker.perusahaan_name}</p>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
              <span className="text-[10px] bg-white/20 px-2 py-1 rounded-md backdrop-blur-sm truncate max-w-[120px]">
                {loker.lokasi?.split(',')[0]}
              </span>

              {/* Action Button (Fake/Visual) */}
              <div className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center transform group-hover:translate-x-1 transition-transform">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Bookmark Button (Outside Link to avoid nested interactivity issues, positioned absolutely) */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsBookmarked(!isBookmarked)
        }}
        className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/20 hover:bg-white hover:text-red-500 text-white backdrop-blur-md transition-all group-hover:scale-110"
      >
        <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-red-500 text-red-500' : ''}`} />
      </button>
    </div>
  )
}

// 2. Rekomendasi Match - Variant 4 (Corner Curve Aesthetic)
function LokerCardMatch({ loker, priority = false, matchScore }: { loker: Loker; priority?: boolean; matchScore?: number }) {
  return (
    <Link href={`/vip/loker/${loker.id}`} className="block group relative h-[280px] w-full rounded-2xl overflow-hidden bg-black shadow-sm hover:shadow-xl transition-all duration-300 ring-1 ring-gray-200 dark:ring-gray-800 hover:ring-green-500/50">
      {/* Full Background Image */}
      <div className="absolute inset-0">
        {loker.poster_url ? (
          <OptimizedPosterImage
            src={loker.poster_url}
            alt={loker.title}
            fill
            className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <Target className="w-12 h-12 text-gray-600" />
          </div>
        )}
      </div>

      {/* Gradient Gradient for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

      {/* Content Area */}
      <div className="absolute bottom-4 left-4 right-4 mb-2 z-10 pr-16">
        <h3 className="text-white font-bold text-sm sm:text-base leading-snug line-clamp-2 mb-1 group-hover:text-green-300 transition-colors drop-shadow-md">
          {loker.title}
        </h3>
        <p className="text-xs text-gray-300 truncate font-medium">{loker.perusahaan_name}</p>
      </div>

      {/* Unique Bottom Right Corner Score */}
      <div className="absolute bottom-0 right-0 z-20">
        <div className="bg-white dark:bg-gray-950 rounded-tl-2xl pl-1.5 pt-1.5 shadow-[-5px_-5px_15px_rgba(0,0,0,0.2)]">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl px-3 py-2 flex flex-col items-center justify-center min-w-[55px] min-h-[50px] shadow-inner">
            <span className="text-[9px] text-green-100 font-bold uppercase tracking-wider leading-none mb-0.5">Match</span>
            <span className="text-lg font-black text-white leading-none">{matchScore || 0}%</span>
          </div>
        </div>
      </div>

      {/* Optional "Featured" Badge Top Left */}
      {loker.is_featured && (
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-yellow-500 text-black border-0 text-[10px] font-bold shadow-lg">Featured</Badge>
        </div>
      )}
    </Link>
  )
}

// 3. Terakhir Dilihat - Variant 1 (Mini Story / Vertical)
function LokerCardStory({ loker, matchScore }: { loker: Loker; matchScore?: number }) {
  return (
    <Link href={`/vip/loker/${loker.id}`} className="block group relative rounded-xl overflow-hidden aspect-[4/5] cursor-pointer shadow-sm hover:shadow-md transition-all sm:aspect-auto sm:h-[100px] sm:flex sm:flex-row sm:bg-white sm:dark:bg-gray-900 sm:border sm:border-gray-100 sm:dark:border-gray-800 sm:p-2 sm:items-center sm:gap-3">

      {/* Mobile: Full Poster Layout */}
      <div className="sm:hidden absolute inset-0">
        {loker.poster_url ? (
          <OptimizedPosterImage
            src={loker.poster_url}
            alt={loker.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="120px"
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center"><Clock className="text-gray-600" /></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/90" />
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
          <div className="w-6 h-0.5 bg-blue-500 rounded-full mb-1.5"></div>
          <h4 className="font-bold text-xs leading-tight mb-0.5 line-clamp-2">{loker.title}</h4>
          <p className="text-[9px] text-gray-300 truncate">{loker.perusahaan_name}</p>
        </div>
      </div>

      {/* Desktop: Mini List Layout (Keeping original sidebar list layout for desktop but refined) */}
      <div className="hidden sm:block w-14 h-14 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden relative flex-shrink-0 group-hover:ring-2 ring-blue-500/20 transition-all">
        {loker.poster_url ? (
          <OptimizedPosterImage src={loker.poster_url} alt={loker.title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">
            {loker.perusahaan_name.charAt(0)}
          </div>
        )}
      </div>
      <div className="hidden sm:block flex-1 min-w-0">
        <h4 className="text-xs font-bold line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {loker.title}
        </h4>
        <p className="text-[10px] text-gray-500 truncate">{loker.perusahaan_name}</p>
        {/* Minimalist Match Indicator for Sidebar */}
        {matchScore !== undefined && matchScore > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <div className="h-1 flex-1 bg-gray-100 rounded-full overflow-hidden max-w-[60px]">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${matchScore}%` }} />
            </div>
            <span className="text-[9px] font-medium text-green-600">{matchScore}%</span>
          </div>
        )}
      </div>

      {/* Mobile External Link Icon */}
      <div className="sm:hidden absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <ExternalLink className="w-3.5 h-3.5 text-white drop-shadow-md" />
      </div>
    </Link>
  )
}
