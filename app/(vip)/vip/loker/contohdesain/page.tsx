import { createClient } from '@/lib/supabase/server'
import { DesktopCard1Side } from '@/components/vip/designs/desktop-variants/DesktopCard1Side'
import { DesktopCard2Overlay } from '@/components/vip/designs/desktop-variants/DesktopCard2Overlay'


export const metadata = {
    title: 'Design Concepts - VIP Jombang',
}

export default async function DesignShowcasePage() {
    const supabase = await createClient()

    // Fetch real data
    const { data: realLoker } = await supabase
        .from('vip_loker')
        .select('*, perusahaan:vip_perusahaan(*)')
        .eq('status', 'published')
        .limit(6)
        .order('published_at', { ascending: false })

    const displayLoker = realLoker || []

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-black font-sans pb-32">

            <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-8 px-4 text-center sticky top-0 z-50 shadow-sm">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Desktop Designs</h1>
                        <p className="text-gray-500 text-sm">Full Poster Visibility & Rich Details</p>
                    </div>
                </div>
            </header>

            <div className="max-w-[1400px] mx-auto p-8 space-y-20">

                {/* DESKTOP B - USER PREFERRED */}
                <section>
                    <div className="mb-6 border-b-4 border-blue-600 pb-4 inline-block">
                        <h2 className="text-4xl font-black text-gray-900 dark:text-white">
                            Model B (Selected)
                        </h2>
                        <p className="text-gray-500 mt-1 font-medium">
                            Immersive Overlay • 2-Column Grid
                        </p>
                    </div>

                    {/* 2 COLUMN GRID FOR MODEL B */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {displayLoker.map((loker, i) => <DesktopCard2Overlay key={`${i}-d2`} loker={loker} />)}
                    </div>
                </section>

                <hr className="border-gray-300 dark:border-gray-800 border-2" />

                {/* DESKTOP A */}
                <section className="opacity-80 hover:opacity-100 transition-opacity">
                    <div className="mb-6 border-b border-gray-300 dark:border-gray-700 pb-4">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Model A (Alternative)
                        </h2>
                        <p className="text-gray-500 mt-1">
                            Side Layout
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {displayLoker.map((loker, i) => <DesktopCard1Side key={`${i}-d1`} loker={loker} />)}
                    </div>
                </section>

            </div>
        </div>
    )
}
