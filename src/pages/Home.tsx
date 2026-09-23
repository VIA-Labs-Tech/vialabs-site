import { Link } from 'react-router-dom';
import { ArrowLeftRight, ArrowRight, Bot, Coins, Database, Globe, Link as LinkIcon, ShieldCheck } from 'lucide-react';
import { MeshHero } from '../components/MeshHero';
import { CodeWindow } from '../components/CodeWindow';
import { ChainMark, CtaBand, ExternalLink, FaqList, Section, SectionHeading, Steps } from '../components/ui';
import { useOpenOnboarding } from '../onboarding';
import { faq } from '../content';
import { AUDITS, HELLO_WORLD, SUPPORTED_NETWORKS } from '../links';

const stats = [
    { value: '150+', label: 'networks connected' },
    { value: '20M+', label: 'messages delivered' },
    { value: '4+ years', label: 'in production' },
    { value: 'Zero', label: 'exploits' },
];

const liveOn = ['Ethereum', 'Arbitrum', 'Avalanche', 'Base', 'BSC', 'Optimism', 'Polygon', 'Cardano', 'Midnight', 'Stellar'];

const capabilities = [
    { title: 'Native cross-chain assets', text: 'Tokens and NFTs that move between chains and keep one total supply.' },
    { title: 'Unified dApps', text: 'Extend your app to other chains and virtual machines, so users reach it from the chain they already use.' },
    { title: 'Universal message passing', text: 'Send any data or contract call between supported chains.' },
    { title: 'Multi-hop routing', text: 'Send one contract call to many chains in a single action.' },
    { title: 'Web2 to Web3 data', text: 'Deliver off-chain data, plain or encrypted, directly into smart contracts.' },
];

const layers = [
    { icon: Globe, title: 'VIA Layer', badge: 'Always on', text: 'Signers run by VIA Labs. They check every message on its source chain, then sign it.' },
    { icon: LinkIcon, title: 'Chain Layer', badge: 'Optional', text: 'Add signers run by the chain itself. Messages need their signature too.' },
    { icon: ShieldCheck, title: 'Project Layer', badge: 'Optional', text: 'Add signers run by your team. Nothing reaches your contract without your signature.' },
];

const ecosystems = [
    { name: 'EVM chains', lang: 'Solidity', marks: [['42161', 'Arbitrum'], ['43114', 'Avalanche'], ['8453', 'Base'], ['10', 'Optimism'], ['137', 'Polygon']] },
    { name: 'Cardano', lang: 'Aiken', marks: [['cardano', 'Cardano']] },
    { name: 'Midnight', lang: 'Compact', marks: [['midnight', 'Midnight']] },
    { name: 'Stellar', lang: 'Rust', marks: [['stellar', 'Stellar']] },
];

