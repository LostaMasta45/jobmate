"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, MessageCircle, RefreshCw, Save, Check } from "lucide-react";
import { useState } from "react";
import { spintax } from "@/lib/spintax";

interface SpintaxPreviewProps {
  content: string;
  wordCount: number;
  charCount: number;
  spintaxCount: number;
  hrdPhone?: string;
  hrdName?: string;
  onCopy?: () => void;
  onSave?: () => void;
  onSendWhatsApp?: () => void;
  isSaving?: boolean;
}

export function SpintaxPreview({
  content,
  wordCount,
  charCount,
  spintaxCount,
  hrdPhone,
  hrdName,
  onCopy,
  onSave,
  onSendWhatsApp,
  isSaving
}: SpintaxPreviewProps) {
  const [showPlain, setShowPlain] = useState(false);
  const [plainVariation, setPlainVariation] = useState("");
  const [copied, setCopied] = useState(false);

  // Generate plain text variation
  const generatePlain = () => {
    const plain = spintax.resolve(content);
    setPlainVariation(plain);
    setShowPlain(true);
  };

  // Highlight spintax in the text
  const renderHighlightedContent = () => {
    const segments = spintax.highlight(content);
    
    return segments.map((segment, index) => (
      <span
        key={index}
        className={
          segment.isSpintax
            ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-100 font-medium px-1 rounded"
            : ""
        }
      >
        {segment.text}
      </span>
    ));
  };

  const handleCopy = async () => {
    const textToCopy = showPlain ? plainVariation : content;
    await navigator.clipboard.writeText(textToCopy);
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
    const textToSend = showPlain ? plainVariation : spintax.resolve(content);
    const encodedMessage = encodeURIComponent(textToSend);
    
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
      <Card>
        <CardContent className="flex min-h-[400px] sm:min-h-[500px] items-center justify-center text-muted-foreground py-12">
          <div className="text-center px-4">
            <MessageCircle className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p className="text-sm sm:text-base">Hasil pesan WhatsApp akan muncul di sini</p>
            <p className="text-xs sm:text-sm mt-2">Lengkapi form dan klik Generate</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            📱 Preview Pesan
            <Badge variant={showPlain ? "default" : "secondary"}>
              {showPlain ? "Plain Text" : "With Spintax"}
            </Badge>
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={generatePlain}
              disabled={!content}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Randomize
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Message Preview */}
        <div className="rounded-lg border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950 p-3 sm:p-4 min-h-[300px]">
          {/* WhatsApp-style bubble */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-tl-none p-3 sm:p-4 shadow-sm max-w-[90%] sm:max-w-[85%]">
            <div className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed break-words">
              {showPlain ? (
                <span>{plainVariation}</span>
              ) : (
                renderHighlightedContent()
              )}
            </div>
            <div className="flex items-center justify-end gap-1 mt-2 text-[10px] sm:text-xs text-muted-foreground">
              <span>{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
              <Check className="h-3 w-3" />
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-muted p-3 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {wordCount}
            </div>
            <div className="text-xs text-muted-foreground">Words</div>
          </div>
          <div className="rounded-lg bg-muted p-3 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {charCount}
            </div>
            <div className="text-xs text-muted-foreground">Characters</div>
          </div>
          <div className="rounded-lg bg-muted p-3 text-center">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {spintaxCount}
            </div>
            <div className="text-xs text-muted-foreground">Variations</div>
          </div>
        </div>

        {/* Spintax Guide */}
        {!showPlain && spintaxCount > 0 && (
          <div className="rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-3">
            <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-1">
              💡 Cara menggunakan spintax:
            </p>
            <p className="text-xs text-amber-800 dark:text-amber-200">
              Pilih salah satu varian dari kurung kurawal. Contoh: <code className="bg-amber-100 dark:bg-amber-900 px-1 rounded">{"{Halo|Hi}"}</code> → pilih "Halo" atau "Hi"
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-2">
              Atau klik "Randomize" untuk melihat variasi otomatis (tanpa spintax)
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={handleCopy}
            disabled={!content}
            className="h-12 sm:h-14"
          >
            <div className="flex items-center gap-2">
              {copied ? (
                <>
                  <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm sm:text-base font-medium">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm sm:text-base font-medium">Copy</span>
                </>
              )}
            </div>
          </Button>
          <Button
            variant="default"
            className="bg-green-600 hover:bg-green-700 h-12 sm:h-14"
            onClick={handleSendWhatsApp}
            disabled={!content}
            title={hrdPhone ? `Kirim ke ${formatPhoneNumber(hrdPhone)}` : 'Pilih kontak WhatsApp'}
          >
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base font-medium">
                {hrdPhone ? (hrdName ? `Kirim ke ${hrdName}` : 'Kirim WA') : 'Kirim WA'}
              </span>
            </div>
          </Button>
        </div>
        
        <Button
          variant="secondary"
          className="w-full h-12 sm:h-14"
          onClick={onSave}
          disabled={!content || isSaving}
        >
          <Save className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          <span className="text-sm sm:text-base font-medium">
            {isSaving ? "Menyimpan..." : "Simpan ke History"}
          </span>
        </Button>

        {/* Tips */}
        <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950 p-4">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            💡 Tips Mengirim WA:
          </p>
          <ul className="list-inside list-disc space-y-1 text-xs text-blue-800 dark:text-blue-200">
            <li>Kirim di jam kerja (09:00-16:00)</li>
            <li>Tunggu balasan sebelum follow-up</li>
            <li>Gunakan nomor pribadi, bukan nomor bisnis</li>
            <li>Jangan spam ke banyak perusahaan sekaligus</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
