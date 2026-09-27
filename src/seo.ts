// One place for each page's address, title, and description.
// The build writes these into each page's HTML file, and the app keeps them in sync on navigation.
export const SITE_URL = 'https://vialabs.tech';

export interface PageMeta {
    path: string;
    file: string; // HTML file the build writes for this page
    title: string;
    description: string;
    noindex?: boolean;
}

export const pages: PageMeta[] = [
    {
        path: '/',
        file: 'index.html',
        title: 'VIA Labs | Universal Cross-Chain Infrastructure',
        description: 'VIA is a cross-chain messaging network. Smart contracts on 150+ EVM and non-EVM blockchains send each other tokens, data, and instructions.',
    },
    {
        path: '/overview',
        file: 'overview.html',
        title: 'How VIA Works | VIA Labs',
        description: 'How VIA works: your contract sends a message, signers check and sign it, and the contract on the other chain receives it.',
    },
    {
        path: '/use-cases',
        file: 'use-cases.html',
        title: 'Use Cases | VIA Labs',
        description: 'VIA is built for any application. Some examples: cross-chain games, DeFi, identity, NFTs, governance, and live data feeds.',
    },
    {
        path: '/about',
        file: 'about.html',
        title: 'About VIA Labs | Cross-Chain Messaging Protocol',
        description: 'VIA Labs is a cross-chain messaging protocol for EVM and non-EVM blockchains. Learn what we do, who uses VIA, and the team behind it.',
    },
];

export const notFoundMeta: PageMeta = {
    path: '/404',
    file: '404.html',
    title: 'Page Not Found | VIA Labs',
    description: "This address doesn't match a page on the VIA Labs site.",
    noindex: true,
};

export function metaFor(pathname: string): PageMeta {
    const clean = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
    return pages.find((p) => p.path === clean) ?? notFoundMeta;
}
