import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface Generation {
    id: string;
    projectName: string;
    productName: string;
    productDescription: string;
    userPrompt: string;
    image: string;
    video: string;
    aspectRatio: '9:16' | '16:9';
}

export default function GenerationCard({ variant, ...generation }: Generation & { variant: 'long' | 'short' }) {
    const { productName, image, video } = generation;
    const [isHovering, setIsHovering] = useState(false);
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate('/generate', { state: { prefill: generation } })}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className={`relative overflow-hidden rounded-[15px] bg-[#d9d9d9] cursor-pointer ${variant === 'long' ? 'aspect-4/5' : 'aspect-video'}`}
        >
            {isHovering && video ? (
                <video
                    src={video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 size-full object-cover"
                />
            ) : (
                <img src={image} alt={productName} className="absolute inset-0 size-full object-cover" />
            )}
            <div className="absolute inset-x-0 bottom-0 rounded-b-[15px] bg-[rgba(234,234,234,0.2)] backdrop-blur-md px-4 py-4">
                <p className="text-center font-['Rethink_Sans'] font-medium text-[#000000] text-lg sm:text-xl">
                    {productName}
                </p>
            </div>
        </div>
    );
}
