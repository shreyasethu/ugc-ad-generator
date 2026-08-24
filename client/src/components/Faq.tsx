import { useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { assets } from '../assets/assets';

const faqs: { question: string; answer: ReactNode }[] = [
    {
        question: 'How does the AI generation work?',
        answer: 'Simply upload your product images, choose your preferred style or settings, and our AI automatically enhances, edits, or transforms them into high-quality visuals and short-form videos. The entire process is automated and takes just a few clicks.',
    },
    {
        question: 'What input formats do you support?',
        answer: <>We support common image formats including <strong className="font-semibold">JPG, JPEG, PNG, and WebP</strong>. High-resolution images produce the best results.</>,
    },
    {
        question: 'Do I own the generated images?',
        answer: "Yes. You retain full ownership of both your original uploads and all AI-generated content, and you're free to use them for commercial or personal purposes.",
    },
    {
        question: 'How long does it take to generate content?',
        answer: <>Most images are generated in <strong className="font-semibold">seconds</strong>, while videos typically take <strong className="font-semibold">a few minutes</strong>, depending on the complexity of the request and server demand.</>,
    },
    {
        question: 'Can I cancel anytime?',
        answer: 'Yes. You can cancel your subscription at any time. Your plan will remain active until the end of your current billing period, with no further charges.',
    },
    {
        question: 'Do I need design experience?',
        answer: 'No. The platform is designed for everyone. Simply upload your product images, select your preferences, and let the AI handle the rest. No editing or design skills are required.',
    },
];

function FaqCard({ question, answer }: (typeof faqs)[number]) {
    const [open, setOpen] = useState(false);

    return (
        <div className="bg-[#d9d9d9]/20 rounded-[20px] px-6 py-5 sm:px-8">
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="w-full flex items-center justify-between gap-6 text-left"
                aria-expanded={open}
            >
                <span className="font-['Rethink_Sans'] font-medium text-xl sm:text-2xl">{question}</span>
                <img src={open ? assets.minusIcon : assets.plusIcon} alt="" className="size-11 sm:size-[65px] shrink-0" />
            </button>

            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <p className="pt-4 text-[#666] text-base sm:text-lg leading-relaxed">{answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function Faq() {
    return (
        <section id="faq" className="relative z-10 pb-24 lg:pb-32">
            <div className="max-w-[1400px] mx-auto px-4">
                <p className="text-center font-medium text-brand text-xl sm:text-2xl">FAQs</p>
                <p className="mt-4 text-center font-['Rethink_Sans'] font-medium text-4xl sm:text-5xl lg:text-6xl">
                    Frequently Asked Questions
                </p>
                <p className="mt-6 text-center text-[#c1c1c1] font-medium text-lg sm:text-xl max-w-3xl mx-auto">
                    Everything you need to know about using the platform. If you have any questions, feel free to{' '}
                    <span className="font-semibold text-brand">contact us</span>.
                </p>

                <div className="mt-14 lg:mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    {faqs.map((faq) => (
                        <FaqCard key={faq.question} {...faq} />
                    ))}
                </div>
            </div>
        </section>
    );
}
