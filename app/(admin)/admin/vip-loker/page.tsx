import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, MapPin, Briefcase, Calendar, Building2 } from 'lucide-react';
import { LokerActionButtons } from '@/components/admin/vip/LokerActionButtons';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';

export const metadata: Metadata = {
  title: 'Kelola Loker - Admin VIP Career',
  description: 'Kelola lowongan pekerjaan VIP Career',
};

export default async function AdminVipLokerPage() {
  const supabase = await createClient();

  // Check admin auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect('/dashboard');
  }

  // Fetch loker dengan perusahaan info
  const { data: lokerList, error } = await supabase
    .from('vip_loker')
    .select(`
      *,
      perusahaan:vip_perusahaan(name, lokasi)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching loker:', error);
  }

  return (
    <div className="space-y-6">
        {/* Breadcrumb */}
        <AdminBreadcrumb />
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Kelola Loker VIP</h1>
            <p className="text-gray-600 mt-2">
              Manage lowongan pekerjaan dengan AI parsing
            </p>
          </div>
          <Link href="/admin/vip-loker/tambah">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Loker
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Loker</p>
                <p className="text-2xl font-bold">{lokerList?.length || 0}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Published</p>
                <p className="text-2xl font-bold">
                  {lokerList?.filter(l => l.status === 'published').length || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Perusahaan</p>
                <p className="text-2xl font-bold">
                  {new Set(lokerList?.map(l => l.perusahaan_id)).size || 0}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Loker List */}
        <div className="space-y-4">
          {lokerList && lokerList.length > 0 ? (
            lokerList.map((loker: any) => (
              <Card key={loker.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{loker.title}</h3>
                      <Badge 
                        variant="outline" 
                        className={loker.status === 'published' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700'}
                      >
                        {loker.status}
                      </Badge>
                      {loker.sumber === 'Poster' && (
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          AI Parsed
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        <span>{loker.perusahaan?.name || loker.perusahaan_name || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{loker.lokasi}</span>
                      </div>
                      {loker.tipe_kerja && (
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          <span>{loker.tipe_kerja}</span>
                        </div>
                      )}
                    </div>

                    {loker.kategori && loker.kategori.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {loker.kategori.map((kat: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {kat}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {loker.gaji_text && (
                      <p className="text-sm text-gray-600">
                        💰 {loker.gaji_text}
                      </p>
                    )}

                    <p className="text-xs text-gray-400 mt-2">
                      Dibuat: {new Date(loker.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>

                  <LokerActionButtons 
                    lokerId={loker.id}
                    lokerTitle={loker.title}
                  />
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-12 text-center">
              <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Briefcase className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Belum Ada Loker</h3>
              <p className="text-gray-600 mb-6">
                Mulai tambahkan lowongan pekerjaan dengan AI parsing
              </p>
              <Link href="/admin/vip-loker/tambah">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Loker Pertama
                </Button>
              </Link>
            </Card>
          )}
        </div>
    </div>
  );
}
