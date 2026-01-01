"use client";

import dynamic from "next/dynamic";

const LandingBelowFold = dynamic(() => import("@/components/landing-v2/LandingBelowFold"), {
    ssr: false,
    loading: () => <div className="h-screen bg-black" /> // Simple placeholder
});

export default function LandingBelowFoldWrapper() {
    return <LandingBelowFold />;
}
