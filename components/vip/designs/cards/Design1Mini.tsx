'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Building2, Clock, Briefcase, Bookmark, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Loker } from '@/types/vip'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

interface DesignProps {
    loker: Loker
}

export function Design1Mini({ loker }: DesignProps) {
    const getTimeAgo = (date?: string) => {
        if (!date) return ''
        try {
            return formatDistanceToNow(new Date(date), { addSuffix: true, locale: idLocale })
        } catch {
            return ''
        }
    }

    return (
        <Link href={`/vip/loker/${loker.id}`} className="group block">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:border-blue-500/30 hover:shadow-lg dark:hover:shadow-blue-900/10 transition-all duration-300 relative overflow-hidden">
                {/* Accent Top Border */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                <div className="flex items-start gap-4">
                    {/* Minimalist Logo Box */}
                    <div className="w-14 h-14 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center p-2 flex-shrink-0 group-hover:bg-white dark:group-hover:bg-gray-800 transition-colors">
                        {loker.perusahaan?.logo_url ? (
                            <Image
                                src={loker.perusahaan.logo_url}
                                alt={loker.perusahaan_name}
                                width={40}
                                height={40}
                                className="object-contain"
                            />
                        ) : (
                            <Building2 className="w-6 h-6 text-gray-300" />
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                                    {loker.title}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-3 flex items-center gap-2">
                                    {loker.perusahaan_name}
                                    {loker.is_featured && (
                                        <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200">
                                            Featured
                                        </Badge>
                                    )}
                                </p>
                            </div>

                            {/* Salary Pill */}
                            <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-100 dark:border-green-900/30 whitespace-nowrap">
                                {loker.gaji_min ? `${(loker.gaji_min / 1000000).toFixed(0)}jt - ${(loker.gaji_max ? loker.gaji_max / 1000000 : 0).toFixed(0)}jt` : 'Gaji Kompetitif'}
                            </div>
                        </div>

                        {/* Tags Row */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 dark:bg-gray-800 px-2.5 py-1.5 rounded-md border border-gray-100 dark:border-gray-700">
                                <Briefcase className="w-3.5 h-3.5" />
                                {loker.tipe_pekerjaan}
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 dark:bg-gray-800 px-2.5 py-1.5 rounded-md border border-gray-100 dark:border-gray-700">
                                <MapPin className="w-3.5 h-3.5" />
                                {loker.lokasi}
                            </span>
                            {loker.published_at && (
                                <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 pl-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    {getTimeAgo(loker.published_at)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}
