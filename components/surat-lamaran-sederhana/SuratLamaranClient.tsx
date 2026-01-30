"use client";

import { useState } from "react";
import { SuratLamaranHome } from "./SuratLamaranHome";
import { SuratLamaranHistoryList } from "./SuratLamaranHistoryList";
import { motion, AnimatePresence } from "framer-motion";
import { MobileToolHeader } from "@/components/tools/MobileToolHeader";
import { useRouter } from "next/navigation";

type ViewType = 'home' | 'create' | 'history';

export function SuratLamaranClient() {
    const [activeView, setActiveView] = useState<ViewType>('home');
    const router = useRouter();

    const handleSelectView = (view: ViewType) => {
        if (view === 'create') {
            router.push('/surat-lamaran-sederhana/buat');
        } else {
            setActiveView(view);
        }
    };

    return (
        <>
            {/* Mobile Header only on Home */}
            {activeView === 'home' && (
                <MobileToolHeader
                    title="Surat Lamaran"
                    description="Professional Letter Generator"
                />
            )}

            <AnimatePresence mode="wait">
                {activeView === 'home' ? (
                    <motion.div
                        key="home"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="h-full w-full"
                    >
                        <SuratLamaranHome
                            onSelectView={handleSelectView}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="tool-view"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="h-full w-full bg-slate-50 dark:bg-[#050505]"
                    >
                        <div className="h-full w-full overflow-y-auto relative">
                            {/* Ambient Background for History */}
                            <div className="fixed inset-0 pointer-events-none">
                                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/10 dark:bg-emerald-600/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-50 dark:opacity-100" />
                            </div>

                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                                <SuratLamaranHistoryList
                                    onBack={() => setActiveView('home')}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
