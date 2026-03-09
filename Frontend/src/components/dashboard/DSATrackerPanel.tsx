import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { dsaTrackerData, type DSAQuestion } from '../../data/dsaQuestions';
import { ChevronRight, Code2, ArrowRight } from 'lucide-react';
// Lazy load heavy modal
const SolutionViewerModal = React.lazy(() => import('./SolutionViewerModal'));

const DSATrackerPanel: React.FC = () => {
    // All local state — as requested
    const [activeCategory, setActiveCategory] = useState<string>(dsaTrackerData[0].id);
    const [selectedQuestion, setSelectedQuestion] = useState<DSAQuestion | null>(null);
    const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

    const navigate = useNavigate();

    const currentTopic = useMemo(
        () => dsaTrackerData.find(t => t.id === activeCategory) ?? dsaTrackerData[0],
        [activeCategory]
    );

    const toggleComplete = React.useCallback((id: string) => {
        setCompletedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }, []);

    const topicCompleted = useMemo(() =>
        currentTopic.questions.filter(q => completedIds.has(q.id)).length,
        [currentTopic, completedIds]
    );

    const totalCompleted = useMemo(() => completedIds.size, [completedIds]);

    const totalQuestions = useMemo(() =>
        dsaTrackerData.reduce((s, t) => s + t.questions.length, 0),
        []
    );

    return (
        <>
            <div className="w-full" id="practice-tracker-panel">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-8"
                >
                    <div>
                        <div className="flex items-center gap-3 sm:gap-4 mb-2">
                            <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2 truncate max-w-[200px] sm:max-w-none">
                                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-primary rounded-full animate-pulse shrink-0" />
                                Practice Tracker
                            </h2>
                            <div className="h-px bg-white/10 w-12 sm:w-24 shrink" />
                        </div>
                        <p className="text-gray-400 text-[10px] sm:text-sm">
                            {totalCompleted} / {totalQuestions} completed
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/dsa/tracker')}
                        className="flex items-center gap-2 hover:bg-black bg-white text-black px-4 py-2 rounded-xl border border-primary/30 text-sm hover:text-white hover:scale-110 font-bold transition-all"
                    >
                        Full Tracker <ArrowRight size={16} />
                    </button>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Category Sidebar */}
                    <div className="w-full lg:w-56 shrink-0 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 no-scrollbar scrollbar-hide">
                        {dsaTrackerData.map(topic => {
                            const done = topic.questions.filter(q => completedIds.has(q.id)).length;
                            const pct = Math.round((done / topic.questions.length) * 100);
                            const isActive = topic.id === activeCategory;
                            return (
                                <button
                                    key={topic.id}
                                    onClick={() => setActiveCategory(topic.id)}
                                    className={`shrink-0 lg:shrink text-left px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all border whitespace-nowrap lg:whitespace-normal ${isActive
                                        ? 'bg-primary/10 border-primary text-primary'
                                        : 'bg-zinc-900 border-white/5 text-gray-400 hover:bg-zinc-800 hover:text-white'
                                        }`}
                                >
                                    <div className="flex justify-between items-center gap-2">
                                        <span className="font-semibold text-xs sm:text-sm">{topic.title}</span>
                                        {isActive && <ChevronRight size={14} className="hidden lg:block" />}
                                        <span className="text-[10px] text-gray-500 hidden lg:block">{done}/{topic.questions.length}</span>
                                    </div>
                                    {isActive && (
                                        <div className="hidden lg:block h-1 w-full bg-white/10 rounded-full mt-2 overflow-hidden">
                                            <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Questions Panel */}
                    <div className="flex-1 bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-6 overflow-hidden">
                        <motion.div
                            key={currentTopic.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.25 }}
                        >
                            <div className="mb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                                <div className="min-w-0">
                                    <h3 className="text-lg sm:text-xl font-bold text-white truncate">{currentTopic.title}</h3>
                                    <p className="text-gray-400 text-[10px] sm:text-xs mt-1 line-clamp-1">{currentTopic.description}</p>
                                </div>
                                <span className="text-[10px] sm:text-xs text-gray-500 shrink-0">{topicCompleted}/{currentTopic.questions.length}</span>
                            </div>

                            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                                {currentTopic.questions.map((q, index) => {
                                    const isCompleted = completedIds.has(q.id);
                                    return (
                                        <div
                                            key={q.id}
                                            className={`group flex items-center gap-3 border p-3 rounded-xl cursor-pointer transition-all ${isCompleted
                                                ? 'bg-zinc-800/80 border-primary/25'
                                                : 'bg-black border-white/5 hover:border-primary/50 hover:bg-white/[0.02]'
                                                }`}
                                        >
                                            {/* Checkbox */}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); toggleComplete(q.id); }}
                                                className={`shrink-0 w-6 h-6 rounded border flex items-center justify-center transition-colors ${isCompleted ? 'bg-primary border-primary' : 'border-zinc-600 hover:border-primary'
                                                    }`}
                                            >
                                                {isCompleted && (
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="black" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </button>

                                            <span className="text-xs text-gray-600 w-4 text-center shrink-0">{index + 1}</span>

                                            <span className={`flex-1 text-sm font-medium truncate ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-200 group-hover:text-white'}`}>
                                                {q.title}
                                            </span>

                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${q.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400' :
                                                q.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' :
                                                    'bg-red-500/10 text-red-400'
                                                }`}>
                                                {q.difficulty}
                                            </span>

                                            <button
                                                onClick={(e) => { e.stopPropagation(); setSelectedQuestion(q); }}
                                                className="shrink-0 p-1.5 rounded-lg bg-zinc-800 text-gray-400 group-hover:text-primary group-hover:bg-primary/10 transition-colors"
                                                title="View Solutions"
                                            >
                                                <Code2 size={14} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Solution Modal rendered locally - Lazy loaded */}
            <React.Suspense fallback={null}>
                <SolutionViewerModal
                    isOpen={!!selectedQuestion}
                    onClose={() => setSelectedQuestion(null)}
                    question={selectedQuestion}
                />
            </React.Suspense>
        </>
    );
};

export default DSATrackerPanel;
