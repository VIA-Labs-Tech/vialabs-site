import { useEffect, useState } from 'react';
import type { ReactNode, RefObject } from 'react';

// Shared by both "How it works" directions: the step copy, scroll progress, the scroll cue,
// the progress rail, and the stacked version for phones, tablets, and reduced motion.

export const NAV = 72; // the fixed navigation bar
export const STEP_VH = 80; // scrolling distance per step, in viewport heights

export const FROM = { key: '17000', name: 'Ethereum' };
export const TO = { key: 'cardano', name: 'Cardano' };

export const STEPS = [
    { word: 'Send', text: 'Your contract calls the VIA gateway on its own chain. A message can carry tokens, data, or a contract call.' },
    { word: 'Confirm', text: 'The message waits for the number of block confirmations you set. Each new block makes the earlier ones harder to reverse.' },
    { word: 'Sign', text: 'Signers run by VIA Labs check the message on the source chain, then sign it. You choose what else must sign.' },
    { word: 'Deliver', text: `A relayer carries the signed message to ${TO.name}. The gateway there checks every signature. Relayers can't change a message.` },
    { word: 'Receive', text: `Your contract on ${TO.name} acts on the message. Here, it adds 100 tokens to an account.` },
];
export const LAYERS = ['VIA Layer', 'Chain Layer', 'Project Layer'];
export const BLOCKS = 12;

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const ease = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
export const easeOutBack = (x: number) => 1 + 2.70158 * Math.pow(x - 1, 3) + 1.70158 * Math.pow(x - 1, 2);
export const span = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

// How far the page has scrolled through a tall track, from 0 to 1. It glides toward the
// scroll position instead of jumping, so the picture moves smoothly with a mouse wheel.
export function useTrackProgress(track: RefObject<HTMLElement>) {
    const [p, setP] = useState(0);
    useEffect(() => {
        let raf = 0, shown = 0, target = 0;
        const measure = () => {
            const el = track.current;
            if (!el) return;
            const total = el.offsetHeight - (window.innerHeight - NAV);
            target = clamp01((NAV - el.getBoundingClientRect().top) / Math.max(1, total));
        };
        const loop = () => {
            measure();
            shown += (target - shown) * 0.16;
            if (Math.abs(target - shown) < 0.0004) shown = target;
            setP(shown);
            raf = shown === target ? 0 : requestAnimationFrame(loop);
        };
        const kick = () => {
            if (!raf) raf = requestAnimationFrame(loop);
        };
        measure();
        shown = target;
        setP(shown);
        window.addEventListener('scroll', kick, { passive: true });
        window.addEventListener('resize', kick);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('scroll', kick);
            window.removeEventListener('resize', kick);
        };
    }, [track]);
    return p;
}

// A mouse with a moving wheel, shown until the reader starts scrolling
export function ScrollCue({ show, label, className = '' }: { show: boolean; label: string; className?: string }) {
    return (
        <div className={`pointer-events-none flex flex-col items-center gap-3 transition-opacity duration-500 ${show ? 'opacity-100' : 'opacity-0'} ${className}`} aria-hidden="true">
            <span className="relative block h-11 w-7 rounded-full border-2 border-current">
                <span className="scroll-wheel absolute left-1/2 top-2 h-2.5 w-1 -ml-0.5 rounded-full bg-current" />
            </span>
            <span className="text-sm font-semibold tracking-wide">{label}</span>
        </div>
    );
}

// Five step names under a line that fills with progress. It is a gauge, not a set of buttons.
export function ProgressRail({ p, dark }: { p: number; dark?: boolean }) {
    const at = p * STEPS.length;
    return (
        <div aria-hidden="true">
            <div className={`relative h-0.5 rounded-full ${dark ? 'bg-white/10' : 'bg-slate-200 dark:bg-white/10'}`}>
                <div className={`absolute inset-y-0 left-0 rounded-full ${dark ? 'bg-white/60' : 'bg-cyan-600 dark:bg-via-teal'}`} style={{ width: `${p * 100}%` }} />
            </div>
            <div className="mt-3 grid grid-cols-5">
                {STEPS.map((s, i) => (
                    <span
                        key={s.word}
                        className={`text-sm font-semibold transition-colors duration-300 ${
                            at >= i ? (dark ? 'text-white' : 'text-slate-900 dark:text-white') : dark ? 'text-slate-600' : 'text-slate-400 dark:text-slate-600'
                        }`}
                    >
                        <span className="tabular-nums">{String(i + 1).padStart(2, '0')}</span> {s.word}
                    </span>
                ))}
            </div>
        </div>
    );
}

// The current step's number, name, and sentence. It rises into place each time the step changes.
export function StepText({ step, dark }: { step: number; dark?: boolean }) {
    const s = STEPS[step];
    return (
        <div key={step} className="journey-rise">
            <p className={`text-sm font-semibold tabular-nums ${dark ? 'text-slate-400' : 'text-cyan-700 dark:text-via-teal'}`}>
                {String(step + 1).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}
            </p>
            <h3 className={`mt-2 text-6xl font-semibold tracking-tightest xl:text-7xl ${dark ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{s.word}</h3>
            <p className={`mt-5 max-w-sm text-lg leading-relaxed ${dark ? 'text-slate-300' : 'text-body'}`}>{s.text}</p>
        </div>
    );
}

// Phones, tablets, and reduced motion: the steps stacked, each with a still picture
export function StackedSteps({ picture, dark }: { picture: (i: number) => ReactNode; dark?: boolean }) {
    return (
        <ol className="container-x space-y-14 pb-20 md:pb-28">
            {STEPS.map((s, i) => (
                <li key={s.word} className="grid gap-6 md:grid-cols-2 md:items-center md:gap-10">
                    <div>
                        <p className={`text-sm font-semibold tabular-nums ${dark ? 'text-slate-400' : 'text-cyan-700 dark:text-via-teal'}`}>{String(i + 1).padStart(2, '0')}</p>
                        <h3 className={`mt-1 text-3xl font-semibold tracking-tight ${dark ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{s.word}</h3>
                        <p className={`mt-3 text-lg ${dark ? 'text-slate-300' : 'text-body'}`}>{s.text}</p>
                    </div>
                    {picture(i)}
                </li>
            ))}
        </ol>
    );
}
