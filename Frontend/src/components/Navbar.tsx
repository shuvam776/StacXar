import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
    user: User | null;
}

const Navbar: React.FC<NavbarProps> = React.memo(({ user }) => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = useMemo(() => [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'DSA', path: '/dsa' },
        { name: 'Web Dev', path: '/web-dev' },
        { name: 'App Dev', path: '/app-dev' },
        { name: 'Profile', path: '/profile' },
    ], []);

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-[#050505]/80 backdrop-blur-md text-white border-b border-white/5">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <div
                    onClick={() => navigate('/')}
                    className="text-2xl font-black cursor-pointer tracking-tighter hover:text-primary transition-colors flex items-center gap-2"
                >
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-black text-xs font-black">SX</div>
                    STACXAR
                </div>

                {/* Desktop Links */}
                <div className="hidden md:flex gap-10 items-center">
                    {navLinks.map((link) => (
                        <button
                            key={link.name}
                            onClick={() => navigate(link.path)}
                            className="text-sm font-bold text-gray-400 hover:text-white transition-all uppercase tracking-widest"
                        >
                            {link.name}
                        </button>
                    ))}
                </div>

                {/* Auth & Mobile Toggle */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="hidden md:flex items-center gap-6">
                            <span className="text-[10px] text-gray-500 font-mono font-bold tracking-widest">{user.email?.toUpperCase()}</span>
                            <button
                                onClick={() => auth.signOut()}
                                className="px-6 py-2 border border-white/10 text-white rounded-xl text-xs font-black hover:bg-white hover:text-black transition-all"
                            >
                                LOGOUT
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => navigate('/')}
                            className="hidden md:block px-6 py-2 bg-primary text-black rounded-xl text-xs font-black hover:scale-105 transition-all shadow-xl"
                        >
                            GET STARTED
                        </button>
                    )}

                    <button
                        className="md:hidden text-primary"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden bg-[#050505] border-t border-white/5 overflow-hidden shadow-2xl"
                    >
                        <div className="flex flex-col p-6 gap-6">
                            {navLinks.map((link) => (
                                <button
                                    key={link.name}
                                    onClick={() => {
                                        navigate(link.path);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="text-left text-2xl font-black text-gray-400 hover:text-white"
                                >
                                    {link.name}
                                </button>
                            ))}
                            <div className="h-px bg-white/5 my-2"></div>
                            {user ? (
                                <div className="flex flex-col gap-4">
                                    <span className="text-sm text-gray-500 font-bold">{user.displayName}</span>
                                    <button
                                        onClick={() => auth.signOut()}
                                        className="text-left text-red-600 font-black text-lg"
                                    >
                                        LOGOUT
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => {
                                        navigate('/');
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="text-left text-primary font-black text-xl"
                                >
                                    GET STARTED
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
});

export default Navbar;
