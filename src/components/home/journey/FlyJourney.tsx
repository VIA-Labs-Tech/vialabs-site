import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Check } from 'lucide-react';
import { chainLogo } from '../../../chains';
import { BLOCKS, FROM, LAYERS, NAV, ProgressRail, STEP_VH, STEPS, ScrollCue, StackedSteps, StepText, TO, clamp01, ease, easeOutBack, lerp, span, useTrackProgress } from './shared';

// "How it works": a camera flies through a small 3D world and follows one message from Ethereum to
// Cardano, one stop per step. The stops stand on a floor at growing depth, so a passed stop slides out
// past the camera while the next one comes into focus. Like a camera lens, whatever sits nearer or
// farther than the stop in focus blurs and dims. The world is always dark, like a film.
// The floor and the route are drawn on a canvas; the stops, the message, and the words are HTML, so
// text stays sharp. Phones, tablets, and reduced motion get the steps stacked, each with a still.

type V3 = [number, number, number];
interface Cam {
    x: number;
    y: number;
    z: number;
    pitch: number; // how far the camera looks down, in radians
    focus: number; // the distance that is sharp
    dof: number; // how strongly things away from the focus blur, 0 to 1
}
interface Proj {
    x: number; // screen position, in pixels
    y: number;
    d: number; // depth in front of the camera
    s: number; // screen pixels per world unit at that depth
}

// World units are about one CSS pixel at the focus distance on a screen 900 px tall.
// x runs right, y up, and z into the screen.
const S1: V3 = [-260, 0, 0]; // Ethereum
const S2: V3 = [260, 0, 1000]; // block confirmations
const S3: V3 = [-260, 0, 2000]; // signers
const S4: V3 = [260, 0, 3400]; // Cardano
const DIST = 980; // how far behind a stop the camera sits
const SIDE = 170; // stops sit right of center, so the words on the left stay clear
const PITCH = 0.14; // how far the camera looks down at a stop
const WIDE: Cam = { x: 0, y: 1500, z: -1600, pitch: 0.46, focus: 4500, dof: 0 };
const RING_R = [160, 193, 226]; // signer rings, one per security layer; the message card fits inside the first

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mix3 = (a: V3, b: V3, k: number): V3 => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];

// --- The message's path: one smooth curve through the stops, at about the height of the message,
// so it never dips to the floor or doubles back. It passes above the cards, so it never covers their words.
const KEYS: V3[] = [
    add(S1, [-135, 300, 0]), // out of your contract
    add(S1, [135, 300, 0]), // at the gateway
    add(S2, [-215, 240, 0]), // waiting beside the blocks
    add(S3, [0, 260, 0]), // inside the signer rings
    [(S3[0] + S4[0] - 135) / 2, 470, (S3[2] + S4[2]) / 2], // the relayer's arc between the chains
    add(S4, [-135, 300, 0]), // at the gateway on Cardano
    add(S4, [135, 300, 0]), // into your contract there
];
// A centripetal Catmull-Rom curve passes through every key point with no kinks, loops, or overshoot
const catmull = (p0: V3, p1: V3, p2: V3, p3: V3, t: number): V3 => {
    const gap = (a: V3, b: V3) => Math.max(1e-3, Math.sqrt(Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2])));
    const t1 = gap(p0, p1), t2 = t1 + gap(p1, p2), t3 = t2 + gap(p2, p3);
    const u = t1 + (t2 - t1) * t;
    const m = (a: V3, b: V3, ta: number, tb: number) => mix3(a, b, (u - ta) / (tb - ta));
    const a1 = m(p0, p1, 0, t1), a2 = m(p1, p2, t1, t2), a3 = m(p2, p3, t2, t3);
    const b1 = m(a1, a2, 0, t2), b2 = m(a2, a3, t1, t3);
    return m(b1, b2, t1, t2);
};
const PATH: V3[] = [];
const KEY_AT: number[] = []; // where each key point sits in PATH
KEYS.forEach((k, i) => {
    KEY_AT.push(PATH.length);
    if (i === KEYS.length - 1) return PATH.push(k);
    const prev = i > 0 ? KEYS[i - 1] : mix3(k, KEYS[i + 1], -1);
    const next = KEYS[i + 1];
    const after = i + 2 < KEYS.length ? KEYS[i + 2] : mix3(next, k, -1);
    for (let j = 0; j < 28; j++) PATH.push(catmull(prev, k, next, after, j / 28));
});
const LEN = PATH.reduce<number[]>((acc, p, i) => {
    const q = PATH[i - 1];
    acc.push(i === 0 ? 0 : acc[i - 1] + Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]));
    return acc;
}, []);
const K = KEY_AT.map((i) => LEN[i]); // each key point, as a distance along the path
// Where the message rests at the end of each step
const MARKS = [K[1], K[2], K[3], K[5], K[6]];
const pointAt = (g: number): V3 => {
    let i = 1;
    while (i < LEN.length - 1 && LEN[i] < g) i++;
    return mix3(PATH[i - 1], PATH[i], clamp01((g - LEN[i - 1]) / Math.max(1e-6, LEN[i] - LEN[i - 1])));
};

