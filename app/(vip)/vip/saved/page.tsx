import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LokerCard } from '@/components/vip/LokerCard'
import { Bookmark, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Loker Tersimpan - VIP Career Jombang',
  description: 'Daftar lowongan kerja yang telah Anda simpan',
}

export default async function SavedLokerPage() {
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/sign-in')
  }

  // Get user's bookmarks with loker details
  const { data: bookmarks } = await supabase
    .from('vip_member_bookmarks')
    .select(`
      id,
      created_at,
      loker:vip_loker(
        *,
        perusahaan:vip_perusahaan(*)
      )
    `)
    .eq('member_id', user.id)
    .order('created_at', { ascending: false })

  // Transform data
  const savedLoker = bookmarks
    ?.map((bookmark) => ({
      ...bookmark.loker,
      is_bookmarked: true,
    }))
    .filter(Boolean) as any[]

  return (
    <div className="space-y-4 sm:space-y-6 overflow-x-hidden pb-20 sm:pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Loker Tersimpan</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
          Daftar lowongan kerja yang telah Anda simpan untuk dilamar nanti
        </p>
      </div>

      {/* Content */}
      {savedLoker && savedLoker.length > 0 ? (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold text-gray-900 dark:text-gray-100">{savedLoker.length}</span> loker
              tersimpan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedLoker.map((loker) => (
              <LokerCard key={loker.id} loker={loker} />
            ))}
          </div>
        </>
      ) : (
        // Empty State
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-950 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bookmark className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Belum Ada Loker Tersimpan
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Simpan lowongan kerja yang menarik untuk Anda dengan klik tombol bookmark, agar mudah
            diakses nanti
          </p>
          <Button asChild size="lg">
            <Link href="/vip/loker" className="gap-2">
              Cari Loker
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
