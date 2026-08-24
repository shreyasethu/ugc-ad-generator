import { useState } from 'react';
import { ArrowRightIcon, PlayIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import serumVideo from '../../assets/temp-FooterSectionAssets/The Ordinary skincare serum bottles floating with water droplets in a clean, minimalist aesthetic.mp4';
import blobVideo from '../../assets/Smooth flowing light grey abstract curves with soft lighting and elegant movement.mp4';
import StartGeneratingButton from './StartGeneratingButton';
import ViewDemoButton from './ViewDemoButton';
import ScrollIndicator from './ScrollIndicator';
import VideoModal from './VideoModal';

const tags = [
    { name: 'Trendy', className: 'bg-brand text-white' },
    { name: 'Niche', className: 'bg-[#f4f4f4]/70 text-black border-2 border-brand' },
    { name: 'Exciting', className: 'bg-[#f4f4f4]/70 text-black border-2 border-brand' },
];

export default function Hero() {
    const navigate = useNavigate();
    const [showPreview, setShowPreview] = useState(false);

    return (
        <section id="home" className="relative z-10 pt-32 xl:pt-36 pb-20 overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-4">

                {/* Top: headline + video preview */}
                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 items-stretch relative">
                    <motion.div
                        className="relative h-full max-w-full"
                        style={{ aspectRatio: '977 / 264', transform: 'scale(0.93)', transformOrigin: 'top left' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 250, damping: 70, mass: 1 }}
                    >
                        <img src={assets.headlineProper} alt="Turn photos into viral UGC videos and lifestyle content instantly, trusted by 1000+ users" className="absolute inset-0 size-full" />
                        <ViewDemoButton className="absolute left-[52.8%] -top-[6.4%] w-[25.5%]" />
                    </motion.div>

                    <motion.div
                        className="relative aspect-[591/243] w-full min-w-0 -translate-x-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 250, damping: 70, mass: 1, delay: 0.2 }}
                    >
                        <video
                            src={serumVideo}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 size-full rounded-[3rem] object-cover"
                        />
                        <div className="absolute right-0 top-0 h-full w-[70%] rounded-[3rem] bg-white/70 backdrop-blur-sm p-6 sm:p-8 flex flex-col justify-between">
                            <div>
                                <p className="font-['Rethink_Sans'] font-medium text-2xl sm:text-3xl mb-2">Optimized social formats!</p>
                                <p className="text-[#a4a4a4] text-sm sm:text-base">Use anywhere, anytime, no fuss.</p>
                            </div>
                            <button onClick={() => navigate('/generate')} className="self-end inline-flex items-center gap-1.5 bg-brand text-white text-lg font-normal rounded-full px-3 py-1.5 transition hover:scale-105">
                                start
                                <ArrowRightIcon className="size-4" />
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom: blob panel with tags, CTA, paragraph, preview */}
                <motion.div
                    className="relative mt-4 hidden lg:block aspect-[1620/571] w-full"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 250, damping: 70, mass: 1 }}
                >
                    <svg width="0" height="0" className="absolute">
                        <defs>
                            <clipPath id="heroBlobClip" clipPathUnits="objectBoundingBox">
                                <path d="M 1.000000 0.120291 C 1.000000 0.053856 0.980704 0.000000 0.956901 0.000000 H 0.392533 C 0.368729 0.000000 0.349433 0.053857 0.349433 0.120291 V 0.286219 V 0.299469 C 0.349433 0.363958 0.350699 0.379858 0.325061 0.379858 H 0.319997 H 0.193707 H 0.037982 C 0.017005 0.379858 0.000000 0.427320 0.000000 0.485865 V 0.893993 C 0.000000 0.952539 0.017005 1.000000 0.037982 1.000000 H 0.410836 C 0.431814 1.000000 0.448819 0.952539 0.448819 0.893993 V 0.829506 V 0.733215 V 0.721732 C 0.448819 0.669611 0.453883 0.669611 0.467809 0.669611 H 0.470975 H 0.502310 H 0.956901 C 0.980704 0.669611 1.000000 0.615755 1.000000 0.549320 V 0.120291 Z" />
                            </clipPath>
                        </defs>
                    </svg>
                    <video
                        src={blobVideo}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 size-full object-cover"
                        style={{ clipPath: 'url(#heroBlobClip)' }}
                    />

                    <div className="absolute left-0 top-[1.4%] size-[9.4%] min-w-[110px] min-h-[48px]">
                        <span className={`flex items-center justify-center size-full rounded-full font-medium text-lg ${tags[0].className}`}>
                            {tags[0].name}
                        </span>
                    </div>
                    <img src={assets.thumb1} alt="" className="absolute left-[11.5%] top-[1.4%] w-[9.4%] h-[11.6%] min-w-[110px] min-h-[48px] rounded-full object-cover" />
                    <div className="absolute left-[23%] top-[1.4%] w-[9.4%] h-[11.6%] min-w-[110px] min-h-[48px]">
                        <span className={`flex items-center justify-center size-full rounded-full font-medium text-lg ${tags[1].className}`}>
                            {tags[1].name}
                        </span>
                    </div>
                    <div className="absolute left-0 top-[21.7%] w-[9.4%] h-[11.6%] min-w-[110px] min-h-[48px]">
                        <span className={`flex items-center justify-center size-full rounded-full font-medium text-lg ${tags[2].className}`}>
                            {tags[2].name}
                        </span>
                    </div>

                    <StartGeneratingButton className="absolute left-[10.7%] top-[23.5%] w-[21.4%] h-[8.1%] min-w-[220px] min-h-[40px] text-lg" />

                    <p className="absolute left-[48.2%] top-[72.3%] w-[43.5%] font-['Rethink_Sans'] font-medium text-xl xl:text-2xl leading-snug">
                        Upload product images and a model photo our AI instantly produces{' '}
                        <span className="text-brand font-semibold">professional lifestyle imagery</span>{' '}
                        <span className="text-brand">and</span>{' '}
                        <span className="text-brand font-semibold">short-form videos</span>{' '}
                        optimized for commercials &amp; Reels.
                    </p>

                    <button onClick={() => setShowPreview(true)} className="absolute left-[4.4%] top-[84.1%] w-[10%] h-[9%] min-w-[130px] min-h-[42px] inline-flex items-center justify-center gap-2 bg-white rounded-full font-medium text-lg transition hover:scale-105">
                        Preview
                        <PlayIcon className="size-4 fill-black" />
                    </button>

                    <ScrollIndicator className="absolute left-[95.1%] top-[68.3%] w-[4.9%] h-[31.2%] min-w-[60px]" />
                </motion.div>

                {/* Mobile/tablet fallback: simplified stacked layout */}
                <motion.div
                    className="lg:hidden mt-10 rounded-[2.5rem] bg-[#f4f4f4] p-6 flex flex-col gap-6"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <div className="flex flex-wrap gap-3">
                        {tags.map((tag) => (
                            <span key={tag.name} className={`px-5 py-2.5 rounded-full font-medium text-sm ${tag.className}`}>
                                {tag.name}
                            </span>
                        ))}
                    </div>

                    <StartGeneratingButton className="text-sm px-6 py-3 w-fit" />

                    <p className="font-['Rethink_Sans'] font-medium text-base leading-snug">
                        Upload product images and a model photo our AI instantly produces{' '}
                        <span className="text-brand font-semibold">professional lifestyle imagery</span>{' '}
                        <span className="text-brand">and</span>{' '}
                        <span className="text-brand font-semibold">short-form videos</span>{' '}
                        optimized for commercials &amp; Reels.
                    </p>

                    <button onClick={() => setShowPreview(true)} className="inline-flex items-center justify-center gap-2 bg-white rounded-full font-medium px-6 py-3 w-fit">
                        Preview
                        <PlayIcon className="size-4 fill-black" />
                    </button>
                </motion.div>
            </div>

            {showPreview && <VideoModal src={serumVideo} onClose={() => setShowPreview(false)} />}
        </section>
    );
};