// --- Everything the world shows at progress P, from 0 to 5 (one unit per step) ---
function worldAt(P: number) {
    const u = STEPS.map((_, i) => span(P, i, i + 0.9)); // each step holds its finished picture for the last tenth
    let g = lerp(K[0], K[1], ease(span(u[0], 0.45, 0.9)));
    if (P >= 1) g = lerp(K[1], K[2], ease(span(u[1], 0, 0.3)));
    if (P >= 2) g = lerp(K[2], K[3], ease(span(u[2], 0, 0.3)));
    if (P >= 3) g = lerp(K[3], K[5], ease(span(u[3], 0, 0.82)));
    if (P >= 4) g = lerp(K[5], K[6], ease(span(u[4], 0, 0.3)));
    // At the end it sinks into your contract on Cardano
    const sink = P >= 4 ? ease(span(u[4], 0.3, 0.45)) : 0;
    const pos = pointAt(g);
    pos[1] -= sink * 100;
    return {
        u,
        g,
        pos,
        alpha: span(u[0], 0.05, 0.3) * (1 - sink),
        grow: easeOutBack(span(u[0], 0.05, 0.4)),
        confirmations: P < 1 ? 0 : Math.round(span(u[1], 0.3, 0.95) * BLOCKS),
        signed: LAYERS.map((_, k) => (P < 2 ? 0 : span(u[2], 0.42 + 0.17 * k, 0.52 + 0.17 * k))),
        checked: LAYERS.map((_, k) => P >= 3 && u[3] >= 0.86 + 0.04 * k),
        relayer: P >= 3 && P < 4 ? Math.min(span(u[3], 0.16, 0.26), 1 - span(u[3], 0.66, 0.74)) : 0, // once clear of the rings
        leaving: P >= 3 ? span(u[3], 0.02, 0.25) : 0, // the signers step back once the message leaves
        balance: P < 4 ? 0 : Math.round(100 * ease(span(u[4], 0.35, 0.8))),
        burst: P < 4 ? 0 : span(u[4], 0.35, 0.95),
        route: span(P, 4.75, 5),
    };
}
type World = ReturnType<typeof worldAt>;

// --- Camera ---
const F1 = add(S1, [0, 260, 0]);
const F2 = add(S2, [-110, 230, 0]);
const F3 = add(S3, [0, 260, 0]);
const F4 = add(S4, [0, 260, 0]);
const stopCam = (f: V3, side: number, dist: number): Cam => ({
    x: f[0] - side,
    y: f[1] + 120,
    z: f[2] - dist,
    pitch: PITCH,
    focus: 120 * Math.sin(PITCH) + dist * Math.cos(PITCH),
    dof: 1,
});
const mixCam = (a: Cam, b: Cam, k: number): Cam => ({
    x: lerp(a.x, b.x, k),
    y: lerp(a.y, b.y, k),
    z: lerp(a.z, b.z, k),
    pitch: lerp(a.pitch, b.pitch, k),
    focus: lerp(a.focus, b.focus, k),
    dof: lerp(a.dof, b.dof, k),
});
function flyCam(P: number, pos: V3): Cam {
    const c = (f: V3) => stopCam(f, SIDE, DIST);
    let cam = WIDE;
    let target = F1; // what the camera looks at, which the lens keeps sharp
    if (P > 3 && P < 4) {
        // While the relayer crosses, the camera follows the message
        const k1 = ease(span(P, 3, 3.15)), k2 = ease(span(P, 3.8, 4));
        cam = mixCam(mixCam(c(F3), c(pos), k1), c(F4), k2);
        target = mix3(mix3(F3, pos, k1), F4, k2);
    } else {
        const keys: [number, Cam, V3][] = [[0, WIDE, F1], [0.35, c(F1), F1], [1, c(F1), F1], [1.3, c(F2), F2], [2, c(F2), F2], [2.3, c(F3), F3], [3, c(F3), F3], [4, c(F4), F4], [4.75, c(F4), F4], [5, WIDE, F4]];
        for (let i = 1; i < keys.length; i++) {
            const [pa, a, ta] = keys[i - 1];
            const [pb, b, tb] = keys[i];
            if (P <= pb) {
                const k = ease(clamp01((P - pa) / (pb - pa)));
                cam = mixCam(a, b, k);
                target = mix3(ta, tb, k);
                break;
            }
        }
    }
    const dy = target[1] - cam.y, dz = target[2] - cam.z;
    return { ...cam, focus: -dy * Math.sin(cam.pitch) + dz * Math.cos(cam.pitch) };
}
// A still frames its stop in the middle, close enough to fill the box. The signers' labels stand right
// of the rings, so that still centers the rings and labels together.
function stillCam(step: number, W: number, H: number): Cam {
    const f = [F1, F2, F3, F4, F4][step];
    const lens = H * 1.05;
    return stopCam(f, step === 2 ? -80 : 0, Math.max((640 * lens) / (0.94 * W), (600 * lens) / (0.92 * H)));
}

