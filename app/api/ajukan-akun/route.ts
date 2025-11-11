import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateCode } from "@/lib/utils";
import { notifyNewApplication } from "@/lib/telegram";
import { sendAccountPendingEmail, getUserDisplayName } from "@/lib/email-notifications";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const fullName = formData.get("fullName") as string;
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const whatsapp = formData.get("whatsapp") as string;
    const password = formData.get("password") as string;
    const proofFile = formData.get("proofFile") as File;

    console.log("[Ajukan Akun API] Received application:", { fullName, username, email, whatsapp });

    if (!fullName || !username || !email || !whatsapp || !password || !proofFile) {
      console.error("[Ajukan Akun API] Missing fields");
      return NextResponse.json(
        { error: "Semua field harus diisi" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    console.log("[Ajukan Akun API] Supabase client created");

    // Upload proof file
    const fileExt = proofFile.name.split(".").pop();
    const fileName = `${Date.now()}-${username}.${fileExt}`;
    
    console.log("[Ajukan Akun API] Uploading file:", fileName);
    
    const { error: uploadError } = await supabase.storage
      .from("proofs")
      .upload(fileName, proofFile);

    if (uploadError) {
      console.error("[Ajukan Akun API] Upload error:", uploadError);
      return NextResponse.json(
        { error: "Gagal upload bukti transfer: " + uploadError.message },
        { status: 500 }
      );
    }
    
    console.log("[Ajukan Akun API] File uploaded successfully");

    // Generate telegram link code
    const telegramLinkCode = generateCode(12);

    // Insert application
    console.log("[Ajukan Akun API] Inserting application to database");
    
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
      console.error("[Ajukan Akun API] Database insert error:", insertError);
      return NextResponse.json(
        { error: "Gagal menyimpan pengajuan: " + insertError.message },
        { status: 500 }
      );
    }
    
    console.log("[Ajukan Akun API] Application saved successfully, ID:", data.id);

    // Get public URL for the proof file to send to Telegram
    let proofPhotoUrl: string | undefined;
    try {
      const { data: urlData } = supabase.storage
        .from("proofs")
        .getPublicUrl(fileName);
      
      if (urlData?.publicUrl) {
        proofPhotoUrl = urlData.publicUrl;
        console.log("[Ajukan Akun API] Got public URL for proof:", proofPhotoUrl);
      }
    } catch (urlError) {
      console.error("[Ajukan Akun API] Failed to get proof URL:", urlError);
    }

    // Send email notification to user (don't block on failure)
    try {
      const userName = getUserDisplayName(fullName, email);
      await sendAccountPendingEmail({
        userName,
        email,
        submittedAt: new Date().toISOString(),
      });
      console.log(`✅ Account pending email sent to ${email}`);
    } catch (emailError) {
      console.error("Failed to send pending email:", emailError);
      // Continue anyway - application is saved
    }

    // Send notification to admin via Telegram (don't block on failure)
    try {
      await notifyNewApplication({
        fullName,
        username,
        email,
        whatsapp,
        applicationId: data.id,
        proofPhotoUrl,
      });
      console.log("Telegram notification sent successfully");
    } catch (telegramError) {
      console.error("Telegram notification failed:", telegramError);
      // Continue anyway - application is saved
    }

    console.log("[Ajukan Akun API] Application submitted successfully");
    
    return NextResponse.json({
      success: true,
      telegramLinkCode,
    });
  } catch (error) {
    console.error("[Ajukan Akun API] Unexpected error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan. Silakan coba lagi. Error: " + (error as Error).message },
      { status: 500 }
    );
  }
}
