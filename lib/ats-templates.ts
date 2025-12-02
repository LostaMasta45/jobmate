import { Resume } from "@/lib/schemas/cv-ats";

export type ATSTemplateId = 
  | "classic" 
  | "modern" 
  | "executive" 
  | "minimalist"
  | "corporate"
  | "elegant"
  | "functional"
  | "sidebar";

export interface ATSTemplateConfig {
  id: ATSTemplateId;
  name: string;
  description: string;
  fontFamily: string; // CSS font stack
  thumbnailColor: string;
}

export const ATS_TEMPLATES: ATSTemplateConfig[] = [
  {
    id: "classic",
    name: "Classic Ivy",
    description: "Tradisional, formal, dan sangat aman untuk semua industri.",
    fontFamily: "Times New Roman, Georgia, serif",
    thumbnailColor: "#e2e8f0", // Slate-200
  },
  {
    id: "modern",
    name: "Modern Tech",
    description: "Bersih, sans-serif, cocok untuk startup dan industri kreatif.",
    fontFamily: "Arial, Helvetica, sans-serif",
    thumbnailColor: "#cbd5e1", // Slate-300
  },
  {
    id: "executive",
    name: "Executive Compact",
    description: "Layout padat untuk memuat banyak pengalaman dalam 1-2 halaman.",
    fontFamily: "Calibri, Roboto, sans-serif",
    thumbnailColor: "#94a3b8", // Slate-400
  },
  {
    id: "minimalist",
    name: "Minimalist Border",
    description: "Elegan dengan sentuhan border tipis dan hierarki yang jelas.",
    fontFamily: "Verdana, Geneva, sans-serif",
    thumbnailColor: "#64748b", // Slate-500
  },
  {
    id: "corporate",
    name: "Corporate Grid",
    description: "Layout dua kolom yang memisahkan keahlian dari pengalaman utama.",
    fontFamily: "Arial, sans-serif",
    thumbnailColor: "#475569", // Slate-600
  },
  {
    id: "elegant",
    name: "Serif Elegant",
    description: "Gaya klasik mewah dengan aksen garis ganda, cocok untuk hukum & akademis.",
    fontFamily: "Georgia, serif",
    thumbnailColor: "#334155", // Slate-700
  },
  {
    id: "functional",
    name: "Tech Functional",
    description: "Utilitarian dengan font monospace pada header, favorit engineer.",
    fontFamily: "Courier New, monospace",
    thumbnailColor: "#1e293b", // Slate-800
  },
  {
    id: "sidebar",
    name: "Clean Sidebar",
    description: "Header modern dengan blok kontak vertikal yang rapi.",
    fontFamily: "Trebuchet MS, sans-serif",
    thumbnailColor: "#0f172a", // Slate-900
  },
];
