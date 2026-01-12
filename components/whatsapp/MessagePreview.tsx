"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, MessageCircle, RefreshCw, Save, Check, Send, Wifi, Battery } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface MessagePreviewProps {
  content: string;
  wordCount: number;
  charCount: number;
  hrdPhone?: string;
  hrdName?: string;
  onCopy?: () => void;
  onSave?: () => void;
  onRegenerate?: () => void;
  onSendWhatsApp?: () => void;
  isSaving?: boolean;
  isGenerating?: boolean;
}

export function MessagePreview({
  content,
  wordCount,
  charCount,
  hrdPhone,
  hrdName,
  onCopy,
  onSave,
  onRegenerate,
  onSendWhatsApp,
  isSaving,
  isGenerating
}: MessagePreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onCopy?.();

    // Track copy usage
    try {
      const { logToolUsageWithNotification } = await import("@/lib/telegram-monitoring");
      await logToolUsageWithNotification("WhatsApp Template Copy", hrdName || "HRD");
    } catch (e) { console.error("[Tracking] Failed:", e); }
  };

  const formatPhoneNumber = (phone: string): string => {
    if (!phone) return '';
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.slice(1);
    }
    if (!cleaned.startsWith('62')) {
      cleaned = '62' + cleaned;
    }
    return cleaned;
  };

  const handleSendWhatsApp = async () => {
    const encodedMessage = encodeURIComponent(content);
    if (hrdPhone) {
      const formattedPhone = formatPhoneNumber(hrdPhone);
      window.open(`https://wa.me/${formattedPhone}?text=${encodedMessage}`, "_blank");
    } else {
      window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
    }
    onSendWhatsApp?.();

    // Track send usage
    try {
      const { logToolUsageWithNotification } = await import("@/lib/telegram-monitoring");
      await logToolUsageWithNotification("WhatsApp Template Send", hrdName || "HRD");
    } catch (e) { console.error("[Tracking] Failed:", e); }
  };

  if (!content) {
    return (
      <Card className="border-2 border-dashed bg-muted/20">
        <CardContent className="flex min-h-[500px] flex-col items-center justify-center text-muted-foreground p-8">
          <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-6">
            <MessageCircle className="h-12 w-12 opacity-50" />
          </div>
          <p className="text-xl font-semibold mb-2 text-foreground">Preview Pesan</p>
          <p className="text-sm text-center max-w-xs leading-relaxed">
            Lengkapi form disamping dan klik "Generate" untuk melihat hasil pesan WhatsApp Anda disini.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Phone Mockup */}
      <div className="mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-full max-w-[380px] shadow-xl relative overflow-hidden">
        <div className="h-[32px] w-[3px] bg-gray-800 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
        <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
        <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
        <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>

        {/* Screen */}
        <div className="rounded-[2rem] overflow-hidden w-full h-full bg-[#E5DDD5] dark:bg-[#0b141a] relative flex flex-col">

          {/* Status Bar */}
          <div className="bg-[#075E54] dark:bg-[#1f2c34] text-white px-4 pt-2 pb-1 flex justify-between items-end text-xs">
            <span>09:41</span>
            <div className="flex gap-1">
              <Wifi className="h-3 w-3" />
              <Battery className="h-3 w-3" />
            </div>
          </div>

          {/* App Header */}
          <div className="bg-[#075E54] dark:bg-[#1f2c34] text-white px-3 py-2 flex items-center gap-2 shadow-md z-10">
            <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
              <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs">
                {hrdName ? hrdName.charAt(0).toUpperCase() : 'HR'}
              </div>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm">{hrdName || "HRD Contact"}</div>
              <div className="text-[10px] opacity-80">online</div>
            </div>
            <Wifi className="h-4 w-4 opacity-0" /> {/* Spacer */}
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-opacity-10">
            <div className="flex justify-center mb-4">
              <span className="text-[10px] bg-[#E1F3FB] dark:bg-[#1c2a32] text-gray-500 dark:text-gray-400 px-2 py-1 rounded-lg shadow-sm">
                Today
              </span>
            </div>

            {/* Message Bubble */}
            <div className="flex justify-end">
              <div className="bg-[#DCF8C6] dark:bg-[#005c4b] rounded-lg rounded-tr-none p-2 max-w-[85%] shadow-sm relative text-sm text-gray-800 dark:text-gray-100">
                <div className="whitespace-pre-wrap break-words leading-relaxed">
                  {content}
                </div>
                <div className="flex justify-end items-center gap-1 mt-1">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">09:42 AM</span>
                  <Check className="h-3 w-3 text-blue-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Chat Input Mockup */}
          <div className="bg-[#f0f0f0] dark:bg-[#1f2c34] p-2 flex items-center gap-2">
            <div className="bg-white dark:bg-[#2a3942] rounded-full flex-1 h-8 px-4 text-xs flex items-center text-muted-foreground">
              Type a message
            </div>
            <div className="h-8 w-8 bg-[#075E54] rounded-full flex items-center justify-center">
              <Send className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={handleCopy}
              className="h-11"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2 text-green-600" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
            <Button
              className="h-11 bg-green-600 hover:bg-green-700 text-white"
              onClick={handleSendWhatsApp}
            >
              <Send className="h-4 w-4 mr-2" />
              Send WA
            </Button>
          </div>

          <div className="flex gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onRegenerate}
              disabled={isGenerating}
              className="flex-1 text-muted-foreground"
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", isGenerating && "animate-spin")} />
              Regenerate
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSave}
              disabled={isSaving}
              className="flex-1 text-muted-foreground"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
          </div>

          <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
            <span>{wordCount} Words</span>
            <span>{charCount} Characters</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
