import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Briefcase, Shield, Phone, Mail } from 'lucide-react';
import { getAllPerusahaan } from '@/actions/admin/perusahaan';
import { PerusahaanTable } from '@/components/admin/vip/PerusahaanTable';

export const metadata: Metadata = {
  title: 'Kelola Perusahaan - Admin VIP Career',
  description: 'Monitoring dan verifikasi perusahaan lokal',
};

export default async function AdminPerusahaanPage() {
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

  const { data: perusahaanList } = await getAllPerusahaan();

  // Calculate stats
  const totalPerusahaan = perusahaanList?.length || 0;
  const verifiedPerusahaan = perusahaanList?.filter(p => p.verified).length || 0;
  const totalLoker = perusahaanList?.reduce((sum, p) => sum + (p.loker_count || 0), 0) || 0;

  return (
    <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Kelola Perusahaan</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Monitoring dan verifikasi perusahaan lokal Jombang
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Perusahaan</p>
                <p className="text-2xl font-bold">{totalPerusahaan}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-950 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Terverifikasi</p>
                <p className="text-2xl font-bold">{verifiedPerusahaan}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-950 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Loker</p>
                <p className="text-2xl font-bold">{totalLoker}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Perusahaan Table */}
        <PerusahaanTable perusahaanList={perusahaanList || []} />
    </div>
  );
}
