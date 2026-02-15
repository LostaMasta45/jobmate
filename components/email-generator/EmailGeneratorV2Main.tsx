"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MobileToolHeader } from "@/components/tools/MobileToolHeader";

// Types from separate file
import type { EmailType, FollowUpFormData, ThankYouFormData, InquiryFormData } from "./types";

// Components - using dynamic imports for lazy loading
import { EmailWizardV2 } from "./EmailWizardV2";
import { StepPreview } from "./StepPreview";

// Lazy load form components
import dynamic from "next/dynamic";

const EmailGeneratorHome = dynamic(() => import("./EmailGeneratorHome").then(mod => ({ default: mod.EmailGeneratorHome })), { ssr: true });
const FollowUpForm = dynamic(() => import("./FollowUpForm").then(mod => ({ default: mod.FollowUpForm })), { ssr: false });
const ThankYouForm = dynamic(() => import("./ThankYouForm").then(mod => ({ default: mod.ThankYouForm })), { ssr: false });
const InquiryForm = dynamic(() => import("./InquiryForm").then(mod => ({ default: mod.InquiryForm })), { ssr: false });

interface EmailGeneratorV2MainProps {
    userName: string;
}

export function EmailGeneratorV2Main({ userName }: EmailGeneratorV2MainProps) {
    const [selectedType, setSelectedType] = useState<EmailType | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedEmail, setGeneratedEmail] = useState<{ subject: string; body: string } | null>(null);
    const [currentFormData, setCurrentFormData] = useState<any>(null);

    const handleSelectType = (type: EmailType) => {
        setSelectedType(type);
        setGeneratedEmail(null);
        setCurrentFormData(null);
    };

    const handleBack = () => {
        if (generatedEmail) {
            setGeneratedEmail(null);
        } else {
            setSelectedType(null);
        }
    };

    const handleGenerateFollowUp = async (data: FollowUpFormData) => {
        setIsGenerating(true);
        setCurrentFormData(data);
        try {
            const { generateFollowUpEmail } = await import("@/actions/email/generateOtherTypes");
            const result = await generateFollowUpEmail(data);
            if ('error' in result) {
                toast.error(result.error);
            } else {
                setGeneratedEmail(result);
                toast.success("Email berhasil dibuat!");
            }
        } catch (error) {
            toast.error("Gagal membuat email. Silakan coba lagi.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerateThankYou = async (data: ThankYouFormData) => {
        setIsGenerating(true);
        setCurrentFormData(data);
        try {
            const { generateThankYouEmail } = await import("@/actions/email/generateOtherTypes");
            const result = await generateThankYouEmail(data);
            if ('error' in result) {
                toast.error(result.error);
            } else {
                setGeneratedEmail(result);
                toast.success("Email berhasil dibuat!");
            }
        } catch (error) {
            toast.error("Gagal membuat email. Silakan coba lagi.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerateInquiry = async (data: InquiryFormData) => {
        setIsGenerating(true);
        setCurrentFormData(data);
        try {
            const { generateInquiryEmail } = await import("@/actions/email/generateOtherTypes");
            const result = await generateInquiryEmail(data);
            if ('error' in result) {
                toast.error(result.error);
            } else {
                setGeneratedEmail(result);
                toast.success("Email berhasil dibuat!");
            }
        } catch (error) {
            toast.error("Gagal membuat email. Silakan coba lagi.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleRegenerate = async () => {
        if (!currentFormData || !selectedType) return;

        setIsGenerating(true);
        try {
            const module = await import("@/actions/email/generateOtherTypes");
            let result;

            if (selectedType === 'follow_up') {
                result = await module.generateFollowUpEmail(currentFormData);
            } else if (selectedType === 'thank_you') {
                result = await module.generateThankYouEmail(currentFormData);
            } else if (selectedType === 'inquiry') {
                result = await module.generateInquiryEmail(currentFormData);
            }

            if (result && 'error' in result) {
                toast.error(result.error);
            } else if (result) {
                setGeneratedEmail(result);
                toast.success("Email berhasil di-regenerate!");
            }
        } catch (error) {
            toast.error("Gagal regenerate email. Silakan coba lagi.");
        } finally {
            setIsGenerating(false);
        }
    };

    const getEmailTypeName = (type: EmailType): string => {
        const names: Record<EmailType, string> = {
            application: 'Lamaran Kerja',
            follow_up: 'Follow Up',
            thank_you: 'Terima Kasih',
            inquiry: 'Inquiry',
        };
        return names[type];
    };

    // Show Application wizard (uses existing EmailWizardV2)
    if (selectedType === 'application') {
        return <EmailWizardV2 userName={userName} onBack={() => setSelectedType(null)} />;
    }

    // Show generated email preview
    if (generatedEmail && selectedType) {
        return (
            <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
                {/* Header - Fixed at top */}
                <div className="flex-shrink-0 z-20 bg-background border-b">
                    <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={handleBack}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-lg font-semibold">Email {getEmailTypeName(selectedType)}</h1>
                            <p className="text-sm text-muted-foreground">Preview & Edit</p>
                        </div>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-4xl mx-auto p-4 sm:p-6">
                        <StepPreview
                            formData={{
                                ...currentFormData,
                                position: currentFormData?.position || currentFormData?.interestedFields || '',
                                companyName: currentFormData?.companyName || '',
                                fullName: currentFormData?.fullName || '',
                                generatedEmail: generatedEmail.body,
                                subjectLine: generatedEmail.subject,
                            }}
                            updateFormData={(data) => {
                                if (data.generatedEmail !== undefined) {
                                    setGeneratedEmail(prev => prev ? { ...prev, body: data.generatedEmail! } : null);
                                }
                                if (data.subjectLine !== undefined) {
                                    setGeneratedEmail(prev => prev ? { ...prev, subject: data.subjectLine! } : null);
                                }
                            }}
                            onRegenerate={handleRegenerate}
                            isGenerating={isGenerating}
                            emailType={selectedType}
                        />
                    </div>
                </div>
            </div>
        );
    }

    // Show form based on selected type
    if (selectedType) {
        return (
            <AnimatePresence mode="wait">
                {selectedType === 'follow_up' && (
                    <FollowUpForm
                        key="follow_up"
                        userName={userName}
                        onGenerate={handleGenerateFollowUp}
                        isGenerating={isGenerating}
                        onBack={handleBack}
                    />
                )}
                {selectedType === 'thank_you' && (
                    <ThankYouForm
                        key="thank_you"
                        userName={userName}
                        onGenerate={handleGenerateThankYou}
                        isGenerating={isGenerating}
                        onBack={handleBack}
                    />
                )}
                {selectedType === 'inquiry' && (
                    <InquiryForm
                        key="inquiry"
                        userName={userName}
                        onGenerate={handleGenerateInquiry}
                        isGenerating={isGenerating}
                        onBack={handleBack}
                    />
                )}
            </AnimatePresence>
        );
    }

    // Show home page with email type selection
    return (
        <>
            <MobileToolHeader
                title="Email Generator"
                description="Buat email profesional dengan AI"
                fullScreen
            />
            <div className="h-full w-full overflow-y-auto">
                <EmailGeneratorHome onSelectType={handleSelectType} />
            </div>
        </>
    );
}

