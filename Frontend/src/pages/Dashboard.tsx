
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { auth } from '../firebase/firebase';
import LoadingSpinner from '../components/LoadingSpinner';
import Footer from '../components/Footer';
import { CardContainer, CardBody, CardItem } from "../components/ui/3d-card";
import { SparklesCore } from "../components/ui/sparkles";
import { CometCard } from "../components/ui/comet-card";

// --- Memoized Sub-components ---
const InterviewTrajectory = React.memo(({ lc, cf, mastered, months }: { lc: number, cf: number, mastered: number, months: number }) => {
    const { pathD, areaD, points, step, height } = React.useMemo(() => {
        const total = lc + cf + mastered * 5;
        const pts = Array.from({ length: 7 }).map((_, i) => {
            return Math.min(100, (total / (100 + (i * 50))) * 100 + (i === 6 ? 0 : Math.random() * 10));
        });
        const width = 100;
        const ht = 100;
        const stp = width / (pts.length - 1);
        const pD = pts.map((p, i) => {
            const x = i * stp;
            const y = ht - (p / 100) * ht;
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ');
        const aD = `${pD} L ${width} ${ht} L 0 ${ht} Z`;
        return { pathD: pD, areaD: aD, points: pts, step: stp, height: ht };
    }, [lc, cf, mastered]);

    return (
        <motion.div
            whileHover={{ scale: 1.02, rotateY: 5, rotateX: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="md:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-2xl"
        >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-yellow-500 to-red-500 opacity-50"></div>
            <h3 className="text-lg font-bold mb-4">Interview Trajectory</h3>
            <div className="flex items-end gap-2 h-24 mb-4">
                <div className="relative w-full h-full">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                        <defs>
                            <linearGradient id="gradient-trajectory" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#eab308" stopOpacity="0.5" />
                                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <motion.path d={areaD} fill="url(#gradient-trajectory)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} />
                        <motion.path d={pathD} fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeInOut" }} />
                        {points.map((p, i) => (
                            <motion.circle key={i} cx={i * step} cy={height - (p / 100) * height} r="2" fill="#fff" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1 + i * 0.1 }} />
                        ))}
                    </svg>
                    <div className="absolute bottom-0 w-full flex justify-between text-[8px] text-gray-500 font-mono mt-2 transform translate-y-4">
                        {points.map((_, i) => <span key={i}>M{i + 1}</span>)}
                    </div>
                </div>
            </div>
            <div className="flex justify-between items-center text-xs font-mono text-gray-500 bg-black/30 p-3 rounded-lg">
                <span>ESTIMATED READINESS</span>
                <span className="text-white font-bold">{months || 6} Months</span>
            </div>
        </motion.div>
    );
});

InterviewTrajectory.displayName = 'InterviewTrajectory';

const StartupReadiness = React.memo(({ readiness, nextMilestone }: { readiness: string, nextMilestone: string }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02, rotateY: 5, rotateX: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="md:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-2xl"
        >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-green-500 opacity-50"></div>
            <h3 className="text-lg font-bold mb-4">Startup Readiness</h3>
            <div className="relative h-4 bg-white/5 rounded-full overflow-hidden mb-6">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: readiness === 'Startup-Ready' ? '90%' : (readiness === 'Product-Capable' ? '60%' : '30%') }}
                    className="h-full bg-blue-500"
                ></motion.div>
            </div>
            <div className="flex justify-between items-center text-xs font-mono text-gray-500 bg-black/30 p-3 rounded-lg">
                <span>NEXT MILESTONE</span>
                <span className="text-white font-bold">{nextMilestone || 'Build Portfolio'}</span>
            </div>
        </motion.div>
    );
});

StartupReadiness.displayName = 'StartupReadiness';

