"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUser } from "@/lib/supabase/server";
import { sendTelegramMessage, sendAdminNotification } from "@/lib/telegram";
import { revalidatePath } from "next/cache";

export async function getApplications() {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Forbidden: Admin only");
  }

  const { data, error } = await supabase
    .from("account_applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getApplicationById(id: string) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Forbidden: Admin only");

  const { data, error } = await supabase
    .from("account_applications")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function approveApplication(applicationId: string) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Forbidden: Admin only");

  // Use admin client for operations that need to bypass RLS
  const adminClient = createAdminClient();

  const { data: application, error: fetchError } = await adminClient
    .from("account_applications")
    .select("*")
    .eq("id", applicationId)
    .single();

  if (fetchError) throw fetchError;
  if (!application) throw new Error("Application not found");
  
  // Check if already approved
  if (application.status === "approved") {
    throw new Error("Application has already been approved");
  }

  // Check if user already exists
  const { data: existingUsers } = await adminClient.auth.admin.listUsers();
  const existingUser = existingUsers?.users.find(u => u.email === application.email);

  let userId: string;

  if (existingUser) {
    // User already exists, use their ID
    userId = existingUser.id;
    console.log(`User ${application.email} already exists, using existing user ID: ${userId}`);
  } else {
    // Create new user
    const { data: authUser, error: createUserError } = await adminClient.auth.admin.createUser({
      email: application.email,
      password: application.encrypted_password || Math.random().toString(36).slice(-12),
      email_confirm: true,
      user_metadata: {
        name: application.full_name,
        username: application.username,
      },
    });

    if (createUserError) throw createUserError;
    userId = authUser.user.id;
  }

  // Check if profile exists
  const { data: existingProfile } = await adminClient
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (!existingProfile) {
    // Create profile with proper initial values
    const { error: profileError } = await adminClient.from("profiles").insert({
      id: userId, // ✅ Use auth.users ID (critical!)
      email: application.email,
      full_name: application.full_name,
      name: application.full_name,
      role: "user",
      membership: "free", // Start as free
      membership_status: "inactive",
      membership_expiry: null,
      whatsapp: application.whatsapp,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (profileError) {
      console.error("Failed to create profile:", profileError);
      throw profileError;
    }
    
    console.log(`✅ Profile created for ${application.email} (ID: ${userId})`);
  } else {
    // Profile exists - ensure data is synced
    console.log(`Profile already exists for ${application.email}, ensuring data sync...`);
    
    // Update to ensure consistency
    const { error: updateProfileError } = await adminClient.from("profiles").update({
      full_name: application.full_name,
      name: application.full_name,
      email: application.email, // Ensure email matches
      whatsapp: application.whatsapp,
      updated_at: new Date().toISOString(),
    }).eq("id", userId);
    
    if (updateProfileError) {
      console.error("Failed to update profile:", updateProfileError);
    } else {
      console.log(`✅ Profile updated for ${application.email}`);
    }
  }

  const { error: updateError } = await adminClient
    .from("account_applications")
    .update({
      status: "approved",
      approved_by: user.id,
      approved_at: new Date().toISOString(),
      encrypted_password: null,
    })
    .eq("id", applicationId);

  if (updateError) throw updateError;

  if (application.telegram_chat_id) {
    await sendTelegramMessage(
      application.telegram_chat_id,
      `✅ Pengajuan akun Anda telah disetujui!\n\nSilakan login di: ${process.env.NEXT_PUBLIC_APP_URL}/auth/sign-in\n\nEmail: ${application.email}`
    );
  }

  await sendAdminNotification(
    `✅ Akun *${application.full_name}* (${application.email}) disetujui!`
  );

  revalidatePath("/admin/applications");
  return { success: true };
}

export async function rejectApplication(applicationId: string, reason: string) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Forbidden: Admin only");

  const { data: application, error: fetchError } = await supabase
    .from("account_applications")
    .select("*")
    .eq("id", applicationId)
    .single();

  if (fetchError) throw fetchError;

  const { error: updateError } = await supabase
    .from("account_applications")
    .update({
      status: "rejected",
      rejection_reason: reason,
      updated_at: new Date().toISOString(),
    })
    .eq("id", applicationId);

  if (updateError) throw updateError;

  if (application.telegram_chat_id) {
    await sendTelegramMessage(
      application.telegram_chat_id,
      `❌ Pengajuan akun Anda ditolak.\n\nAlasan: ${reason}`
    );
  }

  await sendAdminNotification(
    `❌ Pengajuan akun *${application.full_name}* ditolak.\nAlasan: ${reason}`
  );

  revalidatePath("/admin/applications");
  return { success: true };
}

export async function getProofSignedUrl(filePath: string) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Forbidden: Admin only");

  const { data, error } = await supabase.storage
    .from("proofs")
    .createSignedUrl(filePath, 3600);

  if (error) throw error;
  return data.signedUrl;
}

export async function getAdminSettings() {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Forbidden: Admin only");

  const { data, error } = await supabase
    .from("admin_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
}

export async function saveAdminSettings(settings: {
  telegram_bot_token: string;
  telegram_admin_chat_id: string;
}) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Forbidden: Admin only");

  const { error } = await supabase.from("admin_settings").upsert({
    id: 1,
    telegram_bot_token: settings.telegram_bot_token,
    telegram_admin_chat_id: settings.telegram_admin_chat_id,
    updated_at: new Date().toISOString(),
  });

  if (error) throw error;

  revalidatePath("/admin/settings");
  return { success: true };
}

export async function testTelegramConnection() {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Forbidden: Admin only");

  try {
    await sendAdminNotification("🔔 Tes koneksi JobMate berhasil!");
    return { success: true, message: "Test message sent successfully!" };
  } catch (error) {
    throw new Error("Failed to send test message: " + (error as Error).message);
  }
}
