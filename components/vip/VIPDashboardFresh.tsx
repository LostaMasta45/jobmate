'use client'

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
  Bell
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Loker } from '@/types/vip'
import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

interface VIPDashboardFreshProps {
  memberName: string
  memberTier: 'basic' | 'premium'
  membershipExpiry: string | null
  stats: {
    totalLoker: number
    totalPerusahaan: number
    saved: number
    viewedLast7Days: number
  }
  lokerList: Loker[]
}

const LOCATIONS = ['Semua', 'Jombang Kota', 'Sumobito', 'Diwek', 'Mojowarno', 'Ploso']
const CATEGORIES = ['Semua', 'IT', 'Marketing', 'Sales', 'Administrasi', 'F&B', 'Retail']

export function VIPDashboardFresh({
  memberName,
  memberTier,
  membershipExpiry,
  stats,
  lokerList,
}: VIPDashboardFreshProps) {
  const [activeTab, setActiveTab] = useState<'rekomendasi' | 'terbaru'>('rekomendasi')
  const [selectedLocation, setSelectedLocation] = useState('Semua')
  const [selectedCategory, setSelectedCategory] = useState('Semua')

  const isPremium = memberTier === 'premium'

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

  // Filter loker
  const filteredLoker = lokerList.filter((loker) => {
    if (!loker) return false
    
    let matches = true
    
    if (selectedLocation !== 'Semua') {
      matches = matches && loker.lokasi === selectedLocation
    }
    
    if (selectedCategory !== 'Semua') {
      matches = matches && Array.isArray(loker.kategori) && loker.kategori.includes(selectedCategory)
    }
    
    return matches
  })

  return (
    <div className="space-y-6">
      {/* Hero Section - Blue Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 rounded-3xl p-8 text-white shadow-xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }} />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold">
                  Hai, {memberName}! 👋
                </h1>
                <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-3 py-1 text-sm font-medium">
                  {isPremium ? '👑 VIP Premium' : '✨ VIP Basic'}
                </Badge>
              </div>
              <p className="text-white/90 text-sm mb-1">
                Akses penuh ke loker eksklusif Jombang (Rp 10K/bulan)
              </p>
              {membershipExpiry && (
                <p className="text-white/70 text-xs">
                  Aktif sampai {new Date(membershipExpiry).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })} (perpanjang otomatis)
                </p>
              )}
            </div>

            <Button
              asChild
              size="lg"
              className="bg-white text-blue-600 hover:bg-white/95 hover:scale-105 transition-all shadow-lg rounded-xl px-6 font-semibold"
            >
              <Link href="/vip/upgrade" className="gap-2">
                <Crown className="w-4 h-4" />
                Upgrade Premium
              </Link>
            </Button>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              asChild
              size="lg"
              className="bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white rounded-xl justify-center px-6 h-12 font-medium"
              variant="outline"
            >
              <Link href="/vip/loker" className="gap-2">
                <Briefcase className="w-4 h-4" />
                Cari Loker
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              className="bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white rounded-xl justify-center px-6 h-12 font-medium"
              variant="outline"
            >
              <Link href="/vip/perusahaan" className="gap-2">
                <Building2 className="w-4 h-4" />
                Perusahaan
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              className="bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white rounded-xl justify-center px-6 h-12 font-medium"
              variant="outline"
            >
              <Link href="/vip/alerts" className="gap-2">
                <Bell className="w-4 h-4" />
                Alerts
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Loker Aktif</div>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalLoker}</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Perusahaan</div>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalPerusahaan}</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <BookmarkCheck className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Tersimpan</div>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.saved}</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Dilihat (7 Hari)</div>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.viewedLast7Days}</div>
        </div>
      </div>

      {/* Loker Section */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
        {/* Header with Tabs */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Loker Untuk Anda</h2>
          <div className="flex items-center gap-2">
            <Button
              variant={activeTab === 'rekomendasi' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('rekomendasi')}
              className={activeTab === 'rekomendasi' ? 'bg-blue-600 text-white rounded-lg hover:bg-blue-700' : 'rounded-lg text-gray-600 dark:text-gray-400'}
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Rekomendasi
            </Button>
            <Button
              variant={activeTab === 'terbaru' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('terbaru')}
              className={activeTab === 'terbaru' ? 'bg-gray-900 dark:bg-gray-700 text-white rounded-lg' : 'rounded-lg text-gray-600 dark:text-gray-400'}
            >
              Terbaru
            </Button>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="rounded-lg text-gray-900 dark:text-white font-medium hover:bg-gray-900 dark:hover:bg-gray-700 hover:text-white"
            >
              <Link href="/vip/loker">
                Lihat Semua →
              </Link>
            </Button>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="space-y-3 mb-5">
          {/* Lokasi */}
          <div>
            <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Lokasi</div>
            <div className="flex flex-wrap gap-2">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  onClick={() => setSelectedLocation(loc)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedLocation === loc
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Kategori */}
          <div>
            <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Kategori</div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loker Cards */}
        <div className="space-y-4">
          {filteredLoker.slice(0, 9).map((loker) => (
            <LokerCardHorizontal key={loker.id} loker={loker} />
          ))}
        </div>

        {filteredLoker.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            Tidak ada loker dengan filter tersebut
          </div>
        )}
      </div>

      {/* Perusahaan Populer */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Perusahaan Populer</h2>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="rounded-lg text-gray-900 dark:text-white font-medium hover:bg-gray-900 dark:hover:bg-gray-700 hover:text-white"
          >
            <Link href="/vip/perusahaan">
              Lihat Semua →
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { name: 'PT Sukses Manufacturing', count: 12 },
            { name: 'CV Karya Sentosa', count: 8 },
            { name: 'PT Maju Mapan', count: 15 },
            { name: 'CV Jaya Elektronik', count: 5 },
            { name: 'PT Sukses Mandiri', count: 10 },
            { name: 'CV Sejahtera Furniture', count: 7 }
          ].map((company, i) => (
            <div
              key={i}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center hover:shadow-md hover:scale-105 transition-all cursor-pointer border border-gray-100 dark:border-gray-600"
            >
              <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-xs font-semibold text-gray-900 dark:text-white mb-0.5 line-clamp-2">
                {company.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {company.count} loker
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Horizontal Loker Card Component (with poster on left)
function LokerCardHorizontal({ loker }: { loker: Loker }) {
  const isAIParsed = loker.sumber === 'Poster' && loker.poster_url
  
  const formatSalary = (gaji_text?: string, gaji_min?: number, gaji_max?: number) => {
    if (gaji_text) return gaji_text
    if (gaji_min && gaji_max) {
      return `Rp ${(gaji_min / 1000000).toFixed(1)}-${(gaji_max / 1000000).toFixed(1)} jt`
    }
    if (gaji_min) {
      return `Rp ${(gaji_min / 1000000).toFixed(1)} jt+`
    }
    return 'Negotiable'
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

  return (
    <div className="group flex gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition-all">
      {/* Poster/Image on Left */}
      <div className="flex-shrink-0">
        {isAIParsed && loker.poster_url ? (
          <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-600">
            <Image
              src={loker.poster_url}
              alt={loker.title}
              fill
              className="object-cover"
            />
            <Badge className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 text-xs px-2 py-0.5">
              AI Parsed
            </Badge>
          </div>
        ) : (
          <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
            <Briefcase className="w-12 h-12 text-blue-600 dark:text-blue-400 opacity-50" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h3 className="font-bold text-base text-gray-900 dark:text-white line-clamp-1 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {loker.title}
            </h3>

            {/* Company */}
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
              <Building2 className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{loker.perusahaan_name}</span>
            </div>
          </div>

          {/* Featured Badge */}
          {loker.is_featured && (
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 text-xs flex-shrink-0">
              ⭐ Featured
            </Badge>
          )}
        </div>

        {/* Kualifikasi Preview */}
        {loker.kualifikasi && loker.kualifikasi.length > 0 && (
          <ul className="space-y-1 mb-3">
            {loker.kualifikasi.slice(0, 2).map((kual, idx) => (
              <li key={idx} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2">
                <span className="text-blue-500 flex-shrink-0">•</span>
                <span className="line-clamp-1">{kual}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Info & Actions Row */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {loker.lokasi}
            </div>
            <div className="font-semibold text-green-600 dark:text-green-400 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" />
              {formatSalary(loker.gaji_text, loker.gaji_min, loker.gaji_max)}
            </div>
            {loker.kategori && loker.kategori.length > 0 && (
              <Badge variant="outline" className="text-xs border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400">
                {loker.kategori[0]}
              </Badge>
            )}
          </div>

          <Button
            asChild
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex-shrink-0"
          >
            <Link href={`/vip/loker/${loker.id}`}>
              Lihat Detail
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
