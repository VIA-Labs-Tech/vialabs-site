import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { OnboardingModal } from './components/OnboardingModal';
import { OnboardingContext } from './onboarding';
import { SITE_URL, metaFor } from './seo';

// Keeps the title, description, and canonical tag right when people move between pages in the app.
function useHeadSync() {
    const { pathname } = useLocation();
    useEffect(() => {
        const meta = metaFor(pathname);
        document.title = meta.title;
        document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
        const canonical = document.querySelector('link[rel="canonical"]');
        if (canonical && !meta.noindex) canonical.setAttribute('href', SITE_URL + (meta.path === '/' ? '/' : meta.path));
    }, [pathname]);
}

export function Layout() {
    const [showOnboarding, setShowOnboarding] = useState(false);
    // The form renders into document.body, so it mounts only in the browser.
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    useHeadSync();

    return (
        <OnboardingContext.Provider value={() => setShowOnboarding(true)}>
            <div className="min-h-screen bg-paper dark:bg-ink text-slate-900 dark:text-white font-sans">
                <Navbar />
                <Outlet />
                <Footer />
            </div>
            {mounted && <OnboardingModal isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />}
        </OnboardingContext.Provider>
    );
}
