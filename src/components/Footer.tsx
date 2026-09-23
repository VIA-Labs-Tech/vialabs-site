import { Github, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { XIcon } from './icons/XIcon';
import { DiscordIcon } from './icons/DiscordIcon';
import { Logo } from './Logo';
import { AUDITS, DISCORD, DOCS_FAQ, DOCS_HOME, EMAIL, GITHUB, SCAN, SUPPORTED_NETWORKS, TELEGRAM, X } from '../links';

interface FooterLink {
    name: string;
    href: string;
    internal?: boolean;
}

const columns: { title: string; links: FooterLink[] }[] = [
    {
        title: 'Platform',
        links: [
            { name: 'How VIA works', href: '/overview', internal: true },
            { name: 'Security', href: '/overview#security', internal: true },
            { name: 'Use cases', href: '/use-cases', internal: true },
            { name: 'About', href: '/about', internal: true },
            { name: 'VIA Scan', href: SCAN },
        ],
    },
    {
        title: 'Developers',
        links: [
            { name: 'Documentation', href: DOCS_HOME },
            { name: 'Supported networks', href: SUPPORTED_NETWORKS },
            { name: 'Audits', href: AUDITS },
            { name: 'FAQ', href: DOCS_FAQ },
            { name: 'GitHub', href: GITHUB },
        ],
    },
    {
        title: 'Community',
        links: [
            { name: 'Discord', href: DISCORD },
            { name: 'Telegram', href: TELEGRAM },
            { name: 'X', href: X },
        ],
    },
];

const socials = [
    { label: 'X', href: X, icon: XIcon },
    { label: 'GitHub', href: GITHUB, icon: Github },
    { label: 'Discord', href: DISCORD, icon: DiscordIcon },
    { label: 'Telegram', href: TELEGRAM, icon: Send },
];

const linkClass = 'text-[15px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors';

export function Footer() {
    return (
        <footer className="border-t hairline bg-white dark:bg-ink-900">
            <div className="container-x py-14 md:py-20 grid grid-cols-1 md:grid-cols-12 gap-12">
                <div className="md:col-span-5 space-y-5">
                    <Logo className="h-7" />
                    <p className="text-body max-w-sm">
                        VIA Labs is a cross-chain messaging protocol that connects EVM and non-EVM blockchains natively.
                    </p>
                    <a href={`mailto:${EMAIL}`} className="link-inline text-[15px]">{EMAIL}</a>
                    <div className="flex items-center gap-2 pt-1">
                        {socials.map(({ label, href, icon: Icon }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={label}
                                className="p-2 -ml-2 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                            >
                                <Icon size={19} />
                            </a>
                        ))}
                    </div>
                </div>

                <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
                    {columns.map((col) => (
                        <div key={col.title}>
                            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">{col.title}</h2>
                            <ul className="space-y-3">
                                {col.links.map((link) => (
                                    <li key={link.name}>
                                        {link.internal ? (
                                            <Link to={link.href} className={linkClass}>{link.name}</Link>
                                        ) : (
                                            <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>{link.name}</a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <div className="border-t hairline">
                <p className="container-x py-6 text-sm text-muted">© 2026 VIA Labs LLC. All rights reserved.</p>
            </div>
        </footer>
    );
}
