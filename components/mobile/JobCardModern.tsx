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

// Consistent purple/cyan theme for all company logos
const logoBackgrounds = [
  'bg-gradient-to-br from-[#8e68fd] to-[#5547d0]',
  'bg-gradient-to-br from-[#5547d0] to-[#3977d3]',
  'bg-gradient-to-br from-[#3977d3] to-[#00acc7]',
  'bg-gradient-to-br from-[#00acc7] to-[#00bed1]',
  'bg-gradient-to-br from-[#00bed1] to-[#00d1dc]',
  'bg-gradient-to-br from-[#00d1dc] to-[#00acc7]',
  'bg-gradient-to-br from-[#8e68fd] to-[#00d1dc]',
  'bg-gradient-to-br from-[#5547d0] to-[#00bed1]',
]

export function JobCardModern({ loker, onBookmark, onShare }: JobCardModernProps) {
  const [isBookmarked, setIsBookmarked] = useState(loker.is_bookmarked || false)
  const [dragX, setDragX] = useState(0)

  // Get consistent emerald/teal background based on company ID
  const logoColorIndex = loker.perusahaan_id 
    ? parseInt(loker.perusahaan_id.slice(-1), 16) % logoBackgrounds.length 
    : 0
  const logoBackground = logoBackgrounds[logoColorIndex]

  const formatSalary = (gaji_text?: string, gaji_min?: number, gaji_max?: number) => {
    if (gaji_text) return gaji_text
    if (gaji_min && gaji_max) {
      return `Rp ${(gaji_min / 1000000).toFixed(1)}jt - ${(gaji_max / 1000000).toFixed(1)}jt`
    }
    if (gaji_min) {
      return `Rp ${(gaji_min / 1000000).toFixed(1)}jt+`
    }
    return 'Tidak disebutkan'
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
        <Link href={`/vip/loker/${loker.id}`} className="block p-4">
          {/* Poster Thumbnail - If available */}
          {loker.poster_url && (
            <div className="mb-3.5 -mx-4 -mt-4 rounded-t-3xl overflow-hidden">
              <div className="relative w-full h-36">
                <Image
                  src={loker.poster_url}
                  alt={`Poster ${loker.title}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            </div>
          )}

          {/* Header: Company Logo + Info */}
          <div className="flex items-start gap-3 mb-3.5">
            {/* Consistent Emerald/Teal Company Logo */}
            <div className={`flex-shrink-0 w-12 h-12 rounded-2xl ${logoBackground} p-0.5 shadow-md`}>
              <div className="w-full h-full rounded-[14px] bg-white dark:bg-gray-900 p-1.5 flex items-center justify-center">
                {loker.perusahaan?.logo_url ? (
                  <Image
                    src={loker.perusahaan.logo_url}
                    alt={loker.perusahaan_name}
                    width={36}
                    height={36}
                    className="object-contain"
                  />
                ) : (
                  <Building2 className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>

            {/* Job Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-1 mb-1.5 leading-tight">
                {loker.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1.5 mb-2.5 font-medium">
                <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{loker.perusahaan_name}</span>
              </p>
              
              {/* Quick Badges */}
              <div className="flex flex-wrap gap-1.5">
                {loker.tipe_pekerjaan && (
                  <Badge variant="secondary" className="text-[11px] px-2 py-0.5 bg-[#3977d3]/10 dark:bg-[#3977d3]/20 text-[#3977d3] dark:text-[#3977d3] border-0 font-medium">
                    <Briefcase className="w-3 h-3 mr-1" />
                    {loker.tipe_pekerjaan}
                  </Badge>
                )}
                {loker.lokasi && (
                  <Badge variant="secondary" className="text-[11px] px-2 py-0.5 bg-[#8e68fd]/10 dark:bg-[#5547d0]/20 text-[#5547d0] dark:text-[#8e68fd] border-0 font-medium">
                    <MapPin className="w-3 h-3 mr-1" />
                    {loker.lokasi}
                  </Badge>
                )}
                {isNew && (
                  <Badge className="text-[11px] px-2 py-0.5 bg-gradient-to-r from-[#00d1dc] to-[#00acc7] text-white border-0 font-semibold">
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
              className="flex-shrink-0 w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95 transition-all"
            >
              <Bookmark
                className={`w-4 h-4 transition-colors ${
                  isBookmarked
                    ? 'fill-blue-500 text-blue-500'
                    : 'text-gray-400'
                }`}
              />
            </button>
          </div>

          {/* Salary + Meta Info */}
          <div className="flex items-center justify-between pt-3.5 border-t border-gray-100 dark:border-gray-800">
            {/* Salary - PROMINENT */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00d1dc] to-[#00acc7] flex items-center justify-center shadow-md shadow-[#00d1dc]/20">
                <DollarSign className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium mb-0.5">Gaji</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                  {formatSalary(loker.gaji_text, loker.gaji_min, loker.gaji_max)}
                </p>
              </div>
            </div>

            {/* Meta Info */}
            <div className="flex items-center gap-2.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
              {loker.published_at && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{getTimeAgo(loker.published_at)}</span>
                </div>
              )}
              {loker.view_count && loker.view_count > 0 && (
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{loker.view_count}</span>
                </div>
              )}
            </div>
          </div>

          {/* Featured Badge Ribbon */}
          {loker.is_featured && (
            <div className="absolute top-0 right-0">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-bl-2xl rounded-tr-3xl shadow-md">
                ⭐ Unggulan
              </div>
            </div>
          )}
        </Link>
      </motion.div>
    </motion.div>
  )
}
