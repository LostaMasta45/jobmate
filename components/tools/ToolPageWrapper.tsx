"use client";

import { ReactNode } from "react";
import { MobileToolHeader } from "./MobileToolHeader";
import { cn } from "@/lib/utils";

interface ToolPageWrapperProps {
  title: string;
  description?: string;
  showHomeButton?: boolean;
  onBack?: () => void;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

/**
 * Wrapper component for tool pages with mobile-optimized header
 * Includes:
 * - Mobile-only sticky header with back button
 * - Quick access to tools menu
 * - Clean navigation UX
 */
export function ToolPageWrapper({
  title,
  description,
  showHomeButton = false,
  onBack,
  children,
  className,
  contentClassName
}: ToolPageWrapperProps) {
  return (
    <div className={cn("min-h-screen", className)}>
      {/* Mobile Tool Header - Only on mobile */}
      <MobileToolHeader
        title={title}
        description={description}
        showHomeButton={showHomeButton}
        onBack={onBack}
      />

      {/* Tool Content */}
      <div className={cn(
        "lg:pt-0", // No extra padding on desktop
        contentClassName
      )}>
        {children}
      </div>
    </div>
  );
}
