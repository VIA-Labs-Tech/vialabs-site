import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Lock, MousePointer2 } from 'lucide-react';
import { chainLogo } from '../../chains';
import { HELLO_WORLD, SCAN } from '../../links';
import logoBlack from '../../assets/brand/vialabs.svg';
import logoWhite from '../../assets/brand/vialabs-dark.svg';

// "How it works" as a journey: one message travels from your contract on one chain to your contract
// on another, one step per stretch of scrolling. Visitors pick the route, what the message carries,
// how many confirmations it waits for, and which security layers must sign.
// Wide screens pin the stage while the steps scroll past. Phones, tablets, and reduced motion get
// the steps stacked, each with its own picture (phones play each step once as it comes into view).

type Payload = 'tokens' | 'data' | 'call';
interface Journey {
    from: string;
    to: string;
    payload: Payload;
    blocks: 1 | 12;
    chainLayer: boolean;
    projectLayer: boolean;
}

const CHAINS: { key: string; name: string }[] = [
    { key: '17000', name: 'Ethereum' },
    { key: '8453', name: 'Base' },
    { key: '43114', name: 'Avalanche' },
    { key: '42161', name: 'Arbitrum' },
    { key: '137', name: 'Polygon' },
    { key: 'cardano', name: 'Cardano' },
    { key: 'stellar', name: 'Stellar' },
    { key: 'midnight', name: 'Midnight' },
];
const nameOf = (key: string) => CHAINS.find((c) => c.key === key)?.name ?? key;

const PAYLOADS: Record<Payload, { label: string; card: string; role: string; readout: string; done: string }> = {
    tokens: { label: 'Tokens', card: '100 tokens', role: 'Token contract', readout: 'Balance', done: 'it adds 100 tokens to the account' },
    data: { label: 'Data', card: 'Reading: 21.4 °C', role: 'Sensor feed', readout: 'Latest reading', done: 'it stores the new sensor reading' },
    call: { label: 'Contract call', card: 'Vote: yes', role: 'Voting app', readout: 'Votes counted', done: 'it counts the vote' },
};

const STEPS = ['send', 'confirm', 'sign', 'deliver', 'receive'] as const;
const TITLES = [
    'Your contract sends a message.',
    'The source chain confirms it.',
    'Signers check it and sign it.',
    'A relayer delivers it.',
    'Your other contract receives it.',
];

// --- Motion helpers ---
type Pt = [number, number];
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
const span = (u: number, a: number, b: number) => clamp01((u - a) / (b - a));
const mix = (a: Pt, b: Pt, k: number): Pt => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];

// --- Everything the picture shows at a point in the journey ---
// step is the current step (0 to 4) and u is how far through it (0 to 1).
function derive(step: number, u: number, j: Journey) {
    const at = (s: number) => (step > s ? 1 : step < s ? 0 : u);
    const slots: ('via' | 'chain' | 'project')[] = ['via', 'via', ...(j.chainLayer ? ['chain' as const] : []), ...(j.projectLayer ? ['project' as const] : [])];
    const n = slots.length;
    const send = at(0), confirm = at(1), sign = at(2), relay = at(3), receive = at(4);

    const sent = send > 0.92;
    const confirmations = Math.round(span(confirm, 0.05, 0.9) * j.blocks);
    const signStart = slots.map((_, k) => 0.1 + (0.7 * k) / Math.max(1, n - 1));
    const stamps = slots.map((_, k) => span(sign, signStart[k], signStart[k] + 0.1)); // 0..1 in flight, 1 = landed
    const signed = stamps.filter((s) => s >= 1).length;
    const arrived = relay > 0.72;
    const checks = slots.map((_, k) => relay >= 0.76 + (0.18 * k) / Math.max(1, n - 1));
    const checked = checks.filter(Boolean).length;
    const effect = span(receive, 0.55, 0.95);

    let card: Pt = SRC_C;
    let cardAlpha = 1;
    let cardScale = 1;
    if (step === 0) {
        card = mix(SRC_C, SRC_G, ease(span(u, 0.38, 0.95)));
        cardAlpha = span(u, 0, 0.22);
        cardScale = 0.86 + 0.14 * cardAlpha;
    } else if (step <= 2) card = SRC_G;
    else if (step === 3) card = mix(SRC_G, DST_G, ease(span(u, 0.08, 0.7)));
    else {
        card = mix(DST_G, DST_C, ease(span(u, 0, 0.45)));
        cardAlpha = 1 - span(u, 0.45, 0.6);
        cardScale = 1 - 0.25 * span(u, 0.45, 0.6);
    }
    return { slots, n, send, confirm, sign, relay, receive, sent, confirmations, signStart, stamps, signed, arrived, checks, checked, effect, card, cardAlpha, cardScale };
}

