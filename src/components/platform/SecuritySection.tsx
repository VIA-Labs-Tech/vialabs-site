import { useState } from 'react';
import { SecurityControls } from './SecurityControls';
import { SecurityVisualizer } from './SecurityVisualizer';

export default function SecuritySection() {
    const [chainEnabled, setChainEnabled] = useState(true);
    const [projectEnabled, setProjectEnabled] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);
    const [runId, setRunId] = useState(0);

    // The visualizer owns the animation clock. It reports back when the run ends.
    const runSimulation = () => {
        if (isSimulating) return;
        setIsSimulating(true);
        setRunId((id) => id + 1);
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-24 items-center">
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
                    runId={runId}
                    onDone={() => setIsSimulating(false)}
                />
            </div>
        </div>
    );
}
