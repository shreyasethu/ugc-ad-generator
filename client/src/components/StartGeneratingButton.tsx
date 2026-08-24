import { ArrowRightIcon } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StartGeneratingButton({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
    const navigate = useNavigate();

    return (
        <button
            {...props}
            onClick={() => navigate('/generate')}
            className={`inline-flex items-center justify-center gap-2 bg-black text-white font-normal rounded-full transition hover:scale-105 ${className}`}
        >
            Start Generating - It's Free
            <ArrowRightIcon className="size-4" />
        </button>
    );
}
