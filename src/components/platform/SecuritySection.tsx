import { useState } from 'react';
import { SecurityControls } from './SecurityControls';
import { SecurityVisualizer } from './SecurityVisualizer';
import { AnimationStep } from './security-types';

export default function SecuritySection() {
    const [chainEnabled, setChainEnabled] = useState(true);
    const [projectEnabled, setProjectEnabled] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);
    const [animationStep, setAnimationStep] = useState<AnimationStep>('idle');

    const runSimulation = () => {
        if (isSimulating) return;
        setIsSimulating(true);
        setAnimationStep('via');

        // Simulation Sequence
        // Base delay for VIA processing
        let delay = 1000;

        // Step 1: Transition from VIA
        setTimeout(() => {
            // Check next step
            if (chainEnabled) {
                setAnimationStep('chain');

                // From Chain -> Project or Complete
                setTimeout(() => {
                    if (projectEnabled) {
                        setAnimationStep('project');
                        setTimeout(() => setAnimationStep('complete'), 1500);
                    } else {
                        setAnimationStep('complete');
                    }
                }, 1500); // Duration for Chain processing

            } else {
                // Chain Disabled -> Skip straight to Project or Complete
                if (projectEnabled) {
                    setAnimationStep('project');
                    setTimeout(() => setAnimationStep('complete'), 1500);
                } else {
                    setAnimationStep('complete');
                }
            }
        }, delay);

        // Reset Logic (Total time calculation difficult with branching, so we just use an estimator or check status)
        // Actually, cleaner to allow the 'complete' step to trigger the reset.
        // But for now, we'll just set a long timeout to safe-reset or use a useEffect?
        // Let's stick to a robust timeout estimation based on branches.

        const totalDuration = 1000 +
            (chainEnabled ? 1500 : 0) +
            (projectEnabled ? 1500 : 0) +
            1500 + 1000; // Time to stay on 'complete' before reset + 1s user request

        setTimeout(() => {
            setIsSimulating(false);
            setTimeout(() => setAnimationStep('idle'), 200);
        }, totalDuration);
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                {/* Left Column: Controls */}
                <SecurityControls
                    chainEnabled={chainEnabled}
                    setChainEnabled={setChainEnabled}
                    projectEnabled={projectEnabled}
                    setProjectEnabled={setProjectEnabled}
                    onSimulate={runSimulation}
                    isSimulating={isSimulating}
                />

                {/* Right Column: Visualizer */}
                <SecurityVisualizer
                    chainEnabled={chainEnabled}
                    projectEnabled={projectEnabled}
                    animationStep={animationStep}
                />
            </div>
        </div>
    );
}
