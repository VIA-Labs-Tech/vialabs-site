import { useEffect, useRef, useState } from 'react';
import { Menu, X, ChevronDown, ArrowUpRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { Logo } from './Logo';
import { useOpenOnboarding } from '../onboarding';
import { DOCS_HOME, GITHUB, SCAN, SUPPORTED_NETWORKS } from '../links';

interface NavItem {
    name: string;
    href: string;
    external?: boolean;
}

const groups: { label: string; items: NavItem[] }[] = [
    {
        label: 'Platform',
        items: [
            { name: 'How VIA works', href: '/overview' },
            { name: 'Security', href: '/overview#security' },
            { name: 'Use cases', href: '/use-cases' },
        ],
    },
    {
        label: 'Developers',
        items: [
            { name: 'Documentation', href: DOCS_HOME, external: true },
            { name: 'Supported networks', href: SUPPORTED_NETWORKS, external: true },
            { name: 'GitHub', href: GITHUB, external: true },
        ],
    },
];

function NavLink({ item, onClick, className }: { item: NavItem; onClick?: () => void; className: string }) {
    if (item.external) {
        return (
            <a href={item.href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={className}>
                <span>{item.name}</span>
                <ArrowUpRight size={14} className="opacity-50 shrink-0" aria-hidden="true" />
            </a>
        );
    }
    return (
        <Link to={item.href} onClick={onClick} className={className}>
            <span>{item.name}</span>
        </Link>
    );
}

const topLink = 'text-[15px] font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors';

// A desktop dropdown. It opens on mouse hover, or on click and tap. It closes soon after the
// mouse leaves, after an item is chosen, on navigation, on scroll, on Escape, and when focus moves away.
function NavGroup({ group }: { group: (typeof groups)[number] }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const button = useRef<HTMLButtonElement>(null);
    const closeTimer = useRef(0);
    const lastPointer = useRef('');
    const { pathname, hash } = useLocation();
    const id = `menu-${group.label.toLowerCase()}`;

    useEffect(() => setOpen(false), [pathname, hash]);
    useEffect(() => {
        if (!open) return;
        const close = () => setOpen(false);
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== 'Escape') return;
            setOpen(false);
            button.current?.focus();
        };
        window.addEventListener('scroll', close, { passive: true });
        window.addEventListener('keydown', onKey);
        return () => {
            window.removeEventListener('scroll', close);
            window.removeEventListener('keydown', onKey);
        };
    }, [open]);
    useEffect(() => () => window.clearTimeout(closeTimer.current), []);

    const show = () => {
        window.clearTimeout(closeTimer.current);
        setOpen(true);
    };
    const hide = () => {
        window.clearTimeout(closeTimer.current);
        closeTimer.current = window.setTimeout(() => setOpen(false), 120);
    };
    const choose = () => {
        setOpen(false);
        (document.activeElement as HTMLElement | null)?.blur();
    };

    return (
        <div
            ref={ref}
            className="relative"
            onPointerEnter={(e) => e.pointerType === 'mouse' && show()}
            onPointerLeave={(e) => e.pointerType === 'mouse' && hide()}
            onBlur={(e) => !ref.current?.contains(e.relatedTarget as Node | null) && setOpen(false)}
        >
            <button
                ref={button}
                className={`${topLink} flex items-center gap-1 h-[72px] focus:outline-none focus-visible:underline`}
                aria-expanded={open}
                aria-controls={id}
                onPointerDown={(e) => (lastPointer.current = e.pointerType)}
                onClick={() => {
                    // A mouse click on an open menu keeps it open; taps and keys toggle it
                    if (lastPointer.current === 'mouse') setOpen(true);
                    else setOpen((o) => !o);
                    lastPointer.current = '';
                }}
            >
                {group.label}
                <ChevronDown size={15} className={`opacity-60 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>
            <div
                id={id}
                className={`absolute left-1/2 -translate-x-1/2 top-[64px] w-72 transition-all duration-150 ${open ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-1'}`}
            >
                <div className="card p-2">
                    {group.items.map((item) => (
                        <NavLink
                            key={item.name}
                            item={item}
                            onClick={choose}
                            className="flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-[15px] font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-white/[0.05] transition-colors"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const openOnboarding = useOpenOnboarding();
    const { pathname } = useLocation();
    useEffect(() => setIsOpen(false), [pathname]);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass-nav">
            <nav className="container-x h-16 lg:h-[72px] flex items-center justify-between" aria-label="Main">
                <Link to="/" className="flex items-center shrink-0" aria-label="VIA Labs home">
                    <Logo className="h-6 lg:h-7" />
                </Link>

                {/* Desktop links */}
                <div className="hidden lg:flex items-center gap-9 ml-12">
                    {groups.map((group) => (
                        <NavGroup key={group.label} group={group} />
                    ))}
                    <Link to="/about" className={topLink}>About</Link>
                    <a href={SCAN} target="_blank" rel="noopener noreferrer" className={topLink}>Scan</a>
                </div>

                <div className="hidden lg:flex items-center gap-3 ml-auto">
                    <ThemeToggle />
                    <button onClick={openOnboarding} className="btn-primary h-10 px-5 text-sm">
                        Talk to our team
                    </button>
                </div>

                {/* Mobile controls */}
                <div className="lg:hidden flex items-center gap-1 ml-auto">
                    <ThemeToggle />
                    <button
                        className="p-2 rounded-full text-slate-700 dark:text-slate-200"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label={isOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={isOpen}
                        aria-controls="mobile-menu"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile menu */}
            {isOpen && (
                <div id="mobile-menu" className="lg:hidden border-t hairline bg-paper dark:bg-ink max-h-[calc(100vh-4rem)] overflow-y-auto">
                    <div className="container-x py-6 space-y-6">
                        {groups.map((group) => (
                            <div key={group.label}>
                                <p className="text-sm font-medium text-muted mb-2">{group.label}</p>
                                <div className="space-y-1">
                                    {group.items.map((item) => (
                                        <NavLink
                                            key={item.name}
                                            item={item}
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center justify-between py-2 text-lg font-medium text-slate-900 dark:text-white"
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                        <div className="space-y-1 border-t hairline pt-5">
                            <Link to="/about" onClick={() => setIsOpen(false)} className="block py-2 text-lg font-medium text-slate-900 dark:text-white">About</Link>
                            <a href={SCAN} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between py-2 text-lg font-medium text-slate-900 dark:text-white">
                                <span>Scan</span>
                                <ArrowUpRight size={14} className="opacity-50" aria-hidden="true" />
                            </a>
                        </div>
                        <button onClick={() => { setIsOpen(false); openOnboarding(); }} className="btn-primary w-full">
                            Talk to our team
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}
