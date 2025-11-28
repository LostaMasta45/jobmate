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
    <div className="space-y-8 pb-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Member Management</h1>
            <p className="text-muted-foreground mt-1">
              Monitor and manage user memberships and access levels.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="hidden sm:flex">
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <VipStatsCard
            title="Total Users"
            value={totalUsers}
            icon="Users" 
            description="All registered accounts"
            color="text-blue-600"
            delay={0}
          />
          <VipStatsCard
            title="Free Users"
            value={freeUsers}
            icon="FileText" 
            description="Basic access only"
            color="text-gray-600"
            delay={0.1}
          />
          <VipStatsCard
            title="VIP Basic"
            value={basicMembers}
            icon="Crown"
            description="Active Basic plans"
            color="text-blue-500"
            delay={0.2}
          />
          <VipStatsCard
            title="VIP Premium"
            value={premiumMembers}
            icon="Crown"
            description="Active Premium plans"
            color="text-purple-600"
            delay={0.3}
          />
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
             <MemberTable memberList={memberList || []} />
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-900/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400 mt-1">
                    <Info className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      Membership Tiers
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">Free User</div>
                        <p className="text-xs text-blue-700/80 dark:text-blue-300/80">
                          Access to basic tools (CV, Email, WA Generator).
                        </p>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">VIP Basic</div>
                        <p className="text-xs text-blue-700/80 dark:text-blue-300/80">
                          All tools + VIP Jobs access (30 days).
                        </p>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">VIP Premium</div>
                        <p className="text-xs text-blue-700/80 dark:text-blue-300/80">
                          Full access + Lifetime VIP Jobs + Priority Support.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

             <Card className="border-none shadow-sm bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-900/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-green-500/10 p-2 text-green-600 dark:text-green-400 mt-1">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                      Quick Actions
                    </h3>
                    <ul className="text-xs text-green-800/80 dark:text-green-200/80 list-disc pl-4 space-y-1">
                      <li>Use the dropdown menu on each row to upgrade/downgrade users.</li>
                      <li>Extend memberships directly from the action menu.</li>
                      <li>Search by email or name to find specific users quickly.</li>
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
