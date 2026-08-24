import { useState } from 'react';
import { ArrowRightIcon, PlayIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ctaVideo from '../../assets/Luxury watch with metal bracelet and distinctive dial being displayed on wrist.mp4';
import VideoModal from './VideoModal';

export default function Cta() {
    const navigate = useNavigate();
    const [showPreview, setShowPreview] = useState(false);

    return (
        <section id="cta" className="relative z-10 pb-24 lg:pb-32">
            <div className="max-w-[1400px] mx-auto px-4">

                {/* Desktop: precise blob card matching design */}
                <div className="relative hidden lg:block aspect-[1184/495] w-full max-w-4xl mx-auto">
                    <svg width="0" height="0" className="absolute">
                        <defs>
                            <clipPath id="ctaBlobClip" clipPathUnits="objectBoundingBox">
                                <path d="M 1.000000 0.082353 C 1.000000 0.036870 0.983487 0.000000 0.963120 0.000000 H 0.132771 C 0.112402 0.000000 0.095890 0.036870 0.095890 0.082353 V 0.094117 V 0.163529 C 0.095890 0.204705 0.097471 0.216470 0.082455 0.216470 H 0.069020 H 0.049008 H 0.036881 C 0.016512 0.216470 0.000000 0.253341 0.000000 0.298824 V 0.917646 C 0.000000 0.963129 0.016512 1.000000 0.036881 1.000000 H 0.963120 C 0.983487 1.000000 1.000000 0.963129 1.000000 0.917646 V 0.082353 Z" />
                            </clipPath>
                        </defs>
                    </svg>
                    <video
                        src={ctaVideo}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 size-full object-cover"
                        style={{ clipPath: 'url(#ctaBlobClip)' }}
                    />

                    <button onClick={() => navigate('/generate')} className="absolute -left-4 top-[8.48%] min-w-[90px] min-h-9 inline-flex items-center justify-center gap-1.5 bg-brand text-white text-sm font-normal rounded-full px-3 py-1.5 transition hover:scale-105">
                        start
                        <ArrowRightIcon className="size-3.5" />
                    </button>

                    <button onClick={() => setShowPreview(true)} className="absolute left-[85%] top-[6.26%] min-w-[110px] min-h-10 inline-flex items-center justify-center gap-1.5 bg-white rounded-full font-medium text-sm px-4 py-2 transition hover:scale-105">
                        Preview
                        <PlayIcon className="size-3.5 fill-black" />
                    </button>

                    <p className="absolute inset-x-[6%] top-[71.7%] text-center font-['Rethink_Sans'] font-medium text-white text-4xl xl:text-5xl">
                        Ready to transform your content?
                    </p>
                </div>

                {/* Mobile/tablet fallback: simplified stacked layout */}
                <div className="lg:hidden rounded-[2.5rem] bg-[#d9d9d9] p-6 flex flex-col gap-6">
                    <div className="flex items-center justify-between gap-3">
                        <button onClick={() => navigate('/generate')} className="inline-flex items-center gap-1.5 bg-brand text-white text-lg font-normal rounded-full px-3 py-1.5 transition hover:scale-105">
                            start
                            <ArrowRightIcon className="size-4" />
                        </button>
                        <button onClick={() => setShowPreview(true)} className="inline-flex items-center justify-center gap-2 bg-white rounded-full font-medium text-lg px-6 py-3 w-fit transition hover:scale-105">
                            Preview
                            <PlayIcon className="size-4 fill-black" />
                        </button>
                    </div>
                    <p className="text-center font-['Rethink_Sans'] font-medium text-white text-2xl sm:text-3xl">
                        Ready to transform your content?
                    </p>
                </div>
            </div>

            {showPreview && <VideoModal src={ctaVideo} onClose={() => setShowPreview(false)} />}
        </section>
    );
}
