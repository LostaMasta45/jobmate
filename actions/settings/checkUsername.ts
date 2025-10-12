"use server";

import { createClient, getUser } from "@/lib/supabase/server";

export async function checkUsername(username: string) {
  try {
    const supabase = await createClient();
    const user = await getUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const cleanUsername = username.trim().toLowerCase();

    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .ilike("username", cleanUsername);

    if (error) throw error;

    // Available if no results, or only result is current user
    const isAvailable = !data || data.length === 0 || (data.length === 1 && data[0].id === user.id);

    return { available: isAvailable };
  } catch (error) {
    console.error("Error checking username:", error);
    return { available: false, error: "Failed to check username" };
  }
}
