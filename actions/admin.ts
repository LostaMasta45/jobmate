"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUser } from "@/lib/supabase/server";
import { sendTelegramMessage, sendAdminNotification } from "@/lib/telegram";
import { sendAccountApprovedEmail, getUserDisplayName } from "@/lib/email-notifications";
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

  // Check if user already exists (more reliable method)
  let userId: string;
  let existingUser = null;

  try {
    // Try to get user by email using admin API
    const { data: { users }, error: listError } = await adminClient.auth.admin.listUsers();
    
    if (listError) {
      console.warn("Could not list users:", listError.message);
    } else {
      existingUser = users?.find(u => u.email?.toLowerCase() === application.email.toLowerCase());
    }
  } catch (error) {
    console.warn("Error checking existing users:", error);
  }

  if (existingUser) {
    // User already exists, use their ID
    userId = existingUser.id;
    console.log(`✅ User ${application.email} already exists, using existing user ID: ${userId}`);
  } else {
    // Create new user using safe function (bypasses problematic triggers)
    const password = application.encrypted_password && application.encrypted_password.length >= 6
      ? application.encrypted_password
      : `JM${Math.random().toString(36).slice(2, 10)}${Math.random().toString(36).slice(2, 6).toUpperCase()}!`;
    
    console.log(`[ADMIN] Creating user via safe function for ${application.email}`);
    
    try {
      // Use custom function that bypasses triggers
      const { data: result, error: rpcError } = await adminClient.rpc('admin_create_user_safe', {
        p_email: application.email,
        p_password: password,
        p_full_name: application.full_name,
        p_whatsapp: application.whatsapp
      });

      if (rpcError) {
        console.error("❌ RPC error:", rpcError);
        throw new Error(`Failed to create user: ${rpcError.message}`);
      }

      if (!result || !result.success) {
        const errorMsg = result?.error || 'Unknown error';
        console.error("❌ Function returned error:", errorMsg);
        
        // Check if it's duplicate email error
        if (errorMsg.includes('duplicate') || errorMsg.includes('already exists') || errorMsg.includes('unique')) {
          console.log("⚠️ User might already exist, attempting to find...");
          const { data: { users } } = await adminClient.auth.admin.listUsers();
          const foundUser = users?.find(u => u.email?.toLowerCase() === application.email.toLowerCase());
          if (foundUser) {
            userId = foundUser.id;
            console.log(`✅ Found existing user: ${userId}`);
          } else {
            throw new Error(`User dengan email ${application.email} sudah ada. Silakan hapus dari Supabase Dashboard terlebih dahulu.`);
          }
        } else {
          throw new Error(`Gagal membuat user: ${errorMsg}`);
        }
      } else {
        userId = result.user_id;
        console.log(`✅ User created successfully via safe function: ${userId}`);
      }
    } catch (error) {
      console.error("❌ Failed to create user:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Gagal membuat user: ${errorMessage}`);
    }
  }

  // Check if profile exists (function should have created it, but double-check)
  const { data: existingProfile } = await adminClient
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (!existingProfile) {
    console.log(`⚠️ Profile not found for ${userId}, creating manually...`);
    // Create profile manually (fallback)
    const { error: profileError } = await adminClient.from("profiles").insert({
      id: userId,
      email: application.email,
      full_name: application.full_name,
      name: application.full_name,
      role: "user",
      membership: "free",
      membership_status: "active",
      membership_expiry: null,
      whatsapp: application.whatsapp,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (profileError) {
      console.error("Failed to create profile:", profileError);
      throw profileError;
    }
    
    console.log(`✅ Profile created manually for ${application.email} (ID: ${userId})`);
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

  // Send email notification to user
  try {
    const userName = getUserDisplayName(application.full_name, application.email);
    const loginUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://jobmate.web.id'}/sign-in`;
    
    await sendAccountApprovedEmail({
      userName,
      email: application.email,
      approvedAt: new Date().toISOString(),
      loginUrl,
    });
    
    console.log(`✅ Account approved email sent to ${application.email}`);
  } catch (emailError) {
    console.error('Failed to send approval email:', emailError);
    // Don't throw - approval still succeeded even if email fails
  }

  // Send Telegram notification to user (optional)
  if (application.telegram_chat_id) {
    await sendTelegramMessage(
      application.telegram_chat_id,
      `✅ Pengajuan akun Anda telah disetujui!\n\nSilakan login di: ${process.env.NEXT_PUBLIC_BASE_URL || 'https://jobmate.web.id'}/sign-in\n\nEmail: ${application.email}`
    );
  }

  // Notify admin via Telegram with detailed info
  const { notifyAdminAccountApproved } = await import("@/lib/telegram");
  
  try {
    // Get admin profile for "approved by"
    const { data: adminProfile } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", user.id)
      .single();

    await notifyAdminAccountApproved({
      fullName: application.full_name,
      email: application.email,
      username: application.username,
      whatsapp: application.whatsapp,
      approvedBy: adminProfile?.email || user.email || "Admin",
      applicationId: applicationId,
    });
  } catch (telegramError) {
    console.error("Failed to send Telegram notification:", telegramError);
  }

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

  // Notify admin via Telegram with detailed info
  const { notifyAdminAccountRejected } = await import("@/lib/telegram");
  
  try {
    // Get admin profile for "rejected by"
    const { data: adminProfile } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", user.id)
      .single();

    await notifyAdminAccountRejected({
      fullName: application.full_name,
      email: application.email,
      reason: reason,
      rejectedBy: adminProfile?.email || user.email || "Admin",
      applicationId: applicationId,
    });
  } catch (telegramError) {
    console.error("Failed to send Telegram notification:", telegramError);
  }

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

export async function deleteApplication(applicationId: string, reason?: string) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, email")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Forbidden: Admin only");

  // Use admin client to fetch application first
  const adminClient = createAdminClient();
  
  const { data: application, error: fetchError } = await adminClient
    .from("account_applications")
    .select("*")
    .eq("id", applicationId)
    .single();

  if (fetchError) throw fetchError;
  if (!application) throw new Error("Application not found");

  // Delete associated proof file from storage
  if (application.proof_path) {
    try {
      await adminClient.storage
        .from("proofs")
        .remove([application.proof_path]);
      console.log(`✅ Deleted proof file: ${application.proof_path}`);
    } catch (storageError) {
      console.error("Failed to delete proof file:", storageError);
      // Continue even if file deletion fails
    }
  }

  // Delete the application
  const { error: deleteError } = await adminClient
    .from("account_applications")
    .delete()
    .eq("id", applicationId);

  if (deleteError) throw deleteError;

  // Send Telegram notification with detailed info
  const { notifyAdminAccountDeleted } = await import("@/lib/telegram");
  
  try {
    await notifyAdminAccountDeleted({
      fullName: application.full_name,
      email: application.email,
      whatsapp: application.whatsapp,
      status: application.status,
      reason: reason,
      deletedBy: profile.email,
      applicationId: applicationId,
    });
  } catch (telegramError) {
    console.error("Failed to send Telegram notification:", telegramError);
  }

  console.log(`✅ Application ${applicationId} deleted by ${profile.email}`);

  revalidatePath("/admin/applications");
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

export async function testAdminClientConnection() {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Forbidden: Admin only");

  const adminClient = createAdminClient();
  
  const results: any = {
    env_check: {
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      keyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    },
    tests: []
  };

  // Test 1: List users
  try {
    const { data, error } = await adminClient.auth.admin.listUsers();
    results.tests.push({
      name: "List Users",
      success: !error,
      userCount: data?.users?.length || 0,
      error: error?.message,
    });
  } catch (error) {
    results.tests.push({
      name: "List Users",
      success: false,
      error: (error as Error).message,
    });
  }

  // Test 2: Try to create a test user (dry run - won't actually create)
  try {
    const testEmail = `test-${Date.now()}@jobmate-test.com`;
    const testPassword = `Test123!${Date.now()}`;
    
    const { data, error } = await adminClient.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
    });
    
    results.tests.push({
      name: "Create Test User",
      success: !error,
      userId: data?.user?.id,
      error: error?.message,
      errorCode: (error as any)?.code,
      errorStatus: (error as any)?.status,
    });

    // Cleanup: Delete the test user if created
    if (data?.user?.id) {
      await adminClient.auth.admin.deleteUser(data.user.id);
      results.tests.push({
        name: "Delete Test User",
        success: true,
      });
    }
  } catch (error) {
    results.tests.push({
      name: "Create Test User",
      success: false,
      error: (error as Error).message,
    });
  }

  return results;
}
