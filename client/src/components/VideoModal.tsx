import { createPortal } from 'react-dom';
import { XIcon } from 'lucide-react';

interface VideoModalProps {
    src: string;
    onClose: () => void;
}

export default function VideoModal({ src, onClose }: VideoModalProps) {
    return createPortal(
        <div
            className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div className="relative max-w-2xl max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute -top-12 right-0 flex items-center justify-center size-9 rounded-full bg-white/10 text-white transition hover:bg-white/20"
                >
                    <XIcon className="size-5" />
                </button>
                <video src={src} controls autoPlay className="max-w-full max-h-[85vh] rounded-2xl" />
            </div>
        </div>,
        document.body
    );
}
