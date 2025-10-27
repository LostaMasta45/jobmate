import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email harus diisi" },
        { status: 400 }
      );
    }

    console.log("[Check Status API] Checking application for email:", email);

    const supabase = await createClient();

    // Query account_applications table
    const { data: application, error } = await supabase
      .from("account_applications")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      console.error("[Check Status API] Database error:", error);
      
      // If no rows found
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Pengajuan tidak ditemukan dengan email ini" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { error: "Terjadi kesalahan. Silakan coba lagi." },
        { status: 500 }
      );
    }

    console.log("[Check Status API] Application found:", {
      id: application.id,
      email: application.email,
      status: application.status,
    });

    // If approved, get membership info from profiles table
    let membershipInfo = null;
    if (application.status === "approved") {
      console.log("[Check Status API] Fetching membership info for approved user");
      
      // First, get auth user by email
      const { data: authUser } = await supabase
        .from("profiles")
        .select("id, membership, membership_status, membership_expires_at")
        .eq("email", email)
        .single();

      if (authUser) {
        membershipInfo = {
          membership: authUser.membership || "vip_basic", // default to vip_basic
          membership_status: authUser.membership_status || "active",
          membership_expires_at: authUser.membership_expires_at,
        };
        console.log("[Check Status API] Membership found:", membershipInfo);
      } else {
        console.log("[Check Status API] No profile found, user may not be created yet");
      }
    }

    // Return application data (exclude sensitive data)
    return NextResponse.json({
      application: {
        id: application.id,
        full_name: application.full_name,
        username: application.username,
        email: application.email,
        whatsapp: application.whatsapp,
        status: application.status,
        created_at: application.created_at,
        updated_at: application.updated_at,
        approved_at: application.approved_at,
        telegram_link_code: application.telegram_link_code,
        // Add membership info if available
        ...(membershipInfo && { membership_info: membershipInfo }),
      },
    });
  } catch (error) {
    console.error("[Check Status API] Unexpected error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
