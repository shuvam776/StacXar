import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import type { DSAQuestion } from '../../data/dsaQuestions';
import type { ProgrammingLanguage } from '../../services/solutionFetcher';
import { fetchSolutions, type FetchedSolution } from '../../services/solutionFetcher';
import { X, ExternalLink, Code2, Loader2 } from 'lucide-react';

interface SolutionViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    question: DSAQuestion | null;
}

const LANGUAGES: { id: ProgrammingLanguage; label: string; monacoId: string }[] = [
    { id: 'cpp', label: 'C++', monacoId: 'cpp' },
    { id: 'java', label: 'Java', monacoId: 'java' },
    { id: 'python', label: 'Python', monacoId: 'python' },
    { id: 'javascript', label: 'JavaScript', monacoId: 'javascript' },
];

const SolutionViewerModal: React.FC<SolutionViewerModalProps> = ({ isOpen, onClose, question }) => {
    const [activeLang, setActiveLang] = useState<ProgrammingLanguage>('cpp');
    const [solutions, setSolutions] = useState<FetchedSolution[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch solutions whenever the question changes
    useEffect(() => {
        if (!question || !isOpen) return;

        // Reset state
        setSolutions([]);
        setLoading(true);

        const slug = question.leetcodeSlug ?? question.leetcodeUrl?.split('/problems/')[1]?.replace(/\/$/, '') ?? '';
        const num = question.leetcodeNumber ?? 0;

        fetchSolutions(question.title, num, slug)
            .then(setSolutions)
            .finally(() => setLoading(false));
    }, [question?.id, isOpen]);

    if (!question) return null;

    const currentSolution = solutions.find(s => s.language === activeLang);
    const activeMonacoLang = LANGUAGES.find(l => l.id === activeLang)?.monacoId || 'cpp';

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />

                    {/* Modal Window */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed inset-0 md:inset-10 z-50 flex flex-col bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 md:p-6 border-b border-white/10 bg-zinc-900/50">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="text-xl md:text-2xl font-bold text-white">{question.title}</h2>
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${question.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                                        question.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                            'bg-red-500/20 text-red-400'
                                        }`}>
                                        {question.difficulty}
                                    </span>
                                </div>
                                <div className="flex gap-4">
                                    {question.leetcodeUrl && (
                                        <a href={question.leetcodeUrl} target="_blank" rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-sm text-primary hover:underline">
                                            <Code2 size={14} /> LeetCode
                                        </a>
                                    )}
                                    {question.gfgUrl && (
                                        <a href={question.gfgUrl} target="_blank" rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-sm text-green-500 hover:underline">
                                            <ExternalLink size={14} /> GeeksforGeeks
                                        </a>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 md:relative md:top-auto md:right-auto p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Language Tabs */}
                        <div className="flex bg-zinc-900 border-b border-white/5 overflow-x-auto">
                            {LANGUAGES.map((lang) => (
                                <button
                                    key={lang.id}
                                    onClick={() => setActiveLang(lang.id)}
                                    className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeLang === lang.id
                                        ? 'border-primary text-primary bg-primary/5'
                                        : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'
                                        }`}
                                >
                                    {lang.label}
                                </button>
                            ))}
                        </div>

                        {/* Editor Area */}
                        <div className="flex-1 relative bg-[#1e1e1e]">
                            {loading ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-400">
                                    <Loader2 size={32} className="animate-spin text-primary" />
                                    <p className="text-sm">Fetching solution from NeetCode...</p>
                                </div>
                            ) : !currentSolution ? (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                                    Solution unavailable.
                                </div>
                            ) : (
                                <Editor
                                    height="100%"
                                    theme="vs-dark"
                                    language={activeMonacoLang}
                                    value={currentSolution.code}
                                    options={{
                                        readOnly: true,
                                        minimap: { enabled: false },
                                        fontSize: 14,
                                        padding: { top: 20 },
                                        scrollBeyondLastLine: false,
                                        wordWrap: 'on',
                                        domReadOnly: true,
                                    }}
                                />
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default SolutionViewerModal;
