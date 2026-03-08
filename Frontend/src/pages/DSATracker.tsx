import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Code2, ExternalLink, BookOpen, Search, ChevronDown, X } from 'lucide-react';
import { dsaTrackerData, type DSAQuestion, type DSATopicData } from '../data/dsaQuestions';
import SolutionViewerModal from '../components/dashboard/SolutionViewerModal';

type DifficultyFilter = 'All' | 'Easy' | 'Medium' | 'Hard';

const DSATracker: React.FC = () => {
    const navigate = useNavigate();

    // --- Local State ---
    const [activeTopicId, setActiveTopicId] = useState<string>(dsaTrackerData[0].id);
    const [selectedQuestion, setSelectedQuestion] = useState<DSAQuestion | null>(null);
    const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('All');
    const [sidebarOpen, setSidebarOpen] = useState(false); // For mobile

    // Derived state
    const activeTopic: DSATopicData = useMemo(
        () => dsaTrackerData.find(t => t.id === activeTopicId) ?? dsaTrackerData[0],
        [activeTopicId]
    );

    const filteredQuestions = useMemo(() => {
        return activeTopic.questions.filter(q => {
            const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesDifficulty = difficultyFilter === 'All' || q.difficulty === difficultyFilter;
            return matchesSearch && matchesDifficulty;
        });
    }, [activeTopic, searchQuery, difficultyFilter]);

    const totalCompleted = completedIds.size;
    const totalQuestions = dsaTrackerData.reduce((sum, t) => sum + t.questions.length, 0);
    const topicCompleted = activeTopic.questions.filter(q => completedIds.has(q.id)).length;

    const toggleComplete = (id: string) => {
        setCompletedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const selectTopic = (id: string) => {
        setActiveTopicId(id);
        setSearchQuery('');
        setDifficultyFilter('All');
        setSidebarOpen(false);
    };

    const difficultyColor = {
        Easy: 'text-green-400 bg-green-400/10',
        Medium: 'text-yellow-400 bg-yellow-400/10',
        Hard: 'text-red-400 bg-red-400/10',
    };

    // Sidebar contents — shared between desktop aside and mobile drawer
    const SidebarContent = () => (
        <>
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Topics</h2>
            <div className="space-y-2">
                {dsaTrackerData.map(topic => {
                    const done = topic.questions.filter(q => completedIds.has(q.id)).length;
                    const pct = Math.round((done / topic.questions.length) * 100);
                    const isActive = topic.id === activeTopicId;
                    return (
                        <motion.button
                            key={topic.id}
                            onClick={() => selectTopic(topic.id)}
                            whileHover={{ x: 4 }}
                            className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${isActive
                                ? 'bg-primary/10 border-primary/40 text-primary'
                                : 'bg-white/[0.03] border-white/5 text-gray-300 hover:border-white/20 hover:text-white'
                                }`}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-semibold">{topic.title}</span>
                                <span className="text-xs text-gray-500">{done}/{topic.questions.length}</span>
                            </div>
                            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary rounded-full transition-all"
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-black text-white">
            {/* ─── Sticky Header ─── */}
            <div className="border-b border-white/10 bg-black/80 backdrop-blur-xl sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-sm shrink-0"
                        >
                            <ChevronLeft size={18} />
                            <span className="hidden sm:inline">Dashboard</span>
                        </button>
                        <div className="h-5 w-px bg-white/20 shrink-0" />
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                            <Code2 size={18} className="text-primary shrink-0" />
                            <h1 className="text-sm sm:text-base md:text-lg font-bold truncate">Practice Tracker</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Mobile: topic picker button */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden flex items-center gap-1.5 text-sm text-gray-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all"
                        >
                            {activeTopic.title}
                            <ChevronDown size={14} />
                        </button>
                        <div className="text-sm text-gray-400 whitespace-nowrap">
                            <span className="text-white font-bold">{totalCompleted}</span>
                            <span className="hidden sm:inline"> / {totalQuestions} done</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Mobile Sidebar Drawer ─── */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)}
                            className="fixed inset-0 bg-black/70 z-30 md:hidden"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed top-0 left-0 h-full w-[80vw] sm:w-72 bg-zinc-950 border-r border-white/10 z-40 p-6 overflow-y-auto md:hidden"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <span className="font-bold text-white">Topics</span>
                                <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400">
                                    <X size={18} />
                                </button>
                            </div>
                            <SidebarContent />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ─── Body ─── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 flex gap-6">
                {/* Desktop Sidebar */}
                <aside className="hidden md:block w-56 lg:w-64 shrink-0">
                    <SidebarContent />
                </aside>

                {/* Main Content */}
                <main className="flex-1 min-w-0">
                    {/* Topic Header + Progress */}
                    <div className="mb-5">
                        <div className="flex items-center justify-between mb-1 gap-2">
                            <h2 className="text-xl sm:text-2xl font-black truncate">{activeTopic.title}</h2>
                            <span className="text-sm text-gray-400 shrink-0">
                                {topicCompleted} / {activeTopic.questions.length}
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{activeTopic.description}</p>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-primary rounded-full"
                                animate={{ width: `${Math.round((topicCompleted / activeTopic.questions.length) * 100)}%` }}
                                transition={{ duration: 0.4 }}
                            />
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-5">
                        <div className="relative flex-1 min-w-0">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/50"
                            />
                        </div>
                        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide no-scrollbar">
                            {(['All', 'Easy', 'Medium', 'Hard'] as DifficultyFilter[]).map(diff => (
                                <button
                                    key={diff}
                                    onClick={() => setDifficultyFilter(diff)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border whitespace-nowrap transition-all ${difficultyFilter === diff
                                        ? 'bg-primary/20 border-primary/50 text-primary'
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                                        }`}
                                >
                                    {diff}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Questions List */}
                    <div className="space-y-2">
                        {filteredQuestions.length === 0 ? (
                            <div className="text-center py-16 text-gray-500">
                                <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
                                <p>No questions match your filters.</p>
                            </div>
                        ) : (
                            filteredQuestions.map((question, index) => {
                                const isCompleted = completedIds.has(question.id);
                                return (
                                    <motion.div
                                        key={question.id}
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.025 }}
                                        className={`flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-xl border transition-all group ${isCompleted
                                            ? 'bg-primary/5 border-primary/20'
                                            : 'bg-white/[0.03] border-white/5 hover:border-white/20'
                                            }`}
                                    >
                                        {/* Checkbox */}
                                        <button
                                            onClick={() => toggleComplete(question.id)}
                                            className={`shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded border flex items-center justify-center transition-colors ${isCompleted
                                                ? 'bg-primary border-primary text-white '
                                                : 'border-white/30 hover:border-primary'
                                                }`}
                                        >
                                            {isCompleted && (
                                                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </button>

                                        {/* Index */}
                                        <span className="text-[10px] sm:text-xs text-gray-600 w-4 text-center shrink-0 hidden xs:block">{index + 1}</span>

                                        {/* Title */}
                                        <span className={`flex-1 text-xs sm:text-sm font-medium min-w-0 break-words ${isCompleted ? 'text-gray-500 line-through' : 'text-white'}`}>
                                            {question.title}
                                        </span>

                                        {/* Difficulty */}
                                        <span className={`text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full shrink-0 ${difficultyColor[question.difficulty]}`}>
                                            {question.difficulty.charAt(0)}<span className="hidden sm:inline">{question.difficulty.slice(1)}</span>
                                        </span>

                                        {/* Actions */}
                                        <div className="flex items-center gap-1 transition-opacity shrink-0">
                                            {question.leetcodeUrl && (
                                                <a
                                                    href={question.leetcodeUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-1.5 rounded-lg hover:bg-orange-500/20 text-orange-400 transition-colors"
                                                    title="Open on LeetCode"
                                                >
                                                    <ExternalLink size={14} />
                                                </a>
                                            )}
                                            <button
                                                onClick={() => setSelectedQuestion(question)}
                                                className="p-1.5 rounded-lg hover:bg-primary/20 text-primary transition-colors"
                                                title="View Solution"
                                            >
                                                <Code2 size={14} />
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </div>
                </main>
            </div>

            {/* Solution Modal */}
            <SolutionViewerModal
                isOpen={!!selectedQuestion}
                onClose={() => setSelectedQuestion(null)}
                question={selectedQuestion}
            />
        </div>
    );
};

export default DSATracker;