function projector(cam: Cam, W: number, H: number) {
    const F = H * 1.05;
    const sp = Math.sin(cam.pitch), cp = Math.cos(cam.pitch);
    return (p: V3): Proj => {
        const x = p[0] - cam.x, y = p[1] - cam.y, z = p[2] - cam.z;
        const yc = y * cp + z * sp;
        const d = -y * sp + z * cp;
        const q = Math.max(d, 1);
        return { x: W / 2 + (F * x) / q, y: H / 2 - (F * yc) / q, d, s: F / q };
    };
}

// Places an HTML element in the world, facing the viewer squarely like a sign, so its words never slant.
// Anchored at its bottom center, or its center. It blurs and dims away from the focus.
function placed(v: Proj, cam: Cam, anchor: 'bottom' | 'center' = 'bottom', lift = 0): CSSProperties {
    if (v.d < 120) return { display: 'none' };
    const blur = cam.dof * Math.min(12, v.d < cam.focus ? (cam.focus - v.d) / 70 : (v.d - cam.focus) / 115);
    const fog = clamp01(1 - (v.d - cam.focus - 1200) / 2400);
    const near = clamp01((v.d - 150) / 400);
    return {
        transform: `translate(${v.x.toFixed(1)}px, ${v.y.toFixed(1)}px) scale(${v.s.toFixed(4)}) translate(-50%, ${anchor === 'bottom' ? '-100%' : '-50%'})`,
        filter: blur > 0.35 ? `blur(${Math.min(24, blur / v.s).toFixed(1)}px)` : undefined,
        opacity: fog * near * (1 - (0.6 * Math.min(blur, 9)) / 9),
        zIndex: Math.round(30000 - v.d) + lift,
    };
}

// --- The things in the world ---
// Cyan belongs to the message and its route. Everything else is neutral: a stop in use brightens to
// white, and green means checked or done.
const card = 'rounded-2xl border bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))]';
const litCard = 'border-white/35 bg-[#171c26] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_48px_-18px_rgba(255,255,255,0.22)]';
const idleCard = 'border-white/[0.11] bg-[#10141c] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_30px_60px_-26px_rgba(0,0,0,0.95)]';

function WorldCard({ title, caption, lit, children }: { title: string; caption: ReactNode; lit: boolean; children?: ReactNode }) {
    return (
        <div className={`w-[244px] px-5 py-4 transition-colors duration-500 ${card} ${lit ? litCard : idleCard}`}>
            <div className="flex items-baseline justify-between gap-3">
                <p className="whitespace-nowrap text-[18px] font-semibold text-white">{title}</p>
                {children}
            </div>
            <p className="mt-1 whitespace-nowrap text-[14px] text-slate-400">{caption}</p>
        </div>
    );
}

function ChainBadge({ chain, name, lit }: { chain: string; name: string; lit: boolean }) {
    const logo = chainLogo(chain);
    return (
        <div className="flex flex-col items-center gap-4">
            <p className="whitespace-nowrap text-[28px] font-semibold tracking-tight text-white">{name}</p>
            <div
                className={`flex h-[116px] w-[116px] items-center justify-center rounded-full border-2 bg-[#11151e] transition-shadow duration-500 ${
                    lit ? 'border-white/50 shadow-[0_0_64px_-12px_rgba(255,255,255,0.24)]' : 'border-white/15 shadow-[0_30px_60px_-24px_rgba(0,0,0,0.9)]'
                }`}
            >
                {logo && <img src={logo.dark} alt="" draggable={false} className="h-[68px] w-[68px]" />}
            </div>
        </div>
    );
}

