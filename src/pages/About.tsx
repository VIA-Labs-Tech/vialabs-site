import { ArrowRight, BadgeCheck, Camera, Code2, Coins, Database, DollarSign, KeyRound, Layers, MessagesSquare, Network, Receipt, Search, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { CtaBand, FaqList, KeyFacts, PageHero, Section, SectionHeading } from '../components/ui';
import { useReveal } from '../hooks/useReveal';
import { useOpenOnboarding } from '../onboarding';
import { faq } from '../content';
import { DISCORD, DOCS, EMAIL, GITHUB, HELLO_WORLD, SCAN, SUPPORTED_NETWORKS, TELEGRAM, X } from '../links';
import cletusPhoto from '../assets/team/cletus.webp';

const services: { icon: LucideIcon; title: string; text: string }[] = [
    {
        icon: MessagesSquare,
        title: 'Cross-chain messaging',
        text: 'Your contract on one chain sends a message. Your contract on another chain receives it and acts on it. A message can carry tokens, NFT data, instructions, or any data your contract can encode.',
    },
    {
        icon: Coins,
        title: 'Cross-chain tokens',
        text: 'Launch one token on many chains with one total supply. VIA supports three patterns: burn and mint, lock and mint, and lock and release. You deploy and own the token contracts.',
    },
    {
        icon: DollarSign,
        title: 'USDC launches for chains',
        text: "We help chains launch USDC with Circle's Bridged USDC Standard. We deploy the contracts, help with testnet and mainnet verification, and provide a web app for transfers. VIA Labs is listed in the Circle Alliance Directory.",
    },
    {
        icon: Database,
        title: 'Off-chain data',
        text: 'Bring data from outside the blockchain into your smart contracts, plain or encrypted. You run the data source, and VIA delivers the data to any connected chain.',
    },
    {
        icon: Network,
        title: 'Chain integrations',
        text: 'We connect blockchains to the VIA network. We deploy the gateway contracts, run the signers and relayers, and add the chain to VIA Scan.',
    },
    {
        icon: Code2,
        title: 'Custom development',
        text: 'We build and deploy custom contracts and apps on VIA for partners.',
    },
];

const differences: { icon: LucideIcon; title: string; text: string }[] = [
    {
        icon: Layers,
        title: 'EVM and non-EVM chains, one pattern',
        text: 'VIA runs on EVM chains, Cardano, Midnight, and Stellar. Developers write in Solidity, Aiken, Compact, or Rust. Every message follows the same path: send, sign, and deliver.',
    },
    {
        icon: ShieldCheck,
        title: 'You choose who signs',
        text: "Signers run by VIA Labs sign every message. You can also require the chain's own signers and signers your team runs. Every active layer must sign, or the message is rejected.",
    },
    {
        icon: KeyRound,
        title: 'Your contracts stay yours',
        text: 'Projects deploy and own their own cross-chain contracts. Your contract accepts messages only from the VIA gateway and only from the contracts you list. VIA carries the messages.',
    },
    {
        icon: BadgeCheck,
        title: 'Four years in production, zero exploits',
        text: 'VIA has delivered more than 20 million cross-chain messages across four years in production. In that time, VIA has had zero exploits.',
    },
    {
        icon: Search,
        title: 'Public audits and a public explorer',
        text: "Anastasia Labs, Firepan, and Hashlock audited VIA's contracts, and the reports are public. You can look up any message on VIA Scan, from the source chain to the destination.",
    },
    {
        icon: Receipt,
        title: 'One fee, paid on the source chain',
        text: 'The sender pays one delivery fee on the source chain, in its native token. On every destination except Ethereum, that fee also covers destination gas.',
    },
];

const users = [
    'Blockchain teams and foundations that want their chain connected to other ecosystems.',
    "EVM chains that want USDC through Circle's Bridged USDC Standard.",
    'DeFi, gaming, and governance teams whose apps span more than one chain.',
    'Companies that need data from their own systems inside smart contracts.',
    'Builders on Cardano, Midnight, and Stellar who want to reach other chains.',
    'Stablecoin and token issuers that want one token on many chains. USDM from Moneta moves between Cardano and Midnight using VIA.',
];

// Photos: a real photo per person. Missing ones show a marked spot until the photo arrives.
const team: { name: string; role: string; text: string; photo?: string }[] = [
    { name: 'Cletus Pilat', role: 'Chief Executive Officer', text: 'Electrical engineer (BS and MS) with a background in utility-scale solar projects. Based in Michigan.', photo: cletusPhoto },
    { name: 'Druuu (Andre)', role: 'Chief Technology Officer', text: 'Full-stack engineer with a track record in medical and financial software.' },
    { name: 'Jake Salthouse', role: 'Chief Business Officer', text: 'Former senior conductor on the British railway. Based in London.' },
    { name: 'Brad Simon', role: 'Full-Stack Engineer', text: 'Background in sports science.' },
];

const ext = (href: string, label: string) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="link-inline">{label}</a>
);