// --- Picture layout, in SVG units ---
const VW = 640;
const VH = 540;
const SRC_C: Pt = [120, 138];
const SRC_G: Pt = [120, 282];
const DST_G: Pt = [520, 282];
const DST_C: Pt = [520, 138];
const CARD_W = 152;
const CARD_H = 64;
// Signer dots in the center panel, by layer
const VIA_DOTS: Pt[] = [[340, 150], [356, 150], [372, 150]];
const CHAIN_DOT: Pt = [372, 178];
const PROJECT_DOT: Pt = [372, 206];

const t = {
    surface: 'fill-white stroke-slate-200 dark:fill-ink-800 dark:stroke-white/10',
    slot: 'fill-slate-50 stroke-slate-200 dark:fill-white/[0.03] dark:stroke-white/10',
    ink: 'fill-slate-900 dark:fill-white',
    body: 'fill-slate-600 dark:fill-slate-300',
    muted: 'fill-slate-400 dark:fill-slate-500',
    accentFill: 'fill-[#00B8C4] dark:fill-via-teal',
    accentStroke: 'stroke-[#00B8C4] dark:stroke-via-teal',
    wire: 'stroke-slate-300 dark:stroke-white/15',
};

function ChainLogo({ chain, x, y, size }: { chain: string; x: number; y: number; size: number }) {
    const logo = chainLogo(chain);
    if (!logo) return null;
    return (
        <>
            <image href={logo.light} x={x - size / 2} y={y - size / 2} width={size} height={size} className="dark:hidden" />
            <image href={logo.dark} x={x - size / 2} y={y - size / 2} width={size} height={size} className="hidden dark:inline" />
        </>
    );
}

function Slot({ x, y, w, h, label, lit }: { x: number; y: number; w: number; h: number; label: string; lit?: boolean }) {
    return (
        <g>
            <text x={x + 2} y={y - 8} className={`${t.body} text-[12px] font-semibold`}>
                {label}
            </text>
            <rect x={x} y={y} width={w} height={h} rx={14} strokeWidth={1} className={lit ? 'fill-cyan-50/70 stroke-cyan-500/50 dark:fill-via-teal/[0.06] dark:stroke-via-teal/40' : t.slot} strokeDasharray={lit ? undefined : '4 4'} />
        </g>
    );
}

// A faint picture of what the contract does, shown while the message is elsewhere
function RoleGlyph({ payload, x, y }: { payload: Payload; x: number; y: number }) {
    return (
        <g transform={`translate(${x} ${y})`} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="fill-none stroke-slate-300 dark:stroke-white/20">
            {payload === 'tokens' && (
                <>
                    <circle r={15} />
                    <circle r={9} />
                </>
            )}
            {payload === 'data' && (
                <>
                    <path d="M -3 5 V -12 a 3 3 0 0 1 6 0 V 5" />
                    <circle cy={10} r={6} />
                    <path d="M 10 -8 h 6 M 10 -2 h 4 M 10 4 h 6" />
                </>
            )}
            {payload === 'call' && (
                <>
                    <rect x={-16} y={-2} width={32} height={18} rx={3} />
                    <path d="M -8 -2 V -12 H 8 V -2" />
                    <path d="M -4 -7 l 3 3 l 6 -6" />
                </>
            )}
        </g>
    );
}

// A faint VIA wordmark inside each gateway
function ViaMark({ x, y }: { x: number; y: number }) {
    const w = 64;
    const h = 15;
    return (
        <g opacity={0.22}>
            <image href={logoBlack} x={x - w / 2} y={y - h / 2} width={w} height={h} className="dark:hidden" />
            <image href={logoWhite} x={x - w / 2} y={y - h / 2} width={w} height={h} className="hidden dark:inline" />
        </g>
    );
}

