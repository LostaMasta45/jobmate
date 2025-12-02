"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createCoverLetter(data: any) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("Auth error:", authError);
      return { error: "Unauthorized. Please login again." };
    }

    console.log("Creating cover letter for user:", user.id);
    console.log("Data received:", {
      companyName: data.companyName,
      position: data.position,
      templateType: data.templateType,
    });

    // Insert cover letter
    const { data: coverLetter, error } = await supabase
      .from("cover_letters")
      .insert({
        user_id: user.id,
        company_name: data.companyName,
        company_address: data.companyAddress,
        hrd_name: data.hrdName,
        position: data.position,
        job_source: data.jobSource,
        personal_data: {
          full_name: data.fullName,
          birth_place: data.birthPlace,
          birth_date: data.birthDate,
          address: data.address,
          ktp: data.ktp,
          phone: data.phone,
          email: data.email,
          status: data.status,
        },
        education_data: {
          degree: data.degree,
          major: data.major,
          university: data.university,
          gpa: data.gpa,
          graduation_year: data.graduationYear,
          activities: data.activities,
          self_learning: data.selfLearning,
        },
        experiences: data.experiences || [],
        attachments: data.attachments || [],
        custom_attachments: data.customAttachments || [],
        include_attachments_list: data.includeAttachmentsList !== false,
        optional_statements: {
          include_availability: data.includeAvailability !== false,
          include_willing_statement: data.includeWillingStatement !== false,
          include_overtime_statement: data.includeOvertimeStatement || false,
          include_commitment_statement: data.includeCommitmentStatement || false,
        },
        template_type: data.templateType,
        generated_content: data.generatedContent,
        status: data.status || "draft",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating cover letter:", error);
      console.error("Error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      
      // Better error messages
      if (error.code === '42P01') {
        return { error: "Database table 'cover_letters' tidak ditemukan. Silakan run database migration terlebih dahulu." };
      }
      if (error.code === '42703') {
        return { error: "Database column tidak ditemukan. Silakan run migration untuk menambahkan columns baru." };
      }
      if (error.code === '23502') {
        return { error: "Required fields (company_name atau position) tidak boleh kosong." };
      }
      
      return { error: `Database error: ${error.message}` };
    }

    // 🆕 MONITORING: Log tool usage and send Telegram notification
    try {
      const { logToolUsageWithNotification } = await import("@/lib/telegram-monitoring");
      await logToolUsageWithNotification(
        "Surat Lamaran Generator",
        `${data.position} at ${data.companyName}`,
        { templateType: data.templateType }
      );
    } catch (monitorError) {
      console.error("[Monitoring] Failed to log surat lamaran usage:", monitorError);
    }

    revalidatePath("/surat-lamaran");
    return { data: coverLetter };
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return { error: error.message || "Something went wrong" };
  }
}
