"use client";

import { useState } from "react";
import { InterviewPrepSession } from "@/types/interview-prep";
import { InterviewPrepHome } from "./InterviewPrepHome";
import { InterviewHistoryList } from "./InterviewHistoryList";
import { UploadFormNew } from "./UploadFormNew";
import { motion, AnimatePresence } from "framer-motion";
import { MobileToolHeader } from "@/components/tools/MobileToolHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface InterviewPrepClientProps {
    initialSessions: InterviewPrepSession[];
}

type ViewType = 'home' | 'wizard' | 'history';

export function InterviewPrepClient({ initialSessions }: InterviewPrepClientProps) {
    const [activeView, setActiveView] = useState<ViewType>('home');

    // Helper render function
    const renderContent = () => {
        switch (activeView) {
            case 'wizard':
                return (
                    <div className="max-w-4xl mx-auto px-4 py-8">
                        <div className="mb-6">
                            <Button
                                variant="ghost"
                                className="mb-4 pl-0 hover:pl-2 transition-all"
                                onClick={() => setActiveView('home')}
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali ke Dashboard
                            </Button>
                            <h2 className="text-2xl font-bold mb-2">Mulai Sesi Interview Baru</h2>
                            <p className="text-muted-foreground">
                                Upload gambar CV & job poster atau paste text untuk generate persiapan interview yang dipersonalisasi
                            </p>
                        </div>
                        <UploadFormNew />
                    </div>
                );
            case 'history':
                return (
                    <div className="h-full w-full bg-slate-50 dark:bg-[#050505] overflow-y-auto relative">
                        {/* Reuse Background Pattern from Home */}
                        <div className="fixed inset-0 pointer-events-none">
                            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 dark:bg-blue-600/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-50 dark:opacity-100" />
                        </div>

                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                            <InterviewHistoryList
                                sessions={initialSessions}
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
                    title="Interview Prep"
                    description="AI Interview Simulator"
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
                        <InterviewPrepHome
                            onSelectView={(view) => setActiveView(view)}
                            totalSessions={initialSessions.length}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="tool-view"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="h-full w-full bg-slate-50 dark:bg-[#050505] overflow-y-auto"
                    >
                        {renderContent()}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
