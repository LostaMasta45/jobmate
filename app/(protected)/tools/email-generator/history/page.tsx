import { AppShell } from "@/components/layout/AppShell";
import { getProfile } from "@/lib/supabase/server";
import { EmailHistory } from "@/components/email-generator-legacy/EmailHistory";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Sparkles, History } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function EmailGenerator2HistoryPage() {
    const profile = await getProfile();
    const isAdmin = profile?.role === 'admin';

    return (
        <AppShell isAdmin={isAdmin}>
            <div className="min-h-[calc(100vh-4rem)] flex flex-col">
                {/* Header */}
                <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b">
                    <div className="max-w-4xl mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Link href="/tools/email-generator">
                                    <Button variant="ghost" size="icon" className="h-9 w-9">
                                        <ArrowLeft className="h-5 w-5" />
                                    </Button>
                                </Link>
                                <div className="flex items-center gap-2">
                                    <div className="rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 p-2 shadow-lg">
                                        <History className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-bold">Riwayat Email</h1>
                                        <p className="text-sm text-muted-foreground hidden sm:block">
                                            Email lamaran yang pernah kamu buat
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Link href="/tools/email-generator">
                                <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80">
                                    <Sparkles className="h-4 w-4" />
                                    <span className="hidden sm:inline">Buat Email Baru</span>
                                    <span className="sm:hidden">Baru</span>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* History List */}
                <div className="flex-1 py-6">
                    <div className="max-w-4xl mx-auto px-4">
                        <EmailHistory />
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
