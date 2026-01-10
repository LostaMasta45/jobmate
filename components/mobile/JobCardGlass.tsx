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
    Sparkles,
    Zap,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Loker } from '@/types/vip'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

interface JobCardGlassProps {
    loker: Loker
    variant?: 'default' | 'compact' | 'match'
    matchScore?: number
    onBookmark?: (id: string) => void
    onShare?: (loker: Loker) => void
}

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

export function JobCardGlass({
    loker,
    variant = 'default',
    matchScore = 95,
    onBookmark,
    onShare
}: JobCardGlassProps) {
    const [isBookmarked, setIsBookmarked] = useState(loker.is_bookmarked || false)
    const [dragX, setDragX] = useState(0)

    // Consistent background based on company ID
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
            onShare?.(loker)
        } else if (info.offset.x < -swipeThreshold) {
            setIsBookmarked(!isBookmarked)
            onBookmark?.(loker.id)
        }
        setDragX(0)
    }

    const getSwipeColor = () => {
        if (dragX > 50) return 'from-blue-500/20 to-transparent'
        if (dragX < -50) return 'from-pink-500/20 to-transparent'
        return 'from-transparent to-transparent'
    }

    return (
        <motion.div
            className="relative h-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Swipe Overlay */}
            <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${getSwipeColor()} transition-all duration-200 pointer-events-none z-10`} />

            <motion.div
                drag={variant === 'default' ? "x" : false} // Disable drag on carousels to prevent conflict
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDrag={(_, info) => setDragX(info.offset.x)}
                onDragEnd={handleDragEnd}
                whileTap={{ scale: 0.98 }}
                className={`
          relative h-full bg-white/70 dark:bg-black/40 backdrop-blur-xl 
          rounded-[2rem] overflow-hidden 
          border border-white/40 dark:border-white/10
          shadow-lg hover:shadow-xl dark:shadow-black/20
          transition-all duration-300
          ${variant === 'compact' ? 'p-3' : 'p-5'}
        `}
            >
                <Link href={`/vip/loker/${loker.id}`} className="block h-full">

                    {/* Match Score Badge - Only for 'match' variant */}
                    {variant === 'match' && (
                        <div className="absolute top-0 right-0 z-20">
                            <div className="bg-[#00acc7] text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-[1.5rem] rounded-tr-[1.8rem] shadow-lg flex items-center gap-1">
                                <Sparkles className="w-3 h-3 fill-white/20" />
                                {matchScore}% Cocok
                            </div>
                        </div>
                    )}

                    {/* New Badge - Only for 'compact/today' variant */}
                    {variant === 'compact' && isNew && (
                        <div className="absolute top-0 right-0 z-20">
                            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-[1.5rem] rounded-tr-[1.8rem] shadow-lg flex items-center gap-1">
                                <Zap className="w-3 h-3 fill-white/20" />
                                Baru
                            </div>
                        </div>
                    )}

                    {/* Card Header: Logo & Title */}
                    <div className="flex gap-4 mb-4">
                        {/* Logo */}
                        <div className={`
               flex-shrink-0 rounded-2xl ${logoBackground} p-0.5 shadow-md
               ${variant === 'compact' ? 'w-10 h-10' : 'w-14 h-14'}
             `}>
                            <div className="w-full h-full rounded-[14px] bg-white dark:bg-gray-900 p-1.5 flex items-center justify-center">
                                {loker.perusahaan?.logo_url ? (
                                    <Image
                                        src={loker.perusahaan.logo_url}
                                        alt={loker.perusahaan_name}
                                        width={32}
                                        height={32}
                                        className="object-contain"
                                    />
                                ) : (
                                    <Building2 className="w-5 h-5 text-gray-400" />
                                )}
                            </div>
                        </div>

                        {/* Texts */}
                        <div className="flex-1 min-w-0 pt-0.5">
                            <h3 className={`
                  font-bold text-gray-900 dark:text-white leading-tight mb-1
                  ${variant === 'compact' ? 'text-sm line-clamp-1' : 'text-lg line-clamp-2'}
                `}>
                                {loker.title}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate flex items-center gap-1">
                                <Building2 className="w-3 h-3" />
                                {loker.perusahaan_name}
                            </p>

                            {/* Tags - Only visible on default/match */}
                            {variant !== 'compact' && (
                                <div className="flex flex-wrap gap-1.5 mt-2.5">
                                    {loker.tipe_pekerjaan && (
                                        <Badge variant="secondary" className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border-0 text-[10px] px-2 h-5">
                                            {loker.tipe_pekerjaan}
                                        </Badge>
                                    )}
                                    {loker.lokasi && (
                                        <Badge variant="secondary" className="bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 border-0 text-[10px] px-2 h-5">
                                            {loker.lokasi}
                                        </Badge>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Info: Salary & Time */}
                    <div className={`
             flex items-center justify-between border-t border-gray-100 dark:border-white/5
             ${variant === 'compact' ? 'pt-2' : 'pt-4 mt-auto'}
          `}>
                        <div className="flex items-center gap-2">
                            <div className={`
                   rounded-lg bg-[#00acc7]/10 flex items-center justify-center
                   ${variant === 'compact' ? 'w-6 h-6' : 'w-8 h-8'}
                 `}>
                                <DollarSign className={`text-[#00acc7] ${variant === 'compact' ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
                            </div>
                            <div>
                                {variant !== 'compact' && (
                                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Gaji</p>
                                )}
                                <p className={`font-bold text-gray-900 dark:text-white ${variant === 'compact' ? 'text-xs' : 'text-sm'}`}>
                                    {formatSalary(loker.gaji_text, loker.gaji_min, loker.gaji_max).split(' - ')[0].replace('Rp ', '')}
                                    {/* Simplified Salary display for cleanliness */}
                                    {!loker.gaji_text && '+'}
                                </p>
                            </div>
                        </div>

                        {/* Bookmark / Time Action */}
                        {variant === 'compact' ? (
                            <div className="text-[10px] text-gray-400 font-medium">
                                {getTimeAgo(loker.published_at)}
                            </div>
                        ) : (
                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    setIsBookmarked(!isBookmarked)
                                    onBookmark?.(loker.id)
                                }}
                                className={`
                    w-10 h-10 rounded-full flex items-center justify-center transition-all bg-gray-50 dark:bg-white/5 hover:bg-[#00acc7]/10
                    ${isBookmarked ? 'text-[#00acc7]' : 'text-gray-400'}
                  `}
                            >
                                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                            </button>
                        )}
                    </div>

                </Link>
            </motion.div>
        </motion.div>
    )
}
