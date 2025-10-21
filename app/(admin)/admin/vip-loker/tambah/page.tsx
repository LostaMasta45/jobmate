import { Metadata } from 'next';
import { LokerFormWithAI } from '@/components/admin/vip/LokerFormWithAI';

export const metadata: Metadata = {
  title: 'Tambah Loker - Admin VIP Career',
  description: 'Upload poster loker untuk parsing otomatis dengan AI',
};

export default function TambahLokerPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Tambah Loker Baru</h1>
          <p className="text-gray-600 mt-2">
            Upload poster loker untuk parsing otomatis dengan AI
          </p>
        </div>

        <LokerFormWithAI />
      </div>
    </div>
  );
}
