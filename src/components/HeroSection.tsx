import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { AnimatedGridBackground } from './ui/AnimatedGridBackground';
import { useIsDark } from '../hooks/useIsDark';

export function HeroSection() {
    const [phase, setPhase] = useState<"entering" | "bouncing">("entering");
    const isDark = useIsDark();
    const glowRgb = isDark ? "255, 255, 255" : "0, 0, 0";

    return (
        <section className="relative w-full min-h-[85vh] md:min-h-[90vh] flex flex-col justify-center pt-20 md:pt-32 pb-12 md:pb-20 overflow-hidden bg-[#F5F5F7] dark:bg-[#0F1117]">
            <AnimatedGridBackground />

            <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">

                <motion.a
                    href="https://midnight.anytoany.xyz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.25, x: "-100vw", y: 0 }}
                    animate={phase}
                    whileHover="hovered"
                    onAnimationComplete={(def) => {
                        if (def === "entering") setPhase("bouncing");
                    }}
                    variants={{
                        entering: {
                            opacity: [0, 1, 1],
                            scale: [0.25, 1.15, 1],
                            x: ["-100vw", "0vw", "0vw"],
                            y: 0,
                            transition: {
                                duration: 1.5,
                                times: [0, 0.85, 1],
                                ease: "easeOut",
                            }
                        },
                        bouncing: {
                            opacity: 1,
                            scale: 1,
                            x: 0,
                            y: [0, -25, 0],
                            boxShadow: [
                                `0 1px 2px rgba(0,0,0,0.05), 0 0 18px 3px rgba(${glowRgb}, 0.15)`,
                                `0 1px 2px rgba(0,0,0,0.05), 0 0 32px 7px rgba(${glowRgb}, 0.4)`,
                                `0 1px 2px rgba(0,0,0,0.05), 0 0 18px 3px rgba(${glowRgb}, 0.15)`,
                            ],
                            transition: {
                                y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
                                boxShadow: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                            }
                        },
                        hovered: {
                            opacity: 1,
                            scale: 1.2,
                            x: 0,
                            y: 0,
                            boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                            transition: { duration: 0.25, ease: "easeOut" }
                        }
                    }}
                    className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-[#1a1b23] border border-slate-200 dark:border-slate-700 shadow-sm mb-4 md:mb-8 hover:bg-yellow-300 dark:hover:bg-yellow-300 hover:border-yellow-500 dark:hover:border-yellow-500 hover:shadow-lg transition-colors duration-200 cursor-pointer"
                >
                    <span className="text-sm md:text-base font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 transition-colors">
                        Cardano &amp; Midnight Mainnets Now Live
                    </span>
                </motion.a>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 max-w-4xl"
                >
                    The Universal <br className="hidden md:block" />
                    <motion.span
                        className="text-via-teal inline-block"
                        animate={{
                            textShadow: [
                                "0 0 0px rgba(0, 229, 229, 0)",
                                "0 0 22px rgba(0, 229, 229, 0.55)",
                                "0 0 0px rgba(0, 229, 229, 0)",
                            ],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1.5,
                        }}
                    >
                        Cross-Chain Infrastructure
                    </motion.span>
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
                    <a href="https://developer.vialabs.tech/docs/examples/hello-world" target="_blank" rel="noopener noreferrer" className="h-12 px-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold flex items-center gap-2 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-via-teal/20">
                        Start Building
                        <motion.span
                            className="inline-flex"
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 2, delay: 2.5 }}
                        >
                            <ArrowRight size={18} />
                        </motion.span>
                    </a>
                    <a href="https://developer.vialabs.tech/docs/" target="_blank" rel="noopener noreferrer" className="h-12 px-8 rounded-full bg-white dark:bg-[#1a1b23] text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 transition-all hover:shadow-md active:scale-95 flex items-center">
                        Read Docs
                    </a>
                </motion.div>

            </div>
        </section>
    );
}
