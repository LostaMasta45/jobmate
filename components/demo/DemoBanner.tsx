"use client";

import { AlertCircle, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { getUpgradeUrl } from "@/lib/demo-mode";

interface DemoBannerProps {
  toolName?: string;
  dismissible?: boolean;
}

export function DemoBanner({ toolName, dismissible = false }: DemoBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6 relative">
      {dismissible && (
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute top-3 right-3 p-1 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4 text-amber-600" />
        </button>
      )}
      
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1 pr-8">
          <p className="text-sm font-semibold text-foreground mb-1">
            🎁 Demo Mode Aktif
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            Kamu bisa buat & preview unlimited, tapi download hasil dikunci. 
            Upgrade ke Premium untuk unlock semua fitur.
          </p>
          <Button 
            asChild 
            size="sm" 
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            <a href={getUpgradeUrl('demo_banner', toolName)}>
              <Sparkles className="w-4 h-4 mr-2" />
              Upgrade Rp 39K - Lifetime
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
