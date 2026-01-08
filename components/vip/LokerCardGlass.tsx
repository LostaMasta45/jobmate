'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Briefcase, ChevronRight, Heart } from 'lucide-react'
import { OptimizedPosterImage } from '@/components/vip/OptimizedPosterImage'
import type { Loker } from '@/types/vip'

interface LokerCardGlassProps {
    loker: Loker
    priority?: boolean
    matchScore?: number
}

export function LokerCardGlass({ loker, priority = false, matchScore }: LokerCardGlassProps) {
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
