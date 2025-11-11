"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { MobileToolHeader } from "@/components/tools/MobileToolHeader";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Palette } from "lucide-react";
import { CVCreativeWizard } from "@/components/cv-creative/CVCreativeWizardNew";
import { CVCreativeHistory } from "@/components/cv-creative/CVCreativeHistory";
import { getAllCreativeCVs } from "@/actions/cv-creative";

export default function CVCreativePage() {
  const [cvs, setCVs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showWizard, setShowWizard] = React.useState(false);
  const [editingCV, setEditingCV] = React.useState<any | null>(null);

  const loadCVs = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllCreativeCVs();
      setCVs(data);
    } catch (error) {
      console.error("Failed to load creative CVs:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadCVs();
  }, [loadCVs]);

  const handleCreateNew = () => {
    setEditingCV(null);
    setShowWizard(true);
  };

  const handleEdit = (cv: any) => {
    // Map database format (snake_case) to app format (camelCase)
    const mappedCV = {
      id: cv.id,
      userId: cv.user_id,
      title: cv.title,
      templateId: cv.template_id,
      colorScheme: cv.color_scheme,
      photoUrl: cv.photo_url,           // Map snake_case to camelCase!
      photoOptions: cv.photo_options,
      content: cv.content,
      atsScore: cv.ats_score,
      isDefault: cv.is_default,
      createdAt: cv.created_at,
      updatedAt: cv.updated_at,
    };
    setEditingCV(mappedCV);
    setShowWizard(true);
  };

  const handleWizardClose = () => {
    setShowWizard(false);
    setEditingCV(null);
    loadCVs();
  };

  if (showWizard) {
    return <CVCreativeWizard initialCV={editingCV} onClose={handleWizardClose} />;
  }

  return (
    <AppShell>
      {/* Mobile Tool Header */}
      <MobileToolHeader
        title="CV Creative"
        description="Desain CV yang unik"
      />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-6 hidden lg:block">
          <div className="flex items-center gap-3 mb-2">
            <Palette className="h-8 w-8 text-purple-500" />
            <h1 className="text-3xl font-bold">CV Creative Generator</h1>
          </div>
          <p className="text-muted-foreground">
            Buat CV visual yang eye-catching dengan foto, warna, dan 12+ template kreatif
          </p>
        </div>

        {/* Features Banner */}
        <div className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
          <h3 className="mb-2 text-xl font-bold">✨ Creative CV Features</h3>
          <div className="grid gap-2 sm:grid-cols-3">
            <div>
              <p className="font-semibold">🎨 12+ Templates</p>
              <p className="text-sm opacity-90">Modern, Bold, Pastel & more</p>
            </div>
            <div>
              <p className="font-semibold">📸 Photo Integration</p>
              <p className="text-sm opacity-90">Upload & customize your photo</p>
            </div>
            <div>
              <p className="font-semibold">🎯 AI-Powered</p>
              <p className="text-sm opacity-90">Smart content generation</p>
            </div>
          </div>
        </div>

        {/* Create Button & Stats */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Your Creative CVs</h2>
            <p className="text-sm text-muted-foreground">
              {cvs.length} CV tersimpan
            </p>
          </div>
          <Button onClick={handleCreateNew} size="lg" className="gap-2">
            <Plus className="h-4 w-4" />
            Buat CV Baru
          </Button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* History List */}
        {!loading && (
          <CVCreativeHistory
            cvs={cvs}
            onEdit={handleEdit}
            onRefresh={loadCVs}
          />
        )}
      </div>
    </AppShell>
  );
}
