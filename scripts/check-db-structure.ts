// Script to check Supabase database structure
// Run with: npx ts-node --esm scripts/check-db-structure.ts

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("❌ Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

async function checkDatabaseStructure() {
    console.log("🔍 Checking Supabase Database Structure...\n");
    console.log(`📌 Supabase URL: ${supabaseUrl}\n`);

    try {
        // 1. Check applications table
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("📋 TABLE: applications");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

        const { data: appsData, error: appsError } = await supabase
            .from("applications")
            .select("*")
            .limit(5);

        if (appsError) {
            console.log(`❌ Error: ${appsError.message}`);
        } else {
            console.log(`✅ Table exists`);
            console.log(`📊 Sample rows: ${appsData?.length || 0}`);

            if (appsData && appsData.length > 0) {
                console.log(`📝 Columns: ${Object.keys(appsData[0]).join(", ")}`);
                console.log("\n📦 Sample data:");
                appsData.forEach((row, idx) => {
                    console.log(`   [${idx + 1}] ${row.company} - ${row.position} (${row.status})`);
                });
            }
        }

        // 2. Check profiles table
        console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("👤 TABLE: profiles");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

        const { data: profilesData, error: profilesError } = await supabase
            .from("profiles")
            .select("*")
            .limit(5);

        if (profilesError) {
            console.log(`❌ Error: ${profilesError.message}`);
        } else {
            console.log(`✅ Table exists`);
            console.log(`📊 Sample rows: ${profilesData?.length || 0}`);

            if (profilesData && profilesData.length > 0) {
                console.log(`📝 Columns: ${Object.keys(profilesData[0]).join(", ")}`);
            }
        }

        // 3. Count total applications
        console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("📈 STATISTICS");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

        const { count: totalApps } = await supabase
            .from("applications")
            .select("*", { count: "exact", head: true });

        console.log(`📋 Total applications: ${totalApps || 0}`);

        const { count: totalProfiles } = await supabase
            .from("profiles")
            .select("*", { count: "exact", head: true });

        console.log(`👤 Total profiles: ${totalProfiles || 0}`);

        // 4. Get status distribution
        const { data: statusData } = await supabase
            .from("applications")
            .select("status");

        if (statusData && statusData.length > 0) {
            const statusCount: Record<string, number> = {};
            statusData.forEach(row => {
                statusCount[row.status] = (statusCount[row.status] || 0) + 1;
            });

            console.log("\n📊 Applications by Status:");
            Object.entries(statusCount).forEach(([status, count]) => {
                console.log(`   - ${status}: ${count}`);
            });
        }

        console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("✅ Database check complete!");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    } catch (error) {
        console.error("❌ Error:", error);
    }
}

checkDatabaseStructure();
