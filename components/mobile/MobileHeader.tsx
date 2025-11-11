"use client";

import Link from "next/link";
import { Bell, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

interface MobileHeaderProps {
  user?: {
    name?: string;
    email?: string;
    avatar?: string | null;
  };
  notificationCount?: number;
}

export function MobileHeader({ user, notificationCount = 0 }: MobileHeaderProps) {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getInitials = (name: string = "User") => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const currentTheme = theme === 'system' ? systemTheme : theme;

  const toggleTheme = () => {
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 lg:hidden">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left: Logo/Brand */}
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm">JM</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
            JobMate
          </h1>
        </Link>
        
        {/* Right: Actions */}
        <div className="flex items-center space-x-1">
          {/* Notification Button */}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            asChild
          >
            <Link href="/notifications">
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <Badge 
                  variant="destructive"
                  className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
                >
                  {notificationCount > 9 ? "9+" : notificationCount}
                </Badge>
              )}
            </Link>
          </Button>
          
          {/* Theme Toggle - Fixed */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle theme"
            >
              {currentTheme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-500 transition-transform hover:rotate-12" />
              ) : (
                <Moon className="w-5 h-5 text-blue-600 transition-transform hover:rotate-12" />
              )}
            </Button>
          )}
          
          {/* User Avatar */}
          <Link href="/settings">
            <Avatar className="w-8 h-8 cursor-pointer ring-2 ring-transparent hover:ring-primary/50 transition-all">
              <AvatarImage src={user?.avatar || undefined} alt={user?.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  );
}
