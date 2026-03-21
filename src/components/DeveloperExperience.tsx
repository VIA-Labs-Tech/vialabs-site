import { Terminal, Copy, Check } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const CODE_STRING = `pragma solidity ^0.8.17;

import {ViaIntegrationV1} from "./ViaIntegrationV1.sol";

contract VIAHelloWorld is ViaIntegrationV1 {
    string public receivedMessage;

    constructor() ViaIntegrationV1(msg.sender) {}

    function sendHello(uint64 destChainId) external payable {
        // Send a message to another chain
        messageSend(destChainId, abi.encode("Hello World"), 1);
    }

    function messageProcess(
        uint256, 
        uint64, 
        bytes32, 
        bytes32, 
        bytes memory data, 
        bytes memory, 
        uint256
    ) internal override {
        // Decode and store the message
        receivedMessage = abi.decode(data, (string));
    }
}`;

export function DeveloperExperience() {
    const [copied, setCopied] = useState(false);
    const [displayedCode, setDisplayedCode] = useState("");
    const codeRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(codeRef, { once: true, amount: 0.5 });

    // Typing state to allow restart
    const [isTyping, setIsTyping] = useState(false);

    const copyCode = () => {
        setCopied(true);
        navigator.clipboard.writeText(CODE_STRING);
        setTimeout(() => setCopied(false), 2000);
    };

    // Restart animation
    const restartAnimation = () => {
        setDisplayedCode("");
        setIsTyping(false);
        // Small delay to reset
        setTimeout(() => setIsTyping(true), 100);
    };

    // Typewriter effect
    useEffect(() => {
        if (isInView) setIsTyping(true);
    }, [isInView]);

    useEffect(() => {
        if (isTyping) {
            let i = 0;
            const timer = setInterval(() => {
                setDisplayedCode(CODE_STRING.substring(0, i));
                i++;
                if (i > CODE_STRING.length) clearInterval(timer);

                // Auto-scroll logic
                if (codeRef.current) {
                    const codeContainer = codeRef.current.querySelector('.code-container');
                    if (codeContainer) {
                        codeContainer.scrollTop = codeContainer.scrollHeight;
                    }
                }

            }, 50); // Slower typing speed (50ms)
            return () => clearInterval(timer);
        }
    }, [isTyping]);

    return (
        <section className="bg-slate-900 py-16 md:py-32 text-white relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-via-teal/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">

                {/* Left Content */}
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-sm font-medium text-via-teal mb-6">
                        <Terminal size={14} /> Developer First
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                        Unified API for <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-via-teal to-via-pink">Global State</span>
                    </h2>
                    <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                        One SDK to rule them all. Interact with contract state on any chain as if it were local.
                        No complex bespoke integrations for each network.
                    </p>

                    <div className="space-y-4">
                        {[
                            { step: 1, text: "Install the VIA SDK" },
                            { step: 2, text: "Deploy your contracts" },
                            { step: 3, text: "Configure your contracts" },
                            { step: 4, text: "Send messages" }
                        ].map((item) => (
                            <div key={item.step} className="flex items-center gap-4 group cursor-default">
                                <div className="w-8 h-8 rounded-full bg-white text-slate-900 group-hover:bg-slate-800 group-hover:text-via-teal transition-colors duration-300 flex items-center justify-center font-bold">
                                    {item.step}
                                </div>
                                <p className="text-slate-300 group-hover:text-white transition-colors">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Code Block (Stripe Style) */}
                <div ref={codeRef} className="rounded-2xl overflow-hidden bg-[#0F1117] border border-slate-800 shadow-2xl relative group min-h-[400px] flex flex-col hover:shadow-xl hover:shadow-via-teal/10 hover:-translate-y-1 transition-all duration-300">
                    {/* Window Controls */}
                    <div className="px-4 py-3 bg-slate-800/50 flex items-center justify-between border-b border-slate-800 shrink-0">
                        <div className="flex items-center gap-2">
                            {/* Red Button - Interactive Restart */}
                            <button
                                onClick={restartAnimation}
                                className="w-3 h-3 rounded-full bg-red-500/20 hover:bg-red-500 hover:shadow-[0_0_8px_rgba(239,68,68,0.6)] transition-all cursor-pointer"
                                title="Restart Animation"
                            />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                        <p className="text-xs text-slate-500 font-mono">VIAHelloWorld.sol</p>
                        <button
                            onClick={copyCode}
                            className="text-slate-500 hover:text-white transition-colors"
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                    </div>

                    {/* Code Area */}
                    <div className="p-6 font-mono text-xs md:text-sm overflow-auto code-container flex-1 max-h-[400px]">
                        <pre className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                            <code dangerouslySetInnerHTML={{
                                __html: displayedCode.replace(
                                    /("[^"]*")|(\/\/.*)|(\b(?:pragma|solidity|import|contract|constructor|function|external|internal|override|payable|public|ViaIntegrationV1|VIAHelloWorld|uint64|uint256|bytes32|bytes|string|address|msg\.sender|abi\.encode|abi\.decode)\b)/g,
                                    (match, str, comment, keyword) => {
                                        if (str) return `<span class='text-green-400'>${str}</span>`;
                                        if (comment) return `<span class='text-slate-500'>${comment}</span>`;
                                        if (keyword) {
                                            if (['pragma', 'solidity', 'import', 'contract', 'constructor', 'function', 'external', 'internal', 'override', 'payable', 'public'].includes(keyword)) return `<span class='text-purple-400'>${keyword}</span>`;
                                            if (['ViaIntegrationV1', 'VIAHelloWorld'].includes(keyword)) return `<span class='text-yellow-400'>${keyword}</span>`;
                                            if (['uint64', 'uint256', 'bytes32', 'bytes', 'string', 'address'].includes(keyword)) return `<span class='text-orange-400'>${keyword}</span>`;
                                            return `<span class='text-blue-400'>${keyword}</span>`;
                                        }
                                        return match;
                                    }
                                )
                            }} />
                            <motion.span
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ repeat: Infinity, duration: 0.8 }}
                                className="inline-block w-2 H-4 bg-via-teal ml-1 align-middle"
                            >
                                |
                            </motion.span>
                        </pre>
                    </div>
                </div>

            </div>
        </section>
    );
}
