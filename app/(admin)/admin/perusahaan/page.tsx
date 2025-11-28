import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getAllPerusahaan } from '@/actions/admin/perusahaan';
import { PerusahaanTable } from '@/components/admin/vip/PerusahaanTable';
import { VipStatsCard } from "@/components/admin/vip/VipStatsCard";
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Companies - Admin VIP Career',
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
    <div className="space-y-8 pb-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Company Management</h1>
            <p className="text-muted-foreground mt-1">
              Monitor and verify local companies in Jombang.
            </p>
          </div>
          <div className="flex items-center gap-2">
             <Button variant="outline" className="hidden sm:flex">
              <Download className="mr-2 h-4 w-4" /> Export Data
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <VipStatsCard
            title="Total Companies"
            value={totalPerusahaan}
            icon="Building2"
            description="Registered entities"
            color="text-blue-600"
            delay={0}
          />
          <VipStatsCard
            title="Verified"
            value={verifiedPerusahaan}
            icon="Shield" 
            description="Trusted partners"
            color="text-green-600"
            delay={0.1}
          />
          <VipStatsCard
            title="Active Jobs"
            value={totalLoker}
            icon="Briefcase"
            description="Total job posts"
            color="text-purple-600"
            delay={0.2}
          />
        </div>

        {/* Perusahaan Table */}
        <PerusahaanTable perusahaanList={perusahaanList || []} />
    </div>
  );
}
