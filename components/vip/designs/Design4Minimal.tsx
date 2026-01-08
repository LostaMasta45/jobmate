'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
    ArrowLeft,
    Share2,
    Bookmark,
    MapPin,
    Clock,
    ArrowRight,
    ArrowUpRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loker } from '@/types/vip'

interface DesignProps {
    loker: Loker
    similar: Loker[]
}

export function Design4Minimal({ loker, similar }: DesignProps) {

    return (
        <div className="min-h-screen bg-black font-serif text-white selection:bg-orange-500/50 pb-32 relative">

            {/* HEADER: TRANSPARENT & FIXED */}
            <header className="fixed top-0 inset-x-0 z-50 bg-gradient-to-b from-black/80 to-transparent transition-all">
                <div className="max-w-[1400px] mx-auto px-6 h-24 flex items-center justify-between">
                    <Link href="/vip/loker" className="text-white/60 hover:text-white transition-colors flex items-center gap-2 group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-sans text-xs font-bold tracking-widest uppercase hidden sm:block">Back</span>
                    </Link>
                    <div className="font-sans text-xs font-bold tracking-[0.2em] uppercase text-white/40">
                        Jobmate Editorial
                    </div>
                    <div className="flex gap-6 text-white/60">
                        <Bookmark className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                        <Share2 className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                    </div>
                </div>
            </header>

            <main className="pt-0">

                {/* FULL SCREEN POSTER HERO */}
                <div className="fixed inset-0 z-0">
                    {loker.poster_url ? (
                        <Image
                            src={loker.poster_url}
                            alt="Cover"
                            fill
                            className="object-cover opacity-60"
                            priority
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full bg-gray-900">
                            <h1 className="text-9xl font-sans font-black text-white/5 tracking-tighter uppercase">{loker.perusahaan_name}</h1>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/50" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                </div>

                {/* SCROLLABLE CONTENT (Floating Glass) */}
                <div className="relative z-10 pt-[50vh]">
                    <div className="max-w-4xl mx-auto px-6 text-center mb-24">
                        <div className="inline-block bg-white/10 backdrop-blur-md border border-white/10 px-8 pt-8 pb-4 rounded-t-2xl shadow-2xl">
                            <Badge variant="outline" className="mb-4 font-sans border-white/30 text-white rounded-none px-4 py-1.5 uppercase tracking-widest text-[11px] hover:bg-white hover:text-black transition-colors cursor-pointer">
                                {loker.kategori[0]}
                            </Badge>
                        </div>
                        <h1 className="text-6xl sm:text-8xl font-light mb-8 leading-[1] tracking-tight text-white drop-shadow-2xl">
                            {loker.title}
                        </h1>

                        <div className="font-sans flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-white/50 text-sm font-medium tracking-wide uppercase">
                            <span className="text-white">{loker.perusahaan_name}</span>
                            <span className="w-1 h-1 bg-white/20 rounded-full" />
                            <span>{loker.lokasi}</span>
                            <span className="w-1 h-1 bg-white/20 rounded-full" />
                            <span>{loker.gaji_text?.replace('Rp', 'IDR')}</span>
                            <span className="w-1 h-1 bg-white/20 rounded-full" />
                            <span>{loker.tipe_pekerjaan}</span>
                        </div>
                    </div>

                    {/* GLASS CONTENT BOARD */}
                    <div className="max-w-3xl mx-auto px-8 py-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl">
                        <div className="prose prose-xl prose-invert mx-auto text-gray-300 leading-loose prose-p:font-light">
                            <p className="font-sans text-2xl md:text-3xl font-light text-white/70 leading-normal mb-16 pl-6 border-l w-full border-white/20 italic">
                                "{loker.deskripsi?.split('\n')[0].substring(0, 150)}..."
                            </p>

                            <div className="flex items-center gap-4 mb-12">
                                <div className="h-px bg-white/10 flex-1" />
                                <span className="font-sans text-xs font-bold uppercase tracking-widest text-white/30">Context</span>
                                <div className="h-px bg-white/10 flex-1" />
                            </div>

                            <div className="whitespace-pre-wrap font-serif text-xl">{loker.deskripsi}</div>

                            <div className="my-16 p-8 bg-white/5 rounded-none border-l-2 border-orange-500/80">
                                <h3 className="font-sans text-sm font-bold uppercase tracking-widest text-orange-400 mb-6 mt-0">Requirements</h3>
                                <ul className="space-y-4 list-none pl-0 m-0">
                                    {loker.kualifikasi?.map((item, i) => (
                                        <li key={i} className="flex gap-6 border-b border-white/5 pb-4 last:border-0 last:pb-0 items-baseline">
                                            <span className="font-sans text-xs font-bold text-orange-500/80">0{i + 1}</span>
                                            <span className="text-white/80 text-lg">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* SIMILAR JOBS: MINIMAL GRID GLASS */}
                    <div className="mt-32 border-t border-white/10 pt-20 max-w-[1400px] mx-auto px-6">
                        <h3 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-white/30 mb-10 text-center">More like this</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
                            {similar.map(job => (
                                <Link href="/vip/loker" key={job.id} className="group cursor-pointer">
                                    <div className="aspect-[4/3] bg-white/5 mb-6 overflow-hidden relative rounded-sm border border-white/5">
                                        {job.poster_url && <Image src={job.poster_url} fill className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out" alt={job.title} />}
                                    </div>
                                    <div className="text-center">
                                        <h4 className="font-serif text-2xl text-white group-hover:text-orange-400 transition-colors mb-2">{job.title}</h4>
                                        <p className="font-sans text-xs font-bold uppercase tracking-widest text-white/40">{job.perusahaan_name}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="h-32" />
                </div>

                {/* APPLY CTA: FIXED BOTTOM */}
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 w-auto">
                    <Button size="lg" className="rounded-full h-16 px-12 bg-white text-black hover:bg-orange-500 hover:text-white hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] font-sans text-sm font-bold uppercase tracking-widest group">
                        Apply Position
                        <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>

            </main>
        </div>
    )
}
