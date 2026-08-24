import { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import GenerationCard, { type Generation } from '../components/GenerationCard';
import { useFooterAnimation } from '../context/FooterAnimationContext';
import api from '../configs/axios';

interface Project {
    id: string;
    name: string;
    productName: string;
    productDescription: string;
    userPrompt: string;
    aspectRatio: string;
    generatedImage: string;
    generatedVideo: string;
}

function distributeIntoColumns(generations: Generation[], numColumns: number) {
    const columns: Generation[][] = Array.from({ length: numColumns }, () => []);
    generations.forEach((gen, index) => columns[index % numColumns].push(gen));
    return columns;
}

function GenerationColumns({ generations, numColumns }: { generations: Generation[]; numColumns: number }) {
    return (
        <>
            {distributeIntoColumns(generations, numColumns).map((column, colIndex) => (
                <div key={colIndex} className="flex flex-1 flex-col gap-4">
                    {column.map((gen, rowIndex) => (
                        <GenerationCard
                            key={gen.id}
                            {...gen}
                            variant={(colIndex + rowIndex) % 2 === 0 ? 'long' : 'short'}
                        />
                    ))}
                </div>
            ))}
        </>
    );
}

export default function MyGenerations() {
    const { user } = useUser();
    const { getToken } = useAuth();
    const signedIn = !!user;
    const [generations, setGenerations] = useState<Generation[]>([]);
    const { setEnabled: setFooterAnimationEnabled } = useFooterAnimation();

    useEffect(() => {
        setFooterAnimationEnabled(false);
        return () => setFooterAnimationEnabled(true);
    }, [setFooterAnimationEnabled]);

    useEffect(() => {
        if (!user) {
            setGenerations([]);
            return;
        }

        (async () => {
            try {
                const token = await getToken();
                const { data } = await api.get('/api/user/projects', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const projects: Project[] = data.projects;

                setGenerations(
                    projects
                        .filter((project) => project.generatedImage)
                        .map((project) => ({
                            id: project.id,
                            projectName: project.name,
                            productName: project.productName,
                            productDescription: project.productDescription,
                            userPrompt: project.userPrompt,
                            image: project.generatedImage,
                            video: project.generatedVideo,
                            aspectRatio: project.aspectRatio as '9:16' | '16:9',
                        })),
                );
            } catch (error: any) {
                toast.error(error?.response?.data?.message || error.message);
            }
        })();
    }, [user, getToken]);

    return (
        <div className="min-h-screen pt-28 pb-32 px-4 flex flex-col">
            <h1 className="font-['Rethink_Sans'] font-medium text-4xl sm:text-5xl">My Generations</h1>

            {!signedIn || generations.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-[#c1c1c1] font-medium text-lg sm:text-xl">
                        {signedIn ? 'Create your first ad' : 'Sign in to see generations'}
                    </p>
                </div>
            ) : (
                <>
                    <div className="mt-10 flex gap-4 sm:hidden">
                        <GenerationColumns generations={generations} numColumns={1} />
                    </div>
                    <div className="mt-10 hidden gap-4 sm:flex lg:hidden">
                        <GenerationColumns generations={generations} numColumns={2} />
                    </div>
                    <div className="mt-10 hidden gap-4 lg:flex">
                        <GenerationColumns generations={generations} numColumns={3} />
                    </div>
                </>
            )}
        </div>
    );
}
