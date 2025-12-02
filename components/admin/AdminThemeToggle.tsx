"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/layout/ThemeProvider";
import { cn } from "@/lib/utils";

export function AdminThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const resolvedTheme = React.useMemo(() => {
    if (!mounted) return "light";
    if (theme === "system") {
      if (typeof window !== "undefined") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
      return "light";
    }
    return theme;
  }, [theme, mounted]);

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setTheme(newTheme);
  };

  return (
    <div className="space-y-2" suppressHydrationWarning>
      <button
        onClick={toggleTheme}
        suppressHydrationWarning
        className={cn(
          "w-full flex items-center justify-between p-3 rounded-lg transition-all duration-300",
          "bg-gradient-to-r border",
          mounted && isDark
            ? "from-slate-800/80 to-slate-900/80 border-slate-700/50 hover:border-slate-600/50"
            : "from-amber-50/80 to-orange-50/80 border-amber-200/50 hover:border-amber-300/50",
          "group cursor-pointer"
        )}
      >
        <div className="flex items-center gap-3">
          <div
            suppressHydrationWarning
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300",
              mounted && isDark
                ? "bg-slate-700/80 text-blue-400"
                : "bg-amber-100 text-amber-600"
            )}
          >
            {mounted && isDark ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </div>
          <div className="flex flex-col items-start">
            <span 
              suppressHydrationWarning
              className={cn(
                "text-sm font-medium transition-colors",
                mounted && isDark ? "text-slate-200" : "text-slate-700"
              )}
            >
              {mounted ? (isDark ? "Dark Mode" : "Light Mode") : "Light Mode"}
            </span>
            <span 
              suppressHydrationWarning
              className={cn(
                "text-[10px] transition-colors",
                mounted && isDark ? "text-slate-400" : "text-slate-500"
              )}
            >
              Klik untuk beralih
            </span>
          </div>
        </div>

        <div
          suppressHydrationWarning
          className={cn(
            "relative w-12 h-6 rounded-full transition-all duration-300 flex items-center",
            mounted && isDark
              ? "bg-blue-600/80"
              : "bg-amber-400/80"
          )}
        >
          <div
            suppressHydrationWarning
            className={cn(
              "absolute w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 flex items-center justify-center",
              mounted && isDark ? "translate-x-6" : "translate-x-0.5"
            )}
          >
            {mounted && isDark ? (
              <Moon className="w-3 h-3 text-blue-600" />
            ) : (
              <Sun className="w-3 h-3 text-amber-500" />
            )}
          </div>
        </div>
      </button>
    </div>
  );
}
