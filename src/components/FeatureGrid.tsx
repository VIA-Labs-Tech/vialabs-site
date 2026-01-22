import { Card } from './ui/Card';
import { Globe, ShieldCheck, Zap, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

export function FeatureGrid() {
    return (
        <section className="py-24 px-6 max-w-7xl mx-auto">
            <div className="mb-16">
                <h2 className="text-4xl font-bold tracking-tight mb-4">Infrastructure for the <span className="text-via-teal">new internet</span>.</h2>
                <p className="text-xl text-slate-500 max-w-2xl">
                    Everything you need to build cross-chain applications without the complexity.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
                {/* Stats Row - Captivating Animation & Aliveness */}
                <div className="md:col-span-3 grid grid-cols-2 gap-6 p-8 bg-slate-900 rounded-3xl text-white mb-6 relative overflow-hidden group hover:shadow-xl hover:shadow-via-teal/10 hover:-translate-y-1 transition-all duration-300">
                    {/* Background glow effects - Optimized for performance */}
                    <div className="absolute top-0 left-1/4 w-64 h-64 bg-via-teal/10 blur-3xl group-hover:bg-via-teal/20 transition-colors duration-1000" />
                    <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-via-pink/10 blur-3xl group-hover:bg-via-pink/20 transition-colors duration-1000" />

                    <div className="relative z-10 text-center md:text-left flex flex-col justify-center items-center md:items-start">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-via-teal to-emerald-400 mb-2 drop-shadow-[0_0_15px_rgba(20,184,166,0.5)] group-hover:scale-105 transition-transform duration-300 origin-center md:origin-left"
                        >
                            20M+
                        </motion.div>
                        <div className="text-sm md:text-base text-slate-300 font-bold uppercase tracking-widest border-t border-slate-700 pt-4 w-fit px-2 group-hover:text-white transition-colors">Cross-Chain Messages</div>
                    </div>

                    <div className="relative z-10 text-center md:text-left flex flex-col justify-center items-center md:items-start pl-0 md:pl-12 border-l border-slate-800">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-via-pink to-rose-400 mb-2 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)] group-hover:scale-105 transition-transform duration-300 origin-center md:origin-left"
                        >
                            140+
                        </motion.div>
                        <div className="text-sm md:text-base text-slate-300 font-bold uppercase tracking-widest border-t border-slate-700 pt-4 w-fit px-2 group-hover:text-white transition-colors">Connected Blockchains</div>
                    </div>
                </div>

                {/* Card 1: General Message Passing (Large) */}
                <Card className="md:col-span-2 relative group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                    <div className="absolute top-8 left-8 z-20">
                        <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Cpu className="text-via-teal" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">General Message Passing</h3>
                        <p className="text-slate-500 max-w-sm">Send arbitrary data between any supported chains. EVM, non-EVM, and private chains supported out of the box.</p>
                    </div>
                    {/* Graphic placed absolutely to right */}
                    <div className="absolute right-0 bottom-0 w-[350px] h-[300px] z-10 opacity-90">
                        <MessagePassingGraphic />
                    </div>
                </Card>

                {/* Card 2: Web2 Connectivity */}
                <Card className="md:col-span-1 bg-slate-900 text-white border-slate-800 group hover:shadow-xl hover:shadow-via-teal/10 hover:-translate-y-1 transition-all duration-300">
                    <div className="h-full flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
                                <Globe className="text-via-pink" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Web2 <span className="text-via-pink">⇔</span> Web3</h3>
                            <p className="text-slate-400 text-sm">Call smart contracts from conventional APIs. Bridge the gap.</p>
                        </div>
                    </div>
                </Card>

                {/* Card 3: Security */}
                <Card className="md:col-span-1 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-slate-200 transition-colors">
                        <ShieldCheck className="text-slate-700" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Decentralized Trust</h3>
                    <p className="text-slate-500 text-sm">Secured by a decentralized peer-to-peer mesh network.</p>
                </Card>

                {/* Card 4: Digital Asset Transfers */}
                <Card className="md:col-span-2 group overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="flex flex-col md:flex-row h-full relative">
                        <div className="p-2 flex-1 flex flex-col justify-center z-10 relative">
                            <div className="w-12 h-12 bg-via-teal/10 rounded-xl flex items-center justify-center mb-4">
                                <Zap className="text-via-teal" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Digital Asset Transfers</h3>
                            <p className="text-slate-500 max-w-sm">Teleport assets across chains with finality in seconds, not minutes.</p>
                        </div>
                        {/* Graphic Container */}
                        <div className="flex-1 relative h-full min-h-[200px]">
                            <SettlementGraphic />
                        </div>
                    </div>
                </Card>
            </div>
        </section>
    );
}

