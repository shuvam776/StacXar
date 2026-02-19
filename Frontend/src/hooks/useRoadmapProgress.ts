
import { useState, useEffect, useCallback, useRef } from 'react';
import { auth } from '../firebase/firebase';
import type { MasteryLevel } from '../components/dashboard/SubtopicCard';

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

const API_BASE = import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL}/api/v1` : 'http://localhost:5000/api/v1';

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

                const response = await fetch(`${API_BASE}/roadmap/progress`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'user-email': user.email
                    }
                });

                if (response.status === 404) {
                    console.log(`[Roadmap] No profile found for ${user.email}, starting fresh.`);
                    setRoadmapState({});
                    setLoading(false);
                    return;
                }

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || `Server error: ${response.status}`);
                }

                const data = await response.json();

                if (data && data[roadmapType] && data[roadmapType].subtopics) {
                    setRoadmapState(data[roadmapType].subtopics);
                } else {
                    setRoadmapState({});
                }
            } catch (error: any) {
                console.group("[Roadmap Fetch Error]");
                console.error("Message:", error.message);
                console.error("API Base:", API_BASE);
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

                const response = await fetch(`${API_BASE}/roadmap/update`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'user-email': user.email
                    },
                    body: JSON.stringify({
                        roadmapType: roadmapType,
                        subtopicId,
                        data
                    })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    let errorData: any = {};
                    try { errorData = JSON.parse(errorText); } catch (e) { }

                    console.group("[Roadmap Save Error]");
                    console.error("Status:", response.status);
                    console.error("Response Body:", errorData);
                    console.groupEnd();

                    window.alert(`⚠️ Failed to save progress: ${errorData.message || response.statusText || 'Server Error'}`);
                }
            } catch (error: any) {
                console.error("[Roadmap Save Error] Network failure:", error);
                window.alert("⚠️ Connection error: Could not connect to the server.");
            }
        }, 1000) as unknown as number;

        saveTimers.current.set(subtopicId, timer);
    };

    return { roadmapState, loading, toggleResource };
};
