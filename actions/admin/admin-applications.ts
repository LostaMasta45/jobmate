"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

/* =========================================
   TYPES
   ========================================= */

export type ApplicationStatus =
    | "Applied"
    | "Screening"
    | "Interview"
    | "Offer"
    | "Hired"
    | "Rejected";

export interface AdminApplication {
    id: string;
    user_id: string;
    company: string;
    position: string;
    status: ApplicationStatus;
    salary?: number;
    contact?: string;
    source?: string;
    apply_date: string;
    created_at: string;
    order_index: number;
    notes?: string;
    poster_path?: string;
    // User Profile Data
    user_email?: string;
    user_name?: string;
    user_avatar?: string;
}

export interface ApplicationStats {
    total: number;
    applied: number;
    screening: number;
    interview: number;
    offer: number;
    hired: number;
    rejected: number;
}

/* =========================================
   SERVER ACTIONS
   ========================================= */

/**
 * Get dashboard statistics for all applications
 */
export async function getAdminApplicationStats(): Promise<ApplicationStats> {
    const supabase = createAdminClient();

    // Get all applications status
    const { data, error } = await supabase
        .from("applications")
        .select("status");

    if (error) {
        console.error("Error fetching admin stats:", error);
        return {
            total: 0,
            applied: 0,
            screening: 0,
            interview: 0,
            offer: 0,
            hired: 0,
            rejected: 0,
        };
    }

    const stats = {
        total: data.length,
        applied: 0,
        screening: 0,
        interview: 0,
        offer: 0,
        hired: 0,
        rejected: 0,
    };

    // Count each status
    data.forEach((app) => {
        const status = app.status as ApplicationStatus;
        switch (status) {
            case "Applied": stats.applied++; break;
            case "Screening": stats.screening++; break;
            case "Interview": stats.interview++; break;
            case "Offer": stats.offer++; break;
            case "Hired": stats.hired++; break;
            case "Rejected": stats.rejected++; break;
        }
    });

    return stats;
}

export async function getAllApplications(params: {
    page?: number;
    limit?: number;
    status?: string | "all";
    search?: string;
    userId?: string;
}) {
    const supabase = createAdminClient();
    const page = params.page || 1;
    const limit = params.limit || 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Query applications table directly (no profile join for now)
    let query = supabase
        .from("applications")
        .select("*", { count: "exact" });

    // Apply filters
    if (params.status && params.status !== "all") {
        query = query.eq("status", params.status);
    }

    if (params.userId) {
        query = query.eq("user_id", params.userId);
    }

    if (params.search) {
        const searchTerm = `%${params.search}%`;
        query = query.or(`company.ilike.${searchTerm},position.ilike.${searchTerm}`);
    }

    // Pagination & Sort
    query = query
        .order("created_at", { ascending: false })
        .range(from, to);

    const { data, count, error } = await query;

    if (error) {
        console.error("Error fetching applications:", JSON.stringify(error, null, 2));
        throw new Error(`Failed to fetch applications: ${error.message || JSON.stringify(error)}`);
    }

    // Fetch profiles separately if we have data
    let profilesMap: Record<string, { email?: string; full_name?: string; avatar_url?: string }> = {};

    if (data && data.length > 0) {
        const userIds = [...new Set(data.map(app => app.user_id))];
        const { data: profiles } = await supabase
            .from("profiles")
            .select("id, email, full_name, avatar_url")
            .in("id", userIds);

        if (profiles) {
            profiles.forEach(p => {
                profilesMap[p.id] = { email: p.email, full_name: p.full_name, avatar_url: p.avatar_url };
            });
        }
    }

    // Transform data to include profile info
    const transformedData: AdminApplication[] = (data || []).map((app: any) => ({
        id: app.id,
        user_id: app.user_id,
        company: app.company,
        position: app.position,
        status: app.status,
        salary: app.salary,
        contact: app.contact,
        source: app.source,
        apply_date: app.apply_date,
        created_at: app.created_at,
        order_index: app.order_index,
        notes: app.notes,
        poster_path: app.poster_path,
        user_email: profilesMap[app.user_id]?.email,
        user_name: profilesMap[app.user_id]?.full_name,
        user_avatar: profilesMap[app.user_id]?.avatar_url,
    }));

    return {
        data: transformedData,
        count: count || 0,
        totalPages: count ? Math.ceil(count / limit) : 0,
        currentPage: page
    };
}

/**
 * Delete an application (Admin action)
 */
export async function deleteAdminApplication(id: string) {
    const supabase = createAdminClient();

    const { error } = await supabase
        .from("applications")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting application:", error);
        throw new Error(`Failed to delete application: ${error.message}`);
    }

    revalidatePath("/admin/job-tracker");
    return { success: true };
}
