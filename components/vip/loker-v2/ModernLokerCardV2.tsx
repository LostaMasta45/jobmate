'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Clock, Briefcase, DollarSign, Bookmark, BookmarkCheck, Share2, ChevronRight } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import type { Loker } from '@/types/vip'

interface ModernLokerCardV2Props {
  loker: Loker
  onBookmark?: (id: string) => void
  onShare?: (loker: Loker) => void
}

export function ModernLokerCardV2({ loker, onBookmark, onShare }: ModernLokerCardV2Props) {
  const [isBookmarked, setIsBookmarked] = useState(loker.is_bookmarked || false)

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsBookmarked(!isBookmarked)
    onBookmark?.(loker.id)
  }

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onShare?.(loker)
  }

  // Format salary range
  const formatSalary = () => {
    if (loker.gaji_min && loker.gaji_max) {
      if (loker.gaji_min === loker.gaji_max) {
        return `Rp ${(loker.gaji_min / 1000000).toFixed(1)} Juta`
      }
      return `Rp ${(loker.gaji_min / 1000000).toFixed(1)} - ${(loker.gaji_max / 1000000).toFixed(1)} Juta`
    }
    return loker.gaji_min ? `Mulai Rp ${(loker.gaji_min / 1000000).toFixed(1)} Juta` : 'Gaji Kompetitif'
  }

  // Calculate time ago
  const timeAgo = loker.published_at 
    ? formatDistanceToNow(new Date(loker.published_at), { addSuffix: true, locale: id }).replace('sekitar ', '')
    : 'Baru saja'

  // Get primary tag (Fulltime, Contract, etc)
  const jobType = loker.tipe_pekerjaan || 'Fulltime'
  
  // Extract first location city
  const locationCity = loker.lokasi?.split(',')[0] || 'Jombang'

  return (
    <Link href={`/vip/loker/${loker.id}`} className="block group">
      <div className="bg-white dark:bg-slate-900 rounded-[24px] p-5 border-l-4 border-l-[#8e68fd] border-y border-r border-gray-100 dark:border-slate-800/60 hover:border-indigo-500/20 dark:hover:border-indigo-500/30 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] dark:shadow-none dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.2)] transition-all duration-300 relative overflow-hidden">
        
        {/* Featured/New Badge - Pulse Dot */}
        {loker.is_featured && (
          <div className="absolute top-5 right-5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8e68fd] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#8e68fd]"></span>
            </span>
          </div>
        )}

        <div className="flex items-start gap-4">
          {/* Company Logo - Modern Squircle */}
          <div className="flex-shrink-0 relative">
            <div className="w-[60px] h-[60px] rounded-full border border-[#dfdfdf] dark:border-slate-800 bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-300">
              {loker.perusahaan_logo ? (
                <img 
                  src={loker.perusahaan_logo} 
                  alt={loker.perusahaan_name} 
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center text-gray-400 dark:text-gray-500 font-bold text-xl">
                  {loker.perusahaan_name.charAt(0)}
                </div>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0 pt-0.5">
            {/* Title & Bookmark */}
            <div className="flex justify-between items-start gap-3 mb-1">
              <h3 className="text-[17px] font-bold text-gray-900 dark:text-white leading-tight line-clamp-2 group-hover:text-[#8e68fd] dark:group-hover:text-[#8e68fd] transition-colors tracking-tight">
                {loker.title}
              </h3>
              
              {/* Mobile Bookmark */}
              <button 
                onClick={handleBookmarkClick}
                className="text-gray-300 hover:text-[#8e68fd] transition-colors -mt-1 -mr-1 sm:hidden p-1 active:scale-95"
              >
                {isBookmarked ? (
                  <BookmarkCheck className="w-5 h-5 text-[#8e68fd] fill-[#8e68fd]" />
                ) : (
                  <Bookmark className="w-5 h-5 stroke-[1.5]" />
                )}
              </button>
            </div>

            {/* Company & Location */}
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1.5 truncate">
                {loker.perusahaan_name}
              </p>
              <div className="flex items-center text-xs text-gray-400 dark:text-gray-500 font-medium gap-3">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 stroke-[2] text-[#00acc7] fill-[#00acc7]/10" />
                  {locationCity}
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 stroke-[2] text-[#8e68fd]" />
                  {timeAgo}
                </span>
              </div>
            </div>

            {/* Minimalist Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-50 dark:bg-slate-800/80 text-gray-600 dark:text-gray-300 text-[11px] font-bold tracking-wide border border-[#dfdfdf] dark:border-slate-800">
                {jobType}
              </div>
              
              {loker.tipe_pekerjaan?.includes('Remote') && (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#00d1dc]/10 text-[#00acc7] dark:text-[#00d1dc] text-[11px] font-bold tracking-wide border border-[#00d1dc]/20">
                  Remote
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-slate-800/50">
              <div className="flex items-center text-gray-900 dark:text-white font-extrabold text-sm">
                <DollarSign className="w-4 h-4 text-[#00acc7] mr-0.5 stroke-[2.5]" />
                {formatSalary()}
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={handleShareClick}
                  className="p-2 rounded-full hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <Share2 className="w-4 h-4 stroke-[2]" />
                </button>

                <button 
                  onClick={handleBookmarkClick}
                  className="hidden sm:block p-2 rounded-full hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-400 hover:text-[#8e68fd] transition-colors"
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="w-4 h-4 text-[#8e68fd] fill-[#8e68fd]" />
                  ) : (
                    <Bookmark className="w-4 h-4 stroke-[2]" />
                  )}
                </button>

                <div className="w-8 h-8 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center text-white dark:text-gray-900 group-hover:scale-110 transition-transform shadow-sm group-hover:bg-[#8e68fd] dark:group-hover:bg-[#8e68fd] group-hover:text-white dark:group-hover:text-white">
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
