"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Direct test - bypass all filters to see raw data
 */
export async function testDirectFetch() {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    console.log("=== FOLLOW-UP DEBUG TEST ===");
    console.log("1. User:", user?.email, user?.id);
    
    if (authError || !user) {
      console.log("ERROR: Not authenticated", authError);
      return { error: "Unauthorized", debug: { authError } };
    }

    // Test 1: Count all reminders for this user
    const { count, error: countError } = await supabase
      .from("follow_up_reminders")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    console.log("2. Total reminders count:", count);
    if (countError) console.log("   Count error:", countError);

    // Test 2: Get all reminders (no filters)
    const { data: allReminders, error: allError } = await supabase
      .from("follow_up_reminders")
      .select("*")
      .eq("user_id", user.id);

    console.log("3. All reminders:", allReminders?.length || 0, "rows");
    if (allError) console.log("   Error:", allError);
    if (allReminders && allReminders.length > 0) {
      console.log("   First reminder:", allReminders[0]);
    }

    // Test 3: Get with joined applications
    const { data: withApp, error: joinError } = await supabase
      .from("follow_up_reminders")
      .select(`
        *,
        application:applications (
          id,
          company,
          position,
          status,
          created_at
        )
      `)
      .eq("user_id", user.id);

    console.log("4. With applications joined:", withApp?.length || 0, "rows");
    if (joinError) console.log("   Join error:", joinError);
    if (withApp && withApp.length > 0) {
      console.log("   First with app:", withApp[0]);
    }

    // Test 4: Check applications
    const { data: apps, error: appsError } = await supabase
      .from("applications")
      .select("id, company, position, status, user_id")
      .eq("user_id", user.id)
      .in("status", ["Applied", "Submitted", "In Review", "Screening"]);

    console.log("5. Applications:", apps?.length || 0, "rows");
    if (appsError) console.log("   Apps error:", appsError);
    if (apps) {
      apps.forEach(app => {
        console.log(`   - ${app.company} (${app.position}) - ${app.status}`);
      });
    }

    console.log("=== END DEBUG TEST ===");

    return {
      success: true,
      debug: {
        user: { email: user.email, id: user.id },
        reminderCount: count,
        allReminders: allReminders?.length || 0,
        withAppJoined: withApp?.length || 0,
        applications: apps?.length || 0,
        sampleReminder: allReminders?.[0],
        sampleWithApp: withApp?.[0],
        sampleApp: apps?.[0]
      }
    };
  } catch (error: any) {
    console.error("FATAL ERROR in testDirectFetch:", error);
    return { error: error.message, stack: error.stack };
  }
}