// On phones and tablets each step's picture zooms into the part of the scene it is about
const CROPS: [number, number, number, number][] = [
    [0, 0, 400, 400], // send: the source chain
    [0, 92, 400, 300], // confirm: gateway and blocks
    [0, 92, 420, 300], // sign: the message at the gateway and the signers
    [210, 225, 430, 175], // deliver: the relay lane and the destination gateway
    [404, 0, 236, 330], // receive: the destination chain
];

function Stage({ step, u, j, crop }: { step: number; u: number; j: Journey; crop?: [number, number, number, number] }) {
    const d = derive(step, u, j);
    const p = PAYLOADS[j.payload];
    const toMidnight = j.to === 'midnight';
    const dotFor = (k: number): Pt => (d.slots[k] === 'via' ? VIA_DOTS[k] : d.slots[k] === 'chain' ? CHAIN_DOT : PROJECT_DOT);
    const cardLeft = d.card[0] - CARD_W / 2;
    const cardTop = d.card[1] - CARD_H / 2;
    const cardDot = (k: number): Pt => [cardLeft + 18 + k * 16, cardTop + 48];
    const relayer: Pt = step < 3 ? [262, 318] : step === 3 ? [d.card[0], d.card[1] + 44] : [378, 318];

    // Blocks on the source chain: two older blocks, the message's block, then the confirmations
    const srcBlocks: ('old' | 'msg' | 'conf')[] = ['old', 'old', ...(d.sent ? ['msg' as const] : []), ...Array.from({ length: d.confirmations }, () => 'conf' as const)];
    const srcShown = srcBlocks.slice(-7);
    const dstBlocks: ('old' | 'msg')[] = ['old', 'old', 'old', ...(d.receive > 0.3 ? ['msg' as const] : [])];

    const status =
        step === 0
            ? u < 0.38
                ? 'Your contract creates the message'
                : 'Calling the VIA gateway'
            : step === 1
              ? `Waiting for confirmations: ${d.confirmations} of ${j.blocks}`
              : step === 2
                ? `Collecting signatures: ${d.signed} of ${d.n}`
                : step === 3
                  ? !d.arrived
                      ? `Relaying to ${nameOf(j.to)}`
                      : toMidnight
                        ? 'Approved relayer delivers the message'
                        : `Checking signatures: ${d.checked} of ${d.n}`
                  : d.effect > 0
                    ? `Delivered to your contract on ${nameOf(j.to)}`
                    : 'Handing the message to your contract';
    const delivered = step === 4 && d.effect > 0;

    return (
        <svg viewBox={crop ? crop.join(' ') : `0 0 ${VW} ${VH}`} className="h-auto w-full select-none" aria-hidden="true">
            {/* Chain headers */}
            {[
                { x: 20, chain: j.from, caption: 'From' },
                { x: 420, chain: j.to, caption: 'To' },
            ].map((c) => (
                <g key={c.caption}>
                    <circle cx={c.x + 22} cy={38} r={20} className={t.surface} />
                    <ChainLogo chain={c.chain} x={c.x + 22} y={38} size={24} />
                    <text x={c.x + 52} y={33} className={`${t.muted} text-[11px] font-medium`}>
                        {c.caption}
                    </text>
                    <text x={c.x + 52} y={50} className={`${t.ink} text-[15px] font-semibold`}>
                        {nameOf(c.chain)}
                    </text>
                </g>
            ))}

            {/* Contracts and gateways on each chain */}
            <Slot x={20} y={98} w={200} h={80} label={`Your contract · ${p.role}`} lit={step === 0 && u < 0.4} />
            <Slot x={420} y={98} w={200} h={80} label={`Your contract · ${p.role}`} lit={delivered} />
            <Slot x={20} y={242} w={200} h={80} label="VIA gateway" lit={step === 1 || step === 2} />
            <Slot x={420} y={242} w={200} h={80} label="VIA gateway" lit={step === 3 && d.arrived} />
            <path d="M 120 178 V 242" strokeWidth={1.5} strokeDasharray="3 5" className={t.wire} />
            <path d="M 520 178 V 242" strokeWidth={1.5} strokeDasharray="3 5" className={t.wire} />

            {/* The relay lane between the gateways, lit behind the message as it travels */}
            <path d="M 220 282 H 420" strokeWidth={1.5} strokeDasharray="3 5" className={t.wire} />
            <defs>
                <linearGradient id="journey-lane" x1="220" y1="0" x2="420" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#00E5E5" />
                    <stop offset="1" stopColor="#FF00FF" />
                </linearGradient>
            </defs>
            {step >= 3 && (
                <path d={`M 220 282 H ${step > 3 ? 420 : Math.max(220, Math.min(420, d.card[0] - CARD_W / 2))}`} strokeWidth={2.5} strokeLinecap="round" stroke="url(#journey-lane)" />
            )}

            {/* Signers */}
            <rect x={236} y={98} width={168} height={126} rx={14} className={t.surface} />
            <text x={252} y={122} className={`${t.ink} text-[12px] font-semibold`}>
                Signers
            </text>
            {[
                { label: 'VIA Layer', y: 150, on: true },
                { label: 'Chain Layer', y: 178, on: j.chainLayer },
                { label: 'Project Layer', y: 206, on: j.projectLayer },
            ].map((row) => (
                <g key={row.label} opacity={row.on ? 1 : 0.4}>
                    <text x={252} y={row.y + 4} className={`${t.body} text-[11px] font-medium`}>
                        {row.label}
                    </text>
                    {!row.on && (
                        <text x={384} y={row.y + 4} textAnchor="end" className={`${t.muted} text-[11px] font-medium`}>
                            Off
                        </text>
                    )}
                </g>
            ))}
            {VIA_DOTS.map(([x, y], k) => {
                // Two of the three VIA signers sign; the third dot stays open
                const s = k < 2 ? (d.stamps[k] ?? 0) : 0;
                const listening = step === 2 && k < 2 && s === 0;
                return <circle key={k} cx={x} cy={y} r={5} strokeWidth={1.5} className={`${s > 0 ? `${t.accentFill} ${t.accentStroke}` : 'fill-transparent stroke-slate-300 dark:stroke-white/20'} ${listening ? 'journey-blink' : ''}`} />;
            })}
            {j.chainLayer && <circle cx={CHAIN_DOT[0]} cy={CHAIN_DOT[1]} r={5} strokeWidth={1.5} className={(d.stamps[d.slots.indexOf('chain')] ?? 0) > 0 ? `${t.accentFill} ${t.accentStroke}` : 'fill-transparent stroke-slate-300 dark:stroke-white/20'} />}
            {j.projectLayer && <circle cx={PROJECT_DOT[0]} cy={PROJECT_DOT[1]} r={5} strokeWidth={1.5} className={(d.stamps[d.slots.indexOf('project')] ?? 0) > 0 ? `${t.accentFill} ${t.accentStroke}` : 'fill-transparent stroke-slate-300 dark:stroke-white/20'} />}

            {/* Signatures on their way to the message */}
            {step === 2 &&
                d.slots.map((_, k) => {
                    const s = d.stamps[k];
                    if (s <= 0 || s >= 1) return null;
                    const from = dotFor(k);
                    const to = cardDot(k);
                    const at = mix(from, to, ease(s));
                    return (
                        <g key={k}>
                            <path d={`M ${from[0]} ${from[1]} L ${to[0]} ${to[1]}`} strokeWidth={1} className="stroke-cyan-500/30 dark:stroke-via-teal/30" />
                            <circle cx={at[0]} cy={at[1]} r={8} className="fill-cyan-400/25 dark:fill-via-teal/20" />
                            <circle cx={at[0]} cy={at[1]} r={3.5} className={t.accentFill} />
                        </g>
                    );
                })}

            {/* Blocks on each chain */}
            {srcShown.map((b, i) => (
                <rect key={`s${srcBlocks.length - srcShown.length + i}`} x={30 + i * 26} y={342} width={21} height={17} rx={4} className={b === 'msg' ? t.accentFill : b === 'conf' ? 'fill-slate-300 dark:fill-white/25' : 'fill-slate-200 dark:fill-white/10'} />
            ))}
            <text x={30} y={384} className={`${t.muted} text-[11px] font-medium`}>
                {step >= 1 ? `${d.confirmations} of ${j.blocks} confirmations` : 'Blocks'}
            </text>
            {dstBlocks.map((b, i) => (
                <rect key={`d${i}`} x={430 + i * 26} y={342} width={21} height={17} rx={4} className={b === 'msg' ? 'fill-[#3fcf8e]' : 'fill-slate-200 dark:fill-white/10'} />
            ))}
            <text x={430} y={384} className={`${t.muted} text-[11px] font-medium`}>
                {d.receive > 0.3 ? 'Delivered in the latest block' : 'Blocks'}
            </text>

            {/* What each slot holds while the message is elsewhere */}
            {(step > 0 || u > 0.55) && <RoleGlyph payload={j.payload} x={SRC_C[0]} y={SRC_C[1]} />}
            {(step < 4 || d.receive < 0.45) && <RoleGlyph payload={j.payload} x={DST_C[0]} y={DST_C[1]} />}
            {!(step === 1 || step === 2 || (step === 0 && u > 0.9) || (step === 3 && u < 0.12)) && <ViaMark x={SRC_G[0]} y={SRC_G[1]} />}
            {!(step === 3 && u > 0.62) && !(step === 4 && u < 0.3) && <ViaMark x={DST_G[0]} y={DST_G[1]} />}

            {/* The relayer */}
            <g transform={`translate(${relayer[0]} ${relayer[1]})`} opacity={step > 3 ? 0.5 : 1}>
                <g className={step === 3 ? '' : 'journey-bob'}>
                    <rect x={-34} y={-11} width={68} height={22} rx={11} className={step === 3 ? 'fill-ink-900 dark:fill-white' : t.surface} strokeWidth={1} />
                    <text y={4} textAnchor="middle" className={`${step === 3 ? 'fill-white dark:fill-ink-900' : t.body} text-[11px] font-semibold`}>
                        Relayer
                    </text>
                </g>
            </g>

            {/* The destination gateway's check */}
            {step >= 3 && d.arrived && (
                <text x={608} y={236} textAnchor="end" className="fill-emerald-600 text-[11px] font-semibold dark:fill-[#3fcf8e]">
                    {toMidnight ? 'Approved relayer' : d.checked === d.n ? 'Signatures checked' : ''}
                </text>
            )}

            {/* What the destination contract does with the message */}
            {step === 4 && d.effect > 0 && (
                <g opacity={d.effect}>
                    <text x={440} y={128} className={`${t.muted} text-[11px] font-medium`}>
                        {p.readout}
                    </text>
                    <text x={440} y={158} className={`${t.ink} text-[24px] font-semibold`}>
                        {j.payload === 'tokens' ? `${Math.round(100 * ease(d.effect))} tokens` : j.payload === 'data' ? '21.4 °C' : d.effect > 0.5 ? '42' : '41'}
                    </text>
                    <circle cx={520} cy={138} r={40 + 50 * d.effect} fill="none" strokeWidth={2} opacity={1 - d.effect} className="stroke-[#3fcf8e]" />
                    {/* A small burst in the brand colors as the message lands */}
                    {d.effect < 0.7 &&
                        Array.from({ length: 10 }, (_, k) => {
                            const a = (k / 10) * Math.PI * 2 + 0.3;
                            const e = d.effect / 0.7;
                            const r = 46 + 70 * ease(e);
                            return <circle key={k} cx={520 + Math.cos(a) * r * 1.4} cy={138 + Math.sin(a) * r * 0.75} r={3.2 * (1 - e)} fill={['#00E5E5', '#FF00FF', '#3fcf8e'][k % 3]} />;
                        })}
                </g>
            )}

            {/* The message */}
            {(step > 0 || u > 0) && d.cardAlpha > 0 && (
                <g opacity={d.cardAlpha} transform={`translate(${d.card[0]} ${d.card[1]}) scale(${d.cardScale}) translate(${-d.card[0]} ${-d.card[1]})`}>
                    <rect x={cardLeft} y={cardTop} width={CARD_W} height={CARD_H} rx={12} strokeWidth={1.5} className={`fill-white dark:fill-ink-700 ${t.accentStroke}`} style={{ filter: 'drop-shadow(0 8px 18px rgba(15,23,42,0.18))' }} />
                    <text x={cardLeft + 14} y={cardTop + 21} className={`${t.ink} text-[13px] font-semibold`}>
                        {p.card}
                    </text>
                    <text x={cardLeft + 14} y={cardTop + 36} className={`${t.muted} text-[10px] font-medium`}>
                        {nameOf(j.from)} to {nameOf(j.to)}
                    </text>
                    {d.slots.map((_, k) => {
                        const [x, y] = cardDot(k);
                        const landed = d.stamps[k] >= 1;
                        const ok = !toMidnight && d.checks[k];
                        return ok ? (
                            <g key={k}>
                                <circle cx={x} cy={y} r={6} className="fill-[#3fcf8e]" />
                                <path d={`M ${x - 2.8} ${y} l 2 2 l 3.6 -4`} fill="none" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="stroke-white" />
                            </g>
                        ) : (
                            <circle key={k} cx={x} cy={y} r={5} strokeWidth={1.5} className={landed ? `${t.accentFill} ${t.accentStroke}` : 'fill-transparent stroke-slate-300 dark:stroke-white/25'} />
                        );
                    })}
                </g>
            )}

            {/* Status bar */}
            <rect x={20} y={470} width={600} height={48} rx={14} className={t.surface} />
            <circle cx={42} cy={494} r={5} className={delivered ? 'fill-[#3fcf8e]' : 'fill-[#e7b84a] journey-blink'} />
            <text x={56} y={498} className={`${t.ink} text-[13px] font-semibold`}>
                {status}
            </text>
            {STEPS.map((_, i) => (
                <rect key={i} x={484 + i * 26} y={491} width={20} height={6} rx={3} className={i < step || (i === step && u > 0.95) ? t.accentFill : i === step ? 'fill-cyan-300/60 dark:fill-via-teal/40' : 'fill-slate-200 dark:fill-white/10'} />
            ))}
        </svg>
    );
}

