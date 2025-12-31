"use client";

import dynamic from "next/dynamic";

// Below-fold components - lazy load for better LCP & TBT
const CompanyLogoMarquee = dynamic(
    () => import("@/components/landing-v2/CompanyLogoMarquee").then(mod => ({ default: mod.CompanyLogoMarquee })),
    { ssr: false }
);

const UserSegmentation = dynamic(
    () => import("@/components/landing-v2/UserSegmentation").then(mod => ({ default: mod.UserSegmentation })),
    { ssr: false }
);

const PainPointsMeteor = dynamic(
    () => import("@/components/landing-v2/PainPointsMeteor").then(mod => ({ default: mod.PainPointsMeteor })),
    { ssr: false }
);

const AboutSectionV2 = dynamic(
    () => import("@/components/landing-v2/AboutSectionV2").then(mod => ({ default: mod.AboutSectionV2 })),
    { ssr: false }
);

const WhyInfoLokerOriginal = dynamic(
    () => import("@/components/landing-v2/WhyInfoLokerOriginal").then(mod => ({ default: mod.WhyInfoLokerOriginal })),
    { ssr: false }
);

const WhyInfoLokerSectionV2 = dynamic(
    () => import("@/components/landing-v2/WhyInfoLokerSectionV2").then(mod => ({ default: mod.WhyInfoLokerSectionV2 })),
    { ssr: false }
);

const MotivationCosmic = dynamic(
    () => import("@/components/landing-v2/MotivationCosmic").then(mod => ({ default: mod.MotivationCosmic })),
    { ssr: false }
);

const WallOfLove = dynamic(
    () => import("@/components/landing-v2/WallOfLove").then(mod => ({ default: mod.WallOfLove })),
    { ssr: false }
);

const ComparisonSticky = dynamic(
    () => import("@/components/landing-v2/ComparisonSticky").then(mod => ({ default: mod.ComparisonSticky })),
    { ssr: false }
);

const PricingBeams = dynamic(
    () => import("@/components/landing-v2/PricingBeams").then(mod => ({ default: mod.PricingBeams })),
    { ssr: false }
);

const BentoGridPro = dynamic(
    () => import("@/components/landing-v2/BentoGridPro").then(mod => ({ default: mod.BentoGridPro })),
    { ssr: false }
);

const TestimonialMarquee = dynamic(
    () => import("@/components/landing-v2/TestimonialMarquee").then(mod => ({ default: mod.TestimonialMarquee })),
    { ssr: false }
);

const FAQGlass = dynamic(
    () => import("@/components/landing-v2/FAQGlass").then(mod => ({ default: mod.FAQGlass })),
    { ssr: false }
);

const CTAExplosion = dynamic(
    () => import("@/components/landing-v2/CTAExplosion").then(mod => ({ default: mod.CTAExplosion })),
    { ssr: false }
);

const SimpleFooter = dynamic(
    () => import("@/components/landing-v2/SimpleFooter").then(mod => ({ default: mod.SimpleFooter })),
    { ssr: false }
);

const StickyBottomCTA = dynamic(
    () => import("@/components/landing-v2/StickyBottomCTA").then(mod => ({ default: mod.StickyBottomCTA })),
    { ssr: false }
);

export default function LandingBelowFold() {
    return (
        <>
            <CompanyLogoMarquee />
            <UserSegmentation />
            <PainPointsMeteor />
            <AboutSectionV2 />
            <WhyInfoLokerOriginal />
            <WhyInfoLokerSectionV2 />
            <MotivationCosmic />
            <WallOfLove />
            <ComparisonSticky />
            <PricingBeams />
            <BentoGridPro />
            <TestimonialMarquee />
            <FAQGlass />
            <CTAExplosion />

            <SimpleFooter />
            <StickyBottomCTA />
        </>
    );
}
