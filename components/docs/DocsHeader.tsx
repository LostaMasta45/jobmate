import Link from "next/link";
import { ChevronLeft, Home, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface DocsHeaderProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  backToDocsHref?: string;
}

export function DocsHeader({ 
  title, 
  description, 
  icon,
  backToDocsHref = "/docs"
}: DocsHeaderProps) {
  return (
    <div className="mb-6 sm:mb-8">
      {/* Breadcrumbs - Hide long text on mobile */}
      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 overflow-x-auto pb-1">
        <Link 
          href="/dashboard" 
          className="hover:text-foreground transition-colors flex items-center gap-1 whitespace-nowrap"
        >
          <Home className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
          <span className="hidden xs:inline">Dashboard</span>
        </Link>
        <span className="text-muted-foreground/50">/</span>
        <Link 
          href={backToDocsHref}
          className="hover:text-foreground transition-colors flex items-center gap-1 whitespace-nowrap"
        >
          <BookOpen className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
          <span className="hidden xs:inline">Docs</span>
        </Link>
        <span className="text-muted-foreground/50">/</span>
        <span className="text-foreground font-medium truncate">{title}</span>
      </div>

      {/* Back Button - More compact on mobile */}
      <div className="mb-3 sm:mb-4">
        <Link href={backToDocsHref}>
          <Button variant="ghost" size="sm" className="gap-1.5 sm:gap-2 -ml-2 text-sm">
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden xs:inline">Kembali ke Panduan</span>
            <span className="xs:hidden">Kembali</span>
          </Button>
        </Link>
      </div>

      {/* Title Section - Responsive icon and text */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-start gap-2 sm:gap-3">
          {icon && (
            <div className="p-2 sm:p-3 bg-primary/10 rounded-lg flex-shrink-0">
              {icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              {title}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base lg:text-lg mt-1 sm:mt-2">
              {description}
            </p>
          </div>
        </div>
      </div>

      <Separator className="mt-4 sm:mt-6" />
    </div>
  );
}
