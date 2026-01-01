"use client";

import dynamic from "next/dynamic";

const LandingBelowFold = dynamic(() => import("@/components/landing-v2/LandingBelowFold"), {
    ssr: false,
    loading: () => <div className="h-screen bg-black" />,
});

const StickyNotification = dynamic(
    () => import("@/components/landing-v2/StickyNotification").then((mod) => mod.StickyNotification),
    { ssr: false }
);

export default function LandingBelowFoldWrapper() {
    return (
        <>
            <LandingBelowFold />
            <StickyNotification />
        </>
    );
}
