import * as React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  hideOnMobile?: boolean; // Option to hide on mobile (when using MobileToolHeader)
}

export function PageHeader({
  title,
  description,
  actions,
  hideOnMobile = false,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "mb-4 sm:mb-5 md:mb-6 flex flex-col gap-2 sm:gap-3 md:gap-4 md:flex-row md:items-center md:justify-between",
        hideOnMobile && "hidden lg:block", // Hide on mobile if MobileToolHeader is used
        className
      )}
      {...props}
    >
      <div className="space-y-0.5 sm:space-y-1">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
