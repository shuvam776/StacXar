import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { androidTrack, reactNativeTrack, type AppDevTrack } from '../data/appDevData';
import SubtopicCard, { type MasteryLevel } from '../components/dashboard/SubtopicCard';
import { type SubTopic } from '../data/dsaData';
import ResourceSidebar from '../components/dashboard/ResourceSidebar';
import RoadmapConnector from '../components/dashboard/RoadmapConnector';
import Footer from '../components/Footer';
import { useRoadmapProgress } from '../hooks/useRoadmapProgress';
import LoadingSpinner from '../components/LoadingSpinner';
import { CardContainer, CardBody, CardItem } from "../components/ui/3d-card";
import { SparklesCore } from "../components/ui/sparkles";
import { motion, AnimatePresence } from 'framer-motion';

interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

const AppDevRoadmap: React.FC = () => {
    const [selectedTrack, setSelectedTrack] = useState<AppDevTrack | null>(null);
    const { roadmapState, loading, toggleResource } = useRoadmapProgress('appdev');
    const [activeSubtopic, setActiveSubtopic] = useState<SubTopic | null>(null);
    const [nodePositions, setNodePositions] = useState<Map<string, Rect>>(new Map());
    const nodeRefs = useRef<Map<string, HTMLDivElement>>(new Map());
    const containerRef = useRef<HTMLDivElement>(null);

    const allSubtopics = useMemo(() => {
        if (!selectedTrack) return [];
        return selectedTrack.topics.flatMap(t => t.subtopics);
    }, [selectedTrack]);

    const updatePositions = useCallback(() => {
        if (!containerRef.current) return;
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
        if (!containerRef.current || !selectedTrack) return;

        const observer = new ResizeObserver(() => {
            requestAnimationFrame(updatePositions);
        });

        observer.observe(containerRef.current);
        updatePositions();

        // Brief delay to ensure all 3D cards and layout shifts are stable
        const timer = setTimeout(updatePositions, 100);

        return () => {
            observer.disconnect();
            clearTimeout(timer);
        };
    }, [updatePositions, loading, selectedTrack]);

    const getMastery = useCallback((subtopicId: string): MasteryLevel => {
        return roadmapState[subtopicId]?.mastery || 0;
    }, [roadmapState]);

    const getMasteryColor = (level: MasteryLevel) => {
        switch (level) {
            case 3: return '#3b82f6';
            case 2: return '#fbbf24';
            case 1: return '#22c55e';
            default: return '#52525b';
        }
    };

    if (loading && Object.keys(roadmapState).length === 0) {
        return <LoadingSpinner />;
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-white">

            <AnimatePresence mode="wait">
                {!selectedTrack ? (
                    <motion.div
                        key="selection"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="pt-32 pb-24 px-8 max-w-7xl mx-auto"
                    >
                        <header className="text-center mb-16 relative">
                            <div className="absolute inset-0 -top-20 h-40 w-full bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
                            <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 uppercase italic">
                                Choose Your <span className="text-primary">Track</span>
                            </h1>
                            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                                Select a path to master mobile development with premium resources and projects.
                            </p>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                            <CardContainer className="inter-var">
                                <CardBody className="bg-black/40 group/card  hover:shadow-2xl hover:shadow-primary/[0.1] border-white/10 w-auto sm:w-[30rem] h-auto rounded-3xl p-8 border">
                                    <CardItem translateZ="50" className="text-xl font-bold text-white uppercase italic">
                                        Android Native
                                    </CardItem>
                                    <CardItem as="p" translateZ="60" className="text-gray-400 text-sm max-w-sm mt-2">
                                        Master modern Android development with Kotlin, Jetpack Compose, and Clean Architecture.
                                    </CardItem>
                                    <CardItem translateZ="100" className="w-full mt-8">
                                        <div className="h-40 w-full bg-gradient-to-br from-green-500/20 to-green-900/40 rounded-2xl flex items-center justify-center border border-green-500/20">
                                            <svg className="w-20 h-20 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17.523 15.3414C17.0657 15.3414 16.6908 14.9665 16.6908 14.5092C16.6908 14.0519 17.0657 13.677 17.523 13.677C17.9803 13.677 18.3552 14.0519 18.3552 14.5092C18.3552 14.9665 17.9803 15.3414 17.523 15.3414ZM6.47702 15.3414C6.01974 15.3414 5.64478 14.9665 5.64478 14.5092C5.64478 14.0519 6.01974 13.677 6.47702 13.677C6.93431 13.677 7.30927 14.0519 7.30927 14.5092C7.30927 14.9665 6.93431 15.3414 6.47702 15.3414ZM17.886 10.3283L19.7915 7.02708C19.958 6.7381 19.8584 6.36868 19.5694 6.20235C19.2804 6.03554 18.9113 6.13511 18.7448 6.42436L16.8016 9.78913C15.3789 9.14364 13.7548 8.78442 12 8.78442C10.2452 8.78442 8.62107 9.14364 7.19838 9.78913L5.2552 6.42436C5.08869 6.13511 4.71958 6.03554 4.43058 6.20235C4.14132 6.36868 4.04212 6.7381 4.20863 7.02708L6.11403 10.3283C2.85966 12.1889 0.648193 15.5358 0.648193 19.4566H23.3519C23.3519 15.5358 21.1404 12.1889 17.886 10.3283Z" /></svg>
                                        </div>
                                    </CardItem>
                                    <div className="flex justify-between items-center mt-12">
                                        <CardItem translateZ={20} className="px-4 py-2 rounded-xl text-xs font-normal text-white">
                                            Kotlin & Compose
                                        </CardItem>
                                        <CardItem
                                            translateZ={20}
                                            as="button"
                                            onClick={() => setSelectedTrack(androidTrack)}
                                            className="px-6 py-2 rounded-xl bg-white text-black font-bold text-sm uppercase"
                                        >
                                            Start Track
                                        </CardItem>
                                    </div>
                                </CardBody>
                            </CardContainer>

                            <CardContainer className="inter-var">
                                <CardBody className="bg-black/40 group/card  hover:shadow-2xl hover:shadow-primary/[0.1] border-white/10 w-auto sm:w-[30rem] h-auto rounded-3xl p-8 border">
                                    <CardItem translateZ="50" className="text-xl font-bold text-white uppercase italic">
                                        React Native
                                    </CardItem>
                                    <CardItem as="p" translateZ="60" className="text-gray-400 text-sm max-w-sm mt-2">
                                        Build high-performance cross-platform apps with JavaScript and the React ecosystem.
                                    </CardItem>
                                    <CardItem translateZ="100" className="w-full mt-8">
                                        <div className="h-40 w-full bg-gradient-to-br from-blue-500/20 to-blue-900/40 rounded-2xl flex items-center justify-center border border-blue-500/20">
                                            <svg className="w-20 h-20 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M23.34 11.23c-1.33-4.14-4.88-6.15-8.11-6.15-.36 0-.71.02-1.05.06-2.13-1.44-4.89-2.09-7.58-1.74a9.99 9.99 0 00-7.85 6.32c-1.33 4.14 0 8.5 2.89 10.45.36 1.43 1.13 2.76 2.21 3.82 2.62 2.53 6.42 3.19 9.61 1.74 3.29 1.45 7.15.82 9.81-1.74 1.08-1.06 1.85-2.39 2.21-3.82 2.89-1.95 4.22-6.31 2.86-10.45zm-14.88 4.21a4.99 4.99 0 01-4.99-4.99 4.99 4.99 0 014.99-4.99 4.99 4.99 0 014.99 4.99 4.99 4.99 0 01-4.99 4.99zm6.49-.01a4.99 4.99 0 01-4.99-4.99 4.99 4.99 0 014.99-4.99 4.99 4.99 0 014.99 4.99 4.99 4.99 0 01-4.99 4.99z" /></svg>
                                        </div>
                                    </CardItem>
                                    <div className="flex justify-between items-center mt-12">
                                        <CardItem translateZ={20} className="px-4 py-2 rounded-xl text-xs font-normal text-white">
                                            JS & Expo
                                        </CardItem>
                                        <CardItem
                                            translateZ={20}
                                            as="button"
                                            onClick={() => setSelectedTrack(reactNativeTrack)}
                                            className="px-6 py-2 rounded-xl bg-white text-black font-bold text-sm uppercase"
                                        >
                                            Start Track
                                        </CardItem>
                                    </div>
                                </CardBody>
                            </CardContainer>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="roadmap"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onAnimationComplete={() => updatePositions()}
                        className="min-h-screen bg-black text-white font-sans overflow-x-hidden"
                    >
                        <div className="relative pt-32 pb-48 max-w-7xl mx-auto px-4" ref={containerRef}>
                            <button
                                onClick={() => setSelectedTrack(null)}
                                className="mb-8 flex items-center gap-2 text-gray-500 hover:text-white transition-colors group"
                            >
                                <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                Back to Tracks
                            </button>

                            <motion.header
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="text-center mb-24 px-4 overflow-hidden rounded-3xl relative py-16 border border-white/5"
                            >
                                <div className="absolute inset-0 z-0 text-white">
                                    <SparklesCore
                                        id="appdev-sparkles"
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
                                        {selectedTrack.title.split(' ')[0]} <span className="text-primary italic">{selectedTrack.title.split(' ').slice(1).join(' ')}</span>
                                    </h1>
                                    <p className="text-gray-400 text-sm md:text-lg max-w-xl mx-auto">{selectedTrack.description}</p>
                                </div>
                            </motion.header>


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
                                    const parentTopic = selectedTrack.topics.find(t => t.subtopics.some(st => st.id === sub.id));
                                    const isFirstInTopic = parentTopic && parentTopic.subtopics[0].id === sub.id;
                                    const mastery = getMastery(sub.id);

                                    return (
                                        <React.Fragment key={sub.id}>
                                            {isFirstInTopic && (
                                                <div className="w-full flex justify-center py-8">
                                                    <div className="px-6 py-2 rounded-full border border-white/10 bg-zinc-900/80 text-primary font-bold shadow-xl backdrop-blur-sm z-20 uppercase tracking-widest text-xs">
                                                        {parentTopic?.title}
                                                    </div>
                                                </div>
                                            )}
                                            <div
                                                ref={el => { if (el) nodeRefs.current.set(sub.id, el); else nodeRefs.current.delete(sub.id); }}
                                                className={`w-full md:w-[45%] relative ${isLeft ? 'md:mr-auto' : 'md:ml-auto'}`}
                                            >
                                                <SubtopicCard
                                                    subtopic={sub}
                                                    masteryLevel={mastery}
                                                    onClick={() => setActiveSubtopic(sub)}
                                                />
                                            </div>
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <ResourceSidebar
                isOpen={!!activeSubtopic}
                onClose={() => setActiveSubtopic(null)}
                subtopic={activeSubtopic}
                completedResourceIds={activeSubtopic ? (roadmapState[activeSubtopic.id]?.completedResourceIds || []) : []}
                onToggleResource={toggleResource}
            />
            <Footer />
        </div>
    );
};

export default React.memo(AppDevRoadmap);
