// import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GridBackgroundProps {
    className?: string;
}

export function GridBackground({ className }: GridBackgroundProps) {
    return (
        <div className={twMerge("absolute inset-0 overflow-hidden pointer-events-none select-none", className)}>
            {/* Main Grid Mesh */}
            <div className="absolute inset-0 bg-grid-slate-200 bg-grid-8 [mask-image:linear-gradient(to_bottom,white,transparent_90%)]" />

            {/* Subtle Fog/Glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#F5F5F7] via-transparent to-transparent" />
        </div>
    );
}
