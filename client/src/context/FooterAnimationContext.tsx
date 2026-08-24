import { createContext, useContext, useState, type ReactNode } from 'react';

const FooterAnimationContext = createContext<{ enabled: boolean; setEnabled: (v: boolean) => void } | null>(null);

export function FooterAnimationProvider({ children }: { children: ReactNode }) {
    const [enabled, setEnabled] = useState(true);
    return (
        <FooterAnimationContext.Provider value={{ enabled, setEnabled }}>
            {children}
        </FooterAnimationContext.Provider>
    );
}

export function useFooterAnimation() {
    const ctx = useContext(FooterAnimationContext);
    if (!ctx) throw new Error('useFooterAnimation must be used within FooterAnimationProvider');
    return ctx;
}
