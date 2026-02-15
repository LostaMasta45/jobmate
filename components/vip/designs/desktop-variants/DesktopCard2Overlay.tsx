'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Briefcase, Calendar, ChevronRight } from 'lucide-react'
import type { Loker } from '@/types/vip'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { useState, useEffect } from 'react'

interface DesktopCardProps {
    loker: Loker
}

export function DesktopCard2Overlay({ loker }: DesktopCardProps) {
    const [formattedDate, setFormattedDate] = useState<string>('')

    useEffect(() => {
        if (loker.published_at) {
            setFormattedDate(format(new Date(loker.published_at), 'd MMMM yyyy', { locale: id }))
        } else {
            setFormattedDate('-')
        }
    }, [loker.published_at])

    return (
        <Link href={`/vip/loker/${loker.id}`} className="group block h-full">
            {/* Vertical Card: Modern, Elegant, Taller */}
            <div className="relative rounded-[2rem] overflow-hidden transition-all duration-500 border border-white/5 hover:border-white/20 bg-gray-900/50 flex flex-col h-full min-h-[600px] w-full mx-auto ring-1 ring-white/5 hover:ring-blue-500/30 hover:shadow-[0_0_50px_-12px_rgba(59,130,246,0.5)] group-hover:-translate-y-1">

                {/* Background: Richer, more vibrant blur */}
                <div className="absolute inset-0 z-0">
                    {loker.poster_url ? (
                        <Image
                            src={loker.poster_url}
                            alt="bg"
                            fill
                            className="object-cover opacity-40 blur-3xl scale-125 saturate-150"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-900 to-black" />
                    )}
                    {/* Elegant Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/80 to-black/30" />
                </div>

                {/* [TOP] Poster Area - Enlarged to 350px & Enhanced */}
                <div className="relative z-10 w-full h-[350px] flex-shrink-0 p-6 pb-0 flex items-center justify-center">
                    <div className="relative w-full h-full transition-transform duration-700 group-hover:scale-[1.05] group-hover:-rotate-1">
                        {loker.poster_url ? (
                            <Image
                                src={loker.poster_url}
                                alt={loker.title}
                                fill
                                className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                                sizes="(max-width: 768px) 100vw, 500px"
                            />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-white/20 font-bold border-2 border-dashed border-white/5 rounded-2xl bg-white/5 backdrop-blur-sm">
                                No Poster
                            </div>
                        )}
                    </div>
                </div>

                {/* [BOTTOM] Content Area - Glassy & Premium */}
                <div className="relative z-10 flex-1 px-6 pb-6 pt-4 flex flex-col items-center text-center">

                    {/* Glassy Tag */}
                    <div className="mb-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider group-hover:bg-blue-600/20 group-hover:border-blue-500/50 group-hover:text-blue-200 transition-all duration-300">
                            {loker.tipe_pekerjaan}
                        </span>
                    </div>

                    {/* Title - Elegant Typography */}
                    <h3 className="text-2xl font-black leading-tight mb-2 text-white drop-shadow-xl group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-200 transition-all duration-300 line-clamp-2">
                        {loker.title}
                    </h3>

                    {/* Company - Clean layout */}
                    <div className="flex items-center gap-2 mb-5 justify-center opacity-90 group-hover:opacity-100 transition-opacity">
                        {loker.perusahaan?.logo_url && (
                            <div className="p-0.5 bg-white rounded-full shadow-lg">
                                <Image src={loker.perusahaan.logo_url} width={22} height={22} className="rounded-full object-contain" alt="logo" />
                            </div>
                        )}
                        <span className="text-gray-200 font-bold text-sm md:text-base tracking-wide truncate max-w-[250px] drop-shadow-md">
                            {loker.perusahaan_name}
                        </span>
                    </div>

                    {/* Meta Info - Minimalist Icons */}
                    <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs md:text-sm text-gray-400 mb-6 font-medium">
                        <div className="flex items-center gap-1.5 group-hover:text-blue-300 transition-colors">
                            <MapPin className="w-3.5 h-3.5" />
                            <span className="truncate max-w-[150px]">{loker.lokasi}</span>
                        </div>
                        <div className="flex items-center gap-1.5 group-hover:text-purple-300 transition-colors">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{formattedDate}</span>
                        </div>
                    </div>

                    {/* Footer / Action - Premium Glass Button */}
                    <div className="mt-auto w-full space-y-3">
                        {/* Salary with Glow */}
                        {loker.gaji_min && (
                            <p className="text-lg md:text-xl font-bold text-white tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                                Rp {(loker.gaji_min / 1000000).toFixed(1)} jt
                            </p>
                        )}

                        {/* The "Cool" Button */}
                        <div className="w-full relative overflow-hidden group/btn rounded-xl">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-xy" />
                            <div className="relative w-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm transition-all duration-300 group-hover:border-transparent cursor-pointer shadow-lg outline-none ring-0">
                                Lihat Detail <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </Link>
    )
}
