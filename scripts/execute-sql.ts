import { Client } from "pg";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const dbPassword = process.env.DB_PASSWORD;

if (!supabaseUrl || !dbPassword) {
    console.error("❌ Missing SUPABASE_URL or DB_PASSWORD in .env.local");
    process.exit(1);
}

// Extract host from Supabase URL
// URL format: https://[project-ref].supabase.co
const projectRef = supabaseUrl.split("//")[1].split(".")[0];
const host = `db.${projectRef}.supabase.co`;
const port = 5432;
const database = "postgres";
const user = "postgres";

const client = new Client({
    host,
    port,
    database,
    user,
    password: dbPassword,
    ssl: { rejectUnauthorized: false }, // Supabase requires SSL
});

async function executeSql() {
    const filePath = process.argv[2];
    if (!filePath) {
        console.error("Usage: npx tsx scripts/execute-sql.ts <path-to-sql-file>");
        process.exit(1);
    }

    const fullPath = path.resolve(process.cwd(), filePath);
    if (!fs.existsSync(fullPath)) {
        console.error(`❌ File not found: ${fullPath}`);
        process.exit(1);
    }

    const sql = fs.readFileSync(fullPath, "utf-8");
    console.log(`🔌 Connecting to ${host}...`);

    try {
        await client.connect();
        console.log("✅ Connected!\n");

        console.log(`🚀 Executing SQL from ${path.basename(filePath)}...`);
        // Split by semicolon to handle multiple statements if needed, but simple exec works too suitable for most migrations
        // For safety, we execute the whole string. pg handles multiple statements.

        const startTime = Date.now();
        const res = await client.query(sql);
        const duration = Date.now() - startTime;

        if (Array.isArray(res)) {
            console.log(`✅ Success! Executed ${res.length} statements in ${duration}ms`);
        } else {
            console.log(`✅ Success! Executed in ${duration}ms`);
            if (res.rowCount !== null) console.log(`   Rows affected: ${res.rowCount}`);
        }

    } catch (err: any) {
        console.error("❌ Error executing SQL:", err.message);
        if (err.position) {
            console.error(`   at position: ${err.position}`);
        }
    } finally {
        await client.end();
    }
}

executeSql();
