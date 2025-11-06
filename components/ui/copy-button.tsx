"use client";

import * as React from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function CopyButton({ 
  text, 
  className, 
  variant = "outline",
  size = "sm" 
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={cn(className)}
    >
      {copied ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Tersalin
        </>
      ) : (
        <>
          <Copy className="mr-2 h-4 w-4" />
          Salin
        </>
      )}
    </Button>
  );
}
