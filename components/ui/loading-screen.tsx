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
          <div className="absolute inset-0 rounded-full border-4 border-brand/20 animate-ping" />
          
          {/* Spinning Ring */}
          <div className="relative h-20 w-20 rounded-full border-4 border-transparent border-t-brand animate-spin" />
          
          {/* Logo Center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-lg">
              <span className="text-2xl font-bold animate-pulse">JM</span>
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
