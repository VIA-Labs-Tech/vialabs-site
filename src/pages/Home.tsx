import { Link } from 'react-router-dom';
import type { ComponentType } from 'react';
import { ArrowRight } from 'lucide-react';
import { MeshHero } from '../components/MeshHero';
import { CodeWindow } from '../components/CodeWindow';
import { AppsVisual, AssetsVisual, DataVisual, MessagesVisual, RoutingVisual } from '../components/home/BuildVisuals';
import { EcosystemRow } from '../components/home/EcosystemRow';
import type { Ecosystem } from '../components/home/EcosystemRow';
import { LiveOnMarquee } from '../components/home/LiveOnMarquee';
import { NetworkGlobe } from '../components/home/NetworkGlobe';
import { MessageJourney } from '../components/home/MessageJourney';
import { CtaBand, ExternalLink, Section, SectionHeading } from '../components/ui';
import { useReveal } from '../hooks/useReveal';
import { useOpenOnboarding } from '../onboarding';
import { AUDITS, HELLO_WORLD, SUPPORTED_NETWORKS } from '../links';

const stats = [
    { value: '150+', label: 'chains connected' },
    { value: '20M+', label: 'messages delivered' },
    { value: '4+ years', label: 'in production' },
    { value: 'Zero', label: 'exploits' },
];

// Chain keys match the logo files in src/assets/chains. 17000 is the Ethereum mark.
const liveOn: [string, string][] = [
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
];

const capabilities: { title: string; text: string; Visual: ComponentType; wide?: boolean }[] = [
    { title: 'Native cross-chain assets', text: 'Tokens and NFTs that move between chains and keep one total supply.', Visual: AssetsVisual, wide: true },
    { title: 'Broadcast', text: 'Send one contract call to many chains in a single action.', Visual: RoutingVisual },
    { title: 'Universal message passing', text: 'Send any data or contract call between supported chains.', Visual: MessagesVisual },
    { title: 'Web2 to Web3 data', text: 'Deliver off-chain data, plain or encrypted, directly into smart contracts.', Visual: DataVisual },
    { title: 'Unified dApps', text: 'Extend your app to other chains and virtual machines, so users reach it from the chain they already use.', Visual: AppsVisual },
];

const ecosystems: Ecosystem[] = [
    { name: 'EVM chains', lang: 'Solidity', marks: [['42161', 'Arbitrum'], ['43114', 'Avalanche'], ['8453', 'Base'], ['10', 'Optimism'], ['137', 'Polygon']] },
    { name: 'Cardano', lang: 'Aiken', marks: [['cardano', 'Cardano']] },
    { name: 'Midnight', lang: 'Compact', marks: [['midnight', 'Midnight']] },
    { name: 'Stellar', lang: 'Rust', marks: [['stellar', 'Stellar']] },
];

