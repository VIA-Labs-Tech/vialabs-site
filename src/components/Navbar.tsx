import { useState } from 'react';
import { Menu, X, ChevronDown, ExternalLink, ShieldCheck, Zap, Book, Code, Send, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { OnboardingModal } from './OnboardingModal';
import { ThemeToggle } from './ThemeToggle';
import { useIsDark } from '../hooks/useIsDark';
import { XIcon } from './icons/XIcon';
import { DiscordIcon } from './icons/DiscordIcon';

// Assets
import logoDark from '../assets/company_logo/Logo_300-02_b.png';
import logoWhite from '../assets/company_logo/Logo_300-02.png';

const navLinks = {
    platform: [
        { name: "Overview", href: "/overview", icon: Zap },
        { name: "Use Cases", href: "/use-cases", icon: Globe },
        { name: "Security", href: "/overview#security", icon: ShieldCheck }
    ],
    developers: [
        { name: "Documentation", href: "https://developer.vialabs.tech", icon: Book, external: true },
        { name: "GitHub", href: "https://github.com/VIA-Labs-Tech", icon: Code, external: true }
    ],
    community: [
        { name: "Discord", href: "https://discord.gg/h4rBhukkWz", icon: DiscordIcon, external: true },
        { name: "Telegram", href: "https://t.me/VIA-Labs-Tech", icon: Send, external: true },
        { name: "Twitter / X", href: "https://x.com/VIA_Labs", icon: XIcon, external: true }
    ]
};

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const isDark = useIsDark();
    const logoUrl = isDark ? logoWhite : logoDark;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
            <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-28 flex items-center justify-between">

                {/* 1. Logo */}
                <Link to="/" className="flex items-center gap-3">
                    <img src={logoUrl} alt="VIA Labs" className="h-[56px] md:h-[90px] w-auto hover:opacity-80 transition-opacity" />
                </Link>

                {/* 2. Desktop Links */}
                <div className="hidden lg:flex items-center gap-8 ml-10 text-sm font-medium text-slate-600 dark:text-slate-400">

                    {/* Platform Dropdown */}
                    <div className="relative group h-16 md:h-28 flex items-center">
                        <button className="flex items-center gap-1 hover:text-black dark:hover:text-white transition-colors focus:outline-none">
                            Platform <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
                        </button>
                        <div className="absolute top-24 left-0 w-56 bg-white dark:bg-[#1a1b23] border border-slate-100 dark:border-slate-700 shadow-lg rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top -translate-y-2 group-hover:translate-y-0">
                            <div className="p-2 flex flex-col gap-1">
                                {navLinks.platform.map(link => (
                                    <Link key={link.name} to={link.href} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white">
                                        <link.icon size={16} className="text-via-teal" />
                                        <span>{link.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>



                    {/* Developers Dropdown */}
                    <div className="relative group h-16 md:h-28 flex items-center">
                        <button className="flex items-center gap-1 hover:text-black dark:hover:text-white transition-colors focus:outline-none">
                            Developers <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
                        </button>
                        <div className="absolute top-24 left-0 w-56 bg-white dark:bg-[#1a1b23] border border-slate-100 dark:border-slate-700 shadow-lg rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top -translate-y-2 group-hover:translate-y-0">
                            <div className="p-2 flex flex-col gap-1">
                                {navLinks.developers.map(link => (
                                    <a key={link.name} href={link.href} className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white">
                                        <div className="flex items-center gap-3">
                                            <link.icon size={16} className="text-via-teal" />
                                            <span>{link.name}</span>
                                        </div>
                                        {link.external && <ExternalLink size={12} className="opacity-0 group-hover:opacity-50" />}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>



                    {/* Community Dropdown */}
                    <div className="relative group h-16 md:h-28 flex items-center">
                        <button className="flex items-center gap-1 hover:text-black dark:hover:text-white transition-colors focus:outline-none">
                            Community <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
                        </button>
                        <div className="absolute top-24 left-0 w-56 bg-white dark:bg-[#1a1b23] border border-slate-100 dark:border-slate-700 shadow-lg rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top -translate-y-2 group-hover:translate-y-0">
                            <div className="p-2 flex flex-col gap-1">
                                {navLinks.community.map(link => (
                                    <a key={link.name} href={link.href} className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white">
                                        <div className="flex items-center gap-3">
                                            <link.icon size={16} className="text-via-teal" />
                                            <span>{link.name}</span>
                                        </div>
                                        {link.external && <ExternalLink size={12} className="opacity-0 group-hover:opacity-50" />}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Explorer Link (Right side) */}
                    <Link to="/explorer" className="hover:text-black dark:hover:text-white transition-colors">Explorer</Link>

                </div>



                {/* 3. CTA Buttons */}
                <div className="hidden md:flex items-center gap-4 ml-auto">
                    <ThemeToggle />
                    <button
                        onClick={() => setShowOnboarding(true)}
                        className="px-5 py-2 rounded-full border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 text-xs font-semibold hover:border-slate-800 dark:hover:border-slate-400 hover:text-black dark:hover:text-white transition-all"
                    >
                        Onboarding Assistance
                    </button>
                </div>

                {/* Mobile: Theme Toggle + Menu Toggle */}
                <div className="lg:hidden flex items-center gap-2 ml-auto">
                    <ThemeToggle />
                    <button
                        className="p-2 text-slate-600 dark:text-slate-400"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-white dark:bg-[#1a1b23] border-t border-slate-100 dark:border-slate-700 overflow-hidden"
                    >
                        <div className="flex flex-col p-4 sm:p-6 space-y-3 max-w-full overflow-hidden">
                            {/* Platform sub-links */}
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2">Platform</p>
                                {navLinks.platform.map(link => (
                                    <Link key={link.name} to={link.href} onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-2 py-2 text-base font-medium text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                                        <link.icon size={16} className="text-via-teal flex-shrink-0" />
                                        <span>{link.name}</span>
                                    </Link>
                                ))}
                            </div>

                            {/* Developers sub-links */}
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2">Developers</p>
                                {navLinks.developers.map(link => (
                                    <a key={link.name} href={link.href} target={link.external ? "_blank" : undefined} rel={link.external ? "noopener noreferrer" : undefined} onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-2 py-2 text-base font-medium text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                                        <link.icon size={16} className="text-via-teal flex-shrink-0" />
                                        <span>{link.name}</span>
                                        {link.external && <ExternalLink size={12} className="text-slate-400 ml-auto flex-shrink-0" />}
                                    </a>
                                ))}
                            </div>

                            {/* Community sub-links */}
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2">Community</p>
                                {navLinks.community.map(link => (
                                    <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-2 py-2 text-base font-medium text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                                        <link.icon size={16} className="text-via-teal flex-shrink-0" />
                                        <span>{link.name}</span>
                                        <ExternalLink size={12} className="text-slate-400 ml-auto flex-shrink-0" />
                                    </a>
                                ))}
                            </div>

                            <hr className="border-slate-100 dark:border-slate-700" />
                            <div className="flex flex-col gap-3 pt-1">
                                <button onClick={() => { setShowOnboarding(true); setIsOpen(false); }} className="w-full px-4 py-3 rounded-full border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 font-semibold text-center text-sm truncate">
                                    Onboarding Assistance
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Onboarding Wizard Modal */}
            <OnboardingModal isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />
        </nav >
    );
}
