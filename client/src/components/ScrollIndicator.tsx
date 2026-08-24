import type { HTMLAttributes } from 'react';
import { assets } from '../assets/assets';

export default function ScrollIndicator({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div {...props} className={className}>
            <img src={assets.scrollShape} alt="scroll" className="size-full object-contain" />
        </div>
    );
}
