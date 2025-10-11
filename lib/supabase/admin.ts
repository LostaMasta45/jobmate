import { createClient } from "@supabase/supabase-js";

// Admin client with service role - bypasses RLS
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseUrl || !supabaseServiceKey || supabaseServiceKey === "YOUR_SERVICE_ROLE_KEY_HERE") {
    throw new Error(
      "Missing Supabase credentials. Please set SUPABASE_SERVICE_ROLE_KEY in .env.local"
    );
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
