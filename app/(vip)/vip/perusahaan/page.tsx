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
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Daftar Perusahaan</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Jelajahi perusahaan yang membuka lowongan kerja di Jombang
        </p>
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
