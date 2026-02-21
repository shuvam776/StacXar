
import { useState, useEffect, useCallback, useRef } from 'react';
import { auth } from '../firebase/firebase';
import type { MasteryLevel } from '../components/dashboard/SubtopicCard';
import { apiClient } from '../api/apiClient';

export interface SubtopicProgress {
    subtopicId: string;
    completedItems: number;
    totalItems: number;
    mastery: MasteryLevel;
    completedResourceIds: string[];
    updatedAt: number;
}

export interface RoadmapState {
    [subtopicId: string]: SubtopicProgress;
}



export const useRoadmapProgress = (roadmapType: string = 'dsa') => {
    const [roadmapState, setRoadmapState] = useState<RoadmapState>({});
    const [loading, setLoading] = useState(true);
    const saveTimers = useRef<Map<string, number>>(new Map());

    // Optimization: Load data once when user is available
    useEffect(() => {
        const fetchProgress = async (user: any) => {
            if (!user) {
                setRoadmapState({});
                setLoading(false);
                return;
            }

            try {
                if (!user.email) return;

                const data = await apiClient.get('/roadmap/progress');

                if (data && data[roadmapType] && data[roadmapType].subtopics) {
                    setRoadmapState(data[roadmapType].subtopics);
                } else {
                    setRoadmapState({});
                }
            } catch (error: any) {
                console.group("[Roadmap Fetch Error]");
                console.error("Message:", error.message);
                console.groupEnd();
                setRoadmapState({});
            } finally {
                setLoading(false);
            }
        };

        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                fetchProgress(user);
            } else {
                setRoadmapState({});
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [roadmapType]);

    const toggleResource = useCallback((subtopicId: string, resourceId: string, totalResources: number) => {
        const user = auth.currentUser;
        if (!user) return;

        setRoadmapState(prev => {
            const currentProgress = prev[subtopicId] || {
                subtopicId,
                completedItems: 0,
                totalItems: totalResources,
                mastery: 0,
                completedResourceIds: [],
                updatedAt: Date.now()
            };

            const existingSet = new Set(currentProgress.completedResourceIds || []);
            if (existingSet.has(resourceId)) existingSet.delete(resourceId);
            else existingSet.add(resourceId);

            const nextCompletedIds = Array.from(existingSet);
            const count = nextCompletedIds.length;
            const pct = count / totalResources;

            let newMastery: MasteryLevel = 0;
            if (count === 0) newMastery = 0;
            else if (pct === 1) newMastery = 3;
            else if (pct >= 0.5) newMastery = 2;
            else newMastery = 1;

            const newProgress = {
                ...currentProgress,
                completedItems: count,
                mastery: newMastery,
                completedResourceIds: nextCompletedIds,
                updatedAt: Date.now()
            };

            // Debounced Save to MongoDB
            triggerSave(subtopicId, newProgress);

            return { ...prev, [subtopicId]: newProgress };
        });
    }, [roadmapType]);

    const triggerSave = (subtopicId: string, data: SubtopicProgress) => {
        const user = auth.currentUser;
        if (!user) return;

        if (saveTimers.current.has(subtopicId)) {
            clearTimeout(saveTimers.current.get(subtopicId));
        }

        const timer = setTimeout(async () => {
            try {
                if (!user.email) return;

                await apiClient.post('/roadmap/update', {
                    roadmapType: roadmapType,
                    subtopicId,
                    data
                });
            } catch (error: any) {
                console.group("[Roadmap Save Error]");
                console.error("Message:", error.message);
                console.groupEnd();

                window.alert(`⚠️ Failed to save progress: ${error.message}`);
            }
        }, 1000) as unknown as number;

        saveTimers.current.set(subtopicId, timer);
    };

    return { roadmapState, loading, toggleResource };
};
