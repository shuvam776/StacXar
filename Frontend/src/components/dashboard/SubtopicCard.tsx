import React from 'react';
import { CardContainer, CardBody, CardItem } from "../ui/3d-card";
import type { SubTopic } from '../../data/dsaData';

export type MasteryLevel = 0 | 1 | 2 | 3; // 0: None, 1: Beg, 2: Int, 3: Pro

interface SubtopicCardProps {
    subtopic: SubTopic;
    masteryLevel: MasteryLevel;
    onClick: () => void;
}

const SubtopicCard: React.FC<SubtopicCardProps> = ({ subtopic, masteryLevel, onClick }) => {

    const getStatusColor = () => {
        switch (masteryLevel) {
            case 3: return 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]';
            case 2: return 'bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.8)]';
            case 1: return 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.8)]';
            default: return 'bg-zinc-700'; // Empty
        }
    };

    return (
        <CardContainer className="inter-var py-0 w-full" containerClassName="py-0 block w-full">
            <CardBody
                className="
                    relative w-full md:w-[280px] p-6 rounded-3xl cursor-pointer
                    bg-white/5 backdrop-blur-xl border border-white/20
                    shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]
                    hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]
                    hover:border-white/40 hover:bg-white/10
                    transition-all duration-300 group overflow-hidden
                    h-auto min-h-[220px]
                "
            >
                <div onClick={onClick} className="h-full flex flex-col justify-between">
                    {/* Top Gloss/Highlight */}
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent opacity-50 pointer-events-none rounded-t-3xl" />

                    {/* Inner Glow/Border Effect */}
                    <div className="absolute inset-0 rounded-3xl border border-white/10 pointer-events-none group-hover:border-white/30 transition-colors duration-500" />

                    {/* Content Container */}
                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <CardItem
                            translateZ="50"
                            className="flex justify-between items-start mb-4 w-full"
                        >
                            <h3 className="text-xl font-black text-white leading-tight drop-shadow-md group-hover:text-primary transition-colors pr-4">
                                {subtopic.title}
                            </h3>

                            {/* Status Dot with Pulse */}
                            <div className={`
                                flex-shrink-0 w-4 h-4 rounded-full ${getStatusColor()} 
                                transition-all duration-500 border border-white/20
                            `}></div>
                        </CardItem>

                        <CardItem
                            as="p"
                            translateZ="60"
                            className="text-sm text-gray-200 font-medium leading-relaxed mb-6 line-clamp-3 text-shadow-sm opacity-90 group-hover:opacity-100 transition-opacity"
                        >
                            {subtopic.description}
                        </CardItem>

                        <CardItem
                            translateZ="40"
                            className="mt-auto"
                        >
                            <span className="
                                inline-flex items-center gap-2 text-xs font-bold text-white/70 uppercase tracking-widest 
                                group-hover:text-primary transition-colors
                            ">
                                Explore
                                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                </svg>
                            </span>
                        </CardItem>
                    </div>
                </div>
            </CardBody>
        </CardContainer>
    );
};

export default SubtopicCard;