// --- Controls ---
const pill = 'rounded-full px-3 py-1.5 text-sm font-medium transition-colors';
function Segmented<T extends string | number>({ label, value, options, onChange }: { label: string; value: T; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
    return (
        <div role="group" aria-label={label} className="inline-flex rounded-full border border-slate-200 bg-white p-0.5 dark:border-white/10 dark:bg-ink-800">
            {options.map((o) => (
                <button
                    key={String(o.value)}
                    type="button"
                    aria-pressed={o.value === value}
                    onClick={() => onChange(o.value)}
                    className={`${pill} ${o.value === value ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-900' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'}`}
                >
                    {o.label}
                </button>
            ))}
        </div>
    );
}

function ChainSelect({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
    return (
        <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
            {label}
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="rounded-full border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-sm font-semibold text-slate-900 dark:border-white/10 dark:bg-ink-800 dark:text-white"
            >
                {CHAINS.map((c) => (
                    <option key={c.key} value={c.key}>
                        {c.name}
                    </option>
                ))}
            </select>
        </label>
    );
}

function RouteControls({ j, set }: { j: Journey; set: (p: Partial<Journey>) => void }) {
    return (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <ChainSelect label="From" value={j.from} onChange={(v) => set(v === j.to ? { from: v, to: j.from } : { from: v })} />
            <ChainSelect label="To" value={j.to} onChange={(v) => set(v === j.from ? { to: v, from: j.to } : { to: v })} />
            <Segmented
                label="What the message carries"
                value={j.payload}
                options={(Object.keys(PAYLOADS) as Payload[]).map((k) => ({ value: k, label: PAYLOADS[k].label }))}
                onChange={(v) => set({ payload: v })}
            />
        </div>
    );
}

function LayerToggles({ j, set }: { j: Journey; set: (p: Partial<Journey>) => void }) {
    const chip = (on: boolean) =>
        `inline-flex items-center gap-1.5 ${pill} ring-1 ring-inset ${on ? 'bg-cyan-50 text-cyan-800 ring-cyan-600/25 dark:bg-via-teal/10 dark:text-via-teal dark:ring-via-teal/30' : 'bg-white text-slate-500 ring-slate-200 hover:text-slate-900 dark:bg-ink-800 dark:text-slate-400 dark:ring-white/10 dark:hover:text-white'}`;
    return (
        <div className="flex flex-wrap gap-2">
            <span className={chip(true)}>
                <Lock size={13} aria-hidden="true" /> VIA Layer
            </span>
            <button type="button" aria-pressed={j.chainLayer} onClick={() => set({ chainLayer: !j.chainLayer })} className={chip(j.chainLayer)}>
                Chain Layer
            </button>
            <button type="button" aria-pressed={j.projectLayer} onClick={() => set({ projectLayer: !j.projectLayer })} className={chip(j.projectLayer)}>
                Project Layer
            </button>
        </div>
    );
}

// --- Step text ---
function StepBody({ i, j, set }: { i: number; j: Journey; set: (p: Partial<Journey>) => void }) {
    const to = nameOf(j.to);
    switch (i) {
        case 0:
            return <p>It calls the VIA gateway on its own chain. A message can carry tokens, data, or a contract call.</p>;
        case 1:
            return (
                <>
                    <p>
                        The message waits for the number of block confirmations you set. Each new block makes the earlier ones harder to reverse,
                        so value transfers usually wait longer.
                    </p>
                    <Segmented
                        label="Confirmations to wait for"
                        value={j.blocks}
                        options={[
                            { value: 1, label: 'Wait 1 block' },
                            { value: 12, label: 'Wait 12 blocks' },
                        ]}
                        onChange={(v) => set({ blocks: v })}
                    />
                </>
            );
        case 2:
            return (
                <>
                    <p>
                        This is definable security. Signers run by VIA Labs confirm the message on the source chain, then sign it. You choose what
                        else must sign. Every active layer must sign, or the message is rejected.
                    </p>
                    <LayerToggles j={j} set={set} />
                    <Link to="/overview#security" className="link-arrow text-sm">
                        Try the full security model <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                </>
            );
        case 3:
            return j.to === 'midnight' ? (
                <p>A relayer carries the signed message to Midnight. Midnight can't check signatures on-chain yet, so only approved relayers can deliver messages there.</p>
            ) : (
                <p>A relayer carries the signed message to {to}. The gateway there checks every required signature. Relayers can't change a message.</p>
            );
        default:
            return (
                <>
                    <p>
                        Your contract acts on the message. Here, {PAYLOADS[j.payload].done}. You can look up any message on VIA Scan, from the source
                        chain to the destination.
                    </p>
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                        <a href={HELLO_WORLD} target="_blank" rel="noopener noreferrer" className="link-arrow text-sm">
                            Send your own with Hello World <ArrowRight size={15} aria-hidden="true" />
                        </a>
                        <a href={SCAN} target="_blank" rel="noopener noreferrer" className="link-arrow text-sm">
                            Open VIA Scan <ArrowUpRight size={15} aria-hidden="true" />
                        </a>
                    </div>
                </>
            );
    }
}

// --- Wide screens: the stage stays pinned while the page scrolls through the steps ---
const NAV = 72; // the fixed navigation bar
const STEP_VH = 75; // scrolling distance per step, in viewport heights

function PinnedJourney({ j, set }: { j: Journey; set: (p: Partial<Journey>) => void }) {
    const track = useRef<HTMLDivElement>(null);
    const [p, setP] = useState(0);
    useEffect(() => {
        let raf = 0;
        const measure = () => {
            raf = 0;
            const el = track.current;
            if (!el) return;
            const total = el.offsetHeight - (window.innerHeight - NAV);
            setP(clamp01((NAV - el.getBoundingClientRect().top) / Math.max(1, total)));
        };
        const onScroll = () => {
            if (!raf) raf = requestAnimationFrame(measure);
        };
        measure();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, []);

    const pos = p * STEPS.length;
    const step = Math.min(STEPS.length - 1, Math.floor(pos));
    const u = clamp01((pos - step) / 0.8); // the last fifth of each stretch holds the finished step

    const jump = (i: number) => {
        const el = track.current;
        if (!el) return;
        const total = el.offsetHeight - (window.innerHeight - NAV);
        const top = el.getBoundingClientRect().top + window.scrollY - NAV;
        window.scrollTo({ top: top + ((i + 0.82) / STEPS.length) * total, behavior: 'smooth' });
    };

    return (
        <div ref={track} className="relative" style={{ height: `calc(${100 + STEPS.length * STEP_VH}vh - ${NAV}px)` }}>
            {/* Anchored a fixed distance from the top (roughly centered for a 620 px tall stage), so nothing shifts as steps open */}
            <div className="sticky" style={{ top: NAV, height: `calc(100vh - ${NAV}px)`, paddingTop: `max(24px, calc((100vh - ${NAV}px - 620px) / 2))` }}>
                {/* Both columns hang from the top, so opening a step never shifts the list */}
                <div className="container-x grid w-full grid-cols-12 items-start gap-10">
                    <div className="col-span-5">
                        <RouteControls j={j} set={set} />
                        <ol className="mt-8 border-t hairline [@media(max-height:760px)]:mt-5">
                            {STEPS.map((key, i) => {
                                const active = i === step;
                                return (
                                    <li key={key} className="border-b hairline">
                                        <button type="button" onClick={() => jump(i)} className="grid w-full grid-cols-[2rem_1fr] items-baseline py-3.5 text-left [@media(max-height:760px)]:py-2">
                                            <span className={`text-sm font-semibold tabular-nums ${active ? 'text-cyan-700 dark:text-via-teal' : 'text-slate-400 dark:text-slate-500'}`}>{i + 1}</span>
                                            <h3 className={`font-semibold transition-colors ${active ? 'text-lg text-slate-900 dark:text-white' : 'text-base text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300'}`}>
                                                {TITLES[i]}
                                            </h3>
                                        </button>
                                        <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${active ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                                            <div className="overflow-hidden">
                                                <div className="space-y-4 pb-5 pl-8 text-body [@media(max-height:760px)]:space-y-3 [@media(max-height:760px)]:pb-3 [@media(max-height:760px)]:text-[15px] [@media(max-height:760px)]:leading-snug">
                                                    <StepBody i={i} j={j} set={set} />
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ol>
                        <p className={`mt-5 flex items-center gap-2 text-sm text-muted transition-opacity duration-500 [@media(max-height:760px)]:hidden ${p < 0.04 ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true">
                            <MousePointer2 size={15} /> Scroll to move the message
                        </p>
                    </div>
                    <div className="col-span-7">
                        {/* On short screens the stage shrinks so it always fits under the navigation */}
                        <div className="panel mx-auto" style={{ maxWidth: `calc((100vh - ${NAV}px - 64px) * ${(VW / VH).toFixed(3)})` }}>
                            <div className="card p-4">
                                <Stage step={step} u={u} j={j} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Phones, tablets, and reduced motion: steps stacked, each with its own picture ---
function PlayOnView({ step, j }: { step: number; j: Journey }) {
    const ref = useRef<HTMLDivElement>(null);
    const [u, setU] = useState(1); // the server shows each step finished
    useEffect(() => {
        const el = ref.current;
        if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        let raf = 0;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                cancelAnimationFrame(raf);
                const start = performance.now();
                const tick = (now: number) => {
                    const k = clamp01((now - start) / 2800);
                    setU(k);
                    if (k < 1) raf = requestAnimationFrame(tick);
                };
                raf = requestAnimationFrame(tick);
            },
            { threshold: 0.6 },
        );
        io.observe(el);
        return () => {
            io.disconnect();
            cancelAnimationFrame(raf);
        };
    }, []);
    return (
        <div ref={ref} className="card p-3">
            <Stage step={step} u={u} j={j} crop={CROPS[step]} />
        </div>
    );
}

function StackedJourney({ j, set }: { j: Journey; set: (p: Partial<Journey>) => void }) {
    return (
        <div className="container-x pb-20 md:pb-28">
            <RouteControls j={j} set={set} />
            <ol className="mt-10 space-y-14">
                {STEPS.map((key, i) => (
                    <li key={key} className="grid gap-6 md:grid-cols-2 md:items-center md:gap-10">
                        <div>
                            <p className="text-sm font-semibold tabular-nums text-cyan-700 dark:text-via-teal">{i + 1}</p>
                            <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">{TITLES[i]}</h3>
                            <div className="mt-3 space-y-4 text-body">
                                <StepBody i={i} j={j} set={set} />
                            </div>
                        </div>
                        <PlayOnView step={i} j={j} />
                    </li>
                ))}
            </ol>
        </div>
    );
}

export function MessageJourney() {
    const [j, setJ] = useState<Journey>({ from: '17000', to: 'cardano', payload: 'tokens', blocks: 12, chainLayer: false, projectLayer: true });
    const set = (patch: Partial<Journey>) => setJ((cur) => ({ ...cur, ...patch }));
    return (
        <section id="how-it-works" className="scroll-mt-24 border-y hairline bg-white dark:bg-ink-900">
            <div className="container-x pb-10 pt-20 md:pt-28" data-reveal>
                <h2 className="h-section">How it works</h2>
                <p className="mt-5 max-w-2xl text-lg text-body md:text-xl">
                    Follow one message across the VIA network. Pick a route and what it carries, then scroll to move it along.
                </p>
            </div>
            <div className="hidden lg:block lg:motion-reduce:hidden">
                <PinnedJourney j={j} set={set} />
            </div>
            <div className="lg:hidden lg:motion-reduce:block">
                <StackedJourney j={j} set={set} />
            </div>
        </section>
    );
}
