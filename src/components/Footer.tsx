import { Github, Send } from 'lucide-react';
import logoUrl from '../assets/company_logo/Logo_300-02_b.png';

// Custom X (Twitter) Icon Component
const XIcon = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
);

const DiscordIcon = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 127.14 96.36" fill="currentColor">
        <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.11,77.11,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22c2.36-24.44-2-47.27-18.9-72.15ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
    </svg>
);

export function Footer() {
    return (
        <footer className="bg-white border-t border-slate-200 py-16">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">

                {/* Brand Column */}
                <div className="col-span-1 md:col-span-1 flex flex-col justify-between h-full">
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            {/* Logo Image Only - Scaled Up 2x */}
                            <img src={logoUrl} alt="VIA Labs" className="h-[120px] w-auto" />
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
                            <a href="https://discord.gg/VIA-labs-Tech" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-black hover:-translate-y-1 transition-all duration-300">
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
                            <li><a href="/overview" className="hover:text-black transition-colors">Overview</a></li>
                            <li><a href="/use-cases" className="hover:text-black transition-colors">Use Cases</a></li>
                            <li><a href="/overview#security" className="hover:text-black transition-colors">Security</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-slate-900">Developers</h4>
                        <ul className="space-y-3 text-sm text-slate-500">
                            <li><a href="#" className="hover:text-black transition-colors">Documentation</a></li>
                            <li><a href="https://github.com/VIA-Labs-Tech" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">GitHub</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-slate-900">Community</h4>
                        <ul className="space-y-3 text-sm text-slate-500">
                            <li><a href="https://discord.gg/VIA-labs-Tech" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">Discord</a></li>
                            <li><a href="https://t.me/VIA-Labs-Tech" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">Telegram</a></li>
                            <li><a href="https://x.com/VIA_Labs" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">Twitter / X</a></li>
                        </ul>
                    </div>
                </div>

            </div>
        </footer>
    );
}
