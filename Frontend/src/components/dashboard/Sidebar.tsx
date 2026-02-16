import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const links = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'DSA', path: '/dsa' },
        { name: 'Web Dev', path: '/web-dev' },
        { name: 'App Dev', path: '/app-dev' },
        { name: 'Profile', path: '/profile' },
    ];

    return (
        <aside className="w-64 bg-black border-r border-white/10 text-white flex flex-col h-full hidden md:flex">
            <div className="p-6 border-b border-white/10">
                <h2
                    onClick={() => navigate('/')}
                    className="text-2xl font-bold text-primary tracking-tight cursor-pointer"
                >
                    StacXar
                </h2>
                <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">Learning Path</p>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) =>
                            `block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                ? 'bg-primary'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`
                        }
                    >
                        {link.name}
                    </NavLink>
                ))}
            </nav>
            <div className="p-4 border-t border-white/10">
                <div className="text-xs text-gray-600">
                    © 2025 StacXar
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