function Hero() {
    const openOnboarding = useOpenOnboarding();
    return (
        <section className="relative overflow-hidden min-h-[640px] md:min-h-[860px] flex flex-col">
            <MeshHero />
            {/* Keeps the words readable over the mesh */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-paper via-paper/80 to-transparent md:bg-gradient-to-r md:from-paper md:via-paper/75 md:to-transparent dark:from-ink dark:via-ink/80 md:dark:via-ink/70" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-paper to-transparent dark:from-ink" aria-hidden="true" />

            <div className="container-x w-full relative flex-1 flex flex-col pt-32 md:pt-44">
                <div className="max-w-2xl">
                    <h1 className="h-display text-[2.75rem] leading-[1.05] sm:text-6xl lg:text-7xl animate-fade-up">
                        Move value and data across 150+ blockchains.
                    </h1>
                    <p className="mt-7 text-lg md:text-xl text-body max-w-xl animate-fade-up [animation-delay:120ms]">
                        VIA is a cross-chain messaging network for EVM and non-EVM chains. Your smart contracts send tokens, data, and
                        instructions to each other. You choose who must sign each message.
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row gap-3 animate-fade-up [animation-delay:240ms]">
                        <a href={HELLO_WORLD} target="_blank" rel="noopener noreferrer" className="btn-primary">
                            Start building <ArrowRight size={17} aria-hidden="true" />
                        </a>
                        <button onClick={openOnboarding} className="btn-secondary">Talk to our team</button>
                    </div>
                </div>

                <div className="relative mt-auto pt-16 pb-10 md:pb-14 animate-fade-up [animation-delay:360ms]">
                    <dl className="grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden rounded-2xl border border-slate-200/80 dark:border-white/[0.08] bg-slate-200/80 dark:bg-white/[0.08] shadow-card dark:shadow-card-dark">
                        {stats.map((s) => (
                            <div key={s.label} className="flex flex-col-reverse bg-white/85 dark:bg-ink-800/90 backdrop-blur px-6 py-6 md:py-7">
                                <dt className="mt-1 text-sm text-muted">{s.label}</dt>
                                <dd className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">{s.value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </section>
    );
}

export function Home() {
    useReveal();
    return (
        <main>
            <Hero />

            {/* Live on */}
            <section className="border-y hairline bg-white dark:bg-ink-900">
                <div className="container-x py-7 flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-10">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white shrink-0">Live on</p>
                    <LiveOnMarquee chains={liveOn} />
                    <ExternalLink href={SUPPORTED_NETWORKS} className="link-arrow text-sm shrink-0">All networks</ExternalLink>
                </div>
            </section>

            {/* What you can build */}
            <Section>
                <div data-reveal>
                    <SectionHeading
                        title="What you can build with VIA"
                        intro="The VIA network carries data between smart contracts on different chains. What gets built on top, whether bridges, DEXs, marketplaces, or oracle feeds, is up to the developer."
                    />
                </div>
                <div className="panel">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                        {capabilities.map(({ title, text, Visual, wide }, i) => (
                            <div key={title} data-reveal style={{ transitionDelay: `${(i % 3) * 80}ms` }} className={wide ? 'sm:col-span-2' : ''}>
                                <article className="card card-hover h-full overflow-hidden flex flex-col">
                                    <div className="h-44 border-b hairline bg-slate-50/70 dark:bg-white/[0.015] [background-image:radial-gradient(rgba(15,23,42,0.07)_1px,transparent_1px)] dark:[background-image:radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:14px_14px]">
                                        <Visual />
                                    </div>
                                    <div className="p-7">
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
                                        <p className="mt-2 text-body">{text}</p>
                                    </div>
                                </article>
                            </div>
                        ))}
                    </div>
                </div>
                <Link to="/use-cases" className="link-arrow mt-8">
                    See what teams build <ArrowRight size={16} aria-hidden="true" />
                </Link>
            </Section>

            {/* How it works, as a journey that also covers definable security */}
            <MessageJourney />

            {/* The network */}
            <section className="relative overflow-hidden border-y border-white/[0.06] bg-ink-900 text-white">
                <div className="container-x grid items-center gap-12 py-20 md:py-28 lg:grid-cols-12">
                    <div className="lg:col-span-5" data-reveal>
                        <h2 className="text-3xl font-semibold tracking-tight md:text-[2.75rem] md:leading-[1.1]">One network. 150+ chains.</h2>
                        <p className="mt-5 text-lg text-slate-300 md:text-xl">
                            When a chain connects to VIA, it joins the whole network. Contracts on any connected chain can send tokens, data, and
                            calls to contracts on the others.
                        </p>
                        <p className="mt-4 text-slate-400">
                            Teams build liquidity transfers, oracle and data feeds, AI agent integrations, and cross-chain tokens and apps. USDM, the
                            fiat-backed stablecoin from Moneta, moves between Cardano and Midnight using VIA.
                        </p>
                        <Link to="/use-cases" className="mt-8 inline-flex items-center gap-1.5 font-semibold text-white transition-colors hover:text-via-teal">
                            See use cases <ArrowRight size={16} aria-hidden="true" />
                        </Link>
                    </div>
                    <div className="lg:col-span-7" data-reveal style={{ transitionDelay: '80ms' }}>
                        <div className="mx-auto max-w-[620px]">
                            <NetworkGlobe />
                        </div>
                    </div>
                </div>
            </section>

            {/* Ecosystems */}
            <Section tone="white">
                <div data-reveal>
                    <SectionHeading
                        title="Build on EVM and non-EVM chains"
                        intro="Your message follows the same path on every chain. Projects deploy and own their own cross-chain contracts."
                    />
                </div>
                <EcosystemRow ecosystems={ecosystems} />
                <div className="mt-8">
                    <ExternalLink href={SUPPORTED_NETWORKS}>See supported networks</ExternalLink>
                </div>
            </Section>

            {/* Developers */}
            <section className="bg-ink-900 text-white border-y border-white/[0.06]">
                <div className="container-x py-20 md:py-28 grid lg:grid-cols-2 gap-14 items-center">
                    <div data-reveal>
                        <h2 className="text-3xl md:text-[2.75rem] md:leading-[1.1] font-semibold tracking-tight">For developers</h2>
                        <p className="mt-5 text-lg text-slate-300">Inherit one contract. Override one function.</p>
                        <ol className="mt-8 border-t border-white/10">
                            {['Add the VIA contracts to your project.', 'Deploy your contract on each chain.', 'Set which contracts can message each other.', 'Send a message.'].map((s, i) => (
                                <li key={s} className="grid grid-cols-[2.5rem_1fr] py-4 border-b border-white/10">
                                    <span className="font-semibold text-slate-500 tabular-nums">{i + 1}</span>
                                    <span className="text-slate-200">{s}</span>
                                </li>
                            ))}
                        </ol>
                        <a href={HELLO_WORLD} target="_blank" rel="noopener noreferrer" className="btn mt-10 bg-white text-ink-900 hover:bg-slate-100">
                            Start with Hello World <ArrowRight size={17} aria-hidden="true" />
                        </a>
                    </div>
                    <div className="min-w-0" data-reveal style={{ transitionDelay: '80ms' }}>
                        <CodeWindow />
                    </div>
                </div>
            </section>

            {/* Audits */}
            <Section>
                <div data-reveal>
                    <div className="card p-8 md:p-12 grid md:grid-cols-12 gap-8 items-center">
                        <div className="md:col-span-7">
                            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">Independently audited</h2>
                            <p className="mt-4 text-lg text-body">
                                Anastasia Labs, Firepan, and Hashlock audited VIA's contracts on EVM chains, Cardano, Midnight, and Stellar. Every report is public.
                            </p>
                        </div>
                        <div className="md:col-span-5 md:text-right">
                            <a href={AUDITS} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                                Read the audits <ArrowRight size={17} aria-hidden="true" />
                            </a>
                        </div>
                    </div>
                </div>
            </Section>

            <div className="pt-4" />
            <div data-reveal>
                <CtaBand />
            </div>
        </main>
    );
}
