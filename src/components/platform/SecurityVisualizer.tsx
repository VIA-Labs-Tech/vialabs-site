import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Globe, Link as LinkIcon, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

// --- Simulation timing ---
// One clock drives the beam, the nodes, and the destination, so they cannot drift apart.
// Every layer combination uses the same beam speed and the same verify time.
const VERIFY_MS = 1200;      // each active layer shows "verifying" for this long: one ping
const LINE_TRAVEL_MS = 2000; // beam speed, as the time to cross the whole line
const HOLD_MS = 1500;        // the finished state stays on screen this long
const FADE_MS = 400;         // then everything fades back to idle together
const PARK_INSET = 3;        // px inside a circle's right edge where the beam waits, hidden, while that layer verifies

type NodeId = 'via' | 'chain' | 'project';
type NodeStatus = 'idle' | 'processing' | 'valid';

interface Timeline {
    arrive: Record<NodeId, number | null>; // ms when the beam touches the node; null = bypassed
    destArrive: number;
    fadeStart: number;
    end: number;
    keyframes: { t: number; x: number }[]; // beam front, px from the start of the line
}

interface SecurityVisualizerProps {
    chainEnabled: boolean;
    projectEnabled: boolean;
    runId: number; // increments each time a simulation starts
    onDone: () => void;
}

const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);

const beamAt = (keyframes: Timeline['keyframes'], t: number) => {
    for (let i = 1; i < keyframes.length; i++) {
        const a = keyframes[i - 1];
        const b = keyframes[i];
        if (t <= b.t) return b.t === a.t ? b.x : a.x + (b.x - a.x) * ((t - a.t) / (b.t - a.t));
    }
    return keyframes[keyframes.length - 1].x;
};

export const SecurityVisualizer: React.FC<SecurityVisualizerProps> = ({ chainEnabled, projectEnabled, runId, onDone }) => {
    const [elapsed, setElapsed] = useState<number | null>(null); // ms since the run started; null = idle
    const timelineRef = useRef<Timeline | null>(null);

    const lineRef = useRef<HTMLDivElement>(null);
    const viaRef = useRef<HTMLDivElement>(null);
    const chainRef = useRef<HTMLDivElement>(null);
    const projectRef = useRef<HTMLDivElement>(null);
    const destRef = useRef<HTMLDivElement>(null);

    // The run reads the latest toggles and callback without restarting when they change
    const latest = useRef({ chainEnabled, projectEnabled, onDone });
    latest.current = { chainEnabled, projectEnabled, onDone };

    useEffect(() => {
        if (runId === 0) return;

        const line = lineRef.current?.getBoundingClientRect();
        if (!line || line.width === 0 || !viaRef.current || !chainRef.current || !projectRef.current || !destRef.current) {
            latest.current.onDone();
            return;
        }
        const span = (el: HTMLElement) => {
            const r = el.getBoundingClientRect();
            return { left: r.left - line.left, right: r.right - line.left };
        };
        const geo = { via: span(viaRef.current), chain: span(chainRef.current), project: span(projectRef.current), dest: span(destRef.current) };
        const enabled = { chain: latest.current.chainEnabled, project: latest.current.projectEnabled };

        // Build the timeline. The beam leaves a node the moment that node turns valid, moves at one speed,
        // and the next active node starts verifying the moment the beam touches its circle.
        const speed = line.width / LINE_TRAVEL_MS; // px per ms
        const arrive: Timeline['arrive'] = { via: 0, chain: null, project: null };
        let x = geo.via.right - PARK_INSET;
        let lastArrive = 0;
        const keyframes = [{ t: 0, x }];
        for (const id of ['chain', 'project'] as const) {
            if (!enabled[id]) continue;
            const depart = lastArrive + VERIFY_MS;
            const touch = depart + (geo[id].left - x) / speed;
            const park = geo[id].right - PARK_INSET;
            keyframes.push({ t: depart, x }, { t: touch, x: geo[id].left }, { t: Math.min(touch + (park - geo[id].left) / speed, touch + VERIFY_MS), x: park });
            arrive[id] = touch;
            lastArrive = touch;
            x = park;
        }
        const depart = lastArrive + VERIFY_MS;
        const destArrive = depart + (geo.dest.left - x) / speed;
        keyframes.push({ t: depart, x }, { t: destArrive, x: geo.dest.left }, { t: destArrive + (line.width - geo.dest.left) / speed, x: line.width });
        const timeline: Timeline = { arrive, destArrive, fadeStart: destArrive + HOLD_MS, end: destArrive + HOLD_MS + FADE_MS, keyframes };
        timelineRef.current = timeline;

        let raf = 0;
        const start = performance.now();
        const tick = (now: number) => {
            const t = now - start;
            if (t >= timeline.end) {
                setElapsed(null);
                latest.current.onDone();
                return;
            }
            setElapsed(t);
            raf = requestAnimationFrame(tick);
        };
        setElapsed(0);
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [runId]);

    const timeline = timelineRef.current;
    const running = elapsed !== null && timeline !== null;
    const fading = running && elapsed >= timeline.fadeStart;

    const nodeState = (id: NodeId): { status: NodeStatus; ping: number } => {
        const at = running && !fading ? timeline.arrive[id] : null;
        if (at === null || elapsed === null || elapsed < at) return { status: 'idle', ping: 0 };
        if (elapsed < at + VERIFY_MS) return { status: 'processing', ping: (elapsed - at) / VERIFY_MS };
        return { status: 'valid', ping: 0 };
    };

    const beamWidth = running ? beamAt(timeline.keyframes, elapsed) : 0;
    const beamOpacity = fading ? Math.max(0, 1 - (elapsed - timeline.fadeStart) / FADE_MS) : 1;
    const delivered = running && !fading && elapsed >= timeline.destArrive;

    return (
        <div className="relative w-[112%] -ml-[6%] h-[400px] hidden md:flex flex-col items-center justify-center">
            {/* Background Container Card */}
            <div className="absolute inset-0 bg-white dark:bg-[#1a1b23] rounded-3xl shadow-clean border border-slate-200 dark:border-slate-700 overflow-hidden">
                {/* Internal Grid */}
                <div className="absolute inset-0 bg-slate-50 dark:bg-[#0F1117] opacity-50 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px]" />
            </div>

            {/* Main Pipeline Container */}
            <div className="relative z-10 w-full px-12 flex items-start justify-between h-full pt-32">

                {/* Connection Line (Background) */}
                <div ref={lineRef} className="absolute left-[90px] right-[90px] md:left-24 md:right-24 top-[174px] h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    {/* Progress Beam */}
                    <div
                        className="h-full bg-gradient-to-r from-via-teal to-emerald-400 shadow-[0_0_15px_rgba(0,229,229,0.8)]"
                        style={{ width: beamWidth, opacity: beamOpacity }}
                    />
                </div>

                {/* --- VIA NODE (Always On) --- */}
                <Node
                    title="VIA Layer"
                    icon={<Globe className="w-6 h-6" />}
                    {...nodeState('via')}
                    circleRef={viaRef}
                    isActive={true}
                    description="Signed by VIA Labs"
                />

                {/* --- CHAIN NODE (Optional) --- */}
                <div className="relative">
                    {/* Bypass Line for optional layers */}
                    {!chainEnabled && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute top-[48px] left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700 -z-10"
                            style={{ marginTop: '-2px' }}
                        />
                    )}
                    <Node
                        title="Chain Layer"
                        icon={<LinkIcon className="w-6 h-6" />}
                        {...nodeState('chain')}
                        circleRef={chainRef}
                        isActive={chainEnabled}
                        isOptional={true}
                        description="Signed by the chain"
                    />
                </div>

                {/* --- PROJECT NODE (Optional) --- */}
                <div className="relative">
                    {!projectEnabled && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute top-[48px] left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700 -z-10"
                            style={{ marginTop: '-2px' }}
                        />
                    )}
                    <Node
                        title="Project Layer"
                        icon={<ShieldCheck className="w-6 h-6" />}
                        {...nodeState('project')}
                        circleRef={projectRef}
                        isActive={projectEnabled}
                        isOptional={true}
                        description="Signed by your team"
                    />
                </div>

                {/* --- DESTINATION --- */}
                <div className="flex flex-col items-center relative z-20 pt-6 w-28 md:w-32">
                    <div
                        ref={destRef}
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors duration-300
                  ${delivered
                                ? 'bg-emerald-50 dark:bg-[#1a2332] border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-lg shadow-emerald-100 dark:shadow-emerald-900/20'
                                : 'bg-white dark:bg-[#1a1b23] border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600'}`}
                    >
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <span className={`text-sm font-semibold mt-10 text-center leading-tight transition-colors duration-300 ${delivered ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
                        Verified<br />Onchain
                    </span>
                </div>
            </div>
        </div>
    );
};

