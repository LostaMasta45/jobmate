'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Globe, Mail, Phone, Instagram, Briefcase, Users, CheckCircle2, Building2, ArrowRight, Clock, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { Perusahaan, Loker } from '@/types/vip'

// Mock Data Interfaces
interface LayoutProps {
    company: Perusahaan & {
        loker_count?: number
        deskripsi?: string
        banner_url?: string
    }
    loker: Loker[]
}

// Inline Classic Card Component for better control
function ClassicJobCard({ job }: { job: Loker }) {
    return (
        <div className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:border-blue-500 hover:shadow-md transition-all duration-300 flex flex-col h-full">
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
                        <span>Posted recently</span>
                    </div>
                    {job.gaji_min && job.gaji_max && (
                        <div className="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-200">
                            <DollarSign className="w-4 h-4 text-green-500" />
                            <span>IDR {(job.gaji_min / 1000000).toFixed(0)} - {(job.gaji_max / 1000000).toFixed(0)} Juta</span>
                        </div>
                    )}
                </div>

                <Button className="w-full bg-white text-blue-600 border border-blue-200 hover:bg-blue-600 hover:text-white dark:bg-gray-700 dark:text-blue-400 dark:border-gray-600 dark:hover:bg-blue-600 dark:hover:text-white transition-all group-hover:shadow-lg">
                    View Details <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </div>
    )
}

export function LayoutA_Classic({ company, loker }: LayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans pb-20">
            {/* 1. Header Section - Clean Corporate Style */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm relative z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 text-center md:text-left">
                        {/* Logo Box */}
                        <div className="w-28 h-28 md:w-36 md:h-36 bg-white dark:bg-gray-700 rounded-xl shadow-md border border-gray-100 dark:border-gray-600 p-3 flex items-center justify-center flex-shrink-0 relative -mt-4 md:mt-0">
                            {company.logo_url ? (
                                <img src={company.logo_url} alt={company.name} className="w-full h-full object-contain" />
                            ) : (
                                <Building2 className="w-12 h-12 text-gray-400" />
                            )}
                        </div>

                        {/* Header Info */}
                        <div className="flex-1 space-y-4">
                            <div>
                                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">{company.name}</h1>
                                    <CheckCircle2 className="w-6 h-6 text-blue-500" />
                                </div>

                                <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-6 text-sm md:text-base text-gray-600 dark:text-gray-300">
                                    {company.industri && (
                                        <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                                            <Briefcase className="w-4 h-4 text-gray-500" />
                                            <span>{company.industri}</span>
                                        </div>
                                    )}
                                    {company.lokasi && (
                                        <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                                            <MapPin className="w-4 h-4 text-gray-500" />
                                            <span>{company.lokasi}</span>
                                        </div>
                                    )}
                                    {company.website && (
                                        <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-800/50">
                                            <Globe className="w-4 h-4 text-blue-600" />
                                            <a href={company.website} target="_blank" className="text-blue-600 hover:underline font-medium">Visit Website</a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 w-full md:w-auto">
                            <Button className="flex-1 md:flex-none">Follow</Button>
                            <Button variant="outline" className="flex-1 md:flex-none">Contact</Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Left/Main Content */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* About Section */}
                        <section className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                <span className="w-1.5 h-8 bg-blue-600 rounded-full" />
                                About Us
                            </h2>
                            <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
                                <p className="whitespace-pre-wrap">{company.deskripsi || "No description available."}</p>
                            </div>
                        </section>

                        {/* Job Listings with Classic Inline Cards */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                    <span className="w-1.5 h-8 bg-blue-600 rounded-full" />
                                    Open Positions
                                </h2>
                                <Badge variant="secondary" className="text-base px-4 py-1.5">{loker.length} Jobs</Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {loker.map(job => (
                                    <ClassicJobCard key={job.id} job={job} />
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Sidebar - Sticky on Desktop */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="sticky top-24 space-y-6">
                            <Card className="rounded-2xl shadow-sm overflow-hidden border-gray-200 dark:border-gray-700">
                                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-b border-gray-100 dark:border-gray-700">
                                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">Company Data</h3>
                                </div>
                                <CardContent className="p-6 space-y-4">
                                    <div className="space-y-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-gray-500 text-sm uppercase tracking-wider font-medium">Industry</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">{company.industri}</span>
                                        </div>
                                        <div className="h-px bg-gray-100 dark:bg-gray-700" />
                                        <div className="flex flex-col gap-1">
                                            <span className="text-gray-500 text-sm uppercase tracking-wider font-medium">Size</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">{company.ukuran || "Unknown"}</span>
                                        </div>
                                        <div className="h-px bg-gray-100 dark:bg-gray-700" />
                                        <div className="flex flex-col gap-1">
                                            <span className="text-gray-500 text-sm uppercase tracking-wider font-medium">Headquarters</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">{company.lokasi}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="rounded-2xl shadow-sm overflow-hidden border-gray-200 dark:border-gray-700">
                                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-b border-gray-100 dark:border-gray-700">
                                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">Contact</h3>
                                </div>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        {company.email && (
                                            <a href={`mailto:${company.email}`} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                                <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm text-blue-500">
                                                    <Mail className="w-4 h-4" />
                                                </div>
                                                <span className="font-medium text-sm truncate">{company.email}</span>
                                            </a>
                                        )}
                                        {company.whatsapp && (
                                            <a href="#" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-green-50 hover:text-green-600 transition-colors">
                                                <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm text-green-500">
                                                    <Phone className="w-4 h-4" />
                                                </div>
                                                <span className="font-medium text-sm">{company.whatsapp}</span>
                                            </a>
                                        )}
                                        {company.instagram && (
                                            <a href="#" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-pink-50 hover:text-pink-600 transition-colors">
                                                <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm text-pink-500">
                                                    <Instagram className="w-4 h-4" />
                                                </div>
                                                <span className="font-medium text-sm">{company.instagram}</span>
                                            </a>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