// --- Internal Graphic Components ---

const MessagePassingGraphic: React.FC = () => {
    // Ball movement: [140, 40, 140] over 8s linear
    // Nodes: Bottom (140), Middle (90), Top (40)
    // T=0 (0%): Bottom. T=2 (25%): Middle UP. T=4 (50%): Top. T=6 (75%): Middle DOWN. T=8 (100%): Bottom.

    const diamondPath = "M0 30 L-60 0 L0 -30 L60 0 Z";

    return (
        <div className="w-full h-full min-h-[200px] flex items-center justify-center overflow-hidden relative">
            <svg width="100%" height="100%" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
                {/* Layer 1 (Bottom - y=140) */}
                <g transform="translate(150, 140)">
                    <motion.path
                        d={diamondPath}
                        fill="rgba(241, 245, 249, 0.5)"
                        stroke="#cbd5e1"
                        strokeWidth="2"
                    />
                    {/* Ripple: Fire at 0% (Start) */}
                    <motion.path
                        d={diamondPath}
                        fill="none"
                        stroke="#00E5E5"
                        strokeWidth="2"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{
                            scale: [0.8, 1.2],
                            opacity: [1, 0]
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            times: [0, 0.2], // 0s to 1.6s
                            ease: "easeOut"
                        }}
                    />
                </g>

                {/* Layer 2 (Middle - y=90) */}
                <g transform="translate(150, 90)">
                    <motion.path
                        d={diamondPath}
                        fill="rgba(241, 245, 249, 0.5)"
                        stroke="#cbd5e1"
                        strokeWidth="2"
                    />
                    {/* Ripple UP: Fire at 25% (2s) - Epsilon Fix */}
                    <motion.path
                        d={diamondPath}
                        fill="none"
                        stroke="#00E5E5"
                        strokeWidth="2"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{
                            scale: [0.8, 0.8, 0.8, 1.2, 1.2],
                            opacity: [0, 0, 1, 0, 0]
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            // 0-0.24 (Hidden), 0.25 (Show), 0.45 (Fade), 0.45-1 (Hidden)
                            times: [0, 0.24, 0.25, 0.45, 1],
                            ease: ["linear", "linear", "easeOut", "linear"]
                        }}
                    />
                    {/* Ripple DOWN: Fire at 75% (6s) - Epsilon Fix */}
                    <motion.path
                        d={diamondPath}
                        fill="none"
                        stroke="#00E5E5"
                        strokeWidth="2"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{
                            scale: [0.8, 0.8, 0.8, 1.2, 1.2],
                            opacity: [0, 0, 1, 0, 0]
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            times: [0, 0.74, 0.75, 0.95, 1],
                            ease: ["linear", "linear", "easeOut", "linear"]
                        }}
                    />
                </g>

                {/* Layer 3 (Top - y=40) */}
                <g transform="translate(150, 40)">
                    <motion.path
                        d={diamondPath}
                        fill="rgba(241, 245, 249, 0.5)"
                        stroke="#cbd5e1"
                        strokeWidth="2"
                    />
                    {/* Ripple: Fire at 50% (4s) - Epsilon Fix */}
                    <motion.path
                        d={diamondPath}
                        fill="none"
                        stroke="#00E5E5"
                        strokeWidth="2"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{
                            scale: [0.8, 0.8, 0.8, 1.2, 1.2],
                            opacity: [0, 0, 1, 0, 0]
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            times: [0, 0.49, 0.5, 0.7, 1],
                            ease: ["linear", "linear", "easeOut", "linear"]
                        }}
                    />
                </g>

                {/* Vertical Connection Beam */}
                <motion.line
                    x1="150" y1="140" x2="150" y2="40"
                    stroke="url(#beam-gradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                />

                {/* Moving Signal - Linear motion [140 -> 40 -> 140] */}
                <motion.circle
                    r="4" fill="#00E5E5" cx="150" cy="140"
                    initial={{ cy: 140 }}
                    animate={{ cy: [140, 40, 140] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />

                <defs>
                    <linearGradient id="beam-gradient" x1="150" y1="140" x2="150" y2="40" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#e2e8f0" stopOpacity="0.2" />
                        <stop offset="0.5" stopColor="#00E5E5" stopOpacity="0.8" />
                        <stop offset="1" stopColor="#e2e8f0" stopOpacity="0.2" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
};

const SettlementGraphic: React.FC = () => {
    return (
        <div className="w-full h-full absolute inset-0 flex items-center justify-center overflow-hidden">
            <svg width="320" height="200" viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Left Side: Web2 Infrastructure (Static Rows) */}
                <g transform="translate(40, 60)">
                    <rect y="0" width="80" height="6" rx="3" fill="#334155" />
                    <rect y="20" width="80" height="6" rx="3" fill="#334155" />
                    <rect y="40" width="80" height="6" rx="3" fill="#334155" />
                    <rect y="60" width="80" height="6" rx="3" fill="#334155" />

                    {/* Teal segment: SILKY DIAGONAL GLIDE */}
                    {/* Smoothly interpolates from Top-Left to Bottom-Right */}
                    <motion.rect
                        width="20" height="6" rx="3" fill="#00E5E5"
                        initial={{ x: 0, y: 0, opacity: 0 }}
                        animate={{
                            x: [0, 60],
                            y: [0, 80], // Moving slightly past the last row for "flow through" feel
                            opacity: [0, 1, 1, 0]
                        }}
                        transition={{
                            duration: 3, // Much faster, fluid cycle
                            repeat: Infinity,
                            times: [0, 0.1, 0.8, 1],
                            ease: "easeInOut"
                        }}
                    />
                </g>

                {/* Center: The Threshold */}
                <line x1="160" y1="40" x2="160" y2="160" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />

                {/* Right Side: Web3 Nodes */}
                <g transform="translate(200, 70)">
                    {/* Ball 1 */}
                    <motion.circle
                        cx="20" cy="10" r="4"
                        animate={{
                            fill: ["#00E5E5", "#00E5E5", "#00E5E5", "#94a3b8"], // Teal -> Teal -> Grey (Pop)
                            y: [0, -4, 0, 0], // Floating check
                            opacity: [0, 1, 1, 0],
                            scale: [0.8, 1, 1, 1.5] // Pop out
                        }}
                        transition={{
                            duration: 3, // Sync with Glide (3s)
                            repeat: Infinity,
                            // Arrive at 2.4s (0.8), Float till 2.7s (0.9), Pop till 3.0s (1.0)
                            times: [0.8, 0.82, 0.9, 1],
                            ease: "easeInOut"
                        }}
                    />

                    {/* Ball 2 */}
                    <motion.circle
                        cx="20" cy="40" r="4"
                        animate={{
                            fill: ["#00E5E5", "#00E5E5", "#00E5E5", "#94a3b8"],
                            y: [0, -4, 0, 0],
                            opacity: [0, 1, 1, 0],
                            scale: [0.8, 1, 1, 1.5]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: 0.1, // Slight stagger for organic feel
                            times: [0.8, 0.82, 0.9, 1],
                            ease: "easeInOut"
                        }}
                    />

                    {/* Ball 3 */}
                    <motion.circle
                        cx="20" cy="70" r="4"
                        animate={{
                            fill: ["#00E5E5", "#00E5E5", "#00E5E5", "#94a3b8"],
                            y: [0, -4, 0, 0],
                            opacity: [0, 1, 1, 0],
                            scale: [0.8, 1, 1, 1.5]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: 0.2, // Slight stagger
                            times: [0.8, 0.82, 0.9, 1],
                            ease: "easeInOut"
                        }}
                    />
                </g>
            </svg>
        </div>
    );
};
