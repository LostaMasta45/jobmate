"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/layout/ThemeProvider";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="w-full justify-start">
        <Sun className="h-4 w-4 mr-2" />
        Theme
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-full justify-start"
    >
      {theme === "dark" ? (
        <>
          <Sun className="h-4 w-4 mr-2" />
          Light Mode
        </>
      ) : (
        <>
          <Moon className="h-4 w-4 mr-2" />
          Dark Mode
        </>
      )}
    </Button>
  );
}
