import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { AnimatedGridBackground } from './ui/AnimatedGridBackground';

export function HeroSection() {
    return (
        <section className="relative w-full min-h-[90vh] flex flex-col justify-center pt-32 pb-20 overflow-hidden bg-[#F5F5F7]">
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
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8 cursor-default"
                >
                    <span className="w-2 h-2 rounded-full bg-via-teal animate-pulse" />
                    <span className="text-sm font-medium text-slate-600">Cardano Testnet Now Live</span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 max-w-4xl"
                >
                    The Universal <br className="hidden md:block" />
                    Cross-Chain Infrastructure
                </motion.h1>

                {/* Subtext */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed"
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
                    <button className="h-12 px-8 rounded-full bg-slate-900 text-white font-semibold flex items-center gap-2 hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-via-teal/20">
                        Start Building <ArrowRight size={18} />
                    </button>
                    <button className="h-12 px-8 rounded-full bg-white text-slate-700 font-semibold border border-slate-200 hover:border-slate-300 transition-all hover:shadow-md active:scale-95">
                        Read Docs
                    </button>
                </motion.div>

            </div>
        </section>
    );
}
