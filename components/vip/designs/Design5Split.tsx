'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
    ArrowLeft,
    X,
    Share2,
    MoreVertical,
    Check,
    ArrowUpRight,
    MapPin,
    Building2,
    DollarSign
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loker } from '@/types/vip'

interface DesignProps {
    loker: Loker
    similar: Loker[]
}

export function Design5Split({ loker, similar }: DesignProps) {

    return (
        <div className="h-screen bg-black flex flex-col lg:flex-row overflow-hidden font-sans text-white relative">

            {/* BACKGROUND SPREAD */}
            <div className="absolute inset-0 z-0">
                {loker.poster_url && (
                    <Image
                        src={loker.poster_url}
                        alt="Bg"
                        fill
                        className="object-cover opacity-40 blur-[60px]"
                    />
                )}
            </div>

            {/* 1. LEFT SIDE: VISUAL (Fixed) */}
            <div className="lg:w-[45%] h-[40vh] lg:h-full relative flex-shrink-0 group z-10">
                {loker.poster_url ? (
                    <Image
                        src={loker.poster_url || ''}
                        alt="Poster"
                        fill
                        className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000"
                        priority
                    />
                ) : (
                    <div className="w-full h-full bg-black/50 flex items-center justify-center">
                        <span className="text-white/20 font-bold text-9xl">{loker.perusahaan_name[0]}</span>
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-black/20 lg:to-black" />

                {/* Overlay Content */}
                <div className="absolute inset-x-0 bottom-0 p-8 lg:p-16 text-white z-20">
                    <div className="mb-6">
                        <Badge className="bg-white/20 text-white backdrop-blur-md font-bold hover:bg-white/30 border-0 mb-4">{loker.kategori[0]}</Badge>
                        <h1 className="text-3xl lg:text-6xl font-bold mb-4 leading-tight drop-shadow-lg">{loker.title}</h1>
                    </div>

                    <div className="lg:max-w-md space-y-4">
                        <div className="flex items-center gap-4 text-white/90 backdrop-blur-xl bg-black/40 p-4 rounded-xl border border-white/10 hover:bg-black/60 transition-colors cursor-default">
                            {loker.perusahaan?.logo_url ? (
                                <img src={loker.perusahaan.logo_url} className="w-12 h-12 rounded-lg bg-white object-contain p-1" />
                            ) : (
                                <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center text-black font-bold">{loker.perusahaan_name[0]}</div>
                            )}
                            <div>
                                <p className="font-bold text-lg leading-none">{loker.perusahaan_name}</p>
                                <p className="text-sm text-white/60">{loker.perusahaan?.industri || 'Company'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Nav Back */}
                <Link href="/vip/loker" className="absolute top-8 left-8 p-3 bg-black/40 backdrop-blur-xl rounded-full hover:bg-white hover:text-black transition-all border border-white/10 text-white z-50">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
            </div>

            {/* 2. RIGHT SIDE: CONTENT (Scrollable Glass) */}
            <div className="lg:w-[55%] flex flex-col h-full bg-black/60 backdrop-blur-xl relative z-20 border-l border-white/10 lg:ml-0 -mt-6 rounded-t-[2rem] lg:rounded-none shadow-2xl lg:shadow-none overflow-hidden">

                <div className="flex-1 overflow-y-auto px-6 py-10 lg:px-20 lg:py-16">
                    <div className="max-w-2xl mx-auto space-y-12">

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-5 bg-white/5 rounded-2xl border border-white/10 shadow-sm hover:bg-white/10 transition-colors">
                                <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <DollarSign className="w-4 h-4" /> Offering
                                </p>
                                <p className="font-bold text-white text-xl">{loker.gaji_text?.replace('Rp', '')}</p>
                            </div>
                            <div className="p-5 bg-white/5 rounded-2xl border border-white/10 shadow-sm hover:bg-white/10 transition-colors">
                                <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> Location
                                </p>
                                <p className="font-bold text-white text-xl">{loker.lokasi}</p>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="prose prose-invert max-w-none">
                            <h3 className="text-2xl font-bold mb-6 text-white">About the role</h3>
                            <div className="text-white/70 leading-relaxed whitespace-pre-wrap text-lg font-light">
                                {loker.deskripsi}
                            </div>
                        </div>

                        {/* Requirements Section */}
                        <div>
                            <h3 className="text-2xl font-bold mb-6 text-white">Requirements</h3>
                            <div className="space-y-4">
                                {loker.kualifikasi?.map((item, i) => (
                                    <div key={i} className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/5 items-start hover:bg-white/10 transition-colors">
                                        <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-indigo-500/30">
                                            <Check className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="text-white/80 font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* SIMILAR JOBS SECTION */}
                        <div className="pt-10 border-t border-white/10">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-white uppercase tracking-wide">Similar Jobs</h3>
                            </div>
                            <div className="space-y-4">
                                {similar.map(job => (
                                    <Link href="/vip/loker" key={job.id} className="block group">
                                        <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-indigo-500/50 hover:bg-white/10 transition-all flex items-center gap-4 hover:shadow-lg">
                                            <div className="w-16 h-16 bg-black/40 rounded-lg overflow-hidden relative flex-shrink-0">
                                                {job.poster_url ? (
                                                    <img src={job.poster_url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-xs text-white/20 font-bold">{job.perusahaan_name[0]}</div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-white truncate group-hover:text-indigo-400 transition-colors">{job.title}</h4>
                                                <p className="text-sm text-white/40">{job.perusahaan_name} • {job.lokasi}</p>
                                            </div>
                                            <div className="p-2 text-white/20 group-hover:text-indigo-400 transition-colors">
                                                <ArrowUpRight className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="h-20" /> {/* Spacer */}
                    </div>
                </div>

                {/* Sticky Footer Action */}
                <div className="p-6 lg:px-20 lg:py-8 border-t border-white/10 bg-black/80 backdrop-blur-xl absolute bottom-0 inset-x-0 lg:sticky">
                    <div className="max-w-2xl mx-auto flex gap-4">
                        <Button variant="outline" size="lg" className="flex-1 h-14 rounded-2xl text-base font-bold border-white/20 hover:bg-white/10 text-white bg-transparent">
                            Save Job
                        </Button>
                        <Button size="lg" className="flex-[2] h-14 rounded-2xl bg-white hover:bg-gray-200 text-lg font-bold text-black shadow-lg shadow-white/10">
                            Apply Now
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    )
}
