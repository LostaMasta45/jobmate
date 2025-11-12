'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, PanInfo } from 'framer-motion'
import {
  MapPin,
  DollarSign,
  Clock,
  Heart,
  Share2,
  Briefcase,
  Building2,
  Eye,
  Calendar,
  Zap
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Loker } from '@/types/vip'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

interface JobCardMobileProps {
  loker: Loker
  onBookmark?: (id: string) => void
  onShare?: (loker: Loker) => void
}

export function JobCardMobile({ loker, onBookmark, onShare }: JobCardMobileProps) {
  const [isBookmarked, setIsBookmarked] = useState(loker.is_bookmarked || false)
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null)

  const formatSalary = (gaji_text?: string, gaji_min?: number, gaji_max?: number) => {
    if (gaji_text) return gaji_text
    if (gaji_min && gaji_max) {
      return `Rp ${(gaji_min / 1000000).toFixed(1)}-${(gaji_max / 1000000).toFixed(1)}jt`
    }
    if (gaji_min) {
      return `Rp ${(gaji_min / 1000000).toFixed(1)}jt+`
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

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 100
    
    if (info.offset.x > swipeThreshold) {
      // Swipe right = Share
      setSwipeDirection('right')
      setTimeout(() => {
        onShare?.(loker)
        setSwipeDirection(null)
      }, 200)
    } else if (info.offset.x < -swipeThreshold) {
      // Swipe left = Bookmark
      setSwipeDirection('left')
      setTimeout(() => {
        setIsBookmarked(!isBookmarked)
        onBookmark?.(loker.id)
        setSwipeDirection(null)
      }, 200)
    }
  }

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Swipe Action Background */}
      {swipeDirection && (
        <motion.div
          className={`absolute inset-0 rounded-2xl flex items-center justify-${swipeDirection === 'left' ? 'end' : 'start'} px-6 z-0 ${
            swipeDirection === 'left'
              ? 'bg-gradient-to-l from-red-500 to-pink-500'
              : 'bg-gradient-to-r from-blue-500 to-cyan-500'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {swipeDirection === 'left' ? (
            <Heart className="w-8 h-8 text-white fill-white" />
          ) : (
            <Share2 className="w-8 h-8 text-white" />
          )}
        </motion.div>
      )}

      {/* Main Card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        className="relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-800 shadow-sm active:shadow-xl transition-shadow"
      >
        <Link href={`/vip/loker/${loker.id}`} className="block">
          {/* Poster Hero Image */}
          {loker.poster_url && (
            <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
              <Image
                src={loker.poster_url}
                alt={loker.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={false}
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              
              {/* Top Badges */}
              <div className="absolute top-3 right-3 flex gap-2 z-10">
                {loker.is_featured && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 text-xs shadow-lg backdrop-blur-sm">
                    ⭐ Featured
                  </Badge>
                )}
                {isNew && (
                  <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white border-0 text-xs shadow-lg backdrop-blur-sm animate-pulse">
                    <Zap className="w-3 h-3 mr-1" />
                    Baru
                  </Badge>
                )}
              </div>

              {/* Company Logo Overlay (Bottom Left) */}
              {loker.perusahaan?.logo_url && (
                <div className="absolute bottom-3 left-3">
                  <div className="w-14 h-14 rounded-xl bg-white dark:bg-gray-800 p-2 shadow-lg backdrop-blur-sm">
                    <Image
                      src={loker.perusahaan.logo_url}
                      alt={loker.perusahaan_name}
                      width={56}
                      height={56}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Content Section */}
          <div className="p-4 space-y-3">
            {/* Company Name */}
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate font-medium">{loker.perusahaan_name}</span>
            </div>

            {/* Job Title */}
            <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2 leading-tight">
              {loker.title}
            </h3>

            {/* Key Info Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {/* Location */}
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-blue-500" />
                <span className="truncate">{loker.lokasi}</span>
              </div>

              {/* Salary */}
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                <DollarSign className="w-3.5 h-3.5 flex-shrink-0 text-green-500" />
                <span className="truncate font-semibold text-green-600 dark:text-green-400">
                  {formatSalary(loker.gaji_text, loker.gaji_min, loker.gaji_max)}
                </span>
              </div>

              {/* Time */}
              <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{getTimeAgo(loker.published_at)}</span>
              </div>

              {/* Views */}
              {loker.view_count && loker.view_count > 0 && (
                <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                  <Eye className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{loker.view_count} views</span>
                </div>
              )}
            </div>

            {/* Categories */}
            {loker.kategori && loker.kategori.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {loker.kategori.slice(0, 3).map((kat, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="text-xs px-2 py-0.5 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30"
                  >
                    {kat}
                  </Badge>
                ))}
                {loker.kategori.length > 3 && (
                  <Badge
                    variant="outline"
                    className="text-xs px-2 py-0.5 text-gray-600 dark:text-gray-400"
                  >
                    +{loker.kategori.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Bottom Actions Bar */}
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
            {/* Deadline */}
            {loker.deadline && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>Deadline: {new Date(loker.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
              </div>
            )}

            <div className="ml-auto flex items-center gap-2">
              {/* Bookmark Button */}
              <motion.button
                onClick={(e) => {
                  e.preventDefault()
                  setIsBookmarked(!isBookmarked)
                  onBookmark?.(loker.id)
                }}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                  isBookmarked
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}
                whileTap={{ scale: 0.9 }}
              >
                <Heart className={`w-4.5 h-4.5 ${isBookmarked ? 'fill-current' : ''}`} />
              </motion.button>

              {/* Share Button */}
              <motion.button
                onClick={(e) => {
                  e.preventDefault()
                  onShare?.(loker)
                }}
                className="w-9 h-9 rounded-lg flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                whileTap={{ scale: 0.9 }}
              >
                <Share2 className="w-4.5 h-4.5" />
              </motion.button>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Swipe Hint (Show on first few cards) */}
      <motion.div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-400 dark:text-gray-600 whitespace-nowrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        ← Swipe untuk aksi cepat →
      </motion.div>
    </motion.div>
  )
}
