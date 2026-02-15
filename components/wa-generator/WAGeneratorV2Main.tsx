"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { MobileToolHeader } from "@/components/tools/MobileToolHeader";

import type { WAMessageType } from "./types";

// Regular imports instead of dynamic to avoid module loading issues
import { WATypeHome } from "./WATypeHome";
import { WAWizardV2 } from "./WAWizardV2";
import { WAFormFollowUp } from "./WAFormFollowUp";
import { WAFormThankYou } from "./WAFormThankYou";
import { WAFormConfirmation } from "./WAFormConfirmation";
import { WAFormStatusInquiry } from "./WAFormStatusInquiry";
import { WAFormReApplication } from "./WAFormReApplication";
import { WAFormReferral } from "./WAFormReferral";


interface WAGeneratorV2MainProps {
    userName: string;
}

export function WAGeneratorV2Main({ userName }: WAGeneratorV2MainProps) {
    const [selectedType, setSelectedType] = useState<WAMessageType | null>(null);

    const handleSelectType = (type: WAMessageType) => {
        setSelectedType(type);
    };

    const handleBack = () => {
        setSelectedType(null);
    };

    // Render the appropriate form based on selected type
    const renderForm = () => {
        switch (selectedType) {
            case 'application':
                return <WAWizardV2 userName={userName} onBack={handleBack} />;
            case 'follow_up':
                return <WAFormFollowUp userName={userName} onBack={handleBack} />;
            case 'thank_you':
                return <WAFormThankYou userName={userName} onBack={handleBack} />;
            case 'interview_confirmation':
                return <WAFormConfirmation userName={userName} onBack={handleBack} />;
            case 'status_inquiry':
                return <WAFormStatusInquiry userName={userName} onBack={handleBack} />;
            case 're_application':
                return <WAFormReApplication userName={userName} onBack={handleBack} />;
            case 'referral':
                return <WAFormReferral userName={userName} onBack={handleBack} />;
            default:
                return null;
        }
    };

    // Show form if a type is selected
    if (selectedType) {
        return (
            <AnimatePresence mode="wait">
                {renderForm()}
            </AnimatePresence>
        );
    }

    // Show homepage with message type selection
    return (
        <>
            <MobileToolHeader
                title="WA Generator"
                description="Buat pesan WhatsApp profesional"
                fullScreen
            />
            <div className="h-full w-full overflow-y-auto">
                <WATypeHome userName={userName} onSelectType={handleSelectType} />
            </div>
        </>
    );
}
