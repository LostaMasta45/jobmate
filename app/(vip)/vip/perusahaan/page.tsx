import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PerusahaanListClient } from '@/components/vip/PerusahaanListClient'

export const metadata = {
  title: 'Daftar Perusahaan - VIP Career Jombang',
  description: 'Jelajahi perusahaan yang membuka lowongan kerja di Jombang',
}

export default async function PerusahaanListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/sign-in')
  }

  const search = (params.search as string) || ''

  // Build query
  let query = supabase
    .from('vip_perusahaan')
    .select('*', { count: 'exact' })
    .order('name', { ascending: true })

  // Apply search
  if (search) {
    query = query.or(`name.ilike.%${search}%,lokasi.ilike.%${search}%,industri.ilike.%${search}%`)
  }

  const { data: perusahaan, count } = await query

  // Get job counts for each company
  const perusahaanWithCounts = await Promise.all(
    (perusahaan || []).map(async (company) => {
      const { count: lokerCount } = await supabase
        .from('vip_loker')
        .select('*', { count: 'exact', head: true })
        .eq('perusahaan_id', company.id)
        .eq('status', 'published')

      return {
        ...company,
        loker_count: lokerCount || 0,
      }
    })
  )

  return (
    <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-8 overflow-x-hidden">
      {/* Header with Modern Gradient */}
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pt-8 pb-16 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-400/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
            Jelajahi <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Perusahaan</span> Ternama
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Temukan tempat terbaik untuk mengembangkan karirmu. Lebih dari <span className="font-bold text-gray-900 dark:text-white">{count || 0}+</span> perusahaan aktif mencari talenta seperti kamu.
          </p>
        </div>
      </div>

      {/* Client Component */}
      <PerusahaanListClient
        perusahaan={perusahaanWithCounts}
        totalResults={count || 0}
        initialSearch={search}
      />
    </div>
  )
}
