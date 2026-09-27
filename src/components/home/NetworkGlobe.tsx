import { useEffect, useRef } from 'react';
import { chainLogo } from '../../chains';

// A slowly turning globe of dots with chain logos on its surface. Messages arc from chain to chain.
// Drag to turn it, and hover a logo to see the chain's name. It pauses off screen. With reduced
// motion it holds still and shows a few finished arcs, and dragging still works.
// It always sits on a dark band, so it uses the dark-mode logos.

// Only chains with a confirmed name. Chain keys match the logo files in src/assets/chains.
const NODES: [key: string, name: string][] = [
    ['17000', 'Ethereum'],
    ['42161', 'Arbitrum'],
    ['43114', 'Avalanche'],
    ['8453', 'Base'],
    ['56', 'BSC'],
    ['10', 'Optimism'],
    ['137', 'Polygon'],
    ['cardano', 'Cardano'],
    ['midnight', 'Midnight'],
    ['stellar', 'Stellar'],
    ['1088', 'Metis'],
    ['146', 'Sonic'],
    ['369', 'PulseChain'],
    ['59140', 'Linea'],
    ['60808', 'BOB'],
    ['999999999', 'Zora'],
    ['48899', 'Zircuit'],
    ['1001', 'Kaia'],
    ['arc', 'Arc'],
    ['xpl', 'Plasma'],
    ['cronos', 'Cronos'],
];

const DOTS = 1600; // dots on the surface
const SPIN = 0.07; // idle turn, radians per second
const DRAW = 1500; // an arc draws itself, in milliseconds
const HOLD = 800; // then the message lands
const FADE = 1100; // then the arc fades
const MAX_ARCS = 4;

type V = [number, number, number];

// Evenly spread points on a sphere. yMax below 1 keeps points away from the poles.
const spread = (i: number, n: number, yMax = 1): V => {
    const y = yMax * (1 - (2 * (i + 0.5)) / n);
    const r = Math.sqrt(1 - y * y);
    const a = i * Math.PI * (3 - Math.sqrt(5));
    return [r * Math.cos(a), y, r * Math.sin(a)];
};
const dot = (a: V, b: V) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const ease = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);

interface Arc {
    a: number;
    b: number;
    born: number;
    omega: number; // angle between the two chains
    lift: number; // how high the arc rises above the surface
}