const API_BASE = import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL}/api/v1` : 'http://localhost:5000/api/v1';

// --- Interfaces ---
interface LeetCodeStats { solved: number; easy: number; medium: number; hard: number; ranking: number; }
interface CodeforcesStats { rating: number; rank: string; solved: number; }
interface CodeChefStats { rating: number; stars: number; solved: number; }
interface GitHubStats { publicRepos: number; topRepos: { name: string; stars: number; url: string }[]; languages: string[]; avatar?: string; }

interface RankingData {
    rank: number;
    totalUsers: number;
    tier: string;
    score: number;
    breakdown: {
        dsa: number;
        cp: number;
        github: number;
    }
}

interface DsaDashboardData {
    user: { leetcodeUsername: string | null; codeforcesUsername: string | null; codechefUsername: string | null; };
    stats: { leetcode: LeetCodeStats | null; codeforces: CodeforcesStats | null; codechef: CodeChefStats | null; };
    ranking: RankingData | null;
    internal: { mastered: number; totalActive: number; projection: { monthsToInterview: number; readiness: string; } };
}

interface WebDevDashboardData {
    user: { githubUsername: string | null; linkedinUrl: string | null; };
    stats: { github: GitHubStats | null; deployedProjectsCount: number; };
    ranking: RankingData | null;
    internal: { mastered: number; totalActive: number; projection: { readiness: string; nextMilestone: string; } };
}

const Dashboard: React.FC = () => {
    const [dsaData, setDsaData] = useState<DsaDashboardData | null>(null);
    const [webDevData, setWebDevData] = useState<WebDevDashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState<{ type: 'leetcode' | 'codeforces' | 'github'; value: string; section?: 'dsa' | 'stats' | 'webdev' } | null>(null);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

    const user = auth.currentUser;

    const fetchData = async (silent = false) => {
        if (!user) return;
        if (!silent) setLoading(true);
        try {
            const [dsaRes, webRes] = await Promise.all([
                fetch(`${API_BASE}/dashboard/dsa`, { headers: { 'user-email': user.email || '' } }),
                fetch(`${API_BASE}/dashboard/webdev`, { headers: { 'user-email': user.email || '' } })
            ]);

            if (dsaRes.ok) setDsaData(await dsaRes.json());
            if (webRes.ok) setWebDevData(await webRes.json());

        } catch (error) {
            console.error("Dashboard data fetch error", error);
        } finally {
            if (!silent) setLoading(false);
        }
    };

    useEffect(() => {
        console.log("Dashboard mounted, fetching initial data for:", user?.email);
        fetchData();
    }, [user]);

    const handleSaveId = React.useCallback(async () => {
        if (!editMode || !user) return;
        setSaveStatus('saving');
        try {
            const formData = new FormData();
            formData.append(editMode.type === 'github' ? 'githubUsername' : (editMode.type === 'leetcode' ? 'leetcodeUsername' : 'codeforcesUsername'), editMode.value);

            const res = await fetch(`${API_BASE}/profile/update`, {
                method: 'POST',
                headers: {
                    'user-email': user.email || ''
                },
                body: formData
            });
            if (res.ok) {
                setSaveStatus('success');
                setTimeout(() => {
                    setEditMode(null);
                    setSaveStatus('idle');
                    fetchData(true); // Silent refresh
                }, 1500);
            } else {
                setSaveStatus('error');
            }
        } catch (err) {
            setSaveStatus('error');
        }
    }, [editMode, user]);

    const handleEditStart = React.useCallback((type: 'leetcode' | 'codeforces' | 'github') => {
        setEditMode({ type, value: '' });
    }, []);

    const handleEditCancel = React.useCallback(() => {
        setEditMode(null);
    }, []);

    const handleEditChange = React.useCallback((value: string) => {
        setEditMode(prev => prev ? { ...prev, value } : null);
    }, []);

    if (loading && !dsaData) return <LoadingSpinner />;

    // --- Memoized Helper Components for Empty States ---
    const EditForm = React.memo(({ value, type, onCancel, onChange, onSave, status }: {
        value: string,
        type: 'leetcode' | 'codeforces' | 'github',
        onCancel: () => void,
        onChange: (val: string) => void,
        onSave: () => void,
        status: 'idle' | 'saving' | 'success' | 'error'
    }) => {
        const isSuccess = status === 'success';

        return (
            <div className="flex flex-col gap-2 w-full h-full justify-center relative">
                {isSuccess && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute inset-0 z-10 bg-zinc-900 flex flex-col items-center justify-center rounded-xl"
                    >
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-2">
                            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <span className="text-green-500 font-bold text-sm">Connected!</span>
                    </motion.div>
                )}

                <input
                    className={`bg-zinc-900 text-white border ${status === 'error' ? 'border-red-500' : 'border-white/10'} rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-primary transition-colors`}
                    value={value || ''}
                    onChange={e => onChange(e.target.value)}
                    autoFocus
                    placeholder={`Enter ${type} username...`}
                    disabled={status === 'saving' || isSuccess}
                />
                <div className="flex gap-2">
                    <button
                        onClick={onSave}
                        disabled={status === 'saving' || isSuccess}
                        className="p-2 sm:px-4 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex flex-1 justify-center items-center gap-2 shadow-[0_0_10px_rgba(22,163,74,0.3)]"
                        title="Save"
                    >
                        {status === 'saving' ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                <span className="hidden sm:inline font-bold">Submit</span>
                            </>
                        )}
                    </button>
                    <button
                        onClick={onCancel}
                        disabled={status === 'saving' || isSuccess}
                        className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 flex flex-1 justify-center items-center"
                        title="Cancel"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            </div>
        );
    });

    const AddIdCard = React.memo(({ title, type, icon, editMode, onCancel, onEdit, onSave, onChange, saveStatus }: {
        title: string,
        type: 'leetcode' | 'codeforces' | 'github',
        icon: React.ReactNode,
        editMode: { type: string, value: string } | null,
        onCancel: () => void,
        onEdit: (type: 'leetcode' | 'codeforces' | 'github') => void,
        onSave: () => void,
        onChange: (val: string) => void,
        saveStatus: 'idle' | 'saving' | 'success' | 'error'
    }) => (
        <motion.div
            whileHover={{ scale: 1.02, rotateY: 5, rotateX: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl flex flex-col justify-center items-center h-48 group hover:border-primary/30 transition-all shadow-2xl relative"
        >
            {editMode?.type === type ? (
                <EditForm
                    value={editMode.value}
                    type={type}
                    onCancel={onCancel}
                    onChange={onChange}
                    onSave={onSave}
                    status={saveStatus}
                />
            ) : (
                <>
                    <div className="p-3 bg-white/5 rounded-full mb-3 group-hover:scale-110 transition-transform">{icon}</div>
                    <h3 className="text-gray-400 font-bold mb-4">{title}</h3>
                    <button
                        onClick={() => onEdit(type)}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        Add {type.charAt(0).toUpperCase() + type.slice(1)} ID
                    </button>
                </>
            )}
        </motion.div>
    ));

    const StatCard = React.memo(({ label, value, color }: { label: string, value: string | number, color: string }) => (
        <motion.div
            whileHover={{ scale: 1.02, rotateY: 5, rotateX: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl flex flex-col justify-between h-48 shadow-2xl"
        >
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{label}</div>
            <div className={`text-4xl font-black text-${color}-400`}>{value}</div>
        </motion.div>
    ));

    return (
        <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">

            <div className="pt-32 pb-24 px-8 max-w-7xl mx-auto">
                {/* Dashboard Header with Sparkles */}
                <div className="relative h-48 md:h-64 w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-3xl mb-8 border border-white/10">
                    <div className="w-full absolute inset-0 h-screen">
                        <SparklesCore
                            id="dashboard-sparkles"
                            background="transparent"
                            minSize={0.6}
                            maxSize={1.4}
                            particleDensity={100}
                            className="w-full h-full"
                            particleColor="#FFD700"
                        />
                    </div>
                    <div className="relative z-20 flex flex-col items-center text-center px-4">
                        <h1 className="md:text-7xl text-4xl lg:text-9xl font-bold text-center text-white relative z-20 tracking-tighter uppercase italic">
                            DASH<span className="text-primary italic">BOARD</span>
                        </h1>
                        <p className="text-gray-400 text-sm md:text-lg mt-2 font-medium">
                            Welcome back, <span className="text-white font-bold">{user?.displayName || 'Builder'}</span>!
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                    {/* Global Ranking Card with Comet-Card */}
                    {dsaData?.ranking && (
                        <CometCard className="lg:col-span-3">
                            <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                                <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                                    <div className="text-center md:text-left">
                                        <div className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-2">Global Standing</div>
                                        <div className="text-6xl md:text-8xl font-black text-white tracking-tighter">
                                            #{dsaData.ranking.rank}
                                            <span className="text-2xl text-gray-500 ml-4 font-bold tracking-normal opacity-50 uppercase">
                                                Rank
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-12 items-center">
                                        <div className="text-center">
                                            <div className="text-gray-500 text-xs font-bold uppercase mb-1 tracking-widest">Total Score</div>
                                            <div className="text-3xl font-black text-primary">{Math.round(dsaData.ranking.score)}</div>
                                        </div>
                                        <div className="h-12 w-px bg-white/10"></div>
                                        <div className="text-center">
                                            <div className="text-gray-500 text-xs font-bold uppercase mb-1 tracking-widest">Global Tier</div>
                                            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-black uppercase tracking-wider">
                                                {dsaData.ranking.tier}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CometCard>
                    )}
                </div>

                {/* --- DSA INTELLIGENCE PANEL --- */}
                <section className="mb-16">
                    <div className="flex items-center gap-4 mb-6">
                        <h2 className="text-2xl font-black flex items-center gap-2">
                            <span className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></span>
                            DSA Intelligence
                        </h2>
                        <div className="h-px bg-white/10 flex-grow"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                        {/* LeetCode Card with 3D effect */}
                        {editMode?.type === 'leetcode' && editMode?.section === 'dsa' ? (
                            <div className="p-6 bg-zinc-900/50 border border-white/10 rounded-3xl h-48 flex items-center justify-center">
                                <EditForm
                                    value={editMode.value}
                                    type="leetcode"
                                    onCancel={handleEditCancel}
                                    onChange={handleEditChange}
                                    onSave={handleSaveId}
                                    status={saveStatus}
                                />
                            </div>
                        ) : dsaData?.user.leetcodeUsername ? (
                            <CardContainer className="inter-var py-0" containerClassName="py-0 block">
                                <CardBody className="bg-white/5 group/card border-white/10 w-full md:w-[280px] h-48 rounded-3xl p-6 border shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-24 bg-yellow-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <CardItem translateZ="50">
                                            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">LeetCode</div>
                                        </CardItem>
                                        <CardItem translateZ="50">
                                            <button
                                                onClick={() => setEditMode({ type: 'leetcode', value: dsaData?.user?.leetcodeUsername || '', section: 'dsa' })}
                                                className="text-gray-600 hover:text-white transition-colors opacity-100 sm:opacity-0 group-hover/card:opacity-100"
                                                title="Edit Username"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                            </button>
                                        </CardItem>
                                    </div>
                                    <CardItem translateZ="100" className="mt-4">
                                        <div className="text-4xl font-black text-white mb-2">{dsaData.stats.leetcode?.solved || 0}</div>
                                        <div className="text-xs text-gray-400 mb-4 font-bold">Problems Solved</div>
                                    </CardItem>
                                    <CardItem translateZ="80" className="flex gap-2 text-[10px] font-mono uppercase">
                                        <span className="bg-green-500/20 text-green-500 px-2 py-1 rounded">E: {dsaData.stats.leetcode?.easy}</span>
                                        <span className="bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded">M: {dsaData.stats.leetcode?.medium}</span>
                                        <span className="bg-red-500/20 text-red-500 px-2 py-1 rounded">H: {dsaData.stats.leetcode?.hard}</span>
                                    </CardItem>
                                </CardBody>
                            </CardContainer>
                        ) : (
                            <AddIdCard
                                title="Connect LeetCode"
                                type="leetcode"
                                icon={<svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 24 24"><path d="M13.483 0a1.374 1.374 0 0 0-.961.414l-11.71 11.59a1.374 1.374 0 0 0 0 1.956l11.71 11.59a1.374 1.374 0 0 0 1.922 0l1.71-1.69a1.374 1.374 0 0 0 0-1.956l-9.043-8.948h14.072A1.374 1.374 0 0 0 24 11.59V9.41a1.374 1.374 0 0 0-1.374-1.374H8.12l9.043-8.948a1.374 1.374 0 0 0 0-1.956L15.45.414A1.374 1.374 0 0 0 14.483 0z" /></svg>}
                                editMode={editMode}
                                onCancel={handleEditCancel}
                                onEdit={handleEditStart}
                                onSave={handleSaveId}
                                onChange={handleEditChange}
                                saveStatus={saveStatus}
                            />
                        )}

                        {/* Codeforces Card with 3D effect */}
                        {editMode?.type === 'codeforces' && editMode?.section === 'dsa' ? (
                            <div className="p-6 bg-zinc-900/50 border border-white/10 rounded-3xl h-48 flex items-center justify-center">
                                <EditForm
                                    value={editMode.value}
                                    type="codeforces"
                                    onCancel={handleEditCancel}
                                    onChange={handleEditChange}
                                    onSave={handleSaveId}
                                    status={saveStatus}
                                />
                            </div>
                        ) : dsaData?.user.codeforcesUsername ? (
                            <CardContainer className="inter-var py-0" containerClassName="py-0 block">
                                <CardBody className="bg-white/5 group/card border-white/10 w-full md:w-[280px] h-48 rounded-3xl p-6 border shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-24 bg-blue-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <CardItem translateZ="50">
                                            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Codeforces</div>
                                        </CardItem>
                                        <CardItem translateZ="50">
                                            <button
                                                onClick={() => setEditMode({ type: 'codeforces', value: dsaData?.user?.codeforcesUsername || '', section: 'dsa' })}
                                                className="text-gray-600 hover:text-white transition-colors opacity-0 group-hover/card:opacity-100"
                                                title="Edit Username"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                            </button>
                                        </CardItem>
                                    </div>
                                    <CardItem translateZ="100" className="mt-4">
                                        <div className="text-4xl font-black text-white mb-2">{dsaData.stats.codeforces?.rating || 'Unrated'}</div>
                                        <div className="text-xs text-blue-400 mb-1 font-bold">{dsaData.stats.codeforces?.rank || 'Newbie'}</div>
                                    </CardItem>
                                    <CardItem translateZ="60" className="mt-4">
                                        <div className="text-xs text-gray-500">{dsaData.stats.codeforces?.solved || 0} Solved</div>
                                    </CardItem>
                                </CardBody>
                            </CardContainer>
                        ) : (
                            <AddIdCard
                                title="Connect Codeforces"
                                type="codeforces"
                                icon={<svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M4.5 7.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zM0 12l2.25-3h19.5L24 12l-2.25 3H2.25L0 12z" /></svg>}
                                editMode={editMode}
                                onCancel={handleEditCancel}
                                onEdit={handleEditStart}
                                onSave={handleSaveId}
                                onChange={handleEditChange}
                                saveStatus={saveStatus}
                            />
                        )}

                        <InterviewTrajectory
                            lc={dsaData?.stats.leetcode?.solved || 0}
                            cf={dsaData?.stats.codeforces?.solved || 0}
                            mastered={dsaData?.internal.mastered || 0}
                            months={dsaData?.internal?.projection?.monthsToInterview || 6}
                        />
                    </div>
                </section>

                <section className="mb-16">
                    <div className="flex items-center gap-4 mb-6">
                        <h2 className="text-2xl font-black flex items-center gap-2">
                            <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
                            Competitive Programming Stats
                        </h2>
                        <div className="h-px bg-white/10 flex-grow"></div>
                    </div>
                    <div>
                        {editMode?.type === 'codeforces' && !dsaData?.stats?.codeforces ? (
                            <div className="p-6 bg-zinc-900/50 border border-white/10 rounded-3xl h-48 flex items-center justify-center">
                                <EditForm
                                    value={editMode.value}
                                    type="codeforces"
                                    onCancel={handleEditCancel}
                                    onChange={handleEditChange}
                                    onSave={handleSaveId}
                                    status={saveStatus}
                                />
                            </div>
                        ) : dsaData?.stats?.codeforces ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 group">
                                <StatCard label="Current Rating" value={dsaData.stats.codeforces.rating} color="blue" />
                                <StatCard label="Rank" value={dsaData.stats.codeforces.rank} color="cyan" />
                                <StatCard label="Solved Problems" value={dsaData.stats.codeforces.solved} color="blue" />
                                <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl group/cf-card hover:border-blue-500/30 transition-all flex flex-col justify-center items-center h-48 relative overflow-hidden">
                                    <button
                                        onClick={() => setEditMode({ type: 'codeforces', value: dsaData?.user?.codeforcesUsername || '', section: 'stats' })}
                                        className="absolute top-4 right-4 text-gray-600 hover:text-white transition-colors opacity-100 sm:opacity-0 group-hover:opacity-100 z-20"
                                        title="Edit Handle"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    </button>
                                    {editMode?.type === 'codeforces' && editMode?.section === 'stats' ? (
                                        <div className="w-full relative z-10">
                                            <EditForm
                                                value={editMode.value}
                                                type="codeforces"
                                                onCancel={handleEditCancel}
                                                onChange={handleEditChange}
                                                onSave={handleSaveId}
                                                status={saveStatus}
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Platform</div>
                                            <div className="text-xl font-black text-blue-400">CODEFORCES</div>
                                            <div className="text-[10px] font-mono text-blue-500/60 mt-2">{dsaData.user.codeforcesUsername}</div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center p-12 bg-white/5 rounded-3xl border border-white/10 text-gray-500 font-bold uppercase tracking-widest">
                                Connect Codeforces to see stats
                            </div>
                        )}
                    </div>
                </section>



                {/* --- WEB DEV INTELLIGENCE PANEL --- */}
                <section>
                    <div className="flex items-center gap-4 mb-6">
                        <h2 className="text-2xl font-black flex items-center gap-2">
                            <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
                            Product Engineering
                        </h2>
                        <div className="h-px bg-white/10 flex-grow"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                        {/* GitHub Card with 3D effect */}
                        {editMode?.type === 'github' ? (
                            <div className="p-6 bg-zinc-900/50 border border-white/10 rounded-3xl h-48 flex items-center justify-center">
                                <EditForm
                                    value={editMode.value}
                                    type="github"
                                    onCancel={handleEditCancel}
                                    onChange={handleEditChange}
                                    onSave={handleSaveId}
                                    status={saveStatus}
                                />
                            </div>
                        ) : webDevData?.user.githubUsername ? (
                            <CardContainer className="inter-var py-0" containerClassName="py-0 block">
                                <CardBody className="bg-white/5 group/card border-white/10 w-full md:w-[280px] h-48 rounded-3xl p-6 border shadow-2xl relative overflow-hidden flex flex-col justify-between">
                                    <div className="absolute top-0 right-0 p-24 bg-purple-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                                    <div className="flex justify-between items-start mb-2 relative z-10 w-full">
                                        <CardItem translateZ="50" className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                                                {webDevData?.stats?.github?.avatar ? (
                                                    <img src={webDevData.stats.github.avatar} alt="GH" className="w-full h-full object-cover" />
                                                ) : (
                                                    <svg className="w-full h-full p-2 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                                                )}
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">GitHub</div>
                                                <div className="text-[10px] font-mono text-primary/80 truncate max-w-[80px]">{webDevData.user.githubUsername}</div>
                                            </div>
                                        </CardItem>
                                        <CardItem translateZ="50">
                                            <button
                                                onClick={() => setEditMode({ type: 'github', value: webDevData?.user?.githubUsername || '', section: 'webdev' })}
                                                className="text-gray-600 hover:text-white transition-colors opacity-100 sm:opacity-0 group-hover/card:opacity-100"
                                                title="Edit Username"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                            </button>
                                        </CardItem>
                                    </div>
                                    <CardItem translateZ="100" className="flex items-baseline gap-2">
                                        <div className="text-3xl font-black text-white">{webDevData?.stats?.github?.publicRepos || 0}</div>
                                        <div className="text-[10px] text-gray-400 mb-3 font-bold uppercase">Repos</div>
                                    </CardItem>
                                    <CardItem translateZ="60" className="space-y-1 w-full">
                                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">Top Starred</div>
                                        <div className="flex gap-1 overflow-x-hidden">
                                            {webDevData?.stats?.github?.topRepos?.slice(0, 2).map(repo => (
                                                <a href={repo.url} target="_blank" rel="noopener noreferrer" key={repo.name} className="flex-1 truncate text-[10px] bg-white/5 hover:bg-white/10 px-2 py-1 rounded transition-colors text-gray-300 border border-white/5">
                                                    {repo.name}
                                                </a>
                                            ))}
                                        </div>
                                    </CardItem>
                                </CardBody>
                            </CardContainer>
                        ) : (
                            <AddIdCard
                                title="Connect GitHub"
                                type="github"
                                icon={<svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>}
                                editMode={editMode}
                                onCancel={handleEditCancel}
                                onEdit={handleEditStart}
                                onSave={handleSaveId}
                                onChange={handleEditChange}
                                saveStatus={saveStatus}
                            />
                        )}

                        {/* Projects Status with 3D effect */}
                        <CardContainer className="inter-var py-0" containerClassName="py-0 block">
                            <CardBody className="bg-white/5 group/card border-white/10 w-full md:w-[280px] h-48 rounded-3xl p-6 border shadow-2xl relative overflow-hidden flex flex-col justify-between">
                                <CardItem translateZ="50">
                                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Projects</div>
                                    <div className="text-4xl font-black text-white">{webDevData?.stats.deployedProjectsCount || 0}</div>
                                    <div className="text-xs text-gray-400 font-bold">Deployed & Verified</div>
                                </CardItem>
                                <CardItem translateZ="80" className="w-full">
                                    <div className="text-xs text-blue-400 bg-blue-500/10 p-2 rounded-lg text-center font-black uppercase tracking-wider border border-blue-500/20">
                                        {webDevData?.internal.projection.readiness || 'Beginner'}
                                    </div>
                                </CardItem>
                            </CardBody>
                        </CardContainer>

                        <StartupReadiness
                            readiness={webDevData?.internal.projection.readiness || 'Beginner'}
                            nextMilestone={webDevData?.internal.projection.nextMilestone || 'Build Portfolio'}
                        />
                    </div>
                </section>

            </div >
            <Footer />
        </div >
    );
};

export default Dashboard;
