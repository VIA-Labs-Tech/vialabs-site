import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export function NotFound() {
    useEffect(() => { document.title = 'Page Not Found | VIA Labs'; }, []);

    return (
        <div className="min-h-[calc(100vh-7rem)] flex items-center justify-center px-4 md:px-6 pt-20 md:pt-32 pb-16 md:pb-24">
            <div className="max-w-2xl text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4"
                >
                    Page not found.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                    className="text-base md:text-2xl text-slate-500 dark:text-slate-400 mb-10"
                >
                    This address doesn't match a page on our site.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25, duration: 0.6 }}
                >
                    <Link
                        to="/"
                        className="inline-block px-6 py-3 rounded-full border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 text-sm font-semibold hover:border-slate-800 dark:hover:border-slate-400 hover:text-black dark:hover:text-white transition-all"
                    >
                        Back to home
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
