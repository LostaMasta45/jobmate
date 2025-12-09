"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WAGenerationData } from "@/lib/ai/whatsapp";
import { AIFormHelper } from "../AIFormHelper";
import { X, Plus } from "lucide-react";

interface StepPersonalDetailsProps {
  formData: Partial<WAGenerationData>;
  updateFormData: (updates: Partial<WAGenerationData>) => void;
}

export function StepPersonalDetails({ formData, updateFormData }: StepPersonalDetailsProps) {
  const [skillInput, setSkillInput] = useState('');

  const handleAddSkill = () => {
    if (skillInput.trim() && (formData.topSkills?.length || 0) < 5) {
      updateFormData({
        topSkills: [...(formData.topSkills || []), skillInput.trim()]
      });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (index: number) => {
    updateFormData({
      topSkills: formData.topSkills?.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="yourName">Nama Lengkap Anda *</Label>
          <Input
            id="yourName"
            value={formData.yourName}
            onChange={(e) => updateFormData({ yourName: e.target.value })}
            placeholder="Nama sesuai CV"
            className="h-11"
          />
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="currentRole">Posisi Saat Ini (Optional)</Label>
            <Input
              id="currentRole"
              value={formData.currentRole}
              onChange={(e) => updateFormData({ currentRole: e.target.value })}
              placeholder="Contoh: Fresh Graduate"
              className="h-11"
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
              onChange={(e) => updateFormData({ yearsExperience: parseInt(e.target.value) || undefined })}
              placeholder="Contoh: 2"
              className="h-11"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3 border-t pt-4 border-dashed">
        <div className="flex items-center justify-between">
          <Label>Top Skills (Max 5)</Label>
          <span className="text-xs text-muted-foreground">Penting untuk personalisasi</span>
        </div>
        
        <div className="flex gap-2">
          <Input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
            placeholder="Ketik skill lalu Enter..."
            disabled={(formData.topSkills?.length || 0) >= 5}
            className="flex-1 h-11"
          />
          <Button
            type="button"
            size="icon"
            onClick={handleAddSkill}
            disabled={(formData.topSkills?.length || 0) >= 5}
            className="h-11 w-11 shrink-0"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {formData.topSkills && formData.topSkills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.topSkills.map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="pl-2 pr-1 py-1 text-sm flex items-center gap-1 hover:bg-destructive/10 hover:text-destructive transition-colors group"
              >
                {skill}
                <button 
                  onClick={() => handleRemoveSkill(index)}
                  className="ml-1 p-0.5 rounded-full group-hover:bg-destructive group-hover:text-white transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        <div className="pt-2">
          <AIFormHelper
            type="skills"
            data={{
              position: formData.position || '',
              currentRole: formData.currentRole
            }}
            onSelect={(value) => {
              if ((formData.topSkills?.length || 0) < 5) {
                updateFormData({
                  topSkills: [...(formData.topSkills || []), value]
                });
              }
            }}
            disabled={!formData.position || (formData.topSkills?.length || 0) >= 5}
          />
        </div>
      </div>
    </div>
  );
}
