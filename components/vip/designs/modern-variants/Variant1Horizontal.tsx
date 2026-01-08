'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Briefcase } from 'lucide-react'
import type { Loker } from '@/types/vip'

interface VariantProps {
    loker: Loker
}

export function Variant1Horizontal({ loker }: VariantProps) {
    return (
        <Link href={`/vip/loker/${loker.id}`} className="group block mb-3">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4 hover:border-blue-500/30 transition-all">

                {/* Square Thumbnail */}
                <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden relative bg-gray-100 dark:bg-gray-800">
                    {loker.poster_url ? (
                        <Image
                            src={loker.poster_url}
                            alt={loker.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                            No Image
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 py-1">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg leading-tight mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {loker.title}
                    </h3>

                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 truncate">
                        {loker.perusahaan_name}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
                            <MapPin className="w-3 h-3" /> {loker.lokasi}
                        </span>
                        <span className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
                            <Briefcase className="w-3 h-3" /> {loker.tipe_pekerjaan}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    )
}
