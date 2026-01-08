'use client'

import React from 'react'
import Link from 'next/link'
import { MapPin, ArrowUpRight, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Perusahaan, Loker } from '@/types/vip'

interface LayoutProps {
    company: Perusahaan & {
        loker_count?: number
        deskripsi?: string
        banner_url?: string
    }
    loker: Loker[]
}

export function LayoutD_Minimal({ company, loker }: LayoutProps) {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-black selection:text-white">

            {/* Header - Simple & Clean */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            {company.logo_url ? <img src={company.logo_url} className="w-6 h-6 object-contain" /> : <div className="w-4 h-4 bg-black rounded-full" />}
                        </div>
                        <span className="font-semibold tracking-tight">{company.name}</span>
                    </div>
                    <Button variant="outline" className="rounded-full border-black text-black hover:bg-black hover:text-white transition-colors">
                        Visit Website
                    </Button>
                </div>
            </header>

            <main className="pt-32 pb-20 max-w-3xl mx-auto px-6">

                {/* Intro */}
                <section className="mb-24 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-5xl md:text-7xl font-medium tracking-tighter leading-tight">
                        Building the future of <span className="text-gray-400 italic font-serif">Pastry.</span>
                    </h1>
                    <div className="flex gap-4">
                        <Badge variant="secondary" className="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full px-4 py-1">{company.industri}</Badge>
                        <Badge variant="secondary" className="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full px-4 py-1">{company.lokasi}</Badge>
                    </div>
                    <p className="text-xl leading-relaxed text-gray-500 font-light">
                        {company.deskripsi}
                    </p>
                </section>

                {/* Jobs List - Editorial Style */}
                <section className="space-y-12">
                    <div className="flex items-end justify-between border-b border-black pb-4 mb-8">
                        <h2 className="text-3xl font-medium tracking-tight">Open Positions</h2>
                        <span className="text-sm font-mono text-gray-400">0{loker.length} ROLES</span>
                    </div>

                    <div className="space-y-0">
                        {loker.map((job) => (
                            <div key={job.id} className="group border-b border-gray-100 hover:border-black transition-colors py-8 lg:py-12 cursor-pointer">
                                <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
                                    <div className="space-y-2">
                                        <div className="text-sm text-gray-400 uppercase tracking-widest font-medium mb-2">{job.kategori[0]}</div>
                                        <h3 className="text-3xl font-medium group-hover:underline decoration-1 underline-offset-4">{job.title}</h3>
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <MapPin className="w-4 h-4" /> {job.lokasi}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-lg font-mono text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block">
                                            {job.tipe_pekerjaan}
                                        </span>
                                        <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                                            <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </main>
        </div>
    )
}
