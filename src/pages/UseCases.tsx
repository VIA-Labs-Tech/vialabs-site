import { motion } from 'framer-motion';
import { Gamepad2, Coins, UserCheck, Layers, ShoppingBag, Activity } from 'lucide-react';

export function UseCases() {
    return (
        <div className="pt-20 md:pt-32 pb-16 md:pb-24 px-4 md:px-6 max-w-7xl mx-auto">
            <div className="mb-20 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6"
                >
                    Designed for <br />
                    <span className="text-via-teal">Any Application</span>
                </motion.h1>
                <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                    VIA Labs infrastructure is chain-agnostic and generalized, enabling use cases across every sector of Web3.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                    { title: "Gaming", icon: Gamepad2, color: "text-purple-500", desc: "Sync game state, items, and achievements across multiple chains. Build infinite worlds without congestion." },
                    { title: "DeFi", icon: Coins, color: "text-green-500", desc: "Unified liquidity provision and cross-chain lending. Manage positions on any chain from a single dashboard." },
                    { title: "Identity", icon: UserCheck, color: "text-blue-500", desc: "One identity, everywhere. Prove reputation or credentials on one chain to access apps on another." },
                    { title: "NFTs", icon: ShoppingBag, color: "text-pink-500", desc: "True multi-chain collections. Teleport NFTs seamlessly or update metadata globally." },
                    { title: "Governance", icon: Layers, color: "text-orange-500", desc: "DAO voting across chains. Aggregate votes from holders on any network." },
                    { title: "Data Streams", icon: Activity, color: "text-cyan-500", desc: "Real-world data onchain. Ship sports, shipping, or flight data to any connected chain reliably." },
                ].map((useCase, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={useCase.title}
                        className="p-8 rounded-3xl bg-white dark:bg-[#1a1b23] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                    >
                        <div className={`w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 ${useCase.color}`}>
                            <useCase.icon size={28} />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">{useCase.title}</h3>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                            {useCase.desc}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
