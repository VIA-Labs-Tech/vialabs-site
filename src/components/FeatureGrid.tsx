import { Card } from './ui/Card';
import { ShieldCheck, Zap, Cpu, Blocks } from 'lucide-react';
import { motion } from 'framer-motion';

export function FeatureGrid() {
    return (
        <section className="py-12 md:py-24 px-4 md:px-6 max-w-7xl mx-auto">
            <div className="mb-8 md:mb-16">
                <h2 className="text-4xl font-bold tracking-tight mb-4">Infrastructure for the <span className="text-via-teal">new internet</span>.</h2>
                <p className="text-xl text-slate-500 max-w-2xl">
                    Everything you need to build cross-chain applications without the complexity.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
                {/* Stats Row - Captivating Animation & Aliveness */}
                <div className="md:col-span-3 grid grid-cols-2 gap-4 sm:gap-6 p-6 sm:p-8 bg-slate-900 rounded-3xl text-white mb-6 relative overflow-hidden group hover:shadow-xl hover:shadow-via-teal/10 hover:-translate-y-1 transition-all duration-300">
                    {/* Background glow effects - Optimized for performance */}
                    <div className="absolute top-0 left-1/4 w-64 h-64 bg-via-teal/10 blur-3xl group-hover:bg-via-teal/20 transition-colors duration-1000" />
                    <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-via-pink/10 blur-3xl group-hover:bg-via-pink/20 transition-colors duration-1000" />

                    <div className="relative z-10 text-center md:text-left flex flex-col justify-center items-center md:items-start">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            className="text-4xl sm:text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-via-teal to-emerald-400 mb-2 drop-shadow-[0_0_15px_rgba(20,184,166,0.5)] group-hover:scale-105 transition-transform duration-300 origin-center md:origin-left"
                        >
                            20M+
                        </motion.div>
                        <div className="text-[10px] sm:text-sm md:text-base text-slate-300 font-bold uppercase tracking-widest border-t border-slate-700 pt-3 sm:pt-4 w-fit px-2 group-hover:text-white transition-colors">Cross-Chain Messages</div>
                    </div>

                    <div className="relative z-10 text-center md:text-left flex flex-col justify-center items-center md:items-start pl-0 md:pl-12 border-l border-slate-800">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl sm:text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-via-pink to-rose-400 mb-2 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)] group-hover:scale-105 transition-transform duration-300 origin-center md:origin-left"
                        >
                            140+
                        </motion.div>
                        <div className="text-[10px] sm:text-sm md:text-base text-slate-300 font-bold uppercase tracking-widest border-t border-slate-700 pt-3 sm:pt-4 w-fit px-2 group-hover:text-white transition-colors">Connected Blockchains</div>
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
                    <div className="hidden lg:block absolute right-0 bottom-0 w-[350px] h-[300px] z-10 opacity-90">
                        <MessagePassingGraphic />
                    </div>
                </Card>

                {/* Card 2: Web2 Connectivity */}
                <Card className="md:col-span-1 bg-slate-900 text-white border-slate-800 group hover:shadow-xl hover:shadow-via-teal/10 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
                            <Blocks className="text-via-pink" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Web2 <span className="text-via-pink">⇔</span> Web3</h3>
                        <p className="text-slate-400 text-sm">Call smart contracts from conventional APIs. Bridge the gap.</p>
                    </div>
                </Card>

                {/* Card 3: Security */}
                <Card className="md:col-span-1 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-slate-200 transition-colors">
                        <ShieldCheck className="text-slate-700" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Decentralized Trust</h3>
                    <p className="text-slate-500 text-sm">Secured by a decentralized peer-to-peer mesh network.</p>
                </Card>

                {/* Card 4: Digital Asset Transfers */}
                <Card className="md:col-span-2 group overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="flex flex-col md:flex-row h-full relative">
                        <div className="p-2 flex-1 flex flex-col z-10 relative">
                            <div className="w-12 h-12 bg-via-teal/10 rounded-xl flex items-center justify-center mb-4">
                                <Zap className="text-via-teal" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Digital Asset Transfers</h3>
                            <p className="text-slate-500 max-w-sm">Teleport assets across chains with finality in seconds, not minutes.</p>
                        </div>
                        {/* Graphic Container */}
                        <div className="flex-1 relative h-full min-h-[200px] hidden lg:block">
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
                            times: [0, 0.2],
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
                            times: [0, 0.24, 0.25, 0.45, 1],
                            ease: ["linear", "linear", "easeOut", "linear"]
                        }}
                    />
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
    // Two chain nodes with a teleport/portal effect in the center
    // Assets fade out on left, materialize on right
    const duration = 3.5;

    return (
        <div className="w-full h-full absolute inset-0 flex items-center justify-center overflow-hidden">
            <svg width="320" height="200" viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <filter id="settle-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <filter id="settle-glow-lg" x="-100%" y="-100%" width="300%" height="300%">
                        <feGaussianBlur stdDeviation="8" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <linearGradient id="settle-beam" x1="80" y1="100" x2="240" y2="100" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#00E5E5" stopOpacity="0" />
                        <stop offset="0.3" stopColor="#00E5E5" stopOpacity="0.6" />
                        <stop offset="0.5" stopColor="#FF00FF" stopOpacity="0.8" />
                        <stop offset="0.7" stopColor="#00E5E5" stopOpacity="0.6" />
                        <stop offset="1" stopColor="#00E5E5" stopOpacity="0" />
                    </linearGradient>
                    <radialGradient id="settle-portal" cx="50%" cy="50%" r="50%">
                        <stop stopColor="#FF00FF" stopOpacity="0.4" />
                        <stop offset="0.6" stopColor="#00E5E5" stopOpacity="0.2" />
                        <stop offset="1" stopColor="#00E5E5" stopOpacity="0" />
                    </radialGradient>
                </defs>

                {/* Left Chain Node */}
                <g transform="translate(65, 100)">
                    <circle r="24" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                    <circle r="16" fill="none" stroke="#334155" strokeWidth="1" />
                    {/* Chain icon lines */}
                    <rect x="-8" y="-6" width="16" height="4" rx="2" fill="#475569" />
                    <rect x="-6" y="2" width="12" height="4" rx="2" fill="#475569" />

                    {/* Pulse when asset departs */}
                    <motion.circle
                        r="24"
                        fill="none"
                        stroke="#00E5E5"
                        strokeWidth="2"
                        initial={{ scale: 1, opacity: 0 }}
                        animate={{
                            scale: [1, 1, 1.5, 1.5],
                            opacity: [0, 0.7, 0, 0]
                        }}
                        transition={{
                            duration: duration,
                            repeat: Infinity,
                            times: [0, 0.05, 0.25, 1],
                            ease: "easeOut"
                        }}
                    />
                </g>

                {/* Right Chain Node */}
                <g transform="translate(255, 100)">
                    <circle r="24" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                    <circle r="16" fill="none" stroke="#334155" strokeWidth="1" />
                    <rect x="-8" y="-6" width="16" height="4" rx="2" fill="#475569" />
                    <rect x="-6" y="2" width="12" height="4" rx="2" fill="#475569" />

                    {/* Pulse when asset arrives */}
                    <motion.circle
                        r="24"
                        fill="none"
                        stroke="#00E5E5"
                        strokeWidth="2"
                        initial={{ scale: 1, opacity: 0 }}
                        animate={{
                            scale: [1, 1, 1, 1.5, 1.5],
                            opacity: [0, 0, 0.7, 0, 0]
                        }}
                        transition={{
                            duration: duration,
                            repeat: Infinity,
                            times: [0, 0.55, 0.6, 0.8, 1],
                            ease: "easeOut"
                        }}
                    />
                </g>

                {/* Energy beam connecting the two nodes */}
                <motion.line
                    x1="90" y1="100" x2="230" y2="100"
                    stroke="url(#settle-beam)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Speed particles along the beam */}
                {[0, 1, 2].map((i) => (
                    <motion.circle
                        key={`particle-${i}`}
                        cy="100"
                        r="1.5"
                        fill="#00E5E5"
                        initial={{ cx: 90, opacity: 0 }}
                        animate={{
                            cx: [90, 230],
                            opacity: [0, 1, 1, 0]
                        }}
                        transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: i * 0.3,
                            repeatDelay: 0.1,
                            ease: "easeIn"
                        }}
                    />
                ))}

                {/* Center Portal / Warp Effect */}
                <g transform="translate(160, 100)">
                    {/* Outer portal ring */}
                    <motion.ellipse
                        cx="0" cy="0" rx="20" ry="30"
                        fill="none"
                        stroke="#FF00FF"
                        strokeWidth="1.5"
                        strokeDasharray="4 3"
                        initial={{ rotate: 0, opacity: 0.4 }}
                        animate={{ rotate: 360, opacity: [0.4, 0.7, 0.4] }}
                        transition={{
                            rotate: { duration: 6, repeat: Infinity, ease: "linear" },
                            opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                        }}
                    />

                    {/* Inner portal ring */}
                    <motion.ellipse
                        cx="0" cy="0" rx="12" ry="20"
                        fill="url(#settle-portal)"
                        stroke="#00E5E5"
                        strokeWidth="1"
                        initial={{ rotate: 0 }}
                        animate={{ rotate: -360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Portal core glow */}
                    <motion.circle
                        cx="0" cy="0" r="6"
                        fill="#FF00FF"
                        filter="url(#settle-glow-lg)"
                        initial={{ opacity: 0.2 }}
                        animate={{ opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                </g>

                {/* Token asset - fades out on left, materializes on right */}
                {/* Left side: token disappearing */}
                <motion.g
                    filter="url(#settle-glow)"
                    initial={{ x: 65, opacity: 0 }}
                    animate={{
                        x: [65, 65, 130, 130],
                        opacity: [0, 1, 0, 0],
                        scale: [1, 1, 0.3, 0.3]
                    }}
                    transition={{
                        duration: duration,
                        repeat: Infinity,
                        times: [0, 0.05, 0.35, 1],
                        ease: "easeIn"
                    }}
                >
                    <circle cy="100" r="6" fill="#00E5E5" />
                    <circle cy="100" r="3" fill="#0d1117" />
                </motion.g>

                {/* Right side: token materializing */}
                <motion.g
                    filter="url(#settle-glow)"
                    initial={{ x: 190, opacity: 0 }}
                    animate={{
                        x: [190, 190, 255, 255],
                        opacity: [0, 0, 1, 0],
                        scale: [0.3, 0.3, 1, 1]
                    }}
                    transition={{
                        duration: duration,
                        repeat: Infinity,
                        times: [0, 0.5, 0.75, 1],
                        ease: "easeOut"
                    }}
                >
                    <circle cy="100" r="6" fill="#00E5E5" />
                    <circle cy="100" r="3" fill="#0d1117" />
                </motion.g>

                {/* Lightning bolt / speed indicator */}
                <g transform="translate(160, 145)">
                    <motion.g
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        {/* Lightning bolt icon */}
                        <path
                            d="M-4 -6 L1 -6 L-1 -1 L4 -1 L-2 8 L0 2 L-4 2 Z"
                            fill="#FF00FF"
                            opacity="0.9"
                        />
                    </motion.g>
                    {/* "<1s" label */}
                    <text
                        x="10"
                        y="3"
                        fill="#94a3b8"
                        fontSize="9"
                        fontFamily="monospace"
                        fontWeight="bold"
                    >
                        &lt;5s
                    </text>
                </g>

                {/* Label: Source */}
                <text x="65" y="140" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">Source</text>
                {/* Label: Destination */}
                <text x="255" y="140" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">Destination</text>
            </svg>
        </div>
    );
};
