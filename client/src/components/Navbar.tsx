import { DollarSignIcon, FolderEditIcon, GalleryHorizontalEnd, MenuIcon, SparkleIcon, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useUser, UserButton, useAuth, useClerk } from '@clerk/clerk-react';
import api from '../configs/axios';
import toast from 'react-hot-toast';

export default function Navbar() {

    const navigate = useNavigate()
    const {user} = useUser()
    const {openSignIn, openSignUp} = useClerk()
    const signedIn = !!user

    const [isOpen, setIsOpen] = useState(false);

    const [credits, setCredits] = useState(0);
    const { pathname } = useLocation()
    const { getToken } = useAuth()

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Create', href: '/generate' },
        { name: 'My Generations', href: '/my-generations' },
        { name: 'Plan', href: '/plans' },
    ];

    const getUserCredits = async ()=>{
        try {
            const token = await getToken()
            const {data} = await api.get('/api/user/credits', {headers: {Authorization: `Bearer ${token}`}})
            setCredits(data.credits)
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error.message)
            console.log(error);
        }
    }

    useEffect(()=>{
        if(user){
            (async ()=> await getUserCredits())();
        }
    },[user, pathname])

    return (
        <nav className='fixed top-5 left-0 right-0 z-50 px-4'>
            <div className='max-w-[1400px] mx-auto flex items-center justify-between gap-6 bg-white/50 backdrop-blur-lg border-t border-x border-white/60 border-b-0 rounded-full px-4 py-2'>
                <div className='flex items-center gap-3'>
                    {navLinks.slice(0, 1).map((link) => {
                        const active = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                to={link.href}
                                className={`hidden md:inline-flex items-center gap-2 px-6 py-3 rounded-full border-[3px] text-[22px] leading-none font-normal transition hover:scale-105 ${active ? 'border-black' : 'border-[#c1c1c1] hover:border-black'}`}
                            >
                                {link.name}
                                <span className='size-1.5 rounded-full bg-black/70' />
                            </Link>
                        );
                    })}

                    <Link to='/' className='flex items-center gap-2 transition hover:scale-105'>
                        <img src={assets.logo} alt="logo" className="h-9" />
                        <span className='text-2xl font-medium text-brand'>UGC</span>
                    </Link>
                </div>

                <div className='hidden md:flex items-center gap-8'>
                    {navLinks.slice(1).map((link) => {
                        const active = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                to={link.href}
                                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border-[3px] text-[22px] leading-none font-normal transition hover:scale-105 ${active ? 'border-black' : 'border-[#c1c1c1] hover:border-black'}`}
                            >
                                {link.name}
                                <span className='size-1.5 rounded-full bg-black/70' />
                            </Link>
                        );
                    })}
                </div>

                {!signedIn ? (
                    <div className='hidden md:flex items-center border-[3px] border-[#c1c1c1] rounded-full p-1 pl-7'>
                        <button onClick={()=> openSignIn()} className='text-[22px] leading-none font-normal text-black px-2 transition hover:scale-105'>
                            Sign In
                        </button>
                        <button onClick={()=> openSignUp()} className='text-[22px] leading-none font-normal text-white bg-black rounded-full px-6 py-3 transition hover:scale-105'>
                            Sign up
                        </button>
                    </div>
                ) : (
                    <div className='hidden md:flex items-center gap-3'>
                        <button onClick={()=> navigate('/plans')} className='text-[22px] leading-none font-normal text-black border-[3px] border-[#c1c1c1] rounded-full px-6 py-3 transition hover:scale-105'>
                            Credits: {credits}
                        </button>
                        <UserButton>
                            <UserButton.MenuItems>

                                <UserButton.Action label='Generate' labelIcon={<SparkleIcon size={14}/>} onClick={()=>navigate('/generate')}/>

                                <UserButton.Action label='My Generations' labelIcon={<FolderEditIcon size={14}/>} onClick={()=>navigate('/my-generations')}/>

                                <UserButton.Action label='Community' labelIcon={<GalleryHorizontalEnd size={14}/>} onClick={()=>navigate('/community')}/>

                                <UserButton.Action label='Plans' labelIcon={<DollarSignIcon size={14}/>} onClick={()=>navigate('/plans')}/>

                            </UserButton.MenuItems>
                        </UserButton>
                    </div>
                )}

                {!signedIn && <button onClick={() => setIsOpen(!isOpen)} className='md:hidden'>
                    <MenuIcon className='size-6 text-black' />
                </button>
                }

            </div>
            <div className={`flex flex-col items-center justify-center gap-6 text-lg font-normal fixed inset-0 bg-white z-50 transition-all duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
                {navLinks.map((link) => (
                    <Link key={link.name} to={link.href} onClick={() => setIsOpen(false)} className='text-black'>
                        {link.name}
                    </Link>
                ))}

                <button onClick={() => {setIsOpen(false); openSignIn()}} className='font-normal text-black'>
                    Sign in
                </button>
                <button onClick={() => {setIsOpen(false); openSignUp()}} className='text-white bg-black rounded-full px-6 py-3'>
                    Get Started
                </button>

                <button
                    onClick={() => setIsOpen(false)}
                    className="rounded-md bg-black p-2 text-white active:ring-2"
                >
                    <XIcon />
                </button>
            </div>
        </nav>
    );
};
