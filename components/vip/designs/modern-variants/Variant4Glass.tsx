'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import type { Loker } from '@/types/vip'

interface VariantProps {
    loker: Loker
}

export function Variant4Glass({ loker }: VariantProps) {
    return (
        <Link href={`/vip/loker/${loker.id}`} className="group block">
            <div className="relative rounded-2xl overflow-hidden shadow-lg h-60">
                {/* Background Thumbnail (Blurred) */}
                <div className="absolute inset-0">
                    {loker.poster_url ? (
                        <Image
                            src={loker.poster_url}
                            alt="Background"
                            fill
                            className="object-cover blur-sm scale-110 opacity-80"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600" />
                    )}
                </div>

                {/* Glass Content Box */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/30 dark:bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-xl group-hover:bg-white/40 transition-colors">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-white/90 uppercase mb-1 tracking-wider">
                                {loker.perusahaan_name}
                            </p>
                            <h3 className="font-bold text-white text-lg leading-tight line-clamp-2 mb-1">
                                {loker.title}
                            </h3>
                            <p className="text-xs text-white/80">
                                {loker.lokasi} • {loker.tipe_pekerjaan}
                            </p>
                        </div>
                        <div className="bg-white/20 rounded-full p-1.5 text-white group-hover:bg-white group-hover:text-black transition-colors">
                            <ArrowUpRight className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}
