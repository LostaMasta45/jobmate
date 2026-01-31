// Run: node scripts/execute-mypg-migration.mjs
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const { Client } = pg;

// Hardcode password for this migration
const dbPassword = 'BismillahSukses100%';
console.log('🔑 Using password:', dbPassword.substring(0, 5) + '...');

// Try direct connection (not pooler)
// Host: db.[project-ref].supabase.co
const connectionString = `postgresql://postgres:${encodeURIComponent(dbPassword)}@db.gyamsjmrrntwwcqljene.supabase.co:5432/postgres`;


async function runMigration() {
  console.log('🚀 Executing MY PG Database Migration...');
  console.log('📡 Connecting to Supabase PostgreSQL...');

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to database!');

    // Read SQL file
    const sqlPath = path.join(__dirname, '..', 'supabase', 'migrations', 'mypg_transactions.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf-8');

    console.log('📄 Executing SQL migration...');

    // Execute the SQL
    await client.query(sqlContent);

    console.log('✅ Migration executed successfully!');

    // Verify table exists
    const result = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'mypg_transactions'
    `);

    if (result.rows.length > 0) {
      console.log('✅ Table mypg_transactions verified!');
    } else {
      console.log('❌ Table verification failed');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    // Check if table already exists error
    if (error.message.includes('already exists')) {
      console.log('ℹ️ Table might already exist, checking...');
    }
  } finally {
    await client.end();
    console.log('🔒 Connection closed');
  }
}

runMigration();
