import { createContext, useContext } from 'react';

// Any button on the site can open the onboarding form through this context.
export const OnboardingContext = createContext<() => void>(() => {});

export function useOpenOnboarding() {
    return useContext(OnboardingContext);
}
