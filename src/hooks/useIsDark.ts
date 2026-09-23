import { useSyncExternalStore } from 'react';

// Watches the `dark` class on <html>. Returns false during server rendering and hydration,
// then the real value, so the server HTML and the first client render always match.
function subscribe(onChange: () => void) {
    const observer = new MutationObserver(onChange);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
}

export function useIsDark(): boolean {
    return useSyncExternalStore(
        subscribe,
        () => document.documentElement.classList.contains('dark'),
        () => false,
    );
}
