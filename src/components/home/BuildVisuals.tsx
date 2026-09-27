import { accentFill, accentStroke, Box, Disc, Dot, Ripple, Scene, Travel, useMotion, Wire } from './scene';

// One diagram per capability on the home page. Chain keys match the logo files in src/assets/chains.

// A token rides the message line from chain to chain, and the total supply never changes.
// Phones get two chains instead of three, so the diagram stays readable.
export function AssetsVisual() {
    return (
        <>
            <div className="hidden h-full sm:block">
                <AssetsWide />
            </div>
            <div className="h-full sm:hidden">
                <AssetsCompact />
            </div>
        </>
    );
}

function Supply({ x }: { x: number }) {
    return (
        <>
            <rect x={x - 94} y={11} width={188} height={26} rx={13} className="fill-white stroke-slate-200 dark:fill-ink-700 dark:stroke-white/10" />
            <text x={x} y={28} textAnchor="middle" className="fill-slate-600 dark:fill-slate-300 text-[12px] font-medium">
                Total supply 1,000,000
            </text>
        </>
    );
}

function AssetsCompact() {
    const dur = 5;
    const hop = 'M 90 100 Q 160 44 230 100';
    return (
        <Scene viewBox="0 0 320 176">
            <Supply x={160} />
            <Wire d={hop} />
            <Disc x={64} y={100} r={26} chain="17000" label="Ethereum" />
            <Disc x={256} y={100} r={26} chain="stellar" label="Stellar" />
            <Travel path={hop} dur={dur} from={0.1} to={0.5} hold={0.03} still={[160, 72]}>
                <Coin />
            </Travel>
            <Ripple x={256} y={100} r={26} dur={dur} at={0.5} />
        </Scene>
    );
}

function AssetsWide() {
    const dur = 7;
    const hop1 = 'M 148 96 Q 220 40 292 96';
    const hop2 = 'M 348 96 Q 420 40 492 96';
    return (
        <Scene viewBox="0 0 640 176">
            <Supply x={320} />
            <Wire d={hop1} />
            <Wire d={hop2} />
            <Disc x={120} y={96} r={28} chain="17000" label="Ethereum" />
            <Disc x={320} y={96} r={28} chain="43114" label="Avalanche" />
            <Disc x={520} y={96} r={28} chain="stellar" label="Stellar" />
            <Travel path={hop1} dur={dur} from={0.08} to={0.38} hold={0.03} still={[220, 68]}>
                <Coin />
            </Travel>
            <Travel path={hop2} dur={dur} from={0.52} to={0.82} hold={0.03}>
                <Coin />
            </Travel>
            <Ripple x={320} y={96} r={28} dur={dur} at={0.38} />
            <Ripple x={520} y={96} r={28} dur={dur} at={0.82} />
        </Scene>
    );
}

function Coin() {
    return (
        <>
            <circle r={10} strokeWidth={1.75} className={`fill-white dark:fill-ink-800 ${accentStroke}`} />
            <circle r={4.5} className={accentFill} />
        </>
    );
}

// One call leaves one chain and reaches three
export function RoutingVisual() {
    const dur = 5.5;
    const ends = [
        { y: 32, chain: '42161', still: [175, 52] as [number, number] },
        { y: 88, chain: 'cardano', still: [175, 88] as [number, number] },
        { y: 144, chain: '10', still: [175, 124] as [number, number] },
    ];
    const path = (y: number) => `M 80 88 C 150 88 172 ${y} 242 ${y}`;
    return (
        <Scene viewBox="0 0 320 176">
            {ends.map((e) => <Wire key={e.y} d={path(e.y)} />)}
            <Disc x={56} y={88} r={24} chain="137" />
            {ends.map((e) => <Disc key={e.chain} x={262} y={e.y} r={20} chain={e.chain} />)}
            {ends.map((e) => (
                <Travel key={e.y} path={path(e.y)} dur={dur} from={0.12} to={0.5} hold={0.02} still={e.still}>
                    <Dot />
                </Travel>
            ))}
            {ends.map((e) => <Ripple key={e.y} x={262} y={e.y} r={20} dur={dur} at={0.5} />)}
        </Scene>
    );
}

// Tokens, data, and contract calls take the same path
export function MessagesVisual() {
    const dur = 9;
    const line = 'M 72 80 L 248 80';
    const lane = 'M 106 80 L 214 80'; // packets stop short of the logos
    const packets = ['Tokens', 'Data', 'Calls'];
    return (
        <Scene viewBox="0 0 320 176">
            <Wire d={line} />
            <Disc x={48} y={80} r={24} chain="8453" label="Base" />
            <Disc x={272} y={80} r={24} chain="midnight" label="Midnight" />
            {packets.map((label, i) => (
                <Travel key={label} path={lane} dur={dur} from={0.04 + i * 0.33} to={0.26 + i * 0.33} hold={0.02} still={i === 1 ? [160, 80] : undefined}>
                    <rect x={-31} y={-12} width={62} height={24} rx={12} strokeWidth={1.25} className={`fill-white dark:fill-ink-800 ${accentStroke}`} />
                    <text y={4} textAnchor="middle" className="fill-slate-700 dark:fill-slate-200 text-[11px] font-semibold">
                        {label}
                    </text>
                </Travel>
            ))}
            {packets.map((label, i) => <Ripple key={label} x={272} y={80} r={24} dur={dur} at={0.26 + i * 0.33} />)}
        </Scene>
    );
}

