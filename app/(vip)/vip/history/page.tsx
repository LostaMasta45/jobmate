import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Clock, Briefcase, MapPin, Calendar, Building2, Eye, ArrowRight, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Terakhir Kali Dilihat - VIP Career Jombang',
  description: 'Riwayat lowongan kerja yang terakhir Anda lihat',
}

// Format time ago helper
function getTimeAgo(date: string) {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now.getTime() - past.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 60) return `${diffMins} menit lalu`
  if (diffHours < 24) return `${diffHours} jam lalu`
  if (diffDays === 1) return '1 hari lalu'
  if (diffDays < 7) return `${diffDays} hari lalu`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`
  return `${Math.floor(diffDays / 30)} bulan lalu`
}

export default async function HistoryPage() {
  const supabase = await createClient()
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/sign-in')
  }

  // Get recently viewed loker from vip_member_views (same as desktop dashboard)
  const { data: viewedData, error: viewError } = await supabase
    .from('vip_member_views')
    .select(`
      id,
      loker_id,
      viewed_at,
      loker:vip_loker!vip_member_views_loker_id_fkey(
        *,
        perusahaan:vip_perusahaan(*)
      )
    `)
    .eq('member_id', user.id)
    .order('viewed_at', { ascending: false })
    .limit(50)

  if (viewError) {
    console.error('[VIP History] Error fetching views:', viewError)
  }

  // Transform to match the UI format
  const recentJobs = viewedData
    ?.filter((v: any) => v.loker && v.loker.status === 'published')
    .map((v: any) => {
      const loker = v.loker
      const perusahaan = loker.perusahaan || {}
      
      return {
        view_id: v.id, // Unique ID from vip_member_views for React key
        id: loker.id, // Loker ID for linking to detail page
        company: perusahaan.name || 'Perusahaan',
        position: loker.title,
        location: loker.lokasi || 'Jombang',
        salary: loker.gaji_text || (loker.gaji_min && loker.gaji_max 
          ? `Rp ${loker.gaji_min.toLocaleString()} - Rp ${loker.gaji_max.toLocaleString()}`
          : 'Gaji Negosiasi'),
        type: loker.tipe_pekerjaan || 'Full Time',
        postedDate: getTimeAgo(loker.created_at),
        viewedAt: getTimeAgo(v.viewed_at),
        logo: perusahaan.logo_url,
        isUrgent: loker.is_featured || false,
        perusahaan_logo: perusahaan.logo_url,
      }
    }) || []

  return (
    <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-8 overflow-x-hidden">
      {/* Header - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-emerald-600 dark:text-emerald-400" />
            Terakhir Kali Dilihat
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            Lowongan kerja yang terakhir Anda lihat
          </p>
        </div>
        <Button variant="outline" asChild className="w-full sm:w-auto">
          <Link href="/vip/loker">
            <Sparkles className="mr-2 h-4 w-4" />
            Cari Loker
          </Link>
        </Button>
      </div>

      {/* Stats Summary - Mobile Optimized */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 w-full">
        <Card className="shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <CardContent className="p-3 sm:p-4 md:pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 min-w-0">
              <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
                <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="min-w-0">
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white truncate">
                  {recentJobs.length}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 truncate">Total Dilihat</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <CardContent className="p-3 sm:p-4 md:pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 min-w-0">
              <div className="p-1.5 sm:p-2 rounded-lg bg-orange-50 dark:bg-orange-950/30">
                <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="min-w-0">
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white truncate">
                  {recentJobs.filter(j => j.isUrgent).length}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 truncate">Mendesak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <CardContent className="p-3 sm:p-4 md:pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 min-w-0">
              <div className="p-1.5 sm:p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900 dark:text-white truncate">
                  Hari Ini
                </p>
                <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 truncate">Terakhir Buka</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <CardContent className="p-3 sm:p-4 md:pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 min-w-0">
              <div className="p-1.5 sm:p-2 rounded-lg bg-purple-50 dark:bg-purple-950/30">
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="min-w-0">
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white truncate">
                  {new Set(recentJobs.map(j => j.company)).size}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 truncate">Perusahaan</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Viewed Jobs - Mobile Optimized */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
          Lowongan yang Baru Dilihat
        </h2>
        
        {recentJobs.length === 0 ? (
          <Card>
            <CardContent className="py-8 sm:py-12 text-center">
              <Eye className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 dark:text-gray-500 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Belum Ada Riwayat
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
                Mulai cari lowongan kerja untuk melihat riwayat
              </p>
              <Link href="/vip/loker">
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                  Cari Lowongan
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-2 sm:gap-3 md:gap-4">
            {recentJobs.map((job) => (
              <Card key={job.view_id} className="hover:shadow-lg transition-all hover:border-emerald-300 dark:hover:border-emerald-700 group overflow-hidden">
                <CardContent className="p-3 sm:p-4 md:p-6">
                  <div className="flex items-start gap-2.5 sm:gap-3 md:gap-4 w-full">
                    {/* Company Logo */}
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 flex items-center justify-center border border-emerald-200 dark:border-emerald-800 overflow-hidden">
                      {job.perusahaan_logo ? (
                        <img 
                          src={job.perusahaan_logo} 
                          alt={job.company}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Building2 className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-emerald-600 dark:text-emerald-400" />
                      )}
                    </div>
                    
                    {/* Job Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1.5 sm:mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                            {job.position}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium truncate">
                            {job.company}
                          </p>
                        </div>
                        {job.isUrgent && (
                          <Badge className="bg-red-500 text-white border-0 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 flex-shrink-0">
                            Mendesak
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-3 max-w-full">
                        <span className="flex items-center gap-1 min-w-0 max-w-[45%]">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate text-[11px] sm:text-xs">{job.location}</span>
                        </span>
                        <span className="flex items-center gap-1 min-w-0 max-w-[45%]">
                          <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate text-[11px] sm:text-xs">{job.type}</span>
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-semibold mb-2 sm:mb-3 max-w-full overflow-hidden">
                        <span className="flex-shrink-0">💰</span>
                        <span className="truncate text-[11px] sm:text-xs">{job.salary}</span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 w-full">
                        <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 overflow-hidden">
                          <Badge variant="outline" className="text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 whitespace-nowrap">
                            <Calendar className="w-2 h-2 sm:w-2.5 sm:h-2.5 mr-0.5" />
                            <span className="truncate max-w-[60px] sm:max-w-none">{job.postedDate}</span>
                          </Badge>
                          <Badge variant="outline" className="text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 whitespace-nowrap">
                            <Clock className="w-2 h-2 sm:w-2.5 sm:h-2.5 mr-0.5" />
                            <span className="truncate max-w-[60px] sm:max-w-none">{job.viewedAt}</span>
                          </Badge>
                        </div>
                        
                        <Link href={`/vip/loker/${job.id}`} className="w-full sm:w-auto flex-shrink-0">
                          <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 w-full sm:w-auto text-[11px] sm:text-sm h-7 sm:h-9 px-3 sm:px-4"
                          >
                            <span className="sm:hidden">Detail</span>
                            <span className="hidden sm:inline">Lihat Detail</span>
                            <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions - Mobile Optimized */}
      <Card>
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Aksi Cepat</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <Link href="/vip/loker">
              <Button variant="outline" className="w-full h-auto flex-col gap-1.5 sm:gap-2 py-3 sm:py-4 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:border-emerald-300 dark:hover:border-emerald-700">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[10px] sm:text-xs">Cari Loker Baru</span>
              </Button>
            </Link>
            
            <Link href="/vip/perusahaan">
              <Button variant="outline" className="w-full h-auto flex-col gap-1.5 sm:gap-2 py-3 sm:py-4 hover:bg-teal-50 dark:hover:bg-teal-950/30 hover:border-teal-300 dark:hover:border-teal-700">
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 dark:text-teal-400" />
                <span className="text-[10px] sm:text-xs">Perusahaan</span>
              </Button>
            </Link>
            
            <Link href="/tools/tracker">
              <Button variant="outline" className="w-full h-auto flex-col gap-1.5 sm:gap-2 py-3 sm:py-4 hover:bg-purple-50 dark:hover:bg-purple-950/30 hover:border-purple-300 dark:hover:border-purple-700">
                <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-[10px] sm:text-xs">Job Tracker</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Info Banner - Mobile Optimized */}
      <Card className="border-emerald-200 dark:border-emerald-800 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex-shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1">
                Tips Pencarian Kerja
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Simpan lowongan yang menarik dengan klik tombol Save, dan pantau proses lamaran Anda di Job Tracker!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
