"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateCoverLetter(id: string, data: any) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "Unauthorized" };
    }

    // Update cover letter
    const { data: coverLetter, error } = await supabase
      .from("cover_letters")
      .update({
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
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating cover letter:", error);
      return { error: error.message };
    }

    revalidatePath("/surat-lamaran");
    revalidatePath(`/surat-lamaran/${id}`);
    return { data: coverLetter };
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return { error: error.message || "Something went wrong" };
  }
}