function Tower({ count }: { count: number }) {
    return (
        <div className="flex flex-col items-center">
            <p className="text-[30px] font-semibold tabular-nums text-white">
                {count} of {BLOCKS}
            </p>
            <div className="mt-4 flex flex-col-reverse gap-2">
                {Array.from({ length: BLOCKS }, (_, i) => (
                    <span
                        key={i}
                        className={`block h-6 w-[132px] rounded-lg border transition-colors duration-200 ${
                            i >= count
                                ? 'border-white/[0.14] bg-white/[0.03]'
                                : i === count - 1 // the newest block is the brightest
                                  ? 'border-white/80 bg-white/[0.55] shadow-[0_0_24px_-6px_rgba(255,255,255,0.35)]'
                                  : 'border-white/50 bg-white/[0.24] shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]'
                        }`}
                        style={{ opacity: i < count ? 1 - i * 0.03 : 1 }}
                    />
                ))}
            </div>
            <p className="mt-5 whitespace-nowrap text-[16px] font-medium text-slate-400">Block confirmations</p>
        </div>
    );
}

// Three rings, one per security layer. A ring brightens to white as its layer signs. The labels stand
// in a column right of the rings, each on a short line to its ring, so no ring crosses a label.
// The title is centered over the rings. The rings' center is 90 units left of the drawing's center.
const LABEL_X = RING_R[2] + 36;
function Gate({ signed, leaving }: { signed: number[]; leaving: number }) {
    return (
        <svg width={640} height={530} viewBox="-230 -300 640 530" className="overflow-visible" aria-hidden="true">
            <text y={-262} textAnchor="middle" className="fill-white text-[28px] font-semibold" opacity={1 - leaving}>
                Signers
            </text>
            {LAYERS.map((label, k) => {
                const r = RING_R[k];
                const v = signed[k];
                const y = -100 + 50 * k;
                const x = Math.sqrt(r * r - y * y);
                return (
                    <g key={label} opacity={1 - 0.6 * leaving}>
                        {v > 0 && <circle r={r} fill="none" strokeWidth={10} className="stroke-white" opacity={0.05 * v} />}
                        <circle r={r} fill="none" strokeWidth={2.5} className="stroke-white" opacity={0.16 + 0.6 * v} />
                        <g opacity={1 - leaving}>
                            <line x1={x} y1={y} x2={LABEL_X - 12} y2={y} strokeWidth={1} className="stroke-white" opacity={0.18 + 0.32 * v} />
                            <circle cx={x} cy={y} r={4.5} className="fill-white" opacity={0.35 + 0.65 * v} />
                            <text x={LABEL_X} y={y + 6} className="fill-white text-[18px] font-semibold" opacity={0.45 + 0.55 * v}>
                                {label}
                            </text>
                        </g>
                    </g>
                );
            })}
        </svg>
    );
}

function Packet({ w }: { w: World }) {
    return (
        <div className="w-[256px] rounded-2xl border-[1.5px] border-via-teal/80 bg-[#0b0f16] px-5 py-4 shadow-[0_0_44px_-16px_rgba(0,229,229,0.5),0_24px_48px_-24px_rgba(0,0,0,0.9)]">
            <p className="text-[20px] font-semibold leading-tight text-white">100 tokens</p>
            <p className="mt-1 text-[14px] text-slate-400">
                {FROM.name} to {TO.name}
            </p>
            <div className="mt-3 flex items-center gap-4 border-t border-white/10 pt-3">
                {LAYERS.map((label, k) => {
                    const v = w.signed[k];
                    const ok = w.checked[k];
                    return (
                        <span key={label} className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-400">
                            <span
                                className={`flex h-[18px] w-[18px] items-center justify-center rounded-full border ${
                                    ok ? 'border-[#3fcf8e] bg-[#3fcf8e] text-ink-900' : v > 0 ? 'border-white bg-white text-ink-900' : 'border-white/30'
                                }`}
                                style={v > 0 && !ok ? { transform: `scale(${easeOutBack(v).toFixed(3)})` } : undefined}
                            >
                                {(ok || v >= 1) && <Check size={12} strokeWidth={3.5} aria-hidden="true" />}
                            </span>
                            {label.split(' ')[0]}
                        </span>
                    );
                })}
            </div>
        </div>
    );
}

