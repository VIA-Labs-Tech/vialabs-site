import GeneralizedMessagingSection from '../components/platform/GeneralizedMessagingSection';
import SecuritySection from '../components/platform/SecuritySection';
import { CtaBand, ExternalLink, PageHero, Section, SectionHeading, TimelineSteps, spotlight } from '../components/ui';
import { DeliveryTime } from '../content';
import { useReveal } from '../hooks/useReveal';
import { AUDITS, FEES, SUPPORTED_NETWORKS } from '../links';

const problems = [
    'Users switch networks, wallets, and apps to move between chains.',
    'Liquidity splits across chains, so each pool is smaller.',
    'Each chain needs its own integration work.',
];

const answers = [
    'One pattern for every chain. Your contracts talk to each other directly, on EVM and non-EVM chains.',
    'Users stay on the chain they already use. Your contracts do the cross-chain work.',
    'When VIA adds an EVM chain, you can deploy the same contract there and connect it.',
];

export function HowItWorks() {
    useReveal();
    return (
        <main>
            <PageHero title="How VIA works">
                <p>
                    VIA carries messages between smart contracts on different blockchains. This page follows one message from start to finish.
                    It also shows who checks each message and what you control.
                </p>
            </PageHero>

            <Section>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="card p-8 md:p-10" data-reveal>
                        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">The problem</h2>
                        <ul className="mt-6 space-y-4">
                            {problems.map((p) => (
                                <li key={p} className="flex gap-3 text-body">
                                    <span className="mt-2.5 h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" aria-hidden="true" />
                                    <span>{p}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="glow-border rounded-2xl p-8 md:p-10 bg-ink-900 text-white shadow-panel border border-white/[0.06]" data-reveal style={{ transitionDelay: '80ms' }}>
                        <h2 className="text-2xl font-semibold tracking-tight">What VIA does about it</h2>
                        <ul className="mt-6 space-y-4">
                            {answers.map((a) => (
                                <li key={a} className="flex gap-3 text-slate-300">
                                    <span className="mt-2.5 h-1.5 w-1.5 rounded-full bg-via-teal shrink-0" aria-hidden="true" />
                                    <span>{a}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </Section>

            <Section tone="white">
                <div className="grid lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-4">
                        <div className="lg:sticky lg:top-28" data-reveal>
                            <h2 className="h-section">The path of a message</h2>
                            <p className="mt-5 text-lg text-body">Five steps, from your contract on one chain to your contract on another.</p>
                        </div>
                    </div>
                    <div className="lg:col-span-8">
                        <TimelineSteps
                            items={[
                                'Your contract calls messageSend on the VIA gateway. The gateway records the message on the source chain.',
                                'Signers see the message. They wait for the number of confirmations your message asks for.',
                                'Each signer checks the source transaction again, then signs the message.',
                                'A relayer delivers the message and its signatures to the gateway on the destination chain.',
                                'The destination gateway checks that every active layer signed. Then it calls messageProcess on your contract.',
                            ]}
                        />
                        <p className="mt-10 text-body">Relayers can't change a message. The gateway rejects any message without the required signatures.</p>
                        <p className="mt-3 text-sm text-muted">Midnight can't check signatures on-chain yet. On Midnight, only approved relayers can deliver messages.</p>
                    </div>
                </div>
            </Section>

            <section id="security" className="scroll-mt-24">
                <SecuritySection />
                <div className="container-x -mt-6 pb-20 md:pb-28 grid md:grid-cols-2 gap-4" onPointerMove={spotlight}>
                    <div className="card card-hover spotlight p-7" data-reveal>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">The VIA Layer</h3>
                        <p className="mt-2 text-body">At least two of three VIA signers must sign each message.</p>
                    </div>
                    <div className="card card-hover spotlight p-7" data-reveal style={{ transitionDelay: '80ms' }}>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Two more checks</h3>
                        <p className="mt-2 text-body">
                            Each message can be delivered only once. Your contract accepts messages only from the gateway and only from the contracts you configure.
                        </p>
                    </div>
                </div>
            </section>

            <Section tone="white">
                <div className="grid lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-5">
                        <h2 className="h-section">Run your own signers and relayers</h2>
                    </div>
                    <div className="lg:col-span-7 text-lg text-body">
                        <p>
                            By default, VIA Labs runs the signers and relayers for your project. Teams that want more control can run their own
                            signers in the Project Layer. Enterprise teams can also run their own relayers.
                        </p>
                    </div>
                </div>
            </Section>

            <Section>
                <GeneralizedMessagingSection />
            </Section>

            <Section tone="white">
                <div className="grid lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-5">
                        <h2 className="h-section">Fees</h2>
                        <div className="mt-5 text-lg text-body space-y-4">
                            <p>
                                The sender pays one delivery fee on the source chain, in its native token. On every destination except Ethereum,
                                that fee also covers destination gas. On Ethereum, your receiving contract holds wrapped ETH (WETH) to pay for delivery.
                            </p>
                        </div>
                        <ExternalLink href={FEES} className="link-arrow mt-8">Fees and gas</ExternalLink>
                    </div>
                    <div className="lg:col-span-7">
                        <h2 className="h-section">Delivery time</h2>
                        <div className="mt-5 text-lg text-body space-y-4">
                            <DeliveryTime />
                        </div>
                    </div>
                </div>
            </Section>

            <Section>
                <div data-reveal>
                    <SectionHeading title="Chains and audits" />
                </div>
                <div className="grid md:grid-cols-2 gap-4" onPointerMove={spotlight}>
                    <div className="card card-hover spotlight p-8 flex flex-col" data-reveal>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Supported chains</h3>
                        <p className="mt-3 text-body flex-1">VIA runs on EVM chains, Cardano, Midnight, and Stellar.</p>
                        <ExternalLink href={SUPPORTED_NETWORKS} className="link-arrow mt-6">See supported networks</ExternalLink>
                    </div>
                    <div className="card card-hover spotlight p-8 flex flex-col" data-reveal style={{ transitionDelay: '80ms' }}>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Audits</h3>
                        <p className="mt-3 text-body flex-1">Anastasia Labs, Firepan, and Hashlock audited VIA's contracts. Every report is public.</p>
                        <ExternalLink href={AUDITS} className="link-arrow mt-6">Read the audits</ExternalLink>
                    </div>
                </div>
            </Section>

            <CtaBand />
        </main>
    );
}
