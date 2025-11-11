import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Building2, MapPin, Briefcase, Users, TrendingUp, Star, Search, Filter, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const metadata = {
  title: 'Daftar Perusahaan - VIP Career Jombang',
  description: 'Jelajahi perusahaan yang membuka lowongan kerja',
}

// Get companies from database
const getCompanies = async () => {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('vip_perusahaan')
      .select(`
        id,
        slug,
        name,
        logo_url,
        deskripsi,
        lokasi,
        industri,
        ukuran,
        verified,
        loker_count:vip_loker(count)
      `)
      .order('verified', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching companies:', error);
      return [];
    }

    // Process and format data
    return data?.map((company) => ({
      id: company.id,
      slug: company.slug,
      name: company.name,
      logo_url: company.logo_url,
      description: company.deskripsi || 'Perusahaan lokal Jombang',
      location: company.lokasi || 'Jombang',
      industry: company.industri || 'Umum',
      size: company.ukuran || 'UMKM',
      verified: company.verified || false,
      activeJobs: company.loker_count?.[0]?.count || 0,
      // Featured jika verified dan punya loker aktif
      featured: (company.verified && (company.loker_count?.[0]?.count || 0) > 0),
    })) || [];
  } catch (error) {
    console.error('Error in getCompanies:', error);
    return [];
  }
};

export default async function CompaniesPage() {
  const supabase = await createClient()
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/sign-in')
  }

  const companies = await getCompanies();
  const featuredCompanies = companies.filter(c => c.featured);
  const totalJobs = companies.reduce((sum, c) => sum + c.activeJobs, 0);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Building2 className="w-7 h-7 text-teal-600 dark:text-teal-400" />
          Daftar Perusahaan
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Jelajahi perusahaan yang membuka lowongan kerja
        </p>
      </div>

      {/* Search & Filter - Mobile Optimized */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Cari perusahaan..." 
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-4 pb-4 px-3">
            <div className="text-center">
              <Building2 className="w-5 h-5 text-teal-600 dark:text-teal-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {companies.length}
              </p>
              <p className="text-[10px] text-gray-600 dark:text-gray-400">Perusahaan</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4 pb-4 px-3">
            <div className="text-center">
              <Briefcase className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {totalJobs}
              </p>
              <p className="text-[10px] text-gray-600 dark:text-gray-400">Lowongan</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-4 px-3">
            <div className="text-center">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {companies.filter(c => c.verified).length}
              </p>
              <p className="text-[10px] text-gray-600 dark:text-gray-400">Terverifikasi</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Companies */}
      {featuredCompanies.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              Perusahaan Unggulan
            </h2>
          </div>
          
          <div className="grid gap-3">
            {featuredCompanies.map((company) => (
              <Card key={company.id} className="hover:shadow-lg transition-all hover:border-teal-300 dark:hover:border-teal-700 group">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Company Logo */}
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950 dark:to-cyan-950 flex items-center justify-center border-2 border-teal-200 dark:border-teal-800">
                      <Building2 className="w-7 h-7 text-teal-600 dark:text-teal-400" />
                    </div>
                    
                    {/* Company Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                          {company.name}
                        </h3>
                        {company.verified && (
                          <Badge variant="outline" className="text-[10px] border-teal-300 text-teal-700 dark:text-teal-400">
                            ✓ Verified
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        {company.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-400 mb-3">
                        <Badge variant="outline" className="text-[10px]">
                          <MapPin className="w-3 h-3 mr-1" />
                          {company.location}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          <Briefcase className="w-3 h-3 mr-1" />
                          {company.activeJobs} lowongan
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          <Building2 className="w-3 h-3 mr-1" />
                          {company.size}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700">
                          {company.industry}
                        </Badge>
                        
                        <Link href={`/vip/perusahaan/${company.slug}`}>
                          <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 h-8 text-xs"
                          >
                            Lihat Detail
                            <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Companies */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Semua Perusahaan
        </h2>
        
        <div className="grid gap-3">
          {companies.map((company) => (
            <Card key={company.id} className="hover:shadow-md transition-all hover:border-teal-200 dark:hover:border-teal-800 group">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  {/* Company Logo - Smaller for all companies list */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950 dark:to-cyan-950 flex items-center justify-center border border-teal-200 dark:border-teal-800">
                    <Building2 className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  
                  {/* Company Info - Compact */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        {company.name}
                      </h3>
                      {company.verified && (
                        <span className="text-teal-600 dark:text-teal-400 text-xs">✓</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-[11px] text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {company.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        {company.activeJobs}
                      </span>
                    </div>
                  </div>

                  {/* Action */}
                  <Link href={`/vip/companies/${company.id}`}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="border-teal-200 dark:border-teal-800 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/50 dark:to-cyan-950/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/50">
              <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Follow Perusahaan Favorit
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Dapatkan notifikasi saat perusahaan favorit membuka lowongan baru!
              </p>
              <Link href="/vip/loker">
                <Button size="sm" className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700">
                  Cari Lowongan
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
