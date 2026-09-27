import { useEffect, useRef, useState } from 'react';
import { ChainMark } from '../ui';

export interface Ecosystem {
    name: string;
    lang: string;
    marks: [key: string, label: string][];
}

interface Station {
    left: number;
    right: number;
    y: number;
}

// The ecosystems as a row of cards. When the cards sit side by side, a message line runs through
// their logos and a message hops from one to the next: the path is the same on every chain.
export function EcosystemRow({ ecosystems }: { ecosystems: Ecosystem[] }) {
    const wrap = useRef<HTMLDivElement>(null);
    const [stations, setStations] = useState<Station[]>([]);

    useEffect(() => {
        const el = wrap.current;
        if (!el) return;
        // Layout offsets ignore transforms, so hover lifts and scroll reveals do not move the line
        const offsetIn = (node: HTMLElement) => {
            let x = 0, y = 0;
            for (let n: HTMLElement | null = node; n && n !== el; n = n.offsetParent as HTMLElement | null) {
                x += n.offsetLeft;
                y += n.offsetTop;
            }
            return { x, y };
        };
        const measure = () => {
            const marks = [...el.querySelectorAll<HTMLElement>('[data-station]')].map((m) => {
                const { x, y } = offsetIn(m);
                return { left: x, right: x + m.offsetWidth, y: y + m.offsetHeight / 2 };
            });
            const oneRow = marks.length > 1 && marks.every((m) => Math.abs(m.y - marks[0].y) < 2);
            setStations(oneRow ? marks : []);
        };
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    return (
        <div ref={wrap} className="relative">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {ecosystems.map((e, i) => (
                    <div key={e.name} data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
                        <div className="card card-hover flex h-full flex-col p-7">
                            <div data-station className="flex items-center -space-x-1.5 self-start">
                                {e.marks.map(([key, label]) => (
                                    <span key={key} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-ink-700">
                                        <ChainMark chain={key} label={label} className="h-6 w-6" />
                                    </span>
                                ))}
                            </div>
                            <h3 className="mt-6 text-lg font-semibold text-slate-900 dark:text-white">{e.name}</h3>
                            <p className="mt-1 text-body">Contracts in {e.lang}</p>
                        </div>
                    </div>
                ))}
            </div>
            {stations.length > 1 && <StationLine stations={stations} />}
        </div>
    );
}

const DUR = 7; // seconds for one message to cross every station

function StationLine({ stations }: { stations: Station[] }) {
    const ref = useRef<SVGSVGElement>(null);
    const [motion, setMotion] = useState(false);
    useEffect(() => {
        const svg = ref.current;
        if (!svg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        setMotion(true);
        const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? svg.unpauseAnimations() : svg.pauseAnimations()));
        io.observe(svg);
        return () => io.disconnect();
    }, []);

    const gap = 8; // space between the line and each logo
    const hops = stations.slice(0, -1).map((s, i) => {
        const next = stations[i + 1];
        return { d: `M ${s.right + gap} ${s.y} L ${next.left - gap} ${next.y}`, end: [next.left, next.y] as const };
    });
    const share = 0.8 / hops.length; // each hop gets an equal slot, then the line rests
    return (
        <svg ref={ref} className="pointer-events-none absolute inset-0 hidden h-full w-full overflow-visible lg:block" aria-hidden="true">
            {hops.map((h) => (
                <path key={h.d} d={h.d} fill="none" strokeWidth={1.5} strokeLinecap="round" strokeDasharray="2 5" className="stroke-cyan-600/40 dark:stroke-via-teal/35" />
            ))}
            {motion &&
                hops.map((h, i) => {
                    const from = 0.04 + i * share;
                    const to = from + share * 0.7;
                    const ring = `0;${(to - 0.001).toFixed(3)};${to.toFixed(3)};${Math.min(to + 0.12, 0.999).toFixed(3)};1`;
                    return (
                        <g key={h.d}>
                            <g opacity={0}>
                                <animateMotion
                                    path={h.d}
                                    dur={`${DUR}s`}
                                    repeatCount="indefinite"
                                    calcMode="spline"
                                    keyPoints="0;0;1;1"
                                    keyTimes={`0;${from.toFixed(3)};${to.toFixed(3)};1`}
                                    keySplines="0 0 1 1;0.45 0 0.25 1;0 0 1 1"
                                />
                                <animate attributeName="opacity" values="0;1;0" keyTimes={`0;${from.toFixed(3)};${to.toFixed(3)}`} calcMode="discrete" dur={`${DUR}s`} repeatCount="indefinite" />
                                <circle r={8} className="fill-cyan-400/25 dark:fill-via-teal/20" />
                                <circle r={3.5} className="fill-[#00B8C4] dark:fill-via-teal" />
                            </g>
                            <circle cx={h.end[0] + 20} cy={h.end[1]} r={20} fill="none" strokeWidth={1.5} opacity={0} className="stroke-[#00B8C4] dark:stroke-via-teal">
                                <animate attributeName="r" values="20;20;20;32;32" keyTimes={ring} dur={`${DUR}s`} repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0;0;0.8;0;0" keyTimes={ring} dur={`${DUR}s`} repeatCount="indefinite" />
                            </circle>
                        </g>
                    );
                })}
        </svg>
    );
}
