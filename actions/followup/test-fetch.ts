"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Test action to debug follow-up fetch
 */
export async function testFetchFollowUps() {
  try {
    console.log("=== TEST START ===");
    
    const supabase = await createClient();
    console.log("Supabase client created");
    
    // Get user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    console.log("=== FOLLOW-UP TEST DEBUG ===");
    console.log("User:", user?.email, user?.id);
    console.log("Auth Error:", authError);
    
    if (authError) {
      console.error("Auth error:", authError);
      return { 
        error: "Auth error: " + authError.message,
        authError: authError.message
      };
    }
    
    if (!user) {
      console.error("No user found");
      return { 
        error: "Not authenticated - no user",
        user: null
      };
    }

    // Try simple query without filters
    const { data, error, count } = await supabase
      .from("follow_up_reminders")
      .select("*", { count: "exact" })
      .eq("user_id", user.id);

    console.log("Query result:", { data, error, count });

    // Try query with applications join
    const { data: dataWithApp, error: errorWithApp } = await supabase
      .from("follow_up_reminders")
      .select(`
        *,
        application:applications (
          company,
          position
        )
      `)
      .eq("user_id", user.id);

    console.log("Query with join:", { dataWithApp, errorWithApp });

    return {
      user: {
        email: user.email,
        id: user.id
      },
      simpleQuery: {
        count,
        data,
        error: error?.message
      },
      joinQuery: {
        count: dataWithApp?.length || 0,
        data: dataWithApp,
        error: errorWithApp?.message
      }
    };
  } catch (error: any) {
    console.error("=== TEST CATCH ERROR ===");
    console.error("Test fetch error:", error);
    console.error("Stack:", error.stack);
    return { 
      error: "Caught error: " + error.message,
      errorType: error.constructor.name,
      stack: error.stack 
    };
  }
}
