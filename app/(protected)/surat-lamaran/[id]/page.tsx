import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { getProfile } from "@/lib/supabase/server";
import { getCoverLetter } from "@/actions/surat-lamaran/get";
import { notFound } from "next/navigation";
import { CoverLetterWizard } from "@/components/surat-lamaran/CoverLetterWizard";

export default async function EditCoverLetterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await getProfile();
  const isAdmin = profile?.role === 'admin';

  // Fetch cover letter data
  const result = await getCoverLetter(id);

  if (result.error || !result.data) {
    notFound();
  }

  const coverLetter = result.data;

  // Transform database data back to form data format
  const initialFormData = {
    // Company Info
    companyName: coverLetter.company_name,
    companyAddress: coverLetter.company_address || "",
    hrdName: coverLetter.hrd_name || "",
    position: coverLetter.position,
    jobSource: coverLetter.job_source || "",
    jobSourceCustom: coverLetter.job_source === "custom" ? coverLetter.job_source : "",
    
    // Personal Data
    fullName: coverLetter.personal_data?.full_name || profile?.full_name || "",
    birthPlace: coverLetter.personal_data?.birth_place || "",
    birthDate: coverLetter.personal_data?.birth_date || "",
    address: coverLetter.personal_data?.address || "",
    ktp: coverLetter.personal_data?.ktp || "",
    phone: coverLetter.personal_data?.phone || profile?.phone || "",
    email: coverLetter.personal_data?.email || profile?.email || "",
    status: coverLetter.personal_data?.status || "lajang",
    
    // Education
    degree: coverLetter.education_data?.degree || "s1",
    major: coverLetter.education_data?.major || "",
    university: coverLetter.education_data?.university || "",
    gpa: coverLetter.education_data?.gpa || "",
    graduationYear: coverLetter.education_data?.graduation_year || "",
    activities: coverLetter.education_data?.activities || "",
    selfLearning: coverLetter.education_data?.self_learning || "",
    
    // Experience
    experienceType: coverLetter.experiences?.length > 0 ? "experienced" : "fresh_graduate",
    experiences: coverLetter.experiences || [],
    
    // Template
    templateType: coverLetter.template_type || "fresh_graduate",
    
    // Attachments
    attachments: coverLetter.attachments || [],
    customAttachments: coverLetter.custom_attachments || [],
    includeAttachmentsList: coverLetter.include_attachments_list !== false,
    
    // Optional Statements
    includeAvailability: coverLetter.optional_statements?.include_availability !== false,
    includeWillingStatement: coverLetter.optional_statements?.include_willing_statement !== false,
    includeOvertimeStatement: coverLetter.optional_statements?.include_overtime_statement || false,
    includeCommitmentStatement: coverLetter.optional_statements?.include_commitment_statement || false,
  };

  return (
    <AppShell isAdmin={isAdmin}>
      <PageHeader
        title="Edit Surat Lamaran"
        description={`Edit surat lamaran untuk ${coverLetter.company_name} - ${coverLetter.position}`}
      />

      <div className="mt-6">
        <CoverLetterWizard 
          profile={profile} 
          editMode={true}
          editId={id}
          initialData={initialFormData}
        />
      </div>
    </AppShell>
  );
}
