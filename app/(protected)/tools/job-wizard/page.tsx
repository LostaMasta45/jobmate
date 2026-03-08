import { AppShell } from "@/components/layout/AppShell";
import { MobileToolHeader } from "@/components/tools/MobileToolHeader";
import JobWizardClient from "@/components/job-wizard/JobWizardClient";

export const metadata = {
    title: "10 Hari Dapat Kerjaan - JobMate",
    description: "Program terstruktur 10 hari untuk melamar kerja dengan panduan lengkap dan AI Coach",
};

export default function JobWizardPage() {
    return (
        <AppShell>
            <MobileToolHeader
                title="10 Hari Dapat Kerjaan"
                description="Panduan step-by-step melamar kerja"
            />
            <div className="p-4 sm:p-6 lg:p-8">
                <JobWizardClient />
            </div>
        </AppShell>
    );
}
