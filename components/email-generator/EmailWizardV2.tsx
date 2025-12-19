"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles, Loader2, Mail, CheckCircle2, History, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StepBasicInfo } from "./StepBasicInfo";
import { StepProfile } from "./StepProfile";
import { StepPreview } from "./StepPreview";
import { LoadingOverlay } from "./LoadingOverlay";
import { toast } from "sonner";

// Types
export interface JobPosterAnalysis {
    companyName?: string;
    position?: string;
    requirements?: string[];
    qualifications?: string[];
    benefits?: string[];
    deadline?: string;
    location?: string;
    salary?: string;
    rawDescription?: string;
}

export interface EmailFormDataV2 {
    // Step 1: Basic Info
    fullName: string;
    position: string;
    companyName: string;
    hrdName: string;
    jobSource: string;
    phoneNumber: string;
    reasonForInterest: string;
    availability: string;

    // Step 2: Profile
    experienceLevel: 'fresh_graduate' | 'experienced' | 'no_experience';
    // Education Type (untuk fresh graduate)
    educationType: 'sma_smk' | 'd3' | 's1_s2';
    // Fresh Graduate - SMA/SMK
    schoolName: string;
    schoolMajor: string;
    // Fresh Graduate - Kuliah
    major: string;
    university: string;
    ipk: string;
    organizationExp: string;
    achievements: string;
    // Fresh Graduate - Additional (jika tidak ada pengalaman organisasi)
    projectThesis: string; // Proyek/Tugas Akhir
    courses: string; // Kursus/Sertifikasi Online
    softSkills: string; // Soft Skills
    relevantHobby: string; // Hobi yang relevan
    // No Experience - Additional
    informalExperience: string; // Pengalaman informal (bantu usaha keluarga, volunteer)
    // Experienced
    lastPosition: string;
    lastCompany: string;
    yearsExperience: string;
    workAchievements: string;
    skills: string;

    // Attachments - berkas yang dilampirkan
    attachments: string[]; // Array of attachment types

    // Email preferences
    emailTone: 'formal' | 'semi_formal' | 'casual';
    emailLength: 'short' | 'medium' | 'long';
    closingGreeting: 'hormat_saya' | 'salam_hangat' | 'terima_kasih';

    // Job poster analysis (optional)
    jobPosterAnalysis: JobPosterAnalysis | null;

    // Step 3: Generated
    generatedEmail: string;
    subjectLine: string;
}

const INITIAL_DATA: EmailFormDataV2 = {
    fullName: '',
    position: '',
    companyName: '',
    hrdName: '',
    jobSource: '',
    phoneNumber: '',
    reasonForInterest: '',
    availability: '',
    experienceLevel: 'fresh_graduate',
    educationType: 's1_s2',
    schoolName: '',
    schoolMajor: '',
    major: '',
    university: '',
    ipk: '',
    organizationExp: '',
    achievements: '',
    projectThesis: '',
    courses: '',
    softSkills: '',
    relevantHobby: '',
    informalExperience: '',
    lastPosition: '',
    lastCompany: '',
    yearsExperience: '',
    workAchievements: '',
    skills: '',
    attachments: ['cv'],
    emailTone: 'semi_formal',
    emailLength: 'medium',
    closingGreeting: 'hormat_saya',
    // Job poster analysis
    jobPosterAnalysis: null,
    generatedEmail: '',
    subjectLine: '',

};


const STEPS = [
    { id: 1, title: "Informasi Dasar", description: "Posisi & perusahaan yang dilamar" },
    { id: 2, title: "Profil Kamu", description: "Ceritakan tentang dirimu" },
    { id: 3, title: "Email Kamu", description: "Preview & kirim email" },
];

interface EmailWizardV2Props {
    userName?: string;
    onBack?: () => void;
}

