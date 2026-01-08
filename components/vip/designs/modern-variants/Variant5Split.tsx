'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Building2, ChevronRight } from 'lucide-react'
import type { Loker } from '@/types/vip'

interface VariantProps {
    loker: Loker
}

export function Variant5Split({ loker }: VariantProps) {
    return (
        <Link href={`/vip/loker/${loker.id}`} className="group block mb-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden flex shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow h-32">

                {/* Left: Thumbnail & Brand Color Stripe */}
                <div className="w-32 relative bg-gray-200">
                    {loker.poster_url ? (
                        <Image
                            src={loker.poster_url}
                            alt={loker.title}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                            <Building2 className="w-8 h-8" />
                        </div>
                    )}
                    {/* Brand Stripe Overlay */}
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600" />
                </div>

                {/* Right: Content */}
                <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors pr-2">
                                {loker.title}
                            </h3>
                            {loker.perusahaan?.logo_url && (
                                <div className="w-8 h-8 rounded-md border border-gray-100 p-0.5 flex-shrink-0">
                                    <Image src={loker.perusahaan.logo_url} width={28} height={28} alt="logo" className="object-contain" />
                                </div>
                            )}
                        </div>
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mt-1">
                            {loker.perusahaan_name}
                        </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {loker.lokasi}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 font-medium text-blue-600 group-hover:translate-x-1 transition-transform">
                            Detail <ChevronRight className="w-3 h-3" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}
