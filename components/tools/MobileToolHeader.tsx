"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, X, Home, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MobileToolHeaderProps {
  title: string;
  description?: string;
  showHomeButton?: boolean;
  onBack?: () => void;
  className?: string;
}

export function MobileToolHeader({
  title,
  description,
  showHomeButton = false,
  onBack,
  className
}: MobileToolHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleBackToTools = () => {
    router.push('/tools');
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <>
      {/* Mobile Header - Only visible on mobile */}
      <div className={cn(
        "lg:hidden sticky top-0 z-40 w-full",
        "bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg",
        "border-b border-gray-200 dark:border-gray-800",
        "shadow-sm",
        className
      )}>
        <div className="flex items-center gap-2 px-3 py-3">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="flex-shrink-0 h-9 w-9 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          {/* Title & Description */}
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-semibold text-gray-900 dark:text-white truncate">
              {title}
            </h1>
            {description && (
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                {description}
              </p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Back to Tools Menu */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackToTools}
              className="h-9 w-9 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Kembali ke Menu Tools"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>

            {/* Back to Dashboard (optional) */}
            {showHomeButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBackToDashboard}
                className="h-9 w-9 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Ke Dashboard"
              >
                <Home className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
