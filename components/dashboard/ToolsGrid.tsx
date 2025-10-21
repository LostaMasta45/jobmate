import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { FileText, Target, User, Mail, MessageSquare, Briefcase, FileStack, ArrowRight, Sparkles } from "lucide-react";

const tools = [
  {
    title: "Cover Letter",
    description: "Generate cover letter dengan AI",
    icon: FileText,
    href: "/tools/cover-letter",
    gradient: "from-blue-500/10 to-blue-600/5",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600",
  },
  {
    title: "CV ATS",
    description: "Optimize resume untuk ATS",
    icon: Target,
    href: "/tools/cv-ats",
    gradient: "from-purple-500/10 to-purple-600/5",
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-600",
  },
  {
    title: "CV Profile",
    description: "Generate profile profesional",
    icon: User,
    href: "/tools/cv-profile",
    gradient: "from-green-500/10 to-green-600/5",
    iconBg: "bg-green-500/10",
    iconColor: "text-green-600",
  },
  {
    title: "Email Template",
    description: "Template email lamaran",
    icon: Mail,
    href: "/tools/email-template",
    gradient: "from-amber-500/10 to-amber-600/5",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-600",
  },
  {
    title: "Tracker",
    description: "Track semua lamaran Anda",
    icon: Briefcase,
    href: "/tools/tracker",
    gradient: "from-red-500/10 to-red-600/5",
    iconBg: "bg-red-500/10",
    iconColor: "text-red-600",
  },
  {
    title: "PDF Tools",
    description: "Edit dan convert PDF",
    icon: FileStack,
    href: "/tools/pdf-tools",
    gradient: "from-orange-500/10 to-orange-600/5",
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-600",
  },
  {
    title: "WA Generator",
    description: "Generate pesan WhatsApp",
    icon: MessageSquare,
    href: "/tools/wa-generator",
    gradient: "from-teal-500/10 to-teal-600/5",
    iconBg: "bg-teal-500/10",
    iconColor: "text-teal-600",
  },
];

export function ToolsGrid() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
        <h2 className="text-base sm:text-lg font-semibold">Alat Bantu Karier</h2>
      </div>
      <div className="grid gap-2.5 sm:gap-3 md:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {tools.map((tool) => (
          <Link key={tool.href} href={tool.href}>
            <Card className="group cursor-pointer transition-all duration-300 hover:shadow-md hover:border-primary/20 border shadow-sm h-full">
              <CardContent className="p-3 sm:p-4 h-full flex flex-col">
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <div className={`p-2 sm:p-2.5 rounded-lg ${tool.iconBg} flex-shrink-0`}>
                    <tool.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${tool.iconColor}`} />
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="mb-0.5 sm:mb-1 font-semibold text-xs sm:text-sm truncate">{tool.title}</h3>
                  <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-2">{tool.description}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
