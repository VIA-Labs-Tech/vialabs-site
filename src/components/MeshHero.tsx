import { useEffect, useRef } from 'react';
import { chainLogos } from '../chains';

// A 3D floor mesh that runs into the screen. Chain logos rise from its nodes in pairs,
// an arc connects each pair, and a pulse travels along the arc like a message.
// Everything is drawn on a canvas in the browser; the server renders an empty canvas.

// World, in grid units (one unit = one grid cell)
const CAM_Y = 2; // camera height above the floor
const YAW = 35; // how far the camera turns to the right, in degrees, so the grid runs diagonally
const Z_NEAR = 0.8; // depth where the fog starts; also sets where the rows sit
const SPEED = 0.15; // floor movement toward the viewer, units per second
const WAVE = 0.11; // height of the surface wave
const PIN_H = 0.62; // how far a logo rises above the floor
const DISC_R = 0.34; // logo disc radius

// Pair timing, in milliseconds
const POP_IN = 1300;
const SECOND_DELAY = 760;
const ARC_START = 2100;
const ARC_DRAW = 1700;
const PULSE = 2000;
const RING = 1040;
const LIFE = 11200;
const POP_OUT = 900;

// Chains that appear more often, matched against the logo key
const BOOSTED = ['midnight', 'cardano'];
const BOOST = 1.4;

