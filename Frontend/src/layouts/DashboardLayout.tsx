import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import { auth } from '../firebase/firebase';
import { NavLink } from 'react-router-dom';

const DashboardLayout: React.FC = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/login');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const links = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'DSA', path: '/dsa' },
        { name: 'Web Dev', path: '/web-dev' },
        { name: 'App Dev', path: '/app-dev' },
        { name: 'Profile', path: '/profile' },
    ];

    return (
        <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
            {/* Sidebar (Desktop) */}
            <Sidebar />

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden">
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
                    <div className="relative w-64 bg-black border-r border-white/10 flex flex-col h-full p-4">
                        <div className="mb-6 flex justify-between items-center">
                            <h1 className="text-xl font-black italic tracking-tighter">STAC<span className="text-primary">XAR</span></h1>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <nav className="space-y-2 flex-1">
                            {links.map(link => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`
                                    }
                                >
                                    {link.name}
                                </NavLink>
                            ))}
                        </nav>
                        <button onClick={handleLogout} className="mt-auto p-4 text-left text-red-400 hover:text-red-300">Logout</button>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full relative">
                {/* Mobile Header */}
                <header className="h-16 border-b border-white/10 flex items-center justify-between px-4 md:px-8 bg-black/50 backdrop-blur-sm md:hidden">
                    <button onClick={() => setIsMobileMenuOpen(true)} className="text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                    <div className="font-bold text-primary text-xl">StacXar</div>
                    <div className="w-6"></div> {/* Spacer */}
                </header>

                {/* Desktop Header (Logout) */}
                <header className="hidden md:flex h-16 border-b border-white/10 items-center justify-end px-8 bg-black">
                    <button
                        onClick={handleLogout}
                        className="text-sm text-gray-400 hover:text-red-400 font-medium transition-colors"
                    >
                        Logout
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
