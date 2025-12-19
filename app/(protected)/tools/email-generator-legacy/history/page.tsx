import { AppShell } from "@/components/layout/AppShell";
import { getProfile } from "@/lib/supabase/server";
import { EmailHistory } from "@/components/email-generator-legacy/EmailHistory";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Sparkles } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function EmailHistoryPage() {
  const profile = await getProfile();
  const isAdmin = profile?.role === 'admin';

  return (
    <AppShell isAdmin={isAdmin}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-3 shadow-lg">
              <Mail className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Email History</h1>
              <p className="text-muted-foreground">
                Kelola email lamaran yang pernah kamu buat
              </p>
            </div>
          </div>

          <Link href="/tools/email-generator">
            <Button className="gap-2">
              <Sparkles className="h-4 w-4" />
              Buat Email Baru
            </Button>
          </Link>
        </div>

        {/* History List */}
        <EmailHistory />

        {/* Back to Dashboard */}
        <div className="flex justify-center pt-6">
          <Link href="/dashboard">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
