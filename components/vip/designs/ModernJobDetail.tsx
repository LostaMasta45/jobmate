'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
    ArrowLeft,
    MapPin,
    Clock,
    Share2,
    Briefcase,
    DollarSign,
    Globe,
    CheckCircle,
    Building2,
    Mail,
    Phone,
    User,
    Calendar,
    ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { Loker } from '@/types/vip'
import { cn } from '@/lib/utils'

interface ModernJobDetailProps {
    loker: Loker
    similar: Loker[]
    variant: 'corporate' | 'centered' | 'minimal' | 'split'
}

export function ModernJobDetail({ loker, similar, variant }: ModernJobDetailProps) {
    const isSplit = variant === 'split'
    const isCentered = variant === 'centered'
    const isMinimal = variant === 'minimal'

    // Format currency helper
    const formatCurrency = (val?: number) => {
        if (!val) return ''
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val)
    }

    const salaryText = loker.gaji_text || (loker.gaji_min ? `${formatCurrency(loker.gaji_min)} - ${formatCurrency(loker.gaji_max)}` : 'Gaji Kompetitif')

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            {/* TOP NAVIGATION */}
            <div className={cn(
                "sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 py-4 flex items-center justify-between transition-all",
                isMinimal && "border-none bg-transparent"
            )}>
                <Link href="/vip/loker" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium group">
                    <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-slate-400">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    <span className="hidden sm:inline">Kembali</span>
                </Link>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="hidden sm:flex rounded-full">
                        <Share2 className="w-4 h-4 mr-2" /> Share
                    </Button>
                    <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-6 rounded-full shadow-lg shadow-slate-200">
                        Lamar Sekarang
                    </Button>
                </div>
            </div>

            <main className={cn(
                "container mx-auto px-4 py-8 pb-20",
                isSplit ? "max-w-7xl" : "max-w-5xl",
                isCentered && "max-w-4xl"
            )}>

                {/* HERO / HEADER SECTION */}
                <div className={cn(
                    "mb-10",
                    isCentered && "text-center flex flex-col items-center",
                    isSplit && "lg:grid lg:grid-cols-12 lg:gap-10 lg:items-start"
                )}>
                    {/* POSTER DISPLAY (Common requirement: Poster at start/prominent) */}
                    <div className={cn(
                        "rounded-2xl overflow-hidden shadow-2xl shadow-slate-200/50 mb-8 border border-slate-100 bg-white relative group",
                        isSplit ? "lg:col-span-5 lg:mb-0 lg:sticky lg:top-24 order-2 lg:order-1" : "max-w-3xl mx-auto w-full aspect-video object-cover"
                    )}>
                        {loker.poster_url ? (
                            <img
                                src={loker.poster_url}
                                alt={loker.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                        ) : (
                            // Fallback if no poster
                            <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-10 min-h-[300px]">
                                <div className="text-center text-white">
                                    <h2 className="text-3xl font-bold mb-2">{loker.perusahaan_name}</h2>
                                    <p className="opacity-70">Sedang Membuka Lowongan</p>
                                </div>
                            </div>
                        )}

                        {/* Overlay Gradient on Poster Bottom */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                        {/* Poster text overlay (optional, only show if minimalist variant) */}
                        {isMinimal && (
                            <div className="absolute bottom-6 left-6 text-white text-left">
                                <h1 className="text-3xl font-bold mb-1">{loker.title}</h1>
                                <p className="text-white/80">{loker.perusahaan_name}</p>
                            </div>
                        )}
                    </div>

                    {/* HEADER INFO (Title, Meta) - If Split, this goes to right side */}
                    <div className={cn(
                        isSplit ? "lg:col-span-7 order-1 lg:order-2" : "w-full"
                    )}>
                        {!isMinimal && (
                            <div className={cn(
                                "mb-6",
                                isCentered && "flex flex-col items-center"
                            )}>
                                <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
                                    {loker.kategori.map(cat => (
                                        <Badge key={cat} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1">
                                            {cat}
                                        </Badge>
                                    ))}
                                    {loker.tipe_pekerjaan && (
                                        <Badge variant="outline" className="border-slate-300 text-slate-600">
                                            {loker.tipe_pekerjaan}
                                        </Badge>
                                    )}
                                </div>
                                <h1 className={cn("text-3xl md:text-4xl font-bold text-slate-900 mb-2 leading-tight", isCentered && "text-center")}>
                                    {loker.title}
                                </h1>
                                <p className="text-lg text-slate-500 font-medium mb-6 flex items-center gap-2">
                                    <Building2 className="w-5 h-5" /> {loker.perusahaan_name}
                                </p>

                                <div className={cn(
                                    "grid grid-cols-2 md:grid-cols-4 gap-4 w-full p-4 rounded-xl bg-white border border-slate-100 shadow-sm",
                                    isCentered && "max-w-2xl"
                                )}>
                                    <div className="p-3">
                                        <div className="text-xs text-slate-400 font-semibold uppercase mb-1">Gaji</div>
                                        <div className="font-semibold text-slate-800 text-sm md:text-base flex items-center gap-1">
                                            <DollarSign className="w-4 h-4 text-green-600" /> {salaryText}
                                        </div>
                                    </div>
                                    <div className="p-3 border-l border-slate-100">
                                        <div className="text-xs text-slate-400 font-semibold uppercase mb-1">Lokasi</div>
                                        <div className="font-semibold text-slate-800 text-sm md:text-base flex items-center gap-1">
                                            <MapPin className="w-4 h-4 text-red-500" /> {loker.lokasi}
                                        </div>
                                    </div>
                                    <div className="p-3 border-l border-slate-100">
                                        <div className="text-xs text-slate-400 font-semibold uppercase mb-1">Posted</div>
                                        <div className="font-semibold text-slate-800 text-sm md:text-base flex items-center gap-1">
                                            <Calendar className="w-4 h-4 text-blue-500" /> 2 Hari lalu
                                        </div>
                                    </div>
                                    <div className="p-3 border-l border-slate-100">
                                        <div className="text-xs text-slate-400 font-semibold uppercase mb-1">Pengalaman</div>
                                        <div className="font-semibold text-slate-800 text-sm md:text-base flex items-center gap-1">
                                            <Briefcase className="w-4 h-4 text-purple-500" /> Min 1 Th
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* CONTENT BODY */}
                        <div className={cn(
                            "space-y-10 mt-10",
                            isSplit ? "" : "w-full"
                        )}>

                            {/* DESCRIPTION */}
                            <section>
                                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <div className="w-1 h-6 bg-blue-600 rounded-full" />
                                    Deskripsi Pekerjaan
                                </h3>
                                <div className="prose prose-slate prose-p:text-slate-600 prose-li:text-slate-600 max-w-none bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                    <div className="whitespace-pre-wrap">{loker.deskripsi}</div>
                                </div>
                            </section>

                            {/* QUALIFICATIONS */}
                            {(loker.kualifikasi && loker.kualifikasi.length > 0) && (
                                <section>
                                    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <div className="w-1 h-6 bg-purple-600 rounded-full" />
                                        Kualifikasi
                                    </h3>
                                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                        <ul className="grid grid-cols-1 gap-3">
                                            {loker.kualifikasi.map((item, i) => (
                                                <li key={i} className="flex gap-3 items-start">
                                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                    <span className="text-slate-700">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </section>
                            )}

                            {/* CONTACT INFO */}
                            <section>
                                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <div className="w-1 h-6 bg-orange-500 rounded-full" />
                                    Informasi Kontak
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {loker.kontak_person && (
                                        <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="text-xs text-slate-400 font-semibold uppercase">CP / HRD</div>
                                                <div className="font-medium text-slate-800">{loker.kontak_person}</div>
                                            </div>
                                        </div>
                                    )}
                                    {loker.kontak_email && (
                                        <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                                                <Mail className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="text-xs text-slate-400 font-semibold uppercase">Email</div>
                                                <div className="font-medium text-slate-800">{loker.kontak_email}</div>
                                            </div>
                                        </div>
                                    )}
                                    {loker.kontak_wa && (
                                        <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                            <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                                                <Phone className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="text-xs text-slate-400 font-semibold uppercase">WhatsApp / Telp</div>
                                                <div className="font-medium text-slate-800">{loker.kontak_wa}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>

                            <div className="pt-10">
                                <Button className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xl shadow-blue-200">
                                    Lamar Sekarang
                                </Button>
                            </div>
                        </div>

                    </div>
                </div>

                <Separator className="my-12" />

                {/* BOTTOM SECTION: SIMILAR JOBS */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-bold text-slate-900">Lowongan Serupa</h3>
                        <Link href="/vip/loker" className="text-blue-600 font-medium hover:underline flex items-center gap-1">
                            Lihat Semua <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {similar.length > 0 ? similar.map(job => (
                            <Link href={`/vip/loker/design-2`} key={job.id} className="group">
                                {/* Note: In real app, href should likely be dynamic or point to [id] */}
                                <Card className="h-full hover:shadow-xl hover:shadow-slate-200 transition-all duration-300 border-slate-100 overflow-hidden group-hover:-translate-y-1">
                                    <div className="aspect-[2/1] bg-slate-100 relative overflow-hidden">
                                        {job.poster_url ? (
                                            <img src={job.poster_url} className="w-full h-full object-cover" alt={job.title} />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-400">
                                                <Building2 className="w-10 h-10" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-slate-700 shadow-sm">
                                            {job.tipe_pekerjaan || 'Full-time'}
                                        </div>
                                    </div>
                                    <CardContent className="p-5">
                                        <h4 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">{job.title}</h4>
                                        <p className="text-slate-500 text-sm mb-4">{job.perusahaan_name}</p>

                                        <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                                            <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
                                                <MapPin className="w-3 h-3" /> {job.lokasi}
                                            </span>
                                            <span className="flex items-center gap-1 text-green-600">
                                                <DollarSign className="w-3 h-3" /> {job.gaji_min ? `${job.gaji_min / 1000000}jt+` : 'Kompetitif'}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        )) : (
                            <div className="col-span-3 text-center py-10 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                Tidak ada lowongan serupa saat ini.
                            </div>
                        )}
                    </div>
                </section>

            </main>
        </div>
    )
}
