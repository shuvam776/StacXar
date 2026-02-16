import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SubTopic, Resource } from '../../data/dsaData';

interface ResourceSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    subtopic: SubTopic | null;
    completedResourceIds: string[];
    onToggleResource: (subtopicId: string, resourceId: string, totalCount: number) => void;
}

const ResourceSidebar: React.FC<ResourceSidebarProps> = ({ isOpen, onClose, subtopic, completedResourceIds, onToggleResource }) => {
    // Optimization: Create Set for O(1) lookup
    const completedSet = useMemo(() => new Set(completedResourceIds), [completedResourceIds]);

    if (!subtopic) return null;

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
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />

                    {/* Sidebar Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-zinc-900 border-l border-white/10 z-50 p-6 shadow-2xl overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">{subtopic.title}</h2>
                                <p className="text-gray-400 text-sm">{subtopic.description}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Resources List */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Learning Resources</h3>

                            {subtopic.resources.length === 0 ? (
                                <p className="text-gray-500 italic">No resources available yet.</p>
                            ) : (
                                subtopic.resources.map((resource) => (
                                    <ResourceItem
                                        key={resource.id}
                                        resource={resource}
                                        isCompleted={completedSet.has(resource.id)}
                                        onToggle={() => onToggleResource(subtopic.id, resource.id, subtopic.resources.length)}
                                    />
                                ))
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

// Helper sub-component for individual resource item
const ResourceItem: React.FC<{ resource: Resource; isCompleted: boolean; onToggle: () => void }> = ({ resource, isCompleted, onToggle }) => {
    // Determine icon based on type
    const getIcon = (type: string) => {
        switch (type) {
            case 'video':
                return (
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'leetcode':
                return (
                    <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.173 5.798a1.372 1.372 0 0 0-.167 1.687l5.368 8.169a1.37 1.37 0 0 0 1.687.167l5.36-4.349a1.37 1.37 0 0 0 .438-.962 1.37 1.37 0 0 0-.438-.96l-5.36-4.349a1.37 1.37 0 0 0-.962-.439h-.616zm-5.617 7.008a1.37 1.37 0 0 0-.962.438L1.543 12.809a1.37 1.37 0 0 0 .167 1.687l5.368 8.169a1.37 1.37 0 0 0 1.687.167l5.36-4.349c.563-.457.69-1.25.293-1.808l-5.368-8.17a1.37 1.37 0 0 0-.962-.438h-.129zm10.748 4.295c-.352 0-.704.134-.962.438l-5.36 4.349a1.37 1.37 0 0 0-.167 1.687l5.368 8.169c.397.558 1.19.684 1.808.293l5.36-4.349a1.37 1.37 0 0 0 .438-.962 1.37 1.37 0 0 0-.438-.96l-5.36-4.349a1.372 1.372 0 0 0-.687-.316z" />
                    </svg>
                );
            default: // codeforces or article
                return (
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                );
        }
    };

    return (
        <div className={`
            flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer group
            ${isCompleted ? 'bg-zinc-800/50 border-primary/30' : 'bg-black border-white/5 hover:border-white/20'}
        `}
            onClick={onToggle}
        >
            <div className={`
                flex-shrink-0 w-6 h-6 rounded border flex items-center justify-center transition-colors
                ${isCompleted ? 'bg-primary border-primary text-black' : 'bg-transparent border-zinc-600 group-hover:border-primary'}
            `}>
                {isCompleted && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-medium truncate ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-200'}`}>
                    {resource.title}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                    {getIcon(resource.type)}
                    <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline truncate"
                        onClick={(e) => e.stopPropagation()} // Prevent toggling when clicking link
                    >
                        Open Link
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ResourceSidebar;