interface Logo {
    key: string;
    urls: { light: string; dark: string };
    img: { light?: HTMLImageElement; dark?: HTMLImageElement };
}
interface Pin {
    x: number;
    z0: number; // row position at birth; the pin then rides the floor toward the viewer
    logo: Logo;
}
interface Pair {
    a: Pin;
    b: Pin;
    born: number;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const easeOutBack = (x: number) => 1 + 2.70158 * Math.pow(x - 1, 3) + 1.70158 * Math.pow(x - 1, 2);
const easeInBack = (x: number) => 2.70158 * x * x * x - 1.70158 * x * x;
const easeInOut = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
const randInt = (lo: number, hi: number) => lo + Math.floor(Math.random() * (hi - lo + 1));

// withLogos: false draws the moving floor alone, for the inner pages
export function MeshHero({ withLogos = true }: { withLogos?: boolean }) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const wrap = wrapRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!wrap || !canvas || !ctx) return;

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // --- Logos: load only the set for the current theme, the other set when the theme changes ---
        const isDark = () => document.documentElement.classList.contains('dark');
        const logos: Logo[] = chainLogos.map((c) => ({ key: c.key, urls: { light: c.light, dark: c.dark }, img: {} }));
        const ensure = (dark: boolean) => {
            const mode = dark ? 'dark' : 'light';
            for (const l of logos) {
                if (l.img[mode]) continue;
                const image = new Image();
                image.decoding = 'async';
                if (reduced) image.onload = () => drawStill();
                image.src = l.urls[mode];
                l.img[mode] = image;
            }
        };
        const imgFor = (l: Logo, dark: boolean) => l.img[dark ? 'dark' : 'light'];
        const ready = (l: Logo, dark: boolean) => {
            const image = imgFor(l, dark);
            return !!image && image.complete && image.naturalWidth > 0;
        };
        const pickLogo = (exclude: Set<string>): Logo | null => {
            const dark = isDark();
            const pool = logos.filter((l) => ready(l, dark) && !exclude.has(l.key));
            if (pool.length === 0) return null;
            const weights = pool.map((l) => (BOOSTED.includes(l.key) ? BOOST : 1));
            let r = Math.random() * weights.reduce((a, b) => a + b, 0);
            for (let i = 0; i < pool.length; i++) {
                r -= weights[i];
                if (r <= 0) return pool[i];
            }
            return pool[pool.length - 1];
        };

        // --- Camera and layout ---
        const sinY = Math.sin((YAW * Math.PI) / 180);
        const cosY = Math.cos((YAW * Math.PI) / 180);
        let W = 0, H = 0, f = 1, cx = 0, horizonY = 0, zFar = 26, mobile = false;
        let xLo = 0, xHi = 0, zLo = 0, zHi = 0; // the part of the grid the camera can see
        let camX = 0, camTarget = 0;
        const resize = () => {
            const r = wrap.getBoundingClientRect();
            W = Math.max(1, r.width);
            H = Math.max(1, r.height);
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.round(W * dpr);
            canvas.height = Math.round(H * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            mobile = W < 768;
            horizonY = H * (mobile ? 0.5 : 0.32);
            f = H * (mobile ? 0.66 : 0.6);
            cx = W * (mobile ? 0.5 : 0.6);
            zFar = mobile ? 20 : 26;
            // Find where the screen's left and right edges meet the floor, near and far
            const corners = [-60, W + 60].flatMap((sx) =>
                [0.5, zFar].map((d) => {
                    const xr = ((sx - cx) * d) / f;
                    return { x: xr * cosY + d * sinY, z: d * cosY - xr * sinY };
                }),
            );
            xLo = Math.floor(Math.min(...corners.map((c) => c.x))) - 2;
            xHi = Math.ceil(Math.max(...corners.map((c) => c.x))) + 2;
            zLo = Math.floor(Math.min(...corners.map((c) => c.z))) - 2;
            zHi = Math.ceil(Math.max(...corners.map((c) => c.z))) + 2;
            if (reduced) drawStill();
        };

        // World to screen. d is the depth in front of the turned camera.
        const project = (x: number, y: number, z: number) => {
            const dx = x - camX;
            const d = dx * sinY + z * cosY;
            const q = Math.max(d, 0.05);
            return { sx: cx + (f * (dx * cosY - z * sinY)) / q, sy: horizonY + (f * (CAM_Y - y)) / q, d };
        };
        const wave = (x: number, z: number, t: number) =>
            WAVE * (0.6 * Math.sin(0.45 * x + 0.3 * t) + 0.4 * Math.sin(0.38 * z - 0.475 * t));
        const fog = (d: number) => Math.pow(clamp(1 - (d - Z_NEAR) / (zFar - Z_NEAR), 0, 1), 1.35) * clamp((d - 0.5) / 0.7, 0, 1);

        // --- Pairs ---
        let pairs: Pair[] = [];
        let lastSpawn = 0;
        let nextGap = 400;

        const pinZ = (p: Pin, age: number) => p.z0 - (SPEED * age) / 1000;

        const spawn = (now: number, t: number, ageOverride?: number) => {
            const offset = (t * SPEED) % 1;
            const inUse = new Set<string>();
            pairs.forEach((p) => { inUse.add(p.a.logo.key); inUse.add(p.b.logo.key); });
            const logoA = pickLogo(inUse);
            if (!logoA) return;
            inUse.add(logoA.key);
            const logoB = pickLogo(inUse);
            if (!logoB) return;

            // Logos appear to the right of the headline, below the menu, and above the stats
            const sxMin = Math.min(W * 0.72, Math.max(W * 0.58, 740));
            const sxMax = W * 0.9;
            const syMin = H * 0.16;
            const syMax = H * 0.76;
            // How far a pin has moved since birth; a still picture shows pins partway through their life
            const drift = (SPEED * (ageOverride ?? 0)) / 1000;
            const onRow = (z: number) => Z_NEAR + Math.round(z - Z_NEAR + offset) - offset;
            const visible = (x: number, z: number) => {
                const foot = project(x, 0, z - drift);
                const top = project(x, PIN_H, z - drift);
                if (foot.d < 2.6 || foot.d > 12) return false;
                if (![foot, top].every((p) => p.sx > sxMin && p.sx < sxMax && p.sy > syMin && p.sy < syMax)) return false;
                if (ageOverride !== undefined) return true;
                // In the animation, the logo must still clear the stats and the right edge just before it fades out
                const end = project(x, PIN_H, z - (SPEED * (LIFE - POP_OUT)) / 1000);
                return end.sx < W * 0.94 && end.sy < syMax;
            };
            // Pick a spot on screen, then find the grid node on the floor under it
            const floorUnder = (sx: number, sy: number) => {
                const py = sy - horizonY;
                if (py < 1) return null;
                const d = (f * CAM_Y) / py;
                const xr = ((sx - cx) * d) / f;
                return { x: Math.round(camX + xr * cosY + d * sinY), z: onRow(d * cosY - xr * sinY + drift) };
            };
            // Feet and logo discs both keep their distance
            const apart = (x1: number, z1: number, x2: number, z2: number) => {
                const f1 = project(x1, 0, z1), f2 = project(x2, 0, z2);
                const t1 = project(x1, PIN_H, z1), t2 = project(x2, PIN_H, z2);
                return Math.hypot(f1.sx - f2.sx, f1.sy - f2.sy) > 90 && Math.hypot(t1.sx - t2.sx, t1.sy - t2.sy) > 80;
            };
            const farFromOthers = (x: number, z: number) =>
                pairs.every((p) => [p.a, p.b].every((q) => apart(q.x, pinZ(q, now - p.born), x, z - drift)));

            // Most random spots fail these checks, so try many; each try is cheap
            for (let attempt = 0; attempt < 400; attempt++) {
                const spot = floorUnder(sxMin + Math.random() * (sxMax - sxMin), syMin + Math.random() * (syMax - syMin));
                if (!spot) continue;
                const { x: xA, z: zA } = spot;
                const xB = xA + (Math.random() < 0.5 ? -1 : 1) * randInt(2, 5);
                const zB = zA + randInt(-2, 3);
                if (!visible(xA, zA) || !visible(xB, zB)) continue;
                if (!apart(xA, zA - drift, xB, zB - drift)) continue;
                if (!farFromOthers(xA, zA) || !farFromOthers(xB, zB)) continue;
                const born = ageOverride === undefined ? now : now - ageOverride;
                pairs.push({ a: { x: xA, z0: zA, logo: logoA }, b: { x: xB, z0: zB, logo: logoB }, born });
                return;
            }
        };

        // --- Drawing ---
        const drawMesh = (t: number, dark: boolean) => {
            const offset = (t * SPEED) % 1;

            // A soft band of light along the horizon
            const band = ctx.createLinearGradient(0, horizonY - H * 0.12, 0, horizonY + H * 0.1);
            band.addColorStop(0, 'rgba(0,229,229,0)');
            band.addColorStop(0.55, dark ? 'rgba(0,229,229,0.10)' : 'rgba(0,229,229,0.08)');
            band.addColorStop(1, 'rgba(0,229,229,0)');
            ctx.fillStyle = band;
            ctx.fillRect(0, horizonY - H * 0.12, W, H * 0.22);
            // Tint only the glow itself toward magenta on the right, so it keeps its soft edges
            const tint = ctx.createLinearGradient(0, 0, W, 0);
            tint.addColorStop(0, 'rgba(0,229,229,1)');
            tint.addColorStop(0.55, 'rgba(0,229,229,1)');
            tint.addColorStop(1, 'rgba(255,0,255,1)');
            ctx.globalCompositeOperation = 'source-atop';
            ctx.fillStyle = tint;
            ctx.fillRect(0, horizonY - H * 0.12, W, H * 0.22);
            ctx.globalCompositeOperation = 'source-over';

            const stroke = ctx.createLinearGradient(0, 0, W, 0);
            if (dark) {
                stroke.addColorStop(0, 'rgb(0,229,229)');
                stroke.addColorStop(0.62, 'rgb(0,229,229)');
                stroke.addColorStop(1, 'rgb(255,0,255)');
            } else {
                stroke.addColorStop(0, 'rgb(15,23,42)');
                stroke.addColorStop(0.7, 'rgb(15,23,42)');
                stroke.addColorStop(1, 'rgb(8,145,178)');
            }
            const base = 0.2;
            ctx.strokeStyle = stroke;
            ctx.lineWidth = 1;

            // Project each grid node once
            const nodes: ReturnType<typeof project>[][] = [];
            for (let j = Math.floor(zLo - Z_NEAR); ; j++) {
                const z = Z_NEAR + j - offset;
                if (z > zHi) break;
                const row: ReturnType<typeof project>[] = [];
                for (let x = xLo; x <= xHi; x++) row.push(project(x, wave(x, z, t), z));
                nodes.push(row);
            }
            // Each line segment fades with its depth. Segments are grouped by fade level, so each group draws in one pass.
            const buckets: number[][] = Array.from({ length: 21 }, () => []);
            const seg = (a: ReturnType<typeof project>, b: ReturnType<typeof project>) => {
                if (a.d < 0.35 || b.d < 0.35) return;
                // Skip segments that sit wholly off one side of the screen
                if ((a.sx < 0 && b.sx < 0) || (a.sx > W && b.sx > W) || (a.sy > H && b.sy > H)) return;
                const k = Math.round(fog((a.d + b.d) / 2) * 20);
                if (k > 0) buckets[k].push(a.sx, a.sy, b.sx, b.sy);
            };
            nodes.forEach((row, j) =>
                row.forEach((p, i) => {
                    if (i > 0) seg(row[i - 1], p); // along a row
                    if (j > 0) seg(nodes[j - 1][i], p); // into the distance
                }),
            );
            for (let k = 1; k <= 20; k++) {
                const b = buckets[k];
                if (b.length === 0) continue;
                ctx.globalAlpha = (base * k) / 20;
                ctx.beginPath();
                for (let i = 0; i < b.length; i += 4) {
                    ctx.moveTo(b[i], b[i + 1]);
                    ctx.lineTo(b[i + 2], b[i + 3]);
                }
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
        };

        const drawPairs = (now: number, t: number, dark: boolean) => {
            // Farther pairs first, so nearer ones sit on top
            const depth = (p: Pin, age: number) => project(p.x, 0, pinZ(p, age)).d;
            const far = (p: Pair) => depth(p.a, now - p.born) + depth(p.b, now - p.born);
            const sorted = [...pairs].sort((p, q) => far(q) - far(p));
            for (const pair of sorted) {
                const age = now - pair.born;
                const exitQ = clamp((age - (LIFE - POP_OUT)) / POP_OUT, 0, 1);
                const exitScale = exitQ > 0 ? Math.max(0, 1 - easeInBack(exitQ)) : 1;

                const pinState = (p: Pin, delay: number) => {
                    const z = pinZ(p, age);
                    const grow = clamp((age - delay) / POP_IN, 0, 1);
                    const s = (grow > 0 ? easeOutBack(grow) : 0) * exitScale;
                    const floorY = wave(p.x, z, t);
                    const topY = floorY + PIN_H * clamp(s, 0, 1.2);
                    const foot = project(p.x, floorY, z);
                    return { z, s, floorY, topY, foot, top: project(p.x, topY, z), depth: Math.max(foot.d, 0.5) };
                };
                const A = pinState(pair.a, 0);
                const B = pinState(pair.b, SECOND_DELAY);

                // Arc between the two logos, then a pulse that travels along it
                const arcP = clamp((age - ARC_START) / ARC_DRAW, 0, 1);
                if (arcP > 0 && exitScale > 0) {
                    const ax = pair.a.x, bx = pair.b.x;
                    const dist = Math.hypot(bx - ax, B.z - A.z);
                    const mid = { x: (ax + bx) / 2, y: Math.max(A.topY, B.topY) + 0.3 * dist + 0.4, z: (A.z + B.z) / 2 };
                    const at = (u: number) => {
                        const v = 1 - u;
                        return project(
                            v * v * ax + 2 * v * u * mid.x + u * u * bx,
                            v * v * A.topY + 2 * v * u * mid.y + u * u * B.topY,
                            v * v * A.z + 2 * v * u * mid.z + u * u * B.z,
                        );
                    };
                    const drawn = easeInOut(arcP);
                    const steps = 30;
                    const g = ctx.createLinearGradient(A.top.sx, A.top.sy, B.top.sx, B.top.sy);
                    g.addColorStop(0, '#00E5E5');
                    g.addColorStop(1, '#FF00FF');
                    ctx.save();
                    ctx.globalAlpha = exitScale * (dark ? 0.9 : 0.8);
                    ctx.strokeStyle = g;
                    ctx.lineWidth = clamp((f * 0.018) / ((A.depth + B.depth) / 2), 1, 2.2);
                    ctx.lineCap = 'round';
                    ctx.beginPath();
                    for (let i = 0; i <= steps; i++) {
                        const u = (i / steps) * drawn;
                        const p = at(u);
                        if (i === 0) ctx.moveTo(p.sx, p.sy);
                        else ctx.lineTo(p.sx, p.sy);
                    }
                    ctx.stroke();

                    const pulseU = clamp((age - ARC_START - ARC_DRAW) / PULSE, 0, 1);
                    if (pulseU > 0 && pulseU < 1) {
                        const p = at(easeInOut(pulseU));
                        ctx.shadowColor = 'rgba(0,229,229,0.9)';
                        ctx.shadowBlur = 14;
                        ctx.fillStyle = dark ? '#E6FFFF' : '#00B8C4';
                        ctx.beginPath();
                        ctx.arc(p.sx, p.sy, 3.2, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    ctx.restore();
                }

                const drawPin = (st: ReturnType<typeof pinState>, logo: Logo, ringAge: number) => {
                    if (st.s <= 0.01) return;
                    const s = clamp(st.s, 0, 1.2);
                    // Glowing ring where the pin meets the floor
                    const rx = ((f * 0.2) / st.depth) * s;
                    ctx.save();
                    ctx.globalAlpha = clamp(s, 0, 1) * exitScale;
                    ctx.fillStyle = dark ? 'rgba(0,229,229,0.14)' : 'rgba(0,184,196,0.12)';
                    ctx.strokeStyle = dark ? 'rgba(0,229,229,0.65)' : 'rgba(8,145,178,0.55)';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.ellipse(st.foot.sx, st.foot.sy, rx, rx * 0.32, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    // Stem
                    ctx.strokeStyle = dark ? 'rgba(0,229,229,0.45)' : 'rgba(15,23,42,0.22)';
                    ctx.beginPath();
                    ctx.moveTo(st.foot.sx, st.foot.sy);
                    ctx.lineTo(st.top.sx, st.top.sy);
                    ctx.stroke();
                    // Disc with the chain logo
                    const r = clamp((f * DISC_R) / st.depth, 11, 32) * s;
                    ctx.shadowColor = dark ? 'rgba(0,0,0,0.6)' : 'rgba(15,23,42,0.2)';
                    ctx.shadowBlur = 16;
                    ctx.shadowOffsetY = 5;
                    ctx.fillStyle = dark ? '#151821' : '#ffffff';
                    ctx.beginPath();
                    ctx.arc(st.top.sx, st.top.sy, r, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowColor = 'transparent';
                    ctx.strokeStyle = dark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.08)';
                    ctx.stroke();
                    const img = imgFor(logo, dark);
                    const d = r * 1.2;
                    if (img && ready(logo, dark)) ctx.drawImage(img, st.top.sx - d / 2, st.top.sy - d / 2, d, d);
                    // Arrival ring when the pulse lands
                    if (ringAge > 0 && ringAge < RING) {
                        const q = ringAge / RING;
                        ctx.globalAlpha = (1 - q) * 0.8;
                        ctx.strokeStyle = '#00E5E5';
                        ctx.lineWidth = 1.5;
                        ctx.beginPath();
                        ctx.arc(st.top.sx, st.top.sy, r * (1 + q * 0.9), 0, Math.PI * 2);
                        ctx.stroke();
                    }
                    ctx.restore();
                };
                const arrival = age - (ARC_START + ARC_DRAW + PULSE);
                if (A.depth >= B.depth) {
                    drawPin(A, pair.a.logo, -1);
                    drawPin(B, pair.b.logo, arrival);
                } else {
                    drawPin(B, pair.b.logo, arrival);
                    drawPin(A, pair.a.logo, -1);
                }
            }
        };

        // Fade the mesh out toward the left and right edges
        const fadeEdges = () => {
            ctx.save();
            ctx.globalCompositeOperation = 'destination-out';
            const edge = W * 0.07;
            const left = ctx.createLinearGradient(0, 0, edge, 0);
            left.addColorStop(0, 'rgba(0,0,0,1)');
            left.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = left;
            ctx.fillRect(0, 0, edge, H);
            const right = ctx.createLinearGradient(W - edge, 0, W, 0);
            right.addColorStop(0, 'rgba(0,0,0,0)');
            right.addColorStop(1, 'rgba(0,0,0,1)');
            ctx.fillStyle = right;
            ctx.fillRect(W - edge, 0, edge, H);
            ctx.restore();
        };

        const frame = (now: number, t: number) => {
            const dark = isDark();
            if (withLogos) ensure(dark);
            ctx.clearRect(0, 0, W, H);
            drawMesh(t, dark);
            drawPairs(now, t, dark);
            fadeEdges();
        };

        // A still picture for people who turn off motion
        function drawStill() {
            const now = performance.now();
            pairs = [];
            if (withLogos && !mobile) for (let i = 0; i < 12 && pairs.length < 3; i++) spawn(now, 0, ARC_START + ARC_DRAW + PULSE + RING + 50);
            frame(now, 0);
        }

        // --- Loop ---
        let raf = 0;
        let running = false;
        let inView = true;
        const start0 = performance.now();
        const tick = (now: number) => {
            const t = (now - start0) / 1000;
            camX += (camTarget - camX) * 0.04;
            pairs = pairs.filter((p) => now - p.born < LIFE);
            // On phones the words fill the hero, so the floor moves without logos
            const maxPairs = !withLogos || mobile ? 0 : W < 1100 ? 3 : 4;
            if (pairs.length < maxPairs && now - lastSpawn > nextGap) {
                spawn(now, t);
                lastSpawn = now;
                nextGap = 1800 + Math.random() * 1400;
            }
            frame(now, t);
            raf = requestAnimationFrame(tick);
        };
        const start = () => {
            if (running || reduced || !inView || document.visibilityState !== 'visible') return;
            running = true;
            raf = requestAnimationFrame(tick);
        };
        const stop = () => {
            running = false;
            cancelAnimationFrame(raf);
        };

        const ro = new ResizeObserver(resize);
        ro.observe(wrap);
        resize();

        const io = new IntersectionObserver(([entry]) => {
            inView = entry.isIntersecting;
            if (inView) start();
            else stop();
        });
        io.observe(wrap);

        const onVisibility = () => (document.visibilityState === 'visible' ? start() : stop());
        document.addEventListener('visibilitychange', onVisibility);

        const onMove = (e: PointerEvent) => {
            if (mobile) return;
            const r = wrap.getBoundingClientRect();
            const inside = e.clientY >= r.top && e.clientY <= r.bottom;
            camTarget = inside ? ((e.clientX - r.left) / r.width - 0.5) * 0.9 : 0;
        };
        window.addEventListener('pointermove', onMove);

        // Redraw the still picture when logos finish loading or the theme changes
        let themeObserver: MutationObserver | null = null;
        if (withLogos) ensure(isDark());
        if (reduced) {
            themeObserver = new MutationObserver(() => drawStill());
            themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        } else {
            start();
        }

        return () => {
            stop();
            ro.disconnect();
            io.disconnect();
            themeObserver?.disconnect();
            document.removeEventListener('visibilitychange', onVisibility);
            window.removeEventListener('pointermove', onMove);
        };
    }, [withLogos]);

    return (
        <div ref={wrapRef} className="absolute inset-0 overflow-hidden" aria-hidden="true">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
    );
}
