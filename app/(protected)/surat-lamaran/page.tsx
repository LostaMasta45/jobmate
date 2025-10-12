import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { getProfile } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { CoverLetterList } from "@/components/surat-lamaran/CoverLetterList";

export default async function SuratLamaranPage() {
  const profile = await getProfile();
  const isAdmin = profile?.role === 'admin';

  return (
    <AppShell isAdmin={isAdmin}>
      <div className="flex items-center justify-between">
        <PageHeader
          title="Surat Lamaran"
          description="Buat surat lamaran kerja format Indonesia yang professional & ATS-friendly"
        />
        <Link href="/surat-lamaran/buat">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Buat Surat Baru
          </Button>
        </Link>
      </div>

      <div className="mt-6">
        <CoverLetterList />
      </div>
    </AppShell>
  );
}
