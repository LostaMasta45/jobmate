import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Crown, Users, Star } from 'lucide-react';
import { getAllMembers } from '@/actions/admin/member';
import { MemberTable } from '@/components/admin/vip/MemberTable';

export const metadata: Metadata = {
  title: 'Kelola Member - Admin VIP Career',
  description: 'Kelola member VIP Basic & Premium',
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
  const totalVIP = basicMembers + premiumMembers;

  // Check expiring soon (within 7 days)
  const now = new Date();
  const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const expiringSoon = memberList?.filter(m => {
    if (!m.membership_expiry) return false;
    const expiry = new Date(m.membership_expiry);
    return expiry > now && expiry <= sevenDaysLater;
  }).length || 0;

  return (
    <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
            Kelola Member VIP
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Monitoring dan kelola member VIP Basic & Premium
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-2xl font-bold">{totalUsers}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Free Users</p>
                <p className="text-2xl font-bold">{freeUsers}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total VIP</p>
                <p className="text-2xl font-bold">{totalVIP}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">VIP Basic</p>
                <p className="text-2xl font-bold">{basicMembers}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-950 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">VIP Premium</p>
                <p className="text-2xl font-bold">{premiumMembers}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Info Box */}
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  💡 Cara Kerja Management Member
                </h3>
                <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-decimal list-inside">
                  <li><strong>Applications Page:</strong> User submit pengajuan → Admin approve → User jadi <strong>Free User</strong></li>
                  <li><strong>Member VIP Page (ini):</strong> Admin upgrade Free User → <strong>VIP Basic</strong> atau <strong>VIP Premium</strong></li>
                  <li><strong>Free User:</strong> Akses tools basic (CV, Email, WA Generator)</li>
                  <li><strong>VIP Basic:</strong> Akses semua tools + Loker VIP (expired setelah periode)</li>
                  <li><strong>VIP Premium:</strong> Akses full + Loker VIP (lifetime, tidak expired)</li>
                </ol>
              </div>
            </div>
          </div>
        </Card>

        {/* Member Table */}
        <MemberTable memberList={memberList || []} />
    </div>
  );
}
