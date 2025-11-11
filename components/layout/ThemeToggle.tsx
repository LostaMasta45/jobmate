"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [currentTheme, setCurrentTheme] = React.useState<"light" | "dark">("light");

  // Only run on client
  React.useEffect(() => {
    setMounted(true);

    // Calculate current theme (system or explicit)
    const getResolvedTheme = () => {
      if (theme === "system") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
      return theme;
    };

    setCurrentTheme(getResolvedTheme());

    // Listen to system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        setCurrentTheme(mediaQuery.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  // Update currentTheme when theme changes
  React.useEffect(() => {
    if (!mounted) return;
    
    if (theme === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setCurrentTheme(isDark ? "dark" : "light");
    } else {
      setCurrentTheme(theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    console.log('🎨 Toggle clicked! Current:', currentTheme);
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    console.log('🎨 Switching to:', newTheme);
    setTheme(newTheme);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        disabled
        aria-label="Toggle theme"
        className="opacity-50 cursor-not-allowed"
      >
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('🖱️ Button clicked!');
        toggleTheme();
      }}
      aria-label="Toggle theme"
      className="relative z-50 transition-all duration-200 hover:bg-accent hover:scale-110 active:scale-95 cursor-pointer"
      style={{ pointerEvents: 'auto' }}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
