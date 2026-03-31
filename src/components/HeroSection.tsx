import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { AnimatedGridBackground } from './ui/AnimatedGridBackground';

export function HeroSection() {
    return (
        <section className="relative w-full min-h-[85vh] md:min-h-[90vh] flex flex-col justify-center pt-20 md:pt-32 pb-12 md:pb-20 overflow-hidden bg-[#F5F5F7] dark:bg-[#0F1117]">
            <AnimatedGridBackground />

            <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">

                <motion.div
                    initial={{ opacity: 0, y: 0 }}
                    animate="bouncing"
                    whileHover="hovered"
                    variants={{
                        bouncing: {
                            opacity: 1,
                            y: [0, -12, 0],
                            transition: {
                                opacity: { duration: 0.2 }, // Fade in quick
                                y: {
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 0.25 // Delay Y animation only
                                }
                            }
                        },
                        hovered: {
                            opacity: 1,
                            y: 0,
                            transition: {
                                duration: 0.5,
                                ease: "easeInOut"
                            }
                        }
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-[#1a1b23] border border-slate-200 dark:border-slate-700 shadow-sm mb-4 md:mb-8 cursor-default"
                >
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Cardano Testnet Coming Soon</span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 max-w-4xl"
                >
                    The Universal <br className="hidden md:block" />
                    Cross-Chain Infrastructure
                </motion.h1>

                {/* Subtext */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    Direct contract to contract messaging for any chain, any token, any message.
                    Plug traditional software into Web3, and let blockchains interact with the entire digital world.
                </motion.p>

                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center gap-4"
                >
                    <a href="https://developer.vialabs.tech" target="_blank" rel="noopener noreferrer" className="h-12 px-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold flex items-center gap-2 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-via-teal/20">
                        Start Building <ArrowRight size={18} />
                    </a>
                    <a href="https://developer.vialabs.tech" target="_blank" rel="noopener noreferrer" className="h-12 px-8 rounded-full bg-white dark:bg-[#1a1b23] text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 transition-all hover:shadow-md active:scale-95 flex items-center">
                        Read Docs
                    </a>
                </motion.div>

            </div>
        </section>
    );
}
