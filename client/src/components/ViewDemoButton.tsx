import { useState } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { assets } from '../assets/assets';
import demoVideo from '../assets/demo.mp4';
import VideoModal from './VideoModal';

export default function ViewDemoButton({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
    const [showDemo, setShowDemo] = useState(false);

    return (
        <>
            <button {...props} onClick={() => setShowDemo(true)} className={`transition hover:scale-105 ${className}`}>
                <img src={assets.viewDemo} alt="View Demo" className="w-full h-auto" />
            </button>

            {showDemo && <VideoModal src={demoVideo} onClose={() => setShowDemo(false)} />}
        </>
    );
}
