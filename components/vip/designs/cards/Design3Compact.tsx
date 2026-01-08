'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Building2, ChevronRight, Clock } from 'lucide-react'
import type { Loker } from '@/types/vip'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

interface DesignProps {
    loker: Loker
}

export function Design3Compact({ loker }: DesignProps) {
    const timeAgo = loker.published_at ? formatDistanceToNow(new Date(loker.published_at), { locale: idLocale }) : ''

    return (
        <Link href={`/vip/loker/${loker.id}`} className="group block">
            <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex items-center justify-between gap-4">

                {/* Left: Company & Logo */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 border border-gray-200 dark:border-gray-700">
                        {loker.perusahaan?.logo_url ? (
                            <Image
                                src={loker.perusahaan.logo_url}
                                alt={loker.perusahaan_name}
                                width={32}
                                height={32}
                                className="object-contain"
                            />
                        ) : (
                            <Building2 className="w-6 h-6 text-gray-400" />
                        )}
                    </div>

                    <div className="flex flex-col min-w-0">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-base truncate group-hover:text-blue-600 transition-colors">
                            {loker.title}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="font-medium">{loker.perusahaan_name}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                            <span className="flex items-center gap-1 truncate">
                                <MapPin className="w-3 h-3" /> {loker.lokasi}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Middle: Tags (Visible on Tablet+) */}
                <div className="hidden md:flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                        {loker.tipe_pekerjaan}
                    </span>
                    {loker.kategori[0] && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                            {loker.kategori[0]}
                        </span>
                    )}
                </div>

                {/* Right: Meta & Action */}
                <div className="flex items-center gap-6 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {loker.gaji_min ? `IDR ${(loker.gaji_min / 1000000).toFixed(1)}jt` : 'Negosiasi'}
                        </p>
                        <p className="text-xs text-gray-400 flex items-center justify-end gap-1">
                            <Clock className="w-3 h-3" /> {timeAgo.replace('sekitar ', '')}
                        </p>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <ChevronRight className="w-4 h-4" />
                    </div>
                </div>
            </div>
        </Link>
    )
}
