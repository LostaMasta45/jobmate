import { AlertCircle, CheckCircle2, Info, Lightbulb, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TipBoxProps {
  type?: "info" | "success" | "warning" | "tip" | "danger";
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const typeConfig = {
  info: {
    icon: Info,
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-800",
    iconColor: "text-blue-600 dark:text-blue-400",
    titleColor: "text-blue-900 dark:text-blue-100",
  },
  success: {
    icon: CheckCircle2,
    bgColor: "bg-green-50 dark:bg-green-950/30",
    borderColor: "border-green-200 dark:border-green-800",
    iconColor: "text-green-600 dark:text-green-400",
    titleColor: "text-green-900 dark:text-green-100",
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    titleColor: "text-yellow-900 dark:text-yellow-100",
  },
  tip: {
    icon: Lightbulb,
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    borderColor: "border-purple-200 dark:border-purple-800",
    iconColor: "text-purple-600 dark:text-purple-400",
    titleColor: "text-purple-900 dark:text-purple-100",
  },
  danger: {
    icon: AlertCircle,
    bgColor: "bg-red-50 dark:bg-red-950/30",
    borderColor: "border-red-200 dark:border-red-800",
    iconColor: "text-red-600 dark:text-red-400",
    titleColor: "text-red-900 dark:text-red-100",
  },
};

export function TipBox({ type = "info", title, children, className }: TipBoxProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "rounded-lg border-l-4 p-4 my-4",
        config.bgColor,
        config.borderColor,
        className
      )}
    >
      <div className="flex gap-3">
        <Icon className={cn("w-5 h-5 flex-shrink-0 mt-0.5", config.iconColor)} />
        <div className="flex-1">
          {title && (
            <h4 className={cn("font-semibold mb-1", config.titleColor)}>
              {title}
            </h4>
          )}
          <div className="text-sm leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}
