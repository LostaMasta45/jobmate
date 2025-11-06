"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface PasswordStrengthMeterProps {
  password: string;
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const getPasswordStrength = (pwd: string): number => {
    if (pwd.length < 6) return 0;
    
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;
    
    return Math.min(strength, 3);
  };

  const strength = getPasswordStrength(password);

  const getStrengthText = () => {
    switch (strength) {
      case 0:
        return "";
      case 1:
        return "🔴 Lemah - tambahkan huruf besar & angka";
      case 2:
        return "🟡 Sedang - tambahkan karakter khusus";
      case 3:
        return "🟢 Kuat - password aman";
      default:
        return "";
    }
  };

  const getStrengthColor = (index: number) => {
    if (strength === 0) return "bg-muted";
    if (index >= strength) return "bg-muted";
    
    switch (strength) {
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-emerald-500";
      default:
        return "bg-muted";
    }
  };

  if (!password) return null;

  return (
    <div className="space-y-1">
      <div className="flex gap-1">
        <div className={cn("h-1 flex-1 rounded transition-colors", getStrengthColor(0))} />
        <div className={cn("h-1 flex-1 rounded transition-colors", getStrengthColor(1))} />
        <div className={cn("h-1 flex-1 rounded transition-colors", getStrengthColor(2))} />
      </div>
      {getStrengthText() && (
        <p className="text-xs text-muted-foreground">
          {getStrengthText()}
        </p>
      )}
    </div>
  );
}
