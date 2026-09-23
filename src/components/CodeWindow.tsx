import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

const CODE = `pragma solidity ^0.8.17;

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

const KEYWORDS = new Set(['pragma', 'solidity', 'import', 'from', 'contract', 'is', 'constructor', 'function', 'external', 'internal', 'override', 'payable', 'public', 'memory']);
const TYPES = new Set(['uint64', 'uint256', 'bytes32', 'bytes', 'string', 'address']);
const NAMES = new Set(['ViaIntegrationV1', 'VIAHelloWorld']);

// Plain spans with colors, so the code is readable text in the page's HTML.
function highlight(line: string) {
    const parts = line.split(/("[^"]*"|\/\/.*$|\b[A-Za-z_][A-Za-z0-9_]*\b)/g);
    return parts.map((part, i) => {
        if (!part) return null;
        if (part.startsWith('//')) return <span key={i} className="text-slate-500">{part}</span>;
        if (part.startsWith('"')) return <span key={i} className="text-emerald-300">{part}</span>;
        if (KEYWORDS.has(part)) return <span key={i} className="text-fuchsia-300">{part}</span>;
        if (TYPES.has(part)) return <span key={i} className="text-amber-300">{part}</span>;
        if (NAMES.has(part)) return <span key={i} className="text-cyan-300">{part}</span>;
        if (part === 'messageSend' || part === 'messageProcess') return <span key={i} className="text-sky-300">{part}</span>;
        return part;
    });
}

export function CodeWindow() {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        navigator.clipboard?.writeText(CODE);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="[perspective:1600px] min-w-0">
            <div className="rounded-2xl overflow-hidden bg-[#0B0D12] border border-white/10 shadow-panel transition-transform duration-500 lg:[transform:rotateY(-10deg)_rotateX(4deg)] lg:hover:[transform:rotateY(-4deg)_rotateX(2deg)]">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.03]">
                    <div className="flex items-center gap-2" aria-hidden="true">
                        <span className="w-3 h-3 rounded-full bg-white/15" />
                        <span className="w-3 h-3 rounded-full bg-white/15" />
                        <span className="w-3 h-3 rounded-full bg-white/15" />
                    </div>
                    <p className="text-xs text-slate-400 font-mono">VIAHelloWorld.sol</p>
                    <button
                        onClick={copy}
                        aria-label={copied ? 'Code copied' : 'Copy code'}
                        className="p-1.5 -m-1.5 rounded-md text-slate-400 hover:text-white transition-colors"
                    >
                        {copied ? <Check size={15} /> : <Copy size={15} />}
                    </button>
                </div>
                <pre className="p-5 md:p-6 text-[12.5px] md:text-[13px] leading-relaxed font-mono text-slate-200 overflow-x-auto">
                    <code>
                        {CODE.split('\n').map((line, i) => (
                            <span key={i} className="block min-h-[1.2em]">{highlight(line)}</span>
                        ))}
                    </code>
                </pre>
            </div>
        </div>
    );
}
