import { Metadata } from "next";
import WaitlistContent from "./WaitlistContent";

export const metadata: Metadata = {
    title: "Waitlist — Career VIP InfoLokerJombang | Daftar Sekarang!",
    description:
        "Daftar waitlist Career VIP InfoLokerJombang. Jadi yang pertama dapat akses Grup WA eksklusif dengan info lowongan kerja valid setiap hari!",
    keywords: [
        "waitlist infolokerjombang",
        "career vip jombang",
        "lowongan kerja jombang",
        "info loker vip",
        "grup wa loker",
    ],
    openGraph: {
        title: "Waitlist — Career VIP InfoLokerJombang",
        description:
            "Jadi yang pertama! Daftar waitlist & akses Grup WA loker valid setiap hari.",
        type: "website",
    },
};

export default function WaitlistPage() {
    return <WaitlistContent />;
}
