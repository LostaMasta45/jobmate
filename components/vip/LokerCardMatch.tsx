'use client'

import Link from 'next/link'
import { Target } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { OptimizedPosterImage } from '@/components/vip/OptimizedPosterImage'
import type { Loker } from '@/types/vip'

interface LokerCardMatchProps {
    loker: Loker
    priority?: boolean
    matchScore?: number
}

// 2. Rekomendasi Match - Variant 4 (Corner Curve Aesthetic)
export function LokerCardMatch({ loker, priority = false, matchScore }: LokerCardMatchProps) {
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
