"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { MobileToolHeader } from "@/components/tools/MobileToolHeader";
import { CVCreativeWizard } from "@/components/cv-creative/CVCreativeWizardNew";
import { CVCreativeHistory } from "@/components/cv-creative/CVCreativeHistory";
import { CVCreativeHome } from "@/components/cv-creative/CVCreativeHome";
import { CVATSToolLayout } from "@/components/cv-ats/CVATSToolLayout";
import { getAllCreativeCVs } from "@/actions/cv-creative";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Loader2, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";

type ViewType = 'home' | 'wizard' | 'history';

export default function CVCreativePage() {
  const [cvs, setCVs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeView, setActiveView] = React.useState<ViewType>('home');
  const [editingCV, setEditingCV] = React.useState<any | null>(null);

  const loadCVs = React.useCallback(async () => {
    // Only set global loading on first load if we want to block UI
    // For refresh, maybe we want silent update? keeping it simple for now
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
    setActiveView('wizard');
  };

  const handleEdit = (cv: any) => {
    // Map database format to app format
    const mappedCV = {
      id: cv.id,
      userId: cv.user_id,
      title: cv.title,
      templateId: cv.template_id,
      colorScheme: cv.color_scheme,
      photoUrl: cv.photo_url,
      photoOptions: cv.photo_options,
      content: cv.content,
      atsScore: cv.ats_score,
      isDefault: cv.is_default,
      createdAt: cv.created_at,
      updatedAt: cv.updated_at,
    };
    setEditingCV(mappedCV);
    setActiveView('wizard');
  };

  const handleHomeView = () => {
    setEditingCV(null);
    setActiveView('home');
    loadCVs(); // Refresh data when returning home
  };

  const renderContent = () => {
    switch (activeView) {
      case 'wizard':
        return (
          <CVCreativeWizard
            initialCV={editingCV}
            onClose={handleHomeView}
          />
        );
      case 'history':
        return (
          <div className="h-full w-full bg-slate-50 dark:bg-[#050505] overflow-y-auto relative">
            <div className="fixed inset-0 pointer-events-none">
              <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-pink-600/10 dark:bg-pink-600/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-50 dark:opacity-100" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
              <CVCreativeHistory
                cvs={cvs}
                onEdit={handleEdit}
                onRefresh={loadCVs}
                onBack={handleHomeView}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <AppShell isFullScreen>
        <div className="h-full w-full flex items-center justify-center bg-slate-50 dark:bg-[#050505]">
          <Loader2 className="h-10 w-10 animate-spin text-pink-600" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell isFullScreen>
      {/* Mobile Tool Header only on Home */}
      {activeView === 'home' && (
        <MobileToolHeader
          title="CV Creative"
          description="Design unique resumes"
        />
      )}

      <AnimatePresence mode="wait">
        {activeView === 'home' ? (
          <motion.div
            key="home"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full w-full overflow-y-auto"
          >
            <CVCreativeHome
              onSelectView={(view) => {
                if (view === 'wizard') handleCreateNew();
                else setActiveView(view);
              }}
              totalCVs={cvs.length}
            />
          </motion.div>
        ) : (
          <motion.div
            key="tool-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="h-full w-full bg-slate-50 dark:bg-[#050505] overflow-hidden"
          >
            {renderContent()}
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
