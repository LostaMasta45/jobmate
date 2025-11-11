import { cn } from "@/lib/utils";

interface StepProps {
  number: number;
  title: string;
  children: React.ReactNode;
  isLast?: boolean;
}

export function Step({ number, title, children, isLast }: StepProps) {
  return (
    <div className="flex gap-3 sm:gap-4 relative pb-6 sm:pb-8">
      {/* Timeline Line - Responsive positioning */}
      {!isLast && (
        <div className="absolute left-[13px] sm:left-[15px] top-[28px] sm:top-[32px] bottom-0 w-[2px] bg-gradient-to-b from-primary to-muted" />
      )}
      
      {/* Step Number - Smaller on mobile */}
      <div className="flex-shrink-0">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs sm:text-sm shadow-md">
          {number}
        </div>
      </div>
      
      {/* Content - Better mobile spacing */}
      <div className="flex-1 min-w-0 pt-0.5">
        <h4 className="font-semibold text-sm sm:text-base mb-1.5 sm:mb-2 leading-snug">
          {title}
        </h4>
        <div className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}

interface StepByStepProps {
  children?: React.ReactNode;
  className?: string;
  step?: number;
  title?: string;
  description?: React.ReactNode;
}

export function StepByStep({ children, className, step, title, description }: StepByStepProps) {
  // If using as wrapper (old usage)
  if (children && !step) {
    return (
      <div className={cn("my-6", className)}>
        {children}
      </div>
    );
  }

  // If using with step/title/description props (new usage)
  if (step && title) {
    return (
      <Step number={step} title={title}>
        {description || children}
      </Step>
    );
  }

  // Fallback
  return (
    <div className={cn("my-6", className)}>
      {children}
    </div>
  );
}
