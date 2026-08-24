import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { assets } from '../assets/assets';
import StartGeneratingButton from './StartGeneratingButton';

const features = [
    { image: assets.aboutImage1, labelIcon: assets.glassSmartUpload, label: 'Smart Upload' },
    { image: assets.aboutImage2, labelIcon: assets.glassInstantGeneration, label: 'Instant Generation' },
    { image: assets.aboutImage3, labelIcon: assets.glassVideoSynthesis, label: 'Video Synthesis' },
];

function FeatureCard({
    image,
    labelIcon,
    label,
    highlighted,
    onHover,
    onHoverEnd,
}: (typeof features)[number] & { highlighted: boolean; onHover: () => void; onHoverEnd: () => void }) {
    return (
        <div
            onMouseEnter={onHover}
            onMouseLeave={onHoverEnd}
            className={`relative shrink-0 snap-start w-[260px] sm:w-[300px] aspect-[332/258] transition-all duration-500 ease-out ${highlighted ? 'scale-[1.08] z-10' : 'scale-100'}`}
        >
            <div className="relative size-full rounded-[2.5rem] overflow-hidden">
                <img src={image} alt="" className="absolute inset-0 size-full object-cover" />
                <img src={labelIcon} alt={label} className="absolute left-4 bottom-4 h-8" />
            </div>
        </div>
    );
}

export default function About() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const highlightedIndex = hoveredIndex ?? activeIndex;

    const scrollToIndex = (index: number) => {
        setActiveIndex(index);
        const el = scrollRef.current;
        if (!el) return;
        const card = el.children[index] as HTMLElement | undefined;
        if (!card) return;
        el.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
    };

    const handleScroll = () => {
        const el = scrollRef.current;
        if (!el) return;
        let closest = 0;
        let minDist = Infinity;
        Array.from(el.children).forEach((child, i) => {
            const dist = Math.abs((child as HTMLElement).offsetLeft - el.scrollLeft);
            if (dist < minDist) {
                minDist = dist;
                closest = i;
            }
        });
        setActiveIndex(closest);
    };

    return (
        <section id="about" className="relative z-10 pt-10 pb-24 lg:pt-16 lg:pb-72">
            <div className="max-w-[1400px] mx-auto px-4">

                <p className="text-center text-[#c1c1c1] font-medium text-xl md:text-2xl">Features</p>

                <img
                    src={assets.aboutTexts}
                    alt=""
                    aria-hidden="true"
                    className="hidden lg:block mx-auto mt-6 w-full max-w-5xl h-auto"
                />
                <p className="lg:hidden mt-4 text-center font-['Rethink_Sans'] font-medium text-2xl sm:text-3xl leading-snug">
                    Built for <span className="text-brand font-semibold">modern brands</span>, our AI instantly produces{' '}
                    <span className="text-brand font-semibold">professional</span> lifestyle imagery and short form videos{' '}
                    <span className="text-brand font-semibold">optimized</span> for commercials &amp; Reels.
                </p>

                <motion.div
                    className="mt-12 lg:mt-16 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 lg:gap-14 items-start"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 250, damping: 70, mass: 1 }}
                >
                    <div>
                        <div
                            ref={scrollRef}
                            onScroll={handleScroll}
                            className="flex items-center gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                        >
                            {features.map((feature, i) => (
                                <FeatureCard
                                    key={feature.label}
                                    {...feature}
                                    highlighted={i === highlightedIndex}
                                    onHover={() => setHoveredIndex(i)}
                                    onHoverEnd={() => setHoveredIndex(null)}
                                />
                            ))}
                        </div>

                        <div className="mt-6 flex items-center justify-center gap-2">
                            {features.map((feature, i) => (
                                <button
                                    key={feature.label}
                                    onClick={() => scrollToIndex(i)}
                                    aria-label={`Go to ${feature.label}`}
                                    className={`h-2 rounded-full transition-all ${i === highlightedIndex ? 'w-8 bg-black' : 'w-2 bg-[#d9d9d9]'}`}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="font-['Rethink_Sans'] font-medium text-lg lg:text-xl leading-relaxed">
                           Upload product assets with an easy drag and drop, let AI optimize them instantly, and turn photos into high quality, social media ready videos.
                        </p>
                        <StartGeneratingButton className="mt-6 text-lg px-8 py-3" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
