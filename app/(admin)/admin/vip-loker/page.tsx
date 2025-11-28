import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Sparkles } from 'lucide-react';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { VipStatsCard } from "@/components/admin/vip/VipStatsCard";
import { VipLokerTable } from "@/components/admin/vip/VipLokerTable";

export const metadata: Metadata = {
  title: 'Manage Jobs - Admin VIP Career',
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

  const totalLoker = lokerList?.length || 0;
  const publishedLoker = lokerList?.filter(l => l.status === 'published').length || 0;
  const companiesCount = new Set(lokerList?.map(l => l.perusahaan_id)).size || 0;
  const aiParsedCount = lokerList?.filter(l => l.sumber === 'Poster').length || 0;

  return (
    <div className="space-y-8 pb-8 animate-in fade-in duration-500">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Job Management</h1>
            <p className="text-muted-foreground mt-1">
              Create, edit, and manage job postings with AI support.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin/vip-loker/tambah">
              <Button className="shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                <Sparkles className="mr-2 h-4 w-4" /> New Job Post
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <VipStatsCard
            title="Total Jobs"
            value={totalLoker}
            icon="Briefcase"
            description="All time postings"
            color="text-blue-600"
            delay={0}
          />
          <VipStatsCard
            title="Published"
            value={publishedLoker}
            icon="CheckCircle"
            description="Currently live"
            color="text-emerald-600"
            delay={0.1}
          />
          <VipStatsCard
            title="AI Parsed"
            value={aiParsedCount}
            icon="Sparkles"
            description="Generated from posters"
            color="text-purple-600"
            delay={0.2}
          />
          <VipStatsCard
            title="Companies"
            value={companiesCount}
            icon="Building2"
            description="With job postings"
            color="text-amber-600"
            delay={0.3}
          />
        </div>

        {/* Loker Table */}
        <VipLokerTable lokerList={lokerList || []} />
    </div>
  );
}
