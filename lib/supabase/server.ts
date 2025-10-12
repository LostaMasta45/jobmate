import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignore if cookies can't be set (middleware)
          }
        },
      },
    }
  );
}

// Demo mode: Use this fixed ID when auth is disabled
export const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  // Return actual user (null if not logged in)
  return user;
}

// Get user with fallback to demo mode (for development only)
export async function getUserOrDemo() {
  const user = await getUser();
  
  // TEMPORARY: Return demo user when auth is disabled
  if (!user) {
    return {
      id: DEMO_USER_ID,
      email: "demo@jobmate.com",
      user_metadata: {},
      app_metadata: {},
      aud: "authenticated",
      created_at: new Date().toISOString(),
    } as any;
  }
  
  return user;
}

export async function getProfile() {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Add email from auth.user to profile
  return profile ? { ...profile, email: user.email } : null;
}
