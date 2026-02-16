import React from 'react';
import StatusIndicator from './StatusIndicator';
import { motion } from 'framer-motion';

export type MasteryLevel = 0 | 1 | 2 | 3; // 0: None, 1: Beg, 2: Int, 3: Pro

interface MasteryTopicProps {
    title: string;
    level: MasteryLevel;
    onLevelChange: (newLevel: MasteryLevel) => void;
}

const MasteryTopic: React.FC<MasteryTopicProps> = ({ title, level, onLevelChange }) => {

    // Determine status for indicator
    const getStatus = () => {
        if (level === 3) return 'professional'; // Blue
        if (level === 2) return 'intermediate'; // Yellow
        if (level === 1) return 'beginner';     // Green
        return 'empty';
    };

    // Handle checkbox clicks
    // If user clicks Box 2, Box 1 is implied? 
    // Usually "Checkboxes" implies independent, but "Mastery" implies progressive. 
    // Requirement says: "1 box checked -> Green", "2 boxes checked -> Yellow".
    // I will implement it such that clicking Box 2 checks 1 and 2. 

    const handleCheck = (checkboxIndex: number) => {
        // checkboxIndex: 1, 2, 3
        if (level === checkboxIndex) {
            // Uncheck if clicking the active highest level
            onLevelChange((checkboxIndex - 1) as MasteryLevel);
        } else {
            // Set to this level (implies lower ones are checked)
            onLevelChange(checkboxIndex as MasteryLevel);
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between py-3 px-4 bg-zinc-900/40 rounded-lg border border-white/5 hover:border-white/10 hover:bg-zinc-900/60 transition-all group"
        >
            <div className="flex items-center gap-4">
                <StatusIndicator status={getStatus()} />
                <span className="text-gray-300 font-medium group-hover:text-white transition-colors text-sm md:text-base">
                    {title}
                </span>
            </div>

            <div className="flex gap-2">
                {[1, 2, 3].map((boxIndex) => (
                    <div
                        key={boxIndex}
                        onClick={() => handleCheck(boxIndex)}
                        className={`
                            w-5 h-5 md:w-6 md:h-6 rounded border cursor-pointer flex items-center justify-center transition-all
                            ${level >= boxIndex
                                ? 'bg-primary border-primary text-black'
                                : 'bg-transparent border-zinc-700 hover:border-gray-500'}
                        `}
                        title={boxIndex === 1 ? "Beginner" : boxIndex === 2 ? "Intermediate" : "Professional"}
                    >
                        {level >= boxIndex && (
                            <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default MasteryTopic;
