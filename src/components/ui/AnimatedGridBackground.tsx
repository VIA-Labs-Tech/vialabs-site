import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

// Load assets
const chainModules = import.meta.glob('../../assets/chains/*.{svg,png,jpg,jpeg}', { eager: true });
const chainUrls = Object.values(chainModules).map((mod: any) => mod.default);

// Configuration
const GRID_SIZE = 40;
const WAVE_AMPLITUDE = 6;
const WAVE_FREQUENCY = 0.02;
const WAVE_SPEED = 0.05;
const WAVE_DECAY = 0.006;

const SPAWN_DELAY_BETWEEN_LOGOS = 600;
const LINE_START_DELAY = 1000;
const LINE_DURATION = 1000;

// Lifecycle timings
const FADE_IN_DURATION = 800; // Quick fade/pop in
const POP_OUT_DURATION = 400; // Quick pop out (scale down)
// Synced Exit: No stagger delay for exit scaling logic, both start popping out at same time
// But the total active duration controls when this exit phase begins
const TOTAL_ACTIVE_TIME = 2500;
const LIFECYCLE_DURATION = LINE_START_DELAY + LINE_DURATION + TOTAL_ACTIVE_TIME + POP_OUT_DURATION;

const MAX_CONCURRENT = 8; // Increased frequency (approx 50% more than 5)

interface ActivePair {
    id: number;
    startTime: number;
    p1: { col: number; row: number };
    p2: { col: number; row: number };
    img1: HTMLImageElement;
    img2: HTMLImageElement;
}

