"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap, MessageCircle } from "lucide-react";
import { MessagePreview } from "./MessagePreview";
import { AIFormHelper } from "./AIFormHelper";
import { generateWhatsAppMessage } from "@/actions/whatsapp/generate";
import { saveWAMessage } from "@/actions/whatsapp/save";
import { WAGenerationData } from "@/lib/ai/whatsapp";
import { toast } from "sonner";

const MESSAGE_TYPES = [
  { value: "application", label: "📝 Initial Application", description: "Melamar pertama kali" },
  { value: "follow_up", label: "🔄 Follow-Up", description: "Tanya status lamaran" },
  { value: "interview_confirmation", label: "✅ Interview Confirmation", description: "Konfirmasi kehadiran" },
  { value: "thank_you", label: "🙏 Thank You", description: "Terima kasih pasca interview" },
  { value: "status_inquiry", label: "❓ Status Inquiry", description: "Tanya hasil interview" },
  { value: "re_application", label: "🔁 Re-Application", description: "Melamar lagi" },
  { value: "referral", label: "👥 Referral Request", description: "Minta referral" }
];

export function WAGeneratorMain() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
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

  const [skillInput, setSkillInput] = useState('');

  const handleAddSkill = () => {
    if (skillInput.trim() && (formData.topSkills?.length || 0) < 5) {
      setFormData(prev => ({
        ...prev,
        topSkills: [...(prev.topSkills || []), skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      topSkills: prev.topSkills?.filter((_, i) => i !== index)
    }));
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

  const selectedMessageType = MESSAGE_TYPES.find(t => t.value === formData.messageType);

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
      {/* Left Column: Form */}
      <div className="order-2 lg:order-1">
        <Card className="lg:sticky lg:top-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-base sm:text-lg">Form Input</span>
              </div>
              {selectedMessageType && (
                <Badge variant="secondary" className="text-xs">
                  {selectedMessageType.label}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[70vh] lg:max-h-[calc(100vh-180px)] overflow-y-auto">
          {/* Message Type */}
          <div className="space-y-2">
            <Label htmlFor="messageType">Tipe Pesan *</Label>
            <Select
              value={formData.messageType}
              onValueChange={(value) => setFormData(prev => ({ ...prev, messageType: value as any }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MESSAGE_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-muted-foreground">{type.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Basic Info */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-sm">Basic Info</h3>
            
            <div className="space-y-2">
              <Label htmlFor="yourName">Nama Lengkap *</Label>
              <Input
                id="yourName"
                value={formData.yourName}
                onChange={(e) => setFormData(prev => ({ ...prev, yourName: e.target.value }))}
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Posisi yang Dilamar *</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                placeholder="Frontend Developer"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">Nama Perusahaan *</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                placeholder="PT Tech Innovation"
              />
            </div>
          </div>

          {/* HRD Info */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-sm">HRD Info (Optional)</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="hrdName">Nama HRD</Label>
                <Input
                  id="hrdName"
                  value={formData.hrdName}
                  onChange={(e) => setFormData(prev => ({ ...prev, hrdName: e.target.value }))}
                  placeholder="Sarah"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hrdTitle">Jabatan HRD</Label>
                <Input
                  id="hrdTitle"
                  value={formData.hrdTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, hrdTitle: e.target.value }))}
                  placeholder="HR Manager"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hrdPhone">
                Nomor WhatsApp HRD
                <span className="ml-1 text-xs text-purple-600 dark:text-purple-400">✨ Untuk kirim langsung</span>
              </Label>
              <Input
                id="hrdPhone"
                type="tel"
                value={formData.hrdPhone}
                onChange={(e) => {
                  // Auto-format: remove non-digits
                  const cleaned = e.target.value.replace(/\D/g, '');
                  setFormData(prev => ({ ...prev, hrdPhone: cleaned }));
                }}
                placeholder="08123456789 atau +628123456789"
                maxLength={15}
              />
              <p className="text-xs text-muted-foreground">
                Format: 08xxx atau +628xxx (angka saja, tanpa spasi/strip)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobSource">Sumber Lowongan</Label>
              <Select
                value={formData.jobSource}
                onValueChange={(value) => setFormData(prev => ({ ...prev, jobSource: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih sumber" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                  <SelectItem value="JobStreet">JobStreet</SelectItem>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                  <SelectItem value="Website Perusahaan">Website Perusahaan</SelectItem>
                  <SelectItem value="Referral">Referral</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.jobSource === 'Referral' && (
              <div className="space-y-2">
                <Label htmlFor="referralName">Nama yang Mereferensikan</Label>
                <Input
                  id="referralName"
                  value={formData.referralName}
                  onChange={(e) => setFormData(prev => ({ ...prev, referralName: e.target.value }))}
                  placeholder="Ahmad Wijaya"
                />
              </div>
            )}

            {(formData.messageType === 'follow_up' || formData.messageType === 'status_inquiry') && (
              <div className="space-y-2">
                <Label htmlFor="previousInteraction">Interaksi Sebelumnya</Label>
                <Input
                  id="previousInteraction"
                  value={formData.previousInteraction}
                  onChange={(e) => setFormData(prev => ({ ...prev, previousInteraction: e.target.value }))}
                  placeholder="Sudah apply 5 hari lalu"
                />
              </div>
            )}
          </div>

          {/* Your Background */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-sm">Your Background (Optional)</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="currentRole">Posisi Saat Ini</Label>
                <Input
                  id="currentRole"
                  value={formData.currentRole}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentRole: e.target.value }))}
                  placeholder="Junior Developer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearsExperience">Pengalaman (Tahun)</Label>
                <Input
                  id="yearsExperience"
                  type="number"
                  min="0"
                  max="50"
                  value={formData.yearsExperience || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, yearsExperience: parseInt(e.target.value) || undefined }))}
                  placeholder="3"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                Top Skills (Max 5)
                <span className="ml-1 text-xs text-purple-600 dark:text-purple-400">✨ AI</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  placeholder="React, Node.js, TypeScript..."
                  disabled={(formData.topSkills?.length || 0) >= 5}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAddSkill}
                  disabled={(formData.topSkills?.length || 0) >= 5}
                  className="flex-shrink-0"
                >
                  Add
                </Button>
              </div>
              {formData.topSkills && formData.topSkills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.topSkills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors text-xs sm:text-sm"
                      onClick={() => handleRemoveSkill(index)}
                    >
                      {skill} ×
                    </Badge>
                  ))}
                </div>
              )}
              <AIFormHelper
                type="skills"
                data={{
                  position: formData.position || '',
                  currentRole: formData.currentRole
                }}
                onSelect={(value) => {
                  if ((formData.topSkills?.length || 0) < 5) {
                    setFormData(prev => ({
                      ...prev,
                      topSkills: [...(prev.topSkills || []), value]
                    }));
                  }
                }}
                disabled={!formData.position || (formData.topSkills?.length || 0) >= 5}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specificReason">
                Alasan Tertarik (Optional)
                <span className="ml-1 text-xs text-purple-600 dark:text-purple-400">✨ AI</span>
              </Label>
              <Textarea
                id="specificReason"
                value={formData.specificReason}
                onChange={(e) => setFormData(prev => ({ ...prev, specificReason: e.target.value }))}
                placeholder="Tertarik dengan culture & product innovation..."
                rows={3}
              />
              <AIFormHelper
                type="reason"
                data={{
                  position: formData.position || '',
                  companyName: formData.companyName || ''
                }}
                onSelect={(value) => setFormData(prev => ({ ...prev, specificReason: value }))}
                disabled={!formData.position || !formData.companyName}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recentAchievement">
                Recent Achievement (Optional)
                <span className="ml-1 text-xs text-purple-600 dark:text-purple-400">✨ AI</span>
              </Label>
              <Textarea
                id="recentAchievement"
                value={formData.recentAchievement}
                onChange={(e) => setFormData(prev => ({ ...prev, recentAchievement: e.target.value }))}
                placeholder="Berhasil meningkatkan user engagement 40%..."
                rows={2}
              />
              <AIFormHelper
                type="achievement"
                data={{
                  position: formData.position || '',
                  currentRole: formData.currentRole,
                  yearsExperience: formData.yearsExperience
                }}
                onSelect={(value) => setFormData(prev => ({ ...prev, recentAchievement: value }))}
                disabled={!formData.position}
              />
            </div>
          </div>

          {/* Tone & Style */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-sm">Tone & Style</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Gaya Bahasa</Label>
                <Select
                  value={formData.toneStyle}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, toneStyle: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal & Sopan</SelectItem>
                    <SelectItem value="semi-formal">Semi-formal (Rekomendasi)</SelectItem>
                    <SelectItem value="friendly">Ramah & Santai</SelectItem>
                    <SelectItem value="enthusiastic">Antusias & Energik</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Personality</Label>
                <Select
                  value={formData.personality}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, personality: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="confident">Percaya Diri</SelectItem>
                    <SelectItem value="balanced">Seimbang (Rekomendasi)</SelectItem>
                    <SelectItem value="humble">Rendah Hati</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Panjang Pesan</Label>
              <Select
                value={formData.messageLength}
                onValueChange={(value) => setFormData(prev => ({ ...prev, messageLength: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Pendek (50-80 kata)</SelectItem>
                  <SelectItem value="medium">Medium (80-120 kata)</SelectItem>
                  <SelectItem value="long">Panjang (120-150 kata)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Preferences */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="useEmoji"
                  checked={formData.useEmoji}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, useEmoji: !!checked }))}
                />
                <Label htmlFor="useEmoji" className="text-sm cursor-pointer">
                  Gunakan emoji (🙏, ✨, 📄)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeGreeting"
                  checked={formData.includeGreeting}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, includeGreeting: !!checked }))}
                />
                <Label htmlFor="includeGreeting" className="text-sm cursor-pointer">
                  Sertakan salam pembuka
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeIntro"
                  checked={formData.includeIntro}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, includeIntro: !!checked }))}
                />
                <Label htmlFor="includeIntro" className="text-sm cursor-pointer">
                  Sertakan perkenalan singkat
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="attachmentMention"
                  checked={formData.attachmentMention}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, attachmentMention: !!checked }))}
                />
                <Label htmlFor="attachmentMention" className="text-sm cursor-pointer">
                  Mention CV/Portfolio
                </Label>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="sticky bottom-0 -mx-6 -mb-6 p-4 bg-gradient-to-t from-background via-background to-transparent border-t">
            <Button
              onClick={handleGenerate}
              disabled={loading || !formData.yourName || !formData.position || !formData.companyName}
              className="w-full shadow-lg h-14 text-base font-semibold"
              size="lg"
            >
              {loading ? (
                <>
                  <Zap className="mr-2 h-5 w-5 animate-pulse" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  <span>Generate Pesan WA</span>
                </>
              )}
            </Button>
          </div>
        </CardContent>
        </Card>
      </div>

      {/* Right Column: Preview */}
      <div className="order-1 lg:order-2 lg:sticky lg:top-6">
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
  );
}
