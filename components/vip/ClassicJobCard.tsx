'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Clock, DollarSign, ArrowRight, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Loker } from '@/types/vip'
import { formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'

export function ClassicJobCard({ job }: { job: Loker & { is_bookmarked?: boolean } }) {
    // Calculate time ago safely
    const timeAgo = job.published_at
        ? formatDistanceToNow(new Date(job.published_at), { addSuffix: true, locale: id })
        : 'Baru saja';

    return (
        <div className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:border-blue-500 hover:shadow-md transition-all duration-300 flex flex-col h-full">
            <Link href={`/vip/loker/${job.id}`} className="flex flex-col h-full">
                {/* Thumbnail Header */}
                <div className="relative h-48 w-full bg-gray-100 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
                    {job.poster_url ? (
                        <Image
                            src={job.poster_url}
                            alt={job.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Briefcase className="w-10 h-10 opacity-20" />
                        </div>
                    )}
                    <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white shadow-sm">
                            {job.tipe_pekerjaan}
                        </Badge>
                    </div>
                    {/* Featured Stripe if applicable */}
                    {job.is_featured && (
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                    )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                    <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                            {job.title}
                        </h3>
                    </div>

                    <div className="space-y-2 mb-6 flex-1 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="truncate">{job.lokasi}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>{timeAgo}</span>
                        </div>
                        {job.gaji_min && (
                            <div className="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-200">
                                <DollarSign className="w-4 h-4 text-green-500" />
                                <span>
                                    IDR {(job.gaji_min / 1000000).toFixed(0)}
                                    {job.gaji_max ? ` - ${(job.gaji_max / 1000000).toFixed(0)}` : ''} Juta
                                </span>
                            </div>
                        )}
                    </div>

                    <Button className="w-full bg-white text-blue-600 border border-blue-200 hover:bg-blue-600 hover:text-white dark:bg-gray-700 dark:text-blue-400 dark:border-gray-600 dark:hover:bg-blue-600 dark:hover:text-white transition-all group-hover:shadow-lg">
                        View Details <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </Link>
        </div>
    )
}
