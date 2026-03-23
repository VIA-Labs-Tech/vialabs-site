import { useEffect } from 'react';
import { HeroSection } from '../components/HeroSection';
import { TrustedBy } from '../components/TrustedBy';
import { FeatureGrid } from '../components/FeatureGrid';
import { DeveloperExperience } from '../components/DeveloperExperience';

export function Home() {
    useEffect(() => { document.title = 'VIA Labs | Universal Cross-Chain Infrastructure'; }, []);
    return (
        <main>
            <HeroSection />
            <TrustedBy />
            <FeatureGrid />
            <DeveloperExperience />
        </main>
    );
}
