"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, MessageCircle, RefreshCw, Save, Check, Send, Wifi, Battery, Edit3, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { WAMessageType, WAGeneratedMessage } from "./types";

interface WAStepPreviewProps {
    message: WAGeneratedMessage | null;
    hrdPhone?: string;
    hrdName?: string;
    messageType: WAMessageType;
    onSave?: () => void;
    onRegenerate?: () => void;
    isSaving?: boolean;
    isGenerating?: boolean;
    onMessageChange?: (content: string) => void;
}

export function WAStepPreview({
    message,
    hrdPhone,
    hrdName,
    messageType,
    onSave,
    onRegenerate,
    isSaving,
    isGenerating,
    onMessageChange,
}: WAStepPreviewProps) {
    const [copied, setCopied] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(message?.content || '');

    const handleCopy = async () => {
        const content = isEditing ? editedContent : message?.content;
        if (!content) return;

        await navigator.clipboard.writeText(content);
        setCopied(true);
        toast.success("Pesan berhasil disalin!");
        setTimeout(() => setCopied(false), 2000);
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

    const handleSendWhatsApp = () => {
        const content = isEditing ? editedContent : message?.content;
        if (!content) return;

        const encodedMessage = encodeURIComponent(content);
        if (hrdPhone) {
            const formattedPhone = formatPhoneNumber(hrdPhone);
            window.open(`https://wa.me/${formattedPhone}?text=${encodedMessage}`, "_blank");
        } else {
            window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
        }
    };

    const handleEdit = () => {
        setEditedContent(message?.content || '');
        setIsEditing(true);
    };

    const handleSaveEdit = () => {
        onMessageChange?.(editedContent);
        setIsEditing(false);
        toast.success("Perubahan disimpan!");
    };

    const handleCancelEdit = () => {
        setEditedContent(message?.content || '');
        setIsEditing(false);
    };

    const displayContent = isEditing ? editedContent : message?.content;

    if (!message) {
        return (
            <Card className="border-2 border-dashed bg-muted/20">
                <CardContent className="flex min-h-[500px] flex-col items-center justify-center text-muted-foreground p-8">
                    <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-6">
                        <MessageCircle className="h-12 w-12 opacity-50" />
                    </div>
                    <p className="text-xl font-semibold mb-2 text-foreground">Preview Pesan</p>
                    <p className="text-sm text-center max-w-xs leading-relaxed">
                        Lengkapi form dan klik "Generate" untuk melihat hasil pesan WhatsApp Anda disini.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {/* Phone Mockup */}
            <div className="mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[550px] w-full max-w-[360px] shadow-xl relative overflow-hidden">
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
                                {isEditing ? (
                                    <Textarea
                                        value={editedContent}
                                        onChange={(e) => setEditedContent(e.target.value)}
                                        className="min-h-[150px] bg-white/80 dark:bg-zinc-800/80 text-sm resize-none"
                                    />
                                ) : (
                                    <div className="whitespace-pre-wrap break-words leading-relaxed">
                                        {displayContent}
                                    </div>
                                )}
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
                    {/* Edit Controls */}
                    {isEditing ? (
                        <div className="flex gap-2">
                            <Button
                                onClick={handleSaveEdit}
                                className="flex-1 h-10 bg-green-600 hover:bg-green-700 text-white"
                            >
                                <Check className="h-4 w-4 mr-2" />
                                Simpan Edit
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleCancelEdit}
                                className="h-10"
                            >
                                <X className="h-4 w-4 mr-2" />
                                Batal
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    variant="outline"
                                    onClick={handleCopy}
                                    className="h-10"
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
                                    className="h-10 bg-green-600 hover:bg-green-700 text-white"
                                    onClick={handleSendWhatsApp}
                                >
                                    <Send className="h-4 w-4 mr-2" />
                                    Kirim WA
                                </Button>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleEdit}
                                    className="text-muted-foreground"
                                >
                                    <Edit3 className="h-4 w-4 mr-1" />
                                    Edit
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onRegenerate}
                                    disabled={isGenerating}
                                    className="text-muted-foreground"
                                >
                                    <RefreshCw className={cn("h-4 w-4 mr-1", isGenerating && "animate-spin")} />
                                    Regen
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onSave}
                                    disabled={isSaving}
                                    className="text-muted-foreground"
                                >
                                    <Save className="h-4 w-4 mr-1" />
                                    Save
                                </Button>
                            </div>
                        </>
                    )}

                    <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
                        <span>{message.wordCount} Kata</span>
                        <span>{message.charCount} Karakter</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
