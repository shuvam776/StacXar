import React from 'react';
import { motion } from 'framer-motion';

interface StatusIndicatorProps {
    status: 'empty' | 'beginner' | 'intermediate' | 'professional';
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
    const getStatusColor = () => {
        switch (status) {
            case 'beginner': return 'bg-green-500 shadow-[0_0_8px_#22c55e]';
            case 'intermediate': return 'bg-yellow-400 shadow-[0_0_8px_#fccb00]';
            case 'professional': return 'bg-blue-500 shadow-[0_0_8px_#3b82f6]';
            default: return 'bg-zinc-700';
        }
    };

    return (
        <div className="relative flex items-center justify-center w-4 h-4">
            <motion.div
                initial={false}
                animate={{
                    scale: status === 'empty' ? 1 : [1, 1.2, 1],
                    opacity: 1
                }}
                transition={{ duration: 0.5 }}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${getStatusColor()}`}
            />
        </div>
    );
};

export default StatusIndicator;
