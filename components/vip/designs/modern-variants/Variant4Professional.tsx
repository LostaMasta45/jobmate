'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Building2, CheckCircle2 } from 'lucide-react'
import type { Loker } from '@/types/vip'

interface VariantProps {
    loker: Loker
}

export function Variant4Professional({ loker }: VariantProps) {
    return (
        <Link href={`/vip/loker/${loker.id}`} className="group block mb-3">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-3.5 shadow-sm border border-gray-200 dark:border-gray-800 hover:border-blue-500 transition-colors flex gap-4 items-start">

                {/* Poster / Thumbnail - Rectangle 4:3 */}
                <div className="w-28 aspect-[4/3] flex-shrink-0 rounded-md overflow-hidden relative bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                    {loker.poster_url ? (
                        <Image
                            src={loker.poster_url}
                            alt={loker.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Building2 className="w-8 h-8" />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between h-full pt-0.5">
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg leading-snug mb-1 group-hover:text-blue-700 transition-colors line-clamp-2">
                            {loker.title}
                        </h3>

                        <div className="flex items-center gap-1.5 mb-2">
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate">
                                {loker.perusahaan_name}
                            </p>
                            {/* Verified Badge Simulation */}
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-50" />
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-auto">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                            <MapPin className="w-3 h-3 mr-1" /> {loker.lokasi}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                            {loker.tipe_pekerjaan}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    )
}
