import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateCode } from "@/lib/utils";
import { notifyNewApplication } from "@/lib/telegram";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const fullName = formData.get("fullName") as string;
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const whatsapp = formData.get("whatsapp") as string;
    const password = formData.get("password") as string;
    const proofFile = formData.get("proofFile") as File;

    if (!fullName || !username || !email || !whatsapp || !password || !proofFile) {
      return NextResponse.json(
        { error: "Semua field harus diisi" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Upload proof file
    const fileExt = proofFile.name.split(".").pop();
    const fileName = `${Date.now()}-${username}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from("proofs")
      .upload(fileName, proofFile);

    if (uploadError) {
      return NextResponse.json(
        { error: "Gagal upload bukti transfer: " + uploadError.message },
        { status: 500 }
      );
    }

    // Generate telegram link code
    const telegramLinkCode = generateCode(12);

    // Insert application
    const { data, error: insertError } = await supabase
      .from("account_applications")
      .insert({
        full_name: fullName,
        username: username,
        email: email,
        whatsapp: whatsapp,
        proof_path: fileName,
        encrypted_password: password, // In production, encrypt this
        telegram_link_code: telegramLinkCode,
        status: "pending",
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: "Gagal menyimpan pengajuan: " + insertError.message },
        { status: 500 }
      );
    }

    // Send notification to admin (don't block on failure)
    try {
      await notifyNewApplication({
        fullName,
        username,
        email,
        whatsapp,
        applicationId: data.id,
      });
      console.log("Telegram notification sent successfully");
    } catch (telegramError) {
      console.error("Telegram notification failed:", telegramError);
      // Continue anyway - application is saved
    }

    return NextResponse.json({
      success: true,
      telegramLinkCode,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
