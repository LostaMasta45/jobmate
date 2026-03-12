import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Client } from "pg";

export async function GET() {
    // ============================================
    // SECURITY: Require admin authentication
    // ============================================
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json(
            { error: "Authentication required" },
            { status: 401 }
        );
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") {
        return NextResponse.json(
            { error: "Admin access required" },
            { status: 403 }
        );
    }

    const password = process.env.DB_PASSWORD;
    if (!password) {
        return NextResponse.json({ error: "DB_PASSWORD not set in env" }, { status: 500 });
    }

    const supabaseRef = process.env.NEXT_PUBLIC_SUPABASE_URL?.match(/https:\/\/(.+?)\.supabase\.co/)?.[1];
    if (!supabaseRef) {
        return NextResponse.json({ error: "Could not determine Supabase project reference" }, { status: 500 });
    }

    // Try multiple connection patterns
    const configs = [
        {
            name: "db.PROJECT.supabase.co:5432",
            host: `db.${supabaseRef}.supabase.co`,
            port: 5432,
            database: "postgres",
            user: "postgres",
            password,
            ssl: { rejectUnauthorized: false },
        },
        {
            name: "pooler:5432 (session)",
            host: "aws-0-ap-southeast-1.pooler.supabase.com",
            port: 5432,
            database: "postgres",
            user: `postgres.${supabaseRef}`,
            password,
            ssl: { rejectUnauthorized: false },
        },
        {
            name: "pooler:6543 (transaction)",
            host: "aws-0-ap-southeast-1.pooler.supabase.com",
            port: 6543,
            database: "postgres",
            user: `postgres.${supabaseRef}`,
            password,
            ssl: { rejectUnauthorized: false },
        },
    ];

    for (const cfg of configs) {
        const { name, ...connCfg } = cfg;
        const client = new Client({ ...connCfg, connectionTimeoutMillis: 10000 });

        try {
            await client.connect();

            const statements = [
                `CREATE TABLE IF NOT EXISTS job_wizard_progress (
          id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          started_at timestamptz DEFAULT now(),
          current_day int DEFAULT 0,
          self_assessment jsonb DEFAULT '{}',
          profile_data jsonb DEFAULT '{}',
          streak int DEFAULT 0,
          last_active_at timestamptz DEFAULT now(),
          status text DEFAULT 'active',
          completed_at timestamptz,
          created_at timestamptz DEFAULT now(),
          updated_at timestamptz DEFAULT now(),
          UNIQUE(user_id)
        )`,
                `CREATE TABLE IF NOT EXISTS job_wizard_days (
          id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
          wizard_id uuid NOT NULL REFERENCES job_wizard_progress(id) ON DELETE CASCADE,
          day_number int NOT NULL,
          company_name text NOT NULL DEFAULT '',
          position text NOT NULL DEFAULT '',
          job_source text DEFAULT '',
          send_method text DEFAULT 'email',
          checklist jsonb DEFAULT '{"target": false, "surat_lamaran": false, "email_wa": false, "pdf_merge": false, "kirim": false, "tracker": false}',
          follow_up_done boolean DEFAULT false,
          notes text DEFAULT '',
          completed boolean DEFAULT false,
          completed_at timestamptz,
          created_at timestamptz DEFAULT now(),
          updated_at timestamptz DEFAULT now(),
          UNIQUE(wizard_id, day_number)
        )`,
                `ALTER TABLE job_wizard_progress ENABLE ROW LEVEL SECURITY`,
                `ALTER TABLE job_wizard_days ENABLE ROW LEVEL SECURITY`,
                `DROP POLICY IF EXISTS "Users can manage own wizard progress" ON job_wizard_progress`,
                `DROP POLICY IF EXISTS "Users can manage own wizard days" ON job_wizard_days`,
                `CREATE POLICY "Users can manage own wizard progress" ON job_wizard_progress FOR ALL USING (auth.uid() = user_id)`,
                `CREATE POLICY "Users can manage own wizard days" ON job_wizard_days FOR ALL USING (wizard_id IN (SELECT id FROM job_wizard_progress WHERE user_id = auth.uid()))`,
            ];

            const results = [];
            for (let i = 0; i < statements.length; i++) {
                try {
                    await client.query(statements[i]);
                    results.push({ step: i + 1, status: "OK" });
                } catch (err: any) {
                    results.push({ step: i + 1, status: "ERROR", message: err.message });
                }
            }

            // Verify
            const tables = await client.query(
                "SELECT tablename FROM pg_tables WHERE tablename LIKE 'job_wizard%'"
            );

            await client.end();
            return NextResponse.json({
                success: true,
                connection: name,
                results,
                tables: tables.rows.map((r: any) => r.tablename),
            });
        } catch (err: any) {
            try { await client.end(); } catch (_) { }
            continue;
        }
    }

    return NextResponse.json({
        success: false,
        error: "All connection attempts failed. Please create tables manually via Supabase Dashboard SQL Editor.",
    }, { status: 500 });
}
