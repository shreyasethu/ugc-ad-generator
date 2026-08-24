import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { DownloadIcon, Loader2Icon, Share2Icon } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../configs/axios';

interface Project {
    id: string;
    name: string;
    aspectRatio: '9:16' | '16:9';
    generatedImage: string;
    generatedVideo: string;
    isGenerating: boolean;
    isPublished: boolean;
    error: string;
}

export default function Result() {
    const { projectId } = useParams();
    const { getToken } = useAuth();
    const [project, setProject] = useState<Project | null>(null);
    const [isPublishing, setIsPublishing] = useState(false);
    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchProject = async () => {
        try {
            const token = await getToken();
            const { data } = await api.get(`/api/user/projects/${projectId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProject(data.project);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        fetchProject();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId]);

    useEffect(() => {
        if (project?.isGenerating) {
            pollRef.current = setInterval(fetchProject, 5000);
        } else if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
        }
        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [project?.isGenerating]);

    const handlePublish = async () => {
        if (!project) return;

        setIsPublishing(true);
        try {
            const token = await getToken();
            const { data } = await api.get(`/api/user/publish/${project.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProject({ ...project, isPublished: data.isPublished });
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error.message);
        } finally {
            setIsPublishing(false);
        }
    };

    const media = project?.generatedVideo || project?.generatedImage;
    const isPortrait = project?.aspectRatio !== '16:9';

    return (
        <div className="min-h-screen pt-28 pb-32 px-4">
            <div className="max-w-[1400px] mx-auto flex flex-col items-center">
                <h1 className="self-start font-['Rethink_Sans'] font-medium text-4xl sm:text-5xl">
                    Generation Result
                </h1>

                <p className="mt-16 font-['Rethink_Sans'] font-medium text-lg text-black">
                    {project?.name || 'Loading...'}
                </p>

                <div
                    className={`mt-4 rounded-[30px] bg-[#d9d9d9] overflow-hidden flex items-center justify-center ${
                        isPortrait ? 'w-[367px] max-w-full aspect-[367/568]' : 'w-full max-w-[640px] aspect-video'
                    }`}
                >
                    {project?.isGenerating ? (
                        <Loader2Icon className="size-10 animate-spin text-[#b7b7b7]" />
                    ) : project?.error ? (
                        <p className="px-6 text-center text-red-500">{project.error}</p>
                    ) : project?.generatedVideo ? (
                        <video src={project.generatedVideo} controls className="size-full object-cover" />
                    ) : project?.generatedImage ? (
                        <img src={project.generatedImage} alt={project.name} className="size-full object-cover" />
                    ) : null}
                </div>

                <div className="mt-8 flex flex-col items-center gap-4">
                    <a
                        href={media}
                        download
                        target="_blank"
                        rel="noreferrer"
                        className={`inline-flex items-center gap-2 bg-brand text-white rounded-full px-8 py-3 text-lg font-normal transition hover:opacity-90 ${
                            !media ? 'pointer-events-none opacity-50' : ''
                        }`}
                    >
                        <DownloadIcon className="size-5" />
                        Download
                    </a>

                    <button
                        onClick={handlePublish}
                        disabled={!media || isPublishing}
                        className="inline-flex items-center gap-2 bg-brand text-white rounded-full px-8 py-3 text-lg font-normal transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPublishing ? <Loader2Icon className="size-5 animate-spin" /> : <Share2Icon className="size-5" />}
                        {project?.isPublished ? 'Published in Community' : 'Publish in Community'}
                    </button>
                </div>
            </div>
        </div>
    );
}
