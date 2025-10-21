'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Clock, DollarSign, Heart, TrendingUp, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Loker } from '@/types/vip'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { useState } from 'react'

interface ModernLokerCardProps {
  loker: Loker
}

export function ModernLokerCard({ loker }: ModernLokerCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(loker.is_bookmarked || false)
  const [isHovered, setIsHovered] = useState(false)

  const formatSalary = (gaji_text?: string, gaji_min?: number, gaji_max?: number) => {
    if (gaji_text) return gaji_text
    if (gaji_min && gaji_max) {
      return `${(gaji_min / 1000000).toFixed(0)}-${(gaji_max / 1000000).toFixed(0)}jt`
    }
    if (gaji_min) {
      return `${(gaji_min / 1000000).toFixed(0)}jt+`
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

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsBookmarked(!isBookmarked)
    // TODO: Call API
  }

  const isNew = loker.published_at && 
    (Date.now() - new Date(loker.published_at).getTime()) < 24 * 60 * 60 * 1000

  const isTrending = (loker.view_count || 0) > 50

  return (
    <Link 
      href={`/vip/loker/${loker.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group block"
    >
      <div className={`relative bg-white dark:bg-gray-800 rounded-3xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-500 ${
        isHovered 
          ? 'shadow-2xl scale-105 -translate-y-2 border-cyan-500 dark:border-cyan-400' 
          : 'shadow-md hover:shadow-xl'
      }`}>
        {/* Gradient Accent Bar */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r transition-all duration-500 ${
          isHovered
            ? 'from-cyan-500 via-teal-500 to-emerald-500'
            : 'from-gray-300 to-gray-300 dark:from-gray-700 dark:to-gray-700'
        }`} />

        {/* Badges Row */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          {isNew && (
            <Badge className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white border-0 shadow-lg animate-pulse">
              <Zap className="w-3 h-3 mr-1" />
              Baru
            </Badge>
          )}
          {isTrending && (
            <Badge className="bg-gradient-to-r from-orange-500 to-rose-500 text-white border-0 shadow-lg">
              <TrendingUp className="w-3 h-3 mr-1" />
              Hot
            </Badge>
          )}
          {loker.is_featured && (
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg">
              ⭐ Featured
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Company Logo & Info */}
          <div className="flex items-start gap-4 mb-4">
            {/* Logo with Depth Effect */}
            <div className="relative flex-shrink-0">
              <div className={`w-16 h-16 rounded-2xl transition-all duration-500 ${
                isHovered ? 'shadow-2xl scale-110 rotate-6' : 'shadow-lg'
              }`}>
                {loker.perusahaan?.logo_url ? (
                  <Image
                    src={loker.perusahaan.logo_url}
                    alt={loker.perusahaan_name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-400">
                      {loker.perusahaan_name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Title & Company */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-xl mb-1 line-clamp-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                {loker.title}
              </h3>
              <p className="text-sm text-muted-foreground font-medium">
                {loker.perusahaan_name}
              </p>
            </div>

            {/* Bookmark Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBookmarkClick}
              className={`flex-shrink-0 rounded-2xl transition-all ${
                isBookmarked ? 'text-red-500 bg-red-50 dark:bg-red-950' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Heart className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
            </Button>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Location */}
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-xl bg-cyan-50 dark:bg-cyan-950 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              </div>
              <span className="truncate font-medium">{loker.lokasi}</span>
            </div>

            {/* Salary */}
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-xl bg-green-50 dark:bg-green-950 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <span className="truncate font-bold text-green-600 dark:text-green-400">
                Rp {formatSalary(loker.gaji_text, loker.gaji_min, loker.gaji_max)}
              </span>
            </div>
          </div>

          {/* Category Tags */}
          {loker.kategori && loker.kategori.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {loker.kategori.slice(0, 3).map((kat) => (
                <Badge 
                  key={kat} 
                  variant="outline" 
                  className="rounded-xl border-2 border-gray-200 dark:border-gray-800 hover:border-cyan-500 dark:hover:border-cyan-400 transition-colors"
                >
                  {kat}
                </Badge>
              ))}
              {loker.kategori.length > 3 && (
                <Badge variant="outline" className="rounded-xl">
                  +{loker.kategori.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100 dark:border-gray-800">
            {/* Time */}
            {loker.published_at && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                {getTimeAgo(loker.published_at)}
              </div>
            )}

            {/* CTA */}
            <div className={`text-sm font-semibold transition-all duration-300 ${
              isHovered 
                ? 'text-cyan-600 dark:text-cyan-400 translate-x-1' 
                : 'text-muted-foreground'
            }`}>
              Lihat Detail →
            </div>
          </div>
        </div>

        {/* Hover Glow Effect */}
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-teal-500/5 pointer-events-none" />
        )}
      </div>
    </Link>
  )
}
