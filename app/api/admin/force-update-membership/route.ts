import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

/**
 * EMERGENCY API: Force update user membership
 * Use this if SQL update di Supabase tidak bisa dijalankan
 * 
 * Usage:
 * POST /api/admin/force-update-membership
 * Body: {
 *   email: "user@example.com",
 *   membership: "vip_basic" | "vip_premium" | "free",
 *   days: 30 (optional, default for vip_basic)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, membership, days = 30 } = body;

    if (!email || !membership) {
      return NextResponse.json(
        { error: "Missing email or membership" },
        { status: 400 }
      );
    }

    // Use admin client to bypass RLS
    const supabase = createAdminClient();

    // Calculate expiry
    let membershipExpiry = null;
    let membershipStatus = "active";

    if (membership === "vip_basic") {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + days);
      membershipExpiry = expiry.toISOString();
    } else if (membership === "vip_premium") {
      // Premium = lifetime (null expiry)
      membershipExpiry = null;
    } else if (membership === "free") {
      membershipExpiry = null;
      membershipStatus = "inactive";
    }

    console.log("[FORCE_UPDATE] Updating:", {
      email,
      membership,
      membershipStatus,
      membershipExpiry,
    });

    // Use only NEW columns (no legacy)
    const updateData = {
      membership,
      membership_status: membershipStatus,
      membership_expiry: membershipExpiry,
      updated_at: new Date().toISOString(),
    };

    console.log("[FORCE_UPDATE] Update data:", updateData);

    // Update user
    const { data, error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("email", email)
      .select();

    if (error) {
      console.error("[FORCE_UPDATE] Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "User not found with email: " + email },
        { status: 404 }
      );
    }

    console.log("[FORCE_UPDATE] Success:", data[0]);

    return NextResponse.json({
      success: true,
      message: `Updated ${email} to ${membership}`,
      data: data[0],
    });
  } catch (error: any) {
    console.error("[FORCE_UPDATE] Exception:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET: Check current user membership
 * Usage: GET /api/admin/force-update-membership?email=user@example.com
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, membership, membership_status, membership_expiry, role")
      .eq("email", email)
      .single();

    if (error) {
      console.error("[FORCE_UPDATE_GET] Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error("[FORCE_UPDATE_GET] Exception:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
