"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StepCompanyInfo } from "./wizard/StepCompanyInfo";
import { StepPersonalData } from "./wizard/StepPersonalData";
import { StepEducation } from "./wizard/StepEducation";
import { StepExperience } from "./wizard/StepExperience";
import { StepAttachments } from "./wizard/StepAttachments";
import { StepPreview } from "./wizard/StepPreview";
import { createCoverLetter } from "@/actions/surat-lamaran/create";
import { generateCoverLetter } from "@/lib/coverLetterGenerator";
import { useToast } from "@/hooks/use-toast";

const steps = [
  { id: 1, title: "Data Perusahaan", component: StepCompanyInfo },
  { id: 2, title: "Data Diri", component: StepPersonalData },
  { id: 3, title: "Pendidikan", component: StepEducation },
  { id: 4, title: "Pengalaman", component: StepExperience },
  { id: 5, title: "Lampiran", component: StepAttachments },
  { id: 6, title: "Preview", component: StepPreview },
];

interface CoverLetterWizardProps {
  profile: any;
  editMode?: boolean;
  editId?: string;
  initialData?: any;
}

export function CoverLetterWizard({ 
  profile, 
  editMode = false, 
  editId, 
  initialData 
}: CoverLetterWizardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(initialData || {
    // Company Info
    companyName: "",
    companyAddress: "",
    hrdName: "",
    position: "",
    jobSource: "",
    
    // Personal Data (pre-fill from profile)
    fullName: profile?.full_name || "",
    birthPlace: "",
    birthDate: "",
    address: "",
    ktp: "",
    phone: profile?.phone || "",
    email: profile?.email || "",
    status: "lajang",
    
    // Education
    degree: "s1",
    major: "",
    university: "",
    gpa: "",
    graduationYear: "",
    activities: "",
    
    // Experience
    experienceType: "fresh_graduate",
    experiences: [] as any[],
    
    // Skills
    skills: [] as string[],
    
    // Template
    templateType: "fresh_graduate",
    
    // Attachments
    includeAttachmentsList: true,
    attachments: [] as string[],
    customAttachments: [] as string[],
    
    // Optional Statements (defaults to true for fresh graduates)
    includeAvailability: true,
    includeWillingStatement: true,
    includeOvertimeStatement: false,
    includeCommitmentStatement: false,
  });

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      // Generate content
      const generatedContent = generateCoverLetter(formData);
      
      let result;
      
      if (editMode && editId) {
        // Update existing cover letter
        const { updateCoverLetter } = await import("@/actions/surat-lamaran/update");
        result = await updateCoverLetter(editId, {
          ...formData,
          generatedContent,
          status: "draft",
        });
      } else {
        // Create new cover letter
        result = await createCoverLetter({
          ...formData,
          generatedContent,
          status: "draft",
        });
      }
      
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success!",
          description: editMode 
            ? "Surat lamaran berhasil diperbarui" 
            : "Surat lamaran berhasil disimpan",
        });
        router.push("/surat-lamaran");
      }
    } catch (error) {
      console.error("Error saving:", error);
      toast({
        title: "Error",
        description: "Gagal menyimpan surat lamaran",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/surat-lamaran">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">
            {editMode ? "Edit Surat Lamaran" : "Buat Surat Lamaran Baru"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {editMode 
              ? "Perbarui informasi surat lamaran Anda" 
              : "Ikuti langkah-langkah untuk membuat surat lamaran yang professional"}
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                    currentStep === step.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : currentStep > step.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/30 text-muted-foreground"
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step.id}</span>
                  )}
                </div>
                <span
                  className={`text-xs text-center hidden sm:block ${
                    currentStep === step.id
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    currentStep > step.id ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Form Content */}
      <Card className="p-6">
        <CurrentStepComponent
          formData={formData}
          updateFormData={updateFormData}
          profile={profile}
        />
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Sebelumnya
        </Button>

        <div className="text-sm text-muted-foreground">
          Langkah {currentStep} dari {steps.length}
        </div>

        {currentStep < steps.length ? (
          <Button onClick={nextStep}>
            Selanjutnya
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Check className="mr-2 h-4 w-4" />
            )}
            {saving 
              ? (editMode ? "Memperbarui..." : "Menyimpan...") 
              : (editMode ? "Perbarui Surat" : "Simpan Surat")}
          </Button>
        )}
      </div>
    </div>
  );
}
