import { Github, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { XIcon } from './icons/XIcon';
import { DiscordIcon } from './icons/DiscordIcon';
import logoUrl from '../assets/company_logo/Logo_300-02_b.png';

export function Footer() {
    return (
        <footer className="bg-white border-t border-slate-200 py-10 md:py-16">
            <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">

                {/* Brand Column */}
                <div className="col-span-1 md:col-span-1 flex flex-col justify-between h-full">
                    <div>
                        <div className="flex items-center gap-2 mb-4 md:mb-6">
                            {/* Logo Image Only - Scaled Up 2x */}
                            <img src={logoUrl} alt="VIA Labs" className="h-[80px] md:h-[120px] w-auto" />
                        </div>
                        <p className="text-slate-500 text-sm mb-6 max-w-xs">
                            The universal cross-chain infrastructure for the next generation of dApps.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        {/* Social Icons */}
                        <div className="flex items-center gap-4">
                            <a href="https://x.com/VIA_Labs" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-black hover:-translate-y-1 transition-all duration-300">
                                <XIcon size={20} />
                            </a>
                            <a href="https://github.com/VIA-Labs-Tech" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-black hover:-translate-y-1 transition-all duration-300">
                                <Github size={20} />
                            </a>
                            <a href="https://discord.gg/h4rBhukkWz" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-black hover:-translate-y-1 transition-all duration-300">
                                <DiscordIcon size={20} />
                            </a>
                            <a href="https://t.me/VIA-Labs-Tech" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-black hover:-translate-y-1 transition-all duration-300">
                                <Send size={20} />
                            </a>
                        </div>
                        <p className="text-xs text-slate-400">
                            © 2026 VIA Labs. All rights reserved.
                        </p>
                    </div>
                </div>

                {/* Links Grid - Matches Header Categories */}
                <div className="col-span-1 md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
                    <div>
                        <h4 className="font-semibold mb-4 text-slate-900">Platform</h4>
                        <ul className="space-y-3 text-sm text-slate-500">
                            <li><Link to="/overview" className="hover:text-black transition-colors">Overview</Link></li>
                            <li><Link to="/use-cases" className="hover:text-black transition-colors">Use Cases</Link></li>
                            <li><Link to="/overview#security" className="hover:text-black transition-colors">Security</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-slate-900">Developers</h4>
                        <ul className="space-y-3 text-sm text-slate-500">
                            <li><a href="https://developer.vialabs.tech" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">Documentation</a></li>
                            <li><a href="https://github.com/VIA-Labs-Tech" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">GitHub</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-slate-900">Community</h4>
                        <ul className="space-y-3 text-sm text-slate-500">
                            <li><a href="https://discord.gg/h4rBhukkWz" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">Discord</a></li>
                            <li><a href="https://t.me/VIA-Labs-Tech" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">Telegram</a></li>
                            <li><a href="https://x.com/VIA_Labs" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">Twitter / X</a></li>
                        </ul>
                    </div>
                </div>

            </div>
        </footer>
    );
}
