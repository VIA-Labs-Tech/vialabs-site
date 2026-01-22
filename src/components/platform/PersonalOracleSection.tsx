import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Radio, Activity, Lock, Users } from 'lucide-react';

export default function PersonalOracleSection() {
  const [activeTab, setActiveTab] = useState<'shared' | 'personal'>('personal');
  const [timerKey, setTimerKey] = useState(0);

  // Auto-cycle every 7 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab(prev => prev === 'shared' ? 'personal' : 'shared');
    }, 10000);
    return () => clearInterval(interval);
  }, [timerKey]);

  const handleManualSelect = (tab: 'shared' | 'personal') => {
    setActiveTab(tab);
    setTimerKey(prev => prev + 1);
  };


  return (
    <div className="w-full">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
          Your Own Lane. <br />
          <span className="text-via-pink">Exclusively Yours.</span>
        </h2>
        <p className="text-lg text-slate-500 leading-relaxed">
          Move away from shared, congested validator sets. VIA Labs introduces <span className="font-bold text-slate-900">Personal Oracle Networks</span> that belong exclusively to your application. No queues, no gas wars, just pure performance.
        </p>
      </div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-w-5xl mx-auto flex flex-col md:flex-row min-h-[500px]"
      >

        {/* Controls / Sidebar */}
        <div className="w-full md:w-1/3 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 p-8 flex flex-col justify-center gap-6">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Select Network Architecture</h3>

            <motion.button
              onClick={() => handleManualSelect('shared')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-300 relative overflow-hidden group ${activeTab === 'shared' ? 'bg-white border-slate-300 shadow-md' : 'bg-transparent border-transparent hover:bg-slate-100'}`}
            >
              <div className="flex items-center gap-3 relative z-10">
                <div className={`p-2 rounded-lg ${activeTab === 'shared' ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-500'}`}>
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Shared Network</h4>
                  <p className="text-xs text-slate-500 mt-1">Congested & Public</p>
                </div>
              </div>
            </motion.button>

            <motion.button
              onClick={() => handleManualSelect('personal')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-300 relative overflow-hidden group ${activeTab === 'personal' ? 'bg-white border-via-teal shadow-md ring-1 ring-via-teal/20' : 'bg-transparent border-transparent hover:bg-slate-100'}`}
            >
              <div className="flex items-center gap-3 relative z-10">
                <div className={`p-2 rounded-lg ${activeTab === 'personal' ? 'bg-via-teal/10 text-via-teal' : 'bg-slate-200 text-slate-500'}`}>
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Personal Oracle</h4>
                  <p className="text-xs text-slate-500 mt-1">Dedicated & Exclusive</p>
                </div>
              </div>
              {activeTab === 'personal' && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-via-teal/20 to-transparent rounded-bl-full -mr-4 -mt-4"></div>
              )}
            </motion.button>
          </div>

          <div className="mt-4 p-4 rounded-xl bg-white border border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-2 mb-2 font-semibold text-slate-900">
              <Activity className="w-4 h-4" />
              Network Status
            </div>
            {activeTab === 'shared' ? (
              <span className="text-amber-600 font-medium">High Traffic • Latency Spikes</span>
            ) : (
              <span className="text-via-teal font-medium">Optimal • 100% Availability</span>
            )}
          </div>
        </div>

        {/* Visualization Canvas */}
        <div className="relative w-full md:w-2/3 bg-slate-900 overflow-hidden flex items-center justify-center">
          {/* Background Grid - Dark Mode for Contrast */}
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)",
              backgroundSize: "40px 40px"
            }}>
          </div>

          {/* Shared Network Visualization - Synchronized Chaos */}
          {activeTab === 'shared' && (
            <div className="relative w-full h-full">
              {/* 
                  We generate a set of deterministic nodes. 
                  Some are connected to the center (Lock), some are just floating.
                  We use the same motion values for lines and dots to maximize 'tacking'.
               */}
              {Array.from({ length: 24 }).map((_, i) => {
                // Randomize consistent paths - Increased chaos via modulos
                const isConnected = i < 12; // Connect first 12 nodes
                const duration = 2 + (i % 5); // Faster, staggered durations

                // Generate pseudo-random paths based on index
                const xPath = [
                  ((i * 37) % 300) - 150,
                  ((i * 73) % 400) - 200,
                  ((i * 19) % 300) - 150
                ];
                const yPath = [
                  ((i * 41) % 200) - 100,
                  ((i * 89) % 300) - 150,
                  ((i * 31) % 200) - 100
                ];

                return (
                  <React.Fragment key={i}>
                    {/* The Dot - High Z-index to sit ON TOP of lines */}
                    <motion.div
                      animate={{
                        x: xPath,
                        y: yPath,
                        opacity: [0.3, 0.8, 0.3]
                      }}
                      transition={{
                        duration: duration,
                        repeat: Infinity,
                        ease: "linear",
                        repeatType: "reverse"
                      }}
                      className="absolute top-1/2 left-1/2 w-3 h-3 -ml-1.5 -mt-1.5 rounded-full bg-slate-400 blur-[0.5px] z-20 shadow-sm"
                    />

                    {/* The Connection Line (Only for some nodes) - Low Z-index */}
                    {isConnected && (
                      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                        <motion.line
                          x1="50%"
                          y1="50%"
                          /* 
                             We animate x2 and y2 using keyframes to match the dot's movement.
                             The dot moves relative to center (50% 50%) by xPath/yPath pixels.
                          */
                          animate={{
                            x2: xPath.map(x => `calc(50% + ${x}px)`),
                            y2: yPath.map(y => `calc(50% + ${y}px)`)
                          }}
                          stroke="#f59e0b" // Amber-500
                          strokeWidth="1"
                          strokeOpacity="0.4"
                          transition={{
                            duration: duration,
                            repeat: Infinity,
                            ease: "linear",
                            repeatType: "reverse"
                          }}
                        />
                      </svg>
                    )}
                  </React.Fragment>
                );
              })}

              {/* Central User Node - Struggling */}
              {/* Added bg-slate-900 to hide lines behind the lock. Removed pulse. */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
                <div className="w-16 h-16 bg-slate-900 rounded-full border border-amber-500/50 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                  <Lock className="w-6 h-6 text-amber-500" />
                </div>
              </div>

              <motion.div
                animate={{ opacity: [1, 0.6, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-red-500/20 border border-red-500/50 text-red-200 px-3 py-1 rounded-full text-xs font-mono whitespace-nowrap z-30"
              >
                NETWORK CONGESTION DETECTED
              </motion.div>
            </div>
          )}

          {/* Personal Oracle Visualization */}
          {activeTab === 'personal' && (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* The Protected Zone Ring - Static Background */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute w-64 h-64 rounded-full border border-via-teal/30 bg-via-teal/5 backdrop-blur-sm"
              ></motion.div>

              {/* Rotating System Container */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute w-64 h-64 flex items-center justify-center"
              >
                {/* Connection Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <defs>
                    <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#00E5E5" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                  {[0, 120, 240].map((deg) => (
                    <g key={deg} transform={`rotate(${deg} 128 128)`}>
                      {/* Line from center (128,128) to right edge (256, 128) */}
                      <line
                        x1="128" y1="128"
                        x2="256" y2="128"
                        stroke="url(#gradient-line)"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                      />
                    </g>
                  ))}
                </svg>

                {/* Orbiting Shields */}
                {[0, 120, 240].map((deg) => (
                  <div
                    key={deg}
                    className="absolute top-1/2 left-1/2 w-0 h-0 flex items-center justify-center"
                    style={{
                      transform: `rotate(${deg}deg) translate(128px)`
                    }}
                  >
                    {/* Counter-rotating Container to keep icon upright */}
                    <motion.div
                      // We animate from -deg to -deg - 360 to ensure a perfect loop that aligns with parent
                      animate={{ rotate: [-deg, -deg - 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="w-10 h-10 bg-slate-900 border-2 border-via-teal rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,229,229,0.5)] z-10 shrink-0 aspect-square"
                    >
                      <Shield className="w-4 h-4 text-via-teal" />
                    </motion.div>
                  </div>
                ))}
              </motion.div>

              {/* Central App Node - Secure (Static in center, above lines) */}
              <div className="relative z-20 w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(0,229,229,0.3)]">
                <div className="absolute inset-0 bg-via-teal/10 rounded-2xl animate-pulse"></div>
                <Radio className="w-8 h-8 text-slate-900" />
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                // Added -ml-24 per user request to fix visual centering
                className="absolute bottom-6 left-1/2 -translate-x-1/2 -ml-24 bg-via-teal/20 border border-via-teal/50 text-via-teal px-3 py-1 rounded-full text-xs font-mono whitespace-nowrap z-30"
              >
                SECURE • DEDICATED • FAST
              </motion.div>
            </div>
          )}
        </div>

      </motion.div>
    </div>
  );
}