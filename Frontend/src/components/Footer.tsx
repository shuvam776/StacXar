import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="w-full bg-black/80 border-t border-white/10 py-12 text-white">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Brand */}
                <div>
                    <h3 className="text-xl font-bold mb-4">StacXar</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Redefining the way you learn Data Structures and Algorithms.
                        Visual, Interactive, and Deep.
                    </p>
                </div>

                {/* Links (Placeholder) */}
                <div>
                    <h4 className="text-lg font-bold mb-4">Explore</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li><a href="#" className="hover:text-white transition">About Us</a></li>
                        <li><a href="#" className="hover:text-white transition">Careers</a></li>
                        <li><a href="#" className="hover:text-white transition">Blog</a></li>
                    </ul>
                </div>

                {/* Socials (Placeholder) */}
                <div>
                    <h4 className="text-lg font-bold mb-4">Connect</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li><a href="#" className="hover:text-white transition">Twitter / X</a></li>
                        <li><a href="#" className="hover:text-white transition">GitHub</a></li>
                        <li><a href="#" className="hover:text-white transition">Discord</a></li>
                    </ul>
                </div>
            </div>
            <div className="mt-12 pt-8 border-t border-white/5 text-center text-xs text-gray-500">
                © {new Date().getFullYear()} StacXar Inc. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
