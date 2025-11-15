"use client";

import * as React from "react";

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = "Memuat dashboard..." }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Logo */}
        <div className="relative">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-[#8e68fd]/20 animate-ping" />
          
          {/* Spinning Ring */}
          <div className="relative h-20 w-20 rounded-full border-4 border-transparent border-t-[#8e68fd] dark:border-t-[#00d1dc] animate-spin" />
          
          {/* Logo Center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,209,220,0.2)] border-2 border-gray-100 dark:border-gray-700 p-2.5">
              <img 
                src="/Logo/logokecil.png" 
                alt="JobMate Logo" 
                className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_2px_8px_rgba(0,209,220,0.3)] animate-pulse"
              />
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-lg font-semibold text-foreground animate-pulse">
            {message}
          </p>
          
          {/* Loading Dots */}
          <div className="flex gap-1.5">
            <div className="h-2 w-2 rounded-full bg-brand animate-bounce [animation-delay:-0.3s]" />
            <div className="h-2 w-2 rounded-full bg-brand animate-bounce [animation-delay:-0.15s]" />
            <div className="h-2 w-2 rounded-full bg-brand animate-bounce" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-brand to-brand/60 animate-loading-bar" />
        </div>
      </div>
    </div>
  );
}
