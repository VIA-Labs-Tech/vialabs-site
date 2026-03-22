
import { motion } from 'framer-motion';
import { Zap, Unplug } from 'lucide-react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GeneralizedMessagingSection from '../components/platform/GeneralizedMessagingSection';
import PersonalOracleSection from '../components/platform/PersonalOracleSection';
import SecuritySection from '../components/platform/SecuritySection';

export function Platform() {
    const { hash } = useLocation();

    useEffect(() => {
        if (hash) {
            const el = document.getElementById(hash.replace('#', ''));
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    }, [hash]);

    return (
        <div className="pt-20 md:pt-32 pb-16 md:pb-24 px-4 md:px-6 max-w-7xl mx-auto">

            {/* Header Section */}
            <div className="mb-8 md:mb-20 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6"
                >
                    The Universal <br />
                    {/* Ensure solid color, no fade */}
                    <span className="text-via-teal">Cross-Chain Standard</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto"
                >
                    A secure, developer-first infrastructure for Generalized Cross-Chain Messaging.
                    Connect any contract, any asset, on any chain.
                </motion.p>
            </div>

            {/* Problem / Solution Section - Made Alive with Hover Effects */}
            <div className="mb-10 md:mb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16">
                    {/* The Fragmentation Problem */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-slate-50 dark:bg-[#1a1b23] rounded-3xl p-6 md:p-10 border border-slate-200 dark:border-slate-700 transition-shadow hover:shadow-xl"
                    >
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                            <Unplug className="text-red-500" size={28} />
                        </div>
                        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">The Problem: Fragmentation</h2>
                        <ul className="space-y-4 text-slate-600 dark:text-slate-400">
                            <li className="flex gap-3">
                                <div className="mt-1.5 w-2 h-2 rounded-full bg-red-400 shrink-0" />
                                <p><strong>Disconnected Experience:</strong> Users must switch networks, wallets, and bridges constantly.</p>
                            </li>
                            <li className="flex gap-3">
                                <div className="mt-1.5 w-2 h-2 rounded-full bg-red-400 shrink-0" />
                                <p><strong>Fragmented Liquidity:</strong> Assets are trapped in silos, reducing efficiency and deepening slippage.</p>
                            </li>
                            <li className="flex gap-3">
                                <div className="mt-1.5 w-2 h-2 rounded-full bg-red-400 shrink-0" />
                                <p><strong>Developer Complexity:</strong> Building for 50+ chains requires 50+ distinct integrations.</p>
                            </li>
                        </ul>
                    </motion.div>

                    {/* The VIA Solution */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-slate-900 text-white rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden transition-all hover:shadow-via-teal/20"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-via-teal/10 blur-[80px]" />
                        <div className="w-12 h-12 bg-via-teal/20 rounded-xl flex items-center justify-center mb-6 relative z-10">
                            <Zap className="text-via-teal" size={28} />
                        </div>
                        <h2 className="text-3xl font-bold mb-4 relative z-10">The Solution: VIA Labs</h2>
                        <ul className="space-y-4 text-slate-300 relative z-10">
                            <li className="flex gap-3">
                                <div className="mt-1.5 w-2 h-2 rounded-full bg-via-teal shrink-0" />
                                <p><strong className="text-white">Unified Connectivity:</strong> Write once, deploy everywhere. One standard for 140+ chains.</p>
                            </li>
                            <li className="flex gap-3">
                                <div className="mt-1.5 w-2 h-2 rounded-full bg-via-teal shrink-0" />
                                <p><strong className="text-white">Seamless Experience:</strong> Users interact with one chain, while the protocol handles the rest.</p>
                            </li>
                            <li className="flex gap-3">
                                <div className="mt-1.5 w-2 h-2 rounded-full bg-via-teal shrink-0" />
                                <p><strong className="text-white">Future Proof:</strong> Instant access to new chains as they are added to the network.</p>
                            </li>
                        </ul>
                    </motion.div>
                </div>
            </div>

            {/* Existing Sections (Context) */}
            <div className="space-y-10 md:space-y-20 mb-10 md:mb-20">
                {/* Section 1: Generalized Messaging */}
                <div className="border-t border-slate-200 dark:border-slate-700 pt-10 md:pt-20">
                    <GeneralizedMessagingSection />
                </div>

                {/* Section 2: Personal Oracle Networks */}
                <div className="border-t border-slate-200 dark:border-slate-700 pt-10 md:pt-20">
                    <PersonalOracleSection />
                </div>
            </div>

            {/* Security Section - Updated content with Interactive Visualizer */}
            <div className="mt-10 md:mt-20 border-t border-slate-200 dark:border-slate-700 scroll-mt-32" id="security">
                <SecuritySection />
            </div>

        </div>
    );
}
