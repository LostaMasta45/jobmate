import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { LokerEditForm } from '@/components/admin/vip/LokerEditForm';

export const metadata: Metadata = {
  title: 'Edit Loker - Admin VIP Career',
  description: 'Edit lowongan pekerjaan',
};

export default async function EditLokerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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

  // Fetch loker
  const { data: loker, error } = await supabase
    .from('vip_loker')
    .select(`
      *,
      perusahaan:vip_perusahaan(*)
    `)
    .eq('id', id)
    .single();

  if (error || !loker) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Edit Loker</h1>
          <p className="text-gray-600 mt-2">
            Update informasi lowongan pekerjaan
          </p>
        </div>

        {/* Form */}
        <LokerEditForm loker={loker} />
      </div>
    </div>
  );
}
