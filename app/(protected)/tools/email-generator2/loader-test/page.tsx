"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LoadingOverlay, LoaderType } from "@/components/email-generator2/LoadingOverlay";
import { AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles, Mail, MessageSquare, Briefcase, Heart } from "lucide-react";
import Link from "next/link";

export default function LoaderTestPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [currentType, setCurrentType] = useState<LoaderType>('general');

    const handleTest = (type: LoaderType) => {
        setCurrentType(type);
        setIsLoading(true);
        // Simulate a longer process to see full cycle (8s)
        setTimeout(() => {
            setIsLoading(false);
        }, 8000);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 flex flex-col items-center justify-center relative">

            <AnimatePresence>
                <LoadingOverlay isVisible={isLoading} type={currentType} />
            </AnimatePresence>

            <div className="max-w-xl w-full space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-2xl text-center border border-slate-200 dark:border-slate-800">
                <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900/50 rounded-2xl flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">AI Loader V2 Test</h1>
                    <p className="text-slate-500 dark:text-slate-400">Pilih tipe email untuk memunculkan animasi loader yang sesuai konteks.</p>
                </div>

                <div className="pt-4 grid sm:grid-cols-2 gap-4">
                    <Button
                        onClick={() => handleTest('application')}
                        disabled={isLoading}
                        className="h-14 text-base rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20"
                    >
                        <Briefcase className="w-5 h-5 mr-2" />
                        Application
                    </Button>

                    <Button
                        onClick={() => handleTest('inquiry')}
                        disabled={isLoading}
                        className="h-14 text-base rounded-xl bg-pink-600 hover:bg-pink-700 text-white shadow-lg shadow-pink-500/20"
                    >
                        <Mail className="w-5 h-5 mr-2" />
                        Inquiry (Cold Email)
                    </Button>

                    <Button
                        onClick={() => handleTest('follow_up')}
                        disabled={isLoading}
                        className="h-14 text-base rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20"
                    >
                        <MessageSquare className="w-5 h-5 mr-2" />
                        Follow Up
                    </Button>

                    <Button
                        onClick={() => handleTest('thank_you')}
                        disabled={isLoading}
                        className="h-14 text-base rounded-xl bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20"
                    >
                        <Heart className="w-5 h-5 mr-2" />
                        Thank You
                    </Button>
                </div>

                <Link href="/tools/email-generator2" className="block pt-4">
                    <Button variant="ghost" className="w-full text-slate-500 hover:text-slate-900 dark:hover:text-slate-200">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Generator
                    </Button>
                </Link>
            </div>

            <div className="absolute bottom-8 text-center text-xs text-slate-400">
                JobMate UI Component Tester
            </div>
        </div>
    );
}
