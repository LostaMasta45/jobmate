"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Crown, Download, Users, Clock, Shield, Sparkles } from "lucide-react";
import { getUpgradeUrl, getUpgradeBenefits } from "@/lib/demo-mode";
import { DemoSessionManager } from "@/lib/demo-session";

interface ExportBlockerProps {
  toolName: string;
  displayName?: string;
  resultPreview?: string;
  atsScore?: number;
  onExportAttempt?: () => void;
  children?: React.ReactNode;
}

export function ExportBlocker({ 
  toolName, 
  displayName,
  resultPreview, 
  atsScore,
  onExportAttempt,
  children 
}: ExportBlockerProps) {
  const [showModal, setShowModal] = useState(false);
  
  const handleExportClick = () => {
    setShowModal(true);
    
    // Track analytics
    DemoSessionManager.trackUsage(toolName, 'export_blocked');
    
    // Call custom handler if provided
    onExportAttempt?.();
  };
  
  const toolDisplayName = displayName || toolName;
  const benefits = getUpgradeBenefits(toolName);

  return (
    <>
      {children ? (
        <div onClick={handleExportClick}>
          {children}
        </div>
      ) : (
        <Button onClick={handleExportClick} className="w-full" size="lg">
          <Download className="w-4 h-4 mr-2" />
          Download Hasil
        </Button>
      )}
      
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="sr-only">Upgrade to Premium</DialogTitle>
          </DialogHeader>
          
          {/* ATS Score showcase (if CV tool) */}
          {atsScore && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 mb-4">
              <div className="text-center">
                <div className="text-5xl font-bold text-emerald-600 mb-2">
                  {atsScore}/100
                </div>
                <p className="text-sm font-semibold">
                  {atsScore >= 90 ? "🎉 Excellent!" : atsScore >= 70 ? "👍 Good" : "📈 Needs Improvement"}
                </p>
              </div>
            </div>
          )}
          
          <div className="text-center">
            <Crown className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">
              🎉 {toolDisplayName} Kamu Sudah Siap!
            </h3>
            <p className="text-muted-foreground mb-6">
              Upgrade ke VIP Premium untuk unlock fitur lengkap:
            </p>
            
            {/* Benefits List */}
            <div className="bg-muted rounded-lg p-4 mb-6 text-left">
              <ul className="space-y-2">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-emerald-600 flex-shrink-0">✓</span>
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Social proof */}
            <div className="flex items-center justify-center gap-4 mb-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>1,234+ users</span>
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                <span>4.8/5 rating</span>
              </div>
            </div>
            
            {/* Pricing */}
            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-xl p-6 mb-6">
              <div className="text-sm text-muted-foreground mb-1">Investasi sekali bayar:</div>
              <div className="text-4xl font-bold mb-1">Rp 39.000</div>
              <div className="text-sm text-emerald-600 font-semibold mb-2">
                = Rp 108/hari (tahun pertama) ☕
              </div>
              <div className="text-xs text-muted-foreground">
                Akses selamanya • 6 tools • 5 tools baru gratis (Q1-Q2 2026)
              </div>
            </div>
            
            {/* CTAs */}
            <div className="space-y-3">
              <Button 
                asChild 
                className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white" 
                size="lg"
              >
                <a href={getUpgradeUrl('export_blocker', toolName)}>
                  <Crown className="w-4 h-4 mr-2" />
                  Download Sekarang - Rp 39K
                </a>
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => setShowModal(false)}
              >
                Lihat Paket Lain
              </Button>
            </div>
            
            {/* Guarantee */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Shield className="w-4 h-4" />
              <span>Garansi 7 hari uang kembali 100%</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
