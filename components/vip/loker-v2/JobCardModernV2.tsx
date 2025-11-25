'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, PanInfo } from 'framer-motion'
import {
  MapPin,
  DollarSign,
  Clock,
  Bookmark,
  Share2,
  Briefcase,
  Building2,
  CheckCircle2,
  Sparkles
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Loker } from '@/types/vip'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

interface JobCardModernV2Props {
  loker: Loker
  onBookmark?: (id: string) => void
  onShare?: (loker: Loker) => void
}

export function JobCardModernV2({ loker, onBookmark, onShare }: JobCardModernV2Props) {
  const [isBookmarked, setIsBookmarked] = useState(loker.is_bookmarked || false)
  const [dragX, setDragX] = useState(0)

  const formatSalary = (gaji_text?: string, gaji_min?: number, gaji_max?: number) => {
    if (gaji_text) return gaji_text
    if (gaji_min && gaji_max) {
      return `Rp ${(gaji_min / 1000000).toFixed(1)} - ${(gaji_max / 1000000).toFixed(1)} Juta`
    }
    if (gaji_min) {
      return `Rp ${(gaji_min / 1000000).toFixed(1)} Juta`
    }
    return 'Gaji Kompetitif'
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
    if (dragX > 50) return 'from-[#00d1dc]/20 to-transparent'
    if (dragX < -50) return 'from-[#8e68fd]/20 to-transparent'
    return 'from-transparent to-transparent'
  }

  return (
    <motion.div
      className="relative mb-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Swipe Indicator */}
      <div className={`absolute inset-0 rounded-[20px] bg-gradient-to-r ${getSwipeColor()} transition-all duration-200 pointer-events-none z-0`} />

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDrag={(_, info) => setDragX(info.offset.x)}
        onDragEnd={handleDragEnd}
        className="relative bg-white dark:bg-slate-900 rounded-[20px] p-4 shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-slate-800 z-10"
      >
        <Link href={`/vip/loker/${loker.id}`} className="block">
          
          {/* Top Row: Logo & Title */}
          <div className="flex gap-3 mb-3">
            {/* Logo - Circle Style */}
            <div className="flex-shrink-0">
              <div className="w-[52px] h-[52px] rounded-full border-[1.5px] border-[#dfdfdf] dark:border-slate-700 p-0.5 bg-white dark:bg-slate-800 shadow-sm">
                <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-white dark:bg-black/20">
                  {loker.perusahaan?.logo_url ? (
                    <Image
                      src={loker.perusahaan.logo_url}
                      alt={loker.perusahaan_name}
                      width={48}
                      height={48}
                      className="object-contain p-1"
                    />
                  ) : (
                    <span className="text-lg font-bold text-gray-400">{loker.perusahaan_name.charAt(0)}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Title & Company */}
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex justify-between items-start">
                <h3 className="text-[15px] font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 pr-6">
                  {loker.title}
                </h3>
                {isNew && (
                  <span className="flex-shrink-0 w-2 h-2 rounded-full bg-[#00d1dc] animate-pulse mt-1.5"></span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1 flex items-center gap-1">
                <span className="truncate max-w-[150px]">{loker.perusahaan_name}</span>
                {loker.is_featured && (
                   <Sparkles className="w-3 h-3 text-[#8e68fd] fill-[#8e68fd]" />
                )}
              </p>
            </div>
          </div>

          {/* Middle Row: Tags & Info */}
          <div className="flex flex-wrap gap-2 mb-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800">
              <MapPin className="w-3 h-3 text-[#00acc7]" />
              <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-300">
                {loker.lokasi?.split(',')[0] || 'Jombang'}
              </span>
            </div>
            
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800">
              <Briefcase className="w-3 h-3 text-[#8e68fd]" />
              <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-300">
                {loker.tipe_pekerjaan || 'Fulltime'}
              </span>
            </div>

            {loker.gaji_min && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#00d1dc]/10 dark:bg-[#00d1dc]/20 border border-[#00d1dc]/20">
                <DollarSign className="w-3 h-3 text-[#00acc7] dark:text-[#00d1dc]" />
                <span className="text-[10px] font-bold text-[#00acc7] dark:text-[#00d1dc]">
                  {formatSalary(undefined, loker.gaji_min, loker.gaji_max).split(' ')[1]}
                </span>
              </div>
            )}
          </div>

          {/* Bottom Row: Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-slate-800/60">
            <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium">
              <Clock className="w-3 h-3" />
              {getTimeAgo(loker.published_at)} yang lalu
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  onShare?.(loker)
                }}
                className="p-1.5 rounded-full text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Share2 className="w-4 h-4 stroke-[1.5]" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  setIsBookmarked(!isBookmarked)
                  onBookmark?.(loker.id)
                }}
                className="p-1.5 rounded-full hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Bookmark 
                  className={`w-4 h-4 stroke-[1.5] transition-colors ${
                    isBookmarked ? 'fill-[#8e68fd] text-[#8e68fd]' : 'text-gray-400'
                  }`} 
                />
              </button>
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  )
}
