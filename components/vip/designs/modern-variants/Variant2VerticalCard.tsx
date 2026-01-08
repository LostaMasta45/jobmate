'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin } from 'lucide-react'
import type { Loker } from '@/types/vip'

interface VariantProps {
    loker: Loker
}

export function Variant2VerticalCard({ loker }: VariantProps) {
    return (
        <Link href={`/vip/loker/${loker.id}`} className="group block h-full">
            <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">

                {/* Full Width Thumbnail */}
                <div className="w-full aspect-video relative bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    {loker.poster_url ? (
                        <Image
                            src={loker.poster_url}
                            alt={loker.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                    )}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm">
                        {loker.tipe_pekerjaan}
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg leading-tight mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {loker.title}
                    </h3>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-3 truncate">
                        {loker.perusahaan_name}
                    </p>

                    <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1 truncate max-w-[60%]">
                            <MapPin className="w-3 h-3" /> {loker.lokasi}
                        </span>
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                            {loker.gaji_min ? `${(loker.gaji_min / 1000000).toFixed(1)} jt` : 'Negosiasi'}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    )
}
