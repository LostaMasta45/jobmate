'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, ArrowRight, ArrowDownRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Perusahaan, Loker } from '@/types/vip'
import { DesktopCard2Overlay } from '@/components/vip/designs/desktop-variants/DesktopCard2Overlay'

interface LayoutProps {
    company: Perusahaan & {
        loker_count?: number
        deskripsi?: string
        banner_url?: string
    }
    loker: Loker[]
}

export function LayoutC_Creative({ company, loker }: LayoutProps) {
    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-lime-400 selection:text-black">

            {/* Big Header */}
            <header className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/10">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md">
                            <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
                            <span className="text-sm font-medium tracking-wider uppercase text-gray-300">We are Hiring</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
                            {company.name.toUpperCase()}
                        </h1>
                        <div className="flex flex-wrap gap-4 text-xl text-gray-400 max-w-2xl">
                            <p>{company.industri} • Based in {company.lokasi}</p>
                        </div>
                    </div>

                    <div className="flex-shrink-0">
                        <div className="w-32 h-32 md:w-48 md:h-48 bg-white rounded-full flex items-center justify-center p-4">
                            {company.logo_url ? (
                                <img src={company.logo_url} alt="logo" className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-500" />
                            ) : (
                                <span className="text-black font-black text-4xl">?</span>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Content Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">

                    {/* About - Sticky Scroll */}
                    <div className="space-y-12">
                        <div className="sticky top-10">
                            <h2 className="text-4xl font-bold mb-8 flex items-center gap-4">
                                <ArrowDownRight className="w-10 h-10 text-lime-400" />
                                Who We Are
                            </h2>
                            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light">
                                {company.deskripsi || "We are a forward-thinking company pushing the boundaries of what's possible."}
                            </p>

                            <div className="mt-12 grid grid-cols-2 gap-6 p-6 border border-white/10 bg-white/5 rounded-2xl">
                                <div>
                                    <div className="text-4xl font-bold text-lime-400">{loker.length}</div>
                                    <div className="text-sm text-gray-400 uppercase tracking-widest mt-1">Open Roles</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-bold text-white">100+</div>
                                    <div className="text-sm text-gray-400 uppercase tracking-widest mt-1">Happy Clients</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Jobs - Minimal List */}
                    <div className="space-y-8">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest border-b border-white/10 pb-4 mb-8">
                            Available Positions
                        </h3>

                        <div className="space-y-4">
                            {loker.map((job, idx) => (
                                <div key={job.id} className="group relative">
                                    <div className="absolute inset-0 bg-lime-400 rounded-2xl md:rounded-3xl translate-y-2 translate-x-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform duration-300" />
                                    <div className="relative bg-gray-900 border border-white/10 p-6 md:p-8 rounded-2xl md:rounded-3xl hover:bg-black transition-colors duration-300 flex flex-col gap-4">
                                        <div className="flex justify-between items-start">
                                            <Badge className="bg-white text-black hover:bg-gray-200 border-none">{job.tipe_pekerjaan}</Badge>
                                            <span className="text-gray-500 font-mono text-sm">0{idx + 1}</span>
                                        </div>
                                        <h4 className="text-2xl md:text-3xl font-bold group-hover:text-lime-400 transition-colors">{job.title}</h4>
                                        <div className="flex justify-between items-end mt-4">
                                            <div className="text-gray-400 text-sm">{job.lokasi}</div>
                                            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-lime-400 group-hover:text-black group-hover:border-lime-400 transition-all">
                                                <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Big Footer CTA */}
            <div className="border-t border-white/10 bg-white/5 py-20 text-center">
                <h2 className="text-4xl md:text-6xl font-black mb-8">Ready to join use?</h2>
                <Button size="lg" className="h-16 px-10 rounded-full text-xl bg-lime-400 text-black hover:bg-lime-500 hover:scale-105 transition-all">
                    See All Openings
                </Button>
            </div>
        </div>
    )
}
