'use client'

import React from 'react'
import { MapPin, Globe, Mail, Phone, Building, Users, Briefcase, ChevronRight, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import type { Perusahaan, Loker } from '@/types/vip'

interface LayoutProps {
    company: Perusahaan & {
        loker_count?: number
        deskripsi?: string
        banner_url?: string
    }
    loker: Loker[]
}

export function LayoutE_Enterprise({ company, loker }: LayoutProps) {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">

            {/* Top Banner Area */}
            <div className="h-64 bg-slate-900 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-800" />

                {/* Breadcrumb-ish */}
                <div className="absolute top-6 left-0 right-0 px-8 flex justify-between items-center text-slate-400 text-sm">
                    <div>Home / Companies / {company.name}</div>
                    <Button variant="ghost" className="text-white hover:bg-white/10 gap-2">
                        <Share2 className="w-4 h-4" /> Share Profile
                    </Button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-20 pb-20">

                {/* Header Card */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-8 flex flex-col md:flex-row items-center md:items-end gap-6">
                    <div className="w-32 h-32 bg-white rounded-lg shadow-md -mt-16 p-2 ring-4 ring-white">
                        {company.logo_url ? <img src={company.logo_url} className="w-full h-full object-contain" /> : <div className="bg-slate-200 w-full h-full" />}
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">{company.name}</h1>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-600 text-sm">
                            <div className="flex items-center gap-1"><Building className="w-4 h-4" /> {company.industri}</div>
                            <div className="flex items-center gap-1"><Users className="w-4 h-4" /> {company.ukuran || 'Enterprise'}</div>
                            <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {company.lokasi}</div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button variant="outline">Follow</Button>
                        <Button className="bg-blue-700 hover:bg-blue-800">Visit Website</Button>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Left Sidebar Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card>
                            <CardHeader className="pb-3 border-b border-slate-100">
                                <CardTitle className="text-base font-bold text-slate-800">Company Details</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-4 text-sm">
                                <div>
                                    <div className="text-slate-500 mb-1">Founded</div>
                                    <div className="font-semibold">2018</div>
                                </div>
                                <div>
                                    <div className="text-slate-500 mb-1">Specialties</div>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 font-normal">Sourdough</Badge>
                                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 font-normal">Pastry</Badge>
                                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 font-normal">Coffee</Badge>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-slate-500 mb-1">Social Media</div>
                                    <div className="flex gap-2 text-blue-600">
                                        <Globe className="w-5 h-5 cursor-pointer" />
                                        <Mail className="w-5 h-5 cursor-pointer" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-8">

                        {/* Tabs Navigation (Mock) */}
                        <div className="flex border-b border-slate-200 gap-8 text-sm font-medium">
                            <div className="pb-3 border-b-2 border-blue-600 text-blue-600">Overview</div>
                            <div className="pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 cursor-pointer">Jobs ({loker.length})</div>
                            <div className="pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 cursor-pointer">Life at Athree</div>
                            <div className="pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 cursor-pointer">Teams</div>
                        </div>

                        <div className="bg-white p-6 rounded-lg border border-slate-200">
                            <h2 className="text-lg font-bold mb-4 text-slate-900">About Us</h2>
                            <p className="text-slate-600 leading-relaxed">
                                {company.deskripsi}
                            </p>
                        </div>

                        <div>
                            <h2 className="text-lg font-bold mb-4 text-slate-900 flex items-center gap-2">
                                Current Openings <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">{loker.length}</Badge>
                            </h2>
                            <div className="space-y-4">
                                {loker.map(job => (
                                    <div key={job.id} className="bg-white p-5 rounded-lg border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-lg hover:text-blue-600 cursor-pointer">{job.title}</h3>
                                            <div className="flex gap-4 text-sm text-slate-500 mt-1">
                                                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.lokasi}</span>
                                                <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {job.tipe_pekerjaan}</span>
                                            </div>
                                        </div>
                                        <Button size="sm" className="bg-blue-700 hover:bg-blue-800">
                                            View Details <ChevronRight className="w-4 h-4 ml-1" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
