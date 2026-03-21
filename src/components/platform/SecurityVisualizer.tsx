import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Link as LinkIcon, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import { AnimationStep } from './security-types';

interface SecurityVisualizerProps {
    chainEnabled: boolean;
    projectEnabled: boolean;
    animationStep: AnimationStep;
}

export const SecurityVisualizer: React.FC<SecurityVisualizerProps> = ({ chainEnabled, projectEnabled, animationStep }) => {

    // Helper to determine state of a specific node based on global animation step
    const getNodeState = (nodeId: 'via' | 'chain' | 'project') => {
        if (animationStep === 'idle') return 'idle';

        const sequence = ['via', 'chain', 'project', 'complete'];
        const currentIndex = sequence.indexOf(animationStep);
        const nodeIndex = sequence.indexOf(nodeId);

        if (animationStep === 'complete') return 'valid';
        if (animationStep === nodeId) return 'processing';
        if (currentIndex > nodeIndex) return 'valid';

        return 'pending';
    };

    return (
        <div className="relative w-[112%] -ml-[6%] h-[400px] hidden md:flex flex-col items-center justify-center">
            {/* Background Container Card */}
            <div className="absolute inset-0 bg-white rounded-3xl shadow-clean border border-slate-200 overflow-hidden">
                {/* Internal Grid */}
                <div className="absolute inset-0 bg-slate-50 opacity-50 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]" />
            </div>

            {/* Main Pipeline Container */}
            {/* Changed items-center to items-start to allow deterministic vertical positioning. Reduced padding-x for fit. */}
            {/* Main Pipeline Container */}
            {/* Changed items-center to items-start to allow deterministic vertical positioning. Removed max-w constraints to fit in column. */}
            {/* Main Pipeline Container */}
            {/* Full width, nodes at edges using justify-between. Added px-12 to prevent cramming at edges. */}
            <div className="relative z-10 w-full px-12 flex items-start justify-between h-full pt-32">

                {/* Connection Line (Background) */}
                {/* 
            Alignment Fix:
            The Icon Circles are h-24 (96px). 
            Center of circle is 48px.
            Padding top of container is pt-32 (128px).
            So top of line should be 128px + 48px = 176px.
            Actually, since this div is INSIDE the container that has pt-32, 
            absolute top would be relative to the flex container? No, relative to 'Main Pipeline Container'.
            If 'Main Pipeline Container' has pt-32, the first child starts at 128px.
            The line needs to be at top-[48px] RELATIVE to the flex items' start capability?
            Wait, absolute positioning is relative to the nearest positioned ancestor ('Main Pipeline Container').
            So: top-32 (128px) + 48px (center of circle) - 2px (half height of line) = top-[174px].
        */}
                {/* Connection Line (Background) */}
                {/* Nodes are w-24 (96px). Center is 48px. Padding is px-12 (48px). Start = 48+48=96px (left-24). */}
                {/* Last node is w-12 (48px). Center is 24px. Padding is 48px. End = 48+24=72px. */}
                {/* Adjusted: Overlap centers slightly to ensure connection. Desktop: 96px (left-24) vs 112px center (+16px). Mobile: 90px vs 104px center (+14px). */}
                <div className="absolute left-[90px] right-[90px] md:left-24 md:right-24 top-[174px] h-1 bg-slate-100 rounded-full overflow-hidden">
                    {/* Progress Beam */}
                    <motion.div
                        className="h-full bg-gradient-to-r from-via-teal to-emerald-400 shadow-[0_0_15px_rgba(0,229,229,0.8)]"
                        initial={{ width: "0%" }}
                        animate={{
                            width: animationStep === 'idle' || animationStep === 'via' ? "0%" : // Paused inside Via
                                animationStep === 'chain' ? "33%" : // Reached Chain
                                    animationStep === 'project' ? "66%" : // Reached Project
                                        animationStep === 'complete' ? "100%" : "0%"
                        }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                </div>

                {/* --- VIA NODE (Always On) --- */}
                <Node
                    title="VIA Layer"
                    icon={<Globe className="w-6 h-6" />}
                    status={getNodeState('via')}
                    isActive={true}
                    description="Routing & Delivery Guarantees"
                />

                {/* --- CHAIN NODE (Optional) --- */}
                <div className="relative">
                    {/* Bypass Line for optional layers */}
                    {!chainEnabled && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute top-[48px] left-0 right-0 h-1 bg-slate-200 -z-10"
                            style={{ marginTop: '-2px' }}
                        />
                    )}
                    <Node
                        title="Chain Layer"
                        icon={<LinkIcon className="w-6 h-6" />}
                        status={getNodeState('chain')}
                        isActive={chainEnabled}
                        isOptional={true}
                        description="Chain-level Security"
                    />
                </div>

                {/* --- PROJECT NODE (Optional) --- */}
                <div className="relative">
                    {!projectEnabled && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute top-[48px] left-0 right-0 h-1 bg-slate-200 -z-10"
                            style={{ marginTop: '-2px' }}
                        />
                    )}
                    <Node
                        title="Project Layer"
                        icon={<ShieldCheck className="w-6 h-6" />}
                        status={getNodeState('project')}
                        isActive={projectEnabled}
                        isOptional={true}
                        description="Multi-Ecosystem Security"
                    />
                </div>

                {/* --- DESTINATION --- */}
                {/* Centered vertically on line (48px from top). Circle is h-12 (48px). Top = 24px. */}
                {/* Text needs to align with others (96px from top). Bottom of circle is 24+48=72px. Need mt-6 (24px). */}
                <div className="flex flex-col items-center relative pt-6 w-28 md:w-32">
                    <motion.div
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors duration-500 ${animationStep === 'complete' ? 'delay-500' : ''}
                  ${animationStep === 'complete'
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-600 shadow-lg shadow-emerald-100'
                                : 'bg-white border-slate-200 text-slate-300'}`}
                    >
                        <CheckCircle2 className="w-6 h-6" />
                    </motion.div>
                    <span className={`text-sm font-semibold mt-10 text-center leading-tight transition-colors duration-300 ${animationStep === 'complete' ? 'text-emerald-600 delay-500' : 'text-slate-400'}`}>
                        Verified<br />Onchain
                    </span>
                </div>

                {/* Floating "Packet" Animation REMOVED as per user request */}
            </div>
        </div>
    );
};

// Sub-component for a single Node
interface NodeProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    status: 'idle' | 'processing' | 'valid' | 'pending';
    isActive: boolean;
    isOptional?: boolean;
}

const Node: React.FC<NodeProps> = ({ title, description, icon, status, isActive, isOptional }) => {
    return (
        <motion.div
            className={`relative flex flex-col items-center gap-4 transition-all duration-500 ${!isActive ? 'opacity-40 grayscale' : 'opacity-100'}`}
            animate={{ scale: status === 'processing' ? 1.05 : 1 }}
        >
            {/* The Circle Container */}
            <div className="relative">
                {/* Pulse Effect when processing */}
                {status === 'processing' && (
                    <motion.div
                        className="absolute inset-0 bg-via-teal rounded-full"
                        initial={{ opacity: 0.5, scale: 1 }}
                        animate={{ opacity: 0, scale: 2 }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    />
                )}

                {/* Main Icon Circle - w-24 h-24 = 96px */}
                <div className={`
          relative z-10 w-24 h-24 rounded-full flex items-center justify-center bg-white shadow-clean transition-colors duration-300
          ${(status === 'processing' || status === 'valid') ? 'delay-500' : ''}
          ${status === 'processing' ? 'border-2 border-via-teal text-via-teal' : ''}
          ${status === 'valid' ? 'border-2 border-emerald-400 text-emerald-500' : 'border border-slate-200 text-slate-900'}
        `}>
                    {isActive ? icon : <Lock className="w-6 h-6 text-slate-300" />}

                    {/* Status Badge */}
                    <div className="absolute -top-1 -right-1">
                        {status === 'valid' && (
                            <motion.div
                                initial={{ scale: 0 }} animate={{ scale: 1 }}
                                className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white border-2 border-white"
                            >
                                <CheckCircle2 size={14} />
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* Text Info - Reduced width to prevention overflow in 2-col layout */}
            <div className="text-center w-28 md:w-32">
                <h3 className={`text-sm font-bold mb-1 transition-colors duration-300 ${status === 'processing' ? 'text-via-teal delay-500' : 'text-slate-900'}`}>
                    {title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    {description}
                </p>
                {isOptional && (
                    <span className="inline-block mt-2 text-[10px] font-medium tracking-wider text-slate-400 uppercase bg-slate-100 px-2 py-0.5 rounded-full">
                        {isActive ? 'Active' : 'Bypassed'}
                    </span>
                )}
            </div>
        </motion.div>
    );
};
