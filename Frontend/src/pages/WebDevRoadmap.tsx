
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { webDevTopics } from '../data/webDevData';
import { type SubTopic } from '../data/dsaData';
import SubtopicCard, { type MasteryLevel } from '../components/dashboard/SubtopicCard';
import ResourceSidebar from '../components/dashboard/ResourceSidebar';
import RoadmapConnector from '../components/dashboard/RoadmapConnector';
import { useRoadmapProgress } from '../hooks/useRoadmapProgress';
import LoadingSpinner from '../components/LoadingSpinner';
import { SparklesCore } from "../components/ui/sparkles";
import { motion } from 'framer-motion';

interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

const WebDevRoadmap: React.FC = () => {
    // 1. Data Setup - Memoized to prevent recalculation on every render
    const allSubtopics = useMemo(() => webDevTopics.flatMap(t => t.subtopics), []);

    // 2. Hook Integration - SPECIFY 'webdev'
    const { roadmapState, loading, toggleResource } = useRoadmapProgress('webdev');

    const [activeSubtopic, setActiveSubtopic] = useState<SubTopic | null>(null);
    const [nodePositions, setNodePositions] = useState<Map<string, Rect>>(new Map());
    const nodeRefs = useRef<Map<string, HTMLDivElement>>(new Map());
    const containerRef = useRef<HTMLDivElement>(null);

    // 3. Optimized Node Measurement with ResizeObserver
    const updatePositions = useCallback(() => {
        const newPositions = new Map<string, Rect>();
        nodeRefs.current.forEach((el, id) => {
            if (el) {
                newPositions.set(id, {
                    x: el.offsetLeft,
                    y: el.offsetTop,
                    width: el.offsetWidth,
                    height: el.offsetHeight
                });
            }
        });
        setNodePositions(newPositions);
    }, []);

    useEffect(() => {
        if (!containerRef.current) return;

        // Use ResizeObserver for efficient layout tracking without polling or heavy event listeners
        const observer = new ResizeObserver(() => {
            requestAnimationFrame(updatePositions);
        });

        observer.observe(containerRef.current);
        // Initial measurement
        updatePositions();

        return () => observer.disconnect();
    }, [updatePositions, loading]); // Redo if loading finishes (content might shift)

    // 4. Helper to get mastery from state
    const getMastery = useCallback((subtopicId: string): MasteryLevel => {
        return roadmapState[subtopicId]?.mastery || 0;
    }, [roadmapState]);

    const getMasteryColor = (level: MasteryLevel) => {
        switch (level) {
            case 3: return '#3b82f6'; // Blue
            case 2: return '#fbbf24'; // Yellow
            case 1: return '#22c55e'; // Green
            default: return '#52525b'; // Zinc-600
        }
    };

    // Show loading spinner only for the initial data fetch if required
    if (loading && Object.keys(roadmapState).length === 0) {
        return <LoadingSpinner />;
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden" ref={containerRef}>

            <motion.div
                className="relative pt-24 pb-48 max-w-7xl mx-auto px-4"
                onAnimationComplete={() => updatePositions()}
            >
                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-24 px-4 overflow-hidden rounded-3xl relative py-16 border border-white/5"
                >
                    <div className="absolute inset-0 z-0">
                        <SparklesCore
                            id="webdev-sparkles"
                            background="transparent"
                            minSize={0.4}
                            maxSize={1}
                            particleDensity={100}
                            className="w-full h-full"
                            particleColor="#FFFFFF"
                        />
                    </div>
                    <div className="relative z-10">
                        <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-4 uppercase italic">
                            Web Dev <span className="text-primary italic uppercase">Journey</span>
                        </h1>
                        <p className="text-gray-400 text-sm md:text-lg max-w-xl mx-auto">Master Modern Development Step by Step.</p>
                    </div>
                </motion.header>

                {/* Nodes Render Loop */}
                <div className="relative z-10 flex flex-col gap-10 md:gap-24">
                    {/* SVG Layer - Moved inside the same origin container */}
                    <div className="absolute inset-0 pointer-events-none z-0">
                        {allSubtopics.map((sub, index) => {
                            if (index === allSubtopics.length - 1) return null;
                            const nextSub = allSubtopics[index + 1];
                            const startRect = nodePositions.get(sub.id);
                            const endRect = nodePositions.get(nextSub.id);

                            if (!startRect || !endRect) return null;

                            const isDesktop = window.innerWidth >= 768;
                            const isStartLeft = index % 2 === 0;

                            let startPt = { x: startRect.x + startRect.width / 2, y: startRect.y + startRect.height };
                            let endPt = { x: endRect.x + endRect.width / 2, y: endRect.y };

                            if (isDesktop) {
                                if (isStartLeft) {
                                    startPt = { x: startRect.x + startRect.width, y: startRect.y + startRect.height / 2 };
                                    endPt = { x: endRect.x, y: endRect.y + endRect.height / 2 };
                                } else {
                                    startPt = { x: startRect.x, y: startRect.y + startRect.height / 2 };
                                    endPt = { x: endRect.x + endRect.width, y: endRect.y + endRect.height / 2 };
                                }
                            }

                            const mastery = getMastery(sub.id);
                            const color = getMasteryColor(mastery);

                            return (
                                <RoadmapConnector
                                    key={`conn-${sub.id}`}
                                    start={startPt}
                                    end={endPt}
                                    color={color}
                                />
                            );
                        })}
                    </div>
                    {allSubtopics.map((sub, index) => {
                        const isLeft = index % 2 === 0;
                        const topics = webDevTopics; // Closure reference
                        const parentTopic = topics.find(t => t.subtopics.some(st => st.id === sub.id));
                        const isFirstInTopic = parentTopic && parentTopic.subtopics[0].id === sub.id;

                        const mastery = getMastery(sub.id);

                        return (
                            <React.Fragment key={sub.id}>
                                {isFirstInTopic && (
                                    <div className="w-full flex justify-center py-8">
                                        <div className="px-6 py-2 rounded-full border border-white/10 bg-zinc-900/80 text-primary font-bold shadow-xl backdrop-blur-sm z-20">
                                            {parentTopic?.title}
                                        </div>
                                    </div>
                                )}

                                <div
                                    ref={el => { if (el) nodeRefs.current.set(sub.id, el); }}
                                    className={`
                                         w-full md:w-[45%] relative
                                         ${isLeft ? 'md:mr-auto' : 'md:ml-auto'}
                                         transform transition-all duration-500
                                     `}
                                >
                                    <SubtopicCard
                                        subtopic={sub}
                                        masteryLevel={mastery}
                                        onClick={() => setActiveSubtopic(sub)}
                                    />

                                    <div className={`
                                         absolute top-4 -z-10 text-[10rem] font-bold text-white/5 
                                         ${isLeft ? '-left-12' : '-right-12'}
                                         hidden md:block select-none
                                     `}>
                                        {index + 1}
                                    </div>
                                </div>
                            </React.Fragment>
                        );
                    })}
                </div>
            </motion.div>

            <ResourceSidebar
                isOpen={!!activeSubtopic}
                onClose={() => setActiveSubtopic(null)}
                subtopic={activeSubtopic}
                completedResourceIds={activeSubtopic ? (roadmapState[activeSubtopic.id]?.completedResourceIds || []) : []}
                onToggleResource={toggleResource}
            />
        </div >
    );
};
export default React.memo(WebDevRoadmap);