const iconChip = 'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700 ring-1 ring-inset ring-cyan-600/10 dark:bg-via-teal/10 dark:text-via-teal dark:ring-via-teal/20';

export function About() {
    const openOnboarding = useOpenOnboarding();
    useReveal();
    return (
        <main>
            <PageHero title="About VIA Labs">
                <p>VIA Labs is a cross-chain messaging protocol that connects EVM and non-EVM blockchains natively.</p>
                <p>
                    Chain teams, token issuers, and app developers build with VIA. What they build on top, whether bridges, DEXs, marketplaces,
                    or oracle feeds, is up to them.
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">150+ networks. 20M+ messages delivered. 4+ years in production. Zero exploits.</p>
            </PageHero>

            {/* Services, over a soft wash of the brand colors */}
            <section className="relative overflow-hidden">
                <div
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_88%_8%,rgba(0,229,229,0.10),transparent_70%),radial-gradient(45%_40%_at_8%_95%,rgba(255,0,255,0.06),transparent_70%)] dark:bg-[radial-gradient(55%_45%_at_88%_8%,rgba(0,229,229,0.12),transparent_70%),radial-gradient(45%_40%_at_8%_95%,rgba(255,0,255,0.09),transparent_70%)]"
                    aria-hidden="true"
                />
                <div className="container-x relative py-20 md:py-28">
                    <div data-reveal>
                        <SectionHeading title="What VIA Labs does" />
                    </div>
                    <div className="panel">
                        <div className="grid gap-2 sm:grid-cols-2 md:gap-3 lg:grid-cols-3">
                            {services.map(({ icon: Icon, title, text }, i) => (
                                <div key={title} data-reveal style={{ transitionDelay: `${(i % 3) * 80}ms` }}>
                                    <div className="card card-hover h-full p-7">
                                        <span className={iconChip}>
                                            <Icon size={21} aria-hidden="true" />
                                        </span>
                                        <h3 className="mt-6 text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
                                        <p className="mt-2 text-body">{text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <Section tone="white">
                <div data-reveal>
                    <SectionHeading title="What makes VIA different" />
                </div>
                <div className="grid gap-x-14 border-t hairline md:grid-cols-2">
                    {differences.map(({ icon: Icon, title, text }, i) => (
                        <div key={title} data-reveal style={{ transitionDelay: `${(i % 2) * 80}ms` }} className="flex gap-5 border-b hairline py-8">
                            <Icon size={22} className="mt-1 shrink-0 text-cyan-600 dark:text-via-teal" aria-hidden="true" />
                            <div>
                                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h3>
                                <p className="mt-3 text-body">{text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            <Section>
                <div className="grid gap-12 lg:grid-cols-12">
                    <div className="lg:col-span-5" data-reveal>
                        <h2 className="h-section">Who builds with VIA</h2>
                    </div>
                    <ul className="border-t hairline lg:col-span-7" data-reveal>
                        {users.map((u) => (
                            <li key={u} className="flex gap-4 border-b hairline py-5 text-lg text-body">
                                <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-via-teal" aria-hidden="true" />
                                <span>{u}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </Section>

            <Section tone="white">
                <div data-reveal>
                    <SectionHeading
                        title="The team behind VIA Labs"
                        intro="VIA began as a project to let smart contracts on different chains talk to each other. VIA Labs LLC was founded in 2024 in Michigan to build it. In 2026, VIA Labs launched VG1, the current version of the VIA network."
                    />
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {team.map((m, i) => (
                        <figure key={m.name} data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
                            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 shadow-card dark:border-white/[0.07] dark:bg-ink-800 dark:shadow-card-dark">
                                {m.photo ? (
                                    <img src={m.photo} alt={`${m.name}, ${m.role}`} width={600} height={750} loading="lazy" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-slate-400 dark:text-slate-500">
                                        <Camera size={22} aria-hidden="true" />
                                        Photo to come
                                    </div>
                                )}
                            </div>
                            <figcaption className="mt-5">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{m.name}</h3>
                                <p className="text-sm font-medium text-cyan-700 dark:text-via-teal">{m.role}</p>
                                <p className="mt-3 text-body">{m.text}</p>
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </Section>

            <Section>
                <div data-reveal>
                    <SectionHeading title="How working with VIA Labs works" />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="card p-8" data-reveal>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">For developers</h3>
                        <p className="mt-3 text-body">
                            Start with the Hello World guide on two testnets. You inherit one contract, override one function, and send your first
                            message. When you move to mainnet, our team can help you plan the launch.
                        </p>
                        <a href={HELLO_WORLD} target="_blank" rel="noopener noreferrer" className="link-arrow mt-6">
                            Open the Hello World guide <ArrowRight size={16} aria-hidden="true" />
                        </a>
                    </div>
                    <div className="card p-8" data-reveal style={{ transitionDelay: '80ms' }}>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Communication</h3>
                        <p className="mt-3 text-body">
                            Email <a href={`mailto:${EMAIL}`} className="link-inline">{EMAIL}</a>, fill in the onboarding form, or book a video
                            call. We reply within one business day. You work directly with our engineers and our business team. Our community
                            talks on Discord and Telegram.
                        </p>
                        <button onClick={openOnboarding} className="link-arrow mt-6">
                            Open the onboarding form <ArrowRight size={16} aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </Section>

            <Section tone="white">
                <div data-reveal>
                    <SectionHeading title="Key facts" />
                    <KeyFacts
                        rows={[
                            ['Company name', 'VIA Labs (legal name: VIA Labs LLC)'],
                            ['Type', 'Cross-chain messaging protocol (blockchain infrastructure)'],
                            ['Founded', '2024'],
                            ['Headquarters', 'Michigan, United States'],
                            ['Website', 'vialabs.tech'],
                            ['Core offering', 'Messaging between smart contracts on different blockchains, EVM and non-EVM'],
                            ['Services', "Cross-chain messaging, cross-chain tokens, USDC launches with Circle's Bridged USDC Standard, off-chain data delivery, chain integrations, custom development"],
                            ['Pricing', 'One delivery fee per message, paid on the source chain in its native token. Chain integrations are priced per chain.'],
                            ['Supported chains', <>EVM chains, Cardano, Midnight, and Stellar. See {ext(SUPPORTED_NETWORKS, 'Supported networks')} for every gateway.</>],
                            ['Networks connected', '150+'],
                            ['Messages delivered', '20M+'],
                            ['Exploits', 'Zero'],
                            ['Security audits', 'Anastasia Labs, Firepan, Hashlock'],
                            ['Developer languages', 'Solidity, Aiken, Compact, Rust'],
                            ['Explorer', <>{ext(SCAN, 'VIA Scan')}: scan.vialabs.tech</>],
                            ['Documentation', ext(DOCS, 'developer.vialabs.tech')],
                            ['Social', <>{ext(X, 'X: @VIA_Labs')}. {ext(GITHUB, 'GitHub: VIA-Labs-Tech')}. {ext(DISCORD, 'Discord')}. {ext(TELEGRAM, 'Telegram')}.</>],
                        ]}
                    />
                </div>
            </Section>

            <Section id="faq">
                <div data-reveal>
                    <SectionHeading title="Frequently asked questions" />
                    <FaqList items={[faq.what, faq.bridge, faq.chains, faq.security, faq.audits, faq.cost, faq.time, faq.start, faq.contact]} />
                </div>
            </Section>

            <div data-reveal>
                <CtaBand />
            </div>
        </main>
    );
}
