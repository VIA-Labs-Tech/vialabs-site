import type { ReactNode } from 'react';
import { ArrowRight, Plus } from 'lucide-react';
import { MeshHero } from './MeshHero';
import { useOpenOnboarding } from '../onboarding';
import { chainLogo } from '../chains';
import { HELLO_WORLD } from '../links';

// Page section with consistent spacing. "white" alternates the background for rhythm.
export function Section({ id, tone = 'plain', className = '', children }: { id?: string; tone?: 'plain' | 'white'; className?: string; children: ReactNode }) {
    const bg = tone === 'white' ? 'bg-white dark:bg-ink-900 border-y hairline' : '';
    return (
        <section id={id} className={`${bg} scroll-mt-24 ${className}`}>
            <div className="container-x py-20 md:py-28">{children}</div>
        </section>
    );
}

export function SectionHeading({ title, intro, className = '' }: { title: ReactNode; intro?: ReactNode; className?: string }) {
    return (
        <div className={`max-w-3xl mb-12 md:mb-16 ${className}`}>
            <h2 className="h-section">{title}</h2>
            {intro && <p className="mt-5 text-lg md:text-xl text-body">{intro}</p>}
        </div>
    );
}

// Numbered steps: plain numerals, a title, and detail, separated by hairlines.
export function Steps({ items }: { items: { title?: ReactNode; text: ReactNode }[] }) {
    return (
        <ol className="border-t hairline">
            {items.map((item, i) => (
                <li key={i} className="grid grid-cols-[2.5rem_1fr] md:grid-cols-[4rem_1fr] gap-2 py-6 border-b hairline">
                    <span className="text-lg font-semibold text-slate-400 dark:text-slate-500 tabular-nums">{i + 1}</span>
                    <div>
                        {item.title && <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{item.title}</h3>}
                        <p className={`text-body ${item.title ? 'mt-1' : ''}`}>{item.text}</p>
                    </div>
                </li>
            ))}
        </ol>
    );
}

export interface FaqItem {
    q: string;
    a: ReactNode;
}

// Each answer opens under its question. The answers stay in the page's HTML, so search tools still read them.
export function FaqList({ items }: { items: FaqItem[] }) {
    return (
        <div className="border-t hairline">
            {items.map((item) => (
                <details key={item.q} className="faq group border-b hairline">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                        <h3 className="text-lg font-semibold text-slate-900 transition-colors group-hover:text-cyan-700 dark:text-white dark:group-hover:text-via-teal">
                            {item.q}
                        </h3>
                        <span
                            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-300/80 text-slate-500 transition-all duration-300 group-open:rotate-45 group-open:border-cyan-500/50 group-open:text-cyan-600 dark:border-white/15 dark:text-slate-400 dark:group-open:text-via-teal"
                            aria-hidden="true"
                        >
                            <Plus size={16} />
                        </span>
                    </summary>
                    <div className="faq-answer max-w-3xl space-y-3 pb-7 pr-14 text-body">{item.a}</div>
                </details>
            ))}
        </div>
    );
}

// Label and value pairs as a definition list, readable by people and by search tools.
export function KeyFacts({ rows }: { rows: [string, ReactNode][] }) {
    return (
        <dl className="card overflow-hidden divide-y divide-slate-200/80 dark:divide-white/[0.07]">
            {rows.map(([label, value]) => (
                <div key={label} className="grid sm:grid-cols-[14rem_1fr] gap-1 sm:gap-6 px-6 py-4">
                    <dt className="font-semibold text-slate-900 dark:text-white">{label}</dt>
                    <dd className="text-body">{value}</dd>
                </div>
            ))}
        </dl>
    );
}

// A static floor grid in perspective, echoing the home page mesh.
export function PerspectiveFloor() {
    return (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] overflow-hidden" aria-hidden="true">
            <div className="absolute inset-0 [perspective:700px]">
                <div
                    className="absolute left-[-50%] right-[-50%] bottom-[-10%] h-[160%] origin-bottom [transform:rotateX(64deg)] opacity-[0.55] dark:opacity-[0.45]
                        [background-image:linear-gradient(to_right,rgba(15,23,42,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.12)_1px,transparent_1px)]
                        dark:[background-image:linear-gradient(to_right,rgba(0,229,229,0.22)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,229,229,0.22)_1px,transparent_1px)]
                        [background-size:56px_56px] [mask-image:linear-gradient(to_top,black_10%,transparent_75%)]"
                />
            </div>
            <div className="absolute inset-x-0 top-[25%] h-24 bg-gradient-to-r from-via-teal/0 via-via-teal/10 to-via-pink/10 blur-2xl" />
        </div>
    );
}

// Header for the inner pages: the home page's moving floor, without logos, behind the words.
export function PageHero({ title, children }: { title: ReactNode; children?: ReactNode }) {
    return (
        <section className="relative overflow-hidden border-b hairline">
            <MeshHero withLogos={false} />
            <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-b from-paper via-paper/80 to-transparent md:bg-gradient-to-r md:from-paper md:via-paper/70 md:to-transparent dark:from-ink dark:via-ink/80 md:dark:via-ink/60"
                aria-hidden="true"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-paper to-transparent dark:from-ink" aria-hidden="true" />
            <div className="container-x relative pt-36 md:pt-44 pb-20 md:pb-28">
                <h1 className="h-display text-5xl md:text-7xl max-w-4xl animate-fade-up">{title}</h1>
                {children && <div className="mt-7 max-w-2xl text-lg md:text-xl text-body space-y-4 animate-fade-up [animation-delay:120ms]">{children}</div>}
            </div>
        </section>
    );
}

export function CtaBand({ title = "Tell us what you're building", text = 'Our team helps you pick your chains and a pattern, then go live.' }: { title?: string; text?: string }) {
    const openOnboarding = useOpenOnboarding();
    return (
        <section className="container-x pb-24 md:pb-32">
            <div className="relative overflow-hidden rounded-[2rem] bg-ink-900 text-white px-8 py-14 md:px-16 md:py-20 shadow-panel dark:border dark:border-white/[0.07]">
                <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(0,229,229,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,229,229,0.18)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_80%_100%,black,transparent_70%)]" aria-hidden="true" />
                <div className="relative max-w-2xl">
                    <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">{title}</h2>
                    <p className="mt-5 text-lg text-slate-300">{text}</p>
                    <div className="mt-9 flex flex-col sm:flex-row gap-3">
                        <button onClick={openOnboarding} className="btn bg-white text-ink-900 hover:bg-slate-100">
                            Talk to our team
                        </button>
                        <a href={HELLO_WORLD} target="_blank" rel="noopener noreferrer" className="btn border border-white/20 text-white hover:border-white/40 hover:bg-white/[0.05]">
                            Start building <ArrowRight size={17} aria-hidden="true" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

// A chain logo that follows the theme through CSS.
export function ChainMark({ chain, label, className = 'h-7 w-7' }: { chain: string; label: string; className?: string }) {
    const logo = chainLogo(chain);
    if (!logo) return null;
    return (
        <>
            <img src={logo.light} alt={label} className={`${className} dark:hidden`} loading="lazy" width={28} height={28} />
            <img src={logo.dark} alt={label} className={`${className} hidden dark:block`} loading="lazy" width={28} height={28} />
        </>
    );
}

export function ExternalLink({ href, children, className = 'link-arrow' }: { href: string; children: ReactNode; className?: string }) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
            {children} <ArrowRight size={16} aria-hidden="true" />
        </a>
    );
}
