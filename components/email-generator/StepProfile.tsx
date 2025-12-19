"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
    GraduationCap, Briefcase, Building, Clock, Wrench, Users, School, BookOpen, User,
    Award, Star, MessageSquare, FileText, Paperclip, Heart, Lightbulb, BookMarked,
    HandHeart, Send
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { EmailFormDataV2 } from "./EmailWizardV2";

// Attachment options
const ATTACHMENT_OPTIONS = [
    { id: 'cv', label: 'CV / Resume', icon: FileText },
    { id: 'cover_letter', label: 'Surat Lamaran', icon: FileText },
    { id: 'ijazah', label: 'Ijazah / Transkrip Nilai', icon: GraduationCap },
    { id: 'certificate', label: 'Sertifikat / Piagam', icon: Award },
    { id: 'portfolio', label: 'Portfolio', icon: BookOpen },
    { id: 'photo', label: 'Pas Foto', icon: User },
    { id: 'other', label: 'Dokumen Lainnya', icon: Paperclip },
];

interface StepProfileProps {
    formData: EmailFormDataV2;
    updateFormData: (data: Partial<EmailFormDataV2>) => void;
}

export function StepProfile({ formData, updateFormData }: StepProfileProps) {
    const handleAttachmentToggle = (attachmentId: string) => {
        const current = formData.attachments || [];
        if (current.includes(attachmentId)) {
            updateFormData({ attachments: current.filter(id => id !== attachmentId) });
        } else {
            updateFormData({ attachments: [...current, attachmentId] });
        }
    };

    return (
        <div className="space-y-6">
            {/* Experience Level Selection */}
            <Card className="p-6 sm:p-8 shadow-lg border-0 bg-card/50 backdrop-blur">
                <Label className="text-base mb-4 block">
                    Status Kamu Saat Ini <span className="text-destructive">*</span>
                </Label>

                <RadioGroup
                    value={formData.experienceLevel}
                    onValueChange={(value: 'fresh_graduate' | 'experienced' | 'no_experience') =>
                        updateFormData({ experienceLevel: value })
                    }
                    className="grid grid-cols-1 gap-3"
                >
                    {/* Fresh Graduate Option */}
                    <label
                        htmlFor="fresh_graduate"
                        className={`
                            relative flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all active:scale-[0.98] duration-200
                            ${formData.experienceLevel === 'fresh_graduate'
                                ? 'border-gmail-red-500 bg-gmail-red-50 ring-2 ring-gmail-red-500/20'
                                : 'border-muted hover:border-muted-foreground/30'
                            }
                        `}
                    >
                        <RadioGroupItem value="fresh_graduate" id="fresh_graduate" className="mt-1" />
                        <div className="flex-1">
                            <div className="flex items-center gap-2 font-semibold">
                                <GraduationCap className="h-5 w-5 text-gmail-red-600" />
                                Fresh Graduate
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                                Lulusan baru SMA/SMK, D3, S1/S2
                            </p>
                        </div>
                    </label>

                    {/* No Experience Option */}
                    <label
                        htmlFor="no_experience"
                        className={`
                            relative flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all active:scale-[0.98] duration-200
                            ${formData.experienceLevel === 'no_experience'
                                ? 'border-gmail-red-500 bg-gmail-red-50 ring-2 ring-gmail-red-500/20'
                                : 'border-muted hover:border-muted-foreground/30'
                            }
                        `}
                    >
                        <RadioGroupItem value="no_experience" id="no_experience" className="mt-1" />
                        <div className="flex-1">
                            <div className="flex items-center gap-2 font-semibold">
                                <User className="h-5 w-5 text-gmail-red-600" />
                                Belum Ada Pengalaman Kerja
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                                Sedang mencari pekerjaan pertama
                            </p>
                        </div>
                    </label>

                    {/* Experienced Option */}
                    <label
                        htmlFor="experienced"
                        className={`
                            relative flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all active:scale-[0.98] duration-200
                            ${formData.experienceLevel === 'experienced'
                                ? 'border-gmail-red-500 bg-gmail-red-50 ring-2 ring-gmail-red-500/20'
                                : 'border-muted hover:border-muted-foreground/30'
                            }
                        `}
                    >
                        <RadioGroupItem value="experienced" id="experienced" className="mt-1" />
                        <div className="flex-1">
                            <div className="flex items-center gap-2 font-semibold">
                                <Briefcase className="h-5 w-5 text-gmail-red-600" />
                                Berpengalaman
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                                Sudah punya pengalaman kerja sebelumnya
                            </p>
                        </div>
                    </label>
                </RadioGroup>
            </Card>

            {/* Conditional Fields */}
            <AnimatePresence mode="wait">
                {formData.experienceLevel === 'fresh_graduate' && (
                    <motion.div
                        key="fresh_graduate_fields"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6"
                    >
                        {/* Education Type Selection */}
                        <Card className="p-6 sm:p-8 shadow-lg border-0 bg-card/50 backdrop-blur">
                            <Label className="text-base mb-4 block">
                                Jenjang Pendidikan Terakhir <span className="text-destructive">*</span>
                            </Label>
                            <RadioGroup
                                value={formData.educationType}
                                onValueChange={(value: 'sma_smk' | 'd3' | 's1_s2') =>
                                    updateFormData({ educationType: value })
                                }
                                className="grid grid-cols-3 gap-3"
                            >
                                <label
                                    htmlFor="sma_smk"
                                    className={`
                                        flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all text-center active:scale-[0.96] duration-200
                                        ${formData.educationType === 'sma_smk'
                                            ? 'border-gmail-red-500 bg-gmail-red-50 ring-2 ring-gmail-red-500/20'
                                            : 'border-muted hover:border-muted-foreground/30'
                                        }
                                    `}
                                >
                                    <RadioGroupItem value="sma_smk" id="sma_smk" className="sr-only" />
                                    <School className="h-6 w-6 text-gmail-red-600" />
                                    <span className="text-sm font-medium">SMA/SMK</span>
                                </label>

                                <label
                                    htmlFor="d3"
                                    className={`
                                        flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all text-center active:scale-[0.96] duration-200
                                        ${formData.educationType === 'd3'
                                            ? 'border-gmail-red-500 bg-gmail-red-50 ring-2 ring-gmail-red-500/20'
                                            : 'border-muted hover:border-muted-foreground/30'
                                        }
                                    `}
                                >
                                    <RadioGroupItem value="d3" id="d3" className="sr-only" />
                                    <BookOpen className="h-6 w-6 text-gmail-red-600" />
                                    <span className="text-sm font-medium">D3/D4</span>
                                </label>

                                <label
                                    htmlFor="s1_s2"
                                    className={`
                                        flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all text-center active:scale-[0.96] duration-200
                                        ${formData.educationType === 's1_s2'
                                            ? 'border-gmail-red-500 bg-gmail-red-50 ring-2 ring-gmail-red-500/20'
                                            : 'border-muted hover:border-muted-foreground/30'
                                        }
                                    `}
                                >
                                    <RadioGroupItem value="s1_s2" id="s1_s2" className="sr-only" />
                                    <GraduationCap className="h-6 w-6 text-gmail-red-600" />
                                    <span className="text-sm font-medium">S1/S2</span>
                                </label>
                            </RadioGroup>
                        </Card>

                        {/* Education Details based on type */}
                        <Card className="p-6 sm:p-8 space-y-6 shadow-lg border-0 bg-card/50 backdrop-blur">
                            <h3 className="font-semibold flex items-center gap-2">
                                {formData.educationType === 'sma_smk' ? (
                                    <School className="h-5 w-5 text-gmail-red-600" />
                                ) : (
                                    <GraduationCap className="h-5 w-5 text-gmail-red-600" />
                                )}
                                {formData.educationType === 'sma_smk' ? 'Informasi Sekolah' : 'Informasi Pendidikan'}
                            </h3>

                            {formData.educationType === 'sma_smk' ? (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="schoolName" className="text-base">
                                            Nama Sekolah <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="schoolName"
                                            placeholder="Contoh: SMKN 1 Jakarta, SMA Negeri 3 Bandung"
                                            value={formData.schoolName}
                                            onChange={(e) => updateFormData({ schoolName: e.target.value })}
                                            className="h-12 text-base"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="schoolMajor" className="text-base flex items-center gap-2">
                                            Jurusan <span className="text-muted-foreground text-sm">(opsional)</span>
                                        </Label>
                                        <Input
                                            id="schoolMajor"
                                            placeholder="Contoh: Teknik Komputer, Akuntansi, IPA, IPS"
                                            value={formData.schoolMajor}
                                            onChange={(e) => updateFormData({ schoolMajor: e.target.value })}
                                            className="h-12 text-base"
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="university" className="text-base">
                                            Nama Kampus <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="university"
                                            placeholder="Contoh: Universitas Indonesia, ITB, Binus"
                                            value={formData.university}
                                            onChange={(e) => updateFormData({ university: e.target.value })}
                                            className="h-12 text-base"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="major" className="text-base">
                                            Jurusan / Program Studi <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="major"
                                            placeholder="Contoh: Teknik Informatika, Manajemen, Akuntansi"
                                            value={formData.major}
                                            onChange={(e) => updateFormData({ major: e.target.value })}
                                            className="h-12 text-base"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="ipk" className="text-base flex items-center gap-2">
                                            <Star className="h-4 w-4 text-muted-foreground" />
                                            IPK <span className="text-muted-foreground text-sm">(opsional)</span>
                                        </Label>
                                        <Input
                                            id="ipk"
                                            placeholder="Contoh: 3.50, 3.75"
                                            value={formData.ipk}
                                            onChange={(e) => updateFormData({ ipk: e.target.value })}
                                            className="h-12 text-base"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Jika IPK kamu bagus (≥3.0), bisa dimasukkan sebagai nilai plus
                                        </p>
                                    </div>
                                </>
                            )}

                            {/* Organization Experience */}
                            <div className="space-y-2">
                                <Label htmlFor="organizationExp" className="text-base flex items-center gap-2">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    Pengalaman Organisasi / Magang
                                    <span className="text-muted-foreground text-sm">(opsional)</span>
                                </Label>
                                <Textarea
                                    id="organizationExp"
                                    placeholder="Contoh: Staff divisi marketing di OSIS, Magang di startup selama 3 bulan"
                                    value={formData.organizationExp}
                                    onChange={(e) => updateFormData({ organizationExp: e.target.value })}
                                    className="min-h-[80px] text-base resize-none"
                                />
                            </div>

                            {/* Achievements */}
                            <div className="space-y-2">
                                <Label htmlFor="achievements" className="text-base flex items-center gap-2">
                                    <Award className="h-4 w-4 text-muted-foreground" />
                                    Prestasi / Penghargaan
                                    <span className="text-muted-foreground text-sm">(opsional)</span>
                                </Label>
                                <Textarea
                                    id="achievements"
                                    placeholder="Contoh: Juara 2 lomba debat, Beasiswa prestasi, Best Student"
                                    value={formData.achievements}
                                    onChange={(e) => updateFormData({ achievements: e.target.value })}
                                    className="min-h-[80px] text-base resize-none"
                                />
                            </div>
                        </Card>

                        {/* Additional Info for Fresh Graduate */}
                        <Card className="p-6 sm:p-8 space-y-6 shadow-lg border-0 bg-card/50 backdrop-blur">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Lightbulb className="h-5 w-5 text-gmail-red-600" />
                                Informasi Tambahan
                                <span className="text-muted-foreground text-sm font-normal">(opsional tapi sangat membantu)</span>
                            </h3>
                            <p className="text-sm text-muted-foreground -mt-4">
                                Isi bagian ini jika kamu tidak punya pengalaman organisasi/magang
                            </p>

                            {/* Project/Thesis */}
                            <div className="space-y-2">
                                <Label htmlFor="projectThesis" className="text-base flex items-center gap-2">
                                    <BookMarked className="h-4 w-4 text-muted-foreground" />
                                    Proyek / Tugas Akhir
                                </Label>
                                <Textarea
                                    id="projectThesis"
                                    placeholder="Contoh: Membuat aplikasi kasir berbasis web, Skripsi tentang analisis data penjualan"
                                    value={formData.projectThesis}
                                    onChange={(e) => updateFormData({ projectThesis: e.target.value })}
                                    className="min-h-[80px] text-base resize-none"
                                />
                            </div>

                            {/* Courses/Certifications */}
                            <div className="space-y-2">
                                <Label htmlFor="courses" className="text-base flex items-center gap-2">
                                    <Award className="h-4 w-4 text-muted-foreground" />
                                    Kursus / Sertifikasi Online
                                </Label>
                                <Input
                                    id="courses"
                                    placeholder="Contoh: Google Analytics, Dicoding, Coursera Data Science"
                                    value={formData.courses}
                                    onChange={(e) => updateFormData({ courses: e.target.value })}
                                    className="h-12 text-base"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Kursus online menunjukkan inisiatif belajar mandiri
                                </p>
                            </div>

                            {/* Soft Skills */}
                            <div className="space-y-2">
                                <Label htmlFor="softSkills" className="text-base flex items-center gap-2">
                                    <Heart className="h-4 w-4 text-muted-foreground" />
                                    Soft Skills
                                </Label>
                                <Input
                                    id="softSkills"
                                    placeholder="Contoh: Komunikatif, Teamwork, Problem Solving, Teliti"
                                    value={formData.softSkills}
                                    onChange={(e) => updateFormData({ softSkills: e.target.value })}
                                    className="h-12 text-base"
                                />
                            </div>

                            {/* Relevant Hobby */}
                            <div className="space-y-2">
                                <Label htmlFor="relevantHobby" className="text-base flex items-center gap-2">
                                    <Star className="h-4 w-4 text-muted-foreground" />
                                    Hobi yang Relevan dengan Posisi
                                </Label>
                                <Input
                                    id="relevantHobby"
                                    placeholder="Contoh: Suka desain grafis (untuk posisi designer), Suka coding (untuk developer)"
                                    value={formData.relevantHobby}
                                    onChange={(e) => updateFormData({ relevantHobby: e.target.value })}
                                    className="h-12 text-base"
                                />
                            </div>
                        </Card>
                    </motion.div>
                )}

                {formData.experienceLevel === 'no_experience' && (
                    <motion.div
                        key="no_experience_fields"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Card className="p-6 sm:p-8 space-y-6 shadow-lg border-0 bg-card/50 backdrop-blur">
                            <h3 className="font-semibold flex items-center gap-2">
                                <User className="h-5 w-5 text-gmail-red-600" />
                                Tentang Kamu
                            </h3>

                            {/* Last Education */}
                            <div className="space-y-2">
                                <Label htmlFor="schoolName" className="text-base flex items-center gap-2">
                                    <School className="h-4 w-4 text-muted-foreground" />
                                    Pendidikan Terakhir
                                    <span className="text-muted-foreground text-sm">(opsional)</span>
                                </Label>
                                <Input
                                    id="schoolName"
                                    placeholder="Contoh: Lulusan SMA Negeri 1, D3 Akuntansi"
                                    value={formData.schoolName}
                                    onChange={(e) => updateFormData({ schoolName: e.target.value })}
                                    className="h-12 text-base"
                                />
                            </div>

                            {/* Skills */}
                            <div className="space-y-2">
                                <Label htmlFor="skills" className="text-base flex items-center gap-2">
                                    <Wrench className="h-4 w-4 text-muted-foreground" />
                                    Skill / Kemampuan
                                    <span className="text-muted-foreground text-sm">(opsional)</span>
                                </Label>
                                <Input
                                    id="skills"
                                    placeholder="Contoh: Microsoft Office, Komunikasi, Bahasa Inggris"
                                    value={formData.skills}
                                    onChange={(e) => updateFormData({ skills: e.target.value })}
                                    className="h-12 text-base"
                                />
                            </div>

                            {/* Informal Experience */}
                            <div className="space-y-2">
                                <Label htmlFor="informalExperience" className="text-base flex items-center gap-2">
                                    <HandHeart className="h-4 w-4 text-muted-foreground" />
                                    Pengalaman Informal
                                    <span className="text-muted-foreground text-sm">(opsional)</span>
                                </Label>
                                <Textarea
                                    id="informalExperience"
                                    placeholder="Contoh: Membantu usaha keluarga, Volunteer di kegiatan sosial, Jualan online"
                                    value={formData.informalExperience}
                                    onChange={(e) => updateFormData({ informalExperience: e.target.value })}
                                    className="min-h-[80px] text-base resize-none"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Pengalaman apapun yang menunjukkan kamu pernah bekerja/bertanggung jawab
                                </p>
                            </div>

                            {/* Courses */}
                            <div className="space-y-2">
                                <Label htmlFor="courses" className="text-base flex items-center gap-2">
                                    <Award className="h-4 w-4 text-muted-foreground" />
                                    Kursus / Pelatihan
                                    <span className="text-muted-foreground text-sm">(opsional)</span>
                                </Label>
                                <Input
                                    id="courses"
                                    placeholder="Contoh: Kursus komputer, Pelatihan dari desa, Sertifikat online"
                                    value={formData.courses}
                                    onChange={(e) => updateFormData({ courses: e.target.value })}
                                    className="h-12 text-base"
                                />
                            </div>

                            {/* Motivation */}
                            <div className="space-y-2">
                                <Label htmlFor="organizationExp" className="text-base flex items-center gap-2">
                                    Motivasi / Kelebihan
                                    <span className="text-muted-foreground text-sm">(opsional)</span>
                                </Label>
                                <Textarea
                                    id="organizationExp"
                                    placeholder="Contoh: Pekerja keras, cepat belajar, tidak mudah menyerah, selalu on time"
                                    value={formData.organizationExp}
                                    onChange={(e) => updateFormData({ organizationExp: e.target.value })}
                                    className="min-h-[80px] text-base resize-none"
                                />
                            </div>
                        </Card>
                    </motion.div>
                )}

                {formData.experienceLevel === 'experienced' && (
                    <motion.div
                        key="experienced_fields"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Card className="p-6 sm:p-8 space-y-6 shadow-lg border-0 bg-card/50 backdrop-blur">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-gmail-red-600" />
                                Pengalaman Kerja
                            </h3>

                            {/* Last Position */}
                            <div className="space-y-2">
                                <Label htmlFor="lastPosition" className="text-base flex items-center gap-2">
                                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                                    Posisi Terakhir <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="lastPosition"
                                    placeholder="Contoh: Admin Staff, Marketing Executive, Software Engineer"
                                    value={formData.lastPosition}
                                    onChange={(e) => updateFormData({ lastPosition: e.target.value })}
                                    className="h-12 text-base"
                                />
                            </div>

                            {/* Last Company */}
                            <div className="space-y-2">
                                <Label htmlFor="lastCompany" className="text-base flex items-center gap-2">
                                    <Building className="h-4 w-4 text-muted-foreground" />
                                    Perusahaan Terakhir <span className="text-muted-foreground text-sm">(opsional)</span>
                                </Label>
                                <Input
                                    id="lastCompany"
                                    placeholder="Contoh: PT XYZ Indonesia, Startup ABC"
                                    value={formData.lastCompany}
                                    onChange={(e) => updateFormData({ lastCompany: e.target.value })}
                                    className="h-12 text-base"
                                />
                            </div>

                            {/* Years of Experience */}
                            <div className="space-y-2">
                                <Label htmlFor="yearsExperience" className="text-base flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    Lama Pengalaman <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="yearsExperience"
                                    placeholder="Contoh: 2 tahun, 6 bulan, 3+ tahun"
                                    value={formData.yearsExperience}
                                    onChange={(e) => updateFormData({ yearsExperience: e.target.value })}
                                    className="h-12 text-base"
                                />
                            </div>

                            {/* Work Achievements */}
                            <div className="space-y-2">
                                <Label htmlFor="workAchievements" className="text-base flex items-center gap-2">
                                    <Award className="h-4 w-4 text-muted-foreground" />
                                    Pencapaian di Pekerjaan Terakhir
                                    <span className="text-muted-foreground text-sm">(opsional)</span>
                                </Label>
                                <Textarea
                                    id="workAchievements"
                                    placeholder="Contoh: Meningkatkan sales 30%, Mengelola tim 5 orang, Berhasil launch project baru"
                                    value={formData.workAchievements}
                                    onChange={(e) => updateFormData({ workAchievements: e.target.value })}
                                    className="min-h-[80px] text-base resize-none"
                                />
                            </div>

                            {/* Skills */}
                            <div className="space-y-2">
                                <Label htmlFor="skills" className="text-base flex items-center gap-2">
                                    <Wrench className="h-4 w-4 text-muted-foreground" />
                                    Skill Utama
                                    <span className="text-muted-foreground text-sm">(opsional)</span>
                                </Label>
                                <Input
                                    id="skills"
                                    placeholder="Contoh: Excel, Customer Service, React, Photoshop"
                                    value={formData.skills}
                                    onChange={(e) => updateFormData({ skills: e.target.value })}
                                    className="h-12 text-base"
                                />
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Attachments Section */}
            <Card className="p-6 sm:p-8 space-y-4 shadow-lg border-0 bg-card/50 backdrop-blur">
                <h3 className="font-semibold flex items-center gap-2">
                    <Paperclip className="h-5 w-5 text-gmail-red-600" />
                    Berkas yang Dilampirkan
                </h3>
                <p className="text-sm text-muted-foreground">
                    Pilih berkas yang akan kamu lampirkan. AI akan menyesuaikan kalimat dalam email.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {ATTACHMENT_OPTIONS.map((attachment) => {
                        const Icon = attachment.icon;
                        const isChecked = (formData.attachments || []).includes(attachment.id);
                        return (
                            <label
                                key={attachment.id}
                                className={`
                                    flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all active:scale-[0.98] duration-200
                                    ${isChecked
                                        ? 'border-gmail-red-600 bg-gmail-red-50'
                                        : 'border-muted hover:border-muted-foreground/30'
                                    }
                                `}
                            >
                                <Checkbox
                                    checked={isChecked}
                                    onCheckedChange={() => handleAttachmentToggle(attachment.id)}
                                />
                                <div className="flex items-center gap-2">
                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{attachment.label}</span>
                                </div>
                            </label>
                        );
                    })}
                </div>
            </Card>

            {/* Email Preferences */}
            <Card className="p-6 sm:p-8 space-y-6 shadow-lg border-0 bg-card/50 backdrop-blur">
                <h3 className="font-semibold flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-gmail-red-600" />
                    Preferensi Email
                </h3>

                {/* Email Tone */}
                <div className="space-y-3">
                    <Label className="text-base">Gaya Bahasa Email</Label>
                    <RadioGroup
                        value={formData.emailTone}
                        onValueChange={(value: 'formal' | 'semi_formal' | 'casual') =>
                            updateFormData({ emailTone: value })
                        }
                        className="grid grid-cols-3 gap-3"
                    >
                        <label
                            htmlFor="tone_formal"
                            className={`
                                flex flex-col items-center gap-1 p-3 rounded-xl border-2 cursor-pointer transition-all text-center
                                ${formData.emailTone === 'formal'
                                    ? 'border-gmail-red-600 bg-gmail-red-50'
                                    : 'border-muted hover:border-muted-foreground/30'
                                }
                            `}
                        >
                            <RadioGroupItem value="formal" id="tone_formal" className="sr-only" />
                            <span className="text-sm font-medium">Formal</span>
                            <span className="text-xs text-muted-foreground">Sangat sopan</span>
                        </label>

                        <label
                            htmlFor="tone_semi_formal"
                            className={`
                                flex flex-col items-center gap-1 p-3 rounded-xl border-2 cursor-pointer transition-all text-center
                                ${formData.emailTone === 'semi_formal'
                                    ? 'border-gmail-red-600 bg-gmail-red-50'
                                    : 'border-muted hover:border-muted-foreground/30'
                                }
                            `}
                        >
                            <RadioGroupItem value="semi_formal" id="tone_semi_formal" className="sr-only" />
                            <span className="text-sm font-medium">Semi-Formal</span>
                            <span className="text-xs text-muted-foreground">Profesional</span>
                        </label>

                        <label
                            htmlFor="tone_casual"
                            className={`
                                flex flex-col items-center gap-1 p-3 rounded-xl border-2 cursor-pointer transition-all text-center
                                ${formData.emailTone === 'casual'
                                    ? 'border-gmail-red-600 bg-gmail-red-50'
                                    : 'border-muted hover:border-muted-foreground/30'
                                }
                            `}
                        >
                            <RadioGroupItem value="casual" id="tone_casual" className="sr-only" />
                            <span className="text-sm font-medium">Santai</span>
                            <span className="text-xs text-muted-foreground">Friendly</span>
                        </label>
                    </RadioGroup>
                </div>

                {/* Email Length */}
                <div className="space-y-3">
                    <Label className="text-base flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        Panjang Email
                    </Label>
                    <RadioGroup
                        value={formData.emailLength}
                        onValueChange={(value: 'short' | 'medium' | 'long') =>
                            updateFormData({ emailLength: value })
                        }
                        className="grid grid-cols-3 gap-3"
                    >
                        <label
                            htmlFor="length_short"
                            className={`
                                flex flex-col items-center gap-1 p-3 rounded-xl border-2 cursor-pointer transition-all text-center
                                ${formData.emailLength === 'short'
                                    ? 'border-gmail-red-600 bg-gmail-red-50'
                                    : 'border-muted hover:border-muted-foreground/30'
                                }
                            `}
                        >
                            <RadioGroupItem value="short" id="length_short" className="sr-only" />
                            <span className="text-sm font-medium">Singkat</span>
                            <span className="text-xs text-muted-foreground">3-4 paragraf</span>
                        </label>

                        <label
                            htmlFor="length_medium"
                            className={`
                                flex flex-col items-center gap-1 p-3 rounded-xl border-2 cursor-pointer transition-all text-center
                                ${formData.emailLength === 'medium'
                                    ? 'border-gmail-red-600 bg-gmail-red-50'
                                    : 'border-muted hover:border-muted-foreground/30'
                                }
                            `}
                        >
                            <RadioGroupItem value="medium" id="length_medium" className="sr-only" />
                            <span className="text-sm font-medium">Sedang</span>
                            <span className="text-xs text-muted-foreground">4-5 paragraf</span>
                        </label>

                        <label
                            htmlFor="length_long"
                            className={`
                                flex flex-col items-center gap-1 p-3 rounded-xl border-2 cursor-pointer transition-all text-center
                                ${formData.emailLength === 'long'
                                    ? 'border-gmail-red-600 bg-gmail-red-50'
                                    : 'border-muted hover:border-muted-foreground/30'
                                }
                            `}
                        >
                            <RadioGroupItem value="long" id="length_long" className="sr-only" />
                            <span className="text-sm font-medium">Panjang</span>
                            <span className="text-xs text-muted-foreground">5-6 paragraf</span>
                        </label>
                    </RadioGroup>
                </div>

                {/* Closing Greeting */}
                <div className="space-y-3">
                    <Label className="text-base flex items-center gap-2">
                        <Send className="h-4 w-4 text-muted-foreground" />
                        Salam Penutup
                    </Label>
                    <RadioGroup
                        value={formData.closingGreeting}
                        onValueChange={(value: 'hormat_saya' | 'salam_hangat' | 'terima_kasih') =>
                            updateFormData({ closingGreeting: value })
                        }
                        className="grid grid-cols-3 gap-3"
                    >
                        <label
                            htmlFor="greeting_hormat"
                            className={`
                                flex flex-col items-center gap-1 p-3 rounded-xl border-2 cursor-pointer transition-all text-center
                                ${formData.closingGreeting === 'hormat_saya'
                                    ? 'border-gmail-red-600 bg-gmail-red-50'
                                    : 'border-muted hover:border-muted-foreground/30'
                                }
                            `}
                        >
                            <RadioGroupItem value="hormat_saya" id="greeting_hormat" className="sr-only" />
                            <span className="text-sm font-medium">Hormat saya</span>
                        </label>

                        <label
                            htmlFor="greeting_salam"
                            className={`
                                flex flex-col items-center gap-1 p-3 rounded-xl border-2 cursor-pointer transition-all text-center
                                ${formData.closingGreeting === 'salam_hangat'
                                    ? 'border-gmail-red-600 bg-gmail-red-50'
                                    : 'border-muted hover:border-muted-foreground/30'
                                }
                            `}
                        >
                            <RadioGroupItem value="salam_hangat" id="greeting_salam" className="sr-only" />
                            <span className="text-sm font-medium">Salam hangat</span>
                        </label>

                        <label
                            htmlFor="greeting_terima"
                            className={`
                                flex flex-col items-center gap-1 p-3 rounded-xl border-2 cursor-pointer transition-all text-center
                                ${formData.closingGreeting === 'terima_kasih'
                                    ? 'border-gmail-red-600 bg-gmail-red-50'
                                    : 'border-muted hover:border-muted-foreground/30'
                                }
                            `}
                        >
                            <RadioGroupItem value="terima_kasih" id="greeting_terima" className="sr-only" />
                            <span className="text-sm font-medium">Terima kasih</span>
                        </label>
                    </RadioGroup>
                </div>
            </Card>
        </div>
    );
}
