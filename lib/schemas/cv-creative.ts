import { Resume } from "./cv-ats";

export type TemplateId = 
  | "modern-gradient" 
  | "bold-minimalist" 
  | "pastel-professional"
  | "dark-mode-pro"
  | "magazine-layout"
  | "colorful-blocks"
  | "cv075-professional"
  | "timeline-hero"
  | "portfolio-grid"
  | "infographic-style"
  | "split-screen"
  | "geometric-modern"
  | "watercolor-artist";

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface PhotoOptions {
  position: "header-left" | "header-center" | "sidebar-top";
  shape: "circle" | "square" | "rounded-square";
  size: "small" | "medium" | "large";
  border: { style: string; color: string; width: number };
  filter: "none" | "grayscale" | "vibrant";
}

export interface CreativeCV {
  id: string;
  userId: string;
  title: string;
  templateId: TemplateId;
  colorScheme: ColorScheme;
  photoUrl: string | null;
  photoOptions: PhotoOptions;
  content: Resume;
  atsScore: number | null;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const TEMPLATES = [
  {
    id: "modern-gradient",
    name: "Modern Gradient",
    description: "Clean dengan gradient accent yang sophisticated",
    category: "modern",
    bestFor: ["UI/UX Designer", "Digital Marketer", "Product Manager"],
    defaultColors: { primary: "#6366f1", secondary: "#8b5cf6", accent: "#a855f7", background: "#ffffff", text: "#1e293b" },
    isPremium: false,
  },
  {
    id: "bold-minimalist",
    name: "Bold Minimalist",
    description: "Statement-making dengan typography bold",
    category: "modern",
    bestFor: ["Creative Director", "Brand Manager", "Graphic Designer"],
    defaultColors: { primary: "#0ea5e9", secondary: "#0284c7", accent: "#0ea5e9", background: "#ffffff", text: "#0f172a" },
    isPremium: false,
  },
  {
    id: "pastel-professional",
    name: "Pastel Professional",
    description: "Soft, approachable dengan pastel colors",
    category: "professional",
    bestFor: ["HR Professional", "Customer Success", "Account Manager"],
    defaultColors: { primary: "#10b981", secondary: "#34d399", accent: "#6ee7b7", background: "#ffffff", text: "#1e293b" },
    isPremium: false,
  },
  {
    id: "dark-mode-pro",
    name: "Midnight Executive",
    description: "Sleek, high-contrast dark theme with modern tech aesthetics",
    category: "modern",
    bestFor: ["Software Engineer", "DevOps", "Tech Lead", "Solutions Architect"],
    defaultColors: { primary: "#3b82f6", secondary: "#60a5fa", accent: "#818cf8", background: "#0f172a", text: "#f8fafc" },
    isPremium: false,
  },
  {
    id: "magazine-layout",
    name: "Magazine Layout",
    description: "Editorial style dengan multi-column design",
    category: "creative",
    bestFor: ["Content Writer", "Journalist", "Editor"],
    defaultColors: { primary: "#dc2626", secondary: "#ef4444", accent: "#f87171", background: "#ffffff", text: "#1e293b" },
    isPremium: true,
  },
  {
    id: "colorful-blocks",
    name: "Colorful Blocks",
    description: "Vibrant dan energetic dengan color blocks",
    category: "creative",
    bestFor: ["Social Media Manager", "Event Planner", "Marketing"],
    defaultColors: { primary: "#f59e0b", secondary: "#fbbf24", accent: "#fcd34d", background: "#ffffff", text: "#1e293b" },
    isPremium: true,
  },
  {
    id: "cv075-professional",
    name: "CV075 Professional",
    description: "Modern 2-column layout dengan vertical name & yellow accent",
    category: "professional",
    bestFor: ["Fresh Graduate", "Admin", "Digital Marketing", "Business Professional"],
    defaultColors: { primary: "#4A7BA7", secondary: "#2C5985", accent: "#FFD700", background: "#F5F5F0", text: "#1e293b" },
    isPremium: false,
  },
  {
    id: "timeline-hero",
    name: "Timeline Hero",
    description: "Visual timeline untuk highlight career journey",
    category: "professional",
    bestFor: ["Project Manager", "Business Analyst", "Consultant"],
    defaultColors: { primary: "#8b5cf6", secondary: "#a78bfa", accent: "#c4b5fd", background: "#ffffff", text: "#1e293b" },
    isPremium: true,
  },
  {
    id: "portfolio-grid",
    name: "Portfolio Grid",
    description: "Grid layout perfect untuk showcase projects",
    category: "creative",
    bestFor: ["Photographer", "Architect", "Designer"],
    defaultColors: { primary: "#06b6d4", secondary: "#22d3ee", accent: "#67e8f9", background: "#ffffff", text: "#1e293b" },
    isPremium: true,
  },
  {
    id: "infographic-style",
    name: "Infographic Style",
    description: "Data-driven dengan visual charts & icons",
    category: "creative",
    bestFor: ["Data Analyst", "Marketing Analyst", "Business Intelligence"],
    defaultColors: { primary: "#ec4899", secondary: "#f472b6", accent: "#f9a8d4", background: "#ffffff", text: "#1e293b" },
    isPremium: true,
  },
  {
    id: "split-screen",
    name: "Split Screen",
    description: "Unique two-column layout dengan visual hierarchy",
    category: "modern",
    bestFor: ["Creative Developer", "Product Designer", "Art Director"],
    defaultColors: { primary: "#14b8a6", secondary: "#2dd4bf", accent: "#5eead4", background: "#ffffff", text: "#1e293b" },
    isPremium: true,
  },
  {
    id: "geometric-modern",
    name: "Geometric Modern",
    description: "Contemporary dengan geometric shapes & patterns",
    category: "modern",
    bestFor: ["UI Designer", "Frontend Developer", "Digital Designer"],
    defaultColors: { primary: "#6366f1", secondary: "#818cf8", accent: "#a5b4fc", background: "#ffffff", text: "#1e293b" },
    isPremium: true,
  },
  {
    id: "watercolor-artist",
    name: "Watercolor Artist",
    description: "Artistic watercolor effects untuk creative fields",
    category: "creative",
    bestFor: ["Artist", "Illustrator", "Art Teacher"],
    defaultColors: { primary: "#f472b6", secondary: "#fb923c", accent: "#fbbf24", background: "#fffbeb", text: "#1e293b" },
    isPremium: true,
  },
];

export const COLOR_PRESETS = [
  { name: "Professional Blue", colors: { primary: "#2563eb", secondary: "#1e40af", accent: "#3b82f6", background: "#ffffff", text: "#1e293b" } },
  { name: "Growth Green", colors: { primary: "#10b981", secondary: "#059669", accent: "#34d399", background: "#ffffff", text: "#1e293b" } },
  { name: "Creative Orange", colors: { primary: "#f59e0b", secondary: "#d97706", accent: "#fbbf24", background: "#ffffff", text: "#1e293b" } },
  { name: "Premium Purple", colors: { primary: "#8b5cf6", secondary: "#7c3aed", accent: "#a78bfa", background: "#ffffff", text: "#1e293b" } },
];

export const defaultColorScheme: ColorScheme = { primary: "#2563eb", secondary: "#1e40af", accent: "#3b82f6", background: "#ffffff", text: "#1e293b" };
export const defaultPhotoOptions: PhotoOptions = { position: "header-left", shape: "circle", size: "medium", border: { style: "solid", color: "#2563eb", width: 2 }, filter: "none" };
