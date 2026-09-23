// Shared copy: answers that appear on more than one page stay identical everywhere.
import type { FaqItem } from './components/ui';
import { AUDITS, HELLO_WORLD, SCAN, SUPPORTED_NETWORKS, EMAIL } from './links';

const A = ({ href, children }: { href: string; children: string }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="link-inline">{children}</a>
);

// Measured on VIA Scan: USDM confirmation settings and median delivery times, August 4 to September 7, 2026.
export function DeliveryTime() {
    return (
        <>
            <p>
                You decide. Each message sets how many block confirmations it waits for on its source chain. A confirmation is one new block
                added after the block that holds your transaction.
            </p>
            <p>
                Transfers of value usually wait longer. Stablecoin and liquidity transfers often wait for many confirmations. Each new block
                makes the earlier ones harder to reverse. A longer wait lowers the risk that a transfer is undone. This comes from how
                blockchains finalize transactions, not from VIA.
            </p>
            <p>
                For example, USDM transfers between Cardano and Midnight wait 150 confirmations on Cardano and 180 on Midnight. That takes
                about 50 minutes from Cardano and about 20 minutes from Midnight.
            </p>
            <p>
                Other messages can move fast. Chains with fast finality, such as Avalanche and Stellar, make a block final within seconds.
                Liquidity can move between them without a long wait. Data streams, such as sensor readings or price updates, can wait zero
                confirmations. Each new value replaces the last one. If one value matters, you can check it on <A href={SCAN}>VIA Scan</A> before
                you act on it.
            </p>
            <p>On mainnet, messages that wait zero or one confirmation typically arrive in under two minutes.</p>
        </>
    );
}

export const faq: Record<string, FaqItem> = {
    what: {
        q: 'What is VIA Labs?',
        a: (
            <p>
                VIA Labs is a cross-chain messaging protocol. It lets a smart contract on one blockchain send a message to a smart contract on
                another. It works across 150+ networks, including EVM chains, Cardano, Midnight, and Stellar.
            </p>
        ),
    },
    bridge: {
        q: 'Is VIA a bridge?',
        a: <p>No. VIA is a cross-chain messaging protocol. Teams build token transfers, bridges, swaps, and other apps on top of it.</p>,
    },
    chains: {
        q: 'Which blockchains does VIA support?',
        a: (
            <p>
                VIA runs on EVM chains, including Ethereum, Arbitrum, Avalanche, Base, BSC, Optimism, and Polygon. It also runs on Cardano,
                Midnight, and Stellar. See <A href={SUPPORTED_NETWORKS}>Supported networks</A> for every gateway address and chain ID.
            </p>
        ),
    },
    security: {
        q: 'How does VIA keep messages secure?',
        a: (
            <p>
                Signers run by VIA Labs check every message on its source chain, then sign it. You can also require signatures from the
                chain's own signers and from your team's signers. Every active layer must sign, or the message is rejected.
            </p>
        ),
    },
    audits: {
        q: 'Has VIA been audited?',
        a: (
            <p>
                Yes. Anastasia Labs, Firepan, and Hashlock audited VIA's contracts on EVM chains, Cardano, Midnight, and Stellar. The reports
                are public on the <A href={AUDITS}>Audits page</A>.
            </p>
        ),
    },
    cost: {
        q: 'How much does it cost to send a message?',
        a: (
            <p>
                The sender pays one delivery fee on the source chain, in its native token. It covers delivery on the destination chain, except
                on Ethereum, where your contract holds wrapped ETH for gas.
            </p>
        ),
    },
    time: {
        q: 'How long does a message take?',
        a: <DeliveryTime />,
    },
    start: {
        q: 'How do I start building?',
        a: (
            <p>
                Start with the <A href={HELLO_WORLD}>Hello World guide</A> in the docs. It takes you from deployment on two testnets to your
                first delivered message.
            </p>
        ),
    },
    contact: {
        q: 'How do I contact VIA Labs?',
        a: (
            <p>
                Email <a href={`mailto:${EMAIL}`} className="link-inline">{EMAIL}</a> or use the onboarding form. You can also book a call, or
                find us on X, Discord, and Telegram.
            </p>
        ),
    },
};
