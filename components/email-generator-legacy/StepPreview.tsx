"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { EmailFormData } from "./types";
import { generateEmailWithAI } from "@/actions/email/generate";
import { saveEmailDraft } from "@/actions/email/save";
import { 
  Loader2, Copy, Save, RefreshCw, CheckCircle2, 
  Send, Paperclip, MoreVertical, 
  Bold, Italic, Underline, AlignLeft, X, User,
  Undo2, Sparkles, Globe2, Zap
} from "lucide-react";
import { toast } from "sonner";
import { EmailSuggestions } from "./EmailSuggestions";
import { QuickRefinements } from "./QuickRefinements";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface StepPreviewProps {
  formData: EmailFormData;
  updateFormData: (data: Partial<EmailFormData>) => void;
}

export function StepPreview({ formData, updateFormData }: StepPreviewProps) {
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'id' | 'en'>('id');
  const [showAnalysis, setShowAnalysis] = useState(false);
  
  // History Management for Undo
  const [history, setHistory] = useState<string[]>([]);
  const [canUndo, setCanUndo] = useState(false);

  // Initialize history
  useEffect(() => {
    if (formData.bodyContent && history.length === 0) {
      setHistory([formData.bodyContent]);
    }
  }, [formData.bodyContent]);

  const pushToHistory = (newContent: string) => {
    setHistory(prev => [...prev, newContent]);
    setCanUndo(true);
  };

  const handleUndo = () => {
    if (history.length > 1) {
      const previousContent = history[history.length - 2];
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);
      updateFormData({ bodyContent: previousContent });
      
      if (newHistory.length <= 1) {
        setCanUndo(false);
      }
      toast.info("Perubahan dibatalkan");
    }
  };

  const handleRefineUpdate = (refinedEmail: string) => {
    pushToHistory(refinedEmail);
    updateFormData({ bodyContent: refinedEmail });
  };

  // Auto-generate on mount if not already generated
  useEffect(() => {
    if (!formData.bodyContent && !generating) {
      handleGenerate('id');
    }
  }, []);

  const handleGenerate = async (language: 'id' | 'en' = 'id') => {
    setGenerating(true);
    setCurrentLanguage(language);
    try {
      const result = await generateEmailWithAI({
        language,
        emailType: formData.emailType as "application" | "follow_up" | "thank_you" | "inquiry",
        position: formData.position,
        companyName: formData.companyName,
        hrdName: formData.hrdName,
        hrdTitle: formData.hrdTitle,
        jobSource: formData.jobSource,
        referralName: formData.referralName,
        hasAttachment: formData.hasAttachment,
        yourName: formData.yourName,
        currentRole: formData.currentRole,
        yearsExperience: formData.yearsExperience,
        toneStyle: (formData.toneStyle === 'professional' ? 'semi-formal' : formData.toneStyle) as any,
        personality: formData.personality || 'balanced',
        lengthType: formData.lengthType || 'medium',
        highlightSkills: formData.highlightSkills,
        achievements: formData.achievements,
        includeWhyCompany: formData.includeWhyCompany,
        includeWhyYou: formData.includeWhyYou,
        callToAction: formData.callToAction,
        personalStory: formData.personalStory,
        openingStyle: formData.openingStyle,
        toneSettings: formData.toneSettings,
      });

      if (result.error) {
        toast.error("Gagal generate email: " + result.error);
        return;
      }

      // Reset history on new generation
      setHistory([result.body || '']);
      setCanUndo(false);

      updateFormData({
        subjectLine: result.subject,
        bodyContent: result.body,
      });

      toast.success("Email berhasil di-generate!");
    } catch (error: any) {
      console.error("Error generating email:", error);
      toast.error("Terjadi kesalahan saat generate email");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async () => {
    const fullEmail = `Subject: ${formData.subjectLine}\n\n${formData.bodyContent}`;
    try {
      await navigator.clipboard.writeText(fullEmail);
      toast.success("Email berhasil dicopy ke clipboard!");
    } catch (error) {
      toast.error("Gagal copy email");
    }
  };

  const handleSave = async () => {
    if (!formData.subjectLine || !formData.bodyContent) {
      toast.error("Harap generate email terlebih dahulu");
      return;
    }

    setSaving(true);
    try {
      const result = await saveEmailDraft({
        emailType: formData.emailType as "application" | "follow_up" | "thank_you" | "inquiry",
        position: formData.position,
        companyName: formData.companyName,
        hrdName: formData.hrdName,
        hrdTitle: formData.hrdTitle,
        jobSource: formData.jobSource,
        referralName: formData.referralName,
        toneStyle: (formData.toneStyle === 'professional' ? 'semi-formal' : formData.toneStyle) as any,
        personality: formData.personality || 'balanced',
        lengthType: formData.lengthType || 'medium',
        subjectLine: formData.subjectLine,
        bodyContent: formData.bodyContent,
        highlightSkills: formData.highlightSkills,
        achievements: formData.achievements,
        includeWhyCompany: formData.includeWhyCompany,
        includeWhyYou: formData.includeWhyYou,
        hasAttachment: formData.hasAttachment,
        status: 'draft',
      });

      if (result.error) {
        toast.error("Gagal menyimpan: " + result.error);
        return;
      }

      setSaved(true);
      toast.success("Email berhasil disimpan!");
    } catch (error: any) {
      console.error("Error saving email:", error);
      toast.error("Terjadi kesalahan saat menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const wordCount = formData.bodyContent ? formData.bodyContent.split(/\s+/).length : 0;
  
  // Mock data for the email UI
  const hrdNameDisplay = formData.hrdName || "Hiring Manager";
  
  if (generating) {
    return (
        <div className="min-h-[500px] flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-500">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-[#5547d0]/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="relative bg-white dark:bg-slate-900 p-6 rounded-full shadow-lg border border-[#5547d0]/10">
                <Loader2 className="h-12 w-12 text-[#5547d0] animate-spin" />
            </div>
          </div>
          <h3 className="font-bold text-2xl mb-2 text-slate-800 dark:text-slate-100">Sedang Menulis Email...</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
            AI sedang merangkai kata-kata terbaik untuk lamaran kerjamu. 
            Mengoptimalkan tone, struktur, dan personalisasi.
          </p>
        </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto">
        
        {/* Top Actions Bar */}
        <div className="sticky top-0 z-20 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
            
            {/* Language Toggle */}
            <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
                <button
                    onClick={() => handleGenerate('id')}
                    className={cn(
                        "px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2",
                        currentLanguage === 'id' 
                            ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" 
                            : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
                    )}
                >
                    <span>🇮🇩</span> Bahasa
                </button>
                <button
                    onClick={() => handleGenerate('en')}
                    className={cn(
                        "px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2",
                        currentLanguage === 'en' 
                            ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" 
                            : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
                    )}
                >
                    <span>🇬🇧</span> English
                </button>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
                <Button 
                    onClick={() => setShowAnalysis(!showAnalysis)} 
                    variant="outline" 
                    size="sm" 
                    className={cn(
                        "gap-2 border-slate-200 dark:border-slate-800",
                        showAnalysis ? "bg-[#5547d0]/10 text-[#5547d0] border-[#5547d0]/20" : ""
                    )}
                >
                    <Sparkles className={cn("h-4 w-4", showAnalysis ? "text-[#5547d0]" : "text-amber-500")} />
                    {showAnalysis ? "Hide AI Analysis" : "Analyze Email"}
                </Button>
                
                <Separator orientation="vertical" className="h-6 hidden md:block" />
                
                <Button onClick={handleSave} disabled={saved || saving} variant="outline" size="sm" className="gap-2">
                    {saved ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Save className="h-4 w-4" />}
                    {saved ? "Saved" : "Save Draft"}
                </Button>
            </div>
        </div>

        {/* Analysis Panel (Collapsible) */}
        {showAnalysis && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-top-4 fade-in duration-300">
                <EmailSuggestions email={formData.bodyContent || ''} formData={formData} />
                <Card className="p-5 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Zap className="h-4 w-4 text-[#5547d0]" />
                            Quick Refinements
                        </h3>
                        {canUndo && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={handleUndo}
                                className="h-8 text-xs gap-1 text-muted-foreground hover:text-foreground"
                            >
                                <Undo2 className="h-3 w-3" />
                                Undo
                            </Button>
                        )}
                    </div>
                    <QuickRefinements
                        currentEmail={formData.bodyContent || ''}
                        onRefine={handleRefineUpdate}
                        disabled={generating}
                    />
                </Card>
            </div>
        )}

        {/* EMAIL CLIENT UI */}
        <div className="relative mx-auto shadow-2xl rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 ring-1 ring-slate-900/5">
            
            {/* Window Header (Mac style) */}
            <div className="h-12 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800 flex items-center px-5 justify-between">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e]" />
                    <div className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#d89e24]" />
                    <div className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab29]" />
                </div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">New Message</div>
                <div className="w-10" />
            </div>

            {/* Email Header Fields */}
            <div className="px-6 pt-4 pb-2 bg-white dark:bg-slate-950 space-y-1">
                <div className="flex items-center py-1">
                    <span className="text-sm text-slate-400 w-16 shrink-0 font-medium">To:</span>
                    <div className="flex-1 flex items-center gap-2">
                        <div className="bg-slate-100 dark:bg-slate-800 text-xs px-3 py-1 rounded-full flex items-center gap-1.5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                             <User className="h-3 w-3 text-slate-400" />
                             <span className="font-medium">{hrdNameDisplay}</span>
                             <X className="h-3 w-3 cursor-pointer hover:text-red-500 transition-colors" />
                        </div>
                    </div>
                </div>
                <Separator className="bg-slate-100 dark:bg-slate-800" />
                
                <div className="flex items-center py-2">
                     <span className="text-sm text-slate-400 w-16 shrink-0 font-medium">Subject:</span>
                     <Input 
                        value={formData.subjectLine || ''}
                        onChange={(e) => updateFormData({ subjectLine: e.target.value })}
                        className="border-none shadow-none focus-visible:ring-0 px-0 font-semibold text-slate-800 dark:text-slate-100 h-auto py-1 text-base placeholder:text-slate-300 bg-transparent"
                        placeholder="Subject line goes here..."
                     />
                </div>
                <Separator className="bg-slate-100 dark:bg-slate-800" />
            </div>

            {/* Email Body Area */}
            <div className="px-6 py-4 min-h-[400px] bg-white dark:bg-slate-950 relative group">
                <Textarea
                    value={formData.bodyContent || ''}
                    onChange={(e) => updateFormData({ bodyContent: e.target.value })}
                    className="w-full min-h-[400px] border-none shadow-none focus-visible:ring-0 p-0 resize-y text-base leading-relaxed text-slate-700 dark:text-slate-300 font-sans bg-transparent selection:bg-[#5547d0]/20"
                    placeholder="Write your email content here..."
                />
                
                {/* Hover hint */}
                <div className="absolute top-2 right-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="text-[10px] text-slate-300 bg-slate-50 px-2 py-1 rounded">Click to edit</span>
                </div>
            </div>

            {/* Email Toolbar / Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button 
                        onClick={() => {
                             const subject = encodeURIComponent(formData.subjectLine || "");
                             const body = encodeURIComponent(formData.bodyContent || "");
                             window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
                        }}
                        className="bg-[#0b57d0] hover:bg-[#0b57d0]/90 text-white rounded-full px-6 h-10 shadow-md hover:shadow-lg transition-all flex items-center gap-2 font-medium"
                    >
                        Send <Send className="h-4 w-4 ml-1" />
                    </Button>
                    
                    <div className="h-6 w-px bg-slate-300 dark:bg-slate-700 mx-1" />
                    
                    <div className="flex items-center gap-1">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-full">
                                        <Paperclip className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Attach files</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-full"><Bold className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-full"><Italic className="h-4 w-4" /></Button>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                     <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-full" onClick={handleCopy}>
                        <Copy className="h-4 w-4" />
                     </Button>
                     <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-full">
                        <MoreVertical className="h-4 w-4" />
                     </Button>
                </div>
            </div>
        </div>

        <div className="flex justify-center pt-2 pb-6">
             <span className="text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-full">
                {wordCount} words • Ready to send
             </span>
        </div>
    </div>
  );
}