export function AnimatedGridBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // State for rendering
    const [images, setImages] = useState<HTMLImageElement[]>([]);

    // Simulation State (refs for performance in loop)
    const state = useRef({
        mouseX: -1000,
        mouseY: -1000,
        isHovering: false,
        time: 0,
        pairs: [] as ActivePair[],
        lastSpawn: 0,
        gridPoints: [] as { x: number, y: number }[][], // [col][row]
        cols: 0,
        rows: 0
    });

    // 1. Preload Images
    useEffect(() => {
        const loaded: HTMLImageElement[] = [];
        let count = 0;
        chainUrls.forEach(url => {
            const img = new Image();
            img.src = url;
            img.onload = () => {
                count++;
                loaded.push(img);
                if (count === chainUrls.length) {
                    setImages(loaded);
                }
            };
        });
    }, []);

    // 2. Mouse Listener (Window level for strict tracking)
    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();

            // Strict Bounds Check
            const isInside = (
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom
            );

            if (isInside) {
                state.current.mouseX = e.clientX - rect.left;
                state.current.mouseY = e.clientY - rect.top;
                state.current.isHovering = true;
            } else {
                state.current.isHovering = false;
                state.current.mouseX = -1000;
                state.current.mouseY = -1000;
            }
        };
        window.addEventListener('mousemove', handleMove);
        return () => window.removeEventListener('mousemove', handleMove);
    }, []);

    // 3. Visibility Tracking for Performance
    const isInView = useInView(containerRef);

    // 4. Canvas Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || images.length < 2 || !isInView) return; // Pause if not visible
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animId: number;
        let width = 0;
        let height = 0;

        const resize = () => {
            if (!containerRef.current || !canvas) return;
            width = containerRef.current.offsetWidth;
            height = containerRef.current.offsetHeight;
            canvas.width = width;
            canvas.height = height;

            // Re-init grid
            const cols = Math.ceil(width / GRID_SIZE) + 2; // +2 buffer
            const rows = Math.ceil(height / GRID_SIZE) + 2;
            state.current.cols = cols;
            state.current.rows = rows;
            // Only init grid points if empty (preserve state on resume if desired, or reset)
            if (state.current.gridPoints.length === 0 || cols !== state.current.gridPoints.length) {
                state.current.gridPoints = Array(cols).fill(0).map(() => Array(rows).fill(0).map(() => ({ x: 0, y: 0 })));
            }
        };
        window.addEventListener('resize', resize);
        resize();

        const spawnPair = (now: number) => {
            const { cols, rows } = state.current;
            if (cols === 0) return;

            // Distinct Logos
            let idx1 = Math.floor(Math.random() * images.length);
            let idx2 = Math.floor(Math.random() * images.length);
            while (idx2 === idx1 && images.length > 1) {
                idx2 = Math.floor(Math.random() * images.length);
            }

            const p1 = { col: Math.floor(Math.random() * (cols - 2)) + 1, row: Math.floor(Math.random() * (rows - 2)) + 1 };

            // Random nearby p2
            const angle = Math.random() * Math.PI * 2;
            const dist = 3 + Math.random() * 4;
            const p2 = {
                col: Math.max(1, Math.min(cols - 2, Math.round(p1.col + Math.cos(angle) * dist))),
                row: Math.max(1, Math.min(rows - 2, Math.round(p1.row + Math.sin(angle) * dist)))
            };

            if (p1.col === p2.col && p1.row === p2.row) return;

            state.current.pairs.push({
                id: now,
                startTime: now,
                p1,
                p2,
                img1: images[idx1],
                img2: images[idx2]
            });
        };

        const render = () => {
            const now = Date.now();
            state.current.time += 1;
            const { mouseX, mouseY, time, cols, rows, gridPoints, isHovering } = state.current;

            // Cleanup old pairs
            state.current.pairs = state.current.pairs.filter(p => now - p.startTime < LIFECYCLE_DURATION + 1000);

            // Spawn new pair logic
            // Increased frequency means spawning more often
            if (state.current.pairs.length < MAX_CONCURRENT && now - state.current.lastSpawn > 600) {
                spawnPair(now);
                state.current.lastSpawn = now;
            }

            ctx.clearRect(0, 0, width, height);

            // 0. Draw Cursor Glow (Restored Hue)
            if (isHovering) {
                const glow = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 200);
                glow.addColorStop(0, 'rgba(0, 229, 229, 0.35)'); // Teal with low opacity
                glow.addColorStop(1, 'rgba(0, 229, 229, 0)');
                ctx.fillStyle = glow;
                ctx.fillRect(0, 0, width, height);
            }

            // 1. Calculate warped grid points
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const baseUrlX = (i - 1) * GRID_SIZE;
                    const baseUrlY = (j - 1) * GRID_SIZE;

                    const dx = baseUrlX - mouseX;
                    const dy = baseUrlY - mouseY;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    const z = Math.sin(dist * WAVE_FREQUENCY - time * WAVE_SPEED) * WAVE_AMPLITUDE * Math.exp(-dist * WAVE_DECAY);

                    gridPoints[i][j] = {
                        x: baseUrlX,
                        y: baseUrlY - z
                    };
                }
            }

            // 2. Draw Grid Lines
            ctx.strokeStyle = 'rgba(203, 213, 225, 0.5)'; // slate-300 with opacity
            ctx.lineWidth = 1;
            ctx.beginPath();

            // Vertical
            for (let i = 0; i < cols; i++) {
                if (gridPoints[i] && gridPoints[i][0]) {
                    ctx.moveTo(gridPoints[i][0].x, gridPoints[i][0].y);
                    for (let j = 1; j < rows; j++) {
                        ctx.lineTo(gridPoints[i][j].x, gridPoints[i][j].y);
                    }
                }
            }
            // Horizontal
            for (let j = 0; j < rows; j++) {
                if (gridPoints[0] && gridPoints[0][j]) {
                    ctx.moveTo(gridPoints[0][j].x, gridPoints[0][j].y);
                    for (let i = 1; i < cols; i++) {
                        ctx.lineTo(gridPoints[i][j].x, gridPoints[i][j].y);
                    }
                }
            }
            ctx.stroke();

            // 3. Draw Pairs (Logos + Lines)
            state.current.pairs.forEach(pair => {
                const age = now - pair.startTime;
                const p1 = gridPoints[pair.p1.col]?.[pair.p1.row];
                const p2 = gridPoints[pair.p2.col]?.[pair.p2.row];

                if (!p1 || !p2) return;

                // Opacity & Scale Logic
                // Fade In (Opacity 0->1, Scale 0.5->1)
                let op1 = Math.min(1, age / FADE_IN_DURATION);
                let sc1 = age < FADE_IN_DURATION ? 0.5 + 0.5 * easeOutBack(Math.min(1, age / FADE_IN_DURATION)) : 1;

                let op2 = Math.min(1, Math.max(0, (age - SPAWN_DELAY_BETWEEN_LOGOS) / FADE_IN_DURATION));
                let sc2 = (age - SPAWN_DELAY_BETWEEN_LOGOS) < FADE_IN_DURATION ? 0.5 + 0.5 * easeOutBack(Math.min(1, Math.max(0, (age - SPAWN_DELAY_BETWEEN_LOGOS) / FADE_IN_DURATION))) : 1;

                let opLine = Math.min(1, Math.max(0, (age - LINE_START_DELAY) / 1000));

                // Synced Exit logic: Pop out all elements together after active time
                const exitStart = LIFECYCLE_DURATION - POP_OUT_DURATION;

                if (age > exitStart) {
                    const progress = (age - exitStart) / POP_OUT_DURATION;
                    const exitScale = Math.max(0, 1 - easeInBack(Math.min(1, progress)));

                    // Everything scales scale out together
                    sc1 = exitScale;
                    op1 = exitScale;
                    sc2 = exitScale; // Second logo pops out even if it arrived later
                    op2 = exitScale;
                    opLine = exitScale; // Line pops out
                }

                // Draw Line
                if (age > LINE_START_DELAY && opLine > 0) {
                    const lineProgress = Math.min(1, (age - LINE_START_DELAY) / LINE_DURATION);
                    const endX = p1.x + (p2.x - p1.x) * lineProgress;
                    const endY = p1.y + (p2.y - p1.y) * lineProgress;

                    ctx.save();
                    ctx.globalAlpha = opLine;
                    ctx.strokeStyle = '#00E5E5';
                    ctx.lineWidth = 2; // Keep line sharp
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(endX, endY);
                    ctx.stroke();
                    ctx.restore();
                }

                // Draw Logo 1
                if (op1 > 0 && sc1 > 0) {
                    drawIcon(ctx, pair.img1, p1.x, p1.y, op1, sc1);
                }

                // Draw Logo 2
                if (op2 > 0 && sc2 > 0) {
                    drawIcon(ctx, pair.img2, p2.x, p2.y, op2, sc2);
                }
            });

            animId = requestAnimationFrame(render);
        };

        animId = requestAnimationFrame(render);
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, [images, isInView]);

    return (
        <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,white,transparent_80%)]">
                <canvas ref={canvasRef} />
            </div>
        </div>
    );
}

function easeOutBack(x: number): number {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

function easeInBack(x: number): number {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return c3 * x * x * x - c1 * x * x;
}

function drawIcon(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, opacity: number, scale: number = 1) {
    if (opacity <= 0 || scale <= 0) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.globalAlpha = opacity;
    ctx.shadowColor = 'rgba(0,0,0,0.1)';
    ctx.shadowBlur = 10;

    // Size increased by 50% (20px radius -> 30px radius)
    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#f1f5f9';
    ctx.stroke();

    // Image (24px -> 36px)
    ctx.drawImage(img, -18, -18, 36, 36);

    ctx.restore();
}
