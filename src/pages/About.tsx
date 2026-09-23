import { ArrowRight } from 'lucide-react';
import { CtaBand, FaqList, KeyFacts, PageHero, Section, SectionHeading } from '../components/ui';
import { useOpenOnboarding } from '../onboarding';
import { faq } from '../content';
import { DISCORD, DOCS, EMAIL, GITHUB, HELLO_WORLD, SCAN, SUPPORTED_NETWORKS, TELEGRAM, X } from '../links';

const services = [
    {
        title: 'Cross-chain messaging',
        text: 'Your contract on one chain sends a message. Your contract on another chain receives it and acts on it. A message can carry tokens, NFT data, instructions, or any data your contract can encode.',
    },
    {
        title: 'Cross-chain tokens',
        text: 'Launch one token on many chains with one total supply. VIA supports three patterns: burn and mint, lock and mint, and lock and release. You deploy and own the token contracts.',
    },
    {
        title: 'USDC launches for chains',
        text: "We help chains launch USDC with Circle's Bridged USDC Standard. We deploy the contracts, help with testnet and mainnet verification, and provide a web app for transfers. VIA Labs is listed in the Circle Alliance Directory.",
    },
    {
        title: 'Off-chain data',
        text: 'Bring data from outside the blockchain into your smart contracts, plain or encrypted. You run the data source, and VIA delivers the data to any connected chain.',
    },
    {
        title: 'Chain integrations',
        text: 'We connect blockchains to the VIA network. We deploy the gateway contracts, run the signers and relayers, and add the chain to VIA Scan.',
    },
    {
        title: 'Custom development',
        text: 'We build and deploy custom contracts and apps on VIA for partners.',
    },
];

const differences = [
    {
        title: 'EVM and non-EVM chains, one pattern',
        text: 'VIA runs on EVM chains, Cardano, Midnight, and Stellar. Developers write in Solidity, Aiken, Compact, or Rust. Every message follows the same path: send, sign, and deliver.',
    },
    {
        title: 'You choose who signs',
        text: "Signers run by VIA Labs sign every message. You can also require the chain's own signers and signers your team runs. Every active layer must sign, or the message is rejected.",
    },
    {
        title: 'Your contracts stay yours',
        text: 'Projects deploy and own their own cross-chain contracts. Your contract accepts messages only from the VIA gateway and only from the contracts you list. VIA carries the messages.',
    },
    {
        title: 'Four years in production, zero exploits',
        text: 'VIA has delivered more than 20 million cross-chain messages across four years in production. In that time, VIA has had zero exploits.',
    },
    {
        title: 'Public audits and a public explorer',
        text: "Anastasia Labs, Firepan, and Hashlock audited VIA's contracts, and the reports are public. You can look up any message on VIA Scan, from the source chain to the destination.",
    },
    {
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

const team = [
    { name: 'Cletus Pilat', role: 'Chief Executive Officer', text: 'Electrical engineer (BS and MS) with a background in utility-scale solar projects. Based in Michigan.' },
    { name: 'Druuu (Andre)', role: 'Chief Technology Officer', text: 'Full-stack engineer with a track record in medical and financial software.' },
    { name: 'Jake Salthouse', role: 'Chief Business Officer', text: 'Former senior conductor on the British railway. Based in London.' },
    { name: 'Brad Simon', role: 'Full-Stack Engineer', text: 'Background in sports science.' },
];

const ext = (href: string, label: string) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="link-inline">{label}</a>
);

export function About() {
    const openOnboarding = useOpenOnboarding();
    return (
        <main>
            <PageHero title="About VIA Labs">
                <p>
                    VIA Labs is a cross-chain messaging protocol that connects EVM and non-EVM blockchains natively. Chain teams, token issuers,
                    and app developers use VIA to connect their smart contracts across chains.
                </p>
                <p>
                    We pass data between smart contracts on different chains. What gets built on top, whether bridges, DEXs, marketplaces, or
                    oracle feeds, is up to the developer.
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">150+ networks. 20M+ messages delivered. 4+ years in production. Zero exploits.</p>
            </PageHero>

            <Section>
                <SectionHeading title="What VIA Labs does" />
                <div className="panel">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                        {services.map((s) => (
                            <div key={s.title} className="card p-7">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{s.title}</h3>
                                <p className="mt-2 text-body">{s.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </Section>

            <Section tone="white">
                <SectionHeading title="What makes VIA Labs different" />
                <div className="grid md:grid-cols-2 gap-x-14 border-t hairline">
                    {differences.map((d) => (
                        <div key={d.title} className="py-8 border-b hairline">
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{d.title}</h3>
                            <p className="mt-3 text-body">{d.text}</p>
                        </div>
                    ))}
                </div>
            </Section>

            <Section>
                <div className="grid lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-5">
                        <h2 className="h-section">Who uses VIA Labs</h2>
                    </div>
                    <ul className="lg:col-span-7 border-t hairline">
                        {users.map((u) => (
                            <li key={u} className="flex gap-4 py-5 border-b hairline text-lg text-body">
                                <span className="mt-3 h-1.5 w-1.5 rounded-full bg-via-teal shrink-0" aria-hidden="true" />
                                <span>{u}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </Section>

            <Section tone="white">
                <SectionHeading
                    title="The team behind VIA Labs"
                    intro="VIA began as a project to let smart contracts on different chains talk to each other. VIA Labs LLC was founded in 2024 in Michigan, and it builds and runs the network. In 2026, we launched VG1, the current version of the VIA network."
                />
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 border-t hairline">
                    {team.map((m) => (
                        <div key={m.name} className="pt-7 pb-8">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{m.name}</h3>
                            <p className="text-sm font-medium text-cyan-700 dark:text-via-teal">{m.role}</p>
                            <p className="mt-3 text-body">{m.text}</p>
                        </div>
                    ))}
                </div>
            </Section>

            <Section>
                <SectionHeading title="How working with VIA Labs works" />
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="card p-8">
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">For developers</h3>
                        <p className="mt-3 text-body">
                            Start with the Hello World guide on two testnets. You inherit one contract, override one function, and send your first
                            message. When you move to mainnet, our team can help you plan the launch.
                        </p>
                        <a href={HELLO_WORLD} target="_blank" rel="noopener noreferrer" className="link-arrow mt-6">
                            Open the Hello World guide <ArrowRight size={16} aria-hidden="true" />
                        </a>
                    </div>
                    <div className="card p-8">
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
            </Section>

            <Section id="faq">
                <SectionHeading title="Frequently asked questions" />
                <FaqList items={[faq.what, faq.bridge, faq.chains, faq.security, faq.audits, faq.cost, faq.time, faq.start, faq.contact]} />
            </Section>

            <CtaBand />
        </main>
    );
}
