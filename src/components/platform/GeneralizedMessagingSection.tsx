import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileCode, Database, CreditCard } from 'lucide-react';

const packets = [
  { type: 'Token', icon: CreditCard, color: '#FF00FF', darkColor: '#FF00FF', label: 'USDC Transfer' },
  { type: 'NFT', icon: FileCode, color: '#00E5E5', darkColor: '#00E5E5', label: 'NFT Metadata' },
  { type: 'Arbitrary Data', icon: Database, color: '#0f172a', darkColor: '#e2e8f0', label: 'Contract State' },
];

export default function GeneralizedMessagingSection() {
  const [activePacket, setActivePacket] = useState(0);
  const [timerKey, setTimerKey] = useState(0);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePacket((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, [timerKey]);

  const handleManualSelect = (index: number) => {
    setActivePacket(index);
    setTimerKey(prev => prev + 1);
  };

  const currentPacket = packets[activePacket];
  const packetColor = isDark ? currentPacket.darkColor : currentPacket.color;

  return (
    <div className="w-full">
      <div className="grid min-[1116px]:grid-cols-2 gap-8 md:gap-16 items-center">

        {/* Text Content */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
            More Than Just <br />
            <span className="text-via-teal">Token Bridging.</span>
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
            VIA Labs provides more than just asset transfers. We enable <span className="font-bold text-slate-900 dark:text-white">arbitrary data transfer</span> between contracts on different blockchains.
            Send messages, trigger functions, and synchronize state seamlessly.
          </p>

          <div className="space-y-4">
            {packets.map((p, idx) => (
              <motion.button
                key={idx}
                onClick={() => handleManualSelect(idx)}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 text-left ${idx === activePacket
                  ? 'bg-white dark:bg-[#1a1b23] border-via-teal shadow-lg shadow-via-teal/5 scale-105'
                  : 'bg-[#F5F5F7] dark:bg-[#0F1117] border-transparent opacity-60 hover:opacity-100 hover:bg-white dark:hover:bg-[#1a1b23] hover:border-slate-200 dark:hover:border-slate-700'
                  }`}
              >
                <div className={`p-2 rounded-lg ${idx === activePacket ? 'bg-via-teal/10' : 'bg-slate-200 dark:bg-slate-700'}`}>
                  <p.icon className={`w-5 h-5 ${idx === activePacket ? 'text-via-teal' : 'text-slate-500 dark:text-slate-400'}`} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{p.type}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Example: {p.label}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* The Graphic: Engineered Data Pipeline — hidden on mobile */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative h-[400px] bg-white dark:bg-[#1a1b23] rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden items-center justify-center hidden min-[1116px]:flex"
        >

          {/* Background Grid inside card */}
          <div className="absolute inset-0 opacity-30 dark:opacity-10"
            style={{
              backgroundImage: "linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)",
              backgroundSize: "20px 20px"
            }}>
          </div>

          {/* Source Chain Node */}
          <div className="absolute left-10 top-1/2 -translate-y-1/2 w-24 h-32 bg-slate-50 dark:bg-[#0F1117] rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center z-10 group">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-2">
              <div className="w-3 h-3 bg-slate-900 dark:bg-slate-300 rounded-sm"></div>
            </div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Chain A</span>
          </div>

          {/* Destination Chain Node */}
          <div className="absolute right-10 top-1/2 -translate-y-1/2 w-24 h-32 bg-slate-50 dark:bg-[#0F1117] rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center z-10">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-2">
              <div className="w-3 h-3 bg-via-teal rounded-sm"></div>
            </div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Chain B</span>
          </div>

          {/* Connection Line */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <path
              d="M 130 200 C 200 200, 300 200, 450 200"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="2"
              strokeDasharray="6 6"
              className="dark:stroke-slate-700"
            />
          </svg>

          {/* Animated Packet */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activePacket}
              initial={{ x: -150, opacity: 0, scale: 0.8 }}
              animate={{
                x: 150,
                opacity: [0, 1, 1, 1, 0],
                scale: 1
              }}
              transition={{
                duration: 3,
                ease: "easeInOut",
                times: [0, 0.1, 0.5, 0.9, 1]
              }}
              className="absolute z-20 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
            >
              <div className="relative">
                {/* Glow effect */}
                <div
                  className="absolute inset-0 blur-xl opacity-50"
                  style={{ backgroundColor: packetColor }}
                ></div>

                {/* The Packet Body */}
                <div className="relative w-16 h-16 bg-white dark:bg-[#1a1b23] rounded-xl border shadow-lg flex items-center justify-center overflow-hidden" style={{ borderColor: packetColor }}>
                  {/* Inner graphical representation of data */}
                  <div className="absolute inset-0 opacity-10" style={{ backgroundColor: packetColor }}></div>
                  <currentPacket.icon className="w-8 h-8" style={{ color: packetColor }} />

                  {/* Technical bits animation */}
                  <motion.div
                    animate={{ y: [0, -40] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute left-1 top-0 opacity-20 text-[6px] font-mono leading-tight"
                  >
                    010101<br />101010<br />001100<br />110011
                  </motion.div>
                </div>

                {/* Label Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-bold rounded-full"
                >
                  {currentPacket.label}
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Success Pulse at Destination */}
          <motion.div
            key={`pulse-${activePacket}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ delay: 2.2, duration: 1 }}
            className="absolute right-14 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-via-teal"
          ></motion.div>

        </motion.div>

      </div>
    </div >
  );
}
