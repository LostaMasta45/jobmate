"use client";

import { useState } from "react";
import { Resume } from "@/lib/schemas/cv-ats";
import { CVATSHome } from "./CVATSHome";
import { CVWizard } from "./CVWizard";
import { CVHistoryList } from "./CVHistoryList";
import { CVATSToolLayout } from "./CVATSToolLayout";
import { motion, AnimatePresence } from "framer-motion";
import { MobileToolHeader } from "@/components/tools/MobileToolHeader";
import { FileText, Plus, History as HistoryIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CVATSClientProps {
    initialResumes: any[];
    onRefresh: () => Promise<void>;
}

type ViewType = 'home' | 'wizard' | 'history';

export function CVATSClient({ initialResumes, onRefresh }: CVATSClientProps) {
    // Local state for UI navigation, data is passed from parent page or refreshed via onRefresh
    const [activeView, setActiveView] = useState<ViewType>('home');
    const [editingResume, setEditingResume] = useState<Resume | null>(null);

    const handleCreateNew = () => {
        setEditingResume(null);
        setActiveView('wizard');
    };

    const handleEditResume = (resume: Resume) => {
        setEditingResume(resume);
        setActiveView('wizard');
    };

    const handleCloseWizard = () => {
        setEditingResume(null);
        setActiveView('home');
        onRefresh(); // Refresh data on close
    };

    // Helper render function
    const renderContent = () => {
        switch (activeView) {
            case 'wizard':
                // CVWizard handles its own layout/fullscreen nature
                return (
                    <CVWizard
                        initialResume={editingResume}
                        onClose={handleCloseWizard}
                    />
                );
            case 'history':
                return (
                    <div className="h-full w-full bg-slate-50 dark:bg-[#050505] overflow-y-auto relative">
                        {/* Reuse Background Pattern from Home */}
                        <div className="fixed inset-0 pointer-events-none">
                            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 dark:bg-blue-600/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-50 dark:opacity-100" />
                        </div>

                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                            <CVHistoryList
                                resumes={initialResumes}
                                onEdit={handleEditResume}
                                onRefresh={onRefresh}
                                onBack={() => setActiveView('home')}
                            />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            {/* Mobile Header only on Home */}
            {activeView === 'home' && (
                <MobileToolHeader
                    title="CV Generator"
                    description="Professional Resume Builder"
                    fullScreen
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
                        <CVATSHome
                            onSelectView={(view) => {
                                if (view === 'wizard') handleCreateNew();
                                else setActiveView(view);
                            }}
                            totalResumes={initialResumes.length}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        // Key ensures re-mount animation if switching types, though here we mostly go home <-> tool
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
        </>
    );
}
