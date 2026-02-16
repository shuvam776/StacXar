import React from 'react';
import { motion } from 'framer-motion';

const techIcons = [
    { name: 'C++', color: '#61DAFB' },
    { name: 'JAVA', color: '#339933' },
    { name: 'MONGO', color: '#47A248' },
    { name: 'PYTHON', color: '#3776AB' },
    { name: 'JAVASCRIPT', color: '#F7DF1E' },
    { name: 'TYPESCRIPT', color: '#3178C6' },
];

const OrbitalVisual: React.FC = () => {
    return (
        <div className="relative w-full h-[500px] flex items-center justify-center overflow-visible">
            {/* Central Hub */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1, type: "spring" }}
                className="relative z-20 w-32 h-32 bg-primary rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(255,215,0,0.5)]"
            >
                <div className="text-white font-serif text-2xl">STacXar</div>

                {/* Outer Glows */}
                <div className="absolute inset-0 rounded-full animate-ping bg-primary/20"></div>
            </motion.div>

            {/* Orbiting Rings */}
            {[1, 2, 3].map((ring) => (
                <div
                    key={ring}
                    className="absolute border border-white/10 rounded-full animate-pulse"
                    style={{
                        width: `${ring * 200}px`,
                        height: `${ring * 200}px`,
                    }}
                ></div>
            ))}

            {/* Orbiting Icons */}
            {techIcons.map((tech, index) => {
                const orbitRadius = 80 + (index % 3) * 80;
                const duration = 15 + index * 5;
                const delay = -index * 2;

                return (
                    <motion.div
                        key={tech.name}
                        className="absolute z-30"
                        animate={{
                            rotate: 360,
                        }}
                        transition={{
                            duration: duration,
                            repeat: Infinity,
                            ease: "linear",
                            delay: delay,
                        }}
                        style={{
                            width: `${orbitRadius * 2}px`,
                            height: `${orbitRadius * 2}px`,
                        }}
                    >
                        <motion.div
                            className="absolute bg-zinc-900 border border-white/10 p-3 rounded-2xl shadow-2xl flex items-center justify-center"
                            style={{
                                top: '50%',
                                left: '0',
                                transform: 'translate(-50%, -50%)',
                            }}
                            whileHover={{ scale: 1.2, borderColor: '#cdd3daff' }}
                        >
                            <span className="text-[10px] font-bold text-white/50">{tech.name}</span>
                            <div
                                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full blur-[4px]"
                                style={{ backgroundColor: tech.color }}
                            ></div>
                        </motion.div>
                    </motion.div>
                );
            })}

            {/* Ambient Particles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white/10 rounded-full"
                        initial={{
                            x: Math.random() * 500 - 250,
                            y: Math.random() * 500 - 250,
                            opacity: 0
                        }}
                        animate={{
                            y: [0, -40, 0],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default OrbitalVisual;
