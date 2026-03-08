// Try all known Supabase Postgres connection patterns
const { Client } = require('pg');

const configs = [
  // Pattern 1: Direct DB host
  {
    name: 'db.PROJECT.supabase.co:5432',
    connectionString: 'postgresql://postgres:BismillahSukses100%25@db.gyamsjmrrntwwcqljene.supabase.co:5432/postgres?sslmode=require'
  },
  // Pattern 2: Pooler session mode
  {
    name: 'pooler:5432 (session)',
    connectionString: 'postgresql://postgres.gyamsjmrrntwwcqljene:BismillahSukses100%25@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require'
  },
  // Pattern 3: Pooler transaction mode  
  {
    name: 'pooler:6543 (transaction)',
    connectionString: 'postgresql://postgres.gyamsjmrrntwwcqljene:BismillahSukses100%25@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require'
  },
  // Pattern 4: Without URL encoding
  {
    name: 'direct with params',
    host: 'db.gyamsjmrrntwwcqljene.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'BismillahSukses100%',
    ssl: true
  },
];

async function tryConnect(cfg) {
  const { name, ...connCfg } = cfg;
  const client = new Client(connCfg);
  client.on('error', () => {}); // suppress errors
  
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      client.end().catch(() => {});
      resolve({ name, success: false, error: 'Connection timeout (10s)' });
    }, 10000);

    client.connect()
      .then(() => {
        clearTimeout(timeout);
        resolve({ name, success: true, client });
      })
      .catch((err) => {
        clearTimeout(timeout);
        client.end().catch(() => {});
        resolve({ name, success: false, error: err.message });
      });
  });
}

async function main() {
  for (const cfg of configs) {
    console.log(`\nTrying: ${cfg.name}...`);
    const result = await tryConnect(cfg);
    
    if (result.success) {
      console.log(`✅ Connected via ${result.name}!`);
      
      const sql = [
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
        `CREATE POLICY "Users can manage own wizard days" ON job_wizard_days FOR ALL USING (wizard_id IN (SELECT id FROM job_wizard_progress WHERE user_id = auth.uid()))`
      ];

      for (let i = 0; i < sql.length; i++) {
        try {
          await result.client.query(sql[i]);
          console.log(`  ✅ Statement ${i+1}/${sql.length} OK`);
        } catch (err) {
          console.log(`  ⚠️ Statement ${i+1}: ${err.message}`);
        }
      }

      const tables = await result.client.query("SELECT tablename FROM pg_tables WHERE tablename LIKE 'job_wizard%'");
      console.log('\n📋 Tables:', tables.rows.map(r => r.tablename));
      
      await result.client.end();
      return;
    } else {
      console.log(`❌ ${result.name}: ${result.error}`);
    }
  }
  
  console.log('\n❌ All connection attempts failed.');
  console.log('Please create tables manually via Supabase Dashboard > SQL Editor');
}

main().catch(console.error);
