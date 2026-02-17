import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../firebase/firebase';
import { signInWithPopup, type User } from 'firebase/auth';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GoogleButton from '../components/GoogleButton';
import OrbitalVisual from '../components/home/OrbitalVisual';
import CommunitySection from '../components/home/CommunitySection';

const Home: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (auth) {
            const unsubscribe = auth.onAuthStateChanged((currentUser: User | null) => {
                setUser(currentUser);
            });
            return () => unsubscribe();
        }
    }, []);

    const handleGoogleLogin = async () => {
        setLoading(true);
        if (!auth) {
            setLoading(false);
            return;
        }

        try {
            await signInWithPopup(auth, googleProvider);
            navigate('/dashboard');
        } catch (err) {
            console.error("Login failed", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-primary/30 selection:text-primary overflow-x-hidden">
            <Navbar user={user} />

            {/* Hero Section */}
            <main className="flex-grow relative z-10 pt-32 pb-16 min-h-[90vh] flex items-center">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">

                    {/* Left: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative z-20 text-left"
                    >
                        <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter mb-6 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                            Forge Your <br />
                            <span className="text-primary italic">Destiny.</span>
                        </h1>
                        <p className="text-xl text-gray-400 mb-10 max-w-lg leading-relaxed">
                            The ultimate ecosystem for mastering DSA and Modern Development.
                            Interactive roadmaps built for performance.
                        </p>

                        <div className="flex flex-col sm:flex-row items-start gap-4">
                            {user ? (
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="px-8 py-4 bg-primary text-white font-serif hover:text-black hover:bg-white rounded-xl hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,215,0,0.3)]"
                                >
                                    OPEN DASHBOARD
                                </button>
                            ) : (
                                <GoogleButton onClick={handleGoogleLogin} isLoading={loading} />
                            )}
                        </div>
                    </motion.div>

                    {/* Right: Restored OrbitalVisual + Video Frame */}
                    <div className="relative h-[600px] flex items-center justify-center">
                        {/* OrbitalVisual as a background element */}
                        <div className="absolute inset-0 z-0 opacity-60 scale-125 pointer-events-none translate-y-[-5%] overflow-visible relative top-5">
                            <OrbitalVisual />
                        </div>
                    </div>
                </div>
            </main>

            {/* Brand Section */}
            <section className="py-20 border-y border-white/5 bg-[#080808]/50 overflow-hidden">
                <div className="flex whitespace-nowrap animate-marquee">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex gap-12 px-6 items-center">
                            {['DATA STRUCTURES', 'ALGORITHMS', 'SYSTEMS', 'FRONTEND', 'BACKEND'].map((tech) => (
                                <span key={tech} className="text-4xl md:text-6xl font-black text-white/5 hover:text-primary/20 transition-colors duration-500">{tech}</span>
                            ))}
                        </div>
                    ))}
                </div>
            </section>

            {/* Benefits Section - "The What & How" */}
            <section className="py-32 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-20 text-center">
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 uppercase">Why StacXar?</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">Expertly crafted paths from zero to senior engineer.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {benefits.map((benefit, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group relative p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] hover:shadow-[0_8px_32px_0_rgba(255,215,0,0.2)] hover:scale-105 transition-all duration-300 hover:border-primary/40 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                                    {benefit.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                                <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                                    {benefit.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* COMMUNITY */}
            <CommunitySection />

            <Footer />
        </div>
    );
};

const benefits = [
    {
        title: "Syllabus for Winners",
        description: "A battle-tested curriculum covering everything from Big-O to System Design. We cut the fluff and focus on patterns companies actually ask.",
        icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
    },
    {
        title: "Persistent Mastery",
        description: "Real-time progress tracking across all your devices. Powered by Firebase, your journey is saved automatically as you conquer each node.",
        icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    },
    {
        title: "Pro-Level Resources",
        description: "Verified documentation and premium video tutorials. Each topic is linked to top-tier sources like CP-Algorithms and GeeksForGeeks.",
        icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
    },
    {
        title: "Interview Ready",
        description: "Targeted problem sets for FAANG and top startups. Master the core techniques like Sliding Window and DP that dominate coding rounds.",
        icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
    }
];

export default Home;