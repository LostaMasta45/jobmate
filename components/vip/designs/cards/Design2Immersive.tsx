'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Building2, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Loker } from '@/types/vip'

interface DesignProps {
    loker: Loker
}

export function Design2Immersive({ loker }: DesignProps) {
    return (
        <Link href={`/vip/loker/${loker.id}`} className="group block h-full">
            <div className="relative h-64 md:h-72 w-full rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-800">

                {/* Background Image with Zoom Effect */}
                <div className="absolute inset-0 bg-gray-900">
                    {loker.poster_url ? (
                        <Image
                            src={loker.poster_url}
                            alt={loker.title}
                            fill
                            className="object-cover opacity-60 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-black" />
                    )}
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                    <div className="flex justify-between items-start">
                        <Badge className="bg-white/20 hover:bg-white/30 backdrop-blur-md border-white/10 text-white">
                            {loker.kategori[0] || 'General'}
                        </Badge>
                        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:text-black transition-all">
                            <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-2 opacity-80">
                            {loker.perusahaan?.logo_url ? (
                                <Image
                                    src={loker.perusahaan.logo_url}
                                    alt="logo"
                                    width={20}
                                    height={20}
                                    className="rounded-full bg-white p-0.5"
                                />
                            ) : (
                                <Building2 className="w-4 h-4" />
                            )}
                            <span className="text-sm font-medium tracking-wide">{loker.perusahaan_name}</span>
                        </div>

                        <h3 className="text-2xl font-bold mb-2 leading-tight group-hover:text-blue-300 transition-colors">
                            {loker.title}
                        </h3>

                        <div className="flex items-center justify-between mt-4 text-sm text-white/70 border-t border-white/10 pt-4">
                            <div className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4" />
                                {loker.lokasi}
                            </div>
                            <span className="font-semibold text-white">
                                {loker.gaji_text || 'Gaji Negosiasi'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}
