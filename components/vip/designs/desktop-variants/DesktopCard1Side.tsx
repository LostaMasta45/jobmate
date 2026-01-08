'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Briefcase, Clock, ArrowRight } from 'lucide-react'
import type { Loker } from '@/types/vip'
import { formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'

interface DesktopCardProps {
    loker: Loker
}

export function DesktopCard1Side({ loker }: DesktopCardProps) {
    const timeAgo = loker.published_at
        ? formatDistanceToNow(new Date(loker.published_at), { addSuffix: true, locale: id })
        : 'Baru saja';

    return (
        <div className="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-xl hover:border-blue-500/30 transition-all duration-300 h-[450px] flex">

            {/* Left: Full Vertical Poster (Uncropped) */}
            {/* Width reduced to 220px */}
            <div className="w-[220px] flex-shrink-0 bg-gray-100 dark:bg-gray-800 relative border-r border-gray-100 dark:border-gray-800">
                {/* Background Blur for Fill */}
                <div className="absolute inset-0 opacity-30 blur-xl scale-150 overflow-hidden">
                    {loker.poster_url && (
                        <Image
                            src={loker.poster_url}
                            alt="Background"
                            fill
                            className="object-cover"
                        />
                    )}
                </div>

                {/* Main Poster Image - CONTAIN to show full flyer */}
                <div className="relative w-full h-full p-2 z-10 flex items-center justify-center">
                    {loker.poster_url ? (
                        <Image
                            src={loker.poster_url}
                            alt={loker.title}
                            fill
                            className="object-contain drop-shadow-sm"
                            sizes="220px"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium bg-gray-50 dark:bg-gray-900">
                            No Poster
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Detailed Content */}
            <div className="flex-1 p-8 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-full">
                        <div className="flex items-center gap-2 mb-3">
                            {loker.perusahaan?.logo_url ? (
                                <Image
                                    src={loker.perusahaan.logo_url}
                                    alt="logo"
                                    width={32}
                                    height={32}
                                    className="object-contain rounded-full border border-gray-100 bg-white"
                                />
                            ) : null}
                            <span className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                                {loker.perusahaan_name}
                            </span>
                        </div>
                        {/* Title: Line clamp relaxed */}
                        <h3 className="font-bold text-gray-900 dark:text-white text-3xl group-hover:text-blue-600 transition-colors leading-tight">
                            {loker.title}
                        </h3>
                    </div>
                </div>

                {/* Meta Grid - Larger text */}
                <div className="grid grid-cols-2 gap-y-4 gap-x-8 my-auto text-base text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{loker.lokasi}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <span>{loker.tipe_pekerjaan}</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                        <span className="font-bold text-2xl text-green-600 dark:text-green-400">
                            {loker.gaji_min ? `Rp ${(loker.gaji_min / 1000000).toFixed(1)} Juta` : 'Gaji Kompetitif'}
                            {loker.gaji_max ? ` - ${(loker.gaji_max / 1000000).toFixed(1)} Juta` : ''}
                        </span>
                    </div>
                </div>

                {/* Footer */}
                <div className="pt-6 mt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>Posted {timeAgo}</span>
                    </div>

                    <Link
                        href={`/vip/loker/${loker.id}`}
                        className="inline-flex items-center justify-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-600 dark:hover:bg-gray-200 transition-all transform hover:-translate-y-0.5 shadow-sm hover:shadow-md"
                    >
                        Lihat Detail <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    )
}
