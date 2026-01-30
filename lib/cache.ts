import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Cached function to get VIP loker listings
 * Revalidates every 5 minutes
 */
export const getCachedLokerListings = unstable_cache(
    async (limit: number = 20, offset: number = 0) => {
        const supabase = createAdminClient();

        const { data, error, count } = await supabase
            .from("loker")
            .select("*", { count: "exact" })
            .eq("is_active", true)
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) {
            console.error("Error fetching loker:", error);
            return { data: [], count: 0 };
        }

        return { data: data || [], count: count || 0 };
    },
    ["loker-listings"],
    {
        revalidate: 300, // 5 minutes
        tags: ["loker"],
    }
);

/**
 * Cached function to get dashboard stats
 * Revalidates every 10 minutes
 */
export const getCachedDashboardStats = unstable_cache(
    async () => {
        const supabase = createAdminClient();

        const [lokerResult, usersResult, companiesResult] = await Promise.all([
            supabase.from("loker").select("id", { count: "exact", head: true }).eq("is_active", true),
            supabase.from("profiles").select("id", { count: "exact", head: true }),
            supabase.from("companies").select("id", { count: "exact", head: true }),
        ]);

        return {
            totalLoker: lokerResult.count || 0,
            totalUsers: usersResult.count || 0,
            totalCompanies: companiesResult.count || 0,
        };
    },
    ["dashboard-stats"],
    {
        revalidate: 600, // 10 minutes
        tags: ["stats"],
    }
);

/**
 * Cached function to get categories
 * Revalidates every 30 minutes (rarely changes)
 */
export const getCachedCategories = unstable_cache(
    async () => {
        const supabase = createAdminClient();

        const { data, error } = await supabase
            .from("categories")
            .select("*")
            .order("name", { ascending: true });

        if (error) {
            console.error("Error fetching categories:", error);
            return [];
        }

        return data || [];
    },
    ["categories"],
    {
        revalidate: 1800, // 30 minutes
        tags: ["categories"],
    }
);