// --- Drawing on the canvases: the floor, the pads under the stops, the route, and floating dust ---
const MOTES: [number, number, number, number][] = (() => {
    let seed = 11;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    return Array.from({ length: 22 }, (_, i) => [(i % 2 ? 1 : -1) * lerp(460, 1100, rnd()) - 80, lerp(70, 680, rnd()), lerp(-700, 3900, rnd()), rnd()]);
})();

function drawFloor(ctx: CanvasRenderingContext2D, W: number, H: number, cam: Cam, pr: (p: V3) => Proj, w: World, step: number) {
    ctx.clearRect(0, 0, W, H);
    // A soft haze along the horizon
    const hy = H / 2 - H * 1.05 * Math.tan(cam.pitch);
    const band = ctx.createLinearGradient(0, hy - 140, 0, hy + 160);
    band.addColorStop(0, 'rgba(170,186,212,0)');
    band.addColorStop(0.5, 'rgba(170,186,212,0.06)');
    band.addColorStop(1, 'rgba(170,186,212,0)');
    ctx.fillStyle = band;
    ctx.fillRect(0, hy - 140, W, 300);

    // The floor grid, faded with distance and grouped by fade level so each level strokes once
    const GRID = 160;
    const levels: number[][] = Array.from({ length: 12 }, () => []);
    const seg = (a: V3, b: V3) => {
        const p = pr(a), q = pr(b);
        if (p.d < 60 || q.d < 60) return;
        if ((p.x < 0 && q.x < 0) || (p.x > W && q.x > W) || (p.y > H && q.y > H) || (p.y < 0 && q.y < 0)) return;
        const k = Math.round(11 * clamp01(1 - ((p.d + q.d) / 2 - 300) / 7200));
        if (k > 0) levels[k].push(p.x, p.y, q.x, q.y);
    };
    const x0 = Math.floor((cam.x - 4200) / GRID) * GRID, x1 = cam.x + 4200;
    const z0 = Math.ceil((cam.z + 120) / GRID) * GRID, z1 = cam.z + 9000;
    for (let x = x0; x <= x1; x += GRID) for (let z = z0; z < z1; z += GRID * 2) seg([x, 0, z], [x, 0, Math.min(z1, z + GRID * 2)]);
    for (let z = z0; z <= z1; z += GRID) for (let x = x0; x < x1; x += GRID * 4) seg([x, 0, z], [x + GRID * 4, 0, z]);
    ctx.strokeStyle = 'rgb(150,166,194)';
    ctx.lineWidth = 1;
    levels.forEach((list, k) => {
        if (!list.length) return;
        ctx.globalAlpha = 0.012 * k;
        ctx.beginPath();
        for (let i = 0; i < list.length; i += 4) {
            ctx.moveTo(list[i], list[i + 1]);
            ctx.lineTo(list[i + 2], list[i + 3]);
        }
        ctx.stroke();
    });

    // A pool of light on the floor under each stop, brighter under the stop in focus
    [S1, S2, S3, S4].forEach((c, i) => {
        const on = i === (step >= 3 ? step - 1 : step) && !(step === 3 && w.u[3] < 0.8);
        const mid = pr(c), side = pr(add(c, [230, 0, 0])), front = pr(add(c, [0, 0, -230])), back = pr(add(c, [0, 0, 230]));
        if (front.d < 60) return;
        const rx = Math.abs(side.x - mid.x), ry = Math.max(2, (front.y - back.y) / 2);
        const dim = clamp01(1 - (mid.d - cam.focus - 1200) / 2400);
        ctx.save();
        ctx.globalAlpha = dim;
        ctx.translate(mid.x, (front.y + back.y) / 2);
        ctx.scale(1, ry / rx);
        const pool = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
        pool.addColorStop(0, on ? 'rgba(200,214,238,0.1)' : 'rgba(200,214,238,0.035)');
        pool.addColorStop(0.6, on ? 'rgba(200,214,238,0.035)' : 'rgba(200,214,238,0.012)');
        pool.addColorStop(1, 'rgba(200,214,238,0)');
        ctx.fillStyle = pool;
        ctx.fillRect(-rx, -rx, 2 * rx, 2 * rx);
        ctx.restore();
    });

    // The route, drawn as soft light: the one cyan thing on the floor. Its faint shadow runs along the
    // floor. Ahead of the message it is a line of fine points (the whole route in the opening shot);
    // behind it, a thin filament that brightens toward the message.
    const end = LEN[LEN.length - 1];
    const covered = w.route > 0 ? end : w.g;
    const STEP = 22;
    const fadeAt = (v: Proj) => clamp01(1 - (v.d - cam.focus - 1200) / 2400);
    ctx.globalAlpha = 1;
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgba(200,214,238,0.05)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    let open = false;
    for (const q of PATH) {
        const v = pr([q[0], 0, q[2]]);
        if (v.d < 60) {
            open = false;
            continue;
        }
        if (open) ctx.lineTo(v.x, v.y);
        else ctx.moveTo(v.x, v.y);
        open = true;
    }
    ctx.stroke();

    const opening = cam.dof < 0.5 && w.route === 0;
    const ahead = opening ? end : MARKS.find((m) => m > w.g + 1) ?? end;
    ctx.fillStyle = 'rgb(165,238,242)';
    for (let g = opening ? 0 : covered + STEP; g < ahead; g += STEP) {
        const v = pr(pointAt(g));
        if (v.d < 60) continue;
        ctx.globalAlpha = 0.55 * fadeAt(v);
        ctx.beginPath();
        ctx.arc(v.x, v.y, Math.max(0.7, 1.6 * v.s), 0, Math.PI * 2);
        ctx.fill();
    }

    if (covered > K[0] + 1) {
        // Points along the covered trail
        const trail: { p: Proj; g: number }[] = [];
        for (let g = 0; ; g = Math.min(covered, g + STEP)) {
            trail.push({ p: pr(pointAt(g)), g });
            if (g >= covered) break;
        }
        // Where the trail passes close to the camera it fades out, in a few steps, instead of ending
        // abruptly. Each step strokes once.
        const FADES = 6;
        const thread = (from: number, width: number, alpha: number, color: string) => {
            ctx.strokeStyle = color;
            ctx.lineWidth = width;
            for (let f = 1; f <= FADES; f++) {
                ctx.globalAlpha = (alpha * f) / FADES;
                ctx.beginPath();
                let on = false;
                for (let i = 1; i < trail.length; i++) {
                    const a = trail[i - 1], b = trail[i];
                    if (a.g < from || Math.ceil(FADES * clamp01((Math.min(a.p.d, b.p.d) - 350) / 600)) !== f) {
                        on = false;
                        continue;
                    }
                    if (!on) ctx.moveTo(a.p.x, a.p.y);
                    ctx.lineTo(b.p.x, b.p.y);
                    on = true;
                }
                ctx.stroke();
            }
        };
        const near = w.route > 0 ? 0 : Math.max(0, covered - 900); // the stretch just behind the message
        thread(0, 10, 0.04, 'rgb(0,229,229)');
        thread(near, 6, 0.055, 'rgb(0,229,229)');
        thread(0, 1.4, 0.3, 'rgb(212,248,250)');
        thread(near, 1.6, 0.55, 'rgb(228,252,253)');
    }
    ctx.globalAlpha = 1;

    // The message's shadow on the floor
    const shadow = pr([w.pos[0], 0, w.pos[2]]);
    if (w.alpha > 0 && shadow.d > 60) {
        const r = 150 * shadow.s;
        ctx.save();
        ctx.globalAlpha = w.alpha;
        ctx.translate(shadow.x, shadow.y);
        ctx.scale(1, 0.3);
        const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
        glow.addColorStop(0, 'rgba(0,229,229,0.12)');
        glow.addColorStop(1, 'rgba(0,229,229,0)');
        ctx.fillStyle = glow;
        ctx.fillRect(-r, -r, 2 * r, 2 * r);
        ctx.restore();
    }
    ctx.globalAlpha = 1;
}

