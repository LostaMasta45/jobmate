"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, ChevronLeft, ChevronRight, Save, Download } from "lucide-react";
import { TemplateGallery } from "./TemplateGallery";
import { PhotoUploader } from "./PhotoUploader";
import { ColorPicker } from "./ColorPicker";
import { CVPreview } from "./CVPreview";
import { StepBasics } from "@/components/cv-ats/steps/StepBasics";
import { StepSummary } from "@/components/cv-ats/steps/StepSummary";
import { StepExperience } from "@/components/cv-ats/steps/StepExperience";
import { StepEducation } from "@/components/cv-ats/steps/StepEducation";
import { StepSkills } from "@/components/cv-ats/steps/StepSkills";
import { CreativeCV, TemplateId, defaultColorScheme, defaultPhotoOptions } from "@/lib/schemas/cv-creative";
import { emptyResume } from "@/lib/schemas/cv-ats";
import { saveCreativeCV } from "@/actions/cv-creative";
import { exportToPDF, exportToPNG, exportToJPG, exportToWord } from "@/lib/export-utils";

interface CVCreativeWizardProps {
  initialCV?: Partial<CreativeCV> | null;
  onClose?: () => void;
}

export function CVCreativeWizard({ initialCV, onClose }: CVCreativeWizardProps) {
  const [step, setStep] = React.useState(1);
  const [saving, setSaving] = React.useState(false);
  const [exporting, setExporting] = React.useState(false);
  
  const [cv, setCV] = React.useState<Partial<CreativeCV>>({
    id: initialCV?.id || crypto.randomUUID(),
    userId: initialCV?.userId || "",
    title: initialCV?.title || "Creative CV",
    templateId: initialCV?.templateId || "modern-gradient",
    colorScheme: initialCV?.colorScheme || defaultColorScheme,
    photoUrl: initialCV?.photoUrl || null,
    photoOptions: initialCV?.photoOptions || defaultPhotoOptions,
    content: initialCV?.content || emptyResume,
    atsScore: initialCV?.atsScore || null,
    isDefault: initialCV?.isDefault || false,
  });

  const steps = [
    { num: 1, label: "Basics", desc: "Info Dasar" },
    { num: 2, label: "Photo", desc: "Upload Foto" },
    { num: 3, label: "Summary", desc: "Ringkasan" },
    { num: 4, label: "Experience", desc: "Pengalaman" },
    { num: 5, label: "Education", desc: "Pendidikan" },
    { num: 6, label: "Skills", desc: "Keahlian" },
    { num: 7, label: "Design", desc: "Template & Warna" },
  ];

  const handleNext = () => {
    if (step < 7) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveCreativeCV(cv);
      alert("CV berhasil disimpan!");
      if (onClose) onClose();
    } catch (error) {
      alert("Gagal menyimpan CV");
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async (format: "pdf" | "png" | "jpg" | "word") => {
    setExporting(true);
    try {
      const element = document.getElementById("cv-preview-content");
      if (!element) throw new Error("Preview not found");

      switch (format) {
        case "pdf":
          await exportToPDF(element, `${cv.title}.pdf`);
          break;
        case "png":
          await exportToPNG(element, `${cv.title}.png`);
          break;
        case "jpg":
          await exportToJPG(element, `${cv.title}.jpg`);
          break;
        case "word":
          await exportToWord(cv, `${cv.title}.docx`);
          break;
      }
    } catch (error) {
      console.error("Export error:", error);
      alert("Gagal export CV");
    } finally {
      setExporting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <StepBasics
            data={cv.content!}
            onChange={(data) => setCV({ ...cv, content: data })}
          />
        );

      case 2:
        return (
          <PhotoUploader
            value={cv.photoUrl}
            options={cv.photoOptions!}
            onChange={(url, options) => setCV({ ...cv, photoUrl: url, photoOptions: options })}
            onSkip={handleNext}
          />
        );

      case 3:
        return (
          <StepSummary
            data={cv.content!}
            onChange={(data) => setCV({ ...cv, content: data })}
          />
        );

      case 4:
        return (
          <StepExperience
            data={cv.content!}
            onChange={(data) => setCV({ ...cv, content: data })}
          />
        );

      case 5:
        return (
          <StepEducation
            data={cv.content!}
            onChange={(data) => setCV({ ...cv, content: data })}
          />
        );

      case 6:
        return (
          <StepSkills
            data={cv.content!}
            onChange={(data) => setCV({ ...cv, content: data })}
          />
        );

      case 7:
        return (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left: Controls */}
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 text-lg font-semibold">Choose Template</h3>
                <TemplateGallery
                  selectedTemplate={cv.templateId}
                  onSelect={(templateId) => setCV({ ...cv, templateId })}
                />
              </div>
              
              <div>
                <h3 className="mb-4 text-lg font-semibold">Customize Colors</h3>
                <ColorPicker
                  value={cv.colorScheme!}
                  onChange={(colors) => setCV({ ...cv, colorScheme: colors })}
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Export Options</h3>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExport("pdf")}
                    disabled={exporting}
                    className="w-full"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    PDF
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExport("png")}
                    disabled={exporting}
                    className="w-full"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    PNG
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExport("jpg")}
                    disabled={exporting}
                    className="w-full"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    JPG
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExport("word")}
                    disabled={exporting}
                    className="w-full"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    WORD
                  </Button>
                </div>
              </div>
            </div>

            {/* Right: Live Preview */}
            <div className="lg:sticky lg:top-6 lg:h-[calc(100vh-100px)]">
              <h3 className="mb-4 text-lg font-semibold">Live Preview</h3>
              <div className="overflow-auto rounded-lg border bg-gray-50 p-4" style={{ maxHeight: "calc(100vh - 200px)" }}>
                <CVPreview cv={cv} />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-white shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-3 lg:px-6 lg:py-4">
          <div className="flex items-center gap-3 lg:gap-4">
            <h1 className="text-lg font-bold lg:text-xl">CV Creative Generator</h1>
            <span className="hidden text-sm text-muted-foreground sm:inline">
              Step {step} of {steps.length}
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <Progress value={(step / steps.length) * 100} className="h-1 rounded-none" />
      </div>

      {/* Step Indicators - Responsive */}
      <div className="container mx-auto px-4 py-4 lg:py-6">
        <div className="mb-6 flex justify-center gap-1 overflow-x-auto pb-2 lg:gap-2">
          {steps.map((s) => (
            <div
              key={s.num}
              className={`flex min-w-[60px] flex-col items-center gap-1 rounded-lg px-2 py-2 transition-all lg:min-w-[80px] lg:px-3 ${
                s.num === step
                  ? "bg-primary text-primary-foreground"
                  : s.num < step
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <div className="text-xs font-semibold lg:text-sm">{s.num}</div>
              <div className="hidden text-center text-[10px] lg:block lg:text-xs">{s.label}</div>
              <div className="text-center text-[9px] lg:hidden">{s.desc}</div>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">{renderStep()}</div>

          {/* Navigation - Responsive */}
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={step === 1}
              className="w-full sm:w-auto"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            <div className="flex flex-col gap-2 sm:flex-row">
              {step === 7 ? (
                <Button onClick={handleSave} disabled={saving} size="lg" className="w-full sm:w-auto">
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Saving..." : "Save CV"}
                </Button>
              ) : (
                <Button onClick={handleNext} className="w-full sm:w-auto">
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
