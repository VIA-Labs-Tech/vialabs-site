import { HeroSection } from '../components/HeroSection';
import { TrustedBy } from '../components/TrustedBy';
import { FeatureGrid } from '../components/FeatureGrid';
import { DeveloperExperience } from '../components/DeveloperExperience';

export function Home() {
    return (
        <main>
            <HeroSection />
            <TrustedBy />
            <FeatureGrid />
            <DeveloperExperience />
        </main>
    );
}
