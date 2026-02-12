"use server";

import { createClient, getUser } from "@/lib/supabase/server";

export async function getProfile() {
  try {
    const supabase = await createClient();
    const user = await getUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    console.log("Fetching profile for user:", user.id);

    // Try to get existing profile
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle(); // Use maybeSingle instead of single to avoid error if not found

    // If profile exists, return it
    if (data) {
      console.log("Profile found:", data);
      return data;
    }

    // Profile doesn't exist, create it
    console.log("Profile not found, creating new profile...");
    console.log("User metadata:", user.user_metadata);
    console.log("User email:", user.email);

    const newProfileData = {
      id: user.id,
      full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log("Creating profile with data:", newProfileData);

    const { data: newProfile, error: createError } = await supabase
      .from("profiles")
      .upsert(newProfileData, { onConflict: "id", ignoreDuplicates: true })
      .select()
      .single();

    if (createError) {
      console.error("Error creating profile:", createError);
      console.error("Create error details:", JSON.stringify(createError, null, 2));
      throw new Error(`Failed to create profile: ${createError.message || JSON.stringify(createError)}`);
    }

    if (!newProfile) {
      throw new Error("Profile creation returned no data");
    }

    console.log("Profile created successfully:", newProfile);
    return newProfile;

  } catch (error: any) {
    console.error("Error in getProfile:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    throw new Error(`Failed to get profile: ${error.message || JSON.stringify(error)}`);
  }
}
