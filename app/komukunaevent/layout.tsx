import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Komukuna Event | Photobooth & 360 Videobooth Services',
    description: 'Premium Photobooth and 360 Videobooth services for weddings, corporate events, and parties. Featuring customizable templates and instant sharing. Part of Komukuna Studio.',
    icons: {
        icon: '/komukuna-event/logo-badge.png', // Use the badge/icon for favicon if appropriate
    },
};

export default function KomukunaEventLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-komukuna-dark min-h-screen text-gray-100 selection:bg-komukuna-pink selection:text-white font-sans">
            {children}
        </div>
    );
}
