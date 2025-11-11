"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendUpgradeVIPEmail, getUserDisplayName } from "@/lib/email-notifications";
import { revalidatePath } from "next/cache";

export async function getAllMembers() {
  // Use admin client to bypass RLS and get ALL profiles
  const supabase = createAdminClient();

  try {
    // Get ALL users (not just VIP) to allow upgrading free users
    // Filter out profiles without email (invalid/corrupt data)
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .not("email", "is", null)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching members:", error);
    return { data: null, error };
  }
}

export async function getVIPMembers() {
  // Use admin client to bypass RLS
  const supabase = createAdminClient();

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .in("membership", ["vip_basic", "vip_premium"])
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching VIP members:", error);
    return { data: null, error };
  }
}

export async function updateMembership(
  userId: string,
  membership: string,
  membershipExpiry?: string | null
) {
  // Use admin client to bypass RLS
  const supabase = createAdminClient();

  try {
    // Get current membership first for comparison
    const { data: currentProfile } = await supabase
      .from("profiles")
      .select("membership, email, full_name, name")
      .eq("id", userId)
      .single();

    const previousMembership = currentProfile?.membership || 'free';

    // Calculate expiry based on membership type
    let calculatedExpiry = membershipExpiry;
    
    if (membership === "vip_premium") {
      // Premium = lifetime (null expiry)
      calculatedExpiry = null;
    } else if (membership === "vip_basic" && !membershipExpiry) {
      // VIP Basic default = 30 days
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 30);
      calculatedExpiry = expiry.toISOString();
    } else if (membership === "free") {
      // Free users = no expiry
      calculatedExpiry = null;
    }

    const updateData = { 
      membership,
      membership_status: membership === 'free' ? 'inactive' : 'active',
      membership_expiry: calculatedExpiry,
      updated_at: new Date().toISOString(),
    };

    console.log('[UPDATE_MEMBERSHIP] Updating user:', userId);
    console.log('[UPDATE_MEMBERSHIP] Update data:', updateData);

    const { data, error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", userId)
      .select();

    if (error) {
      console.error('[UPDATE_MEMBERSHIP] Error:', error);
      throw error;
    }

    // If data is empty, user might not exist
    if (!data || data.length === 0) {
      console.error('[UPDATE_MEMBERSHIP] No profile found with ID:', userId);
      return { 
        success: false, 
        error: { message: 'Profile not found. User may have been deleted.' } 
      };
    }

    console.log('[UPDATE_MEMBERSHIP] Success:', data[0]);

    // Send email notification for VIP upgrades
    if (membership === 'vip_basic' || membership === 'vip_premium') {
      try {
        const profile = data[0];
        const userName = getUserDisplayName(profile.full_name || profile.name, profile.email);
        const dashboardUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://jobmate.web.id'}/dashboard`;
        
        await sendUpgradeVIPEmail({
          userName,
          email: profile.email,
          membershipType: membership as 'vip_basic' | 'vip_premium',
          upgradedAt: new Date().toISOString(),
          dashboardUrl,
        });
        
        console.log(`✅ VIP upgrade email sent to ${profile.email} (${membership})`);
      } catch (emailError) {
        console.error('Failed to send VIP upgrade email:', emailError);
        // Don't throw - upgrade still succeeded even if email fails
      }

      // Send Telegram notification for VIP upgrades
      try {
        const { notifyAdminVIPUpgrade } = await import("@/lib/telegram");
        const profile = data[0];

        // Get admin info
        const authSupabase = await createClient();
        const adminUser = await authSupabase.auth.getUser();
        
        let upgradedBy = "Admin";
        if (adminUser.data.user) {
          const { data: adminProfile } = await supabase
            .from("profiles")
            .select("email, full_name")
            .eq("id", adminUser.data.user.id)
            .single();
          
          upgradedBy = adminProfile?.email || adminUser.data.user.email || "Admin";
        }

        await notifyAdminVIPUpgrade({
          fullName: profile.full_name || profile.name || "User",
          email: profile.email,
          membershipType: membership as 'vip_basic' | 'vip_premium',
          previousMembership: previousMembership,
          membershipExpiry: calculatedExpiry ?? null,
          upgradedBy: upgradedBy,
        });

        console.log(`✅ Telegram notification sent for VIP upgrade: ${profile.email}`);
      } catch (telegramError) {
        console.error('Failed to send Telegram notification:', telegramError);
        // Don't throw - upgrade still succeeded even if notification fails
      }
    }

    // Invalidate all admin pages
    revalidatePath("/admin/member");
    revalidatePath("/admin/dashboard");
    
    return { success: true, error: null, data: data[0] };
  } catch (error) {
    console.error("[UPDATE_MEMBERSHIP] Failed:", error);
    return { 
      success: false, 
      error: { 
        message: error instanceof Error ? error.message : 'Unknown error' 
      } 
    };
  }
}

export async function deactivateMember(userId: string) {
  // Use admin client to bypass RLS
  const supabase = createAdminClient();

  try {
    const { error } = await supabase
      .from("profiles")
      .update({ 
        membership: "free",
        membership_expiry: null
      })
      .eq("id", userId);

    if (error) throw error;

    revalidatePath("/admin/member");
    return { success: true, error: null };
  } catch (error) {
    console.error("Error deactivating member:", error);
    return { success: false, error };
  }
}

export async function extendMembership(userId: string, days: number) {
  // Use admin client to bypass RLS
  const supabase = createAdminClient();

  try {
    // Get current expiry
    const { data: profile } = await supabase
      .from("profiles")
      .select("membership_expiry")
      .eq("id", userId)
      .single();

    let newExpiry: Date;
    if (profile?.membership_expiry) {
      const currentExpiry = new Date(profile.membership_expiry);
      // If expired, extend from now
      if (currentExpiry < new Date()) {
        newExpiry = new Date();
      } else {
        newExpiry = currentExpiry;
      }
    } else {
      newExpiry = new Date();
    }

    newExpiry.setDate(newExpiry.getDate() + days);

    const { error } = await supabase
      .from("profiles")
      .update({ membership_expiry: newExpiry.toISOString() })
      .eq("id", userId);

    if (error) throw error;

    revalidatePath("/admin/member");
    return { success: true, error: null };
  } catch (error) {
    console.error("Error extending membership:", error);
    return { success: false, error };
  }
}
