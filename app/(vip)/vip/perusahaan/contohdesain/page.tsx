'use client'

import React, { useState } from 'react'
import { LayoutA_Classic } from '@/components/vip/designs/company-layouts/LayoutA_Classic'
import { LayoutB_Modern } from '@/components/vip/designs/company-layouts/LayoutB_Modern'
import { LayoutC_Creative } from '@/components/vip/designs/company-layouts/LayoutC_Creative'
import { LayoutD_Minimal } from '@/components/vip/designs/company-layouts/LayoutD_Minimal'
import { LayoutE_Enterprise } from '@/components/vip/designs/company-layouts/LayoutE_Enterprise'
import { dummyLoker, dummySimilar } from '@/components/vip/designs/dummyData'
import { Button } from '@/components/ui/button'
import { Monitor, Layers, Zap, Type, Building } from 'lucide-react'

// Extended Dummy Data for Company
const mockCompany = {
    id: "comp-demo-athree",
    slug: "athree-bakery",
    name: "Athree Bakery",
    logo_url: "https://ui-avatars.com/api/?name=Athree+Bakery&background=d97706&color=fff&size=200",
    industri: "F&B / Hospitality",
    ukuran: "50-200 Employees" as "Startup" | "UMKM" | "Menengah" | "Besar" | undefined,
    lokasi: "Jakarta Selatan, Indonesia",
    website: "https://athreebakery.com",
    email: "hr@athreebakery.com",
    whatsapp: "+628123456789",
    instagram: "@athree.bakery",
    deskripsi: `Athree Bakery adalah artisan bakery premium yang berdedikasi untuk menyajikan pengalaman kuliner terbaik. Dengan perpaduan teknik tradisional Prancis dan cita rasa lokal Indonesia, kami menciptakan produk bakery dan pastry yang tidak hanya lezat tetapi juga artistik.

Sejak didirikan pada tahun 2018, kami telah berkembang menjadi salah satu brand bakery terkemuka di Jakarta Selatan. Kami bangga dengan tim kami yang passionate dan lingkungan kerja yang dinamis.

Visi kami adalah menjadi bakery pilihan utama yang dikenal karena kualitas, inovasi, dan pelayanan yang hangat.`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
}

// Mock Jobs Array (duplicated for volume)
const mockJobs = [
    dummyLoker,
    { ...dummyLoker, id: "job-2", title: "Senior Backend Engineer", gaji_min: 15000000, gaji_max: 25000000 },
    { ...dummyLoker, id: "job-3", title: "Product Manager", gaji_min: 18000000, gaji_max: 28000000 },
    { ...dummyLoker, id: "job-4", title: "Marketing Specialist", gaji_min: 8000000, gaji_max: 12000000 },
]

export default function DesignShowcasePage() {
    const [activeLayout, setActiveLayout] = useState<'A' | 'B' | 'C' | 'D' | 'E'>('B')

    return (
        <div className="relative">
            {/* Floating Switcher */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900/90 backdrop-blur-md text-white px-3 py-2 rounded-full shadow-2xl border border-white/10 flex items-center gap-2 overflow-x-auto max-w-[95vw]">
                <Button
                    variant={activeLayout === 'A' ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setActiveLayout('A')}
                    className="rounded-full text-xs whitespace-nowrap"
                >
                    <Monitor className="w-3 h-3 mr-2" /> Classic
                </Button>
                <Button
                    variant={activeLayout === 'B' ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setActiveLayout('B')}
                    className="rounded-full text-xs whitespace-nowrap"
                >
                    <Layers className="w-3 h-3 mr-2" /> Modern
                </Button>
                <Button
                    variant={activeLayout === 'C' ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setActiveLayout('C')}
                    className="rounded-full text-xs whitespace-nowrap"
                >
                    <Zap className="w-3 h-3 mr-2" /> Creative
                </Button>
                <Button
                    variant={activeLayout === 'D' ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setActiveLayout('D')}
                    className="rounded-full text-xs whitespace-nowrap"
                >
                    <Type className="w-3 h-3 mr-2" /> Minimal
                </Button>
                <Button
                    variant={activeLayout === 'E' ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setActiveLayout('E')}
                    className="rounded-full text-xs whitespace-nowrap"
                >
                    <Building className="w-3 h-3 mr-2" /> Enterprise
                </Button>
            </div>

            {/* Layout Render */}
            <div className="min-h-screen">
                {activeLayout === 'A' && <LayoutA_Classic company={mockCompany} loker={mockJobs} />}
                {activeLayout === 'B' && <LayoutB_Modern company={mockCompany} loker={mockJobs} />}
                {activeLayout === 'C' && <LayoutC_Creative company={mockCompany} loker={mockJobs} />}
                {activeLayout === 'D' && <LayoutD_Minimal company={mockCompany} loker={mockJobs} />}
                {activeLayout === 'E' && <LayoutE_Enterprise company={mockCompany} loker={mockJobs} />}
            </div>
        </div>
    )
}
