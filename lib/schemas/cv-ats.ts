import { z } from "zod";

// Basic info schema
export const basicsSchema = z.object({
  firstName: z.string().min(1, "Nama depan wajib diisi"),
  lastName: z.string().min(1, "Nama belakang wajib diisi"),
  headline: z.string().min(1, "Headline wajib diisi"),
  address: z.string().optional(),
  city: z.string().optional(),
  phone: z.string()
    .regex(/^[\d\s\+\-\(\)]+$/, "Format telepon tidak valid")
    .optional()
    .or(z.literal("")),
  email: z.string().email("Email tidak valid"),
  website: z.string().url("URL tidak valid").optional().or(z.literal("")),
  linkedin: z.string().url("URL LinkedIn tidak valid").optional().or(z.literal("")),
});

// Experience schema
export const experienceSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Judul posisi wajib diisi"),
  company: z.string().min(1, "Nama perusahaan wajib diisi"),
  city: z.string().optional(),
  region: z.string().optional(),
  startDate: z.string().min(1, "Tanggal mulai wajib diisi"),
  endDate: z.string().optional().nullable(),
  isCurrent: z.boolean().default(false),
  bullets: z.array(z.string()).default([]),
}).refine(
  (data) => {
    if (data.isCurrent) return true;
    if (!data.endDate) return false;
    return new Date(data.startDate) <= new Date(data.endDate);
  },
  {
    message: "Tanggal mulai harus lebih awal dari tanggal selesai",
    path: ["endDate"],
  }
);

// Education schema
export const educationSchema = z.object({
  id: z.string().optional(),
  school: z.string().min(1, "Nama institusi wajib diisi"),
  degree: z.string().optional(),
  field: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().optional(),
}).refine(
  (data) => {
    if (!data.startDate || !data.endDate) return true;
    return new Date(data.startDate) <= new Date(data.endDate);
  },
  {
    message: "Tanggal mulai harus lebih awal dari tanggal selesai",
    path: ["endDate"],
  }
);

// Custom section schema
export const customSectionSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Judul bagian wajib diisi"),
  items: z.array(
    z.object({
      id: z.string().optional(),
      label: z.string().min(1, "Label wajib diisi"),
      description: z.string().optional(),
    })
  ).default([]),
});

// Complete resume schema
export const resumeSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Judul CV wajib diisi"),
  basics: basicsSchema,
  summary: z.string().max(600, "Ringkasan maksimal 600 karakter").optional(),
  experiences: z.array(experienceSchema).default([]),
  education: z.array(educationSchema).default([]),
  skills: z.array(z.string()).default([]),
  customSections: z.array(customSectionSchema).default([]),
  ats_score: z.number().optional(),
  updated_at: z.string().optional(),
});

// Types
export type Basics = z.infer<typeof basicsSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type CustomSection = z.infer<typeof customSectionSchema>;
export type Resume = z.infer<typeof resumeSchema>;

// Step schemas for validation
export const step1Schema = z.object({
  title: z.string().min(1, "Judul CV wajib diisi"),
  basics: basicsSchema,
});

export const step2Schema = z.object({
  summary: z.string().max(600, "Ringkasan maksimal 600 karakter").optional(),
});

export const step3Schema = z.object({
  experiences: z.array(experienceSchema).min(1, "Minimal satu pengalaman wajib diisi"),
});

export const step4Schema = z.object({
  education: z.array(educationSchema).min(1, "Minimal satu pendidikan wajib diisi"),
});

export const step5Schema = z.object({
  skills: z.array(z.string()).min(1, "Minimal satu skill wajib diisi"),
  customSections: z.array(customSectionSchema).default([]),
});

// Empty resume template
export const emptyResume: Resume = {
  title: "CV Saya",
  basics: {
    firstName: "",
    lastName: "",
    headline: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    website: "",
    linkedin: "",
  },
  summary: "",
  experiences: [],
  education: [],
  skills: [],
  customSections: [],
};
