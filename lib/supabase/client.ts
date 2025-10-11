import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // Auto refresh the session before it expires (default is 3600 seconds = 1 hour)
        autoRefreshToken: true,
        // Persist session to local storage
        persistSession: true,
        // Detect session from URL (for OAuth flows)
        detectSessionInUrl: true,
      },
    }
  );
}
