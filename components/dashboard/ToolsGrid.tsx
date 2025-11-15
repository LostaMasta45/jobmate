import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { FileText, Target, User, Mail, MessageSquare, Briefcase, FileStack, ArrowRight, Sparkles } from "lucide-react";

const tools = [
  {
    title: "Surat Lamaran",
    description: "Buat surat lamaran profesional",
    icon: FileText,
    href: "/surat-lamaran-sederhana",
    gradient: "from-[#8e68fd]/10 to-[#5547d0]/5",
    iconBg: "bg-[#8e68fd]/10",
    iconColor: "text-[#8e68fd]",
  },
  {
    title: "CV ATS",
    description: "Optimize resume untuk ATS",
    icon: Target,
    href: "/tools/cv-ats",
    gradient: "from-[#5547d0]/10 to-[#3977d3]/5",
    iconBg: "bg-[#5547d0]/10",
    iconColor: "text-[#5547d0]",
  },
  {
    title: "CV Profile",
    description: "Generate profile profesional",
    icon: User,
    href: "/tools/cv-profile",
    gradient: "from-[#3977d3]/10 to-[#00acc7]/5",
    iconBg: "bg-[#3977d3]/10",
    iconColor: "text-[#3977d3]",
  },
  {
    title: "Email Template",
    description: "Template email lamaran",
    icon: Mail,
    href: "/tools/email-template",
    gradient: "from-[#00acc7]/10 to-[#00bed1]/5",
    iconBg: "bg-[#00acc7]/10",
    iconColor: "text-[#00acc7]",
  },
  {
    title: "Tracker",
    description: "Track semua lamaran Anda",
    icon: Briefcase,
    href: "/tools/tracker",
    gradient: "from-[#00bed1]/10 to-[#00d1dc]/5",
    iconBg: "bg-[#00bed1]/10",
    iconColor: "text-[#00bed1]",
  },
  {
    title: "PDF Tools",
    description: "Edit dan convert PDF",
    icon: FileStack,
    href: "/tools/pdf-tools",
    gradient: "from-[#00d1dc]/10 to-[#00acc7]/5",
    iconBg: "bg-[#00d1dc]/10",
    iconColor: "text-[#00d1dc]",
  },
  {
    title: "WA Generator",
    description: "Generate pesan WhatsApp",
    icon: MessageSquare,
    href: "/tools/wa-generator",
    gradient: "from-[#00acc7]/10 to-[#3977d3]/5",
    iconBg: "bg-[#00acc7]/10",
    iconColor: "text-[#00acc7]",
  },
];

export function ToolsGrid() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-[#00d1dc]" />
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
