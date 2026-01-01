import Navbar from '@/components/komukuna-event/Navbar';
import HeroSection from '@/components/komukuna-event/HeroSection';
import { KomukunaBelowFold } from '@/components/komukuna-event/KomukunaBelowFold';

export default function KomukunaEventPage() {
    return (
        <main className="relative w-full overflow-hidden">
            <Navbar />
            <HeroSection />
            <KomukunaBelowFold />
        </main>
    );
}
