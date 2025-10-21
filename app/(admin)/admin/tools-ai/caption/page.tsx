import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { CaptionGeneratorTool } from '@/components/admin/vip/CaptionGeneratorTool';

export const metadata: Metadata = {
  title: 'AI Caption Generator - Admin VIP Career',
  description: 'Generate caption menarik dengan AI',
};

export default async function CaptionGeneratorPage() {
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

  return (
    <div className="space-y-6">
      <CaptionGeneratorTool />
    </div>
  );
}
