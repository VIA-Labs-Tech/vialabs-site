import { ArrowLeftRight, BadgeCheck, Bot, Building2, Coins, Database, Gamepad2, Image, Landmark, LineChart, Lock, Vote } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { CtaBand, PageHero, Section } from '../components/ui';

const cases: { icon: LucideIcon; title: string; text: string[] }[] = [
    {
        icon: ArrowLeftRight,
        title: 'Liquidity transfers',
        text: [
            'Move liquidity between chains for trading, lending, and treasury needs. You choose how many confirmations each transfer waits for, from fast to cautious.',
        ],
    },
    {
        icon: Database,
        title: 'Oracles and data feeds',
        text: [
            'Bring data from outside the blockchain into your contracts. You run the data source, and VIA delivers the data to any connected chain. Examples include prices, sports results, flight status, and sensor readings.',
        ],
    },
    {
        icon: Bot,
        title: 'AI agents',
        text: [
            'Give AI agents a way to act across chains. An agent can send instructions from one chain to contracts on others. It can also feed them data from outside the blockchain.',
        ],
    },
    {
        icon: Coins,
        title: 'Stablecoins and tokens',
        text: [
            'Launch one token on many chains and keep one total supply. Choose burn and mint, lock and mint, or lock and release.',
            "Chains can also launch USDC with Circle's Bridged USDC Standard, and VIA Labs helps with the launch.",
            'USDM, the fiat-backed stablecoin from Moneta, moves between Cardano and Midnight using VIA.',
        ],
    },
    {
        icon: LineChart,
        title: 'DeFi',
        text: [
            'Build lending, liquidity, and trading apps that work across chains. A contract on one chain can send its state to a contract on another chain, which acts on it.',
        ],
    },
    {
        icon: Building2,
        title: 'Enterprise systems',
        text: ['Send events from your existing systems into smart contracts, plain or encrypted. Your contracts act on what your backend reports.'],
    },
    {
        icon: Landmark,
        title: 'Real-world assets',
        text: ['Carry ownership records and attestations for tokenized assets between chains. The asset can stay on one chain while apps on other chains read its records.'],
    },
    {
        icon: BadgeCheck,
        title: 'Identity and credentials',
        text: ["Prove a credential or reputation on one chain, and use it in an app on another. Users don't need to prove it again on each chain."],
    },
    {
        icon: Vote,
        title: 'Governance',
        text: ['Collect votes from token holders on many chains, and act on the result on one chain. Holders vote from the chain where they keep their tokens.'],
    },
    {
        icon: Gamepad2,
        title: 'Gaming',
        text: ['Move items, progress, and achievements between chains. Players keep what they earn when a game runs on more than one chain.'],
    },
    {
        icon: Image,
        title: 'NFTs',
        text: ['Move NFTs between chains, or update their metadata on every chain. One collection can live on several chains and stay in sync.'],
    },
    {
        icon: Lock,
        title: 'Privacy with Midnight',
        text: ['Midnight is a blockchain built for data protection. VIA connects Midnight to Cardano, so apps can move tokens and data between the two.'],
    },
];

export function UseCases() {
    return (
        <main>
            <PageHero title="Designed for any application">
                <p>VIA carries any data between smart contracts, so the list of uses stays open. These examples show where teams often start.</p>
            </PageHero>

            <Section>
                <div className="panel">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                        {cases.map(({ icon: Icon, title, text }) => (
                            <article key={title} className="card card-hover p-7">
                                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/[0.06] text-slate-900 dark:text-via-teal">
                                    <Icon size={21} aria-hidden="true" />
                                </span>
                                <h2 className="mt-6 text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
                                <div className="mt-2 text-body space-y-3">
                                    {text.map((t) => <p key={t}>{t}</p>)}
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </Section>

            <CtaBand title="Not on this list?" text="VIA carries any data your contract can encode. Tell us what you want to build." />
        </main>
    );
}
