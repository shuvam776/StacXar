
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { auth } from '../firebase/firebase';
import { useRoadmapProgress } from '../hooks/useRoadmapProgress';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';

const API_BASE = import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL}/api/v1` : 'http://localhost:5000/api/v1';

interface Project {
    title: string;
    url: string;
    description: string;
}

interface UserProfile {
    fullName: string;
    email: string;
    avatar: string;
    leetcodeUsername: string | null;
    codeforcesUsername: string | null;
    codechefUsername: string | null;
    githubUsername: string | null;
    linkedinUrl: string | null;
    deployedProjects: Project[];
    ranking?: {
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
}

const IdentityItem = React.memo(({ label, value, icon, platform, stats, url, onEdit }: { label: string; value: string | null; icon: React.ReactNode; platform: string; stats?: any; url?: string; onEdit?: () => void }) => (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-primary/30 transition-all group relative overflow-hidden">
        {url && value && (
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-10 cursor-pointer"
                title={`Open ${platform} Profile`}
            />
        )}
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors overflow-hidden relative">
                {stats?.avatar ? (
                    <img src={stats.avatar} alt={platform} className="w-full h-full object-cover" />
                ) : (
                    icon
                )}
            </div>
            <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{label}</p>
                <div className="flex items-center gap-2">
                    <p className="font-mono text-sm md:text-base text-gray-200">{value || 'Not connected'}</p>
                    {onEdit && (
                        <button
                            onClick={(e) => { e.stopPropagation(); e.preventDefault(); onEdit(); }}
                            className="p-1 text-gray-500 hover:text-primary opacity-0 group-hover:opacity-100 transition-all relative z-20"
                            title={`Edit ${label}`}
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
        {value && (
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                <span className="text-[10px] font-black text-gray-500 uppercase">Live</span>
            </div>
        )}
    </div>
));

IdentityItem.displayName = 'IdentityItem';

const ProjectItem = React.memo(({ proj, idx, isEditing, onRemove }: { proj: Project; idx: number; isEditing: boolean; onRemove: (idx: number) => void }) => (
    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 relative group hover:border-white/10 transition-colors">
        {isEditing && (
            <button
                onClick={() => onRemove(idx)}
                className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        )}
        <h4 className="font-bold text-lg text-white mb-1">{proj.title}</h4>
        <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline block mb-2 truncate">{proj.url}</a>
        <p className="text-sm text-gray-400">{proj.description}</p>
    </div>
));

ProjectItem.displayName = 'ProjectItem';

const getTierStyle = (tier: string) => {
    switch (tier) {
        case 'Legend': return 'bg-yellow-500/10 border-yellow-500/50 text-yellow-500';
        case 'Grandmaster': return 'bg-red-500/10 border-red-500/50 text-red-500';
        case 'Master': return 'bg-purple-500/10 border-purple-500/50 text-purple-500';
        case 'Diamond': return 'bg-blue-500/10 border-blue-500/50 text-blue-500';
        case 'Platinum': return 'bg-cyan-500/10 border-cyan-500/50 text-cyan-500';
        case 'Gold': return 'bg-yellow-400/10 border-yellow-400/50 text-yellow-400';
        case 'Silver': return 'bg-gray-400/10 border-gray-400/50 text-gray-400';
        default: return 'bg-orange-700/10 border-orange-700/50 text-orange-700';
    }
}

const Profile: React.FC = () => {
    const { roadmapState: dsaState } = useRoadmapProgress('dsa');
    const { roadmapState: webDevState } = useRoadmapProgress('webdev');
    const { roadmapState: appDevState } = useRoadmapProgress('appdev');
    const user = auth.currentUser;

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<UserProfile | null>(null);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // New Project State
    const [newProject, setNewProject] = useState<Project>({ title: '', url: '', description: '' });

    const [platformStats, setPlatformStats] = useState<any>({});

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            try {
                const res = await fetch(`${API_BASE}/profile`, {
                    headers: { 'user-email': user.email || '' }
                });
                if (res.ok) {
                    const profileData = await res.json();

                    // Fetch DSA & WebDev data for full stats & platform avatars
                    const [dsaRes, webRes] = await Promise.all([
                        fetch(`${API_BASE}/dashboard/dsa`, { headers: { 'user-email': user.email || '' } }),
                        fetch(`${API_BASE}/dashboard/webdev`, { headers: { 'user-email': user.email || '' } })
                    ]);

                    let combinedStats: any = {};
                    if (dsaRes.ok) {
                        const dsaData = await dsaRes.json();
                        profileData.ranking = dsaData.ranking;
                        combinedStats = { ...combinedStats, leetcode: dsaData.stats?.leetcode, codeforces: dsaData.stats?.codeforces };
                    }
                    if (webRes.ok) {
                        const webData = await webRes.json();
                        combinedStats = { ...combinedStats, github: webData.stats?.github };
                    }

                    // LinkedIn stats from local profile data (always available if URL set)
                    if (profileData.linkedinUrl) {
                        combinedStats.linkedin = { avatar: profileData.avatar };
                    }

                    setPlatformStats(combinedStats);
                    setProfile(profileData);
                    setFormData(profileData);
                }
            } catch (err) {
                console.error("Profile fetch error", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user]);

    const handleSave = React.useCallback(async () => {
        if (!formData || !user) return;
        setSaving(true);
        setMessage(null);

        try {
            const uploadFormData = new FormData();
            (Object.keys(formData) as Array<keyof UserProfile>).forEach(key => {
                if (key !== 'ranking' && formData[key] !== null) {
                    if (key === 'deployedProjects') {
                        uploadFormData.append(key, JSON.stringify(formData[key]));
                    } else {
                        uploadFormData.append(key, formData[key] as string);
                    }
                }
            });

            if ((formData as any).avatarFile) {
                uploadFormData.append('avatar', (formData as any).avatarFile);
            }

            const res = await fetch(`${API_BASE}/profile/update`, {
                method: 'POST',
                headers: {
                    'user-email': user.email || ''
                },
                body: uploadFormData
            });

            if (res.ok) {
                const updatedProfile = await res.json();
                setProfile({ ...updatedProfile, ranking: profile?.ranking });
                setIsEditing(false);
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
            } else {
                setMessage({ type: 'error', text: 'Failed to update profile.' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Network error.' });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage(null), 3000);
        }
    }, [formData, user, profile?.ranking]);

    const addProject = React.useCallback(() => {
        if (!formData) return;
        if (!newProject.title || !newProject.url) return;
        const updatedProjects = [...(formData.deployedProjects || []), newProject];
        setFormData({ ...formData, deployedProjects: updatedProjects });
        setNewProject({ title: '', url: '', description: '' });
    }, [formData, newProject]);

    const removeProject = React.useCallback((index: number) => {
        if (!formData) return;
        const updatedProjects = [...(formData.deployedProjects || [])];
        updatedProjects.splice(index, 1);
        setFormData({ ...formData, deployedProjects: updatedProjects });
    }, [formData]);


    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">

            <main className="max-w-7xl mx-auto px-6 pt-32 pb-24">
                {/* Header Section */}
                <section className="relative mb-16 lg:mb-24">
                    <div className="h-48 md:h-64 w-full bg-gradient-to-r from-zinc-900 to-black rounded-[2rem] border border-white/5 overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(255,215,0,0.1),transparent)]"></div>
                    </div>
                    <div className="absolute -bottom-12 left-6 md:left-12 flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-8 w-[calc(100%-3rem)] md:w-auto">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 md:border-8 border-black bg-zinc-800 p-1 shadow-2xl overflow-hidden relative group">
                            <img
                                src={profile?.avatar || user?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=stacxar'}
                                alt="Profile"
                                className="w-full h-full rounded-full object-cover"
                            />
                            {isEditing && (
                                <label className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setFormData({ ...formData!, avatar: reader.result as string, avatarFile: file } as any);
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 011.664.89l.812 1.22A2 2 0 0010.07 10H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </label>
                            )}
                        </div>
                        <div className="mb-0 md:mb-6 text-center md:text-left flex-1">
                            <div className="flex items-center gap-3 mb-1">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData?.fullName || ''}
                                        onChange={(e) => setFormData({ ...formData!, fullName: e.target.value })}
                                        className="text-2xl md:text-4xl font-black tracking-tight bg-white/5 border border-white/10 rounded-xl px-4 py-1 focus:outline-none focus:border-primary w-full max-w-md"
                                        placeholder="Your Full Name"
                                    />
                                ) : (
                                    <h2 className="text-2xl md:text-4xl font-black tracking-tight">{profile?.fullName || user?.displayName}</h2>
                                )}
                                {profile?.ranking && (
                                    <span className="bg-primary text-black text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter">
                                        {profile.ranking.tier}
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-400 font-medium text-sm md:text-base">{user?.email}</p>
                            {profile?.ranking && (
                                <p className="text-xs font-mono text-gray-500 mt-1">
                                    Rank #{profile.ranking.rank} of {profile.ranking.totalUsers} • Score: {profile.ranking.score.toFixed(0)}
                                </p>
                            )}
                        </div>
                        <div className="ml-auto mb-6 flex gap-3">
                            {isEditing && (
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="px-6 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-50 shadow-[0_0_20px_rgba(255,215,0,0.2)]"
                                >
                                    {saving ? (
                                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    )}
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                {/* Identity & Links */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                    <div className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-white/10">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold flex items-center gap-3">
                                <span className="w-2 h-6 bg-primary rounded-full"></span>
                                Identities
                            </h3>
                            {!isEditing && (
                                <button
                                    onClick={() => { setFormData(profile); setIsEditing(true); }}
                                    className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white transition-colors"
                                    title="Edit Identities"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                </button>
                            )}
                        </div>

                        <div className="space-y-4">
                            {isEditing ? (
                                <>
                                    {[
                                        { label: 'LeetCode Username', key: 'leetcodeUsername', placeholder: 'e.g. techwiz' },
                                        { label: 'Codeforces Handle', key: 'codeforcesUsername', placeholder: 'e.g. wizard123' },
                                        { label: 'CodeChef Handle', key: 'codechefUsername', placeholder: 'e.g. chef_master' },
                                        { label: 'GitHub Username', key: 'githubUsername', placeholder: 'e.g. gitninja' },
                                        { label: 'LinkedIn URL', key: 'linkedinUrl', placeholder: 'https://linkedin.com/in/...' },
                                    ].map((field) => (
                                        <div key={field.key}>
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">{field.label}</label>
                                            <input
                                                type="text"
                                                value={(formData as any)?.[field.key] || ''}
                                                onChange={(e) => setFormData({ ...formData!, [field.key]: e.target.value })}
                                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                                placeholder={field.placeholder}
                                            />
                                        </div>
                                    ))}
                                    <div className="pt-4 flex gap-3">
                                        <button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="flex-1 py-3 bg-primary text-black rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {saving ? (
                                                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                            ) : (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            )}
                                            {saving ? 'Saving...' : 'Save Identities'}
                                        </button>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="px-6 py-3 bg-white/5 text-white rounded-xl font-bold hover:bg-white/10 transition-all border border-white/10"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <IdentityItem
                                        label="LeetCode"
                                        value={profile?.leetcodeUsername || null}
                                        platform="leetcode"
                                        stats={platformStats.leetcode}
                                        url={profile?.leetcodeUsername ? `https://leetcode.com/u/${profile.leetcodeUsername}` : undefined}
                                        icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13.483 0a1.374 1.374 0 0 0-.961.414l-11.71 11.59a1.374 1.374 0 0 0 0 1.956l11.71 11.59a1.374 1.374 0 0 0 1.922 0l1.71-1.69a1.374 1.374 0 0 0 0-1.956l-9.043-8.948h14.072A1.374 1.374 0 0 0 24 11.59V9.41a1.374 1.374 0 0 0-1.374-1.374H8.12l9.043-8.948a1.374 1.374 0 0 0 0-1.956L15.45.414A1.374 1.374 0 0 0 14.483 0z" /></svg>}
                                        onEdit={() => { setFormData(profile); setIsEditing(true); }}
                                    />
                                    <IdentityItem
                                        label="Codeforces"
                                        value={profile?.codeforcesUsername || null}
                                        platform="codeforces"
                                        stats={platformStats.codeforces}
                                        url={profile?.codeforcesUsername ? `https://codeforces.com/profile/${profile.codeforcesUsername}` : undefined}
                                        icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4.5 7.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zM0 12l2.25-3h19.5L24 12l-2.25 3H2.25L0 12z" /></svg>}
                                        onEdit={() => { setFormData(profile); setIsEditing(true); }}
                                    />
                                    <IdentityItem
                                        label="GitHub"
                                        value={profile?.githubUsername || null}
                                        platform="github"
                                        stats={platformStats.github}
                                        url={profile?.githubUsername ? `https://github.com/${profile.githubUsername}` : undefined}
                                        icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>}
                                        onEdit={() => { setFormData(profile); setIsEditing(true); }}
                                    />
                                    <IdentityItem
                                        label="LinkedIn"
                                        value={profile?.linkedinUrl ? (profile.fullName || 'LinkedIn Linked') : null}
                                        platform="linkedin"
                                        stats={platformStats.linkedin}
                                        url={profile?.linkedinUrl || undefined}
                                        icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>}
                                        onEdit={() => { setFormData(profile); setIsEditing(true); }}
                                    />
                                </>
                            )}
                        </div>

                        {profile?.ranking && (
                            <div className="flex flex-wrap items-center gap-4 mt-6">
                                <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/80 rounded-2xl border border-white/10 shadow-xl">
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Global Rank</span>
                                    <span className="text-xl font-black text-white">#{profile.ranking.rank}</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/80 rounded-2xl border border-white/10 shadow-xl">
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Global Score</span>
                                    <span className="text-xl font-black text-primary">{profile.ranking.score.toFixed(1)}</span>
                                </div>
                                <div className={`px-4 py-2 rounded-2xl border flex items-center gap-2 shadow-xl ${getTierStyle(profile.ranking.tier)}`}>
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Global Tier</span>
                                    <span className="text-sm font-black uppercase tracking-tighter">{profile.ranking.tier}</span>
                                </div>
                            </div>
                        )}

                        {profile?.ranking && (
                            <div className="mt-8 pt-6 border-t border-white/10">
                                <h4 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-widest">Global Score</h4>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-black text-yellow-500">{profile.ranking.breakdown.dsa.toFixed(0)}</div>
                                        <div className="text-[10px] text-gray-500 font-bold uppercase">DSA</div>
                                    </div>
                                    <div className="text-center border-x border-white/10">
                                        <div className="text-2xl font-black text-blue-500">{profile.ranking.breakdown.cp.toFixed(0)}</div>
                                        <div className="text-[10px] text-gray-500 font-bold uppercase">CP</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-black text-purple-500">{profile.ranking.breakdown.github.toFixed(0)}</div>
                                        <div className="text-[10px] text-gray-500 font-bold uppercase">GitHub</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {message && (
                            <div className={`mt-4 p-4 rounded-xl text-center font-bold ${message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                {message.text}
                            </div>
                        )}
                    </div>

                    {/* Projects Section */}
                    <div className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-white/10 flex flex-col">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                            <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                            Deployed Projects
                        </h3>

                        <div className="flex-1 space-y-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                            {((isEditing ? formData?.deployedProjects : profile?.deployedProjects) || []).map((proj, idx) => (
                                <ProjectItem
                                    key={`${proj.title}-${idx}`}
                                    proj={proj}
                                    idx={idx}
                                    isEditing={isEditing}
                                    onRemove={removeProject}
                                />
                            ))}

                            {(!profile?.deployedProjects?.length && !isEditing) && (
                                <div className="text-center py-12 text-gray-600">No projects added yet.</div>
                            )}
                        </div>

                        {isEditing && (
                            <div className="mt-6 pt-6 border-t border-white/10">
                                <h4 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-widest">Add New Project</h4>
                                <div className="space-y-3">
                                    <input
                                        placeholder="Project Title"
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-primary focus:outline-none"
                                        value={newProject.title}
                                        onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                                    />
                                    <input
                                        placeholder="Project URL (https://...)"
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-primary focus:outline-none"
                                        value={newProject.url}
                                        onChange={e => setNewProject({ ...newProject, url: e.target.value })}
                                    />
                                    <textarea
                                        placeholder="Short Description"
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-primary focus:outline-none resize-none h-20"
                                        value={newProject.description}
                                        onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                                    />
                                    <button
                                        onClick={addProject}
                                        className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-sm transition-colors"
                                    >
                                        Add Project to List
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </section >

                {/* Internal Progress Stats (Read Only) */}
                < section >
                    <h3 className="text-2xl font-black mb-8">StacXar Progress</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* DSA Card */}
                        <div className="p-8 bg-zinc-900 rounded-[2.5rem] border border-white/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-32 bg-yellow-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-yellow-500/10 transition-colors duration-700"></div>
                            <h4 className="text-xl font-bold text-white mb-2">DSA Mastery</h4>
                            <div className="text-4xl font-black text-yellow-500 mb-4">{Object.values(dsaState).filter(st => st.mastery === 3).length} / 20</div>
                            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(Object.values(dsaState).filter(st => st.mastery === 3).length / 20) * 100}%` }}
                                    className="bg-yellow-500 h-full"
                                ></motion.div>
                            </div>
                        </div>

                        {/* Web Dev Card */}
                        <div className="p-8 bg-zinc-900 rounded-[2.5rem] border border-white/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-blue-500/10 transition-colors duration-700"></div>
                            <h4 className="text-xl font-bold text-white mb-2">Web Dev Checkpoints</h4>
                            <div className="text-4xl font-black text-blue-500 mb-4">{Object.values(webDevState).filter(st => st.mastery === 3).length} / 15</div>
                            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(Object.values(webDevState).filter(st => st.mastery === 3).length / 15) * 100}%` }}
                                    className="bg-blue-500 h-full"
                                ></motion.div>
                            </div>
                        </div>

                        {/* App Dev Card */}
                        <div className="p-8 bg-zinc-900 rounded-[2.5rem] border border-white/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-primary/10 transition-colors duration-700"></div>
                            <h4 className="text-xl font-bold text-white mb-2">App Dev Mastery</h4>
                            <div className="text-4xl font-black text-primary mb-4">{Object.values(appDevState).filter(st => st.mastery === 3).length} / 15</div>
                            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(Object.values(appDevState).filter(st => st.mastery === 3).length / 15) * 100}%` }}
                                    className="bg-primary h-full"
                                ></motion.div>
                            </div>
                        </div>
                    </div>
                </section >

                <div className="block mt-8 text-center pb-8">

                </div>
            </main >
            <Footer />
        </div >
    );
};

export default Profile;
