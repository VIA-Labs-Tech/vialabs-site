import { useEffect, useRef } from 'react';

// A background grid of dots that bends toward the pointer, the way light bends near a mass.
// Two slow, unseen masses keep it moving when the pointer is elsewhere. Dots near a mass brighten
// toward cyan. It pauses off screen and in hidden tabs, and holds still for reduced motion.

const GAP = 26; // distance between dots, in pixels
const PULL = 4200; // how hard the pointer pulls
const REACH = 7000; // softens the pull near a mass, in pixels squared
const DRIFT = 900; // pull of each unseen mass

export function GravityField() {
    const wrapRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const wrap = wrapRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!wrap || !canvas || !ctx) return;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isDark = () => document.documentElement.classList.contains('dark');

        let W = 1, H = 1;
        let dots: number[] = []; // resting x and y of each dot
        const resize = () => {
            const r = wrap.getBoundingClientRect();
            W = Math.max(1, r.width);
            H = Math.max(1, r.height);
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.round(W * dpr);
            canvas.height = Math.round(H * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            dots = [];
            const ox = (W % GAP) / 2, oy = (H % GAP) / 2;
            for (let y = oy; y <= H; y += GAP) for (let x = ox; x <= W; x += GAP) dots.push(x, y);
            if (!running) draw(performance.now());
        };

        // The pointer's pull eases in and out, and follows the pointer with a little lag
        let pointer: { x: number; y: number } | null = null; // in window coordinates
        let px = 0, py = 0, pull = 0;

        const draw = (now: number) => {
            const t = now / 1000;
            ctx.clearRect(0, 0, W, H);
            const masses: [number, number, number][] = [];
            if (!reduced) {
                masses.push([W * (0.5 + 0.38 * Math.sin(t * 0.11)), H * (0.5 + 0.35 * Math.sin(t * 0.17 + 1)), DRIFT]);
                masses.push([W * (0.5 + 0.4 * Math.cos(t * 0.08 + 2)), H * (0.5 + 0.3 * Math.cos(t * 0.13)), DRIFT]);
            }
            if (pull > 0.01) masses.push([px, py, PULL * pull]);

            // Dots are grouped by brightness, so each group fills in one pass
            const groups: number[][] = Array.from({ length: 6 }, () => []);
            for (let i = 0; i < dots.length; i += 2) {
                let x = dots[i], y = dots[i + 1], glow = 0;
                for (const [mx, my, m] of masses) {
                    const dx = mx - dots[i], dy = my - dots[i + 1];
                    const r2 = dx * dx + dy * dy;
                    const k = m / (r2 + REACH);
                    const s = Math.min(k, 0.45); // never past the mass
                    x += dx * s;
                    y += dy * s;
                    glow += k;
                }
                groups[Math.min(5, Math.floor(glow * 12))].push(x, y);
            }
            const dark = isDark();
            groups.forEach((g, k) => {
                if (!g.length) return;
                const u = k / 5;
                ctx.fillStyle = dark
                    ? `rgba(${Math.round(255 - 255 * u)},${Math.round(255 - 26 * u)},${Math.round(255 - 26 * u)},${0.14 + 0.55 * u})`
                    : `rgba(${Math.round(15 - 7 * u)},${Math.round(23 + 122 * u)},${Math.round(42 + 136 * u)},${0.17 + 0.45 * u})`;
                const s = 1.1 + 0.8 * u;
                ctx.beginPath();
                for (let i = 0; i < g.length; i += 2) {
                    ctx.moveTo(g[i] + s, g[i + 1]);
                    ctx.arc(g[i], g[i + 1], s, 0, Math.PI * 2);
                }
                ctx.fill();
            });
        };

        let raf = 0, running = false, inView = false;
        const tick = (now: number) => {
            let target = 0;
            if (pointer) {
                const r = wrap.getBoundingClientRect();
                const x = pointer.x - r.left, y = pointer.y - r.top;
                if (x >= 0 && x <= W && y >= 0 && y <= H) {
                    if (pull < 0.02) {
                        px = x;
                        py = y;
                    }
                    px += (x - px) * 0.18;
                    py += (y - py) * 0.18;
                    target = 1;
                }
            }
            pull += (target - pull) * 0.08;
            draw(now);
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

        const onMove = (e: PointerEvent) => {
            pointer = e.pointerType === 'touch' ? null : { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('pointermove', onMove);
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
        // Redraw the still picture when the theme changes
        const themeObserver = new MutationObserver(() => !running && draw(performance.now()));
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        return () => {
            stop();
            ro.disconnect();
            io.disconnect();
            themeObserver.disconnect();
            window.removeEventListener('pointermove', onMove);
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, []);

    return (
        <div ref={wrapRef} className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_85%)]" aria-hidden="true">
            <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        </div>
    );
}
