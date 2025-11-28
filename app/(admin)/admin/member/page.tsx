import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Crown, Users, Star, Info, CheckCircle2, Download } from 'lucide-react';
import { getAllMembers } from '@/actions/admin/member';
import { MemberTable } from '@/components/admin/vip/MemberTable';
import { VipStatsCard } from '@/components/admin/vip/VipStatsCard';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Manage Members - JobMate Admin',
  description: 'Manage VIP Basic & Premium members',
};

export default async function AdminMemberPage() {
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

  const { data: memberList } = await getAllMembers();

  // Calculate stats
  const totalUsers = memberList?.length || 0;
  const freeUsers = memberList?.filter(m => m.membership === 'free' || !m.membership).length || 0;
  const basicMembers = memberList?.filter(m => m.membership === 'vip_basic').length || 0;
  const premiumMembers = memberList?.filter(m => m.membership === 'vip_premium').length || 0;

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              Member Management
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              Monitor and manage user memberships and access levels.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start md:self-center">
            <Button variant="outline" size="sm" className="h-9">
              <Download className="mr-2 h-4 w-4" /> 
              <span className="hidden sm:inline">Export CSV</span>
              <span className="sm:hidden">Export</span>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <VipStatsCard
            title="Total Users"
            value={totalUsers}
            icon="Users" 
            description="All accounts"
            color="text-blue-600"
            delay={0}
          />
          <VipStatsCard
            title="Free Users"
            value={freeUsers}
            icon="FileText" 
            description="Basic access"
            color="text-gray-600"
            delay={0.1}
          />
          <VipStatsCard
            title="VIP Basic"
            value={basicMembers}
            icon="Crown"
            description="Active Basic"
            color="text-blue-500"
            delay={0.2}
          />
          <VipStatsCard
            title="VIP Premium"
            value={premiumMembers}
            icon="Sparkles"
            description="Active Premium"
            color="text-purple-600"
            delay={0.3}
          />
        </div>

        <div className="grid gap-6 grid-cols-1 xl:grid-cols-4">
          {/* Main Content */}
          <div className="xl:col-span-3 min-w-0">
             <MemberTable memberList={memberList || []} />
          </div>

          {/* Sidebar Info */}
          <div className="space-y-4 xl:col-span-1">
            <Card className="border shadow-sm bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/10 dark:to-indigo-900/10">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400 shrink-0">
                    <Info className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-3">
                      Membership Tiers
                    </h3>
                    <div className="space-y-3">
                      <div className="pb-3 border-b border-blue-100 dark:border-blue-800/30 last:border-0 last:pb-0">
                        <div className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-0.5">Free User</div>
                        <p className="text-[11px] text-blue-700/70 dark:text-blue-300/70 leading-tight">
                          Basic tools access (CV, Email, WA Generator).
                        </p>
                      </div>
                      <div className="pb-3 border-b border-blue-100 dark:border-blue-800/30 last:border-0 last:pb-0">
                        <div className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-0.5">VIP Basic</div>
                        <p className="text-[11px] text-blue-700/70 dark:text-blue-300/70 leading-tight">
                          All tools + VIP Jobs access (30 days).
                        </p>
                      </div>
                      <div className="pb-3 border-b border-blue-100 dark:border-blue-800/30 last:border-0 last:pb-0">
                        <div className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-0.5">VIP Premium</div>
                        <p className="text-[11px] text-blue-700/70 dark:text-blue-300/70 leading-tight">
                          Full access + Lifetime VIP Jobs + Priority Support.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

             <Card className="border shadow-sm bg-gradient-to-br from-emerald-50/50 to-green-50/50 dark:from-emerald-950/10 dark:to-green-900/10">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-emerald-900 dark:text-emerald-100 mb-2">
                      Quick Actions
                    </h3>
                    <ul className="text-[11px] text-emerald-800/70 dark:text-emerald-200/70 list-disc pl-3 space-y-1.5 leading-tight">
                      <li>Manage memberships via dropdown menu.</li>
                      <li>Extend access instantly.</li>
                      <li>Search by email/name.</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
    </div>
  );
}