const builds = [
    { icon: ArrowLeftRight, label: 'Liquidity transfers' },
    { icon: Database, label: 'Oracle and data feeds' },
    { icon: Bot, label: 'AI agent integrations' },
    { icon: Coins, label: 'Cross-chain tokens and apps' },
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
                        VIA Labs is a cross-chain messaging protocol for EVM and non-EVM chains. Your smart contracts send tokens, data, and
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
    return (
        <main>
            <Hero />

            {/* Live on */}
            <section className="border-y hairline bg-white dark:bg-ink-900">
                <div className="container-x py-8 flex flex-col lg:flex-row lg:items-start gap-5 lg:gap-10">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white shrink-0 lg:pt-0.5">Live on</p>
                    <div className="flex-1">
                        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[15px] font-medium text-slate-500 dark:text-slate-400">
                            {liveOn.map((name) => <li key={name}>{name}</li>)}
                        </ul>
                        <p className="mt-2 text-sm text-muted">Listed in the Circle Alliance Directory.</p>
                    </div>
                    <ExternalLink href={SUPPORTED_NETWORKS} className="link-arrow text-sm shrink-0">All networks</ExternalLink>
                </div>
            </section>

            {/* What you can build */}
            <Section>
                <SectionHeading
                    title="What you can build with VIA"
                    intro="We pass data between smart contracts on different chains. What gets built on top, whether bridges, DEXs, marketplaces, or oracle feeds, is up to the developer."
                />
                <div className="panel">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                        {capabilities.map((c) => (
                            <div key={c.title} className="card card-hover p-7">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{c.title}</h3>
                                <p className="mt-2 text-body">{c.text}</p>
                            </div>
                        ))}
                        <Link to="/use-cases" className="card card-hover p-7 flex flex-col justify-between group">
                            <p className="text-lg font-semibold text-slate-900 dark:text-white">See what teams build</p>
                            <span className="link-arrow mt-6">Use cases <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" /></span>
                        </Link>
                    </div>
                </div>
            </Section>

            {/* How it works */}
            <Section tone="white">
                <div className="grid lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-5">
                        <h2 className="h-section">How it works</h2>
                        <p className="mt-5 text-lg text-body">Three steps carry a message from one chain to another.</p>
                        <Link to="/overview" className="link-arrow mt-8">See how VIA works <ArrowRight size={16} aria-hidden="true" /></Link>
                    </div>
                    <div className="lg:col-span-7">
                        <Steps
                            items={[
                                { title: 'Your contract sends a message.', text: 'It calls the VIA gateway on its chain.' },
                                { title: 'Signers check it and sign it.', text: 'They confirm the message on the source chain first.' },
                                { title: 'Your other contract receives it.', text: 'A relayer delivers the signed message to the destination chain.' },
                            ]}
                        />
                    </div>
                </div>
            </Section>

            {/* Security */}
            <Section>
                <SectionHeading title="Definable security" intro="The VIA Layer signs every message. You choose what else must sign it." />
                <div className="grid md:grid-cols-3 gap-4">
                    {layers.map(({ icon: Icon, title, badge, text }) => (
                        <div key={title} className="card p-7">
                            <div className="flex items-center justify-between">
                                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/[0.06] text-slate-900 dark:text-via-teal">
                                    <Icon size={21} aria-hidden="true" />
                                </span>
                                <span className="text-xs font-medium rounded-full px-2.5 py-1 bg-slate-100 text-slate-600 dark:bg-white/[0.06] dark:text-slate-300">{badge}</span>
                            </div>
                            <h3 className="mt-6 text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
                            <p className="mt-2 text-body">{text}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <p className="text-body">Every active layer must sign. If one does not, the message is rejected.</p>
                    <Link to="/overview#security" className="link-arrow shrink-0">Try the security model <ArrowRight size={16} aria-hidden="true" /></Link>
                </div>
            </Section>

            {/* Ecosystems */}
            <Section tone="white">
                <SectionHeading
                    title="Build on EVM and non-EVM chains"
                    intro="Your message follows the same path on every chain. Projects deploy and own their own cross-chain contracts."
                />
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {ecosystems.map((e) => (
                        <div key={e.name} className="card p-7 flex flex-col">
                            <div className="flex items-center -space-x-1.5">
                                {e.marks.map(([key, label]) => (
                                    <span key={key} className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-ink-700 border border-slate-200 dark:border-white/10 shadow-sm">
                                        <ChainMark chain={key} label={label} className="h-6 w-6" />
                                    </span>
                                ))}
                            </div>
                            <h3 className="mt-6 text-lg font-semibold text-slate-900 dark:text-white">{e.name}</h3>
                            <p className="mt-1 text-body">Contracts in {e.lang}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-8">
                    <ExternalLink href={SUPPORTED_NETWORKS}>See supported networks</ExternalLink>
                </div>
            </Section>

            {/* What teams build */}
            <Section>
                <div className="grid lg:grid-cols-12 gap-12 items-start">
                    <div className="lg:col-span-5">
                        <h2 className="h-section">What teams build</h2>
                        <p className="mt-5 text-lg text-body">
                            Teams use VIA for liquidity transfers, oracle and data feeds, AI agent integrations, and cross-chain tokens and apps.
                        </p>
                        <p className="mt-4 text-body">USDM, the fiat-backed stablecoin from Moneta, moves between Cardano and Midnight using VIA.</p>
                        <Link to="/use-cases" className="link-arrow mt-8">See use cases <ArrowRight size={16} aria-hidden="true" /></Link>
                    </div>
                    <ul className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
                        {builds.map(({ icon: Icon, label }) => (
                            <li key={label} className="card p-6 flex items-center gap-4">
                                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/[0.06] text-slate-900 dark:text-via-teal">
                                    <Icon size={21} aria-hidden="true" />
                                </span>
                                <span className="text-lg font-semibold text-slate-900 dark:text-white">{label}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </Section>

            {/* Developers */}
            <section className="bg-ink-900 text-white border-y border-white/[0.06]">
                <div className="container-x py-20 md:py-28 grid lg:grid-cols-2 gap-14 items-center">
                    <div>
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
                    <CodeWindow />
                </div>
            </section>

            {/* Audits */}
            <Section>
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
            </Section>

            {/* Questions */}
            <Section tone="white">
                <SectionHeading title="Common questions" />
                <FaqList
                    items={[
                        faq.bridge,
                        faq.chains,
                        {
                            q: 'How much does a message cost?',
                            a: <p>The sender pays one delivery fee on the source chain, in its native token. It covers delivery on every destination chain except Ethereum.</p>,
                        },
                    ]}
                />
                <Link to="/about#faq" className="link-arrow mt-8">More questions <ArrowRight size={16} aria-hidden="true" /></Link>
            </Section>

            <div className="pt-24 md:pt-32" />
            <CtaBand />
        </main>
    );
}
