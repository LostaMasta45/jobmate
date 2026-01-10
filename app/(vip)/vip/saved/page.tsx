import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LokerCardGlass } from '@/components/vip/LokerCardGlass'
import { Bookmark, ArrowRight, Sparkles } from 'lucide-react'

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      {/* Premium Header */}
      <div className="relative overflow-hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-4 text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
                Koleksi <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Impian</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl">
                Simpan peluang karir terbaikmu di sini dan lamar saat kamu siap.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <Bookmark className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Tersimpan</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{savedLoker?.length || 0} <span className="text-base font-normal text-gray-500">Lowongan</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Content */}
        {savedLoker && savedLoker.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {savedLoker.map((loker) => (
              <LokerCardGlass key={loker.id} loker={loker} priority={true} />
            ))}
          </div>
        ) : (
          // Empty State Premium
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="relative w-32 h-32 mb-8 group">
              <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-full animate-ping opacity-20 group-hover:animate-none transition-all" />
              <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 rounded-full flex items-center justify-center border-2 border-dashed border-blue-200 dark:border-blue-800 group-hover:border-blue-500 transition-colors">
                <Sparkles className="w-12 h-12 text-blue-400 dark:text-blue-500 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Belum Ada Koleksi
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
              Jelajahi ribuan lowongan pekerjaan dan simpan yang paling menarik untuk dilamar nanti. Karir impianmu menunggu!
            </p>
            <Button asChild size="lg" className="rounded-full px-8 h-12 text-base font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 shadow-lg shadow-blue-500/25">
              <Link href="/vip/loker" className="gap-2">
                Mulai Menjelajah
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

