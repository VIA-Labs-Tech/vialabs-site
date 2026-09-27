import { useEffect, useLayoutEffect } from 'react';

// Runs before the browser paints, so nothing flashes. The server has no layout step.
const useBeforePaint = typeof window === 'undefined' ? useEffect : useLayoutEffect;

// Fades elements marked data-reveal in as they scroll into view. The HTML stays fully visible:
// only elements still below the fold get hidden, and only once this runs in the browser.
export function useReveal() {
    useBeforePaint(() => {
        if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const io = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) continue;
                    entry.target.classList.add('is-revealed');
                    io.unobserve(entry.target);
                }
            },
            { rootMargin: '0px 0px -8% 0px' },
        );
        for (const el of document.querySelectorAll<HTMLElement>('[data-reveal]')) {
            if (el.getBoundingClientRect().top < window.innerHeight) continue;
            el.classList.add('reveal-pending');
            io.observe(el);
        }
        return () => io.disconnect();
    }, []);
}
