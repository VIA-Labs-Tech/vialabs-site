import React from 'react';
import { Globe, Link as LinkIcon, ShieldCheck, Play } from 'lucide-react';

// Custom Switch Component
const Toggle = ({ enabled, onChange, disabled = false }: { enabled: boolean; onChange: (val: boolean) => void; disabled?: boolean }) => (
    <button
        onClick={() => !disabled && onChange(!enabled)}
        className={`
            relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-via-teal focus:ring-offset-2
            ${enabled ? 'bg-slate-900 border-transparent' : 'bg-slate-200 border-transparent'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
    >
        <span
            className={`
                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                ${enabled ? 'translate-x-6' : 'translate-x-1'}
            `}
        />
    </button>
);

interface SecurityControlsProps {
    chainEnabled: boolean;
    setChainEnabled: (val: boolean) => void;
    projectEnabled: boolean;
    setProjectEnabled: (val: boolean) => void;
    onSimulate: () => void;
    isSimulating: boolean;
}

export const SecurityControls: React.FC<SecurityControlsProps> = ({
    chainEnabled,
    setChainEnabled,
    projectEnabled,
    setProjectEnabled,
    onSimulate,
    isSimulating
}) => {
    return (
        <div className="space-y-8 flex flex-col justify-center h-full">
            <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
                    Definable Security
                </h2>
                <p className="text-slate-500 text-lg leading-relaxed">
                    Configure your security stack. VIA Labs allows you to aggregate validation layers for maximum finality.
                </p>
            </div>

            <div className="space-y-4">
                {/* Layer 1: VIA */}
                <div className="group relative p-6 bg-white rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-slate-300 overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-via-teal" />
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-full bg-slate-50 border border-slate-100 text-via-teal">
                            <Globe className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="font-bold text-slate-900">VIA Layer</h3>
                                <span className="text-[10px] font-bold tracking-wider text-via-teal bg-via-teal/10 px-2 py-0.5 rounded-full uppercase">Always On</span>
                            </div>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                The fundamental transport layer. Handles message formatting, routing, and delivery guarantees by a permissionless validator network.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Layer 2: Chain */}
                <div className={`p-6 bg-white rounded-2xl border transition-all duration-300 shadow-sm ${chainEnabled ? 'border-slate-300 ring-1 ring-slate-200' : 'border-slate-200 opacity-80'}`}>
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-full border transition-colors ${chainEnabled ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                            <LinkIcon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <h3 className={`font-bold transition-colors ${chainEnabled ? 'text-slate-900' : 'text-slate-400'}`}>Chain Layer</h3>
                                <Toggle enabled={chainEnabled} onChange={setChainEnabled} disabled={isSimulating} />
                            </div>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Utilizes source and destination chain security. Waits for block finality before propagation.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Layer 3: Project */}
                <div className={`p-6 bg-white rounded-2xl border transition-all duration-300 shadow-sm ${projectEnabled ? 'border-slate-300 ring-1 ring-slate-200' : 'border-slate-200 opacity-80'}`}>
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-full border transition-colors ${projectEnabled ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <h3 className={`font-bold transition-colors ${projectEnabled ? 'text-slate-900' : 'text-slate-400'}`}>Project Layer</h3>
                                <Toggle enabled={projectEnabled} onChange={setProjectEnabled} disabled={isSimulating} />
                            </div>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Application-specific validation logic, whitelists, and rate limits. Operated by the integrating team.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Area */}
            <div className="pt-2">
                <button
                    onClick={onSimulate}
                    disabled={isSimulating}
                    className="group w-full relative flex items-center justify-center gap-3 bg-slate-900 text-white py-4 px-8 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-[0.98]"
                >
                    {isSimulating ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-via-teal" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Verifying Message...
                        </span>
                    ) : (
                        <>
                            <span>Simulate Transaction</span>
                            <Play className="w-5 h-5 text-via-teal group-hover:translate-x-1 transition-transform fill-via-teal" />
                        </>
                    )}
                </button>
                <p className="text-center text-xs text-slate-400 mt-4">
                    Validators function as separate confirmations. If one fails, the message is dropped.
                </p>
            </div>
        </div>
    );
};
