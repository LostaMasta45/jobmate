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
  Bookmark,
  TrendingUp,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Loker } from '@/types/vip'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

interface JobCardModernProps {
  loker: Loker
  onBookmark?: (id: string) => void
  onShare?: (loker: Loker) => void
}

// Colorful company logo backgrounds
const logoBackgrounds = [
  'bg-gradient-to-br from-blue-500 to-blue-600',
  'bg-gradient-to-br from-purple-500 to-purple-600',
  'bg-gradient-to-br from-pink-500 to-pink-600',
  'bg-gradient-to-br from-yellow-500 to-yellow-600',
  'bg-gradient-to-br from-green-500 to-green-600',
  'bg-gradient-to-br from-red-500 to-red-600',
  'bg-gradient-to-br from-indigo-500 to-indigo-600',
  'bg-gradient-to-br from-teal-500 to-teal-600',
]

export function JobCardModern({ loker, onBookmark, onShare }: JobCardModernProps) {
  const [isBookmarked, setIsBookmarked] = useState(loker.is_bookmarked || false)
  const [dragX, setDragX] = useState(0)

  // Get random colorful background based on company ID
  const logoColorIndex = loker.perusahaan_id 
    ? parseInt(loker.perusahaan_id.slice(-1), 16) % logoBackgrounds.length 
    : 0
  const logoBackground = logoBackgrounds[logoColorIndex]

  const formatSalary = (gaji_text?: string, gaji_min?: number, gaji_max?: number) => {
    if (gaji_text) return gaji_text
    if (gaji_min && gaji_max) {
      return `$${(gaji_min / 1000000).toFixed(0)}k - $${(gaji_max / 1000000).toFixed(0)}k`
    }
    if (gaji_min) {
      return `$${(gaji_min / 1000000).toFixed(0)}k+`
    }
    return 'Negotiable'
  }

  const getTimeAgo = (date?: string) => {
    if (!date) return ''
    try {
      const time = formatDistanceToNow(new Date(date), {
        addSuffix: false,
        locale: idLocale
      })
      return time.replace('sekitar ', '').replace(' yang lalu', '')
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
      onShare?.(loker)
    } else if (info.offset.x < -swipeThreshold) {
      // Swipe left = Bookmark
      setIsBookmarked(!isBookmarked)
      onBookmark?.(loker.id)
    }
    setDragX(0)
  }

  const getSwipeColor = () => {
    if (dragX > 50) return 'from-blue-500/20 to-transparent'
    if (dragX < -50) return 'from-red-500/20 to-transparent'
    return 'from-transparent to-transparent'
  }

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Swipe Background Indicator */}
      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${getSwipeColor()} transition-all duration-200 pointer-events-none`} />

      {/* Main Card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDrag={(_, info) => setDragX(info.offset.x)}
        onDragEnd={handleDragEnd}
        whileTap={{ scale: 0.98 }}
        className="relative bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800"
      >
        {/* Card Content */}
        <Link href={`/vip/loker/${loker.id}`} className="block p-5">
          {/* Header: Company Logo + Info */}
          <div className="flex items-start gap-4 mb-4">
            {/* Colorful Company Logo */}
            <div className={`flex-shrink-0 w-14 h-14 rounded-2xl ${logoBackground} p-0.5 shadow-lg`}>
              <div className="w-full h-full rounded-[14px] bg-white dark:bg-gray-900 p-2 flex items-center justify-center">
                {loker.perusahaan?.logo_url ? (
                  <Image
                    src={loker.perusahaan.logo_url}
                    alt={loker.perusahaan_name}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                ) : (
                  <Building2 className="w-6 h-6 text-gray-400" />
                )}
              </div>
            </div>

            {/* Job Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 mb-1">
                {loker.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1.5 mb-2">
                <Building2 className="w-3.5 h-3.5" />
                {loker.perusahaan_name}
              </p>
              
              {/* Quick Badges */}
              <div className="flex flex-wrap gap-1.5">
                {loker.tipe_pekerjaan && (
                  <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-0">
                    <Briefcase className="w-3 h-3 mr-1" />
                    {loker.tipe_pekerjaan}
                  </Badge>
                )}
                {loker.lokasi && (
                  <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 border-0">
                    <MapPin className="w-3 h-3 mr-1" />
                    {loker.lokasi}
                  </Badge>
                )}
                {isNew && (
                  <Badge className="text-xs px-2 py-0.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                    Baru!
                  </Badge>
                )}
              </div>
            </div>

            {/* Bookmark Button */}
            <button
              onClick={(e) => {
                e.preventDefault()
                setIsBookmarked(!isBookmarked)
                onBookmark?.(loker.id)
              }}
              className="flex-shrink-0 w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95 transition-all"
            >
              <Bookmark
                className={`w-4.5 h-4.5 transition-colors ${
                  isBookmarked
                    ? 'fill-blue-500 text-blue-500'
                    : 'text-gray-400'
                }`}
              />
            </button>
          </div>

          {/* Salary + Meta Info */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
            {/* Salary - PROMINENT */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Salary</p>
                <p className="text-base font-bold text-gray-900 dark:text-white">
                  {formatSalary(loker.gaji_text, loker.gaji_min, loker.gaji_max)}
                </p>
              </div>
            </div>

            {/* Meta Info */}
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              {loker.published_at && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {getTimeAgo(loker.published_at)}
                </div>
              )}
              {loker.view_count && loker.view_count > 0 && (
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {loker.view_count}
                </div>
              )}
            </div>
          </div>

          {/* Featured Badge Ribbon */}
          {loker.is_featured && (
            <div className="absolute top-0 right-0">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-bl-2xl rounded-tr-3xl shadow-lg">
                ⭐ Featured
              </div>
            </div>
          )}
        </Link>
      </motion.div>
    </motion.div>
  )
}