function drawDust(ctx: CanvasRenderingContext2D, W: number, H: number, cam: Cam, pr: (p: V3) => Proj, w: World, still: boolean) {
    ctx.clearRect(0, 0, W, H);
    // Soft specks of light drift past the camera; they sit in front of the stops, so they add depth
    if (!still && cam.dof > 0.2) {
        for (const [x, y, z, k] of MOTES) {
            const v = pr([x, y, z]);
            if (v.d < 140 || v.d > 2400) continue;
            const r = v.s * (10 + 18 * k);
            const a = 0.14 * cam.dof * clamp01((v.d - 140) / 300) * clamp01(1 - v.d / 2400);
            const g = ctx.createRadialGradient(v.x, v.y, 0, v.x, v.y, r);
            g.addColorStop(0, k > 0.85 ? `rgba(255,0,255,${0.6 * a})` : `rgba(214,224,242,${a})`);
            g.addColorStop(1, 'rgba(214,224,242,0)');
            ctx.fillStyle = g;
            ctx.fillRect(v.x - r, v.y - r, 2 * r, 2 * r);
        }
    }
    // A burst as the tokens reach your contract on Cardano
    if (w.burst > 0 && w.burst < 1) {
        const c = pr(add(S4, [135, 160, 0]));
        if (c.d > 60) {
            const e = ease(w.burst);
            ctx.globalAlpha = 1 - w.burst;
            ctx.strokeStyle = '#3fcf8e';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.ellipse(c.x, c.y, (80 + 180 * e) * c.s, (40 + 90 * e) * c.s, 0, 0, Math.PI * 2);
            ctx.stroke();
            for (let n = 0; n < 14; n++) {
                const a = (n / 14) * Math.PI * 2;
                const r = (120 + 200 * e) * c.s;
                ctx.fillStyle = n % 2 ? '#3fcf8e' : '#ffffff';
                ctx.beginPath();
                ctx.arc(c.x + Math.cos(a) * r, c.y + Math.sin(a) * r * 0.55, 5 * c.s * (1 - w.burst) + 1, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        }
    }
}

// The server has no layout step
const useBeforePaint = typeof window === 'undefined' ? useEffect : useLayoutEffect;

// --- The scene: a still, or the pinned stage driven by scroll ---
function FlyScene({ P, still }: { P: number; still?: boolean }) {
    const box = useRef<HTMLDivElement>(null);
    const floor = useRef<HTMLCanvasElement>(null);
    const dust = useRef<HTMLCanvasElement>(null);
    const [size, setSize] = useState({ W: 1440, H: 828 });
    useBeforePaint(() => {
        const el = box.current;
        if (!el) return;
        const measure = () => {
            const r = el.getBoundingClientRect();
            setSize((cur) => (Math.abs(cur.W - r.width) < 1 && Math.abs(cur.H - r.height) < 1 ? cur : { W: r.width, H: r.height }));
        };
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);
    const { W, H } = size;
    const ready = W > 10 && H > 10;
    const w = worldAt(P);
    const step = Math.min(STEPS.length - 1, Math.floor(P));
    const cam = still ? stillCam(step, W, H) : flyCam(P, w.pos);
    const pr = projector(cam, W, H);

    useBeforePaint(() => {
        if (!ready) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const paint = (canvas: HTMLCanvasElement | null, draw: (c: CanvasRenderingContext2D) => void) => {
            const ctx = canvas?.getContext('2d');
            if (!canvas || !ctx) return;
            if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(H * dpr)) {
                canvas.width = Math.round(W * dpr);
                canvas.height = Math.round(H * dpr);
            }
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            draw(ctx);
        };
        paint(floor.current, (c) => drawFloor(c, W, H, cam, pr, w, step));
        paint(dust.current, (c) => drawDust(c, W, H, cam, pr, w, !!still));
    });

    const at = (p: V3, anchor: 'bottom' | 'center' = 'bottom', lift = 0) => placed(pr(p), cam, anchor, lift);
    const base = 'absolute left-0 top-0 origin-top-left select-none';
    const s1 = step === 0;
    const s4 = step === 4 || (step === 3 && w.u[3] > 0.8);

    return (
        <div ref={box} className="fly-sky absolute inset-0 overflow-hidden" aria-hidden="true">
            {/* Stars drift slower than the world, so the sky feels far away */}
            <div className="fly-stars absolute inset-0" style={{ backgroundPosition: `${(-cam.x * 0.04).toFixed(1)}px ${(cam.y * 0.03).toFixed(1)}px` }} />
            <canvas ref={floor} className="absolute inset-0 h-full w-full" />
            {ready && (
                <>
                    {/* Ethereum */}
                    <div className={base} style={at(add(S1, [0, 390, 0]))}>
                        <ChainBadge chain={FROM.key} name={FROM.name} lit={s1} />
                    </div>
                    <div className={base} style={at(add(S1, [-135, 120, 0]))}>
                        <WorldCard title="Your contract" caption="Sends 100 tokens" lit={s1 && w.u[0] < 0.45} />
                    </div>
                    <div className={base} style={at(add(S1, [135, 120, 0]))}>
                        <WorldCard title="VIA gateway" caption="Records the message" lit={s1 && w.u[0] >= 0.45} />
                    </div>

                    {/* Block confirmations */}
                    <div className={base} style={at(S2)}>
                        <Tower count={w.confirmations} />
                    </div>

                    {/* Signers: the rings' center sits 90 units left of the element's center */}
                    <div className={base} style={at(add(S3, [90, 30, 0]))}>
                        <Gate signed={w.signed} leaving={w.leaving} />
                    </div>

                    {/* Cardano */}
                    <div className={base} style={at(add(S4, [0, 390, 0]))}>
                        <ChainBadge chain={TO.key} name={TO.name} lit={s4} />
                    </div>
                    <div className={base} style={at(add(S4, [-135, 120, 0]))}>
                        <WorldCard
                            title="VIA gateway"
                            caption={w.checked[2] ? <span className="text-[#3fcf8e]">Signatures checked</span> : 'Checks every signature'}
                            lit={step === 3 && w.u[3] > 0.8}
                        />
                    </div>
                    <div className={base} style={at(add(S4, [135, 120, 0]))}>
                        <WorldCard title="Your contract" caption="Token contract" lit={w.balance > 0}>
                            {w.balance > 0 && <span className="text-[18px] font-semibold tabular-nums text-[#3fcf8e]">+{w.balance}</span>}
                        </WorldCard>
                    </div>

                    {/* The message. The relayer that carries it between the chains rides just under the
                        card, so the two always share one depth and one focus. */}
                    {w.alpha > 0 && (
                        <div className={base} style={{ ...at(w.pos, 'center', 60), opacity: w.alpha }}>
                            <div className="relative" style={{ transform: `scale(${(0.7 + 0.3 * w.grow).toFixed(3)})` }}>
                                <Packet w={w} />
                                {w.relayer > 0 && (
                                    <div
                                        className="absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap rounded-xl border border-white/20 bg-[#141922] px-4 py-2 text-[16px] font-semibold text-white shadow-[0_20px_40px_-18px_rgba(0,0,0,0.9)]"
                                        style={{ opacity: w.relayer }}
                                    >
                                        Relayer
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
            <canvas ref={dust} className="pointer-events-none absolute inset-0 h-full w-full" style={{ zIndex: 40000 }} />
        </div>
    );
}

function PinnedFly() {
    const track = useRef<HTMLDivElement>(null);
    const p = useTrackProgress(track);
    const P = p * STEPS.length;
    const step = Math.min(STEPS.length - 1, Math.floor(P));
    return (
        <div ref={track} className="relative" style={{ height: `calc(${100 + STEPS.length * STEP_VH}vh - ${NAV}px)` }}>
            <div className="sticky overflow-hidden" style={{ top: NAV, height: `calc(100vh - ${NAV}px)` }}>
                <FlyScene P={P} />
                {/* The words sit on frosted glass, so the world behind them never gets in the way */}
                <div className="container-x pointer-events-none absolute inset-0 z-[50000] flex items-center pb-16">
                    <div
                        className="w-[400px] rounded-3xl border border-white/10 bg-ink-900/55 p-8 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl transition-opacity duration-500"
                        style={{ opacity: P >= 0.22 ? 1 : 0 }}
                    >
                        <StepText step={step} dark />
                    </div>
                </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[50000] h-36 bg-gradient-to-t from-ink-900 via-ink-900/80 to-transparent" aria-hidden="true" />
                <ScrollCue show={p < 0.015} label="Scroll to send the message" className="absolute inset-x-0 bottom-28 z-[50001] text-white" />
                <div className="container-x absolute inset-x-0 bottom-7 z-[50001]">
                    <ProgressRail p={p} dark />
                </div>
            </div>
        </div>
    );
}

export function FlyJourney() {
    return (
        <section id="how-it-works" className="scroll-mt-24 border-y border-white/[0.06] bg-ink-900 text-white">
            <div className="container-x pb-8 pt-20 md:pt-28" data-reveal>
                <h2 className="text-3xl font-semibold tracking-tight md:text-[2.75rem] md:leading-[1.1]">How it works</h2>
                <p className="mt-5 max-w-2xl text-lg text-slate-300 md:text-xl">
                    Scroll to follow one message from {FROM.name} to {TO.name}, one step at a time.
                </p>
            </div>
            <div className="hidden lg:block lg:motion-reduce:hidden">
                <PinnedFly />
            </div>
            <div className="lg:hidden lg:motion-reduce:block">
                <StackedSteps
                    dark
                    picture={(i) => (
                        <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-ink-900 md:aspect-[4/3]">
                            <FlyScene P={i === 4 ? 4.7 : i + 0.95} still />
                        </div>
                    )}
                />
            </div>
        </section>
    );
}
