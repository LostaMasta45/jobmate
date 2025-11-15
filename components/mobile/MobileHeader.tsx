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
        <Link href="/dashboard" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(0,209,220,0.2)] border border-gray-100 dark:border-gray-700 p-1 group-hover:scale-105 transition-transform duration-200">
            <img 
              src="/Logo/logokecil.png" 
              alt="JobMate Logo" 
              className="w-full h-full object-contain filter drop-shadow-[0_1px_4px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_1px_4px_rgba(0,209,220,0.2)]"
            />
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
