import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { SubTopic } from '../data/dsaData';
import type { DSAQuestion } from '../data/dsaQuestions';

interface TrackerContextType {
    selectedQuestion: DSAQuestion | null;
    setSelectedQuestion: (question: DSAQuestion | null) => void;
    activeCategory: string;
    setActiveCategory: (categoryId: string) => void;
    activeRoadmapTopic: SubTopic | null;
    setActiveRoadmapTopic: (topic: SubTopic | null) => void;
}

const TrackerContext = createContext<TrackerContextType | undefined>(undefined);

export const TrackerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [selectedQuestion, setSelectedQuestion] = useState<DSAQuestion | null>(null);
    const [activeCategory, setActiveCategory] = useState<string>('arrays');
    const [activeRoadmapTopic, setActiveRoadmapTopic] = useState<SubTopic | null>(null);

    return (
        <TrackerContext.Provider value={{
            selectedQuestion,
            setSelectedQuestion,
            activeCategory,
            setActiveCategory,
            activeRoadmapTopic,
            setActiveRoadmapTopic
        }}>
            {children}
        </TrackerContext.Provider>
    );
};

export const useTracker = () => {
    const context = useContext(TrackerContext);
    if (context === undefined) {
        throw new Error('useTracker must be used within a TrackerProvider');
    }
    return context;
};
