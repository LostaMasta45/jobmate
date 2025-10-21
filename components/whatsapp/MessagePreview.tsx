"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, MessageCircle, RefreshCw, Save, Check, Send } from "lucide-react";
import { useState } from "react";

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
  };

  const formatPhoneNumber = (phone: string): string => {
    if (!phone) return '';
    
    // Remove all non-digits
    let cleaned = phone.replace(/\D/g, '');
    
    // If starts with 0, replace with 62
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.slice(1);
    }
    
    // If doesn't start with 62, add it
    if (!cleaned.startsWith('62')) {
      cleaned = '62' + cleaned;
    }
    
    return cleaned;
  };

  const handleSendWhatsApp = () => {
    const encodedMessage = encodeURIComponent(content);
    
    // If phone number exists, send directly to that number
    if (hrdPhone) {
      const formattedPhone = formatPhoneNumber(hrdPhone);
      window.open(`https://wa.me/${formattedPhone}?text=${encodedMessage}`, "_blank");
    } else {
      // Otherwise, open WhatsApp with message only (user picks contact)
      window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
    }
    
    onSendWhatsApp?.();
  };

  if (!content) {
    return (
      <Card className="border-2 border-dashed">
        <CardContent className="flex min-h-[400px] sm:min-h-[500px] items-center justify-center text-muted-foreground py-12">
          <div className="text-center px-4">
            <MessageCircle className="mx-auto h-16 w-16 mb-4 opacity-30" />
            <p className="text-base sm:text-lg font-medium mb-2">Pesan WhatsApp Anda akan muncul di sini</p>
            <p className="text-sm text-muted-foreground">Lengkapi form dan klik <strong>Generate Pesan WA</strong></p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-green-200 dark:border-green-800 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            📱 Preview Pesan
            <Badge variant="default" className="bg-green-600 hover:bg-green-700">
              Ready to Send
            </Badge>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRegenerate}
            disabled={isGenerating}
            className="gap-2 hover:bg-green-50 dark:hover:bg-green-950"
          >
            <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Regenerate</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* WhatsApp-style Message Bubble */}
        <div className="rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 p-4 sm:p-6 min-h-[300px] shadow-inner">
          {/* Bubble */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-tl-none p-4 sm:p-5 shadow-md max-w-[95%] sm:max-w-[90%] border border-green-100 dark:border-green-900">
            <div className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed break-words text-slate-800 dark:text-slate-100">
              {content}
            </div>
            <div className="flex items-center justify-end gap-1 mt-3 text-xs text-muted-foreground">
              <span>{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
              <Check className="h-3 w-3" />
              <Check className="h-3 w-3 -ml-2" />
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 p-4 text-center border border-blue-100 dark:border-blue-900">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {wordCount}
            </div>
            <div className="text-xs font-medium text-blue-700 dark:text-blue-300 mt-1">Words</div>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-4 text-center border border-purple-100 dark:border-purple-900">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {charCount}
            </div>
            <div className="text-xs font-medium text-purple-700 dark:text-purple-300 mt-1">Characters</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            variant="outline"
            onClick={handleCopy}
            disabled={!content}
            className="h-12 sm:h-14 border-2 hover:bg-slate-50 dark:hover:bg-slate-900"
          >
            <div className="flex items-center gap-2">
              {copied ? (
                <>
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  <span className="text-sm sm:text-base font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm sm:text-base font-semibold">Copy</span>
                </>
              )}
            </div>
          </Button>
          <Button
            variant="default"
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-12 sm:h-14 shadow-md"
            onClick={handleSendWhatsApp}
            disabled={!content}
            title={hrdPhone ? `Kirim ke ${formatPhoneNumber(hrdPhone)}` : 'Pilih kontak WhatsApp'}
          >
            <div className="flex items-center gap-2">
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base font-semibold">
                {hrdPhone ? (hrdName ? `Kirim ke ${hrdName}` : 'Kirim WA') : 'Kirim WA'}
              </span>
            </div>
          </Button>
        </div>
        
        <Button
          variant="secondary"
          className="w-full h-12 sm:h-14 border-2 shadow-sm hover:shadow-md transition-shadow"
          onClick={onSave}
          disabled={!content || isSaving}
        >
          <Save className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          <span className="text-sm sm:text-base font-semibold">
            {isSaving ? "Menyimpan..." : "Simpan ke History"}
          </span>
        </Button>

        {/* Tips */}
        <div className="rounded-lg border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 p-4">
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
            <span className="text-lg">💡</span>
            Tips Mengirim WA Profesional:
          </p>
          <ul className="list-inside list-disc space-y-1.5 text-xs sm:text-sm text-blue-800 dark:text-blue-200 ml-2">
            <li>Kirim di jam kerja (09:00-16:00 WIB)</li>
            <li>Tunggu minimal 3-5 hari sebelum follow-up</li>
            <li>Gunakan nomor pribadi, hindari nomor bisnis</li>
            <li>Jangan spam atau kirim ke banyak perusahaan sekaligus</li>
            <li>Baca ulang sebelum kirim untuk memastikan tidak ada typo</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