// Sub-component for a single Node
interface NodeProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    status: NodeStatus;
    ping: number; // 0 to 1 through the verify window
    circleRef: React.RefObject<HTMLDivElement>;
    isActive: boolean;
    isOptional?: boolean;
}

const Node: React.FC<NodeProps> = ({ title, description, icon, status, ping, circleRef, isActive, isOptional }) => {
    return (
        <motion.div
            className={`relative flex flex-col items-center gap-4 transition-all duration-500 ${!isActive ? 'opacity-40 grayscale' : 'opacity-100'}`}
            animate={{ scale: status === 'processing' ? 1.05 : 1 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
        >
            {/* The Circle Container */}
            <div className="relative">
                {/* One ping per verify window, driven by the shared clock */}
                {status === 'processing' && (
                    <div
                        className="absolute inset-0 bg-via-teal rounded-full"
                        style={{ opacity: 0.5 * (1 - ping), transform: `scale(${1 + easeOut(ping)})` }}
                    />
                )}

                {/* Main Icon Circle - w-24 h-24 = 96px */}
                <div ref={circleRef} className={`
          relative z-10 w-24 h-24 rounded-full flex items-center justify-center bg-white dark:bg-[#1a1b23] shadow-clean transition-colors duration-300
          ${status === 'processing' ? 'border-2 border-via-teal text-via-teal' : ''}
          ${status === 'valid' ? 'border-2 border-emerald-400 text-emerald-500' : 'border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white'}
        `}>
                    {isActive ? icon : <Lock className="w-6 h-6 text-slate-300 dark:text-slate-600" />}

                    {/* Status Badge */}
                    <div className="absolute -top-1 -right-1">
                        <AnimatePresence>
                            {status === 'valid' && (
                                <motion.div
                                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                                    transition={{ duration: 0.25, ease: 'easeOut' }}
                                    className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white border-2 border-white dark:border-[#1a1b23]"
                                >
                                    <CheckCircle2 size={14} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Text Info */}
            <div className="text-center w-28 md:w-32">
                <h3 className={`text-sm font-bold mb-1 transition-colors duration-300 ${status === 'processing' ? 'text-via-teal' : 'text-slate-900 dark:text-white'}`}>
                    {title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {description}
                </p>
                {isOptional && (
                    <span className="inline-block mt-2 text-[10px] font-medium tracking-wider text-slate-400 dark:text-slate-500 uppercase bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                        {isActive ? 'Active' : 'Bypassed'}
                    </span>
                )}
            </div>
        </motion.div>
    );
};
