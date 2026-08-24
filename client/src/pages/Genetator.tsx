import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth, useClerk, useUser } from '@clerk/clerk-react';
import { Loader2Icon, Trash2Icon } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../configs/axios';
import UploadBox from '../components/UploadBox';
import generateBtn from '../../assets/temp-FooterSectionAssets/generate-btn.svg';
import { useFooterAnimation } from '../context/FooterAnimationContext';
import type { Generation } from '../components/GenerationCard';

type AspectRatio = '9:16' | '16:9';

export default function Genetator() {
    const location = useLocation();
    const prefill = (location.state as { prefill?: Generation } | null)?.prefill;
    const isViewOnly = !!prefill;

    const [step, setStep] = useState<'upload' | 'details'>(prefill ? 'details' : 'upload');

    const [productImage, setProductImage] = useState<File | null>(null);
    const [modelImage, setModelImage] = useState<File | null>(null);

    const [projectName, setProjectName] = useState(prefill?.projectName ?? '');
    const [productName, setProductName] = useState(prefill?.productName ?? '');
    const [productDescription, setProductDescription] = useState(prefill?.productDescription ?? '');
    const [userPrompt, setUserPrompt] = useState(prefill?.userPrompt ?? '');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>(prefill?.aspectRatio ?? '9:16');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showCreditsNotice, setShowCreditsNotice] = useState(false);

    useEffect(() => {
        if (!showCreditsNotice) return;
        const timer = setTimeout(() => setShowCreditsNotice(false), 4000);
        return () => clearTimeout(timer);
    }, [showCreditsNotice]);

    const navigate = useNavigate();
    const { user } = useUser();
    const { getToken } = useAuth();
    const { openSignIn } = useClerk();
    const { setEnabled: setFooterAnimationEnabled } = useFooterAnimation();

    useEffect(() => {
        setFooterAnimationEnabled(step === 'upload');
        return () => setFooterAnimationEnabled(true);
    }, [step, setFooterAnimationEnabled]);

    const productPreview = useMemo(
        () => (productImage ? URL.createObjectURL(productImage) : (prefill?.image ?? null)),
        [productImage, prefill],
    );
    const modelPreview = useMemo(() => (modelImage ? URL.createObjectURL(modelImage) : null), [modelImage]);

    useEffect(() => {
        return () => {
            if (productPreview) URL.revokeObjectURL(productPreview);
        };
    }, [productPreview]);

    useEffect(() => {
        return () => {
            if (modelPreview) URL.revokeObjectURL(modelPreview);
        };
    }, [modelPreview]);

    const handleContinue = () => {
        if (!productImage || !modelImage) {
            toast.error('Please upload both a product image and a model image');
            return;
        }

        if (!productName) {
            setProductName(productImage.name.replace(/\.[^/.]+$/, ''));
        }

        setStep('details');
    };

    const handleGenerate = async (withVideo: boolean) => {
        if (!productImage || !modelImage) {
            toast.error('Please upload both a product image and a model image');
            setStep('upload');
            return;
        }

        if (!productName) {
            toast.error('Please give your product a name');
            return;
        }

        if (!user) {
            openSignIn();
            return;
        }

        setIsSubmitting(true);
        try {
            const token = await getToken();

            const formData = new FormData();
            formData.append('images', productImage);
            formData.append('images', modelImage);
            formData.append('name', projectName || productName);
            formData.append('productName', productName);
            formData.append('productDescription', productDescription);
            formData.append('userPrompt', userPrompt);
            formData.append('aspectRatio', aspectRatio);

            const { data } = await api.post('/api/project/create', formData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (withVideo) {
                await api.post(
                    '/api/project/video',
                    { projectId: data.projectId },
                    { headers: { Authorization: `Bearer ${token}` } },
                );
            }

            navigate(`/result/${data.projectId}`);
        } catch {
            setShowCreditsNotice(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!prefill) return;

        setIsDeleting(true);
        try {
            const token = await getToken();
            await api.delete(`/api/project/${prefill.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            navigate('/my-generations');
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error.message);
        } finally {
            setIsDeleting(false);
        }
    };

    if (step === 'details') {
        return (
            <div className="min-h-screen pt-28 pb-32 px-4">
                <CreditsNotice show={showCreditsNotice} />
                <div className="max-w-[1363px] mx-auto">
                    <div className="text-center">
                        <p className="text-brand font-medium text-xl sm:text-2xl">Create</p>

                        <h1 className="mt-1 font-['Rethink_Sans'] font-medium text-3xl sm:text-4xl lg:text-5xl leading-tight">
                            Create In-Context Posts
                        </h1>
                    </div>

                    <div className="mt-20 lg:mt-24 flex flex-col lg:flex-row gap-8 lg:gap-24 justify-center max-w-[1200px] mx-auto">
                        <div className="flex flex-col gap-6 lg:gap-8 w-full lg:w-[400px] shrink-0">
                            <ImageCard label="Product Image" previewUrl={productPreview} onChange={() => setStep('upload')} />
                            <ImageCard label="Model Image" previewUrl={modelPreview} onChange={() => setStep('upload')} />
                        </div>

                        <div className="flex flex-col gap-6 w-full lg:w-[580px] shrink-0">
                            <Field label="Project Name">
                                <input
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    placeholder="Name your project"
                                    className="w-full bg-[#d9d9d9]/20 rounded-2xl px-5 py-4 font-['Rethink_Sans'] font-medium text-lg text-black placeholder:text-[#b7b7b7] outline-none"
                                />
                            </Field>

                            <Field label="Product Name">
                                <input
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                    placeholder="Name your product"
                                    className="w-full bg-[#d9d9d9]/20 rounded-2xl px-5 py-4 font-['Rethink_Sans'] font-medium text-lg text-black placeholder:text-[#b7b7b7] outline-none"
                                />
                            </Field>

                            <Field label="Product Description">
                                <textarea
                                    value={productDescription}
                                    onChange={(e) => setProductDescription(e.target.value)}
                                    placeholder="Give us a Description"
                                    rows={2}
                                    className="w-full bg-[#d9d9d9]/20 rounded-2xl px-5 py-4 font-['Rethink_Sans'] font-medium text-lg text-black placeholder:text-[#b7b7b7] outline-none resize-none"
                                />
                            </Field>

                            <Field label="Aspect Ratio">
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setAspectRatio('9:16')}
                                        className={`flex items-center justify-center w-[80px] h-[62px] rounded-xl bg-[#d9d9d9]/20 ${aspectRatio === '9:16' ? 'ring-2 ring-brand' : ''}`}
                                        aria-label="Portrait 9:16"
                                    >
                                        <span className="border-[3px] border-[#b7b7b7] rounded-sm w-[22px] h-[35px]" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setAspectRatio('16:9')}
                                        className={`flex items-center justify-center w-[80px] h-[62px] rounded-xl bg-[#d9d9d9]/20 ${aspectRatio === '16:9' ? 'ring-2 ring-brand' : ''}`}
                                        aria-label="Landscape 16:9"
                                    >
                                        <span className="border-[3px] border-[#b7b7b7] rounded-sm w-[35px] h-[22px]" />
                                    </button>
                                </div>
                            </Field>

                            <Field
                                label={
                                    <>
                                        Prompt <span className="text-brand">(optional)</span>
                                    </>
                                }
                            >
                                <textarea
                                    value={userPrompt}
                                    onChange={(e) => setUserPrompt(e.target.value)}
                                    placeholder="Give us a prompt"
                                    rows={2}
                                    className="w-full bg-[#d9d9d9]/20 rounded-2xl px-5 py-4 font-['Rethink_Sans'] font-medium text-lg text-black placeholder:text-[#b7b7b7] outline-none resize-none"
                                />
                            </Field>

                            <div className="flex flex-wrap gap-4 mt-2">
                                <button
                                    onClick={() => handleGenerate(false)}
                                    disabled={isSubmitting || isViewOnly}
                                    className="relative self-start bg-brand text-white rounded-full px-10 py-4 text-lg font-normal transition hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    <span className={isSubmitting ? 'invisible' : ''}>Generate Image Post</span>
                                    {isSubmitting && (
                                        <span className="absolute inset-0 flex items-center justify-center">
                                            <Loader2Icon className="size-6 animate-spin" />
                                        </span>
                                    )}
                                </button>

                                <button
                                    onClick={() => handleGenerate(true)}
                                    disabled={isSubmitting || isViewOnly}
                                    className="relative self-start bg-brand text-white rounded-full px-10 py-4 text-lg font-normal transition hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    <span className={isSubmitting ? 'invisible' : ''}>Generate Video Post</span>
                                    {isSubmitting && (
                                        <span className="absolute inset-0 flex items-center justify-center">
                                            <Loader2Icon className="size-6 animate-spin" />
                                        </span>
                                    )}
                                </button>

                                {isViewOnly && (
                                    <button
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        className="self-center inline-flex items-center gap-2 text-red-600 text-lg font-normal transition hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isDeleting ? <Loader2Icon className="size-5 animate-spin" /> : <Trash2Icon className="size-5" />}
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-28 pb-10 px-4">
            <CreditsNotice show={showCreditsNotice} />
            <div className="max-w-[1400px] mx-auto flex flex-col items-center text-center">
                <p className="text-brand font-medium text-xl sm:text-2xl">Create</p>

                <h1 className="mt-1 font-['Rethink_Sans'] font-medium text-3xl sm:text-4xl lg:text-5xl leading-tight">
                    Create In-Context Posts
                </h1>

                <p className="mt-2 max-w-[700px] text-[#c1c1c1] font-medium text-lg sm:text-xl leading-snug">
                    Upload your model and product images to generate{' '}
                    <span className="text-brand font-semibold">stunning UGC</span>, short-form videos and social media posts
                </p>

                <div className="mt-8 lg:mt-10 flex flex-col sm:flex-row items-center gap-8 lg:gap-[99px] w-full justify-center">
                    <UploadBox
                        label="Product Image"
                        file={productImage}
                        onFileSelect={setProductImage}
                        onFileRemove={() => setProductImage(null)}
                    />
                    <UploadBox
                        label="Model Image"
                        file={modelImage}
                        onFileSelect={setModelImage}
                        onFileRemove={() => setModelImage(null)}
                    />
                </div>

                <button
                    onClick={handleContinue}
                    className="relative mt-8 lg:mt-10 transition hover:scale-105"
                >
                    <img src={generateBtn} alt="Generate" className="h-[46px] w-auto" />
                </button>
            </div>
        </div>
    );
}

function CreditsNotice({ show }: { show: boolean }) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none px-4">
            <div className="pointer-events-auto bg-white text-[#111] rounded-2xl shadow-xl border border-[#e5e5e5] px-6 py-4 font-['Rethink_Sans'] font-medium text-center">
                Out of generation credits right now — please check back soon!
            </div>
        </div>
    );
}

function Field({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-3">
            <p className="font-['Rethink_Sans'] font-medium text-lg text-black">{label}</p>
            {children}
        </div>
    );
}

function ImageCard({
    label,
    previewUrl,
    onChange,
}: {
    label: string;
    previewUrl: string | null;
    onChange: () => void;
}) {
    return (
        <div className="relative aspect-[506/451] rounded-[30px] bg-[#d9d9d9] overflow-hidden">
            {previewUrl && <img src={previewUrl} alt={label} className="absolute inset-0 w-full h-full object-cover" />}

            <span className="absolute bottom-4 left-4 bg-[#bcbcbc] rounded-full px-4 py-1.5 text-sm font-medium text-black">
                {label}
            </span>

            <button
                type="button"
                onClick={onChange}
                className="absolute bottom-4 right-4 bg-brand rounded-full px-4 py-1.5 text-sm font-medium text-white transition hover:opacity-90"
            >
                Change
            </button>
        </div>
    );
}
