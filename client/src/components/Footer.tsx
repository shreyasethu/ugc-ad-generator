import { useRef } from 'react';
import { assets } from '../assets/assets';
import GravityCapsules from './GravityCapsules';
import { useFooterAnimation } from '../context/FooterAnimationContext';

const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Features', href: '#about' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'FAQ', href: '#faq' },
];

export default function Footer() {
    const logoRef = useRef<HTMLDivElement>(null);
    const connectRef = useRef<HTMLAnchorElement>(null);
    const quickLinksRef = useRef<HTMLDivElement>(null);
    const taglineRef = useRef<HTMLParagraphElement>(null);
    const { enabled } = useFooterAnimation();

    return (
        <footer className="relative z-10 pt-20 pb-10 min-h-[70vh] flex items-end overflow-hidden">
            {enabled && (
                <GravityCapsules
                    className="absolute inset-0 z-20 pointer-events-none"
                    obstacleRefs={[logoRef, connectRef, quickLinksRef, taglineRef]}
                />
            )}
            <div className="relative z-10 max-w-[1400px] mx-auto px-4 w-full">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12">
                    <div ref={logoRef} className="flex items-center gap-5 sm:gap-8">
                        <img src={assets.logo} alt="" className="h-32 sm:h-48 lg:h-80 w-auto" />
                        <span className="font-medium text-brand text-9xl sm:text-[10rem] lg:text-[16rem] leading-none">UGC</span>
                    </div>

                    <div className="flex flex-col items-start gap-11">
                        <a ref={connectRef} href="mailto:shreyasethu7@gmail.com" className="transition hover:scale-105">
                            <img src={assets.connectButton} alt="Connect" className="h-20 w-auto" />
                        </a>

                        <div ref={quickLinksRef}>
                            <p className="font-semibold text-brand text-4xl mb-4">Quick Links</p>
                            <ul className="space-y-2 font-medium text-2xl">
                                {quickLinks.map((link) => (
                                    <li key={link.name}>
                                        <a href={link.href} className="hover:text-brand transition-colors">{link.name}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <p ref={taglineRef} className="text-[#c1c1c1] font-medium text-2xl max-w-[340px]">Your next best performing ad starts here.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};
