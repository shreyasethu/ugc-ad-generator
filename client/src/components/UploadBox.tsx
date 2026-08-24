import { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { XIcon } from 'lucide-react';
import uploadIcon from '../../assets/temp-FooterSectionAssets/upload.svg';

interface UploadBoxProps {
    label: string;
    file: File | null;
    onFileSelect: (file: File) => void;
    onFileRemove: () => void;
}

export default function UploadBox({ label, file, onFileSelect, onFileRemove }: UploadBoxProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const handleFiles = (fileList: FileList | null) => {
        const selected = fileList?.[0];
        if (!selected) return;

        if (!selected.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        onFileSelect(selected);
    };

    return (
        <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleFiles(e.dataTransfer.files);
            }}
            className={`w-full max-w-[340px] aspect-[466/386] bg-[#fbfbfb] border-2 rounded-[32px] flex flex-col items-center justify-center gap-3 cursor-pointer transition ${isDragging ? 'border-brand' : 'border-[#d5d5d5]'}`}
        >
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
            />

            {previewUrl ? (
                <div className="relative">
                    <img src={previewUrl} alt={label} className="size-[80px] rounded-full object-cover" />
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onFileRemove();
                        }}
                        className="absolute -top-1 -right-1 flex items-center justify-center size-6 rounded-full bg-white border border-[#d5d5d5] shadow-sm hover:bg-[#f5f5f5]"
                        aria-label="Remove image"
                    >
                        <XIcon className="size-3.5 text-[#666]" />
                    </button>
                </div>
            ) : (
                <img src={uploadIcon} alt="" className="size-[80px]" />
            )}

            <div className="flex flex-col items-center gap-1 px-6 text-center">
                <p className="text-brand font-medium text-lg sm:text-xl">{label}</p>
                <p className="text-[#c1c1c1] font-normal text-sm sm:text-base truncate max-w-full">
                    {file ? file.name : 'Drag & drop or click to upload'}
                </p>
            </div>
        </div>
    );
}
