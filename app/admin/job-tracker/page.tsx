import { Suspense } from "react";
import {
    getAdminApplicationStats,
    getAllApplications
} from "@/actions/admin/admin-applications";
import { JobTrackerStatsCards } from "@/components/admin/job-tracker/JobTrackerStatsCards";
import { JobTrackerFilters } from "@/components/admin/job-tracker/JobTrackerFilters";
import { JobTrackerTable } from "@/components/admin/job-tracker/JobTrackerTable";
import { Loader2 } from "lucide-react";

export const dynamic = "force-dynamic";

interface PageProps {
    searchParams: Promise<{
        page?: string;
        search?: string;
        status?: string;
        userId?: string;
    }>;
}

export default async function AdminJobTrackerPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const search = params.search || "";
    const status = params.status || "all";
    const userId = params.userId;

    // Fetch data in parallel
    const [stats, applications] = await Promise.all([
        getAdminApplicationStats(),
        getAllApplications({
            page,
            limit: 10,
            status,
            search,
            userId
        })
    ]);

    return (
        <div className="space-y-6 pb-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                    Job Applications Tracker
                </h1>
                <p className="text-muted-foreground text-lg">
                    Monitor and manage job applications tracked by all users.
                </p>
            </div>

            {/* Stats Cards */}
            <JobTrackerStatsCards stats={stats} />

            {/* Main Content */}
            <div className="space-y-4">
                {/* Filters */}
                <JobTrackerFilters />

                {/* Table */}
                <Suspense fallback={
                    <div className="w-full h-64 flex items-center justify-center rounded-xl border bg-card">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                }>
                    <JobTrackerTable
                        data={applications.data}
                        totalPages={applications.totalPages}
                        currentPage={applications.currentPage}
                    />
                </Suspense>
            </div>
        </div>
    );
}
