import { ChainMark } from '../ui';

// The chains VIA runs on, drifting slowly to the left. Hovering pauses the strip.
// The list is drawn twice so the loop has no seam; screen readers hear it once.
// With reduced motion, the strip holds still and wraps (see index.css).
export function LiveOnMarquee({ chains }: { chains: [key: string, name: string][] }) {
    return (
        <div className="marquee relative min-w-0 flex-1 overflow-hidden">
            <ul className="marquee-track flex w-max items-center">
                {[0, 1].map((copy) =>
                    chains.map(([key, name]) => (
                        <li
                            key={`${copy}-${key}`}
                            aria-hidden={copy === 1 ? true : undefined}
                            className="flex items-center gap-2.5 pr-10 text-[15px] font-medium text-slate-600 dark:text-slate-300"
                        >
                            <ChainMark chain={key} label="" className="h-6 w-6" />
                            {name}
                        </li>
                    )),
                )}
            </ul>
        </div>
    );
}
