import { createContext, useContext, useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { chainLogo } from '../../chains';

// Small animated diagrams for the home page. Each one is an SVG that uses SVG animation elements.
// The server renders the still parts. Moving parts mount in the browser unless the visitor
// asks for reduced motion, and they pause while the diagram is off screen.

const Motion = createContext(false);
const ShadowId = createContext('');

export function Scene({ viewBox, children }: { viewBox: string; children: ReactNode }) {
    const ref = useRef<SVGSVGElement>(null);
    const [motion, setMotion] = useState(false);
    const shadow = `shadow-${useId().replace(/:/g, '')}`;
    useEffect(() => {
        const svg = ref.current;
        if (!svg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        setMotion(true);
        const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? svg.unpauseAnimations() : svg.pauseAnimations()));
        io.observe(svg);
        return () => io.disconnect();
    }, []);
    return (
        <svg ref={ref} viewBox={viewBox} className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <defs>
                <filter id={shadow} x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#0F1117" floodOpacity="0.14" />
                </filter>
            </defs>
            <ShadowId.Provider value={shadow}>
                <Motion.Provider value={motion}>{children}</Motion.Provider>
            </ShadowId.Provider>
        </svg>
    );
}

export const useMotion = () => useContext(Motion);
export const useShadow = () => `url(#${useContext(ShadowId)})`;

const surface = 'fill-white stroke-slate-200 dark:fill-ink-700 dark:stroke-white/10';
export const accentFill = 'fill-[#00B8C4] dark:fill-via-teal';
export const accentStroke = 'stroke-[#00B8C4] dark:stroke-via-teal';

// A chain logo on a disc, with an optional name underneath
export function Disc({ x, y, r = 22, chain, label }: { x: number; y: number; r?: number; chain: string; label?: string }) {
    const shadow = useShadow();
    const logo = chainLogo(chain);
    const s = r * 1.2;
    return (
        <g>
            <circle cx={x} cy={y} r={r} filter={shadow} className={surface} />
            {logo && (
                <>
                    <image href={logo.light} x={x - s / 2} y={y - s / 2} width={s} height={s} className="dark:hidden" />
                    <image href={logo.dark} x={x - s / 2} y={y - s / 2} width={s} height={s} className="hidden dark:inline" />
                </>
            )}
            {label && (
                <text x={x} y={y + r + 18} textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[12px] font-medium">
                    {label}
                </text>
            )}
        </g>
    );
}

// A rounded box, for things that are not chains
export function Box({ x, y, w, h, children }: { x: number; y: number; w: number; h: number; children?: ReactNode }) {
    const shadow = useShadow();
    return (
        <g>
            <rect x={x} y={y} width={w} height={h} rx={12} filter={shadow} className={surface} />
            {children}
        </g>
    );
}

// The line a message travels along
export function Wire({ d }: { d: string }) {
    return <path d={d} fill="none" strokeWidth={1.5} strokeLinecap="round" className="stroke-cyan-600/35 dark:stroke-via-teal/30" />;
}

// Moves its children along a path during part of each loop, and hides them the rest of the time.
// `from` and `to` are shares of the loop. Without motion, `still` places one copy on the line.
export function Travel({ path, dur, from, to, hold = 0, still, children }: {
    path: string; dur: number; from: number; to: number; hold?: number; still?: [number, number]; children: ReactNode;
}) {
    const motion = useMotion();
    if (!motion) return still ? <g transform={`translate(${still[0]} ${still[1]})`}>{children}</g> : null;
    return (
        <g opacity={0}>
            <animateMotion
                path={path}
                dur={`${dur}s`}
                repeatCount="indefinite"
                calcMode="spline"
                keyPoints="0;0;1;1"
                keyTimes={`0;${from};${to};1`}
                keySplines="0 0 1 1;0.45 0 0.25 1;0 0 1 1"
            />
            <animate attributeName="opacity" values="0;1;0" keyTimes={`0;${from};${Math.min(to + hold, 0.999)}`} calcMode="discrete" dur={`${dur}s`} repeatCount="indefinite" />
            {children}
        </g>
    );
}

// A ring that spreads out once when something arrives, at share `at` of the loop
export function Ripple({ x, y, r, dur, at }: { x: number; y: number; r: number; dur: number; at: number }) {
    const motion = useMotion();
    if (!motion) return null;
    const keyTimes = `0;${Math.max(at - 0.001, 0)};${at};${Math.min(at + 0.14, 0.999)};1`;
    return (
        <circle cx={x} cy={y} r={r} fill="none" strokeWidth={1.5} opacity={0} className={accentStroke}>
            <animate attributeName="r" values={`${r};${r};${r};${r + 14};${r + 14}`} keyTimes={keyTimes} dur={`${dur}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;0;0.8;0;0" keyTimes={keyTimes} dur={`${dur}s`} repeatCount="indefinite" />
        </circle>
    );
}

// A message: a bright dot with a soft halo
export function Dot() {
    return (
        <>
            <circle r={9} className="fill-cyan-400/25 dark:fill-via-teal/20" />
            <circle r={3.8} className={accentFill} />
        </>
    );
}
