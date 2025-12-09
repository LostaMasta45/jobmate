"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WAGeneratorWizard } from "./WAGeneratorWizard";
import { MessagePreview } from "./MessagePreview";
import { generateWhatsAppMessage } from "@/actions/whatsapp/generate";
import { saveWAMessage } from "@/actions/whatsapp/save";
import { WAGenerationData } from "@/lib/ai/whatsapp";
import { toast } from "sonner";
import { MessageSquare, Phone } from "lucide-react";

export function WAGeneratorMain() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("input");
  
  const [generatedMessage, setGeneratedMessage] = useState<{
    content: string;
    wordCount: number;
    charCount: number;
  } | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<WAGenerationData>>({
    messageType: 'application',
    yourName: '',
    position: '',
    companyName: '',
    hrdName: '',
    hrdTitle: '',
    hrdPhone: '',
    jobSource: '',
    referralName: '',
    previousInteraction: '',
    currentRole: '',
    yearsExperience: undefined,
    topSkills: [],
    toneStyle: 'semi-formal',
    personality: 'balanced',
    includeGreeting: true,
    includeIntro: true,
    includeCallToAction: true,
    attachmentMention: false,
    specificReason: '',
    recentAchievement: '',
    availability: '',

    useEmoji: true,
    messageLength: 'medium'
  });

  const updateFormData = (updates: Partial<WAGenerationData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleGenerate = async () => {
    // Validation
    if (!formData.yourName || !formData.position || !formData.companyName) {
      toast.error('Nama, Posisi, dan Perusahaan wajib diisi');
      return;
    }

    setLoading(true);
    try {
      const result = await generateWhatsAppMessage(formData as WAGenerationData);
      
      if (result.error) {
        toast.error(result.error);
        return;
      }

      setGeneratedMessage({
        content: result.content || '',
        wordCount: result.wordCount || 0,
        charCount: result.charCount || 0
      });
      
      toast.success('Pesan berhasil di-generate! 🎉');
      
      // Auto switch to result tab on mobile
      if (window.innerWidth < 1024) {
        setActiveTab("result");
      }
    } catch (error: any) {
      console.error('Generate error:', error);
      toast.error('Gagal generate pesan: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!generatedMessage) return;

    setSaving(true);
    try {
      const result = await saveWAMessage({
        messageType: formData.messageType || 'application',
        content: generatedMessage.content,
        position: formData.position || '',
        companyName: formData.companyName || '',
        hrdName: formData.hrdName,
        hrdTitle: formData.hrdTitle,
        hrdPhone: formData.hrdPhone,
        jobSource: formData.jobSource,
        referralName: formData.referralName,
        previousInteraction: formData.previousInteraction,
        currentRole: formData.currentRole,
        yearsExperience: formData.yearsExperience,
        topSkills: formData.topSkills,
        specificReason: formData.specificReason,
        recentAchievement: formData.recentAchievement,
        availability: formData.availability,
        toneStyle: formData.toneStyle,
        personality: formData.personality,
        messageLength: formData.messageLength,

        useEmoji: formData.useEmoji,
        includeGreeting: formData.includeGreeting,
        includeIntro: formData.includeIntro,
        includeCallToAction: formData.includeCallToAction,
        attachmentMention: formData.attachmentMention,
        wordCount: generatedMessage.wordCount,
        charCount: generatedMessage.charCount,

        status: 'draft'
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success('Pesan berhasil disimpan ke history! 💾');
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error('Gagal menyimpan: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto">
      {/* Mobile Tabs */}
      <div className="lg:hidden mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-12">
            <TabsTrigger value="input" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Input Data
            </TabsTrigger>
            <TabsTrigger value="result" className="gap-2">
              <Phone className="h-4 w-4" />
              Preview Result
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="input" className="mt-6">
             <WAGeneratorWizard 
              formData={formData} 
              updateFormData={updateFormData} 
              onGenerate={handleGenerate}
              loading={loading}
            />
          </TabsContent>
          
          <TabsContent value="result" className="mt-6">
             <MessagePreview
              content={generatedMessage?.content || ''}
              wordCount={generatedMessage?.wordCount || 0}
              charCount={generatedMessage?.charCount || 0}
              hrdPhone={formData.hrdPhone}
              hrdName={formData.hrdName}
              onSave={handleSave}
              onRegenerate={handleGenerate}
              isSaving={saving}
              isGenerating={loading}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Desktop Split View */}
      <div className="hidden lg:grid gap-8 lg:grid-cols-2 lg:items-start">
        {/* Left Column: Wizard */}
        <div className="sticky top-6">
           <WAGeneratorWizard 
              formData={formData} 
              updateFormData={updateFormData} 
              onGenerate={handleGenerate}
              loading={loading}
            />
        </div>

        {/* Right Column: Preview */}
        <div className="sticky top-6">
           <MessagePreview
            content={generatedMessage?.content || ''}
            wordCount={generatedMessage?.wordCount || 0}
            charCount={generatedMessage?.charCount || 0}
            hrdPhone={formData.hrdPhone}
            hrdName={formData.hrdName}
            onSave={handleSave}
            onRegenerate={handleGenerate}
            isSaving={saving}
            isGenerating={loading}
          />
        </div>
      </div>
    </div>
  );
}