export function NetworkGlobe() {
    const wrapRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const wrap = wrapRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!wrap || !canvas || !ctx) return;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const dots = Array.from({ length: DOTS }, (_, i) => spread(i, DOTS));
        const nodes = NODES.map(([key, name], i) => {
            const logo = chainLogo(key);
            const img = new Image();
            img.decoding = 'async';
            if (logo) img.src = logo.dark;
            img.onload = () => !running && draw(performance.now());
            return { key, name, p: spread(i, NODES.length, 0.78), img };
        });

        // --- Size and camera ---
        let W = 1, H = 1, R = 1, cx = 0, cy = 0, scale = 1;
        let rot = 0.6, tilt = 0.36, spinBoost = 0;
        const resize = () => {
            const r = wrap.getBoundingClientRect();
            W = Math.max(1, r.width);
            H = Math.max(1, r.height);
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.round(W * dpr);
            canvas.height = Math.round(H * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            R = Math.min(W, H) * 0.36; // room for arcs above the surface and for the glow
            cx = W / 2;
            cy = H / 2;
            scale = R / 220;
            if (!running) draw(performance.now());
        };

        // Turn by rot around the vertical axis, then lean by tilt toward the viewer. z > 0 faces the viewer.
        const view = (p: V, lift = 1) => {
            const cr = Math.cos(rot), sr = Math.sin(rot), ct = Math.cos(tilt), st = Math.sin(tilt);
            const x1 = p[0] * cr + p[2] * sr;
            const z1 = -p[0] * sr + p[2] * cr;
            const y2 = p[1] * ct - z1 * st;
            const z2 = p[1] * st + z1 * ct;
            return { x: cx + x1 * R * lift, y: cy - y2 * R * lift, z: z2, nx: x1 * lift, ny: y2 * lift };
        };

        // --- Messages ---
        let arcs: Arc[] = [];
        let nextArc = 300;
        const addArc = (now: number) => {
            for (let tries = 0; tries < 24; tries++) {
                const a = Math.floor(Math.random() * nodes.length);
                const b = Math.floor(Math.random() * nodes.length);
                if (a === b || view(nodes[a].p).z < 0.15 || view(nodes[b].p).z < -0.2) continue;
                if (arcs.some((x) => x.a === a || x.b === b)) continue;
                const omega = Math.acos(clamp(dot(nodes[a].p, nodes[b].p), -1, 1));
                if (omega < 0.55 || omega > 2.3) continue;
                arcs.push({ a, b, born: now, omega, lift: 0.1 + 0.2 * (omega / Math.PI) });
                return;
            }
        };
        const pointOn = (arc: Arc, t: number) => {
            const pa = nodes[arc.a].p, pb = nodes[arc.b].p;
            const s = Math.sin(arc.omega);
            const k1 = Math.sin((1 - t) * arc.omega) / s, k2 = Math.sin(t * arc.omega) / s;
            const p: V = [pa[0] * k1 + pb[0] * k2, pa[1] * k1 + pb[1] * k2, pa[2] * k1 + pb[2] * k2];
            return view(p, 1 + arc.lift * Math.sin(Math.PI * t));
        };
        // A point is hidden when it is behind the globe and inside its outline
        const hidden = (q: { z: number; nx: number; ny: number }) => q.z < 0 && q.nx * q.nx + q.ny * q.ny < 1;

        // --- Hover ---
        let hover = -1;
        const nodeAt = (x: number, y: number) => {
            let best = -1, bestZ = -1;
            nodes.forEach((n, i) => {
                const q = view(n.p);
                if (q.z < 0.1) return;
                const r = (13 + 7 * q.z) * scale + 4;
                if (Math.hypot(x - q.x, y - q.y) < r && q.z > bestZ) {
                    best = i;
                    bestZ = q.z;
                }
            });
            return best;
        };

        // --- Drawing ---
        const draw = (now: number) => {
            ctx.clearRect(0, 0, W, H);

            // A soft glow in the brand colors around the globe
            const glow = ctx.createRadialGradient(cx, cy, R * 0.85, cx, cy, R * 1.38);
            glow.addColorStop(0, 'rgba(0,229,229,0.14)');
            glow.addColorStop(0.5, 'rgba(140,70,255,0.06)');
            glow.addColorStop(1, 'rgba(255,0,255,0)');
            ctx.fillStyle = glow;
            ctx.fillRect(0, 0, W, H);

            // The globe itself: a solid ball lit from the upper left, so the far side stays hidden
            const body = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.05, cx, cy, R);
            body.addColorStop(0, '#1f2a36');
            body.addColorStop(0.55, '#131a23');
            body.addColorStop(1, '#0b0e14');
            ctx.fillStyle = body;
            ctx.beginPath();
            ctx.arc(cx, cy, R, 0, Math.PI * 2);
            ctx.fill();
            // A thin rim of light in the brand colors
            const rim = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
            rim.addColorStop(0, 'rgba(0,229,229,0.5)');
            rim.addColorStop(0.5, 'rgba(255,255,255,0.05)');
            rim.addColorStop(1, 'rgba(255,0,255,0.4)');
            ctx.strokeStyle = rim;
            ctx.lineWidth = 1.2;
            ctx.stroke();

            // Dots on the near side, brighter and larger toward the viewer, grouped so each group fills in one pass
            const groups: number[][] = Array.from({ length: 8 }, () => []);
            for (const d of dots) {
                const q = view(d);
                if (q.z <= 0) continue;
                groups[Math.min(7, Math.floor(q.z * 8))].push(q.x, q.y);
            }
            groups.forEach((g, k) => {
                if (!g.length) return;
                const z = (k + 0.5) / 8;
                const s = (0.35 + 0.8 * z) * Math.max(scale, 0.75);
                ctx.fillStyle = `rgba(200,236,245,${0.06 + 0.62 * Math.pow(z, 1.3)})`;
                ctx.beginPath();
                for (let i = 0; i < g.length; i += 2) {
                    ctx.moveTo(g[i] + s, g[i + 1]);
                    ctx.arc(g[i], g[i + 1], s, 0, Math.PI * 2);
                }
                ctx.fill();
            });

            // Arcs: drawn from source to destination in cyan to magenta, then a landing ring, then a fade
            for (const arc of arcs) {
                const age = now - arc.born;
                const head = ease(clamp(age / DRAW, 0, 1));
                const alpha = age < DRAW + HOLD ? 1 : clamp(1 - (age - DRAW - HOLD) / FADE, 0, 1);
                const steps = 48;
                ctx.lineWidth = 1.7 * Math.max(scale, 0.8);
                ctx.lineCap = 'round';
                let prev = pointOn(arc, 0);
                for (let i = 1; i <= steps; i++) {
                    const t = (head * i) / steps;
                    const q = pointOn(arc, t);
                    const c = t;
                    ctx.strokeStyle = `rgba(${Math.round(255 * c)},${Math.round(229 * (1 - c))},${Math.round(229 + 26 * c)},${alpha * (hidden(q) ? 0.06 : 0.95)})`;
                    ctx.beginPath();
                    ctx.moveTo(prev.x, prev.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.stroke();
                    prev = q;
                }
                if (age < DRAW && !hidden(prev)) {
                    ctx.save();
                    ctx.shadowColor = 'rgba(0,229,229,0.9)';
                    ctx.shadowBlur = 12;
                    ctx.fillStyle = '#E6FFFF';
                    ctx.beginPath();
                    ctx.arc(prev.x, prev.y, 2.6 * Math.max(scale, 0.8), 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
                if (age >= DRAW && age < DRAW + HOLD) {
                    const q = view(nodes[arc.b].p);
                    if (q.z > 0) {
                        const u = (age - DRAW) / HOLD;
                        ctx.strokeStyle = `rgba(0,229,229,${(1 - u) * 0.8})`;
                        ctx.lineWidth = 1.5;
                        ctx.beginPath();
                        ctx.arc(q.x, q.y, (14 + 16 * u) * scale, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                }
            }

            // Chain logos on the side that faces the viewer, farthest first
            const order = nodes.map((n, i) => ({ i, q: view(n.p) })).filter((o) => o.q.z > 0).sort((m, n) => m.q.z - n.q.z);
            for (const { i, q } of order) {
                const n = nodes[i];
                const fade = clamp(q.z / 0.3, 0, 1);
                const r = (13 + 7 * q.z) * scale;
                ctx.save();
                ctx.globalAlpha = fade;
                ctx.shadowColor = 'rgba(0,0,0,0.55)';
                ctx.shadowBlur = 12;
                ctx.shadowOffsetY = 3;
                ctx.fillStyle = '#151821';
                ctx.beginPath();
                ctx.arc(q.x, q.y, r, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowColor = 'transparent';
                ctx.strokeStyle = i === hover ? 'rgba(0,229,229,0.9)' : 'rgba(255,255,255,0.14)';
                ctx.lineWidth = i === hover ? 1.5 : 1;
                ctx.stroke();
                if (n.img.complete && n.img.naturalWidth) {
                    const s = r * 1.2;
                    ctx.drawImage(n.img, q.x - s / 2, q.y - s / 2, s, s);
                }
                ctx.restore();
            }

            // The name of the chain under the pointer
            if (hover >= 0) {
                const q = view(nodes[hover].p);
                if (q.z > 0.1) {
                    const label = nodes[hover].name;
                    ctx.font = '600 12px Inter, ui-sans-serif, system-ui, sans-serif';
                    const w = ctx.measureText(label).width + 16;
                    const x = q.x - w / 2;
                    const y = q.y - (13 + 7 * q.z) * scale - 30;
                    ctx.fillStyle = 'rgba(255,255,255,0.95)';
                    ctx.beginPath();
                    ctx.roundRect(x, y, w, 22, 11);
                    ctx.fill();
                    ctx.fillStyle = '#0F1117';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(label, x + 8, y + 11);
                }
            }
        };

        // --- Loop ---
        let raf = 0, running = false, inView = false, last = performance.now();
        const tick = (now: number) => {
            const dt = Math.min(0.05, (now - last) / 1000);
            last = now;
            if (!dragging) {
                rot += (SPIN + spinBoost) * dt;
                spinBoost *= 0.94;
            }
            arcs = arcs.filter((a) => now - a.born < DRAW + HOLD + FADE);
            if (arcs.length < MAX_ARCS && now > nextArc) {
                addArc(now);
                nextArc = now + 700 + Math.random() * 700;
            }
            draw(now);
            raf = requestAnimationFrame(tick);
        };
        const start = () => {
            if (running || reduced || !inView || document.visibilityState !== 'visible') return;
            running = true;
            last = performance.now();
            raf = requestAnimationFrame(tick);
        };
        const stop = () => {
            running = false;
            cancelAnimationFrame(raf);
        };

        // --- Dragging and hover ---
        let dragging = false, lastX = 0, lastY = 0, lastMove = 0;
        const onDown = (e: PointerEvent) => {
            dragging = true;
            lastX = e.clientX;
            lastY = e.clientY;
            lastMove = performance.now();
            spinBoost = 0;
            canvas.setPointerCapture(e.pointerId);
            canvas.style.cursor = 'grabbing';
        };
        const onMove = (e: PointerEvent) => {
            const box = canvas.getBoundingClientRect();
            if (dragging) {
                const dx = e.clientX - lastX, dy = e.clientY - lastY;
                const now = performance.now();
                rot += dx * 0.006;
                if (e.pointerType === 'mouse') tilt = clamp(tilt + dy * 0.004, 0.05, 0.8);
                spinBoost = clamp((dx * 0.006) / Math.max((now - lastMove) / 1000, 0.008) - SPIN, -3, 3);
                lastX = e.clientX;
                lastY = e.clientY;
                lastMove = now;
                if (!running) draw(now);
                return;
            }
            const h = nodeAt(e.clientX - box.left, e.clientY - box.top);
            if (h !== hover) {
                hover = h;
                if (!running) draw(performance.now());
            }
            canvas.style.cursor = h >= 0 ? 'pointer' : 'grab';
        };
        const onUp = () => {
            dragging = false;
            canvas.style.cursor = 'grab';
            if (performance.now() - lastMove > 80) spinBoost = 0;
        };
        const onLeave = () => {
            if (hover < 0) return;
            hover = -1;
            if (!running) draw(performance.now());
        };
        canvas.addEventListener('pointerdown', onDown);
        canvas.addEventListener('pointermove', onMove);
        canvas.addEventListener('pointerup', onUp);
        canvas.addEventListener('pointercancel', onUp);
        canvas.addEventListener('pointerleave', onLeave);

        const ro = new ResizeObserver(resize);
        ro.observe(wrap);
        resize();

        if (reduced) {
            // A still picture: three finished arcs
            const now = performance.now();
            for (let i = 0; i < 12 && arcs.length < 3; i++) addArc(now);
            arcs.forEach((a) => (a.born = now - DRAW - HOLD));
            draw(now);
        }

        const io = new IntersectionObserver(([entry]) => {
            inView = entry.isIntersecting;
            if (inView) start();
            else stop();
        });
        io.observe(wrap);
        const onVisibility = () => (document.visibilityState === 'visible' ? start() : stop());
        document.addEventListener('visibilitychange', onVisibility);

        return () => {
            stop();
            ro.disconnect();
            io.disconnect();
            document.removeEventListener('visibilitychange', onVisibility);
            canvas.removeEventListener('pointerdown', onDown);
            canvas.removeEventListener('pointermove', onMove);
            canvas.removeEventListener('pointerup', onUp);
            canvas.removeEventListener('pointercancel', onUp);
            canvas.removeEventListener('pointerleave', onLeave);
        };
    }, []);

    return (
        <div ref={wrapRef} className="relative aspect-square w-full" aria-hidden="true">
            <canvas ref={canvasRef} className="absolute inset-0 h-full w-full cursor-grab touch-pan-y" />
        </div>
    );
}
