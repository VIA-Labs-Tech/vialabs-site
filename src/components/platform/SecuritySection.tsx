import { useState, useEffect, useRef } from 'react';
import { SecurityControls } from './SecurityControls';
import { SecurityVisualizer } from './SecurityVisualizer';
import { AnimationStep } from './security-types';

const STEP_DURATION = 1500;

export default function SecuritySection() {
    const [chainEnabled, setChainEnabled] = useState(true);
    const [projectEnabled, setProjectEnabled] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);
    const [animationStep, setAnimationStep] = useState<AnimationStep>('idle');
    const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

    useEffect(() => {
        return () => timeoutsRef.current.forEach(clearTimeout);
    }, []);

    const schedule = (fn: () => void, ms: number) => {
        timeoutsRef.current.push(setTimeout(fn, ms));
    };

    const runSimulation = () => {
        if (isSimulating) return;
        timeoutsRef.current.forEach(clearTimeout);
        timeoutsRef.current = [];

        setIsSimulating(true);
        setAnimationStep('via');

        const steps: AnimationStep[] = ['via'];
        if (chainEnabled) steps.push('chain');
        if (projectEnabled) steps.push('project');
        steps.push('complete');

        let delay = 0;
        for (let i = 1; i < steps.length; i++) {
            delay += STEP_DURATION;
            const step = steps[i];
            schedule(() => setAnimationStep(step), delay);
        }

        delay += STEP_DURATION + 1000;
        schedule(() => {
            setIsSimulating(false);
            schedule(() => setAnimationStep('idle'), 200);
        }, delay);
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

                {/* Right Column: Visualizer — hidden on mobile */}
                <SecurityVisualizer
                    chainEnabled={chainEnabled}
                    projectEnabled={projectEnabled}
                    animationStep={animationStep}
                />
            </div>
        </div>
    );
}
