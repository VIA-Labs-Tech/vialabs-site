import { Sun, Moon } from 'lucide-react';
import { useIsDark } from '../hooks/useIsDark';

export function ThemeToggle() {
    const isDark = useIsDark();

    const toggle = () => {
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('via-theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('via-theme', 'dark');
        }
    };

    return (
        <button
            onClick={toggle}
            className="p-2 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
    );
}
