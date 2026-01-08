'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Building2 } from 'lucide-react'
import type { Loker } from '@/types/vip'

interface VariantProps {
    loker: Loker
}

export function Variant3Overlay({ loker }: VariantProps) {
    return (
        <Link href={`/vip/loker/${loker.id}`} className="group block h-full">
            <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">

                {/* Background Image */}
                <div className="absolute inset-0 bg-gray-900">
                    {loker.poster_url ? (
                        <Image
                            src={loker.poster_url}
                            alt={loker.title}
                            fill
                            className="object-cover opacity-70 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-slate-900" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                    <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <div className="flex items-center gap-2 mb-2 text-white/80 text-sm">
                            <Building2 className="w-4 h-4" />
                            <span className="font-semibold">{loker.perusahaan_name}</span>
                        </div>

                        <h3 className="font-bold text-xl leading-tight mb-2 drop-shadow-md">
                            {loker.title}
                        </h3>

                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="flex items-center gap-1 text-xs">
                                <MapPin className="w-3 h-3" /> {loker.lokasi}
                            </span>
                            <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded">
                                {loker.tipe_pekerjaan}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}
