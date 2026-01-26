import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="full-screen flex flex-col items-center justify-center text-center relative">
            <video
                autoPlay
                loop
                muted
                playsInline
                className="video-bg"
                //Later
                 src="https://res.cloudinary.com/demo/video/upload/v1687522591/docs/mountain-stars.mp4"
            />

            <div className="absolute inset-0 bg-black/40 z-0"></div>

            <div className="z-10 container animate-fade-in">
                <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    StacXar
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto delay-100 animate-fade-in">SOmething
                </p>

                <div className="flex gap-4 justify-center delay-200 animate-fade-in">
                    <button
                        onClick={() => navigate('/login')}
                        className="btn"
                    >
                        Get Started
                    </button>
                    {/* Placeholder for future features */}
                    {/* <button className="px-8 py-3 rounded-full border border-white/20 hover:bg-white/10 transition">
                        Explore
                    </button> */}
                </div>
            </div>

            <footer className="absolute bottom-8 text-sm text-gray-500 delay-300 animate-fade-in">
                © 2026 StacXar. Redefining Learning.
            </footer>
        </div>
    );
};

export default Home;