// Data from outside the blockchain reaches a contract, plain or encrypted
export function DataVisual() {
    const dur = 6;
    const line = 'M 136 88 L 240 88';
    return (
        <Scene viewBox="0 0 320 176">
            <Wire d={line} />
            <Box x={20} y={48} w={116} h={80}>
                <circle cx={36} cy={66} r={3} className="fill-[#3fcf8e]" />
                <text x={46} y={70} className="fill-slate-500 dark:fill-slate-400 text-[11px] font-semibold">
                    API
                </text>
                <Sparkline dur={dur} />
            </Box>
            <Disc x={264} y={88} r={24} chain="56" label="BSC" />
            <Travel path={line} dur={dur} from={0.1} to={0.4} hold={0.02} still={[188, 88]}>
                <Dot />
            </Travel>
            <Travel path={line} dur={dur} from={0.56} to={0.86} hold={0.02}>
                <Lock />
            </Travel>
            <Ripple x={264} y={88} r={24} dur={dur} at={0.4} />
            <Ripple x={264} y={88} r={24} dur={dur} at={0.86} />
        </Scene>
    );
}

// A small chart that redraws itself, as if new values keep arriving
function Sparkline({ dur }: { dur: number }) {
    const motion = useMotion();
    return (
        <path
            d="M 34 108 l 12 -6 l 12 4 l 12 -12 l 12 6 l 12 -10 l 12 3 l 12 -8"
            fill="none"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray="1"
            className="stroke-slate-400 dark:stroke-slate-500"
        >
            {motion && <animate attributeName="stroke-dashoffset" values="1;0;0" keyTimes="0;0.4;1" dur={`${dur}s`} repeatCount="indefinite" />}
        </path>
    );
}

function Lock() {
    return (
        <>
            <circle r={11} strokeWidth={1.5} className={`fill-white dark:fill-ink-800 ${accentStroke}`} />
            <rect x={-4.5} y={-1.5} width={9} height={7} rx={1.5} className={accentFill} />
            <path d="M -2.75 -1.5 V -4 a 2.75 2.75 0 0 1 5.5 0 V -1.5" fill="none" strokeWidth={1.5} className={accentStroke} />
        </>
    );
}

// Users reach one app from the chain they already use
export function AppsVisual() {
    const dur = 8;
    const links = [
        { x: 40, y: 36, chain: '17000', path: 'M 56 44 C 78 54 86 66 106 70', end: [106, 70] },
        { x: 40, y: 140, chain: 'cardano', path: 'M 56 132 C 78 122 86 108 106 102', end: [106, 102] },
        { x: 280, y: 36, chain: 'stellar', path: 'M 264 44 C 242 54 234 66 214 70', end: [214, 70] },
        { x: 280, y: 140, chain: 'midnight', path: 'M 264 132 C 242 122 234 108 214 102', end: [214, 102] },
    ];
    return (
        <Scene viewBox="0 0 320 176">
            {links.map((l) => <Wire key={l.chain} d={l.path} />)}
            <Box x={106} y={40} w={108} h={86}>
                <path d="M 106 58 H 214" strokeWidth={1} className="stroke-slate-200 dark:stroke-white/10" />
                {[118, 126, 134].map((cx) => <circle key={cx} cx={cx} cy={49} r={2.4} className="fill-slate-300 dark:fill-white/20" />)}
                <rect x={118} y={68} width={58} height={6} rx={3} className="fill-slate-200 dark:fill-white/10" />
                <rect x={118} y={81} width={80} height={6} rx={3} className="fill-slate-200 dark:fill-white/10" />
                <rect x={118} y={98} width={44} height={16} rx={8} className={accentFill} />
            </Box>
            <text x={160} y={146} textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[12px] font-medium">
                Your app
            </text>
            {links.map((l) => <Disc key={l.chain} x={l.x} y={l.y} r={18} chain={l.chain} />)}
            {links.map((l, i) => (
                <Travel key={l.chain} path={l.path} dur={dur} from={0.04 + i * 0.24} to={0.22 + i * 0.24} hold={0.02} still={i === 0 ? [82, 57] : undefined}>
                    <Dot />
                </Travel>
            ))}
            {links.map((l, i) => <Ripple key={l.chain} x={l.end[0]} y={l.end[1]} r={3} dur={dur} at={0.22 + i * 0.24} />)}
        </Scene>
    );
}