export function EmailWizardV2({ userName = '', onBack }: EmailWizardV2Props) {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<EmailFormDataV2>({
        ...INITIAL_DATA,
        fullName: userName,
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('email_wizard_v2_data');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setFormData(prev => ({ ...prev, ...parsed }));
            } catch (e) {
                console.error('Failed to parse saved data');
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('email_wizard_v2_data', JSON.stringify(formData));
        }
    }, [formData, isLoaded]);

    // Auto-scroll to top when step changes
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [currentStep]);

    const updateFormData = (data: Partial<EmailFormDataV2>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const canProceed = () => {
        switch (currentStep) {
            case 1:
                return formData.fullName && formData.position && formData.companyName && formData.jobSource;
            case 2:
                if (formData.experienceLevel === 'fresh_graduate') {
                    if (formData.educationType === 'sma_smk') {
                        return formData.schoolName;
                    }
                    return formData.major && formData.university;
                }
                if (formData.experienceLevel === 'experienced') {
                    return formData.lastPosition && formData.yearsExperience;
                }
                // no_experience - hanya perlu skill
                return true;
            default:
                return true;
        }
    };

    const handleNext = async () => {
        if (currentStep === 2) {
            // Generate email when moving to step 3
            await generateEmail();
        } else if (currentStep < STEPS.length) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const generateEmail = async () => {
        setIsGenerating(true);
        try {
            const { generateEmailV2 } = await import("@/actions/email/generateV2");
            const result = await generateEmailV2(formData);

            if (result.error) {
                toast.error("Gagal generate email: " + result.error);
                return;
            }

            updateFormData({
                generatedEmail: result.body || '',
                subjectLine: result.subject || '',
            });
            setCurrentStep(3);
            toast.success("Email berhasil dibuat!");
        } catch (error) {
            toast.error("Terjadi kesalahan saat generate email");
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    const resetForm = () => {
        setFormData({ ...INITIAL_DATA, fullName: userName });
        setCurrentStep(1);
        toast.success("Form direset!");
    };

    const progress = (currentStep / STEPS.length) * 100;

    if (!isLoaded) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </motion.div>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-muted-foreground text-sm"
                >
                    Memuat...
                </motion.p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-gmail-red-50/50 via-background to-gmail-blue-50/30 dark:from-red-950/20 dark:via-background dark:to-blue-950/20 overflow-hidden relative">

            <AnimatePresence>
                {isGenerating && <LoadingOverlay isVisible={isGenerating} type="application" />}
            </AnimatePresence>

            {/* Header Bar - Fixed Flex Item */}
            <div className="flex-none z-20 bg-white/70 dark:bg-black/70 backdrop-blur-md border-b border-white/20 dark:border-white/10 shadow-sm relative">
                {/* Progress Bar Top Edge */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-muted/20">
                    <motion.div
                        className="h-full bg-gradient-to-r from-gmail-red-500 via-gmail-yellow-500 to-gmail-blue-500 shadow-[0_0_10px_rgba(234,67,53,0.5)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: "circOut" }}
                    />
                </div>

                <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4">
                    <div className="flex items-center justify-between">
                        {/* Back Button */}
                        <div className="flex items-center gap-2">
                            {currentStep === 1 ? (
                                onBack ? (
                                    <button
                                        onClick={onBack}
                                        className="group flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-full"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        <span className="hidden sm:inline">Kembali</span>
                                    </button>
                                ) : (
                                    <Link href="/dashboard">
                                        <button className="group flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-full">
                                            <Home className="h-4 w-4" />
                                            <span className="hidden sm:inline">Dashboard</span>
                                        </button>
                                    </Link>
                                )
                            ) : (
                                <button
                                    onClick={handlePrev}
                                    className="group flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-full"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    <span className="hidden sm:inline">Kembali</span>
                                </button>
                            )}
                        </div>

                        {/* Centered Steps Indicator */}
                        <div className="hidden sm:flex items-center gap-1 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                            {STEPS.map((step, idx) => (
                                <div key={step.id} className="flex items-center">
                                    <div className={`
                                        flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all duration-300
                                        ${currentStep > step.id
                                            ? 'bg-green-500 text-white shadow-green-500/20 shadow-lg scale-100'
                                            : currentStep === step.id
                                                ? 'bg-gmail-red-500 text-white ring-4 ring-gmail-red-500/20 shadow-gmail-red-500/30 shadow-lg scale-110'
                                                : 'bg-muted text-muted-foreground scale-90'
                                        }
                                    `}>
                                        {currentStep > step.id ? <CheckCircle2 className="h-4 w-4" /> : step.id}
                                    </div>
                                    {idx < STEPS.length - 1 && (
                                        <div className={`w-8 h-1 rounded-full mx-1 transition-colors duration-300 ${currentStep > step.id ? 'bg-green-500' : 'bg-muted/50'}`} />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Mobile Step Text */}
                        <div className="sm:hidden font-semibold text-sm">
                            Step {currentStep} / {STEPS.length}
                        </div>

                        {/* History Button */}
                        <Link href="/tools/email-generator2/history">
                            <button className="group flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-full">
                                <History className="h-4 w-4" />
                                <span className="hidden sm:inline">Riwayat</span>
                            </button>
                        </Link>
                    </div>
                </div>
            </div >

            {/* Main Content Area - Scrollable */}
            < div
                ref={contentRef}
                className="flex-1 overflow-y-auto custom-scrollbar relative"
            >
                <div className="max-w-3xl mx-auto px-4 py-8 min-h-full">
                    {/* Step Header Description */}
                    <div className="text-center mb-8">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gmail-red-50 text-gmail-red-600 dark:bg-red-900/30 dark:text-red-300 text-sm font-medium mb-4 shadow-sm border border-gmail-red-100 dark:border-red-800"
                        >
                            <Mail className="h-4 w-4" />
                            <span>Langkah {currentStep}: {STEPS[currentStep - 1].title}</span>
                        </motion.div>
                        <h1 className="text-2xl sm:text-4xl font-bold text-foreground tracking-tight mb-2">
                            {STEPS[currentStep - 1].title}
                        </h1>
                        <p className="text-muted-foreground/80 text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
                            {STEPS[currentStep - 1].description}
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 10, filter: 'blur(5px)' }}
                            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, x: -10, filter: 'blur(5px)' }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="pb-20" // Extra padding for footer
                        >
                            {currentStep === 1 && (
                                <StepBasicInfo formData={formData} updateFormData={updateFormData} />
                            )}
                            {currentStep === 2 && (
                                <StepProfile formData={formData} updateFormData={updateFormData} />
                            )}
                            {currentStep === 3 && (
                                <StepPreview
                                    formData={formData}
                                    updateFormData={updateFormData}
                                    onRegenerate={generateEmail}
                                    onReset={resetForm}
                                    isGenerating={isGenerating}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div >

            {/* Footer Bar - Fixed Bottom Flex Item (Only for Steps 1 & 2) */}
            {
                currentStep < 3 && (
                    <div className="flex-none z-20 bg-white/80 dark:bg-black/80 backdrop-blur-md border-t border-white/20 dark:border-white/10 py-4 px-4 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                        <div className="max-w-3xl mx-auto flex gap-4 items-center">
                            <Button
                                variant="ghost"
                                onClick={handlePrev}
                                disabled={currentStep === 1}
                                className="flex-none gap-2 text-muted-foreground hover:text-foreground active:scale-95 transition-transform"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                <span className="hidden xs:inline">Kembali</span>
                            </Button>

                            <Button
                                onClick={handleNext}
                                disabled={!canProceed() || isGenerating}
                                className={`
                                flex-1 sm:flex-none gap-2 min-w-[120px] sm:min-w-[160px] h-12 rounded-full text-base font-medium shadow-lg hover:shadow-xl transition-all active:scale-95
                                ${currentStep === 2
                                        ? 'bg-gradient-to-r from-gmail-red-600 to-gmail-red-500 hover:from-gmail-red-700 hover:to-gmail-red-600 text-white shadow-gmail-red-500/25'
                                        : 'bg-foreground text-background hover:bg-foreground/90'
                                    }
                            `}
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span className="truncate">Memproses AI...</span>
                                    </>
                                ) : currentStep === 2 ? (
                                    <>
                                        <Sparkles className="h-5 w-5 flex-none" />
                                        <span>Generate Email</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Selanjutnya</span>
                                        <ArrowRight className="h-5 w-5 flex-none" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
