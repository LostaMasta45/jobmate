import { Metadata } from 'next';
import { LokerFormWithAI } from '@/components/admin/vip/LokerFormWithAI';

export const metadata: Metadata = {
  title: 'Create Job - Admin VIP Career',
  description: 'Upload poster loker untuk parsing otomatis dengan AI',
};

export default function TambahLokerPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Create New Job</h1>
        <p className="text-muted-foreground">
          Upload a job poster to automatically parse details with AI, or fill in manually.
        </p>
      </div>

      <LokerFormWithAI />
    </div>
  );
}
