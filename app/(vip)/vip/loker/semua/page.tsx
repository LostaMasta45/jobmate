import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { JobCardSplit } from '@/components/mobile/cards/JobCardSplit'

export const metadata = {
    title: 'Semua Lowongan - VIP Career',
    description: 'Daftar lengkap semua lowongan kerja terbaru di VIP Career Jombang',
}

export default async function SemuaLokerPage() {
    const supabase = await createClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/sign-in')

    // Fetch all jobs (limit to 50 for now)
    const { data: jobs, error } = await supabase
        .from('vip_loker')
        .select('*, perusahaan:vip_perusahaan(*)')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(50)

    if (error) {
        console.error('Error fetching all jobs:', error)
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black pb-safe">
            {/* Sticky Header */}
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center gap-3">
                <Link href="/vip/loker" className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white" />
                </Link>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">Semua Lowongan</h1>
            </div>

            <div className="p-4">
                {jobs && jobs.length > 0 ? (
                    <div className="space-y-4">
                        {jobs.map(job => (
                            <JobCardSplit key={job.id} loker={job} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-500">
                        Belum ada lowongan tersedia.
                    </div>
                )}

                {jobs && jobs.length >= 50 && (
                    <div className="mt-8 text-center text-xs text-gray-400">
                        Menampilkan 50 lowongan terbaru
                    </div>
                )}
            </div>
        </div>
    )
}
