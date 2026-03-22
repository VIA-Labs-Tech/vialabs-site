import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
}

export function Card({ children, className = '' }: CardProps) {
    const hasCustomBg = className.includes('bg-');
    return (
        <div
            className={`${hasCustomBg ? '' : 'bg-white dark:bg-[#1a1b23]'} rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-clean transition-all duration-300 hover:shadow-lg relative overflow-hidden ${className}`}
        >
            {children}
        </div>
    );
}
