import { useState } from 'react';
import { Menu, X, ChevronDown, ExternalLink, ShieldCheck, Zap, Book, Code, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { OnboardingModal } from './OnboardingModal';

// Assets
import logoUrl from '../assets/company_logo/Logo_300-02_b.png';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);

    // Custom Icons
    // Custom Icons
    const Globe = ({ size, className }: { size: number, className?: string }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
    );

    const XIcon = ({ size, className }: { size: number, className?: string }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
        </svg>
    );

    const DiscordIcon = ({ size, className }: { size: number, className?: string }) => (
        <svg width={size} height={size} viewBox="0 0 127.14 96.36" fill="currentColor" className={className}>
            <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.11,77.11,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22c2.36-24.44-2-47.27-18.9-72.15ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
        </svg>
    );

    // Dropdown Data
    const navLinks = {
        platform: [
            { name: "Overview", href: "/overview", icon: Zap },
            { name: "Use Cases", href: "/use-cases", icon: Globe },
            { name: "Security", href: "/overview#security", icon: ShieldCheck }
        ],
        developers: [
            { name: "Documentation", href: "#", icon: Book, external: false },
            { name: "GitHub", href: "#", icon: Code, external: true }
        ],

        community: [
            { name: "Discord", href: "#", icon: DiscordIcon, external: true },
            { name: "Telegram", href: "#", icon: Send, external: true },
            { name: "Twitter / X", href: "#", icon: XIcon, external: true }
        ]
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
            <div className="max-w-7xl mx-auto px-6 h-28 flex items-center justify-between">

                {/* 1. Logo */}
                <Link to="/" className="flex items-center gap-3">
                    <img src={logoUrl} alt="VIA Labs" className="h-[90px] w-auto hover:opacity-80 transition-opacity" />
                </Link>

                {/* 2. Desktop Links */}
                <div className="hidden lg:flex items-center gap-8 ml-10 text-sm font-medium text-slate-600">

                    {/* Platform Dropdown */}
                    <div className="relative group h-28 flex items-center">
                        <button className="flex items-center gap-1 hover:text-black transition-colors focus:outline-none">
                            Platform <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
                        </button>
                        <div className="absolute top-24 left-0 w-56 bg-white border border-slate-100 shadow-lg rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top -translate-y-2 group-hover:translate-y-0">
                            <div className="p-2 flex flex-col gap-1">
                                {navLinks.platform.map(link => (
                                    <Link key={link.name} to={link.href} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-black">
                                        <link.icon size={16} className="text-via-teal" />
                                        <span>{link.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>



                    {/* Developers Dropdown */}
                    <div className="relative group h-28 flex items-center">
                        <button className="flex items-center gap-1 hover:text-black transition-colors focus:outline-none">
                            Developers <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
                        </button>
                        <div className="absolute top-24 left-0 w-56 bg-white border border-slate-100 shadow-lg rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top -translate-y-2 group-hover:translate-y-0">
                            <div className="p-2 flex flex-col gap-1">
                                {navLinks.developers.map(link => (
                                    <a key={link.name} href={link.href} className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-black">
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
                    <div className="relative group h-28 flex items-center">
                        <button className="flex items-center gap-1 hover:text-black transition-colors focus:outline-none">
                            Community <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
                        </button>
                        <div className="absolute top-24 left-0 w-56 bg-white border border-slate-100 shadow-lg rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top -translate-y-2 group-hover:translate-y-0">
                            <div className="p-2 flex flex-col gap-1">
                                {navLinks.community.map(link => (
                                    <a key={link.name} href={link.href} className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-black">
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
                    <a href="#" className="hover:text-black transition-colors">Explorer</a>

                </div>



                {/* 3. CTA Buttons */}
                <div className="hidden md:flex items-center gap-4 ml-auto">
                    <button
                        onClick={() => setShowOnboarding(true)}
                        className="px-5 py-2 rounded-full border border-slate-300 text-slate-600 text-xs font-semibold hover:border-slate-800 hover:text-black transition-all"
                    >
                        Onboarding Assistance
                    </button>
                    <a
                        href="https://anytoany.xyz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-800 transition-all hover:shadow-[0_0_15px_rgba(0,229,229,0.3)] block"
                    >
                        Launch App
                    </a>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="lg:hidden p-2 text-slate-600 ml-auto"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-white border-t border-slate-100"
                    >
                        <div className="flex flex-col p-6 space-y-4">
                            <Link to="/overview" className="text-lg font-medium text-slate-700">Platform</Link>
                            <a href="#" className="text-lg font-medium text-slate-700">Developers</a>
                            <a href="#" className="text-lg font-medium text-slate-700">Community</a>
                            <a href="#" className="text-lg font-medium text-slate-700">Explorer</a>
                            <hr className="border-slate-100" />
                            <div className="flex flex-col gap-3 pt-2">
                                <button onClick={() => setShowOnboarding(true)} className="px-5 py-3 rounded-full border border-slate-300 text-slate-600 font-semibold text-center">
                                    Onboarding Assistance
                                </button>
                                <button className="bg-black text-white px-6 py-3 rounded-full font-semibold text-center">
                                    Launch App
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
